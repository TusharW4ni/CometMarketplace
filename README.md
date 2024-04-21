# CometMarketplace

A marketplace for all Comets to buy and sell items. Only UTD student and faculty can use this platform. It allows for a better experience than what is curretly offered by the UTD app.

# Codebase Setup

## Prerequisites

[Note: for Windows users, I would recommend getting [WSL](https://learn.microsoft.com/en-us/windows/wsl/about). TLDR: WSL allows you to run any linux distribution alongside Windows. This is useful for getting a more predictable and consistent experience]

### Git

- Windows - https://git-scm.com/download/win
- MacOS - https://git-scm.com/download/mac
- Linux (also applies for WSL) - https://git-scm.com/download/linux

### Node.js

- This will be done by downloading nvm or the node version manager. After getting this tool you will be able to download any version of node and change between them whenever necessary. (For this project I am using the LTS version of Node 18)
- NVM for -
  - Windows (without WSL) - https://www.freecodecamp.org/news/nvm-for-windows-how-to-download-and-install-node-version-manager-in-windows-10/
  - Windows (with WSL) - https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl
  - MacOS - https://tecadmin.net/install-nvm-macos-with-homebrew/
  - Linux - https://www.xda-developers.com/how-install-nvm-ubuntu/

### NPM

- This should be included with the Nodejs installation

### Docker Desktop

- Windows (without WSL) - https://docs.docker.com/desktop/install/windows-install/
  - Choose this option even if you have WSL. You can turn on a setting in the app to support WSL - https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers
- MacOS - https://docs.docker.com/desktop/install/mac-install/
- Linux - https://docs.docker.com/desktop/install/linux-install/

## Steps

### First-Time Steps

1. Clone the repository
2. Open a terminal and navigate to the root directory of the project
3. Run `docker compose up`, if that doesn't work `sudo docker-compose up`
4. Open another terminal and navigate to the `backend` folder
5. Run `npm install`
6. Run `npx prisma migrate reset`
7. Run `npm run dev`
8. Open another terminal and navigate to the `frontend` folder
9. Run `npm install`
10. Run `npm run dev`
11. Now you can access the website at `http://localhost:5173` in your browser [Note: Auth only works when the website is on `localhost:5173`. If you have multiple instances on `npm run dev` running, Vite will automatically change the localhost number to `:5174`, `:5175`, and so on.]
12. To look at the database
    1. Open another terminal and navigate to the `backend` folder
    2. Run `npx prisma studio`
    3. Now you can see the database in your browser at `http://localhost:5555`
13. To stop the project
    1. `Ctrl+C` in the terminal where you ran `npm run dev` in the `backend` folder
    2. `Ctrl+C` in the terminal where you ran `npm run dev` in the `frontend` folder
    3. `Ctrl+C` in the terminal where you ran `docker compose up` in the root directory
    4. Run `docker compose down` or `sudo docker-compose down` in the root directory

### Subsequent-Time Steps

1. Open the folder in a terminal that was downloaded when you cloned the repository
2. Run `docker compose up`, if that doesn't work `sudo docker-compose up`
3. Open another terminal and navigate to the `backend` folder
4. Run `npm run dev`
5. Open another terminal and navigate to the `frontend` folder
6. Run `npm run dev`
7. Now you can access the website at `http://localhost:5173` in your browser [Note: Auth only works when the website is on `localhost:5173`. If you have multiple instances on `npm run dev` running, Vite will automatically change the localhost number to `:5174`, `:5175`, and so on.]
8. To look at the database
   1. Open another terminal and navigate to the `backend` folder
   2. Run `npx prisma studio`
   3. Now you can see the database in your browser at `http://localhost:5555`
9. To stop the project
   1. `Ctrl+C` in the terminal where you ran `npm run dev` in the `backend` folder
   2. `Ctrl+C` in the terminal where you ran `npm run dev` in the `frontend` folder
   3. `Ctrl+C` in the terminal where you ran `docker compose up` in the root directory
   4. Run `docker compose down` or `sudo docker-compose down` in the root directory

## Project Structure

```plaintext
.
├── backend
│   ├── apis
│   ├── prisma
│   └── uploads
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   │   └── icons
│   │   ├── components
│   │   └── pages
└── notes
    └── frontend
```

<!-- ## Pictures of the Website
![Login Page](/notes/frontend/photos/login-page.jpeg)
<p align="center">Login Page</p>

![Home Page](/notes/frontend/photos/home-page.jpeg)
<p align="center">Home Page</p>

![Make a Post Page](/notes/frontend/photos/make-a-post-page.jpeg)
<p align="center">Make a Post Page</p> -->
