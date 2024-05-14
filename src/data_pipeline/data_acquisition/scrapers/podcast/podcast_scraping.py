import os
import re
import json
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
from pydub import AudioSegment
from vosk import Model, KaldiRecognizer
import wave
import datetime
from scraping_data_element import *

#import scraping_data_element
# import sys
# import os
# print(os.getcwd())
# sys.path.append(".") # Adds higher directory to python modules path.


"""
New methods to meet requirements of the orchestrator implementation
one method that scrapes one element
one method that get all links + names of website
"""
def get_podcast_links(channel_link):
    page_soup = soup_maker(channel_link)
    article = page_soup.find('article')
    link_list = [a['href'] for a in article.findAll('a', href=True)]
    return link_list

"""
gets a ScrapingDataElement object, which has the URL of a specific podcast
fills the ScrapingDataElement with all needed information and the transcribed text
returns the ScrapingDataElement back to the Orchestrator
"""
def download_element(podcast_object: ScrapingDataElement):
    #testing
    folder = "audios/"
    #num_url = 3
    model = "vosk-model-small-en-us-0.15"
    #testing end

    soup = soup_maker(podcast_object.url)
    mp3_link = mp3_scrape(soup)
    filename = download_mp3(folder, mp3_link)
    #TODO:ab hier error
    mp3_filepath = folder+filename
    print(mp3_filepath)
    wav_filepath = convert_to_wav_sox(mp3_filepath)
    # transcription = sr_transcribe(wav_filepath)
    transcription = transcribe_pretrained(wav_filepath, model)
    podcast_object.text_data = transcription
    podcast_object.metadata = Metadata(filename)

    return podcast_object

"""
The load_url_from_json() function loads a URL from a JSON configuration file.
"""
def load_url_from_json():
    # Extract data from json
    filename = 'config.json'
    relative_path = os.path.join('../..', filename)
    absolute_path = os.path.abspath(relative_path)

    # Check if the file exists
    if os.path.exists(absolute_path):
        # Load JSON data from the file
        with open(absolute_path, 'r') as file:
            json_data = json.load(file)
        # Access the loaded JSON data
        print("JSON data loaded from the file in the parent directory.")
    else:
        print("File does not exist in the parent directory.")

    # Take first URL of firs
    archive_url = json_data['podcasts_targets'][0]['urls'][0]
    return archive_url


"""
The soup_maker() function takes a URL as input and returns a BeautifulSoup object
representing the HTML content of the page
"""
def soup_maker(link: str):
    req_single = Request(link , headers={'User-Agent': 'Mozilla/5.0'})
    single_page = urlopen(req_single).read()
    return BeautifulSoup(single_page, "html.parser")


"""
The mp3_scrape() function extracts the MP3 URL from
the HTML content using regular expressions
"""
def mp3_scrape(page_soup):
    text = page_soup.prettify()
    text = text.replace("\\/", "/").replace(" ", "")

    two_players = re.findall(r'SmartPodcastPlayer.*?=.*?}}', text)
    curr_player = two_players[0]
    json_text = '{'+curr_player.split('={')[1]
    json_data = json.loads(json_text)
    mp3_url = json_data['options']['url']
    print(mp3_url)

    return mp3_url


"""
The download_mp3() function downloads the MP3 file
from the given URL and saves it to a specified folder.
"""
def download_mp3(folder: str, link: str):
    if not os.path.exists(folder):
        os.makedirs(folder)

    filename = link.split('/')[-1]
    url = f'{folder}{filename}'
    urlretrieve(link, url)

    return filename


"""
The convert_to_wav_sox() function converts the downloaded
MP3 file to WAV format using the pydub library.
"""
def convert_to_wav_sox(mp3_file):
    # assign files
    input_file = mp3_file
    output_file = input_file[:-4]+'.wav'

    # convert mp3 file to wav file
    sound = AudioSegment.from_mp3(input_file)
    sound.export(output_file, format="wav")
    return output_file


"""
Transcribe the audio using offline pretrained model
"""
def transcribe_pretrained(file_path, model_path):
    # Load Vosk model for German
    model = Model(model_path)

    # Open the WAV file
    wf = wave.open(file_path, "rb")
    if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != "NONE":
        print("Audio file must be WAV format mono PCM.")
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


"""
The download_and_transcribe() function combines the downloading
and transcription process for a list of URLs
"""
def download_and_transcribe(hrefs, folder, num_url, model):
    hrefs = hrefs[:num_url]
    final_texts = []

    # load_GC_API()
    for link in hrefs:
        soup = soup_maker(link)
        mp3_link = mp3_scrape(soup)
        filename = download_mp3(folder, mp3_link)

        mp3_filepath = folder+filename
        wav_filepath = convert_to_wav_sox(mp3_filepath)
        # transcription = sr_transcribe(wav_filepath)
        transcription = transcribe_pretrained(wav_filepath, model)

        # Append dictionary to list
        data = {
            "filename": filename,
            "transcription": transcription
        }
        final_texts.append(data)

    # Generate the current timestamp
    current_time = datetime.datetime.now()
    # Format the timestamp as a string
    timestamp_str = current_time.strftime("%Y%m%d_%H%M%S")
    # Create the filename with the timestamp
    output_file = f"podcast_text_{timestamp_str}.json"
    # Save list of dictionaries as JSON to a file
    with open(output_file, "w") as json_file:
        json.dump(final_texts, json_file, indent=4)

    # Print JSON string
    print(f"Transcriptions saved to {output_file}")


"""
Main function of the program.  function orchestrates
the entire process by loading the URL, scraping for MP3 links,
downloading, and transcribing the audio files.
"""
def main():

    # Load podcast url from json
    archive_url = load_url_from_json()

    # Scape archive site with all the links to podcasts
    page_soup = soup_maker(archive_url)

    # Get all the podcast from the site (ca. 300)
    article = page_soup.find('article')
    hrefs = [a['href'] for a in article.findAll('a', href=True)]

    # Downloading all mp3 links into audio folder
    folder = "audios/"
    # TODO num of links to transcribe
    num_url = 3
    model = "vosk-model-small-en-us-0.15"
    download_and_transcribe(hrefs, folder, num_url, model)

    archive_url = load_url_from_json()
    print(get_podcast_links(archive_url))


if __name__ == "__main__":
    main()

