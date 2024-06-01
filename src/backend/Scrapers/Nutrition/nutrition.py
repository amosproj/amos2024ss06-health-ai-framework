from src.backend.Scrapers.BaseScraper.base_scraper import BaseScraper
from src.backend.Scrapers.Nutrition import RAW_DIR_PATH, INDEX_FILE_PATH

import time
import json
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from webdriver_manager.chrome import ChromeDriverManager
import re
import logging


# Suppress Selenium log messages
logging.getLogger('selenium').setLevel(logging.WARNING)

# Suppress WebDriver Manager log messages
logging.getLogger('WDM').setLevel(logging.NOTSET)


class NutritionScraper(BaseScraper):
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
    # MARK: IDs control
    # ---------------------------------------------------------

    @classmethod
    def query_ids(cls) -> list[str]:
        """Queries the nutrition facts site for podcast ids and returns them as a list"""
        driver = cls.start_driver()

        ids = []
        nutrition_links = NutritionScraper.search_nutrition_ids(driver)
        ids.extend([cls.extract_nutrition_id_from_url(link) for link in nutrition_links])

        driver.quit()
        return ids

    @classmethod
    def search_nutrition_ids(cls, driver) -> list[str]:
        """Search podcast site for nutrition facts related to a query and return the ids."""
        blog_links = set()
        page_number = 1
        while True:
            print(f'Scraping page {page_number}')
            page_url = cls.url if page_number == 1 else f'{cls.url}page/{page_number}/'
            driver.get(page_url)

            WebDriverWait(driver, 10).until(ec.presence_of_element_located((By.TAG_NAME, 'a')))
            if driver.find_elements(
                By.XPATH,
                '//div[@class="alert alert-warning" and contains(text(),'
                '"Sorry, no results were found.")]',
            ):
                print('No more results found.')
                break

            links = driver.find_elements(By.TAG_NAME, 'a')
            for link in links:
                href = link.get_attribute('href')
                if (
                    href
                    and '/blog/' in href
                    and not re.search(r'/page/\d+', href)
                    and '/es/' not in href
                    and not href.endswith('/#')
                ):
                    blog_links.add(href)

            next_page_url = f'{cls.url}page/{page_number + 1}/'
            driver.get(next_page_url)
            page_number += 1
            time.sleep(2)

            if driver.current_url == page_url:
                break

            if cls.max_pages is not None and page_number >= cls.max_pages:
                break

        return list(blog_links)

    @classmethod
    def extract_nutrition_id_from_url(cls, url):
        """Extracts the nutrition facts id from the url"""
        # https://nutritionfacts.org/blog/what-the-science-says-about-time-restricted-eating/
        return url.split('/')[-2]

    @classmethod
    def get_chrome_options(cls):
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--log-level=3')
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option(
            'excludeSwitches', ['enable-logging', 'enable-automation']
        )
        chrome_options.add_experimental_option('useAutomationExtension', False)

        return chrome_options

    @classmethod
    def start_driver(cls):
        try:
            options = cls.get_chrome_options()
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=options)
            return driver
        except Exception as e:
            print(f'Error starting ChromeDriver: {e}')
            return None

    @classmethod
    def get_driver(cls):
        return cls.start_driver()

    # ---------------------------------------------------------
    # MARK: Metadata Scraping
    # ---------------------------------------------------------

    def clean_text(self, text):
        # Replace newline characters within words or around links with spaces
        text = re.sub(r'(\w)\n(\w)', r'\1 \2', text)
        text = re.sub(r'(\w)\n(\W)', r'\1 \2', text)
        text = re.sub(r'(\W)\n(\w)', r'\1 \2', text)

        # Replace multiple newlines with a single newline
        text = re.sub(r'\n+', '\n', text)

        # Remove non-printable characters and replace non-breaking spaces with regular spaces
        text = re.sub(r'\u00a0', ' ', text)
        text = re.sub(r'[^\x00-\x7F]+', ' ', text)

        return text

    def get_url_content(self, driver, blog_url):
        driver.get(blog_url)
        WebDriverWait(driver, 10).until(
            ec.presence_of_element_located((By.CLASS_NAME, 'entry-title'))
        )

        soup = BeautifulSoup(driver.page_source, 'html.parser')

        title_element = soup.find('h1', class_='entry-title')
        title = title_element.text.strip() if title_element else 'Title not found'

        date_element = soup.find('time', datetime=True)
        date = date_element['datetime'] if date_element else 'Date not found'

        author_element = soup.find('p', class_='byline author vcard')
        if author_element:
            author_link = author_element.find('a', class_='fn')
            author = author_link.text.strip() if author_link else 'Author Not Found'
        else:
            author = 'Author Not Found'

        content_element = soup.find('div', class_='entry-content')
        content = (
            content_element.get_text(separator='\n') if content_element else 'Content not found'
        )
        content = self.clean_text(content)
        max_length = 80
        content_chunks = [content[i : i + max_length] for i in range(0, len(content), max_length)]

        key_take_away_element = soup.find('div', class_='key-takeaways')
        key_take_away = (
            key_take_away_element.get_text(separator='\n')
            if key_take_away_element
            else 'Key Take Away not found'
        )
        key_take_away = self.clean_text(key_take_away)
        key_take_away_chunks = [
            key_take_away[i : i + max_length] for i in range(0, len(key_take_away), max_length)
        ]

        image_elements = content_element.find_all('img')
        image_urls = [img['src'] for img in image_elements if 'src' in img.attrs]

        return title, date, author, content_chunks, key_take_away_chunks, image_urls, blog_url

    # ---------------------------------------------------------
    # MARK: _scrape & get_ids
    # ---------------------------------------------------------

    def _scrape(self) -> str:
        driver = NutritionScraper.get_driver()

        final_url = NutritionScraper.url + self.element_id + '/'
        print(f'Scraping {final_url}')

        nutrition = self.get_url_content(driver, final_url)
        if nutrition is None:
            raise ValueError('Data does not exist for id: ' + str(self.element_id))

        title, date, author, content_chunks, key_take_away_chunks, image_urls, blog_url = nutrition
        info = {
            'title': title,
            'date': date,
            'author': author,
            'content': content_chunks,
            'key take away': key_take_away_chunks,
            'images': image_urls,
            'url': blog_url,
        }

        time.sleep(2)

        driver.quit()
        return json.dumps(info, indent=2)

    @classmethod
    def get_all_possible_elements(cls, target) -> []:
        cls.url = target.url
        cls.max_pages = target.max_pages

        old_indexes = set(cls.INDEX['indexes'])
        new_indexes = set(cls.query_ids())
        new_target_elements = new_indexes - old_indexes
        print(
            'New Nutrition target elements: '
            + repr(new_target_elements)
            + ' for keywords '
            + repr(target.url)
        )  # TODO: remove debug

        return [NutritionScraper(element_id=id) for id in new_target_elements]
