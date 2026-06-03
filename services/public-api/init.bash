#!/bin/bash

echo "waiting for mariadb ..."

# until ss -tln | grep -q ':3306'; do sleep 1; done;
sleep 10;

echo "lets gooo, mariadb is alive and listening"

npx prisma db push
npx prisma generate
npm run build

exec npm start