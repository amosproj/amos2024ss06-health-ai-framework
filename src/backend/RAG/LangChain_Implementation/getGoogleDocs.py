from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
import io
import pickle
import os

def authenticate(credentials, scopes):
        """
        Obtaining auth with needed apis
        """
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
                flow = InstalledAppFlow.from_client_secrets_file(
                    credentials,
                    scopes)
                creds = flow.run_local_server(port=0)
            # Save the credentials for the next run
            with open('token.pickle', 'wb') as token:
                pickle.dump(creds, token)

        return creds


def download_file(file_id, credentials_path):
    SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
    credentials = authenticate(credentials_path, SCOPES)
    drive_service = build('drive', 'v3', credentials=credentials)

    # Export the Google Docs file as plain text
    export_mime_type = 'text/plain'
    request = drive_service.files().export_media(fileId=file_id, mimeType=export_mime_type)

    # Create a file on disk to write the exported content
    fh = io.FileIO('exported_file.txt', 'wb')
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while not done:
        status, done = downloader.next_chunk()
        print(f"Download {int(status.progress() * 100)}%.")

    # Read the content of the exported file
    with open('exported_file.txt', 'r', encoding='utf-8') as file:
        content = file.read()

    return content

# Example usage
document_id = '1xrfrwyRCTrxiCupiKSSFgKUxiCTXgr45gPJYybnY23w'
credentials_json = 'src/backend/RAG/LangChain_Implementation/credentials.json'

#TODO: make this callable from typescript with url

download_file(document_id, credentials_json)


