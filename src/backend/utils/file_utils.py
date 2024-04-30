"""File Utils Functions.

Author: Preet Vadaliya
Contact: preet.vadaliya@fau.de
License: MIT

This module contains utility functions for working with files in Python.

Functions:
- write_file(file_name: str, file_data: Union[str, bytes]) -> None:
  Write data to a file, creating it if it does not exist, and appending data if it does.

- read_file(file_path: str) -> Union[str, dict]:
  Read data from a file and return it as text or JSON based on file extension.

"""

import os
import json


def write_file(file_name: str, file_data: str) -> None:
  """Write data to a file.

  Args:
  ----
    file_name (str): The name of the file to write to.
    file_data (str| bytes): The data to write to the file.

  Raises:
  ------
    IOError: If the file cannot be written.

  """
  if not os.path.exists(file_name):
    with open(file_name, 'w') as file:
      file.write(file_data)
  else:
    with open(file_name, 'a') as file:
      file.write(file_data)

def read_file(file_path: str) -> str | dict:
  """Read data from a file and return it as text or JSON based on file extension.

  Args:
  ----
      file_path (str): The path of the file to read.

  Returns:
  -------
      str | dict: The data read from the file. If the file has a '.json' extension,
      it will be returned as a dictionary (parsed JSON), otherwise as a string.

  Raises:
  ------
      IOError: If the file cannot be read.
      ValueError: If the file does not have a recognized extension.

  """
  _, file_extension = os.path.splitext(file_path)
  if file_extension == '.json':
    with open(file_path, 'r') as file:
      return json.load(file)
  elif file_extension == '':
    raise ValueError('File extension not found. Cannot determine file type.')
  else:
    with open(file_path, 'r') as file:
      return file.read()
