from typing import List

from src.backend.Scrapers.YouTube.you_tube import YouTubeScraper
from src.backend.ScrappingTarget.base_target import BaseTarget


class YouTubeTarget(BaseTarget):
    def __init__(self, url=str):
        self.url = url

    def get_all_new_target_elements(self) -> List[YouTubeScraper]:
        return YouTubeScraper.get_all_possible_elements(self)
