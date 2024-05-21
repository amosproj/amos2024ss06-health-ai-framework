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
    indexes: [str] = json.load(open(self.index_file, 'r').read()).get('indexes', [])
    return self.element_id in indexes

  def _save(self, raw_data: str):
    with open(os.path.join(type(self).base_dir(), f'{self.element_id}.txt'), 'w') as file:
      file.write(raw_data)

  def scrape_and_save(self):
    raw_data = self._scrape()
    self._save(raw_data)
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
