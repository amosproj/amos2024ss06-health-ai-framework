import hashlib
import pathlib

from config import Config
from scraping_db import *
from scraping_data_element import *


class Orchestrator:
    """Manages acquisition of data from different sources (youtube urls, ...).

    The orchestrator retrieves all scraping targets specified in the input config,
    verifies that a scraping target has not already been scraped,
    schedules scraping jobs,
    and in the end stores the data in a scraping data DB
    """

    def __init__(self, _config_path):
        print("Starting Orchestrator...") #TODO: remove debug
        self.config_path = _config_path
        self.queue = ScrapingQueue()
        self.scrapingDB = ScrapingDB()
        pass

    #---------------------------------------------------------
    # MARK: Fill Queue Methods
    #---------------------------------------------------------

    """Pops one element from the queue, retrieve data and store it in the DB"""
    def process_queue_entry(self):
        entry: ScrapingDataElement = self.queue.dequeue()
        if entry is None:
            return

        print("Scraping data of key: " + entry.key) #TODO: remove debug

        match(entry.source_type):
            case SourceType.YOUTUBE:
                #TODO:
                self.scrape_dummy_data(entry)
                pass
            case SourceType.PODCAST:
                #TODO:
                # scrape_podcast(entry)
                pass
            case _:
                print("Error: Orchestrator: process_queue_entry: unknown source_type: " +
                      entry.source_type)

        self.store_in_database(entry)
        return

    """Processes the queue of scheduled scraping jobs up to a limit of INT_MAX"""
    def schedule_scraping_jobs(self):
        print("-------------------------------------------")
        print("Scheduling scraping jobs...") #TODO: remove debug
        int_max =  2147483647
        counter = 0
        while not self.queue.is_empty():
            if counter > int_max - 1:
                print("Warning: Orchestrator: schedule_scraping_jobs:" +
                      " possibly infinite loop, stopped scraping")
                break

            self.process_queue_entry()
            counter += 1
        pass

    #---------------------------------------------------------
    # MARK: Fill Queue Methods
    #---------------------------------------------------------

    """
    Fill queue takes the source inputs of the json file and divides them into an elementar
    scraping target object, that needs to be scraped
    """
    def fill_queue(self):
        # get scraping targets from json
        self.config = Config()
        self.config.from_json(self.config_path)
        print("Loaded config: \n" + repr(self.config))

        #TODO: call enqueue functions for every scraping type
        self.enqueue_youtube_targets()
        print("-------------------------------------------")
        print("Finished filling queue with DUMMY scraping jobs...")
        print(self.queue)
        #self.enqueue_podcast_targets()

    def enqueue_youtube_targets(self):
        if not hasattr(self, 'config'):
            return

        for entry in self.config.youtube_channel_targets:
            # TODO: get individual youtube video links
            links = self.get_dummy_links(entry.url)
            # add to queue if video needs to be scraped
            for video_url in links:
                key = self.get_unique_key(video_url)
                if self.is_in_database(key):
                    continue
                q_element = ScrapingDataElement(key, video_url, SourceType.YOUTUBE)
                self.queue.enqueue(q_element)

    def enqueue_podcast_targets(self):
        if not hasattr(self, 'config'):
            return

        for entry in self.config.podcasts_targets:
            # TODO: get individual podcast links
            links = get_podcast_links()
            # add to queue if video needs to be scraped
            for podcast_url in links:
                key = self.get_unique_key(podcast_url)
                if self.is_in_database(key):
                    continue
                q_element = ScrapingDataElement(key, podcast_url, SourceType.YOUTUBE)
                self.queue.enqueue(q_element)

    #---------------------------------------------------------
    # MARK: Database Methods
    #---------------------------------------------------------

    "url should be elementar, eg. podcast link"
    def get_unique_key(self, url):
        return hashlib.sha256(url.encode('utf-8')).hexdigest()

    #TODO: implement data base first before calling these methods
    def is_in_database(self, key):
        return False
        """
        if self.scrapingDB.find_element_from_key(key) == None:
            return False
        return True
        """

    def store_in_database(self, data_scraping_element):
        print("Storing data of key: " + data_scraping_element.key)
        # key = data_scraping_element.key
        # if not self.is_in_database(key):
        #     self.scrapingDB.insert_one(data_scraping_element)

    def delete_from_database(self, key):
        print("Deleting entry of key: " + data_scraping_element.key)
        # if self.is_in_database(key):
        #     self.scrapingDB.delete_element_from_key(key)

    #---------------------------------------------------------
    # MARK: Dummy Testing Methods
    #---------------------------------------------------------

    def get_dummy_links(self, channel_url):
        return ["https://www.youtube.com/watch?v=Y_luNDT9mE0",
                "https://www.youtube.com/watch?v=6bKkC5xX5_M",
                "https://www.youtube.com/watch?v=AW6kwHt4GFo"]

    def scrape_dummy_data(self, data_scraping_element: ScrapingDataElement):
        key = str(data_scraping_element.key)
        data_scraping_element.text_data = "Schubidu" + key
        metadata = YoutubeMetadata("title" + key, "date" + key, "num_clicks" + key)
        data_scraping_element.metadata = metadata
        return data_scraping_element

#---------------------------------------------------------
# MARK: Queue
#---------------------------------------------------------

"Queue contains unique elements to schedule scraping jobs for, that are not already in DB"
class ScrapingQueue:
    def __init__(self):
        self.scraper_queue = []
        self.scraper_keyset = set()
        pass
    def enqueue(self, obj):
        if obj.key not in self.scraper_keyset:
            self.scraper_keyset.add(obj.key)
            self.scraper_queue.append(obj)
    def dequeue(self):
        obj = None
        if len(self.scraper_queue) != 0:
            obj = self.scraper_queue.pop(-1)
            self.scraper_keyset.discard(obj.key)

        return obj

    def is_empty(self):
        return len(self.scraper_queue) == 0

    def __repr__(self):
        q_str = 'ScrapingQueue = [\n'
        entry_list = []
        for entry in self.scraper_queue:
            entry_list.append(repr(entry.__dict__))
        q_str += ',\n'.join(entry_list)
        q_str += ']'
        return q_str

#---------------------------------------------------------
# MARK: Main
#---------------------------------------------------------

if __name__ == '__main__':
    # DEMO
    config_path = str(pathlib.Path(__file__).parent.resolve()) + "/config.json"
    orchestrator = Orchestrator(config_path)
    orchestrator.fill_queue()
    orchestrator.schedule_scraping_jobs()


