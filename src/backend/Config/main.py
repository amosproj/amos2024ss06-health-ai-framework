from src.backend.Config.config import Config
from src.backend.ScrappingTarget.youtube_target import YouTubeTarget

if __name__ == '__main__':
  c = Config.from_json()
  c.add_target(YouTubeTarget('test_url_3'))
  print(c.to_dict())
  c.write_to_json()
