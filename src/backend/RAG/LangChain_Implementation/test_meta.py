from langchain.chains.query_constructor.base import AttributeInfo

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
