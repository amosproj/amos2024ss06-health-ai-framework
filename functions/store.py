from os import environ

from langchain_astradb import AstraDBVectorStore
from langchain_openai import OpenAIEmbeddings


def get_vector_store():
    embeddings = OpenAIEmbeddings(api_key=environ.get('OPEN_AI_API_KEY'))
    astra_vector_store = AstraDBVectorStore(
        embedding=embeddings,
        collection_name=environ.get('ASTRA_DB_COLLECTION_NAME'),
        api_endpoint=environ.get('ASTRA_DB_URL'),
        token=environ.get('ASTRA_DB_TOKEN'),
        namespace=environ.get('ASTRA_DB_NAMESPACE'),
    )
    return astra_vector_store
