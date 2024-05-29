from src.backend.ScrappingTarget.youtube_target import YouTubeTarget
from src.backend.Orchestrator.orchestrator import Orchestrator

if __name__ == '__main__':
    target = YouTubeTarget(url='https://www.youtube.com/@DrWilliamLi')
    Orchestrator.run_target(target)
