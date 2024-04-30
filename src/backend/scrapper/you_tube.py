"""YouTube Data API Wrapper.

This module provides a Python wrapper for interacting with the YouTube Data API.
It includes methods to retrieve channel information, playlist IDs, video IDs, and video
transcripts.

Author: Preet Vadaliya
Email: preet.vadaliya@fau.de
License: MIT
"""

from dotenv import find_dotenv, load_dotenv
from os import getenv, path
from json import load, dump
from pyyoutube import Client
from requests import get, post
from xml.etree import ElementTree
from html import unescape

load_dotenv(find_dotenv())


class YouTube:
  """Class YouTube.

  YouTube class provides methods to interact with YouTube data through the YouTube Data
  API v3.
  """

  HOST_CHANNEL_MAP = 'data/host_channel_map.json'
  GOOGLE_API_KEY = getenv('GOOGLE_API_KEY')
  YOUTUBE_API_KEY = getenv('YOUTUBE_PUBLIC_API_KEY')
  YOUTUBE_BASE_URL = 'https://www.youtube.com/youtubei/v1/player?key=' + YOUTUBE_API_KEY
  Service = Client(api_key=GOOGLE_API_KEY)

  @classmethod
  def get_channel_id(cls, host_name: str) -> str | None:
    """Get the channel name corresponding to the given host name.

    Parameters
    ----------
      host_name (str): The host name for which to retrieve the channel name.

    Returns
    -------
      str | None: The channel name corresponding to the host name, or None if not found.

    """
    if path.isfile(cls.HOST_CHANNEL_MAP):
      with open(cls.HOST_CHANNEL_MAP, 'r') as file:
        host_channel_map = load(file)
        channel_name = host_channel_map.get(host_name)
        if channel_name:
          return channel_name

    res = cls.Service.channels.list(parts='id', for_handle=host_name, return_json=True)
    if 'items' in res and res['items']:
      channel_name = res['items'][0]['id']
      if not path.isfile(cls.HOST_CHANNEL_MAP):
        host_channel_map = {}
      else:
        with open(cls.HOST_CHANNEL_MAP, 'r') as file:
          host_channel_map = load(file)
      host_channel_map[host_name] = channel_name
      with open(cls.HOST_CHANNEL_MAP, 'w') as file:
        dump(host_channel_map, file)
      return channel_name
    return None

  @classmethod
  def get_playlist_ids(cls, channel_id: str) -> list[str]:
    """Get a list of playlist IDs associated with the given channel ID.

    Parameters
    ----------
      channel_id (str): The ID of the channel for which to retrieve playlist IDs.

    Returns
    -------
      list[str]: A list of playlist IDs associated with the channel.

    """
    playlist_ids = []
    next_page_token = None

    while True:
      res = cls.Service.playlists.list(
        parts='id',
        channel_id=channel_id,
        max_results=50,
        page_token=next_page_token,
        return_json=True,
      )
      playlist_ids.extend(item['id'] for item in res.get('items', []))
      next_page_token = res.get('nextPageToken')
      if not next_page_token:
        break

    return playlist_ids

  @classmethod
  def get_all_video_ids(cls, playlist_id: str) -> list[str]:
    """Get a list of all video IDs associated with the given playlist ID.

    Parameters
    ----------
      playlist_id (str): The ID of the playlist for which to retrieve video IDs.

    Returns
    -------
      list[str]: A list of all video IDs associated with the playlist.

    """
    try:
      next_page_token = None
      all_video_ids = []
      while True:
        res = cls.Service.playlistItems.list(
          parts='contentDetails',
          playlist_id=playlist_id,
          max_results=50,
          page_token=next_page_token,
          return_json=True,
        )
        video_ids = [item['contentDetails']['videoId'] for item in res['items']]
        all_video_ids.extend(video_ids)
        next_page_token = res.get('nextPageToken')
        if not next_page_token:
          break
      return all_video_ids
    except Exception as e:
      print('Error:', e)
      return []

  @classmethod
  def get_video_transcript(cls, video_id: str, lang: str) -> str | None:
    """Get the transcript of a video in the specified language.

    Parameters
    ----------
      video_id (str): The ID of the video for which to retrieve the transcript.
      lang (str): The language code for the desired transcript.

    Returns
    -------
      str | None: The transcript of the video in the specified language, or None if not
      available.

    """
    payload = {
      'context': {'client': {'clientName': 'WEB', 'clientVersion': '2.20210721.00.00'}},
      'videoId': video_id,
    }
    headers = {'Content-Type': 'application/json'}
    try:
      response = post(cls.YOUTUBE_BASE_URL, headers=headers, json=payload)
      if response.status_code == 200:
        data = response.json()
        captions = (
          data.get('captions').get('playerCaptionsTracklistRenderer').get('captionTracks')
        )
        for track in captions:
          if track.get('languageCode') == lang:
            track_url = track.get('baseUrl')
            res = get(track_url)
            if res.status_code == 200:
              root_xml = ElementTree.fromstring(res.text)
              extracted_text = [
                text_element.text for text_element in root_xml.findall('.//text')
              ]
              text = unescape(' '.join(extracted_text))
              return text
      else:
        print('Error:', response.status_code)
    except Exception as e:
      print('Error:', e)
    return None
