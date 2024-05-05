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
from pyyoutube import Client
from requests import get, post
from xml.etree import ElementTree
from html import unescape
from utils.file_utils import read_file, write_file

load_dotenv(find_dotenv())


class YouTube:
  """Class YouTube.

  YouTube class provides methods to interact with YouTube data through the YouTube Data
  API v3.
  """

  GOOGLE_API_KEY = getenv('GOOGLE_API_KEY')
  YOUTUBE_API_KEY = getenv('YOUTUBE_PUBLIC_API_KEY')
  YOUTUBE_BASE_URL = 'https://www.youtube.com/youtubei/v1/player?key=' + YOUTUBE_API_KEY

  HOST_CHANNEL_MAP_PATH = 'data/youtube/host_channel_map.json'
  USER_CHANNEL_MAP_PATH = 'data/youtube/user_channel_map.json'
  CHANNEL_MAP_PATH = 'data/youtube/channel_map.json'
  VIDEOS_FOLDER_PATH = 'data/youtube/videos/'

  HOST_CHANNEL_MAP = read_file(HOST_CHANNEL_MAP_PATH, 'dict')
  USER_CHANNEL_MAP = read_file(USER_CHANNEL_MAP_PATH, 'dict')
  CHANNEL_MAP = read_file(CHANNEL_MAP_PATH, 'dict')
  Service = Client(api_key=GOOGLE_API_KEY)

  @classmethod
  def __get_channel_id_for_user(cls, user_name: str) -> str | None:
    """Get the channel ID corresponding to the given user name.

    Parameters
    ----------
    user_name : str
        The user name for which to retrieve the channel ID.

    Returns
    -------
    str or None
        The channel ID corresponding to the user name, or None if not found.

    Raises
    ------
    None

    """
    if user_name in cls.USER_CHANNEL_MAP:
      return cls.USER_CHANNEL_MAP.get(user_name)
    else:
      res = cls.Service.channels.list(
        parts='id', for_username=user_name, return_json=True
      )
      if 'items' in res and res['items']:
        channel_id = res['items'][0]['id']
        cls.USER_CHANNEL_MAP[user_name] = channel_id
        write_file(cls.USER_CHANNEL_MAP_PATH, cls.USER_CHANNEL_MAP)
        return channel_id
    return None

  @classmethod
  def __get_channel_id_for_host(cls, host_name: str) -> str | None:
    """Get the channel ID corresponding to the given host name.

    Parameters
    ----------
    host_name : str
        The host name for which to retrieve the channel ID.

    Returns
    -------
    str or None
        The channel ID corresponding to the host name, or None if not found.

    Raises
    ------
    None

    """
    if host_name in cls.HOST_CHANNEL_MAP:
      return cls.HOST_CHANNEL_MAP.get(host_name)
    else:
      res = cls.Service.channels.list(parts='id', for_handle=host_name, return_json=True)
      if 'items' in res and res['items']:
        channel_id = res['items'][0]['id']
        cls.HOST_CHANNEL_MAP[host_name] = channel_id
        write_file(cls.HOST_CHANNEL_MAP_PATH, cls.HOST_CHANNEL_MAP)
        return channel_id
    return None

  @classmethod
  def get_channel_id(cls, url: str) -> str | None:
    """Get the channel ID corresponding to the given URL.

    Parameters
    ----------
    url : str
        The URL from which to retrieve the channel ID.

    Returns
    -------
    str or None
        The channel ID corresponding to the URL, or None if not found.

    """
    if 'channel/' in url:
      return url.strip().split('/')[-1]
    elif 'user/' in url:
      host_name = url.strip().split('/')[-1]
      channel_id = cls.__get_channel_id_for_user(user_name=host_name)
      return channel_id
    elif 'c/' in url:
      return None
    else:
      host_name = url.strip().split('/')[-1]
      channel_id = cls.__get_channel_id_for_host(host_name=host_name)
      return channel_id

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
  def get_all_video_ids_of_playlist(cls, playlist_id: str) -> list[str]:
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
  def get_all_video_ids_of_channel(cls, channel_id: str) -> list[str]:
    """Fetches all video IDs of a given channel.

    Args:
    ----
      channel_id (str): The ID of the YouTube channel.

    Returns:
    -------
      list[str]: A list of video IDs.

    Raises:
    ------
      Any exceptions raised by the API request.

    """
    all_video_ids = []
    next_page_token = None
    while True:
      res = cls.Service.search.list(
        parts='snippet',
        channel_id=channel_id,
        order='date',
        type='video',
        page_token=next_page_token,
        max_results=50,
        return_json=True,
      )
      video_ids = [item['id']['videoId'] for item in res['items']]
      all_video_ids.extend(video_ids)
      next_page_token = res.get('nextPageToken')
      if not next_page_token:
        break
    return all_video_ids

  @classmethod
  def get_video_transcript(cls, video_id: str, lang: str = 'en') -> str | None:
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
    # check if scrape found then return that
    if path.exists(cls.VIDEOS_FOLDER_PATH + video_id + '.txt'):
      return read_file(cls.VIDEOS_FOLDER_PATH + video_id + '.txt', 'str')

    # if scrape not found then and only call the API and store it.
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
              write_file(cls.VIDEOS_FOLDER_PATH + video_id + '.txt', text)
              return text
      else:
        print('Error:', response.status_code)
    except Exception as e:
      print('Error:', e)
    return None
