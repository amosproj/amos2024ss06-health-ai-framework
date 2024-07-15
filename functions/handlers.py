from os import environ
from firebase_admin import firestore
from chain import create_health_ai_chain
from config import initialize_firebase
from langchain_openai import ChatOpenAI
from store import get_vector_store

initialize_firebase()

def get_custom_instructions(user_id):
    db = firestore.client()
    user_doc = db.collection('users').document(user_id).get()
    
    if user_doc.exists:
        user_data = user_doc.to_dict()
        instructions = {
            "name": user_data.get('name', ''),
            "styleInstructions": user_data.get('styleInstructions', ''),
            "personalInstructions": user_data.get('personalInstructions', '')
        }
        return instructions
    return None

def get_health_ai_response(question, llm):
    vector_store = get_vector_store()
    chain = create_health_ai_chain(llm, vector_store)
    response = chain.invoke(question)
    return response

def get_response_from_llm(query, llm):
    models = {'gpt-4': {}, 'gpt-3.5-turbo-instruct': {'name': 'gpt-3.5-turbo-instruct'}}
    if llm in models:
        llm_model = ChatOpenAI(api_key=environ.get('OPEN_AI_API_KEY'), temperature=0, **models[llm])
        response = get_health_ai_response(query, llm_model)
        return response
    else:
        return 'Model Not Found'