@echo off

cd resumely-express
start npm start
cd..

cd resumely-react
start npm start
cd..

cd elasticsearch-6.8.0/bin
start elasticsearch
cd..

cls

echo MERN started, happy pidev!
exit