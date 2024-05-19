from src.backend.Scrapers.BaseScraper.base_scraper import BaseScraper
from src.backend.Scrapers.PodCast import INDEX_FILE_PATH, RAW_DIR_PATH


class PodCastScraper(BaseScraper):
  def __init__(self, element_id: str):
    super().__init__(element_id=element_id)

  @property
  @classmethod
  def index_file(cls) -> str:
    return INDEX_FILE_PATH

  @property
  @classmethod
  def base_dir(cls) -> str:
    return RAW_DIR_PATH

  def _scrape(self) -> str:
    return ''

  @classmethod
  def get_all_possible_elements(cls, target) -> []:
    return []
