my-app/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   └── index.tsx
│   ├── tsconfig.json
│   └── webpack.config.js
├── server/                 # Express backend
│   ├── src/
│   │   └── index.ts
│   └── tsconfig.json
├── package.json
└── tsconfig.json           # Base config

# Main dependencies
npm install react react-dom express

# Development dependencies
npm install -D typescript webpack webpack-cli webpack-dev-server html-webpack-plugin ts-loader @types/react @types/react-dom @types/express @types/node concurrently rimraf

# Client-specific
npm install -D --prefix client @types/webpack-env

# Server-specific
npm install -D --prefix server


{
  "scripts": {
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "cd client && npx webpack serve --mode development",
    "dev:server": "cd server && npx ts-node-dev --respawn src/index.ts",
    "build": "rimraf client/dist && cd client && npx webpack --mode production && cd ../server && npx tsc",
    "start": "node server/dist/index.js"
  }
}