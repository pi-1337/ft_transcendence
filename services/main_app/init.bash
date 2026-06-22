#!/bin/sh
set -e

npx prisma db push
npx prisma generate
exec npm start