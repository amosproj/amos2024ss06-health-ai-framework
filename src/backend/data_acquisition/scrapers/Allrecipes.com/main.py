import json
from allrecipes import AllRecipes

if __name__ == "__main__":
    processed_urls = set()  # This set will prevent processing the same URL multiple times
    categories = AllRecipes.fetch_categories()
    recipes_data = []  # List to store recipe data

    if categories:
        name, url = next(iter(categories.items()))  # Get the first category and its URL
        print(f"Fetching recipes from {name.title()}...")
        recipe_urls = AllRecipes.fetch_recipe_links(url)

        if recipe_urls:
            recipe_count = 0  # Counter to limit the number of recipes processed
            for recipe_url in recipe_urls:
                if recipe_url not in processed_urls and recipe_count < 10:
                    processed_urls.add(recipe_url)
                    print(f"Processing {recipe_url}...")
                    details = AllRecipes.fetch_recipe_details(recipe_url)
                    if isinstance(details, dict):  # Check if details is a dictionary
                        recipe_data = {
                            "category": name,
                            "url": recipe_url,
                            "title": details["title"],
                            "ingredients": details["ingredients"],
                            "steps": details["steps"],
                            "nutrition_facts": details["nutrition_facts"]
                        }
                        recipes_data.append(recipe_data)
                        recipe_count += 1
                        print(f"Details for {name} added to recipes data.")
                    else:
                        print(f"Details not found for {recipe_url}.")
                elif recipe_count >= 10:
                    break  # Break the loop if the desired number of recipes is fetched
                else:
                    print(f"Already processed {recipe_url}, skipping...")
        else:
            print(f"No recipes found in {name} category.")

        # Write recipes data to JSON file
        with open("recipes.json", "w", encoding='utf-8') as json_file:
            json.dump(recipes_data, json_file, indent=4)
            print("Recipes data written to JSON file.")
    else:
        print("No categories available.")
