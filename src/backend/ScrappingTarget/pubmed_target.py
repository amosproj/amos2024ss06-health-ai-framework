from typing import List

from src.backend.Scrapers.PubMed.pub_med import PubMedScraper
from src.backend.ScrappingTarget.base_target import BaseTarget


class PubMedTarget(BaseTarget):
    def __init__(self):
        pass

    def get_all_new_target_elements(self) -> List[PubMedScraper]:
        return PubMedScraper.get_all_possible_elements(self)
