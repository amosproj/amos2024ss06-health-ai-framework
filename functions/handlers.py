from os import environ

from chain import create_health_ai_chain
from config import initialize_firebase
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from store import get_vector_store

initialize_firebase()


def get_health_ai_response(question, llm):
    vector_store = get_vector_store()
    chain = create_health_ai_chain(llm, vector_store)
    response = chain.invoke(question)
    return response


def get_response_from_llm(query, llm):
    if llm == 'gpt-4' or llm == 'gpt-3.5-turbo-instruct':
        llm_model = ChatOpenAI(api_key=environ.get('OPEN_AI_API_KEY'), temperature=0, model=llm)
        response = get_health_ai_response(query, llm_model)
    elif llm == 'gemini':
        llm_model = ChatGoogleGenerativeAI(
            model='gemini-1.5-pro-latest', google_api_key=environ.get('GOOGLE_API_KEY')
        )
        response = get_health_ai_response(query, llm_model)
    elif llm == 'claude':
        llm_model = ChatAnthropic(
            model='claude-3-5-sonnet-20240620', api_key=environ.get('ANTHROPIC_API_KEY')
        )
        response = get_health_ai_response(query, llm_model)
    else:
        response = 'Model Not Found'
    return response
