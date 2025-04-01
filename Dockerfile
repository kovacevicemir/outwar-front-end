# Stage 1: Build Angular App
FROM node:18.19.0 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:latest

COPY --from=build /app/dist/micro-outwar/browser /usr/share/nginx/html

EXPOSE 4201
CMD ["nginx", "-g", "daemon off;"]
