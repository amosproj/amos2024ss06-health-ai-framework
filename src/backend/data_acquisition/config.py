import json

class Config:
    """Convert json config to python objects and vice versa.

    A class for a structured, extensible, knowledge-domain agnostic way
    to store user-handed targets for scrapping from various types of sources.
    """

    #TODO: add more types of scaping targets here
    archives_targets = []
    youtube_channel_targets = []
    podcasts_targets = []

    def add_archives_target(self, urls, keywords):
        self.archives_targets.append(Archives(urls, keywords))
    def add_youtube_channel_target(self, name, url):
        self.youtube_channel_targets.append(YoutubeChannel(name, url))
    def add_podcasts_target(self, urls, keywords):
        self.podcasts_targets.append(Podcasts(urls, keywords))

    "Used in the JSON encoder"
    def to_dict(self):
        return dict(archives_targets=self.archives_targets,
                    youtube_channel_targets=self.youtube_channel_targets,
                    podcasts_targets=self.podcasts_targets
                    )
        # TODO: add new Scraping Variables to dict if added to the config

    def write_to_json(self, path):
        json_data = json.dumps(
            self,
            sort_keys=True,
            indent=4,
            cls=JsonEncoder)
        with open(path, "w") as json_file:
            json_file.write(json_data)

    def from_json(self, path):
        with open(path) as json_file:
            json_data = json.load(json_file)

            # fill data fields of this class with data from json
            json_archives_targets = json_data.get("archives_targets")
            for entry in json_archives_targets:
                self.add_archives_target(entry.get('urls'), entry.get('keywords'))

            json_youtube_channel_targets = json_data.get("youtube_channel_targets")
            for entry in json_youtube_channel_targets:
                self.add_youtube_channel_target(entry.get('name'), entry.get('url'))

            json_podcasts_targets = json_data.get("podcasts_targets")
            for entry in json_podcasts_targets:
                self.add_podcasts_target(entry.get('urls'), entry.get('keywords'))
            #TODO: add new scraping types here

    #---------------------------------------------------------

    def __init__(self):
        pass

    def __repr__(self):
        fmt_string = f"Config(\n|--> archive_targets: ["
        for entry in self.archives_targets:
            fmt_string += "\n     |--> "
            fmt_string += repr(entry)
        fmt_string += "]\n|--> youtube_channel_targets: ["

        for entry in self.youtube_channel_targets:
            fmt_string += "\n     |--> "
            fmt_string += repr(entry)
        fmt_string += "]\n|--> podcasts_targets: ["

        for entry in self.podcasts_targets:
            fmt_string += "\n     |--> "
            fmt_string += repr(entry)
        fmt_string += "])"

        #TODO: add new scraping types here

        return fmt_string

    #---------------------------------------------------------


#---------------------------------------------------------
# MARK: Encoding/Decoding Classes
#---------------------------------------------------------

class JsonEncoder(json.JSONEncoder):
    """Custom encoder tells the JSON library how to encode our objects."""

    def default(self, obj):
        if hasattr(obj, "to_dict"):
            return obj.to_dict()
        else:
            return json.JSONEncoder.default(self, obj)

#---------------------------------------------------------
# MARK: Classes for Scraping Targets
#---------------------------------------------------------

# TODO: This class serves as an example for how targets could be stored.
# Similarly create classes for youtube, websites, podcast, ... targets
class Archives:
    """Wrapper class for our different archives."""

    class Archive:
        """A website containing various papers to scrape.

        Filter papers based on keywords
        """

        #-------------------------------------------------------------
        def __init__(self, url, keywords):
            self.url = url
            self.keywords = keywords

        def __repr__(self):
            return f"Archive(urls={self.url}, keywords={self.keywords})"

        def __str__(self):
            url_str = ', '.join(self.url)
            keyword_str = ', '.join(self.keywords)
            return f"Archive Details:\nURLs: {url_str}\nKeywords: {keyword_str}"
        #------------------------------------------------------------

    def get_archives(self):
        return self.archives

    def to_dict(self):
        return dict(urls=self.urls, keywords=self.keywords)

    #------------------------------------------------------------
    def __init__(self, urls, keywords):
        #TODO: add your own data fields
        self.urls = urls
        self.keywords = keywords
        self.archives = []
        for url in urls:
            self.archives.append(self.Archive(url, keywords))

    def __repr__(self):
            return f"Archives(urls={self.urls}, keywords={self.keywords})"

    def __str__(self):
        urls_str = ', '.join(self.urls)
        keyword_str = ', '.join(self.keywords)
        return f"Archives Details:\nURLs: {urls_str}\nKeywords: {keyword_str}"

    #------------------------------------------------------------

#

# MARK: Youtube Channel Scraping
class YoutubeChannel:
    def __init__(self, _name, _url):
        self.name = _name
        self.url = _url
    def __repr__(self):
        return f"YoutubeChannel(name={self.name}, url={self.url})"
    def to_dict(self):
        return dict(name=self.name, url=self.url)

#MARK: Podcast Webite Scraping
class Podcasts:
    def __init__(self, _urls, _keywords):
        self.urls = _urls
        self.keywords = _keywords
    def __repr__(self):
        return f"Podcasts(urls={self.urls}, keywords={self.keywords})"
    def to_dict(self):
        return dict(urls=self.urls, keywords=self.keywords)


#config = Config()

# Example: Add new entries to json config
# config.add_archives_target(["http://arxiv.org","https://pubmed.ncbi.nlm.nih.gov/"]
#                       , ["nutrition", "health", "food as medicine"])
# config.add_youtube_channel_target("Dr William Li", "https://www.youtube.com/@DrWilliamLi")
# config.add_podcasts_target(["https://peterattiamd.com/podcast/archive/"],
#                          ["podcast", "health"])
# config.write_to_json("config.json")

# Example: read from json into objects
#config.from_json("config.json")
#print(config)


