@echo off
title CometMarketplace Windows Launcher

start cmd /k "docker compose up"

timeout /t 3 /nobreak >nul

cd backend
start cmd /k "npm install && npx prisma migrate dev && npm run dev"

timeout /t 3 /nobreak >nul

cd ../frontend
start cmd /k "npm install && npm run dev"

timeout /t 3 /nobreak >nul

cd ../backend
start cmd /k "npx prisma studio"

start "" "http://localhost:5173"