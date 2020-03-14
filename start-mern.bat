@echo off

taskkill /F /PID 5000
cd resumely-express
start npm start
cd..

taskkill /F /PID 3000
cd resumely-react
start npm start
cd..

cls

echo "MERN triggered, happy pidev!"
pause