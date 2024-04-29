import json

class Config:
    """
    A class for a structured, extensible, knowledge-domain agnostic way to store user-handed targets for scrapping from various types of sources
    """
    #TODO: add more types of scaping targets here
    archiveTargets = []

    def addArchiveTarget(self, url, keywords):
        self.archiveTargets.append(Archives(url, keywords))

    "Used in the JSON encoder"
    def toDict(self):
        return dict(archiveTargets=self.archiveTargets) # TODO: add new Scraping Variables here

    def writeToJson(self, path):
        jsonData = json.dumps(
            self,
            sort_keys=True,
            indent=4,
            cls=JsonEncoder)
        with open(path, "w") as jsonFile:
            jsonFile.write(jsonData)

    def fromJson(self, path):
        with open(path) as jsonFile:
            jsonData = json.load(jsonFile)

            # fill data fields of this class with data from json
            jsonArchiveTargets = jsonData.get("archiveTargets")
            for entry in jsonArchiveTargets:
                self.addArchiveTarget(entry.get('urls'), entry.get('keywords'))
            #TODO: add new Scraping Objects here

            #print(self)

    #---------------------------------------------------------

    def __init__(self):
    # this only serves as an example. Ideally, you would want to call the fromJason method to fill this object with data from an existing Json file
        #self.addArchiveTarget(["http://arxiv.org","https://pubmed.ncbi.nlm.nih.gov/"] , ["nutrition", "health", "food as medicine"])
        pass
    def __repr__(self):
        fmt_string = f"Config(archiveTargets: ["
        for entry in self.archiveTargets:
            fmt_string += repr(entry)
        fmt_string += "])"
        return fmt_string

    #---------------------------------------------------------


#---------------------------------------------------------
# MARK: Encoding/Decoding Classes
#---------------------------------------------------------

class JsonEncoder(json.JSONEncoder):
    """
    Custom encoder tells the JSON library how to encode our objects
    """
    def default(self, obj):
        if hasattr(obj, "toDict"):
            return obj.toDict()
        else:
            return json.JSONEncoder.default(self, obj)

#---------------------------------------------------------
# MARK: Classes for Scraping Targets
#---------------------------------------------------------

# TODO: This class serves as an example for how targets could be stored.
# Similarly create classes for youtube, websites, podcast, ... targets
class Archives:
    """
    Wrapper class for our different archives

    """
    class Archive:

        """
        A website containing various papers to scrape
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

    def getArchives():
        return self.archives

    def toDict(self):
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
        return f"Archives Details:\nURLs: {url_str}\nKeywords: {keyword_str}"

    #------------------------------------------------------------

# MARK: Execution

config = Config()
#config.writeToJson("config.json")
#config.fromJson("config.json")


