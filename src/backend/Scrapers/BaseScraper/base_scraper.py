import json
import os.path
from abc import abstractmethod, ABCMeta


class BaseScraper(metaclass=ABCMeta):
  def __init__(self, element_id: str):
    self.element_id = element_id

  @classmethod
  @abstractmethod
  def index_file(cls) -> str:
    pass

  @classmethod
  @abstractmethod
  def base_dir(cls):
    pass

  @abstractmethod
  def _scrape(self) -> str:
    pass

  @classmethod
  @abstractmethod
  def get_all_possible_elements(cls, target) -> []:
    pass

  def is_scrapped(self) -> bool:
    indexes: [str] = json.load(open(self.index_file(), 'r').read()).get('indexes', [])
    return self.element_id in indexes

  def _save(self, scrapped_dict: dict):
    file_path = os.path.join(self.base_dir(), f'{self.element_id}.json')
    with open(file_path, 'w') as file:
      json.dump(scrapped_dict, file)

  def scrape_and_save(self):
    scrapped_dict = self._scrape()
    # Check if the scrapped_dict is empty
    if not scrapped_dict:
      print('Scrapped data is empty. Nothing to save or update.')
      return
    self._save(scrapped_dict)  # save scrapped json file
    # Read index data from the file
    with open(type(self).index_file(), 'r+') as file:
      index_data = json.load(file)
      # Update the indexes
      indexes = index_data.get('indexes', [])
      indexes.append(self.element_id)
      index_data['indexes'] = indexes
      # Write the updated index data back to the file
      file.seek(0)
      json.dump(index_data, file, indent=2)
