import os
import io
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload
from google.oauth2 import service_account
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import Flow, InstalledAppFlow
import io
import pickle
import json
import os

# Function to get data from Google DocS
def get_google_key():
    return

def get_google_docs_data(document_id, credentials_json):
    # Load credentials
    credentials = service_account.Credentials.from_service_account_file(
        credentials_json, scopes=['https://www.googleapis.com/auth/documents.readonly']
    )

    # Build the service
    service = build('docs', 'v1', credentials=credentials)

    # Retrieve the document
    document = service.documents().get(documentId=document_id).execute()
    
    # Extract the content
    content = document.get('body').get('content')

    return content

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

def create_service(client_secret_file, api_name, api_version, *scopes):
    #print(client_secret_file, api_name, api_version, scopes, sep='-')
    CLIENT_SECRET_FILE = client_secret_file
    API_SERVICE_NAME = api_name
    API_VERSION = api_version
    SCOPES = [scope for scope in scopes[0]]
    #print(SCOPES)

    cred = None

    pickle_file = f'token_{API_SERVICE_NAME}_{API_VERSION}.pickle'
    # print(pickle_file)

    if os.path.exists(pickle_file):
        with open(pickle_file, 'rb') as token:
            cred = pickle.load(token)

    if not cred or not cred.valid:
        if cred and cred.expired and cred.refresh_token:
            cred.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            cred = flow.run_local_server()

        with open(pickle_file, 'wb') as token:
            pickle.dump(cred, token)

    try:
        service = build(API_SERVICE_NAME, API_VERSION, credentials=cred)
        print(API_SERVICE_NAME, 'service created successfully')
        return service
    except Exception as e:
        print('Unable to connect.')
        print(e)
        return None
    
def download_file(file_id, credentials_path):
    SCOPES = ['https://www.googleapis.com/auth/drive']

    drive_service = build('drive', 'v3', credentials=authenticate(credentials_path, SCOPES))

    request = drive_service.files().get_media(fileId=file_id)
    # #fh = io.BytesIO() # this can be used to keep in memory
    fh = io.FileIO('text.txt', 'wb') # this can be used to write to disk
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while done is False:
        status, done = downloader.next_chunk()
        print("GDrive File Download %d%%." % int(status.progress() * 100))

# Example usage
document_id = '1xrfrwyRCTrxiCupiKSSFgKUxiCTXgr45gPJYybnY23w'

# TODO: get path independent of OS
#file_path = os.path.abspath("client_secret_200802221615-2p0bmujmrfbgirkaetgi9s9r087hqh47.apps.googleusercontent.com.json")

credentials_json = 'src/backend/RAG/LangChain_Implementation/credentials.json'

#create file to write fetched text to
# with open("text.txt", 'w') as result:
#     pass
    

#document_content = get_google_docs_data(document_id, credentials_json)
download_file(document_id, credentials_json)
print(json.dumps(document_content, indent=2))


