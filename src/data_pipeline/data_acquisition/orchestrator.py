from config import Config

class Orchestrator:
    """Manages acquisition of data from different sources (youtube urls, ...)

    The orchestrator retrieves all scaping targets specified in the input config,
    verifies that a scraping target has not already been scraped,
    schedules scraping jobs,
    and in the end stores the data in a scraping data DB
    """
    config = Config()

    def __init__(self):
        pass