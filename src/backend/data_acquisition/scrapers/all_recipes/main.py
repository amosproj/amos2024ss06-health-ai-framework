from allrecipes import AllRecipes

if __name__ == '__main__':
  processed_urls = set()  # This set will prevent processing the same URL multiple times
  categories = AllRecipes.fetch_categories()

  if categories:
    with open(
      'recipes_details.txt', 'w', encoding='utf-8'
    ) as file:  # Open file to write with UTF-8 encoding
      for name, url in categories.items():
        print(f'Fetching recipes from {name.title()}...')
        recipe_urls = AllRecipes.fetch_recipe_links(url)

        if recipe_urls:
          for recipe_url in recipe_urls:
            if recipe_url not in processed_urls:
              processed_urls.add(recipe_url)
              print(f'Processing {recipe_url}...')
              details = AllRecipes.fetch_recipe_details(recipe_url)
              if details:
                file.write(details)  # Write the formatted string to file
                print(f'Details for {name} written to file.')
              else:
                print(f'Details not found for {recipe_url}.')
            else:
              print(f'Already processed {recipe_url}, skipping...')
        else:
          print(f'No recipes found in {name} category.')
  else:
    print('No categories available.')
