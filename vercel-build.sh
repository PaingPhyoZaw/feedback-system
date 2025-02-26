#!/bin/bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run build