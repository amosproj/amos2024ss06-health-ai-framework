
# MARK BIOPYTHON QUERY

from Bio import Entrez
#import pandas as pd

def search(query):
    Entrez.email = 'email@example.com'
    handle = Entrez.esearch(db='pubmed',
        sort='relevance',
        retmax='250000',
        retmode='xml',
        term=query)
    results = Entrez.read(handle)
    return results

def get_num_results(query):
    Entrez.email = "Your.Name.Here@example.org"
    handle = Entrez.egquery(term="health")
    results = Entrez.read(handle)
    handle.close()
    print(results)
    return results

get_num_results("health")
#studies = search('nutrition health cancer eye')
#studiesIdList = studies['IdList']
#print(len(studiesIdList))

# ----------------------------------

# from paperscraper.pdf import save_pdf

# paper_data = {'doi': "10.48550/arXiv.2207.03928"}
# save_pdf(paper_data, filepath='example_paper.pdf')

