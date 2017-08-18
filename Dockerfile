FROM node:boron

# Create app directory
RUN mkdir -p /var/app
WORKDIR /var/app

# Install app dependencies
COPY package.json /var/app
RUN npm install

# Bundle app source
COPY . /var/app

EXPOSE 3010

CMD [ "npm", "run", "start" ]
