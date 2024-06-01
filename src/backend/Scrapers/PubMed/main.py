from src.backend.Scrapers.PubMed.pub_med import PubMedScraper
from src.backend.ScrappingTarget.pubmed_target import PubMedTarget

if __name__ == '__main__':
    print('Pubmed Scraper')
    scrapers = PubMedScraper.get_all_possible_elements(
        PubMedTarget(keywords=['nutrition', 'health', 'food as medicine'], max_results=3)
    )

    print('Scraping for ids ' + repr(scrapers) + '\n\n')
    for scraper in scrapers:
        data = scraper._scrape()
        for item in data.items():
            print(item[0], end=': ')
            if item[0] == 'text' or item[0] == 'abstract':
                print(type(item[1]))
            else:
                print(item[1])

            # print(item[1])
        print('-----------------------')
