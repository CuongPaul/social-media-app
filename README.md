# Social network website

[Fansipan](https://fansipan-web.onrender.com)

## Tech stack

- Container: Docker
- Frontend: ReactJS
- Database: MongoDB
- Backend: Redis, Firebase, SocketIO, ExpressJS

## Start project on local

```
docker compose up
```

## Deploy app to production

### 1. Create a [Render](https://dashboard.render.com) account

Render account is used to create Redis server, API server and Static site. Link to Github account to deploy repository

### 2. Create a [Redis](https://dashboard.render.com/new/redis) server

It is used to store user is online and token of user

### 3. Create a [Web Service](https://dashboard.render.com/create?type=web)

This is an API server

#### Create a [Cluster](https://cloud.mongodb.com/v2/63621662cbc81618094413f5#/clusters/edit?from=ctaClusterHeader) on MongoDB Cloud

- DEPLOYMENT -> Database -> Connect

#### Create a project on [Firebase Console](https://console.firebase.google.com/u/0/)

- Project settings -> General -> Add app -> Web app
- Build -> Storage -> Rules
  ```
  service firebase.storage {
    match /b/{bucket}/o {
        match /{allPaths=**} {
          allow read, write;
        }
    }
  }
  ```

#### Create API server on Render

- Enter name of web service

- Select region **_Singapore (Southest Asia)_**

- Select branch **_main_**

- In the Root Directory section fill **_./backend_**

- In the Runtime section select **_Docker_**

- Add environment variables just like the [.env.example](./backend/.env.example) file

### 4. Create a [Static Site](https://dashboard.render.com/select-repo?type=static)

It is an user interface.

- Enter name of static site

- Select branch **_main_**

- In the Root Directory section fill **_./frontend_**

- In the Build Command section fill **_npm run build_**

- In the Publish directory section fill **_build_**

- In the Environment Variables section add **_NODE_VERSION = 14.19.0_** and more

On Redirects/Rewrites add a rule have **_Source = /\*_** and **_Destination = /_**

## UI library

- [Icons](https://fontawesome.com/search)
- [Components](https://v4.mui.com/)
