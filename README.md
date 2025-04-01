# MicroOutwar

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.10.

## How to build & push docker image
1. docker build --build-arg PRODUCTION=true -t emirkovacevic/outwar-micro-x . 
2. docker tag emirkovacevic/outwar-micro-x emirkovacevic/outwar-micro-x:latest
3. docker push emirkovacevic/outwar-micro-x:latest

This image is used image: emirkovacevic/outwar-micro-x:latest in docker-compose.yml file in backend - so its pulled from docker hub. This can be build and spinned locally as well.

## Angular app
This is just regular angular app (second angular project in my life - it works at least) 