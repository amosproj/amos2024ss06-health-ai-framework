import json
import os
import re
import wave
from typing import List
from urllib.parse import urlparse
from urllib.request import Request, urlopen, urlretrieve
from zipfile import ZipFile

import requests
from bs4 import BeautifulSoup
from langchain.schema import Document
from pydub import AudioSegment
from vosk import KaldiRecognizer, Model

from src.backend.log.log import write_to_log
from src.backend.Scrapers.BaseScraper.base_scraper import BaseScraper
from src.backend.Scrapers.PodCast import INDEX_FILE_PATH, RAW_DIR_PATH, VOSK_DIR_PATH
from src.backend.Types.pod_cast import TypePodCastScrappingData
from src.backend.Utils.splitter import get_text_chunks


class PodCastScraper(BaseScraper):
    INDEX = json.loads(open(INDEX_FILE_PATH).read())

    def __init__(self, element_id: str):
        super().__init__(element_id=element_id)

    @classmethod
    def index_file(cls) -> str:
        return INDEX_FILE_PATH

    @classmethod
    def base_dir(cls) -> str:
        return RAW_DIR_PATH

    # ---------------------------------------------------------
    # MARK: Podcast IDs control
    # ---------------------------------------------------------

    @classmethod
    def soup_maker(cls, link: str):
        """Takes a URL and returns a  object representing the HTML content of the page"""
        try:
            req_single = Request(link, headers={'User-Agent': 'Mozilla/5.0'})
            single_page = urlopen(req_single).read()
            return BeautifulSoup(single_page, 'html.parser')
        except Exception:
            return None

    @classmethod
    def query_ids(cls, url, num_podcasts) -> list[str]:
        """Queries the podcast site for podcast ids and returns them as a list"""
        try:
            ids = []
            podcast_links = PodCastScraper.search_podcast_ids(url, num_podcasts)
            ids.extend([cls.extract_podcast_id_from_url(url) for url in podcast_links])
            return ids
        except Exception as e:
            raise e

    @classmethod
    def search_podcast_ids(cls, url, num_podcasts) -> list[str]:
        """Search podcast site for podcasts related to a query and return the ids."""
        try:
            page_soup = PodCastScraper.soup_maker(url)
            # Get all the podcast from the site (ca. 300)
            article = page_soup.find('article')
            hrefs = [a['href'] for a in article.findAll('a', href=True)]

            # Take only the last num_podcasts
            hrefs = hrefs[::-1]
            if num_podcasts is not None:
                hrefs = hrefs[:num_podcasts]
            return hrefs
        except Exception as e:
            raise e

    @classmethod
    def extract_podcast_id_from_url(cls, url):
        """Extracts the podcast id from the url"""
        try:
            return url.split('/')[-2]
        except Exception as e:
            raise e

    # ---------------------------------------------------------
    # MARK: Scraping itself
    # ---------------------------------------------------------

    def download_vosk_model(self, url, extract_to=VOSK_DIR_PATH):
        try:
            # Get the filename from the URL
            filename = url.split('/')[-1]

            # Download the file
            print(f'Downloading {filename}...')
            response = requests.get(url)
            with open(filename, 'wb') as file:
                file.write(response.content)

            # Unzip the file
            print(f'Unzipping {filename}...')
            with ZipFile(filename, 'r') as zip_ref:
                zip_ref.extractall(extract_to)

            # Optionally, remove the zip file after extraction
            os.remove(filename)
            print(f'Removed {filename}.')
        except Exception as e:
            write_to_log(
                self.element_id, self.__class__.__name__, f'Failed to fetch data due to: {e}'
            )
            raise e

    def mp3_scrape(self, page_soup):
        try:
            text = page_soup.prettify()
            text = text.replace('\\/', '/').replace(' ', '')

            two_players = re.findall(r'SmartPodcastPlayer.*?=.*?}}', text)
            curr_player = two_players[0]
            json_text = '{' + curr_player.split('={')[1]
            json_data = json.loads(json_text)
            mp3_url = json_data['options']['url']

            return mp3_url
        except Exception as e:
            write_to_log(
                self.element_id, self.__class__.__name__, f'Failed to fetch data due to: {e}'
            )
            raise e

    def download_mp3(self, folder: str, link: str):
        try:
            if not os.path.exists(folder):
                os.makedirs(folder)

            filename = link.split('/')[-1]
            url = f'{folder}{filename}'
            urlretrieve(link, url)

            return filename
        except Exception as e:
            write_to_log(
                self.element_id, self.__class__.__name__, f'Failed to fetch data due to: {e}'
            )
            raise e

    def convert_to_wav(self, mp3_file):
        try:
            # assign files
            input_file = mp3_file
            output_file = input_file[:-4] + '.wav'
            # convert mp3 file to wav file
            sound = AudioSegment.from_mp3(input_file)
            sound.export(output_file, format='wav')

            return output_file
        except Exception as e:
            write_to_log(
                self.element_id, self.__class__.__name__, f'Failed to fetch data due to: {e}'
            )
            raise e

    def transcribe_pretrained(self, file_path, model_path):
        try:
            # Load Vosk model for German
            model = Model(model_path)

            # Open the WAV file
            wf = wave.open(file_path, 'rb')
            if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != 'NONE':
                print('Audio file must be WAV format mono PCM.')
                return

            # Create a recognizer object
            rec = KaldiRecognizer(model, wf.getframerate())
            rec.SetMaxAlternatives(1)
            rec.SetWords(True)

            # Process the audio file
            results = []
            while True:
                data = wf.readframes(wf.getnframes())
                if len(data) == 0:
                    break
                if rec.AcceptWaveform(data):
                    results.append(json.loads(rec.Result()))

            # Get the final result
            results.append(json.loads(rec.FinalResult()))

            # Print all recognized text
            first_result_text = results[0]['alternatives'][0]['text']
            return first_result_text
        except Exception as e:
            write_to_log(
                self.element_id, self.__class__.__name__, f'Failed to fetch data due to: {e}'
            )
            raise e

    def remove_raw_audio(self, audio_file_path):
        try:
            # Check if the file exists
            if os.path.exists(audio_file_path):
                # Remove the file
                os.remove(audio_file_path)
                print(f'Removed: {audio_file_path}')
            else:
                print(f'File does not exist: {audio_file_path}')
        except Exception as e:
            write_to_log(
                self.element_id, self.__class__.__name__, f'Failed to fetch data due to: {e}'
            )
            raise e

    def download_and_transcribe_from_podcast_id(self, title=None, path='audios/'):
        try:
            vosk_path = f'{VOSK_DIR_PATH}/{PodCastScraper.model}'
            parsed_url = urlparse(PodCastScraper.main_url)
            base_url = f'{parsed_url.scheme}://{parsed_url.netloc}/'
            link = f'{base_url}{title}'
            self._url = link
            print(f'Downloading and transcribing: {link}')

            soup = self.soup_maker(link)
            mp3_link = self.mp3_scrape(soup)
            filename = self.download_mp3(path, mp3_link)

            mp3_filepath = path + filename
            wav_filepath = self.convert_to_wav(mp3_filepath)
            # transcription = sr_transcribe(wav_filepath)
            transcription = self.transcribe_pretrained(wav_filepath, vosk_path)

            # Remove the raw audio files after transcription
            self.remove_raw_audio(mp3_filepath)
            self.remove_raw_audio(wav_filepath)

            return transcription
        except Exception as e:
            write_to_log(
                self.element_id, self.__class__.__name__, f'Failed to fetch data due to: {e}'
            )
            raise e

    def get_documents(self, data: TypePodCastScrappingData) -> List[Document]:
        transcript = data.get('transcript', '')
        chunks = get_text_chunks(transcript)
        metadata = {'title': data.get('title', ''), 'ref': data.get('ref', '')}
        documents = [Document(page_content=chunk, metadata=metadata) for chunk in chunks]
        return documents

    def _scrape(self) -> TypePodCastScrappingData:
        try:
            # download vosk model
            vosk = f'{VOSK_DIR_PATH}/{PodCastScraper.model}'
            if not os.path.exists(vosk):
                self.download_vosk_model(url=PodCastScraper.model_download)

            # download and transcribe
            transcription = self.download_and_transcribe_from_podcast_id(title=self.element_id)
            if transcription is None:
                raise ValueError('Podcast does not exist for id: ' + str(id))
            info: TypePodCastScrappingData = {
                'title': self.element_id,
                'transcript': transcription,
                'ref': self._url,
            }

        except Exception as e:
            print(e)
            info = {}

        return info

    @classmethod
    def get_all_possible_elements(cls, target) -> List[BaseScraper]:
        """Get all possible elements from the target url."""
        cls.main_url = target.url
        cls.model = target.model
        cls.model_download = target.model_download

        old_indexes = set(cls.INDEX['indexes'])
        new_indexes = set(cls.query_ids(cls.main_url, target.num_podcasts))
        new_target_elements = new_indexes - old_indexes
        return [PodCastScraper(element_id=id) for id in new_target_elements]
