import json
import ssl
import urllib.request
from typing import Dict, List
from urllib.request import HTTPSHandler

from bs4 import BeautifulSoup

from src.backend.log.log import write_to_log
from src.backend.Scrapers.AllRecipes import INDEX_FILE_PATH, RAW_DIR_PATH
from src.backend.Scrapers.BaseScraper.base_scraper import BaseScraper
from src.backend.Types.all_recipes import TypeAllRecipeScrappingData


class AllRecipesScraper(BaseScraper):
    INDEX = json.loads(open(INDEX_FILE_PATH).read())
    HEADERS = {
        'User-Agent': (
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
            '(KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        ),
        'Cookie': 'euConsent=true',
        'Accept': (
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,'
            'image/apng,*/*;q=0.8'
        ),
        'Accept-Language': 'en-US,en;q=0.9',
    }

    def __init__(self, element_id: str, recipe_name: str):
        super().__init__(element_id=element_id)
        base_url = AllRecipesScraper.url + 'recipe/{}/{}'
        self._url = base_url.format(element_id, recipe_name)
        req = urllib.request.Request(self._url, headers=self.HEADERS)
        handler = HTTPSHandler(context=ssl._create_unverified_context())
        opener = urllib.request.build_opener(handler)
        try:
            response = opener.open(req)
            html_content = response.read()
            self._soup = BeautifulSoup(html_content, 'html.parser')
        except Exception as e:
            print(f'Failed to fetch data due to: {e}')
            write_to_log(
                self.element_id, self.__class__.__name__, f'Failed to fetch data due to: {e}'
            )
            self._soup = None  # Handle the case where the request fails

    @classmethod
    def index_file(cls) -> str:
        return INDEX_FILE_PATH

    @classmethod
    def base_dir(cls) -> str:
        return RAW_DIR_PATH

    def get_heading(self) -> str:
        try:
            heading = self._soup.select_one('.article-heading.type--lion').get_text(strip=True)
            return heading
        except AttributeError:
            return ''

    def get_sub_heading(self) -> str:
        try:
            sub_heading = self._soup.select_one('.article-subheading').get_text(strip=True)[1:-1]
            return sub_heading
        except AttributeError:
            return ''

    def get_rating_count(self) -> float:
        try:
            rating_count_text = self._soup.select_one('.mntl-recipe-review-bar__rating').get_text(
                strip=True
            )
            rating_count_number = rating_count_text[1:-1]
            return float(rating_count_number)
        except (AttributeError, ValueError):
            return 0.0

    def get_recipe_details(self) -> Dict[str, str]:
        details = {}
        try:
            items = self._soup.find_all(class_='mntl-recipe-details__item')
            for item in items:
                label = (
                    item.find(class_='mntl-recipe-details__label')
                    .get_text(strip=True)
                    .replace(':', '')
                )
                value = item.find(class_='mntl-recipe-details__value').get_text(strip=True)
                details[label] = value
        except AttributeError:
            pass
        return details

    def get_ingredients(self) -> List[str]:
        ingredients = []
        try:
            items = self._soup.find_all(class_='mntl-structured-ingredients__list-item')
            for item in items:
                quantity = item.find('span', {'data-ingredient-quantity': 'true'}).get_text(
                    strip=True
                )
                unit = item.find('span', {'data-ingredient-unit': 'true'}).get_text(strip=True)
                name = item.find('span', {'data-ingredient-name': 'true'}).get_text(strip=True)
                sentence = f'{quantity} {unit} {name}'.strip()
                ingredients.append(r'{0}'.format(sentence))
        except AttributeError:
            pass
        return ingredients

    def get_steps(self) -> List[str]:
        try:
            steps = self._soup.select('.recipe__steps-content ol li')
            step_list = [step.get_text(strip=True) for step in steps]
            return step_list
        except AttributeError:
            return []

    def get_nutrition_facts(self) -> Dict[str, str]:
        nutrition_dict = {}
        try:
            rows = self._soup.select('.mntl-nutrition-facts-summary__table-row')
            for row in rows:
                cells = row.find_all('td', class_='mntl-nutrition-facts-summary__table-cell')
                if len(cells) == 2:
                    key = cells[1].text.strip()
                    value = cells[0].text.strip()
                    nutrition_dict[key] = value
        except AttributeError:
            pass
        return nutrition_dict

    def get_nutrition_info(self) -> Dict[str, Dict[str, str]]:
        nutrition_dict = {}
        try:
            rows = self._soup.select('.mntl-nutrition-facts-label__table-body tr')
            for row in rows:
                cells = row.find_all('td')
                if len(cells) == 2:
                    nutrient_name = (
                        cells[0]
                        .find('span', class_='mntl-nutrition-facts-label__nutrient-name')
                        .text.strip()
                    )
                    nutrient_value = cells[0].contents[-1].strip()
                    daily_value = cells[1].text.strip()
                    nutrition_dict[nutrient_name] = {
                        'Amount': nutrient_value,
                        'Daily Value': daily_value,
                    }
        except AttributeError:
            pass
        return nutrition_dict

    def _scrape(self) -> TypeAllRecipeScrappingData:
        scrape_data: TypeAllRecipeScrappingData = {
            'title': self.get_heading(),
            'subTitle': self.get_sub_heading(),
            'rating': self.get_rating_count(),
            'recipeDetails': self.get_recipe_details(),
            'ingredients': self.get_ingredients(),
            'steps': self.get_steps(),
            'nutritionFacts': self.get_nutrition_facts(),
            'nutritionInfo': self.get_nutrition_info(),
            'ref': self._url,
        }
        for key, value in scrape_data.items():
            if value in ['', [], {}, None]:
                return {}
        return scrape_data

    @classmethod
    def get_all_recipes_category_urls(cls) -> List[str]:
        category_urls = []
        req = urllib.request.Request(cls.url, headers=cls.HEADERS)
        handler = HTTPSHandler(context=ssl._create_unverified_context())
        opener = urllib.request.build_opener(handler)
        try:
            response = opener.open(req)
            html_content = response.read()
            soup = BeautifulSoup(html_content, 'html.parser')
            for link in soup.find_all('a', href=True):
                if '/recipes/' in link['href']:
                    category_urls.append(link['href'])
        except Exception as e:
            print(f'Failed to fetch category URLs due to: {e}')
            error_msg = f'Failed to fetch category URLs due to: {e}'
            write_to_log(self.element_id, self.__class__.__name__, error_msg)
        return category_urls

    @classmethod
    def get_all_recipes_of_page(cls, link_url: str, limit: int = 10) -> List[Dict[str, str]]:
        recipes = []
        current_url = link_url
        fetched_count = 0
        while current_url and fetched_count < limit:
            req = urllib.request.Request(current_url, headers=cls.HEADERS)
            handler = HTTPSHandler(context=ssl._create_unverified_context())
            opener = urllib.request.build_opener(handler)
            try:
                response = opener.open(req)
                html_content = response.read()
                soup = BeautifulSoup(html_content, 'html.parser')
                # Find all recipe URLs on the current page
                recipe_links = soup.find_all('a', href=lambda href: href and '/recipe/' in href)
                for link in recipe_links:
                    if fetched_count >= limit:
                        break
                    # Extract id and name from the URL
                    url_parts = link['href'].split('/')
                    recipe_id = url_parts[-3]
                    recipe_name = url_parts[-2]
                    if recipe_id in cls.INDEX.get('indexes', []):
                        continue
                    # Append id and name to the list as a dictionary
                    recipes.append({'id': recipe_id, 'name': recipe_name})
                    fetched_count += 1
                # Find the next page URL
                next_button = soup.find(class_='mntl-pagination__next')
                next_button_url = next_button.find('a')['href'] if next_button else None
                current_url = next_button_url if next_button_url else None
            except Exception as e:
                print(f'Failed to fetch recipes from {current_url} due to: {e}')
                error_msg = f'Failed to fetch recipes from {current_url} due to: {e}'
                write_to_log(self.element_id, self.__class__.__name__, error_msg)
                break
        return recipes

    @classmethod
    def get_all_possible_elements(cls, target) -> List[BaseScraper]:
        cls.url = target.url
        old_indexes = set(cls.INDEX.get('indexes', []))
        all_category_urls = cls.get_all_recipes_category_urls()
        all_recipes = []
        for url in all_category_urls:
            all_recipes.extend(cls.get_all_recipes_of_page(url, target.limit))
            if len(all_recipes) >= target.limit:
                break
        new_recipe_ids = set(recipe['id'] for recipe in all_recipes)
        new_recipe_ids.difference_update(old_indexes)
        new_recipes = [recipe for recipe in all_recipes if recipe['id'] in new_recipe_ids]
        return [
            AllRecipesScraper(element_id=recipe['id'], recipe_name=recipe['name'])
            for recipe in new_recipes
        ]
