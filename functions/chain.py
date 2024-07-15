from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from meta import document_content_description, metadata_field_info
from main import get_custom_instructions_callable
print("custom instruction: " + get_custom_instructions_callable())
def create_health_ai_chain(llm, vector_store):
    retriever = SelfQueryRetriever.from_llm(
        llm=llm,
        vectorstore=vector_store,
        document_content_description=document_content_description,
        metadata_field_info=metadata_field_info,
        document_contents='',
    )
    custom_istructions = get_custom_instructions_callable()
    print("custom instruction: " + get_custom_instructions_callable())
    health_ai_template = """
    You are a health AI agent equipped with access to diverse sources of health data,
    including research articles, nutritional information, medical archives, and more.
    Your task is to provide informed answers to user queries based on the available data.
    If you cannot find relevant information, simply state that you do not have enough data
    to answer accurately. write your response in markdown form and also add reference url
    so user can know from which source you are answering the questions.
    """
    user_info = " "
    if custom_istructions:
        user_info = f"""Here is some information about the user, including the user's name, 
        his profile description and his style instructions on how you should answer: 
        User Name: {custom_istructions['name']}
        Style Instrctions: {custom_istructions['styleInstructions']}
        Personal Info: {custom_istructions['personalInstructions']}
        """
    

    context_string ="""
    CONTEXT:
    {context}

    QUESTION: {question}

    YOUR ANSWER:
    """
    
    prompt_to_pass = health_ai_template + user_info + context_string

    health_ai_prompt = ChatPromptTemplate.from_template(prompt_to_pass)
    chain = (
        {'context': retriever, 'question': RunnablePassthrough()}
        | health_ai_prompt
        | llm
        | StrOutputParser()
    )
    return chain
