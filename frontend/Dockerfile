FROM node:14-alpine as build-stage

WORKDIR /app
COPY package.json ./

RUN npm install

# Development
CMD ["npm", "run", "start"]

# Production
COPY . .
RUN npm run build

FROM nginx:1.17-alpine
COPY --from=build-stage /app/build /var/www/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
