import json
import os
import pyyoutube

from src.backend.Scrapers.BaseScraper.base_scraper import BaseScraper
from src.backend.Scrapers.YouTube import INDEX_FILE_PATH, RAW_DIR_PATH


class YouTubeScraper(BaseScraper):
  GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
  YOUTUBE_BASE_URL = os.getenv('YOUTUBE_BASE_URL')
  INDEX = json.loads(open(INDEX_FILE_PATH).read())
  Service = pyyoutube.Client(api_key=GOOGLE_API_KEY)

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
