from pypdf import PdfReader
import arxiv
import os

# ---------------------------------------------------------
# MARK: orchestrator functionality (differs from YT and podcast)
# ---------------------------------------------------------

def get_links(link):
    pass


def download_element(scraping_data_element):
    pass


# ---------------------------------------------------------
# MARK: arXiv Queries
# ---------------------------------------------------------

def query_per_keyword(keywords, max_results=100_000):
    """Queries ArXiv for papers based on a list of keywords."""
    results = []
    [results.extend(search_arxiv(key,max_results)) for key in keywords]
    return results


def search_arxiv(query, max_results):
    """Search ArXiv for articles related to a query."""
    client = arxiv.Client()
    search = arxiv.Search(
        query=query,
        max_results=max_results,
        sort_by=arxiv.SortCriterion.SubmittedDate
    )
    return client.results(search)


# ---------------------------------------------------------
# MARK: Metadata Extraction
# ---------------------------------------------------------

def get_title_from_paper(paper):
    return paper.title


def get_authors_from_paper(paper):
    return ", ".join([author.name for author in paper.authors])


def get_abstract_from_paper(paper):
    return paper.summary


def get_publication_date_from_paper(paper):
    return paper.published

def get_pdf_url_from_paper(paper):
    return paper.pdf_url


# ---------------------------------------------------------
# MARK: PDF Download and Text Extraction
# ---------------------------------------------------------

def get_paper_pdf(paper, pdf_url, title=None, path="papers/"):
    """Download the PDF of a paper and save it to a specified directory."""
    if title is None:
        title = pdf_url.split('/')[-1]  # DOI

    if not os.path.exists(path):
        os.makedirs(path)

    filename = f"{title}".replace('/', '').replace('?', '').replace('!', '')

    # Download the PDF to a specified directory with a custom filename.
    paper.download_pdf(dirpath='./'+path, filename=filename+'.pdf')
    return filename


def get_txt_from_pdf(filename: str, path='papers/', create_txt_file=False,
                     keep_pdfs=False):
    """Extract text from a PDF file using the PyMuPDF library."""
    filepath = path + f'{filename}.pdf'
    reader = PdfReader(filepath)
    text = ''
    for page in reader.pages:
        text = text + page.extract_text()

    # Delete symbols that cannot be encoded using UTF-8
    text = text.encode('utf-8', 'ignore').decode('utf-8')

    if create_txt_file:
        f = open(filename + '.txt', "a", encoding="utf-8")
        f.write(text)
        f.close()

    if keep_pdfs is not True:
        if os.path.exists(filepath):
            os.remove(filepath)

    return text

# ---------------------------------------------------------
# MARK: Example
# ---------------------------------------------------------


def main():
    """The main() function searches arXiv for papers related to the keywords."""
    keywords = ['nutrition', 'health', 'food as medicine']  # 3 keywords
    # Search arXiv for papers related to the keywords
    papers = query_per_keyword(keywords, max_results=3)  # 3 papers for one keyword

    print("-----------------")
    print("Searching arXiv for papers related to:", ", ".join(keywords))
    print("Found", len(papers), "papers")

    # Iterate over the papers
    for paper in papers:
        # Extract metadata
        title = get_title_from_paper(paper)
        authors = get_authors_from_paper(paper)
        abstract = get_abstract_from_paper(paper)
        publication_date = get_publication_date_from_paper(paper)
        pdf_url = get_pdf_url_from_paper(paper)

        # Print metadata
        print("-----------------")
        print("Title:", title)
        print("Authors:", authors)
        print("Abstract:", abstract[:200] + "...")
        print("Publication Date:", publication_date)
        print("PDF:", pdf_url)

        # Download PDF and extract text
        file_name = get_paper_pdf(paper, pdf_url, title, "papers/")
        get_txt_from_pdf(file_name, "papers/", True)


if __name__ == "__main__":
    main()
