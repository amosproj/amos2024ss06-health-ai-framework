FROM python:3.10

# update ubuntu
RUN apt-get update
RUN apt-get upgrade

# install dependencies
RUN apt-get install ffmpeg -y
RUN pip install pdm

# set working directory
WORKDIR health-ai-framework

# copy all required files
COPY . .

# set env var
ENV IS_IN_DOCKER="true"

# install project dependencies using PDM
RUN pdm install
