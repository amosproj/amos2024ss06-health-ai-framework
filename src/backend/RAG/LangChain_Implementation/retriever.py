import json
import os
import sys

from dotenv import load_dotenv

from astrapy import DataAPIClient
from astrapy.db import AstraDB

#from langchain.embeddings import OpenAIEmbeddings
#from langchain_community.embeddings import OpenAIEmbeddings
from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
#from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
#from langchain_community.llms.openai import OpenAI
from langchain_openai import OpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores.chroma import Chroma

load_dotenv()
openai_api_key = os.environ.get('OPENAI_API_KEY')

class Retriever:
    def __init__(
        self
    ):
        self.openai_api_key = os.environ.get('OPENAI_API_KEY')
        self.GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
        
        default_embedding = OpenAIEmbeddings(openai_api_key=self.openai_api_key)
        default_llm = OpenAI(temperature=0.2)
        
        self.embedding_options = ['OpenAI', 'HuggingFace']
        self.llm_options = ['chatgpt', 'gemini']
        
        self.llm = default_llm
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        self.embedding_model = default_embedding
        
        self.document_list = []
        
        ASTRA_DB_NAMESPACE = 'test'
        ASTRA_DB_COLLECTION = 'test_collection_2'
        client = DataAPIClient(os.environ.get('ASTRA_DB_TOKEN'))
        self.database = client.get_database(os.environ.get('ASTRA_DB_API_ENDPOINT'))
        
        self.db = AstraDB(
            token=os.getenv('ASTRA_DB_TOKEN'),
            api_endpoint=os.getenv('ASTRA_DB_API_ENDPOINT'),
            namespace=os.getenv(ASTRA_DB_NAMESPACE)
            )
        self.collection = self.db.collection(collection_name = ASTRA_DB_COLLECTION)
        
        self.preprompt = """You are a medical AI agent that tries to answer the user's 
        questions as good as possible. You will receive useful 
        information about the topic, that might help you give better answers. 
        Here is the user's question: ---"""
        
    # similarity search in AstraDB
    def astra_similarity_search(self, query:str):
        query_embedding = self.embedding_model.embed_query(query)
        
        sort = {'$vector': query_embedding}
        options = {'limit': 2}
        projection = {'content': 1, 'metadata': 1, '$vector': 1}

        document_list = self.collection.find(sort=sort, options=options, projection=projection)
        return document_list

    def manik_retrieval(self, query):
        document_chunks = []
        document_list = self.astra_similarity_search(query)
        for document in document_list['data']['documents']:
            content = document.get('content', '')
            metadata = document.get('metadata', {})
            document_chunks.append(Document(page_content=content, metadata=metadata))
            
        # Process documents with LangChain and generate response
        response = ''
        if document_chunks:
            relevant_info = ''
            for doc in document_chunks:
                relevant_info += f'Content: {doc.page_content}\nMetadata: {doc.metadata}\n\n'
                print(f'Content: {doc.page_content}\nMetadata: {doc.metadata}\n\n')
            context = (
                'You are a health consultant specializing in answering'
                'health-related queries and providing comprehensive insights. '
                'You have access to various documents containing'
                'information about the latest trends in the health industry, '
                'summarize the key points, and draw conclusions'
                'based on the provided information.'
            )

            #multi_step_reasoning = ('')
            #few_shot_examples = ('')
            #hypothetical_scenario = ('')

            modified_prompt = (
                f'{context}\n\n'
                #f'{multi_step_reasoning}\n\n'
                #f'{few_shot_examples}\n\n'
                #f'{hypothetical_scenario}\n\n'
                f'Here is some relevant information:\n{relevant_info}\n\n'
                f'Now, based on the provided information and your expertise'
                ', answer the following questions:\n'
                f'Q: What are the protective effects mentioned?\n'
                f'Q: What can we conclude from this information?'
            )
            
            response = self.llm.predict(modified_prompt)
            return response
    
    def which_llm(self):
        print(self.llm)
    
    def choose_llm(self, llm_name:str):
        if llm_name.lower() not in self.llm_options:
            print("Choose one of the available LLM names:")
            for i in self.llm_options:
                print(i)
            return
        
        if llm_name.lower() == 'ChatGPT'.lower():
            self.llm = OpenAI(temperature=0.2)
            print("ChatGPT set as LLM")
        elif llm_name.lower() == 'Gemini'.lower():
            self.llm = ChatGoogleGenerativeAI(model="gemini-pro", )
            print("gemini-pro set as LLM")
        return
    
    def choose_embedding_model(self, embedding_fct:str):
        if embedding_fct not in self.embedding_options:
            print("Choose one of the available embedding models:")
            for i in self.embedding_options:
                print(i)
            return
        
        if embedding_fct == 'OpenAI':
            self.embedding_model = OpenAIEmbeddings()
            print('OpenAI-Embeddings set as embedding model')
        elif embedding_fct == 'HuggingFace':
            HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')
            print("HuggingFace 'all-MiniLM-L6-v2' set as embedding model")
        return
    
    def chroma_similarity_search(self, query_text):
        embedded_query = self.embedding_model.embed_query(query_text)
        chroma_db = Chroma(persist_directory='./chroma_db', embedding_function=self.embedding_model)

        return chroma_db._similarity_search_with_relevance_scores(embedded_query, k=2)
        
    
    # def context_enriched_answer(self, query_text): 
    #     results = self.chroma_similarity_search(query_text)
    #     relevant_info = ''
    #     for result, score in results:
    #         doc_content = result.page_content
    #         metadata = result.metadata
    #         metadata_str = ', '.join([f'{key}: {value}' for key, value in metadata.items()])
    #         relevant_info += f'Content: {doc_content}\nMetadata: {metadata_str}\n\n'

    #     modified_prompt = f'{self.preprompt}{query_text}---\nHere is some relevant information:\n***{relevant_info}***'
    #     response = self.llm.predict(modified_prompt)
    #     print(f'{response}')
    #     return response
    
    def simple_response(self, query_text):
        response = self.llm.invoke(query_text)
        print(f'{response}')
        return response
    
### Test:
#retriever = Retriever()
#test_query = "How many corners does a heptagon have?"

#
#retriever.which_llm()
#retriever.choose_llm('gemini')
#retriever.which_llm()

#complex_query = "What should I eat for lunch if have diabetes?"
#retriever.manik_retrieval(complex_query)
#retriever.simple_response(test_query)




def main():
    input_string = sys.argv[1]
    retriever = Retriever()
    output_string = retriever.simple_response(input_string)
    print(output_string)

# def process_input(input_string):
#     # Here you can process the input string as needed
#     return f"Processed: {input_string}"

if __name__ == "__main__":
    main()
