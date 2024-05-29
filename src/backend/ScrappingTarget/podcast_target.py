from typing import List

from src.backend.Scrapers.PodCast.pod_cast import PodCastScraper
from src.backend.ScrappingTarget.base_target import BaseTarget


class PodcastTarget(BaseTarget):
    def __init__(
        self,
        url=str,
        num_podcasts=None,
        model='vosk-model-small-en-us-0.15',
        model_download='https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip',
    ):
        self.url = url  # Url to scape from
        self.num_podcasts = (
            num_podcasts  # How many items to scrape, can be 'None' for no limit or number
        )
        self.model = model  # Vosk model name for transcription
        self.model_download = model_download

    def get_all_new_target_elements(self) -> List[PodCastScraper]:
        return PodCastScraper.get_all_possible_elements(self)
