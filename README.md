# LokSahayak

LokSahayak is an AI-powered chatbot application designed to assist users with fact-checking and document analysis. The application supports multiple languages and provides an intuitive interface for users to interact with an intelligent assistant.

## Overview

LokSahayak (लोक सहायक - "People's Helper") is a multilingual AI chatbot that helps users by:
- Providing instant responses to user queries
- Analyzing and extracting information from uploaded documents/images
- Supporting multiple languages (English, Hindi, Bengali)
- Offering voice input capabilities for accessibility

## Features

- **Multilingual Support**: Switch between English, Hindi, and Bengali with speech recognition support for each language
- **Voice Input**: Use Web Speech API for hands-free interaction
- **Image/Document Upload**: Upload images for analysis with preview functionality
- **Chat History**: Access and manage conversation history
- **Responsive Design**: Beautiful UI built with Tailwind CSS
- **Real-time Chat**: Fast, interactive communication with the AI backend
- **Fact Checker**: Dedicated fact-checking module

## Tech Stack

### Frontend
- **React 19.1.1** - UI framework
- **Vite 7.1.7** - Build tool with HMR
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **React Router DOM 7.9.6** - Client-side routing
- **React i18next 16.3.3** - Internationalization
- **Axios 1.13.2** - HTTP client
- **ESLint** - Code linting

### Development
- Node.js with npm
- ES modules

## Project Structure

```
LokSahayak/
├── src/
│   ├── App.jsx           # Main application component
│   ├── App.css           # App styles
│   ├── FactChecker.jsx   # Fact-checking feature
│   ├── Login.jsx         # Login page
│   ├── Signup.jsx        # Signup page
│   ├── i18n.js          # i18n configuration
│   ├── main.jsx         # Entry point
│   ├── index.css        # Global styles
│   └── assets/          # Static assets
├── public/              # Public static files
├── vite.config.js       # Vite configuration
├── eslint.config.js     # ESLint configuration
├── package.json         # Project dependencies
├── index.html           # HTML template
└── README.md            # This file
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dev-Saurabh-K/LokSahayak.git
cd LokSahayak
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (if needed) for backend API configuration:
```
VITE_API_URL=http://localhost:3000
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Build

Build the project for production:
```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview

Preview the production build locally:
```bash
npm run preview
```

### Linting

Check code quality:
```bash
npm run lint
```

## API Integration

The application communicates with a backend API running on `http://localhost:3000`. Key endpoints:

- **POST `/user/chat`** - Send a message to the chatbot
  - Request: `{ user: "message" }`
  - Response: Bot reply text

- **POST `/user/image/upload`** - Upload an image for analysis
  - Form data with `image` field
  - Returns: Analysis results

Ensure your backend server is running before using these features.

## Internationalization (i18n)

The application supports English, Hindi, and Bengali. Language files are configured in `src/i18n.js`. 

To switch languages, click the language button in the top toolbar. The app will:
- Change the UI language
- Update speech recognition language

## Key Components

### App Component (`src/App.jsx`)
Main application component featuring:
- Message chat interface
- Voice input with speech recognition
- Image upload and preview
- Language switching
- Chat history management
- Menu and user controls

### FactChecker Component (`src/FactChecker.jsx`)
Dedicated fact-checking feature for verifying information.

### Authentication (`Login.jsx`, `Signup.jsx`)
User authentication pages for account management.

## Browser Support

- Chrome/Edge (best support for Web Speech API)
- Firefox
- Safari (limited Speech API support)
- Mobile browsers with Web Speech API support

## Configuration

### ESLint
Code linting is configured in `eslint.config.js`. Run `npm run lint` to check for style issues.

### Vite
Build configuration is in `vite.config.js` using Tailwind CSS integration.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Built with ❤️ for making information accessible to everyone**
