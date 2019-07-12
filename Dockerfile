FROM node
COPY . /app
WORKDIR /app
RUN npm install
RUN cd ./client && npm install && cd ..
CMD ./run.sh
EXPOSE 3000
