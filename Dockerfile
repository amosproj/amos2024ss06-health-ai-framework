# Use the official Python 3.10 image
FROM python:3.10

# Update and upgrade the package lists
RUN apt-get update && apt-get upgrade -y

# Install ffmpeg (required by pydub)
RUN apt-get install -y ffmpeg

# Install PDM (Python Dependency Manager)
RUN pip install pdm

# Set the working directory
WORKDIR /health-ai-framework

# Copy the entire project to the container
COPY . .

# Set environment variable to indicate the code is running inside a Docker container
ENV IS_IN_DOCKER="true"

# Install project dependencies using PDM
RUN pdm install

# Default command
# CMD ["pdm", "run"]

# DOCS
# Build the Docker image
# sudo docker build -t health-ai-framework .

# Run the Docker container
# sudo docker run -p 5000:5000 health-ai-framework

# Build and run scrapers
# sudo docker run health-ai-framework pdm run build-config
# sudo docker run health-ai-framework pdm run run-orchestrator
