# Lexio Gateway

## Technical Overview
- NodeJS  
- MongoDB  
- JWT
- Docker

## Server Architecture
![alt text](http://url/to/img.png)


## Docker commands

#### Build and push to DockerHub
```sh
$ docker build -t pierreraffa/lexio-authentication:latest .  
$ docker push pierreraffa/lexio-authentication:latest  
$ docker pull pierreraffa/lexio-authentication:latest  
```
#### Create containers
```sh
$ docker run --name lexio-authentication-mongo -p 27017:27017 -v /opt/lexio-authentication-mongo/db:/data/db -d mongo --auth 
$ docker exec -it lexio-authentication-mongo mongo admin  
  > db.createUser({ user: "admin", pwd: "password", roles:["root"]})  
  > db.auth("admin","password")  
  > use lexio-authentication  
  > db.createUser({ user: "api", pwd: "password", roles: ["readWrite"] }) 
$ docker run --name lexio-authentication -p 3010:3010 --link lexio-authentication-mongo:mongo --link lexio-purchase:lexio-purchase -d pierreraffa/lexio-authentication:latest 
```
#### Connect to the containers  
```sh
$ docker exec -it lexio-authentication /bin/bash  
$ docker run -it --rm --link lexio-authentication-mongo:mongo mongo mongo -u api -p password --authenticationDatabase lexio-authentication lexio-authentication-mongo/lexio-authentication  

```
#### Connect to the logs  
```sh
$ docker logs lexio-authentication -f
```

```
#### Connect to a db
```sh
$ docker run -it --rm --net lexioinfrastructure_default --link lexio-authentication-mongo:mongo mongo mongo -u admin -p password --authenticationDatabase admin lexio-authentication-mongo/authentication
```


