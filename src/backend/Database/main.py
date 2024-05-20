from src.backend.Database.database import Database

if __name__ == '__main__':
  db = Database()
  db.db.create_collection('youtube', dimension=50, metric='cosine')
  print(1)
