FROM node:20-slim

RUN apt-get update -y && apt-get install -y netcat-traditional openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .
RUN npm install

RUN chmod +x init.bash

EXPOSE 3000

ENTRYPOINT ["./init.bash"]
