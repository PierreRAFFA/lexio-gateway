FROM node:boron


# Create app directory
RUN mkdir -p /var/app
WORKDIR /var/app

# Install app dependencies
COPY package.json /var/app
RUN npm install --loglevel=warn

# Bundle app source
COPY . /var/app

EXPOSE 3000

CMD [ "npm", "run", "start" ]
