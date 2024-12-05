# Blink Authentication Project

A facial recognition authentication system that uses eye blinks as a password mechanism.

## Project Structure
```
blink-auth/
├── public/
│   └── models/
│       ├── tiny_face_detector_model-weights_manifest.json
│       ├── tiny_face_detector_model-shard1
│       ├── face_landmark_68_model-weights_manifest.json
│       ├── face_landmark_68_model-shard1
│       ├── face_expression_model-weights_manifest.json
│       └── face_expression_model-shard1
├── src/
│   ├── components/
│   │   └── BlinkAuth.tsx
│   ├── utils/
│   │   └── faceDetection.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. Clone or download this project to your local machine
2. Navigate to the project directory: `cd blink-auth`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## How it Works

This application uses face-api.js for facial recognition and eye blink detection. Users can:
1. Set a password using the input field
2. Click "Start Blink Detection"
3. Blink their eyes to match the number of characters in their password
4. The system will authenticate based on the correct number of blinks

## Technologies Used

- React
- TypeScript
- face-api.js
- @tensorflow/tfjs
- styled-components
- Vite