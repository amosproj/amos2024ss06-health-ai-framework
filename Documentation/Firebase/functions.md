# Firebase Functions Documentation 📚

In this section, we'll explore how to use Firebase Functions. They're a crucial part of our system. Let's dive in! 🚀

## Setting Up Environment Variables 🛠️

To ensure your Firebase Functions work correctly both locally and when deployed, follow these steps to set up your environment variables:

1. **Locate the `.env.template` File** - Navigate to the `functions` folder and find the `.env.template` file. This file contains the necessary environment variable keys for your project.
2. **Create a `.env` File** - Copy the `.env.template` file and rename the copy to `.env`. This file will be used to store your actual environment variable values. 
3. **Replace Values** - Open the `.env` file and replace the placeholder values with your actual environment variable values. This step is crucial for the proper functioning of your Firebase Functions both locally and during deployment.

By following these steps, you ensure that your Firebase Functions have the necessary environment variables to operate correctly in any environment. 🌐

## Getting Started with Firebase Functions Locally 🏁

To run Firebase Functions locally, follow these steps:

1. **Install the Firebase CLI** - Essential for both local development and deployment. [Learn more here](https://firebase.google.com/docs/cli) 🛠️
2. **Login to Firebase CLI** - Necessary only if you plan to deploy your functions. 🔑
3. **Select the Project** - Required if you're deploying the functions. 📂
4. **Confirmation** - To confirm the Firebase CLI is correctly installed, open your terminal and run: `firebase --version` ✅

## Running the Firebase Functions Emulator 🚀

To get the Firebase Functions Emulator up and running, follow these steps:

1. **Install Emulators** - If not already done, you may need to install the necessary emulators. [Learn more here](https://firebase.google.com/docs/emulator-suite/install_and_configure) 📦
2. **Initialize Emulators** - Run `firebase init emulators` to set up the emulators in your project. This step helps configure the emulators according to your project's needs. 🛠️
3. **Start the Emulator** - From the root of your repository, run `firebase emulators:start --only functions` to start the emulator. 🖥️

That's it! You're all set. All details related to the status and logs of your Firebase Functions will be available in the console once the functions start working. Keep an eye on the console for real-time updates and debugging information. 🎉

## Working with Firebase Emulator and React Native 📱

Working with the Firebase emulator and React Native can be challenging due to the servers running on different systems. The Firebase Functions run on your local machine, while the emulator or testing device runs on your phone or inside the machine. This setup leads to different `localhost` environments, making it impossible to access the functions directly from your phone.

## Overcoming Localhost Issues with Firebase and React Native 🌉

To address the challenge of different localhost environments between the Firebase emulator (running on your local machine) and your React Native app (running on a phone or emulator), we've implemented a solution using HTTP callable functions.

### Testing with HTTP Callable Functions 🧪

1. **Create HTTP Callable Functions**: These functions can be invoked via HTTP requests, making them accessible regardless of the `localhost` issue.
2. **Testing with Postman or Thunder Client**: Before integrating with your React Native app, test the HTTP callable functions using tools like Postman or Thunder Client, both available as VS Code extensions. This ensures the functions behave as expected.

### Deployment 🚀

- **Why Deployment is Necessary**: For your React Native app to access the Firebase Functions, you must deploy them. This is because the app can only interact with deployed functions, bypassing the localhost discrepancy issue.

By following these steps, you can effectively bridge the gap between your Firebase Functions and React Native app, ensuring a smooth development and testing process.
