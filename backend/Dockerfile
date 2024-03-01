FROM node:14-alpine

WORKDIR /app
COPY package.json ./
 
RUN npm install

# Development
CMD ["npm", "run", "dev"]

# Production
RUN npm install -g pm2
CMD ["pm2-runtime", "ecosystem.config.cjs", "--env", "production"]
