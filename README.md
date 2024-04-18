
# Fine Tuned GPT 3.5 and GPT 4 based Latin Translator 

This is a Latin to English translator web interface that utilizes OpenAI's API to perform translations. This repository is made to be able to be easily installed and set up on any device locally and give access to the tool beyond the [website](https://translate.osmoslearn.com). By the nature of the translator, there are associated API costs to translating a given text. Because of the multiple layers of API calls in this model, the estimated cost lies at about $400 per million [tokens](https://platform.openai.com/tokenizer). On a small scale this cost is fairly insignicant, but keeping a website public for an extended period of time is not realistic as of now. This means to utilize this code, I've provided instructions to make an OpenAI account and have each user pay for their own usage and fine tune their own model. Don't worry this is made all very easy and should only take a few minutes. 

## Getting Started

These instructions will guide you through the setup process to get the translator running on your local machine for development, testing, and usage purposes.

### Prerequisites

To run this application, you will need:
- Node.js and npm
- Bun 
- An OpenAI account with an API key

### Setting Up Your Environment

#### 1. Install Node.js and npm
- **Windows:**
  - Download the Node.js installer from [Node.js website](https://nodejs.org/en/download/)
  - Run the installer and follow the on-screen instructions.
- **Mac:**
  - You can install Node.js and npm using Homebrew. First, install Homebrew by opening Terminal and running the line below, [more details here](https://brew.sh).
    ```
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
  - Then, install Node.js by running:
    ```
    brew install node
    ```

#### 2. Install Bun https://bun.sh/docs/installation
- **Windows:**
  Bun requires a minimum of Windows 10 
  To install, paste this into a terminal:
   ```
  powershell -c "irm bun.sh/install.ps1|iex"
   ```
- **Mac:**
  - Open your terminal and run:
    ```
    curl -fsSL https://bun.sh/install | bash
    ```
  -  Follow the on-screen instructions to complete the installation.

### Downloading the Code
- Navigate to the GitHub repository and download the ZIP file or clone the repository using:
git clone <https://github.com/paulrosu11/Latin_Translator.git>
- Extract the ZIP file or navigate into the cloned repository folder.
- GitHub's instructions are [here](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).
### Configuring the OpenAI API Key
- Create an account at [OpenAI](https://platform.openai.com/signup).
- Once logged in, navigate to API keys section and create a new key.
- In your project directory, find the file named `translate.ts` and replace `"replace with your api key"` on line 6 with your newly generated API key.

### Fine-Tuning the Model
- To fine-tune a model based on the provided data:
- Navigate to [OpenAI's fine-tuning page](https://platform.openai.com/docs/guides/fine-tuning), follow the instructions to submit my training data included in the code you downloaded. 
- Once the fine-tuning job is complete, replace `"Replace with your fine tuned model name, should look like ft:gpt-3.5-turbo-0125:..."` on line 51 in the `translate.ts` file with the job name provided by OpenAI.

### Running the Application
- Open a terminal at the project folder.
- Execute the following command to install dependencies:
npm install
- To start the application, run:
bun run dev
- Open your browser and access http://localhost:8001 to start using the Latin to English translator.

## Usage

Simply type or paste the Latin text you want translated into the input field on the webpage, and the translated English text will appear.

## Contributing

Feel free to fork the repository, make changes, and submit pull requests. We appreciate your contributions to improve the application!


## How the Model Works

This Latin to English translator utilizes multiple layers of API calls to different models with different prompts to produce the translations.  The rough idea is as follows: 

```mermaid
graph TD
    A[User Input Latin Text] 
    -->|GPT - 3.5 | B(Fine-Tuned Attempt 1)
    A --> |GPT - 3.5 | C(Fine-Tuned Attempt 2)
    A --> |GPT - 3.5 |D(Fine-Tuned Attempt 3)
    A -->|GPT - 3.5 | E(Fine-Tuned Attempt 4)
    A -->|GPT - 3.5 | F(Fine-Tuned Attempt 5)

    B --> |GPT -4 | G[Revision Layer 1]
    C --> |GPT -4 |H[Revision Layer 2]
    D -->  |GPT -4 |I[Revision Layer 3]
    E -->  |GPT -4 |J[Revision Layer 4]
    F -->  |GPT -4 |K[Revision Layer 5]

    G -->  L{Filter Layer}
    H --> L
    I --> L
    J --> L
    K --> L

    L --> |GPT -4 | M[Final Revision Layer]
    M --> |GPT -4 | N[Final Translation]
```

This approach consists of multiple steps and translation attempts. Given a user input of a Latin text the model proceeds to, in parallel, produce five different attempts using the model fine tuned on the data. These five attempts are then revised in a call to GPT-4, while still in parallel. Then after gathering these 5 revised attempts we do two calls to GPT-4, one to select the best translation and the other to revise it once more. 
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


