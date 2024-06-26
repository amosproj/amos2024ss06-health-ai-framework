import json
import os

from dotenv import load_dotenv
from langchain.embeddings import OpenAIEmbeddings
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores.chroma import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import OpenAI

load_dotenv()
openai_api_key = os.environ.get('OPENAI_API_KEY')


class CustomJSONLoader:
    def __init__(
        self, file_path, jq_schema='.', json_lines=True, text_content=False, metadata_keys=None
    ):
        self.file_path = file_path
        self.jq_schema = jq_schema
        self.json_lines = json_lines
        self.text_content = text_content
        self.metadata_keys = metadata_keys if metadata_keys is not None else []

    def load(self):
        docs = []
        with open(self.file_path, 'r', encoding='utf-8') as file:
            if self.json_lines:
                for line in file:
                    stripped_line = line.strip()
                    if stripped_line:
                        try:
                            doc = json.loads(stripped_line)
                            docs.append(doc)
                        except json.JSONDecodeError:
                            continue
            else:
                docs = json.load(file)
        return docs

    def extract_chunks_with_metadata(self, docs):
        chunks_with_metadata = []
        for doc in docs:
            if isinstance(doc, dict):
                self._extract_from_dict(doc, chunks_with_metadata)
        return chunks_with_metadata

    def _extract_from_dict(self, doc_dict, chunks_with_metadata):
        if 'content' in doc_dict:
            content = doc_dict['content']
            metadata = {key: doc_dict[key] for key in self.metadata_keys if key in doc_dict}
            if isinstance(content, list):
                content = ' '.join(content)
            chunks_with_metadata.append({'content': content, 'metadata': metadata})


class Retriever:
    def __init__(self):
        self.openai_api_key = os.environ.get('OPENAI_API_KEY')
        self.GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')

        default_embedding = OpenAIEmbeddings(openai_api_key=self.openai_api_key)
        default_llm = OpenAI(temperature=0.2)

        self.embedding_options = ['OpenAI', 'HuggingFace']
        self.llm_options = ['chatgpt', 'gemini']

        self.llm = default_llm
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        self.embedding_model = default_embedding

        self.preprompt = """You are a medical AI agent that tries to answer the user's
        questions as good as possible. You will receive useful
        information about the topic, that might help you give better answers.
        Here is the user's question: ---"""

    def which_llm(self):
        print(self.llm)

    def choose_llm(self, llm_name: str):
        if llm_name.lower() not in self.llm_options:
            print('Choose one of the available LLM names:')
            for i in self.llm_options:
                print(i)
            return

        if llm_name.lower() == 'chatgpt':
            self.llm = OpenAI(temperature=0.2)
            print('ChatGPT set as LLM')
        elif llm_name.lower() == 'gemini':
            self.llm = ChatGoogleGenerativeAI(model='gemini-pro')
            print('gemini-pro set as LLM')
        return

    def choose_embedding_model(self, embedding_fct: str):
        if embedding_fct not in self.embedding_options:
            print('Choose one of the available embedding models:')
            for i in self.embedding_options:
                print(i)
            return

        if embedding_fct == 'OpenAI':
            self.embedding_model = OpenAIEmbeddings()
            print('OpenAI-Embeddings set as embedding model')
        elif embedding_fct == 'HuggingFace':
            self.embedding_model = HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')
            print("HuggingFace 'all-MiniLM-L6-v2' set as embedding model")
        return

    def context_enrichment(self, query_text):
        chroma_db = Chroma(persist_directory='./chroma_db', embedding_function=self.embedding_model)
        return chroma_db._similarity_search_with_relevance_scores(query_text, k=2)

    def context_enriched_answer(self, query_text):
        results = self.context_enrichment(query_text)
        relevant_info = ''
        for result, score in results:
            doc_content = result.page_content
            metadata = result.metadata
            metadata_str = ', '.join([f'{key}: {value}' for key, value in metadata.items()])
            relevant_info += f'Content: {doc_content}\nMetadata: {metadata_str}\n\n'

        modified_prompt = (
            f'{self.preprompt}{query_text}---\n'
            f'Here is some relevant information:\n'
            f'***{relevant_info}***'
        )
        response = self.llm.predict(modified_prompt)
        print(f'{response}')
        return response

    def simple_response(self, query_text):
        response = self.llm.invoke(query_text)
        print(f'{response}')
        return response

    def load_and_process_documents(
        self, file_path, jq_schema, json_lines, text_content, metadata_keys
    ):
        loader = CustomJSONLoader(file_path, jq_schema, json_lines, text_content, metadata_keys)
        docs = loader.load()
        chunks_with_metadata = loader.extract_chunks_with_metadata(docs)

        document_chunks = []
        for chunk_with_metadata in chunks_with_metadata:
            content = chunk_with_metadata['content']
            metadata = chunk_with_metadata['metadata']

            if isinstance(content, str):
                split_chunks = self.text_splitter.split_text(content)
                for chunk in split_chunks:
                    document_chunks.append(Document(page_content=chunk, metadata=metadata))

        return document_chunks

    def advanced_prompt_engineering(self, query_text1, query_text2, document_chunks):
        embedding_model = self.embedding_model

        chroma_db = Chroma(persist_directory='./chroma_db', embedding_function=embedding_model)
        chroma_db.add_documents(documents=document_chunks)

        query_text = query_text1 + query_text2
        results = chroma_db._similarity_search_with_relevance_scores(query_text, k=2)

        relevant_info = ''
        for result, score in results:
            doc_content = result.page_content
            metadata = result.metadata
            metadata_str = ', '.join([f'{key}: {value}' for key, value in metadata.items()])
            relevant_info += f'Content: {doc_content}\nMetadata: {metadata_str}\n\n'

        context = (
            'You are a health consultant specializing in answering health related queries and'
            'providing comprehensive insights. '
            'You have access to various documents containing'
            ' information about the latest trends in the health industry, '
            'summarize the key points, and draw conclusions'
            'based on the provided information. Consider the broader implications '
            'while forming your conclusions.'
        )

        multi_step_reasoning = (
            '1. Read the provided statements carefully.\n'
            '2. Identify and list the key points mentioned by the person asking the question.\n'
            '3. Analyze these key points in the context of the available information.\n'
            '4. Draw well-reasoned conclusions based on your analysis.\n'
            '5. Provide a summary of your findings, highlighting the most critical insights.'
        )

        few_shot_examples = (
            'Example 1:\n'
            'Q: What did the CEO of TechCorp say about their new product launch?\n'
            'A: The CEO emphasized the innovative features of the new product,'
            'its competitive pricing, and its potential to capture significant market share.'
            'They also mentioned the strategic importance of this launch for'
            "the company's growth plans.\n\n"
            'Example 2:\n'
            "Q: What were the key takeaways from the CFO's statement at HealthInc?\n"
            "A: The CFO highlighted the company's strong financial performance, "
            'cost-cutting measures, and plans for future investments in technology'
            'to drive efficiency. They also discussed the challenges'
            'posed by recent market volatility and their strategies to mitigate risks.'
        )

        hypothetical_scenario = (
            'Imagine you are presenting your analysis to a group of doctors in a conference. '
            'Your goal is to provide a clear, concise,'
            'and insightful analysis that helps them understand'
            'the latest trends in the health industry and'
            'their potential impact on medical practices. '
        )

        modified_prompt = {
            'text': (
                f'{context}\n\n'
                f'{multi_step_reasoning}\n\n'
                f'{few_shot_examples}\n\n'
                f'{hypothetical_scenario}\n\n'
                f'Here is some relevant information:\n{relevant_info}\n\n'
                f'Now, based on the provided information and'
                f'your expertise, answer the following questions:\n'
                f'Q: {query_text1}\n'
                f'Q: {query_text2}'
            )
        }

        prompt_text = modified_prompt['text']
        response = self.llm.predict(prompt_text)
        print(f'Response generated from {self.llm.__class__.__name__} is:', response)
        return response


### Test:
retriever = Retriever()
retriever.choose_llm('chatgpt')

# Load and process documents
base_path = r'C:\Users\manik\Desktop\Projects\AMOS Project\amos2024ss06-health-ai-framework'
sub_path = r'src\backend\RAG\LangChain_Implementation\blog_data.json'
file_path = os.path.join(base_path, sub_path)

document_chunks = retriever.load_and_process_documents(
    file_path=file_path,
    jq_schema='.',
    json_lines=False,
    text_content='content',
    metadata_keys=['author', 'title', 'url'],
)

# Advanced prompt engineering
query_text1 = 'what did the executive at the Kellogs ad firm say?'
query_text2 = 'What can we conclude from this response?'
response = retriever.advanced_prompt_engineering(query_text1, query_text2, document_chunks)
