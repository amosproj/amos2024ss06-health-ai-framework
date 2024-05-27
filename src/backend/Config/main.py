from src.backend.Config.config import Config
from src.backend.ScrappingTarget.youtube_target import YouTubeTarget
from src.backend.ScrappingTarget.archive_target import ArchiveTarget

if __name__ == '__main__':
  c = Config()
  c.add_target(YouTubeTarget(url='https://www.youtube.com/@NutritionFactsOrg'))
  c.add_target(YouTubeTarget(url='https://www.youtube.com/@DrWilliamLi'))
  c.add_target(ArchiveTarget(keywords=['nutrition', 'health'], max_results=1))
  c.write_to_json()
