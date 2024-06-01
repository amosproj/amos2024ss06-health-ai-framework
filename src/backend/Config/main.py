from src.backend.Config.config import Config

from src.backend.ScrappingTarget.archive_target import ArchiveTarget
from src.backend.ScrappingTarget.podcast_target import PodcastTarget
from src.backend.ScrappingTarget.pubmed_target import PubMedTarget

if __name__ == '__main__':
    c = Config()
    # c.add_target(YouTubeTarget(url='https://www.youtube.com/@NutritionFactsOrg'))
    # c.add_target(YouTubeTarget(url='https://www.youtube.com/@DrWilliamLi'))

    keys = ['nutrition', 'health', 'food as medicine']
    c.add_target(ArchiveTarget(keywords=keys, max_results=1))
    url = 'https://peterattiamd.com/podcast/archive/'
    c.add_target(PodcastTarget(url=url, num_podcasts=1))
    # c.add_target(AllRecipesTarget())
    c.add_target(PubMedTarget(keywords=['nutrition', 'health', 'food as medicine'], max_results=3))
    c.write_to_json()
