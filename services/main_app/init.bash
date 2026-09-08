#!/bin/sh

npx prisma db push --accept-data-loss
npx prisma generate
npm run build

exec npm start
