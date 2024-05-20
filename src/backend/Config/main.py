from src.backend.Config.config import Config
from src.backend.ScrappingTarget.youtube_target import YouTubeTarget

if __name__ == '__main__':
  c = Config()
  c.add_target(YouTubeTarget(url='https://www.youtube.com/@NutritionFactsOrg'))
  c.add_target(YouTubeTarget(url='https://www.youtube.com/@DrWilliamLi'))
  c.write_to_json()
