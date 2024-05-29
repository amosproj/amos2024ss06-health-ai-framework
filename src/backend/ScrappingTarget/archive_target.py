from typing import List

from src.backend.Scrapers.Archive.archive import ArchiveScraper
from src.backend.ScrappingTarget.base_target import BaseTarget


class ArchiveTarget(BaseTarget):
    def __init__(self, keywords=[], max_results=1):
        self.keywords = keywords
        self.max_results = max_results  # max search query results per keyword

    def get_all_new_target_elements(self) -> List[ArchiveScraper]:
        return ArchiveScraper.get_all_possible_elements(self)
