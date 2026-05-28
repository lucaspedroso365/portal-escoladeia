#!/bin/bash
set -e
git pull
npm ci
npx prisma generate
npx prisma db push
npm run build
pm2 restart escolaia
pm2 save
