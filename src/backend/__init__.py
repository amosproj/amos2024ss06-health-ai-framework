# root of backend module
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())  # load .env file

# change CWD to root
cwd = os.getcwd()
if 'src' in cwd:
  while os.path.basename(cwd) != 'src':
    cwd = os.path.dirname(cwd)
  os.chdir(os.path.dirname(cwd))
