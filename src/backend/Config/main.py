from src.backend.Config.config import Config
from src.backend.ScrappingTarget.all_recipes_target import AllRecipesTarget
from src.backend.ScrappingTarget.archive_target import ArchiveTarget
from src.backend.ScrappingTarget.podcast_target import PodcastTarget
from src.backend.ScrappingTarget.pubmed_target import PubMedTarget
from src.backend.ScrappingTarget.youtube_target import YouTubeTarget

if __name__ == '__main__':
    c = Config()
    c.add_target(AllRecipesTarget())
    c.add_target(ArchiveTarget(keywords=['nutrition', 'health'], max_results=3))
    c.add_target(PodcastTarget(num_podcasts=1))
    c.add_target(PubMedTarget(keywords=['nutrition', 'health'], max_results=3))
    c.add_target(YouTubeTarget(url='https://www.youtube.com/@DrWilliamLi'))
    c.write_to_json()
