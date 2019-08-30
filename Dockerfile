FROM node
COPY . /app
WORKDIR /app
RUN npm install
RUN cd ./client && npm install && yarn build && cd ..
CMD npm start
EXPOSE 8000:8000
