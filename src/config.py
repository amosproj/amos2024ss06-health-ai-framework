import json

class Config:
    """Convert json config to python objects and vice versa.

    A class for a structured, extensible, knowledge-domain agnostic way
    to store user-handed targets for scrapping from various types of sources.
    """

    #TODO: add more types of scaping targets here
    archive_targets = []

    def add_archive_target(self, url, keywords):
        self.archive_targets.append(Archives(url, keywords))

    "Used in the JSON encoder"
    def to_dict(self):
        return dict(archive_targets=self.archive_targets)
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
            json_archive_targets = json_data.get("archive_targets")
            for entry in json_archive_targets:
                self.add_archive_target(entry.get('urls'), entry.get('keywords'))
            #TODO: add new Scraping Objects here

    #---------------------------------------------------------

    def __init__(self):
        # this only serves as an example. Ideally, you would want to call the fromJason
        # method to fill this object with data from an existing Json file

        #self.addArchiveTarget(["http://arxiv.org","https://pubmed.ncbi.nlm.nih.gov/"]
        #, ["nutrition", "health", "food as medicine"])
        pass
    def __repr__(self):
        fmt_string = f"Config(archive_targets: ["
        for entry in self.archive_targets:
            fmt_string += repr(entry)
        fmt_string += "])"
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

    def get_archives():
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

# MARK: Execution

config = Config()
#config.write_to_json("config.json")
#config.from_json("config.json")


