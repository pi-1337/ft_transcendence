FROM node:latest

WORKDIR /app
COPY . .

RUN npm i
RUN npx prisma db push
RUN npx prisma generate
RUN npm run build

ENTRYPOINT ["npm", "start"]
