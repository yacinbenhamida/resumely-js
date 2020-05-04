@echo off

taskkill /F /PID 5555
cls

echo Loading Python Flask Services...

cd py-webservice
python server.py
cd..