1. Open three terminals
2. In the first terminal go to the root directory of the project and run `docker compose up`
3. In the second terminal go to the frontend folder and run `npm install` and then `npm start`
4. In the third terminal:
   1. Go to the backend folder and run `npm install`
   2. Then run `npx prisma migrate dev`
   3. Then run `npm run dev`
