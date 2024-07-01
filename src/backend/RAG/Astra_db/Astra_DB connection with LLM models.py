import os

from astrapy import DataAPIClient
from astrapy.db import AstraDB
from dotenv import load_dotenv
from langchain.schema import Document
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import OpenAIEmbeddings

load_dotenv()

# Initialize AstraDB connection
ASTRA_DB_NAMESPACE = 'test'
ASTRA_DB_COLLECTION = 'test_collection_2'

client = DataAPIClient(os.getenv('ASTRA_DB_TOKEN'))
database = client.get_database(os.getenv('ASTRA_DB_API_ENDPOINT'))

db = AstraDB(
    token=os.getenv('ASTRA_DB_TOKEN'),
    api_endpoint=os.getenv('ASTRA_DB_API_ENDPOINT'),
    namespace=os.getenv('ASTRA_DB_NAMESPACE'),
)
collection = db.collection(collection_name='test_collection_2')

# Initializing OpenAI and Google Generative AI models
openai_api_key = os.environ.get('OPEN_API_KEY')
embedding_model = OpenAIEmbeddings(api_key=openai_api_key)
llm = ChatGoogleGenerativeAI(model='gemini-pro', google_api_key=os.environ.get('GOOGLE_GEMINI_API'))

# similarity search in AstraDB
query = 'Which foods indicate protective or neutral effects'
query_embedding = embedding_model.embed_query(query)

sort = {'$vector': query_embedding}
options = {'limit': 2}
projection = {'content': 1, 'metadata': 1, '$vector': 1}

document_list = collection.find(sort=sort, options=options, projection=projection)

# Prepare documents for LangChain processing
document_chunks = []
for document in document_list['data']['documents']:
    content = document.get('content', '')
    metadata = document.get('metadata', {})
    document_chunks.append(Document(page_content=content, metadata=metadata))

# Process documents with LangChain and generate response
response = ''
if document_chunks:
    relevant_info = ''
    for doc in document_chunks:
        relevant_info += f'Content: {doc.page_content}\nMetadata: {doc.metadata}\n\n'
        print(f'Content: {doc.page_content}\nMetadata: {doc.metadata}\n\n')
    context = (
        'You are a health consultant specializing in answering'
        'health-related queries and providing comprehensive insights. '
        'You have access to various documents containing'
        'information about the latest trends in the health industry, '
        'summarize the key points, and draw conclusions'
        'based on the provided information. Consider the broader implications '
        'while forming your conclusions.'
    )

    multi_step_reasoning = (
        '1. Read the provided statements carefully.\n'
        '2. Identify and list the key points mentioned'
        'by the person asking the question.\n'
        '3. Analyze these key points in the context'
        '4. of the available information.\n'
        '5. Draw well-reasoned conclusions based on your analysis.\n'
        '6. Provide a summary of your findings,'
        '7. highlighting the most critical insights.'
    )

    few_shot_examples = (
        'Example 1:\n'
        'Q: What did the CEO of TechCorp say about their new product launch?\n'
        'A: The CEO emphasized the innovative features of the new product,'
        'its competitive pricing, and its potential to capture significant market share. '
        'They also mentioned the strategic importance of this'
        "launch for the company's growth plans.\n\n"
        'Example 2:\n'
        "Q: What were the key takeaways from the CFO's statement at HealthInc?\n"
        "A: The CFO highlighted the company's strong "
        'financial performance, cost-cutting measures, and plans'
        'for future investments in technology '
        'to drive efficiency. They also discussed the '
        'challenges posed by recent market volatility'
        'and their strategies to mitigate risks.'
    )

    hypothetical_scenario = (
        'Imagine you are presenting your analysis to'
        'a group of doctors in a conference. '
        'Your goal is to provide a clear, concise,'
        'and insightful analysis that helps them'
        'understand the latest trends in the health industry and '
        'their potential impact on medical practices.'
    )

    modified_prompt = (
        f'{context}\n\n'
        f'{multi_step_reasoning}\n\n'
        f'{few_shot_examples}\n\n'
        f'{hypothetical_scenario}\n\n'
        f'Here is some relevant information:\n{relevant_info}\n\n'
        f'Now, based on the provided information and your expertise'
        ', answer the following questions:\n'
        f'Q: What are the protective effects mentioned?\n'
        f'Q: What can we conclude from this information?'
    )

    response = llm.predict(modified_prompt)
    print(f'Response generated from {llm.__class__.__name__} is:', response)
else:
    print('No documents found matching the query.')

# Print the response
print(response)
