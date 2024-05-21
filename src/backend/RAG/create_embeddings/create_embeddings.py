import os
import uuid
from langchain.embeddings import (
  HuggingFaceBgeEmbeddings,
)  # imports for open source modules:
from langchain_community.embeddings import (
  HuggingFaceEmbeddings,
)  # for alternative using only LangChain syntax:

# from sentence_transformers import SentenceTransformer
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

# free local vector store:
import chromadb

""" imports for modules that need API keys: """
# from langchain.embeddings.openai import OpenAIEmbeddings

# from langchain.embeddings import VertexAIEmbeddings
# from langchain_google_genai import GoogleGenerativeAIEmbeddings

# AstraDB - vector store:
# from langchain_community.storage import AstraDBStore


"""
Open source modules:
"""


class HFembeddings:
  def __init__(self) -> None:
    self.model_name = 'BAAI/bge-base-en-v1.5'
    self.model_kwargs = {'device': 'cpu'}
    self.encode_kwargs = {'normalize_embeddings': True}

    self.hf = HuggingFaceBgeEmbeddings(
      model_name=self.model_name,
      model_kwargs=self.model_kwargs,
      encode_kwargs=self.encode_kwargs,
    )

  def embed_text(self, text):
    return self.hf.embed_documents(text)

  def embed_text_list(self, text_list):
    return [self.hf.embed_documents(text) for text in text_list]


# alternative implementation using only LangChain native syntax:
def hf_embed_text_list(text_list):
  embeddings = HuggingFaceEmbeddings()
  return [embeddings.embed_documents(text) for text in text_list]


def hf_embed_text(text):
  embeddings = HuggingFaceEmbeddings()
  return embeddings.embed_documents(text)


# Chroma DB
def get_local_chroma():  # name="local_chromaDB"):
  storage_path = 'storage'  # os.getenv('STORAGE_PATH')
  if not os.path.exists(storage_path):
    os.mkdir(storage_path)
  return chromadb.PersistentClient(path=storage_path)  # Client
  # return client.get_or_create_collection(name=name)


def prepare_entry(entry: dict):
  if 'document' not in entry:
    print(
      'Cannot add embedding: There is no document to embed. ',
      'If there is, check if it is saved under correct value name.',
    )
    return

  if '_id' not in entry:
    entry['_id'] = str(uuid.uuid4())
  if entry['_id'] == '':
    entry['_id'] = str(uuid.uuid4())

  if 'metadatas' not in entry:
    entry['metadatas'] = {}

  # Chroma would actually have its own embedding function which
  # could be used alternatively
  # use embedding function - currently HuggingFace

  return entry


def chroma_add_entry_wth_embedding(entry: dict, collection):
  # embedding = hf.embed_text(entry['document'])
  collection.add(
    ids=[str(entry['_id'])],
    documents=[entry['document']],
    # embeddings=[embedding],
    metadatas=[entry['metadatas']],
  )
  return  # collection


"""
Modules with need of API tokens:
"""

# OpenAI:
# api_key = os.environ.get('OPENAI_API')
# embeddings = OpenAIEmbeddings(model="text-embedding-ada-002", openai_api_key=api_key)
"""
def hf_embed_text_list(text_list):
    embeddings = OpenAIEmbeddings(model="text-embedding-ada-002", openai_api_key=api_key)
    return [embeddings.embed_documents(text) for text in text_list]

def hf_embed_text(text):
    embeddings = OpenAIEmbeddings(model="text-embedding-ada-002", openai_api_key=api_key)
    return embeddings.embed_documents(text)
"""


# Google
# embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
# vector = embeddings.embed_query("hello, world!")
"""
def gg_embed_text_list(text_list):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    return [embeddings.embed_documents(text) for text in text_list]

def gg_embed_text(text):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    return embeddings.embed_documents(text)
"""

# Google Vertex:
# vertex_embeddings = VertexAIEmbeddings(model_name="textembedding-gecko@003")
# vector = vertex_embeddings.embed_query("hello, world!")
"""
def vx_embed_text_list(text_list):
    embeddings = VertexAIEmbeddings(model="models/embedding-001")
    return [embeddings.embed_documents(text) for text in text_list]

def vx_embed_text(text):
    embeddings = VertexAIEmbeddings(model="models/embedding-001")
    return embeddings.embed_documents(text)
"""

# Storing in AstraDB:
"""
ASTRA_DB_APPLICATION_TOKEN = os.environ.get("ASTRA_DB_APPLICATION_TOKEN")
ASTRA_DB_API_ENDPOINT = os.environ.get("ASTRA_DB_API_ENDPOINT")
# ASTRA_DB_KEYSPACE = os.environ.get("ASTRA_DB_KEYSPACE")

embedding = hf # use hf for test # OpenAIEmbeddings()
vstore = AstraDBVectorStore(
    embedding=embedding,
    #namespace=ASTRA_DB_KEYSPACE,
    collection_name="test",
    token=os.environ["ASTRA_DB_APPLICATION_TOKEN"],
    api_endpoint=os.environ["ASTRA_DB_API_ENDPOINT"],
)
"""
"""
# Testing AstraDB:
philo_dataset = load_dataset("datastax/philosopher-quotes")["train"]
print("An example entry:")
print(philo_dataset[16])
docs = []
for entry in philo_dataset:
    metadata = {"author": entry["author"]}
    if entry["tags"]:
        # Add metadata tags to the metadata dictionary
        for tag in entry["tags"].split(";"):
            metadata[tag] = "y"
    # Add a LangChain document with the quote and metadata tags
    doc = Document(page_content=entry["quote"], metadata=metadata)
    docs.append(doc)
"""


""" main: """
if __name__ == '__main__':
  test_text = 'this is a text to embed'
  test_entry = {
    '_id': 'id1',  # str(uuid.uuid4()),
    'document': test_text,
    'metadatas': {'test_key': 'test_value'},
  }
  test_entry2 = {
    '_id': 'id2',  # str(uuid.uuid4()),
    'document': 'more text for the test',
    'metadatas': {'test_key': 'test_value'},
  }
  hf = HFembeddings()
  # test_embedding = hf_embed_text(test_text)

  client = get_local_chroma()  # chromadb.Client()
  collection = client.get_or_create_collection(
    name='local_chroma',
    embedding_function=SentenceTransformerEmbeddingFunction(
      model_name='all-MiniLM-L6-v2'
    ),
  )
  # chroma_add_entry_wth_embedding(prepare_entry(test_entry), collection)

  # collection = client.create_collection(name="personal_collection")
  entry = prepare_entry(test_entry)

  embedding = hf.embed_text(test_entry['document'])  # hf_embed_text(entry['document'])
  embedding2 = hf.embed_text(test_entry2['document'])  # hf_embed_text(entry['document'])

  collections = client.list_collections()
  print(collections)

  collection.add(
    ids=[test_entry['_id'], test_entry2['_id']],
    documents=[test_entry['document'], test_entry2['document']],
    # embeddings=[embedding, embedding2],
    metadatas=[test_entry['metadatas'], test_entry2['metadatas']],
  )

  print('collection count')
  print(collection.count())

  results = collection.query(query_texts=['This is a test query'], n_results=2)
  print(results)

  # uncomment for demo
  # print(collection.peek())
