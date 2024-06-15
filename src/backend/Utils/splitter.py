from typing import List

from langchain.text_splitter import RecursiveCharacterTextSplitter


def get_text_chunks(text: str) -> List[str]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500, chunk_overlap=20, length_function=len, is_separator_regex=False
    )
    return text_splitter.split_text(text=text)
