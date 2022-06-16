#Use an official Node runtime as a parent image
FROM node:14

#Set the working directory to /app
WORKDIR /docker

#Copy the current directory contents into the container at /app 
COPY package*.json ./
COPY . .
COPY app.js ./
#Install any needed packages specified in requirements.txt
RUN npm install

#Make port 5200 available to the world outside this container
EXPOSE 8080

#run app.js when the container launches
CMD ["node","app.js"]