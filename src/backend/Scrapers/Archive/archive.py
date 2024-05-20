from src.backend.Scrapers.BaseScraper.base_scraper import BaseScraper
from src.backend.Scrapers.Archive import RAW_DIR_PATH, INDEX_FILE_PATH

import os
import arxiv


class ArchiveScrapper(BaseScraper):
  def __init__(self, element_id: str):
    super().__init__(element_id=element_id)

  @classmethod
  def index_file(cls) -> str:
    return INDEX_FILE_PATH

  @classmethod
  def base_dir(cls) -> str:
    return RAW_DIR_PATH

  # ---------------------------------------------------------
  # MARK: arXiv Queries
  # ---------------------------------------------------------

  def query_per_keyword(self, keywords, max_results=100_000):
    """Queries ArXiv for papers based on a list of keywords."""
    results = []
    [results.extend(search_arxiv(key, max_results)) for key in keywords]
    return results

  def search_arxiv(self, query, max_results):
    """Search ArXiv for articles related to a query."""
    client = arxiv.Client()
    search = arxiv.Search(
      query=query, max_results=max_results, sort_by=arxiv.SortCriterion.SubmittedDate
    )
    return client.results(search)

  # ---------------------------------------------------------
  # MARK: Metadata Scraping
  # ---------------------------------------------------------

  def get_title_from_paper(self, paper):
    return paper.title

  def get_authors_from_paper(self, paper):
    return ', '.join([author.name for author in paper.authors])

  def get_abstract_from_paper(self, paper):
    return paper.summary

  def get_publication_date_from_paper(self, paper):
    return paper.published

  def get_pdf_url_from_paper(self, paper):
    return paper.pdf_url

  # ---------------------------------------------------------
  # MARK: Text Scraping
  # ---------------------------------------------------------

  def get_paper_pdf(self, paper, pdf_url, title=None, path='papers/'):
    """Download the PDF of a paper and save it to a specified directory."""
    if title is None:
      title = pdf_url.split('/')[-1]  # DOI

    if not os.path.exists(path):
      os.makedirs(path)

    filename = f'{title}'.replace('/', '').replace('?', '').replace('!', '')

    # Download the PDF to a specified directory with a custom filename.
    paper.download_pdf(dirpath='./' + path, filename=filename + '.pdf')
    return filename

  def get_txt_from_pdf(
    self, filename: str, path='papers/', create_txt_file=False, keep_pdfs=False
  ):
    """Extract text from a PDF file using the PyMuPDF library."""
    filepath = path + f'{filename}.pdf'
    reader = PdfReader(filepath)
    text = ''
    for page in reader.pages:
      text = text + page.extract_text()

    # Delete symbols that cannot be encoded using UTF-8
    text = text.encode('utf-8', 'ignore').decode('utf-8')

    if create_txt_file:
      f = open(filename + '.txt', 'a', encoding='utf-8')
      f.write(text)
      f.close()

    if keep_pdfs is not True:
      if os.path.exists(filepath):
        os.remove(filepath)

    return text

  # TODO:
  def _scrape(self) -> str:
    return ''

  # TODO:
  @classmethod
  def get_all_possible_elements(cls, target) -> []:
    return []
