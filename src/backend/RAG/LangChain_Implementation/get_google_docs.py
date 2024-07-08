import io
import os
import pickle
import re
from pathlib import Path

from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload


def extract_document_id_from_url(url):
    pattern = r'/d/([a-zA-Z0-9-_]+)'
    matches = re.findall(pattern, url)
    document_id = max(matches, key=len)
    return document_id


def authenticate(credentials, scopes):
    """Obtaining auth with needed apis"""
    creds = None
    # The file token.pickle stores the user's access
    # and refresh tokens, and is created automatically
    # when the authorization flow completes for the first time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(credentials, scopes)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return creds


def download_file(file_id, credentials_path, file_name):
    scopes = ['https://www.googleapis.com/auth/drive.readonly']
    credentials = authenticate(credentials_path, scopes)
    drive_service = build('drive', 'v3', credentials=credentials)

    # Export the Google Docs file as plain text
    export_mime_type = 'text/plain'
    request = drive_service.files().export_media(fileId=file_id, mimeType=export_mime_type)

    # Create a file on disk to write the exported content
    fh = io.FileIO(file_name, 'wb')
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while not done:
        status, done = downloader.next_chunk()
        print(f'Download {int(status.progress() * 100)}%.')

    # Read the content of the exported file
    with open(file_name, 'r', encoding='utf-8') as file:
        content = file.read()

    return content


# Example usage
document_id = extract_document_id_from_url(
    'https://docs.google.com/document/d/1GtLyBqhk-cu8CSo4A15WTgGDbMbL4B9LLjdvBoU3234/edit'
)
# print("Document id: ", document_id)
credentials_json = 'credentials.json'

# Define the file path in a cross-platform manner
file_name = Path('data') / 'google_docs_content.txt'
file_name.parent.mkdir(parents=True, exist_ok=True)

# TODO: make this callable from typescript with url
try:
    content = download_file(document_id, credentials_json, file_name)
    print(content)
except Exception as e:
    print(f'An error occurred: {e}')
