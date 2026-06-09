# 🔹🔹 multi-stage build pattern

# 🔹 build our project using Vite
# gives this stage a name called build
FROM node:20 AS build
# environment variable that are only relevant when the image is being built
ARG VITE_BACKEND_URL=http://localhost:3001/api/v1
WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
# to create a static build of our Vite app
RUN npm run build

# 🔹 serve our static site using nginx
# gives this stage a name called final
FROM nginx AS final
# set the working directory for this stage, which nginx serves static files from
WORKDIR /usr/share/nginx/html
# copy everything from the folder /build/dist (is where Vite puts the built static files) build stage into the final stage
COPY --from=build /build/dist .
