# def create_health_ai_chain(llm, vector_store):
#     retriever = SelfQueryRetriever.from_llm(
#         llm=llm,
#         vectorstore=vector_store,
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
import logging
from os import environ

from get_google_docs import get_inital_prompt
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain_anthropic import ChatAnthropic

# separated files
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import OpenAI
from meta import document_content_description, metadata_field_info
from store import get_vector_store


def custom_history(entire_history: list, llm_name: str):
    if not entire_history or not isinstance(entire_history, list):
        logging.error("Invalid 'entire_history': Must be a non-empty list.")
        return []

    chat_history = []
    for msg in entire_history:
        if not isinstance(msg, dict):
            logging.warning('Skipping invalid message format: Not a dictionary.')
            continue

        msg_type = msg.get('type')
        message_content = msg.get('message')

        if msg_type == 'USER':
            if message_content is None:
                continue
            chat_history.append(HumanMessage(content=message_content))
        elif msg_type == 'AI':
            if not isinstance(message_content, dict) or llm_name not in message_content:
                continue
            chat_history.append(AIMessage(content=message_content[llm_name]))
        else:
            logging.warning(f'Skipping message with unrecognized type: {msg_type}.')

    return chat_history


def hist_aware_answers(llm_name, input_string, message_history):
    vector_store = get_vector_store()
    get_init_answer = get_inital_prompt()
    init_prompt = '' if get_init_answer is None else get_init_answer
    contextualize_q_system_prompt = """Given a chat history and the latest user question \
    which might reference context in the chat history, formulate a standalone question \
    which can be understood without the chat history. Do NOT answer the question, \
    just reformulate it if needed and otherwise return it as is."""
    # add in custom user info: -----------------------------
    # custom_istructions = get_custom_instructions_callable()
    # user_info = " "
    # if custom_istructions:
    #     user_info = f"""Here is some information about the user, including the user's name,
    #     their profile description and style instructions on how they want you to answer stylewise:
    #     User Name: {custom_istructions['name']}
    #     Style Instrctions: {custom_istructions['styleInstructions']}
    #     Personal Info: {custom_istructions['personalInstructions']}
    #     """

    agent_str = """
        You are a health AI agent equipped with access to diverse sources of health data,
        including research articles, nutritional information, medical archives, and more.
        Your task is to provide informed answers to user queries based on the available data.
        If you cannot find relevant information, simply state that you do not have enough data
        to answer accurately. write your response in markdown form and also add reference url
        so user can know from which source you are answering the questions.
        """

    context_str = """
        CONTEXT:
        {context}

        """
    # health_ai_template = f'{init_p,rompt}{agent_str}{user_info}{context_str}'
    health_ai_template = f'{init_prompt}{agent_str}{context_str}'
    chat_history = custom_history(message_history, llm_name)
    if llm_name == 'gpt-4':
        llm = OpenAI(temperature=0.2, api_key=environ.get('OPENAI_API_KEY'))
    elif llm_name == 'gemini':
        llm = ChatGoogleGenerativeAI(
            model='gemini-1.5-pro-latest', google_api_key=environ.get('GOOGLE_API_KEY')
        )
    elif llm_name == 'claude':
        llm = ChatAnthropic(
            model='claude-3-5-sonnet-20240620', api_key=environ.get('ANTHROPIC_API_KEY')
        )
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
    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)
    qa_prompt = ChatPromptTemplate.from_messages(
        [('system', health_ai_template), MessagesPlaceholder('chat_history'), ('human', '{input}')]
    )
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    msg = rag_chain.invoke({'input': input_string, 'chat_history': chat_history})
    return msg['answer']
