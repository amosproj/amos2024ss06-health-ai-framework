from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from meta import document_content_description, metadata_field_info


def create_health_ai_chain(llm, vector_store):
    retriever = SelfQueryRetriever.from_llm(
        llm=llm,
        vectorstore=vector_store,
        document_content_description=document_content_description,
        metadata_field_info=metadata_field_info,
        document_contents='',
    )
    health_ai_template = """
    You are a health AI agent equipped with access to diverse sources of health data,
    including research articles, nutritional information, medical archives, and more.
    Your task is to provide informed answers to user queries based on the available data.
    If you cannot find relevant information, simply state that you do not have enough data
    to answer accurately. write your response in markdown form and also add reference url
    so user can know from which source you are answering the questions.

    CONTEXT:
    {context}

    QUESTION: {question}

    YOUR ANSWER:
    """
    health_ai_prompt = ChatPromptTemplate.from_template(health_ai_template)
    chain = (
        {'context': retriever, 'question': RunnablePassthrough()}
        | health_ai_prompt
        | llm
        | StrOutputParser()
    )
    return chain
