from Bio import Entrez
from pypdf import PdfReader
from paperscraper.pdf import save_pdf

import os


# ---------------------------------------------------------
# MARK: Pubmed Queries
# ---------------------------------------------------------

"""Get Pubmed ID's for a search query (eg. 'nutrition cancer').

only retrieves free full text papers (filter)
can only retrieve the first 10k search results so be specific with search terms"""


def search_free_fulltext(query):
  Entrez.email = 'email@example.com'
  handle = Entrez.esearch(
    db='pubmed',
    sort='relevance',
    retmax='250000',
    retmode='xml',
    term=query + ' AND free full text[sb]',
  )
  # optionally: could further filter with mindate and maxdate args,
  # see docs: https://www.ncbi.nlm.nih.gov/books/NBK25499/
  results = Entrez.read(handle)
  handle.close()
  return results['IdList']


"""Get metadata for one pubmed id, received from search query.

Metadata is stored in a dictionary"""


def fetch_details(id):
  Entrez.email = 'email@example.com'
  handle = Entrez.efetch(db='pubmed', retmode='xml', id=id)
  results = Entrez.read(handle)
  handle.close()
  return results


# MARK: Metadata

"""Retrieve doi url from details dictionary received from fetch_details() method."""


def get_doi_from_details(details_dict):
  try:
    id_list = details_dict['PubmedArticle'][0]['PubmedData']['ArticleIdList']
    doi = ''
    for entry in id_list:
      attr = entry.attributes.get('IdType')
      if attr == 'doi':
        doi = f'https://doi.org/{entry}'
    return doi
    # return doi
  except Exception as e:
    print('Error: pubmed_scraping: get_doi_from_pubmed_id: Could not retrieve doi.')
    print(e)
    return ''
  pass


"""Retrieve abstract from details dictionary received from fetch_details() method."""


def get_abstract_from_details(details_dict):
  try:
    # Maybe check why 'AbstractText' is a list of texts with only 1 entry
    # (in all examples seen)
    abstract = details_dict['PubmedArticle'][0]['MedlineCitation']['Article']
    abstract = abstract['Abstract']['AbstractText'][0]
    return abstract
  except Exception as e:
    print(
      'Error: pubmed_scraping: get_abstract_from_details:'
      + ' Could not retrieve abstract.'
    )
    print(e)
    return ''


"""Retrieve title from details dictionary received from fetch_details() method."""


def get_title_from_details(details_dict):
  try:
    title = details_dict['PubmedArticle'][0]['MedlineCitation']['Article']
    title = title['ArticleTitle']
    if title.endswith('.'):
      title = title[:-1]
    return title
  except Exception as e:
    print('Error: pubmed_scraping: get_title_from_details: Could not retrieve title.')
    print(e)
    return ''


"""Retrieve authors str from details dictionary received from fetch_details() method.

the authors are separated by ', ' delimeter"""


def get_authors_from_details(details_dict):
  try:
    author_dict_list = details_dict['PubmedArticle'][0]['MedlineCitation']['Article']
    author_dict_list = author_dict_list['AuthorList']
    author_strings = []
    for entry in author_dict_list:
      author = entry['ForeName'] + ' ' + entry['LastName']
      author_strings.append(author)
    return ', '.join(author_strings)
  except Exception as e:
    print(
      'Error: pubmed_scraping: get_authors_from_details:' + ' Could not retrieve authors.'
    )
    print(e)
    return ''


"""Retrieve publication date from details dict received from fetch_details() method."""


def get_publication_date_from_details(details_dict):
  try:
    date_dict = details_dict['PubmedArticle'][0]['MedlineCitation']['Article']
    date_dict = date_dict['Journal']['JournalIssue']['PubDate']
    date = date_dict['Day'] + ' ' + date_dict['Month'] + ' ' + date_dict['Year']
    return date
  except Exception as e:
    print(
      'Error: pubmed_scraping: get_publication_date_from_details:'
      + 'Could not retrieve date.'
    )
    print(e)
    return ''


# ---------------------------------------------------------
# MARK: Get pdf and text
# ---------------------------------------------------------

def get_paper_from_doi(doi: str, title=None, path="papers"):
    # potentially add title and then pdf files can be stored under the title
    # instead of their doi (as filename)
    # if the title is given, it will be used. Otherwise the file will be saved
    # under its DOI
    if title is None:
        title = doi
    if not os.path.exists(path):
        os.makedirs(path)

    paper_data = {'doi': doi}
    filename = f"{title}".replace('/', '').replace('?', '').replace('!', '')
    filepath = path + "/" + filename

    save_pdf(paper_data, filepath=filepath + '.pdf')
    return filename

def get_txt_from_pdf(filename: str, path='papers/', create_txt_file=False,
                     keep_pdfs=False):
  filepath = path + f'{filename}.pdf'
  reader = PdfReader(filepath)
  text = ''
  for page in reader.pages:
    text = text + page.extract_text()

  if create_txt_file:
    f = open(filename + '.txt', 'a')
    f.write(text)
    f.close()

  if keep_pdfs is not True:
    if os.path.exists(filepath):
      os.remove(filepath)

  return text


# ---------------------------------------------------------
# MARK: Example
# ---------------------------------------------------------

# # Fetch papers from pubmed
keywords = ["nutrition", "cancer", "exercise"]
studies_id_list = search_free_fulltext(' '.join(keywords))
metadata = fetch_details([studies_id_list[0]])

print("-----------------")
print("Fetching Pubmed for keywords: " + repr(keywords))
print("Found " + str(len(studies_id_list)) + " papers")
print("Retrieving metadata for first paper, pubmed id: " + str(studies_id_list[0]))

# Extract important metadata
title = get_title_from_details(metadata)
publication_date = get_publication_date_from_details(metadata)
authors = get_authors_from_details(metadata)
abstract = get_abstract_from_details(metadata)
doi = get_doi_from_details(metadata)

print("-----------------")
print("Metadata:")
print("Title: " + title + "\nPublication Date: " + publication_date)
print("Authors: " + authors + "\nDoi: " + doi + "\nAbstract: " + abstract)

# Download pdf and convert to text
file_name = get_paper_from_doi(doi, title)
text_data = get_txt_from_pdf(file_name, "papers/", True)
