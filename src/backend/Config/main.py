from src.backend.Config.config import Config
from src.backend.ScrappingTarget.pubmed_target import PubMedTarget

if __name__ == '__main__':
  c = Config()
  # c.add_target(YouTubeTarget(url='https://www.youtube.com/@NutritionFactsOrg'))
  # c.add_target(YouTubeTarget(url='https://www.youtube.com/@DrWilliamLi'))
  # c.add_target(
  #   ArchiveTarget(keywords=['nutrition', 'health', 'food as medicine'], max_results=1)
  # ) #TODO: reenable previous targets after testing pubmed
  c.add_target(
    PubMedTarget(keywords=['nutrition', 'health', 'food as medicine'], max_results=1)
  )
  c.write_to_json()
