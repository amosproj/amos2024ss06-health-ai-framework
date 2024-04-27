<div align="center">
  <img src="Deliverables/sprint-01/team-logo.svg" height="256" />
  <h1>Health AI Framework</h1>
  <p>Framework to create a custom AI agent.</p>
</div>


## 🚀 About Project

Welcome to the Custom AI Agent Framework, a powerful tool designed to create personalized chat interactions using a variety of language model (LLM) engines such as custom GPT, LLaMA, BARD, and more. This framework enables developers to build AI agents that engage users through text and voice inputs, gradually constructing user profiles to enhance contextual interactions. 🤖💬🔊


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


## 🛠️ Code Style Maintenance

We've implemented Ruff and pre-commit to ensure the consistency of our codebase's style. With this setup, when you attempt to commit changes, pre-commit hooks will automatically run to check the code style. If the code style passes, the commit will proceed as usual.

However, if there are any style errors detected, you have two options:

1. **Manual Fixing:** You'll need to manually fix the errors before committing again. This ensures that all changes are reviewed by human eyes before being committed.
2. **Automatic Fixing:** Alternatively, if configured, Ruff may automatically fix some of the errors. In this case, you'll still need to review the changes and ensure they meet the project's standards before proceeding with the commit.

This workflow helps maintain code quality while allowing for human oversight before changes are finalized and committed. 🚀

## 👩‍💻 Contributors

[![Contributors](https://contrib.rocks/image?repo=amosproj/amos2024ss06-health-ai-framework)](https://github.com/amosproj/amos2024ss06-health-ai-framework/graphs/contributors)