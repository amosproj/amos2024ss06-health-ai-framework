FROM ubuntu

# Update package lists and upgrade existing packages
RUN apt-get update && \
    apt-get upgrade -y

# Install necessary packages
RUN apt-get install git curl software-properties-common -y

# Add deadsnakes PPA for installing specific Python versions
RUN add-apt-repository ppa:deadsnakes/ppa

# Add ffmpeg to convert MP3 files to WAV
RUN apt-get install ffmpeg

# Install Python 3.12 and venv
RUN apt-get install -y python3.12 python3.12-venv

# Install PDM (Python Development Master) package manager
RUN curl -sSL https://pdm-project.org/install-pdm.py | python3 -

# Add PDM bin directory to PATH
ENV PATH="/root/.local/bin:${PATH}"

# Set the working directory for subsequent commands
WORKDIR health-ai-framework

# Initialize a new Git repository
RUN git init

# Copy project files into the container
COPY . .

# Install project dependencies using PDM
RUN pdm install
