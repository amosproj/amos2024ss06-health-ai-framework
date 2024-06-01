import html
import json
import os
import pyyoutube
import requests
from src.backend.Scrapers.BaseScraper.base_scraper import BaseScraper
from src.backend.Scrapers.YouTube import INDEX_FILE_PATH, RAW_DIR_PATH
from xml.etree import ElementTree


class YouTubeScraper(BaseScraper):
    YOUTUBE_DATA_API_V3 = os.getenv('YOUTUBE_DATA_API_V3')
    YOUTUBE_BASE_URL = (
        'https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8'
    )
    INDEX = json.loads(open(INDEX_FILE_PATH).read())
    Service = pyyoutube.Client(api_key=YOUTUBE_DATA_API_V3)

    def __init__(self, element_id: str):
        super().__init__(element_id=element_id)

    @classmethod
    def index_file(cls) -> str:
        return INDEX_FILE_PATH

    @classmethod
    def base_dir(cls) -> str:
        return RAW_DIR_PATH

    def _scrape(self) -> str:
        payload = {
            'context': {'client': {'clientName': 'WEB', 'clientVersion': '2.20210721.00.00'}},
            'videoId': self.element_id,
        }
        headers = {'Content-Type': 'application/json'}
        try:
            response = requests.post(YouTubeScraper.YOUTUBE_BASE_URL, headers=headers, json=payload)
            if response.status_code == 200:
                data = response.json()
                captions = data['captions']['playerCaptionsTracklistRenderer']['captionTracks']
                for track in captions:
                    if track['languageCode'] == 'en':
                        track_url = track['baseUrl']
                        res = requests.get(track_url)
                        if res.status_code == 200:
                            root_xml = ElementTree.fromstring(res.content)
                            transcript = [element.text for element in root_xml.findall('.//text')]
                            transcript = html.unescape(' '.join(transcript))
                            return transcript
        except Exception as e:
            print(f'Error occurred: {e}')
        return ''

    @classmethod
    def get_all_video_ids(cls, channel_id: str) -> list[str]:
        all_video_ids = []
        npt = None
        while True:
            res = cls.Service.search.list(
                part='snippet',
                channelId=channel_id,
                order='date',
                type='video',
                page_token=npt,
                max_results=50,
                return_json=True,
            )
            video_ids = [item['id']['videoId'] for item in res['items']]
            all_video_ids.extend(video_ids)
            npt = res.get('nextPageToken', None)
            if not npt:
                break
        return all_video_ids

    @classmethod
    def _find_channel_id(cls, handle: str | None, user: str | None) -> str:
        res = cls.Service.channels.list(
            parts='id', for_handle=handle, for_username=user, return_json=True
        )
        if 'items' in res and len(res['items']) > 0:
            channel_id = res['items'][0]['id']
            return channel_id
        return None

    @classmethod
    def get_channel_id(cls, url: str) -> str:
        channel_id = ''
        if url in cls.INDEX['channel_map']:
            channel_id = cls.INDEX['channel_map'][url]
        else:
            if '/channel/' in url:
                channel_id = url.strip().split('/')[-1]
            elif '/user/' in url:
                user = url.strip().split('/')[-1]
                channel_id = cls._find_channel_id(user=user, handle=None)
            else:
                handle = url.strip().split('/')[-1]
                channel_id = cls._find_channel_id(handle=handle, user=None)
        cls.INDEX['channel_map'][url] = channel_id
        with open(INDEX_FILE_PATH, 'w') as f:
            f.write(json.dumps(cls.INDEX, indent=2))
        return channel_id

    @classmethod
    def get_all_possible_elements(cls, target) -> []:
        old_indexes = set(cls.INDEX['indexes'])
        channel_id = cls.get_channel_id(url=target.url)
        new_indexes = set(cls.get_all_video_ids(channel_id=channel_id))
        new_target_elements = new_indexes - old_indexes
        print(new_target_elements)
        return [YouTubeScraper(element_id=id) for id in new_target_elements]
