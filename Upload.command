#!/bin/bash

echo Inicio

#creamos el build

#ng build --prod
ng build



#IR AL DIR
cp app.yaml ./dist/tfc-web/app.yaml
cd ./dist/tfc-web/

gcloud app deploy app.yaml --project tfc-web

echo FIN DEL PROCESO