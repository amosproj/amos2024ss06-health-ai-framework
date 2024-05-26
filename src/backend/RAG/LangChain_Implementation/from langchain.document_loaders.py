from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

# from langchain.schema import text
import json
import os


class CustomJSONLoader:
  def __init__(
    self,
    file_path,
    jq_schema='.',
    json_lines=True,
    text_content=False,
    metadata_keys=None,
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
        # buffer = ""
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

  """def extract_chunks_with_metadata(self, docs):
        chunks_with_metadata = []
        for doc in docs:
            for doc_dict in doc:
                if "content" in doc_dict:
                    content = doc["content"]
                    metadata = {
                        key: doc[key] for key in self.metadata_keys if key in doc
                    }
                    if isinstance(content, list):
                        content = " ".join(content)
                chunks_with_metadata.append({"content": content, "metadata": metadata})
        return chunks_with_metadata"""


base_path = (
  r'C:\Users\manik\Desktop\Projects\AMOS Project\amos2024ss06-health-ai-framework'
)
sub_path = r'src\backend\RAG\LangChain_Implementation\blog_data.json'
file_path = os.path.join(base_path, sub_path)
# Initialize the loader and load the JSON data
loader = CustomJSONLoader(
  file_path=file_path,
  jq_schema='.',
  json_lines=True,
  text_content='content',
  metadata_keys=['author', 'title', 'url'],
)


docs = loader.load()

# Extract text from the JSON documents
chunks_with_metadata = loader.extract_chunks_with_metadata(docs)

# text_data = loader.extract_text_from_json(docs)
# if not text_data:
# print("No text extracted from JSON documents. Exiting.")
# exit()

"""combined_text = ""
for chunk_with_metadata in chunks_with_metadata:
    content = chunk_with_metadata["content"]
    combined_text += content
# Initialize RecursiveCharacterTextSplitter
"""
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

document_chunks = []
for chunk_with_metadata in chunks_with_metadata:
  content = chunk_with_metadata['content']
  metadata = chunk_with_metadata['metadata']
  if isinstance(content, str):
    split_chunks = text_splitter.split_text(content)
    for chunk in split_chunks:
      document_chunks.append(Document(page_content=chunk, metadata=metadata))

# chunks_metadata = text_splitter.split_text(combined_text)
print(f'Total document chunks created: {len(document_chunks)}')
for doc in document_chunks:
  print(f'Chunk: {doc.page_content}')
  print(f'Metadata: {doc.metadata}')

# Split text into chunks
# chunks = text_splitter.split_text(
# text_data
# )  # this returns the texts as lists which is splitted into multiple components
# document_chunks = [Document(page_content=chunk) for chunk in chunks]

# print("Chunks =", chunks)

"""
# embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
embedding_model = OpenAIEmbeddings()

# Compute embeddings
# embeddings = [embedding_model.embed_query(chunk) for chunk in chunks]

# Initialize Chroma Vector Store
chroma_db = Chroma(
    persist_directory="./chroma_db", embedding_function=OpenAIEmbeddings()
)

all_doc_ids = chroma_db.from_documents(
    documents=document_chunks, embedding=OpenAIEmbeddings()
)
chroma_db.add_documents(documents=document_chunks)

# doc_ids = chroma_db.get_document_ids()

print("Documents and embeddings stored successfully in ChromaDB.")


#query_text = "what did the executive at the Kellogs ad firm said ?
#What can we conclude from this response ?"

query_embedding = embedding_model.embed_query(query_text)

results = chroma_db._similarity_search_with_relevance_scores(
    query_text, k=2
)  # Adjust n_results as needed

relevant_info = ""
for result, score in results:
    doc_content = result.page_content
    relevant_info += doc_content + "\n"

modified_prompt = {
    "text": f"{query_text}\n\nHere is some relevant information:\n{relevant_info}"
}

prompt_text = modified_prompt["text"]

# print("modified prompt =", modified_prompt)

llm = OpenAI(temperature=0.5)
# chain = LLMChain(llm=llm, prompt=modified_prompt)
# response = llm.generate_text(prompt=modified_prompt)
# print("Generated Response:")
# print(response)

print("prompt =", prompt_text)
response = llm.predict(prompt_text)

print("Response generated from LLM IS:", response)
"""

"""for result, score in results:
    doc_content = result.page_content
    print(f"Document Content: {doc_content}")
    print(f"Relevance Score: {score}")
    print("\n" + "=" * 80 + "\n")"""
