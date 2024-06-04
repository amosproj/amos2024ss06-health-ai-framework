from typing import List

from src.backend.Scrapers.AllRecipes.all_recipes import AllRecipesScraper
from src.backend.ScrappingTarget.base_target import BaseTarget


class AllRecipesTarget(BaseTarget):
    def __init__(self, url='https://www.allrecipes.com/', limit=10):
        self.url = url
        self.limit = limit

    def get_all_new_target_elements(self) -> List[AllRecipesScraper]:
        return AllRecipesScraper.get_all_possible_elements(self)
