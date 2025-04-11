# MicroOutwar

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.10.

## How to build & push docker image
1. docker build --build-arg PRODUCTION=true -t emirkovacevic/outwar-micro-x . 
2. docker tag emirkovacevic/outwar-micro-x emirkovacevic/outwar-micro-x:latest
3. docker push emirkovacevic/outwar-micro-x:latest
4. PLEASE READ NEXT CHAPTER FOR ENV VARIABLES! IMPORTANT

This image is used image: emirkovacevic/outwar-micro-x:latest in docker-compose.yml file in backend - so its pulled from docker hub. This can be build and spinned locally as well.



## ENVIRONMENT VARIABLES (IMPORTANT)
This can be found in environment.ts and it should use 11399 (backend port) when building image,

export const environment = {
  production: false,
  baseUrl: 'http://localhost:11399',
};

HOWEVER, WHEN DEVELOPING LOCAL USE 5082 port in same file!