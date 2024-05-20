from astrapy import DataAPIClient
import os


class Database:
  Client = DataAPIClient(os.getenv('ASTRA_DB_TOKEN'))

  def __init__(self, url: str = os.getenv('SCRAPER_DB_URL')):
    self._database = Database.Client.get_database_by_api_endpoint(url)

  @property
  def db(self):
    return self._database
