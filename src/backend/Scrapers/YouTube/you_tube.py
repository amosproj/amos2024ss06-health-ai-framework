import html
import json
import os
import re
from typing import List
from xml.etree import ElementTree

import pyyoutube
import requests

from src.backend.Scrapers.BaseScraper.base_scraper import BaseScraper
from src.backend.Scrapers.YouTube import INDEX_FILE_PATH, RAW_DIR_PATH
from src.backend.Types.you_tube import TypeYouTubeScrappingData
from src.backend.log.log import write_to_log


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

    def _get_video_data(self):
        payload = {
            'context': {'client': {'clientName': 'WEB', 'clientVersion': '2.20210721.00.00'}},
            'videoId': self.element_id,
        }
        headers = {'Content-Type': 'application/json'}
        response = requests.post(self.YOUTUBE_BASE_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()

    def _get_captions(self, captions):
        for track in captions:
            if track['languageCode'] == 'en':
                track_url = track['baseUrl']
                res = requests.get(track_url)
                res.raise_for_status()
                return res.content
        return None

    def _parse_transcript(self, xml_content):
        root_xml = ElementTree.fromstring(xml_content)
        transcript = [element.text for element in root_xml.findall('.//text')]
        return html.unescape(' '.join(transcript))

    def _scrape(self) -> TypeYouTubeScrappingData:
        scrap_data: TypeYouTubeScrappingData = {}
        try:
            data = self._get_video_data()
            captions = data['captions']['playerCaptionsTracklistRenderer']['captionTracks']
            video_details = data['videoDetails']
            transcript = ''
            xml_content = self._get_captions(captions)
            if xml_content:
                transcript = self._parse_transcript(xml_content)
            scrap_data['videoId'] = video_details.get('videoId', '')
            scrap_data['title'] = video_details.get('title', '')
            scrap_data['keywords'] = video_details.get('keywords', [])
            scrap_data['shortDescription'] = video_details.get('shortDescription', '')
            scrap_data['viewCount'] = int(video_details.get('viewCount', '0'))
            scrap_data['author'] = video_details.get('author', '')
            scrap_data['transcript'] = re.sub(r'\n+', ' ', transcript)
            scrap_data['ref'] = f'https://www.youtube.com/watch?v={scrap_data["videoId"]}'
            return scrap_data
        except Exception as e:
            print(f'Error: {e} No caption found for videoId: {self.element_id}')
            error_msg = f'Error: {e} No caption found for videoId: {self.element_id}'
            write_to_log(self.url, self.__class__.__name__ ,error_msg )
            return {}

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
    def get_all_possible_elements(cls, target) -> List[BaseScraper]:
        old_indexes = set(cls.INDEX['indexes'])
        channel_id = cls.get_channel_id(url=target.url)
        new_indexes = set(cls.get_all_video_ids(channel_id=channel_id))
        new_target_elements = new_indexes - old_indexes
        return [YouTubeScraper(element_id=id) for id in new_target_elements]
