FROM node:latest

RUN apt-get update && apt-get install -y iproute2

WORKDIR /app
COPY . .

RUN npm i
RUN chmod +x init.bash

ENTRYPOINT ["./init.bash"]
