import json
import os

CONFIG_FILE_PATH = os.path.join('data', 'config.json')

if not os.path.exists(CONFIG_FILE_PATH):
  with open(CONFIG_FILE_PATH, 'w') as f:
    f.write(json.dumps({}, indent=2))
