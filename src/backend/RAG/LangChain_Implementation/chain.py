import json
import os
import sys

from dotenv import load_dotenv
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_anthropic import ChatAnthropic
from langchain_astradb import AstraDBVectorStore
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI

# from langchain.embeddings import OpenAIEmbeddings
# from langchain_community.embeddings import OpenAIEmbeddings
# from langchain_community.embeddings import HuggingFaceEmbeddings
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.llms.openai import OpenAI
from langchain_openai import OpenAI, OpenAIEmbeddings

"""
Script takes in args:
0) list of LLMs with which to retrieve e.g. ['gpt-4', 'gemini', 'mistral']
1) input string
2) chat history in following shape [
    {'gpt-4': "Hello, how can I help you?"},
    {'user': "What do prisons and plants have in common?"}
]
"""


def custom_history(entire_history: list, llm_name: str):
    chat_history = []
    for msg in entire_history:
        if 'user' in msg:
            chat_history.extend([HumanMessage(content=msg['user'])])
        if llm_name in msg:
            chat_history.extend([AIMessage(content=msg[llm_name])])
    return chat_history


def main():
    if len(sys.argv) < 3:
        print("""Error: Please provide:
              1) [list of LLM models to use]
              (['gpt-4', 'gemini', 'claude'])
              2) 'input string'
              3) [{chat history}] in the following shape:
              [{'gpt-4': "Hello, how can I help you?"},
              {'user': "What do prisons and plants have in common?"}
              etc.]""")

    # Arguments
    llm_list = sys.argv[1]
    llm_list = list(llm_list.replace('[', '').replace(']', '').replace("'", '').split(','))
    if not llm_list:
        llm_list = ['gpt-4']
    # print(llm_list)
    input_string = sys.argv[2]
    # print(input_string)
    message_history = sys.argv[3]
    # print(message_history)
    message_history = message_history.split(';;')
    # print(message_history)
    message_history = [json.loads(substring.replace("'", '"')) for substring in message_history]
    # print(message_history)

    load_dotenv()

    # to be put into seperate function in order to invoke LLMs seperately
    openai_api_key = os.environ.get('OPENAI_API_KEY')
    # google_api_key = os.environ.get('GOOGLE_API_KEY')
    # anthropic_api_key = os.environ.get('ANTHROPIC_API_KEY')

    # test_llm_list = ['gpt-4']
    # llm_list = test_llm_list
    # test_history = [
    #     {'gpt-4': 'Hello, how can I help you?', 'gemini': 'Hello, how can I help you?'},
    #     {'user': 'What do prisons and plants have in common?'},
    #     {'gpt-4': 'They both have cell walls.', 'gemini': 'They have cell walls.'},
    # ]
    # message_history = test_history

    # test_query = 'Ah, true. Thanks. What else do they have in common?'
    # test_query = "How many corners does a heptagon have?"
    # input_string = test_query
    # test_follow_up = "How does one call a polygon with two more corners?"

    # AstraDB Section
    astra_db_api_endpoint = os.environ.get('ASTRA_DB_API_ENDPOINT')
    astra_db_application_token = os.environ.get('ASTRA_DB_APPLICATION_TOKEN')
    astra_db_namespace = 'test'
    astra_db_collection = 'test_collection_2'

    # LangChain Docs: -------------------------
    vstore = AstraDBVectorStore(
        embedding=OpenAIEmbeddings(openai_api_key=openai_api_key),
        collection_name=astra_db_collection,
        api_endpoint=astra_db_api_endpoint,
        token=astra_db_application_token,
        namespace=astra_db_namespace,
    )
    # ------------------------------------------

    # For test purposes: -----------------------
    # import bs4
    # from langchain_chroma import Chroma
    # from langchain_community.document_loaders import WebBaseLoader

    # loader = WebBaseLoader(
    # web_paths=("https://lilianweng.github.io/posts/2023-06-23-agent/",),
    # bs_kwargs=dict(
    #     parse_only=bs4.SoupStrainer(
    #         class_=("post-content", "post-title", "post-header")
    #     )
    # ),
    # )
    # docs = loader.load()

    # text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    # splits = text_splitter.split_documents(docs)
    # vectorstore = Chroma.from_documents(documents=splits, embedding=OpenAIEmbeddings())
    # retriever = vectorstore.as_retriever()
    # # test end ----------------------------------

    retriever = vstore.as_retriever(search_kwargs={'k': 3})

    contextualize_q_system_prompt = """Given a chat history and the latest user question \
    which might reference context in the chat history, formulate a standalone question \
    which can be understood without the chat history. Do NOT answer the question, \
    just reformulate it if needed and otherwise return it as is."""

    qa_system_prompt = """You are an assistant for question-answering tasks. \
    Use the following pieces of retrieved context to answer the question. \
    If you don't know the answer, just say that you don't know. \
    Use three sentences maximum and keep the answer concise.\

    {context}"""

    answers = {}
    for _llm in llm_list:
        # print(_llm)
        chat_history = custom_history(message_history, _llm)
        if _llm == 'gpt-4':
            llm = OpenAI(temperature=0.2)
        elif _llm == 'gemini':
            llm = ChatGoogleGenerativeAI(model='gemini-1.5-pro-latest')
        elif _llm == 'claude':
            llm = ChatAnthropic(model_name='claude-3-opus-20240229')

        print(chat_history)
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
                ('system', qa_system_prompt),
                MessagesPlaceholder('chat_history'),
                ('human', '{input}'),
            ]
        )
        question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
        ### Answer question ###
        rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
        msg = rag_chain.invoke({'input': input_string, 'chat_history': chat_history})
        answers[_llm] = msg['answer']
        print(msg['answer'])
    # print(answers)

    # chat_history.extend([HumanMessage(content=input_string), AIMessage(content=msg_1["answer"])])
    # print(msg_1['input'])
    # print(msg_1['answer'])
    # print(chat_history)
    # msg_2 = rag_chain.invoke({"input": test_follow_up, "chat_history": chat_history})
    # chat_history.extend([HumanMessage(content=test_follow_up),
    # AIMessage(content=msg_2["answer"])])
    # print(msg_2['input'])
    # print(msg_2['answer'])
    # print(chat_history)
    return answers


if __name__ == '__main__':
    main()
