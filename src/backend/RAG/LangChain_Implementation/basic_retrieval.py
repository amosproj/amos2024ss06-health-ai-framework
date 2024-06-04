import json
import os

from langchain.embeddings import OpenAIEmbeddings
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.llms.openai import OpenAI
from langchain_community.vectorstores.chroma import Chroma


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


base_path = r'C:\Users\manik\Desktop\Projects\AMOS Project\amos2024ss06-health-ai-framework'
sub_path = r'src\backend\RAG\LangChain_Implementation\blog_data.json'
file_path = os.path.join(base_path, sub_path)

loader = CustomJSONLoader(
    file_path=file_path,
    jq_schema='.',
    json_lines=False,
    text_content='content',
    metadata_keys=['author', 'title', 'url'],
)

docs = loader.load()
chunks_with_metadata = loader.extract_chunks_with_metadata(docs)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

document_chunks = []
for chunk_with_metadata in chunks_with_metadata:
    content = chunk_with_metadata['content']
    metadata = chunk_with_metadata['metadata']

    if isinstance(content, str):
        split_chunks = text_splitter.split_text(content)
        for chunk in split_chunks:
            document_chunks.append(Document(page_content=chunk, metadata=metadata))

embedding_model = HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')
embedding_model = OpenAIEmbeddings()

embeddings = [embedding_model.embed_query(chunk) for chunk in split_chunks]

chroma_db = Chroma(persist_directory='./chroma_db', embedding_function=OpenAIEmbeddings())

all_doc_ids = chroma_db.from_documents(documents=document_chunks, embedding=OpenAIEmbeddings())
chroma_db.add_documents(documents=document_chunks)

# ridiculous linting rules - thanks:
query_text1 = 'what did the executive at the Kellogs ad firm say? '
query_text2 = 'What can we conclude from this response?'
query_text = query_text1 + query_text2

query_embedding = embedding_model.embed_query(query_text)

results = chroma_db._similarity_search_with_relevance_scores(query_text, k=2)

relevant_info = ''
for result, score in results:
    doc_content = result.page_content
    metadata = result.metadata
    metadata_str = ', '.join([f'{key}: {value}' for key, value in metadata.items()])
    relevant_info += f'Content: {doc_content}\nMetadata: {metadata_str}\n\n'

modified_prompt = {'text': f'{query_text}\n\nHere is some relevant information:\n{relevant_info}'}

prompt_text = modified_prompt['text']

llm = OpenAI(temperature=0.5)

response = llm.predict(prompt_text)

print('Response generated from LLM IS:', response)
