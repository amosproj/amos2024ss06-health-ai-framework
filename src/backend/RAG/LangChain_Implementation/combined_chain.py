
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from test_meta import document_content_description, metadata_field_info
# added by Jan:
from langchain_core.messages import AIMessage, HumanMessage
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_anthropic import ChatAnthropic
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
# -----
from get_google_docs import get_inital_prompt

from dotenv import load_dotenv
from os import environ

# separated files
from langchain_astradb import AstraDBVectorStore
from langchain_openai import OpenAI, OpenAIEmbeddings
# from store import get_vector_store # <- instead this 


def get_vector_store():
    embeddings = OpenAIEmbeddings(api_key=environ.get('OPENAI_API_KEY'))
    astra_vector_store = AstraDBVectorStore(
        embedding=embeddings,
        collection_name=environ.get('ASTRA_DB_COLLECTION'),
        api_endpoint=environ.get('ASTRA_DB_API_ENDPOINT'),
        token=environ.get('ASTRA_DB_APPLICATION_TOKEN'),
        namespace=environ.get('ASTRA_DB_NAMESPACE'),
    )
    return astra_vector_store

# Compartmented above - new functions below


# def get_session_history(session_id: str) -> BaseChatMessageHistory:
#     if session_id not in store:
#         store[session_id] = ChatMessageHistory()
#     return store[session_id]

def custom_history(entire_history: list, llm_name: str):
    chat_history = []
    for msg in entire_history:
        if 'user' in msg:
            chat_history.extend([HumanMessage(content=msg['user'])])
        if llm_name in msg:
            chat_history.extend([AIMessage(content=msg[llm_name])])
    return chat_history

# def create_health_ai_chain(llm):
#     retriever = SelfQueryRetriever.from_llm(
#         llm=llm,
#         vectorstore=get_vector_store(),
#         document_content_description=document_content_description,
#         metadata_field_info=metadata_field_info,
#         document_contents='',
#     )
#     health_ai_template = """
#     You are a health AI agent equipped with access to diverse sources of health data,
#     including research articles, nutritional information, medical archives, and more.
#     Your task is to provide informed answers to user queries based on the available data.
#     If you cannot find relevant information, simply state that you do not have enough data
#     to answer accurately. write your response in markdown form and also add reference url
#     so user can know from which source you are answering the questions.

#     CONTEXT:
#     {context}

#     QUESTION: {question}

#     YOUR ANSWER:
#     """
#     health_ai_prompt = ChatPromptTemplate.from_template(health_ai_template)
#     chain = (
#         {'context': retriever, 'question': RunnablePassthrough()}
#         | health_ai_prompt
#         | llm
#         | StrOutputParser()
#     )
#     return chain



def hist_aware_answers(llm_list, input_string, message_history):
    vector_store = get_vector_store()
    init_prompt = get_inital_prompt()
    
    contextualize_q_system_prompt = """Given a chat history and the latest user question \
    which might reference context in the chat history, formulate a standalone question \
    which can be understood without the chat history. Do NOT answer the question, \
    just reformulate it if needed and otherwise return it as is."""

    context_str =  """ You are a health AI agent equipped with access to diverse sources of health data,
        including research articles, nutritional information, medical archives, and more.
        Your task is to provide informed answers to user queries based on the available data.
        If you cannot find relevant information, simply state that you do not have enough data
        to answer accurately. write your response in markdown form and also add reference url
        so user can know from which source you are answering the questions.

        CONTEXT:
        {context}
        """

    health_ai_template = ""  + f"{init_prompt}" + context_str + ""    
    
    qa_prompt = ChatPromptTemplate.from_template(health_ai_template)

    answers = {}
    for _llm in llm_list:
        # print(_llm)
        chat_history = custom_history(message_history, _llm)
        if _llm == 'gpt-4':
            openai_api_key = environ.get('OPENAI_API_KEY')
            llm = OpenAI(temperature=0.2)
        elif _llm == 'gemini':
            google_api_key = environ.get('GOOGLE_API_KEY')
            llm = ChatGoogleGenerativeAI(model='gemini-1.5-pro-latest')
        elif _llm == 'claude':
            anthropic_api_key = environ.get('ANTHROPIC_API_KEY')
            llm = ChatAnthropic(model='claude-3-5-sonnet-20240620')
            
        retriever = SelfQueryRetriever.from_llm(
            llm=llm,
            vectorstore=vector_store,
            document_content_description=document_content_description,
            metadata_field_info=metadata_field_info,
            document_contents='',
        )
        
        contextualize_q_prompt = ChatPromptTemplate.from_messages(
            [
                ('system', contextualize_q_system_prompt),
                MessagesPlaceholder('chat_history'),
                ('human', '{input}'),
            ]
        )
        history_aware_retriever = create_history_aware_retriever(
            llm, retriever, contextualize_q_prompt
        )

        qa_prompt = ChatPromptTemplate.from_messages(
            [
                ('system', health_ai_template),
                MessagesPlaceholder('chat_history'),
                ('human', '{input}'),
            ]
        )
        
        # store = {}
        # runnable_with_history = RunnableWithMessageHistory(
        #     history_aware_retriever,
        #     get_session_history,
        #     input_messages_key="input",
        #     history_messages_key="chat_history",
        #     output_messages_key="answer"
        # )
        
        question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

        # chain = (
        #     {
        #         'context': history_aware_retriever, 
        #         'input': RunnablePassthrough(),
        #         # 'chat_history': lambda x: chat_history  # Add this line
        #     }
        #     | question_answer_chain
        #     | llm
        # )
        
        rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
        msg = rag_chain.invoke({'input': input_string, 'chat_history': chat_history})        

        answers[_llm] = msg['answer']


    return answers



load_dotenv()
test_question = "Give me some good recipies?"
test_history = [
        {'user': 'I like salad.'},
        {'gpt-4': 'Salad healthy.', 'gemini': 'Burger better, more protein.',
        'claude': 'Go running.' }
    ]
llms = ['gpt-4', 'gemini', 'claude']
test_answer = hist_aware_answers(llms, test_question, test_history)
print(test_answer)