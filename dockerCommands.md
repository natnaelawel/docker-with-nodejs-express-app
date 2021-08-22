* docker build .
    . mean the docker file exists with in the current folder 
    build is used to create a docker image 
* docker image ls 
    ls is to list the list of docker image currently running


* docker image rm 4234234sbds
    rm removes docker image with id 4234234sbds

* docker build -t node-app-image . 
    -t gives the image name node-app-image 

* docker run -d --name node-app node-app-image
    -d is used to run the docker in a detached mode by default it runs on CLI 
    --name is used to give name for the container in this case node-app 
    node-app-image is the name of the image that we want to run 

* docker ps 
    shows the list of containers 

* EXPOSE 3000 is used only for documentation purpose 
by default docker container talks to the outside but the outside can't talk to the docker container because of the security 

* docker rm node-app 
    to remove a docker container 
    to remove a container first you have to stop then remove to do this two step in one we can use the -f flag to do both step so 
* docker rm node-app -f 
    to force the docker to delete the container 

* docker run -p 3000:3000 -d --name node-app node-app-image
    -p mean attach port
    the left 3000 is the port where the outside 
    the right 3000 is the port where we send the traffic to the container

* docker exec -it node-app bash 
    to see the file system of the container 
    -it mean opens in interactive mode 
    bash to take a look the file system of our container 

to ignore some files or folder to be ignored while copying for example node_modules and Dockerfile we will create dockerignore file and write the list of files that we want to ignore 


because the docker container is not synced from the source where there is change into the code the docker image must be rebuild to see the change. because this process is slow we have to use volume to sync the path of the docker container and the path of the source file that the code changes 

* docker run -v pathTofolderLocation:pathTofolderContainer -p 3000:3000 -d --name node-app node-app-image
    in the above location we can't do the . because it is not registered so we have to use the absolute path url so the new code is like 
* docker run -v /home/nathaniel/Documents/Development/personal/docker/nodejs-docker-app:/app -p 3000:3000 -d --name node-app node-app-image

    we can shorten the code using variables for the path of the current working folder, this is different from operating system
        in window CMD we can replace the path with %cd% 
        in window powershell we can replace the path with %{pwd} 
        in MAC or LINUX we can replace with $(pwd)
so we can write like 
* docker run -v $(pwd):/app -p 3000:3000 -d --name node-app node-app-image
    the above code might not seem worked but by default the express application will not restart after code change so we have to change a library called nodemon to listen for code change and restart the server

    we might encounter issue in window. so if nodemon won't restart the server try to use the -L flag that will solve the issue

* docker ps -a 
    since docker ps show only the container that are running but adding flag -a will show all the list of containers including the stopped one
    if the container will not work correctly it means there is an error so we can see the error using logs 

* docker logs node-app
    when we try to delete the node_modules from the source folder and run the container it will throw an error called nodemon is not installed this is happend because of folder syncing
    when we delete from the source folder the same file/folder will be deleted from the container folder 
    to prevent that we have to create an additional volume to preserve the already existed folder, so we can prevent the overriding of the node_modules  

* docker run -v $(pwd):/app -v /app/node_modules -p 3000:3000 -d --name node-app node-app-image
the bind route volume is only used in development not for production 


the syncing between the source and the container is a two way, when we create a file/folder from inside the container it also creates to the source, to prevent this we can make the syncing to read only, means the container can read the source but no write to the source 

* docker run -v $(pwd):/app:ro -v /app/node_modules -p 3000:3000 -d --name node-app node-app-image
    to make read only we can pass ro after the container root folder in this case /app:ro


using environment variable in docker add the following lines to the dockerfile
* ENV PORT 3000
* EXPOSE $PORT 

to add the environment variable 
* docker run -v "$(pwd):/app:ro" -v /app/node_modules --env PORT=4000 -p 3000:4000 -d --name node-app node-app-image

to print environmental variable in linux use printenv
* printenv 

we can pass as many environmental variable as we want but it is kind of cumbersome to list all so we have to create a file that consists of all the variables 

to list all the docker volume 
* docker volume ls

to remove the docker volume 
* docker volume rm volume_id 
* docker volume prune -> to remove all the unneccessary volumes

we can also delete all the volumes associated to the container using 
docker rm node-app -fv -> this will delete the container as well as the volume associated


to run all in once we can use docker-compose then run 
* docker-compose up -d  

to down all the running container
* docker-compose down

to down as well as to delete all the volume 
* docker-compose down -v

if there is a change that needs to rebuild the image the docker did n't know about the change in file so we have to explicitly tell to rebuild 
* docker-compose up -d --build
 


in development and product we have different docker structure so we can create different configuration for both production and development
so create a base docker-compose file called docker-compose.yml 
create development compose file called docker-compose.dev.yml 
create production compose file called docker-compose.prod.yml

then we can specifiy these files during building an image 

first the base compose file : file order matters the later override the former
* docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

in production 
* docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

to delete all the container and related volumes 
* docker-compose down -v



using docker mongodb 
* docker exec -it nodejs-docker-app_mongo_1 bash
    then we have to insert the user and password like mongo -u nathaniel -p nati1234 to shorten this two step we can use 
* docker exec -it nodejs-docker-app_mongo_1 mongo -u "nathaniel" -p "nati1234"

to preserve the database we have to create a name volume

but -v will delete all the volume that are name and unnamed so we have to stop using -v and use the prune. the prune will delete all the volume that are unused after starting the container.

stop the container with out using -v
* docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

start the container then 
* docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

after starting run the prune 
* docker volume prune

to get to know the ip address of the container we use docker inspect 
* docker inspect nodejs-docker_app_node-app_1
from the result from Networks -> IpAddress


to list docker's networks 
* docker network ls 
from the list docker compose created nodejs-docker-app_default


we can replace the ip address of the mongo container with the name of the container
*   mongoose.connect("mongodb://nathaniel:nati1234@172.28.0.2:27017/?authSource=admin", {
*   mongoose.connect("mongodb://nathaniel:nati1234@mongo:27017/?authSource=admin", {

we can ping the mongo database ipaddress from the node app container shell

we can view the ipaddress for all the containers in containers sections using the following code 
* docker network inspect nodejs-docker-app_default

we can follow the logs using -f command 
* docker logs  nodejs-docker-app_node-app_1 -f


in order to make sure the mongo container started first before the node application we will use the command depends on inside the docker compose under the node app 
