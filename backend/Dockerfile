FROM node:20
# where all files of our service will be placed inside the image
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
# copy the rest of our application from the local file system to the Docker image
COPY . .
EXPOSE 3001
# tells Docker which command to run when a container is instantiated from the image
# exec form: will run the command directly without invoking a sheel
CMD [ "npm", "start" ]