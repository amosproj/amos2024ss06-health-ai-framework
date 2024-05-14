import urllib.request
import ssl
from bs4 import BeautifulSoup

class AllRecipes:
    @staticmethod
    def fetch_categories(base_url="https://www.allrecipes.com/"):
        """Fetch category names and URLs from the Allrecipes homepage."""
        categories = {}
        req = urllib.request.Request(base_url)
        req.add_header('Cookie', 'euConsent=true')
        handler = urllib.request.HTTPSHandler(context=ssl._create_unverified_context())
        opener = urllib.request.build_opener(handler)

        try:
            response = opener.open(req)
            html_content = response.read()
            soup = BeautifulSoup(html_content, 'html.parser')
            for link in soup.find_all("a", href=True):
                if 'recipes/' in link['href'] and 'gallery' not in link['href']:
                    cat_name = link.text.strip()
                    cat_url = link['href']
                    if cat_name and cat_url not in categories.values():
                        categories[cat_name] = cat_url
        except Exception as e:
            print(f"Failed to fetch categories due to: {e}")
        return categories

    @staticmethod
    def fetch_recipe_links(category_url):
        """Fetch all recipe links from a specific category URL."""
        recipe_links = []
        req = urllib.request.Request(category_url)
        req.add_header('Cookie', 'euConsent=true')
        handler = urllib.request.HTTPSHandler(context=ssl._create_unverified_context())
        opener = urllib.request.build_opener(handler)

        try:
            response = opener.open(req)
            html_content = response.read()
            soup = BeautifulSoup(html_content, 'html.parser')
            links = soup.find_all("a", href=True)
            for link in links:
                href = link['href']
                if 'recipe' in href and href.startswith('https://www.allrecipes.com/recipe/'):
                    if href not in recipe_links:
                        recipe_links.append(href)
                        print(f"Found recipe link: {href}")
        except Exception as e:
            print(f"Failed to fetch recipe links due to: {e}")
        return recipe_links

    @staticmethod
    def fetch_recipe_details(recipe_url):
        """Fetch detailed info from a recipe page and return formatted string."""
        req = urllib.request.Request(recipe_url)
        req.add_header('Cookie', 'euConsent=true')
        handler = urllib.request.HTTPSHandler(context=ssl._create_unverified_context())
        opener = urllib.request.build_opener(handler)

        try:
            response = opener.open(req)
            html_content = response.read()
            soup = BeautifulSoup(html_content, 'html.parser')
            title = ""
            if soup.find("h1"):
                title = soup.find("h1").get_text(strip=True)
            else:
                title =  'No title found'

            ingredients_list = soup.find("ul", class_="mntl-structured-ingredients__list")
            ingredients = []
            if ingredients_list:
                for li in ingredients_list.find_all("li"):
                    parts = [part.get_text(strip=True) for part in li.find_all("span")]
                    formatted_ingredient = ' '.join(parts)  # Joining with a space
                    ingredients.append(formatted_ingredient)

            steps_list = soup.find("ol", class_="mntl-sc-block-group--OL")
            steps = []
            if steps_list:
                steps = [li.get_text(strip=True) for li in steps_list.find_all("li")]

            nutrition_facts = {}
            nutrition_table = soup.find("table",
                                        class_="mntl-nutrition-facts-summary__table")
            if nutrition_table:
                rows = nutrition_table.find_all("tr")
                for row in rows:
                    cells = row.find_all("td")
                    if len(cells) == 2:
                        key = cells[1].text.strip()
                        value = cells[0].text.strip()
                        nutrition_facts[key] = value

            details = f"Recipe URL: {recipe_url}\n"
            details += f"Recipe Title: {title}\nIngredients ({len(ingredients)}):\n"
            for ingredient in ingredients:
                details += f"- {ingredient}\n"
            details += "Steps:\n"
            for step in steps:
                details += f"- {step}\n"
            details += "Nutrition Facts:\n"
            for key, value in nutrition_facts.items():
                details += f"{key}: {value}\n"
            details += "--------------------------------\n"

            return details
        except Exception as e:
            print(f"Failed to fetch recipe details due to: {e}")
            return None
