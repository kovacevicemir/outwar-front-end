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

# Copy the Angular build output to Nginx's HTML directory
COPY --from=build /app/dist/micro-outwar/browser /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 4201
CMD ["nginx", "-g", "daemon off;"]
