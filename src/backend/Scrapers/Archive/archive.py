import json
import os

import arxiv
from pypdf import PdfReader

from src.backend.Scrapers.Archive import INDEX_FILE_PATH, RAW_DIR_PATH
from src.backend.Scrapers.BaseScraper.base_scraper import BaseScraper
from src.backend.Types.archive import TypeArchiveScrappingData


class ArchiveScraper(BaseScraper):
    INDEX = json.loads(open(INDEX_FILE_PATH).read())

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

    @classmethod
    def query_per_keyword(cls, keywords, max_results=100_000):
        """Queries ArXiv for papers based on a list of keywords."""
        results = []
        [results.extend(ArchiveScraper.search_arxiv(key, max_results)) for key in keywords]
        return results

    @classmethod
    def search_arxiv(cls, query, max_results):
        """Search ArXiv for articles related to a query."""
        client = arxiv.Client()
        search = arxiv.Search(
            query=query, max_results=max_results, sort_by=arxiv.SortCriterion.SubmittedDate
        )
        return client.results(search)

    @classmethod
    def extract_arxiv_id_from_url(cls, url):
        return url.split('/')[-1]

    # Use this method for multiple keywords
    @classmethod
    def query_ids_per_keyword(cls, keywords, max_results=100_000) -> list[str]:
        """Queries ArXiv for papers based on a list of keywords and returns the ids."""
        ids = []
        for keyword in keywords:
            arxiv_links = ArchiveScraper.search_arxiv_ids(keyword, max_results)
            ids.extend([cls.extract_arxiv_id_from_url(url) for url in arxiv_links])
        return ids

    @classmethod
    def search_arxiv_ids(cls, query, max_results) -> list[str]:
        """Search ArXiv for articles related to a query and return the ids."""
        search = arxiv.Search(
            query=query, max_results=max_results, sort_by=arxiv.SortCriterion.SubmittedDate
        )
        return [result.entry_id for result in search.results()]

    def get_paper_from_arxiv_id(self, id):
        """Get paper object from an arxiv id (example id: 2405.10746v1)."""
        search = arxiv.Search(id_list=[id])
        client = arxiv.Client()
        results = list(client.results(search))
        if results:
            return results[0]
        else:
            return None

    # ---------------------------------------------------------
    # MARK: Metadata Scraping
    # ---------------------------------------------------------

    def get_title_from_paper(self, paper):
        try:
            return paper.title
        except AttributeError:
            raise ValueError('No title found for paper.')

    def get_authors_from_paper(self, paper):
        try:
            return ', '.join([author.name for author in paper.authors])
        except AttributeError:
            raise ValueError('No authors found for paper.')

    def get_abstract_from_paper(self, paper):
        try:
            return paper.summary
        except AttributeError:
            raise ValueError('No abstract found for paper.')

    def get_publication_date_from_paper(self, paper):
        try:
            return paper.published
        except AttributeError:
            raise ValueError('No publication date found for paper.')

    def get_pdf_url_from_paper(self, paper):
        try:
            return paper.pdf_url
        except AttributeError:
            raise ValueError('No PDF URL found for paper.')

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

    # ---------------------------------------------------------
    # MARK: _scrape & get_ids
    # ---------------------------------------------------------

    def _scrape(self) -> TypeArchiveScrappingData:
        try:
            paper = self.get_paper_from_arxiv_id(self.element_id)
            if paper is None:
                raise ValueError('Paper does not exist for id: ' + str(id))

            title = self.get_title_from_paper(paper)
            pdf_url = self.get_pdf_url_from_paper(paper)
            file_name = self.get_paper_pdf(paper, pdf_url, title)
            data = self.get_txt_from_pdf(file_name)

            info: TypeArchiveScrappingData = {
                'abstract': self.get_abstract_from_paper(paper),
                'authors': self.get_authors_from_paper(paper),
                'ref': pdf_url,
                'publicationDate': str(self.get_publication_date_from_paper(paper)),
                'title': title,
                'transcript': data,
            }

        except Exception as e:
            print(e)
            info = {}

        return info

    @classmethod
    def get_all_possible_elements(cls, target) -> []:
        old_indexes = set(cls.INDEX['indexes'])
        new_indexes = set(cls.query_ids_per_keyword(target.keywords, target.max_results))
        new_target_elements = new_indexes - old_indexes
        print(
            'New Arxiv target elements: '
            + repr(new_target_elements)
            + ' for keywords '
            + repr(target.keywords)
        )
        return [ArchiveScraper(element_id=id) for id in new_target_elements]
