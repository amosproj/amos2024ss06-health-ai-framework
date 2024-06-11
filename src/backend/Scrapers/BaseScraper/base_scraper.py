import json
import os.path
from abc import ABCMeta, abstractmethod
from src.backend.log.log import write_to_log


class BaseScraper(metaclass=ABCMeta):
    def __init__(self, element_id: str):
        self.element_id = element_id

    def __repr__(self):
        return 'Scraper(' + str(self.element_id) + ')'

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
            json.dump(scrapped_dict, file, indent=2)

    def scrape_and_save(self):
        scrapped_dict = self._scrape()
        # Check if the scrapped_dict is empty
        if not scrapped_dict:
            print(f'No data found for {self.element_id}')
            write_to_log(self.element_id, self.__class__.__name__ , f'No data found for {self.element_id}')
            return
        # save scrapped json file
        self._save(scrapped_dict)
        # Update the indexes
        with open(type(self).index_file(), 'r+') as file:
            index_data = json.load(file)
            indexes = index_data.get('indexes', [])
            indexes.append(self.element_id)
            index_data['indexes'] = indexes
            # Write the updated index data back to the file
            file.seek(0)
            json.dump(index_data, file, indent=2)
