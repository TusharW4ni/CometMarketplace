# CometMarketplace
A marketplace for all Comets to buy and sell items. Only UTD student and faculty can use this platform. It allows for a better experience than what is curretly offered by the UTD app.

## Setting Up Codebase
### Prerequisites
- Node.js
- npm
- Docker Desktop

### Steps
1. Clone the repository
2. Open a terminal and navigate to the root directory of the project
3. Run `docker compose up`
4. Open another terminal and navigate to the `backend` folder
5. Run `npm install`
6. Run `npx prisma migrate dev`
7. Run `npm run dev`
8. Open another terminal and navigate to the `frontend` folder
9. Run `npm install`
10. Run `npm run dev`
11. Now you can access the website at `http://localhost:5173` in your browser
12. To look at the database
    1.  Open another terminal and navigate to the `backend` folder
    2.  Run `npx prisma studio`
    3.  Now you can see the database in your browser at `http://localhost:5555`
13. To stop the project
    1. `Ctrl+C` in the terminal where you ran `npm run dev` in the `backend` folder
    2. `Ctrl+C` in the terminal where you ran `npm run dev` in the `frontend` folder
    3. `Ctrl+C` in the terminal where you ran `docker compose up` in the root directory
    4. Run `docker compose down` in the root directory