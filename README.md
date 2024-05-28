<div align="center">
  <img src="Deliverables/sprint-01/team-logo.svg" height="256" />
  <h1>AiLixir</h1>
  <p>Framework to create a custom AI agent.</p>
</div>


## 🚀 About the Project

Welcome to the Custom AI Agent Framework, a powerful tool designed to create personalized chat interactions using a variety of language model (LLM) engines such as GPT, LLaMA, Gemini, and more. This framework enables developers to build AI agents that engage users through text and voice inputs, gradually constructing user profiles to enhance contextual interactions. 🤖💬🔊

## 💫 The Project's Vision

Ailixir” empowers users to create and incrementally refine custom AI agents that are specialized in specific domains. It assists users in gaining useful, reliable and timely answers to domain specific questions they are interested in, eventually becoming a dependable companion in the journey to navigate effectively within the field of their choice.

## 👩‍🚀 The Project's Mission

Ailixir aims to produce an MVP for a prototyping tool that allows users, who are entrepreneurs / developers to create, refine and compare the results of custom AI agents. Ailixir can be thought of a combination of three pieces that come together to achive its goals:
- The first one aims to create an automated, modular pipeline of acquiring, storing and generating current contextual information from handpicked knowledge sources.
- The second one uses the acquired data and by utilizing a data pipeline which is modular enough to change various parameters, it produces answers independently of the underlying components. This allows the user to tweak parameters or replace components with the aim of finding an optimum combination that produces scientifically accurate and useful results. Important at this step is the ability to trace the sources that were used to generate the results. 
- The final piece of the project is the creation of a user-facing app that allows users to interact with the data pipeline via modalities such as text and voice.


## 🛠️ Prerequisites

Before you begin, make sure you have the following prerequisites installed:

| Prerequisite | Version | Installation Guide | Required |
|--------------|---------|--------------------|----------|
| Python       | 3.12    | [![Python](https://badgen.net/badge/Python/3.12/blue)](https://www.python.org/downloads/) | ✅ |
| PDM          | 2.15     | [![PDM](https://badgen.net/badge/PDM/2.15/purple)](https://pdm.fming.dev/) | ✅ |
| Docker       | 26.0     | [![Docker](https://badgen.net/badge/Docker/26.0/blue)](https://www.docker.com/get-started) | ⛔ |

- **Python 3.12:** The programming language used for development.
- **PDM:** Python Development Master, a modern Python package manager.
- **Docker:** (Optional) A containerization platform for packaging, distributing, and running applications.

Click on the installation guide links to download and install the required software.


## 🚀 Getting Started

1. ✨ **Downloading the Code**

    To get started, download the code using one of the following links:

    - **Normal HTTPS Link:**
      ``` bash
      git clone https://github.com/amosproj/amos2024ss06-health-ai-framework.git
      ```

    - **SSH Link:**

      ``` bash
      git clone git@github.com:amosproj/amos2024ss06-health-ai-framework.git
      ```

2. 🔧 **Installation and Dependency Setup**

    Run the following command in project directory to install dependencies:

    ``` bash
    pdm install
    ```

    No extra setup is required! `pdm` will handle the creation of a virtual environment and installation of all dependencies for you.

3. ▶️ **Running Your Code**

    Execute your code using the scripts defined in the `pyproject.toml` file with the command:

    ``` bash
    pdm run <<script_name>>
    ```

Once you've completed the setup steps, you're all set to dive into development work! You have everything you need to begin coding and building your project. Happy coding! 💻🚀


## 📁 Folder Structure

```
📁 ├── Deliverables 📦 (Contains project deliverables)
│   ├── README.md 📄 (Readme file for deliverables)
│   └── sprint-01 🏃‍♂️ (Sprint 01 deliverables)
│       ├── Dummy.md 📄 (Dummy markdown file)
│       ├── feature-board.csv 📄 (Feature board in CSV format)
│       ├── feature-board.png 🖼️ (Feature board image)
│       ├── imp-squared-backlog.csv 📄 (Imp squared backlog in CSV format)
│       ├── imp-squared-backlog.png 🖼️ (Imp squared backlog image)
│       ├── planning-document.pdf 📄 (Planning document in PDF format)
│       ├── team-logo.png 🖼️ (Team logo in PNG format)
│       └── team-logo.svg 🖼️ (Team logo in SVG format)
📄 ├── Dockerfile 🐳 (Dockerfile for containerization)
📁 ├── Documentation 📝 (Contains project documentation)
│   └── README.md 📄 (Readme file for documentation)
📄 ├── LICENSE 📃 (License file)
🔒 ├── pdm.lock 🔒 (Lock file for Python dependency management)
📄 ├── pyproject.toml 🐍 (Pyproject configuration file)
📄 ├── README.md 📃 (Main Readme file for the repository)
📄 ├── ruff.toml 🛠️ (Ruff configuration file)
```


## 🛠️ Code Style Maintenance

We've implemented Ruff and pre-commit to ensure the consistency of our codebase's style. With this setup, when you attempt to commit changes, pre-commit hooks will automatically run to check the code style. If the code style passes, the commit will proceed as usual.

However, if there are any style errors detected, you have two options:

1. **Manual Fixing:** You'll need to manually fix the errors before committing again. This ensures that all changes are reviewed by human eyes before being committed.
2. **Automatic Fixing:** Alternatively, if configured, Ruff may automatically fix some of the errors. In this case, you'll still need to review the changes and ensure they meet the project's standards before proceeding with the commit.

This workflow helps maintain code quality while allowing for human oversight before changes are finalized and committed. 🚀

## 👩‍💻 Contributors

[![Contributors](https://contrib.rocks/image?repo=amosproj/amos2024ss06-health-ai-framework)](https://github.com/amosproj/amos2024ss06-health-ai-framework/graphs/contributors)
