from typing import List

from src.backend.Scrapers.PodCast.pod_cast import PodCastScraper
from src.backend.ScrappingTarget.base_target import BaseTarget


class PodcastTarget(BaseTarget):
  def __init__(self):
    pass

  def get_all_new_target_elements(self) -> List[PodCastScraper]:
    return PodCastScraper.get_all_possible_elements(self)
