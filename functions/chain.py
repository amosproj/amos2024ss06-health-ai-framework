import concurrent.futures
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


def custom_history(entire_history: list, llm_name: str):
    chat_history = []
    for msg in entire_history:
        if 'user' in msg:
            chat_history.extend([HumanMessage(content=msg['user'])])
        if llm_name in msg:
            chat_history.extend([AIMessage(content=msg[llm_name])])
    return chat_history


def process_llm(
    llm_name,
    input_string,
    message_history,
    vector_store,
    contextualize_q_system_prompt,
    health_ai_template,
):
    chat_history = custom_history(message_history, llm_name)

    if llm_name == 'gpt-4':
        environ.get('OPENAI_API_KEY')
        llm = OpenAI(temperature=0.2)
    elif llm_name == 'gemini':
        environ.get('GOOGLE_API_KEY')
        llm = ChatGoogleGenerativeAI(model='gemini-1.5-pro-latest')
    elif llm_name == 'claude':
        environ.get('ANTHROPIC_API_KEY')
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
    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

    qa_prompt = ChatPromptTemplate.from_messages(
        [('system', health_ai_template), MessagesPlaceholder('chat_history'), ('human', '{input}')]
    )

    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    msg = rag_chain.invoke({'input': input_string, 'chat_history': chat_history})

    return llm_name, msg['answer']


def hist_aware_answers(llm_list, input_string, message_history):
    answers = {}
    vector_store = get_vector_store()

    get_init_answer = get_inital_prompt()
    init_prompt = '' if get_init_answer is None else get_init_answer

    contextualize_q_system_prompt = """Given a chat history and the latest user question \
    which might reference context in the chat history, formulate a standalone question \
    which can be understood without the chat history. Do NOT answer the question, \
    just reformulate it if needed and otherwise return it as is."""

    context_str = """ You are a health AI agent equipped with
        access to diverse sources of health data,
        including research articles, nutritional information, medical archives, and more.
        Your task is to provide informed answers to user queries based on the available data.
        If you cannot find relevant information, simply state that you do not have enough data
        to answer accurately. write your response in markdown form and also add reference url
        so user can know from which source you are answering the questions.

        CONTEXT:
        {context}
        """

    health_ai_template = f'{init_prompt}{context_str}'

    # Parallel processing
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_llm = {
            executor.submit(
                process_llm,
                llm,
                input_string,
                message_history,
                vector_store,
                contextualize_q_system_prompt,
                health_ai_template,
            ): llm
            for llm in llm_list
        }
        for future in concurrent.futures.as_completed(future_to_llm):
            llm_name, answer = future.result()
            answers[llm_name] = answer

    return answers
