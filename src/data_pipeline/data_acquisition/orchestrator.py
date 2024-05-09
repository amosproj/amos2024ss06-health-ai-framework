from config import Config
import hashlib
from scrapers.podcast.podcast_scraping import (download_element)
from scraping_data_element import *



class Orchestrator:
    """Manages acquisition of data from different sources (youtube urls, ...).

    The orchestrator retrieves all scaping targets specified in the input config,
    verifies that a scraping target has not already been scraped,
    schedules scraping jobs,
    and in the end stores the data in a scraping data DB
    """

    def __init__(self, _config_path):
        self.config_path = _config_path
        self.queue = ScrapingQueue()
        pass

    """
    Fill queue takes the source inputs of the json file and divdes them into an elementar
    scraping target object, that needs to be scraped
    """
    def fill_queue(self):
        # get scraping targets from json
        self.config = Config()
        self.config.from_json(self.config_path)
        print("Loaded config: \n" + config)

        #TODO: call enqueue functions for every scraping type
        pass

    def enqueue_youtube_targets(self):
        if not hasattr(self, config):
            return

        for entry in config.youtube_channel_targets:
            # TODO: get individual youtube video links
            links = []
            # add to queue if video needs to be scraped
            for video_url in links:
                key = self.get_unique_key(video_url)
                if is_in_database(key):
                    continue
                q_element = ScrapingDataElement(key, video_url, SourceType.YOUTUBE)
                self.queue.enqueue(q_element)

    def enqueue_podcast_targets(self):
        if not hasattr(self, config):
            return

        for entry in config.podcasts_targets:
            # TODO: get individual podcast links
            links = get_podcast_links
            # add to queue if video needs to be scraped
            for podcast_url in links:
                key = self.get_unique_key(podcast_url)
                if is_in_database(key):
                    continue
                q_element = ScrapingDataElement(key, podcast_url, SourceType.YOUTUBE)
                self.queue.enqueue(q_element)


    "url should be elementar, eg. podcast link"
    def get_unique_key(self, url):
        return hashlib.sha256(url.encode('utf-8')).hexdigest()

    def is_in_database(self, key):
        pass


#---------------------------------------------------------
# MARK: Scraping Data Class
#---------------------------------------------------------

# MARK: Queue
"Queue contains unique elements to schedule scraping jobs for, that are not already in DB"
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
    q = ScrapingQueue()
    podcast_link = ScrapingDataElement(1,"https://peterattiamd.com/tombilyeu/",
                                       SourceType.PODCAST)
    q.enqueue(podcast_link)
    download_element(q.dequeue())



