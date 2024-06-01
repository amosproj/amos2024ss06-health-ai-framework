from src.backend.Config.config import Config
from typing import List
from src.backend.Scrapers.BaseScraper.base_scraper import BaseScraper


class Orchestrator:
  def __init__(self, config: Config):
    self._config = config

  @classmethod
  def run_target(cls, target):
    all_new_target_elements: List[BaseScraper] = []
    all_new_target_elements.extend(target.get_all_new_target_elements())
    for element in all_new_target_elements:
      element.scrape_and_save()

  def run(self):
    target_groups = self._config.get_all_targets()
    all_new_target_elements: List[BaseScraper] = []
    for target in target_groups:
      all_new_target_elements.extend(target.get_all_new_target_elements())
    for element in all_new_target_elements:
      element.scrape_and_save()
