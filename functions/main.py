from json import dumps

from firebase_admin import initialize_app
from firebase_functions import https_fn, options
from langchain.chains.query_constructor.base import AttributeInfo
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain_astradb import AstraDBVectorStore
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

initialize_app()


# Initialize embeddings and vector store
def initialize_vector_store(token):
    embeddings = OpenAIEmbeddings(api_key='')
    return AstraDBVectorStore(
        embedding=embeddings,
        collection_name='test_collection_2',
        api_endpoint='',
        token=token,
        namespace='test',
    )


# Metadata field info
metadata_field_info = [
    AttributeInfo(
        name='author',
        description='The author of the YouTube video or nutrition article',
        type='string',
    ),
    AttributeInfo(
        name='videoId', description='The unique identifier for the YouTube video', type='string'
    ),
    AttributeInfo(name='title', description='The title of the content', type='string'),
    AttributeInfo(
        name='keywords',
        description='A list of keywords associated with the YouTube video',
        type='List[string]',
    ),
    AttributeInfo(
        name='viewCount', description='The number of views for the YouTube video', type='string'
    ),
    AttributeInfo(
        name='shortDescription',
        description='A short description of the YouTube video',
        type='string',
    ),
    AttributeInfo(name='transcript', description='The transcript of the content', type='string'),
    AttributeInfo(
        name='authors', description='The authors of the PubMed or Archive document', type='list'
    ),
    AttributeInfo(
        name='publicationDate',
        description='The publication date of the PubMed or Archive document',
        type='string',
    ),
    AttributeInfo(
        name='abstract', description='The abstract of the PubMed or Archive document', type='string'
    ),
    AttributeInfo(name='date', description='The date of the nutrition article', type='string'),
    AttributeInfo(
        name='keyPoints', description='The key points of the nutrition article', type='string'
    ),
    AttributeInfo(name='subTitle', description='The subtitle of the recipe', type='string'),
    AttributeInfo(name='rating', description='The rating of the recipe', type='float'),
    AttributeInfo(
        name='recipeDetails',
        description='The details of the recipe include the time also.',
        type='Dict[string, string]',
    ),
    AttributeInfo(
        name='ingredients', description='A list of ingredients for the recipe', type='List[string]'
    ),
    AttributeInfo(name='steps', description='The steps to prepare the recipe', type='List[string]'),
    AttributeInfo(
        name='nutritionFacts',
        description='Nutritional facts of the recipe',
        type='Dict[string, string]',
    ),
    AttributeInfo(
        name='nutritionInfo',
        description='Detailed nutritional information of the recipe',
        type='Dict[string, Dict[string, string]]',
    ),
]

document_content_description = """
It includes a variety of metadata to describe different aspects of the content:

General Information:
- Title: The title of the content.
- Transcript: A full transcript of any video, audio, or written content associated with document.

YouTube Video Information:
- Author: The author or creator of the YouTube video.
- VideoId: The unique identifier for the YouTube video.
- Keywords: A list of relevant keywords associated with the YouTube video.
- ViewCount: The number of views for the YouTube video.
- Short Description: A brief overview of the YouTube video.

PubMed Article Information:
- Authors: List of authors for the PubMed article.
- PublicationDate: The date when the PubMed article was published.
- Abstract: A summary of the PubMed article.

Podcast Information:
- Title: The title of the podcast episode.
- Transcript: The transcript of the podcast episode.

Nutrition Article Information:
- Title: The title of the nutrition article.
- Date: The date when the nutrition article was published.
- Author: The author of the nutrition article.
- Key Points: Important highlights or key points about recipe from the nutrition article.

Recipe Information:
- Title: The title of the recipe.
- SubTitle: The subtitle of the recipe.
- Rating: The rating of the recipe, if available.
- Recipe Details: Detailed information about the recipe, including preparation time,
cooking time, and serving size.
- Ingredients: A list of ingredients required for making recipe.
- Steps: Step-by-step instructions to prepare the dish.
- Nutrition Facts: Basic nutritional information about the recipe.
- Nutrition Info: Detailed nutritional information, including amounts and daily values.

Archived Document Information:
- Title: The title of the archived document.
- Authors: List of authors for the archived document.
- Abstract: A summary of the archived document.
- PublicationDate: The date when the archived document was published.
"""


# Create a function to get response from the chain
def get_health_ai_response(question, llm):
    token = ''
    vector_store = initialize_vector_store(token)
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
    response = chain.invoke(question)
    return response


def get_response_from_llm(query, llm):
    api_key = ''
    models = {'gpt-4': {}, 'gpt-3.5-turbo-instruct': {'name': 'gpt-3.5-turbo-instruct'}}
    if llm in models:
        llm_model = ChatOpenAI(api_key=api_key, temperature=0, **models[llm])
        response = get_health_ai_response(query, llm_model)
        return response
    else:
        return 'Model Not Found'


@https_fn.on_request(cors=options.CorsOptions(cors_origins=['*'], cors_methods=['get', 'post']))
def get_response_url(req: https_fn.Request) -> https_fn.Response:
    query = req.get_json().get('query', '')
    llms = req.get_json().get('llms', ['gpt-4'])
    responses = {}
    for llm in llms:
        response = get_response_from_llm(query, llm)
        responses[llm] = response
    return https_fn.Response(dumps(responses), mimetype='application/json')


@https_fn.on_call()
def get_response(req: https_fn.CallableRequest):
    query = req.data.get('query', '')
    llms = req.data.get('llms', ['gpt-4'])
    responses = {}
    for llm in llms:
        response = get_response_from_llm(query, llm)
        responses[llm] = response
    return responses
