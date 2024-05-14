FROM ubuntu

# Update package lists and upgrade existing packages
RUN apt-get update && \
    apt-get upgrade -y

# Install necessary packages
RUN apt-get install git curl software-properties-common build-essential -y

# Add deadsnakes PPA for installing specific Python versions
RUN add-apt-repository ppa:deadsnakes/ppa

# Install Python 3.10 and venv
RUN apt-get install -y python3.10 python3.10-venv python3.10-dev

# Install pkg-config
RUN apt-get install -y pkg-config

# Create a virtual environment using Python 3.10
RUN python3.10 -m venv /opt/venv

# Activate the virtual environment
ENV PATH="/opt/venv/bin:$PATH"

# Download PDM installation script
RUN curl -sSL https://pdm-project.org/install-pdm.py | python3 -

# Add PDM bin directory to PATH
ENV PATH="/root/.local/bin:${PATH}"

# Add ffmpeg to convert MP3 files to WAV
RUN apt-get install -y ffmpeg

# Set the working directory for subsequent commands
WORKDIR health-ai-framework

# Initialize a new Git repository
RUN git init

# Copy project files into the container
COPY . .

# Install project dependencies using PDM
RUN pdm install

# USAGE => run in folder 'amos2024ss06-health-ai-framework'
# sudo docker build -f ./Dockerfile .
# spython recipe Dockerfile > Apptainer.def
# apptainer build Apptainer.sif Apptainer.def