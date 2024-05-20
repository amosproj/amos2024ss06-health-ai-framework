from typing import List

from src.backend.Scrapers.Archive.archive import ArchiveScrapper
from src.backend.ScrappingTarget.base_target import BaseTarget


class ArchiveTarget(BaseTarget):
  def __init__(self):
    pass

  def get_all_new_target_elements(self) -> List[ArchiveScrapper]:
    return ArchiveScrapper.get_all_possible_elements(self)
