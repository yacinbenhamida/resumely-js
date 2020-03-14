@echo off

taskkill /F /PID 5555
cls

echo Loading Prediction Service...

cd py-webservice/prediction
python prediction.py
cd..