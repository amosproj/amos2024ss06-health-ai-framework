from typing import List

from src.backend.Scrapers.PubMed.pub_med import PubMedScraper
from src.backend.ScrappingTarget.base_target import BaseTarget


class PubMedTarget(BaseTarget):
  def __init__(self, keywords=[], max_results=1):
    self.keywords = keywords
    self.max_results = max_results  # max search query results for the set of keywords

  def get_all_new_target_elements(self) -> List[PubMedScraper]:
    return PubMedScraper.get_all_possible_elements(self)
