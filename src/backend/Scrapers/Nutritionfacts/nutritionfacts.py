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

# TODO: ADAPT THIS TO PREET'S NEW ORCHESTRATOR PIPELINE NEXT SPRINT


def get_blog_links(driver, base_url):
    blog_links = set()
    page_number = 1

    while True:
        print(f'Scraping page {page_number}')
        page_url = base_url if page_number == 1 else f'{base_url}page/{page_number}/'
        driver.get(page_url)

        try:
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

            next_page_url = f'{base_url}page/{page_number + 1}/'
            driver.get(next_page_url)
            page_number += 1
            time.sleep(2)

            if driver.current_url == page_url:
                break

        except Exception as e:
            print(f'Error occurred while retrieving blog links from page {page_number}: {e}')
            break

    return list(blog_links)


def clean_text(text):
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


def get_blog_content(driver, blog_url):
    try:
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
        content = clean_text(content)
        max_length = 80
        content_chunks = [content[i : i + max_length] for i in range(0, len(content), max_length)]

        key_take_away_element = soup.find('div', class_='key-takeaways')
        key_take_away = (
            key_take_away_element.get_text(separator='\n')
            if key_take_away_element
            else 'Key Take Away not found'
        )
        key_take_away = clean_text(key_take_away)
        key_take_away_chunks = [
            key_take_away[i : i + max_length] for i in range(0, len(key_take_away), max_length)
        ]

        image_elements = content_element.find_all('img')
        image_urls = [img['src'] for img in image_elements if 'src' in img.attrs]

        return {
            'title': title,
            'date': date,
            'author': author,
            'content': content_chunks,
            'key take away': key_take_away_chunks,
            'images': image_urls,
            'url': blog_url,
        }

    except Exception as e:
        print(f'Error occurred while extracting blog content from {blog_url}: {e}')
        return None


def save_data(blog_links, all_blogs):
    with open('blog_links.json', 'w') as json_file:
        json.dump(blog_links, json_file, indent=4)

    with open('blog_data.json', 'w') as json_file:
        json.dump(all_blogs, json_file, indent=4)

    print('Blog links saved to blog_links.json')
    print('Blog data saved to blog_data.json')


def scrape_blogs(base_url):
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

    try:
        driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()), options=chrome_options
        )
        all_blog_links = []
        processed_blog_links = set()
        print('Navigating to base URL:', base_url)
        driver.get(base_url)
        print('Current URL:', driver.current_url)

        blog_links = get_blog_links(driver, base_url)
        print('Found', len(blog_links), 'blog links.')

        all_blog_links.extend(blog_links)

        all_blogs = []
        for index, blog_link in enumerate(blog_links, start=1):
            if blog_link in processed_blog_links:
                print(f'Skipping already processed blog: {blog_link}')
                continue

            print(f'Processing blog {index}/{len(blog_links)} - URL: {blog_link}')
            blog_data = get_blog_content(driver, blog_link)
            if blog_data:
                all_blogs.append(blog_data)
                processed_blog_links.add(blog_link)
                print('Blog content extracted successfully.')
                print()
                time.sleep(2)
            else:
                print('Failed to extract blog content')

    finally:
        driver.quit()

    save_data(all_blog_links, all_blogs)
