from typing import List

from src.backend.Scrapers.Nutrition.nutrition import NutritionScraper
from src.backend.ScrappingTarget.base_target import BaseTarget


class NutritionTarget(BaseTarget):
    def __init__(self, url='https://nutritionfacts.org/blog/', max_pages=None):
        self.url = url
        self.max_pages = max_pages  # max pages None if all pages should be scraped

    def get_all_new_target_elements(self) -> List[NutritionScraper]:
        return NutritionScraper.get_all_possible_elements(self)
