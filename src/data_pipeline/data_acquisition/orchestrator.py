#from config import Config
from enum import Enum
import hashlib



class Orchestrator:
    """Manages acquisition of data from different sources (youtube urls, ...).

    The orchestrator retrieves all scaping targets specified in the input config,
    verifies that a scraping target has not already been scraped,
    schedules scraping jobs,
    and in the end stores the data in a scraping data DB
    """

    def __init__(self, _config_path):
        self.config_path = _config_path
        pass
    

    """
    Fill queue takes the source inputs of the json file and divdes them into an elementar
    scraping target object, that needs to be scraped
    """
    def fill_queue(self):
        # get scraping targets from json
        self.config = Config()
        self.config.from_json(self.config_path)

        # generate unique keys

        # test whether entry already exists in data base or in queue
        
        # create entry to scrape and add to queue
        
        pass
    """
    def enqueue_youtube_targets(self):
        if not hasattr(self, config): 
        #TODO:

    def enqueue_podcast_targets(self):
        if not hasattr(self, config):
        
        #TODO:
    """


    def create_unique_key(self, url):
        return hashlib.sha256(url.encode('utf-8')).hexdigest()
        
    
    def is_in_database(self, key):
        pass
    
    
    

#---------------------------------------------------------
# MARK: Scraping Data Class
#---------------------------------------------------------
# MARK: Queue
class ScrapingQueue:
    def __init__(self):
        self.scraper_queue = []
        self.scraper_keyset = set()
        pass
    def enqueue(self, object):
        if object.key not in self.scraper_keyset:
            self.scraper_keyset.add(object.key)
            self.scraper_queue.append(object)
    def dequeue(self):
        object = None
        if len(self.scraper_queue) != 0:
            object = self.scraper_queue.pop(-1)
            self.scraper_keyset.discard(object.key)
        
        return object

class SourceType(Enum):
    YOUTUBE = 1
    PODCAST = 2
    RECIPE = 3
    PAPER = 4
    # ...

class ScrapingData:
    def __init__(self, _key, _source_type, _text_data):
        self.key = _key
        self.source_type = _source_type
        self.text_data = _text_data


if __name__ == '__main__':
    """
    a = ScrapingData(1, SourceType.YOUTUBE, None)
    b = ScrapingData(2, SourceType.YOUTUBE, None)
    c = ScrapingData(1, SourceType.YOUTUBE, None)
    q = ScrapingQueue()
    q.enqueue(a)
    print(q.dequeue())
    q.enqueue(b)
    q.enqueue(c)
    
    print(q.dequeue())
    print(q.dequeue())
    
    """
    

