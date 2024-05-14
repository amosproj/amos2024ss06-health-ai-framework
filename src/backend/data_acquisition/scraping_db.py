import pymongo
"""
initializes a mongoClient to our scraping database and allows for inserting,
 finding and deleting elements in our scraping database
 mainly used in Orchestrator
"""
class ScrapingDB():
    def __init__(self):
        self.myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        self.mydb = self.myclient["scraping_db"]
        self.collection = self.mydb["scraping_data_element"]

    def insert_one(self, data):
        self.collection.insert_one(data)

    def insert_many(self, data):
        self.collection.insert_many(data)

    def find_element_from_key(self, key):
        self.collection.find({"key": key})

    def delete_element_from_key(self, key):
        self.collection.delete_one({ "key": key })
