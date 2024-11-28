# Expo App with React Query and React Native Paper

This is a React Native application built using the [Expo](https://expo.dev/) framework. It leverages **React Query** for state management and server state synchronization, and **React Native Paper** for UI components.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [License](#license)

---

## Getting Started

Follow these instructions to set up and run the app on your local machine.

### Prerequisites

Ensure you have the following tools installed:

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://expo.dev/) (`npm install -g expo-cli`)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/migace/github-repositories-explorer.git
   cd github-repositories-explorer
   ```

2. Install dependencies

   ```npm install
   # or
   yarn install
   ```

### Environment Variables

The project uses an .env file to manage global variables.

#### Setting Up .env

1. Copy the .env.example file and rename it to .env:

   ```
   cp .env.example .env
   ```

2. Update the values in the .env file as per your requirements. Below is an example of the variables included:

   ```
   EXPO_PUBLIC_GITHUB_API_URL=https://api.github.com
   ```

   Note: Do not commit your .env file to version control to keep sensitive data secure.

### Running the App

1. Start the Expo development server:

   ```
   npm start
   # or
   yarn start
   ```

2. Use the Expo Go app on your mobile device or an emulator to preview the app. Scan the QR code displayed in your terminal or browser.

### License

This project is licensed under the MIT License.
