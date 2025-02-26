# Deployment Guide

## Prerequisites
1. A Vercel account (create one at https://vercel.com if you don't have it)
2. Vercel CLI installed (`npm i -g vercel`)
3. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up Vercel Postgres Database
1. Log in to your Vercel account
2. Go to the Storage section in your Vercel dashboard
3. Click "Create Database"
4. Select "Postgres" as your database type
5. Choose your preferred region (closest to your target audience)
6. Click "Create" to provision your database
7. Once created, you'll get a connection string. Keep this secure!

## Step 2: Configure Environment Variables
You'll need to set up the following environment variables in your Vercel project:

```env
DATABASE_URL=your_postgres_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
```

## Step 3: Deploy to Vercel
1. Install Vercel CLI if not already installed:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel CLI:
   ```bash
   vercel login
   ```

3. Deploy your application:
   ```bash
   vercel
   ```

4. Follow the CLI prompts to configure your project

## Step 4: Run Database Migrations
After deployment, you need to run the Prisma migrations:

1. Update your local .env file with the Vercel Postgres connection string
2. Run the migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Step 5: Verify Deployment
1. Visit your deployed application URL
2. Test the feedback form submission
3. Verify that data is being stored in the database
4. Check the admin dashboard functionality

## Troubleshooting
- If you encounter database connection issues, verify your DATABASE_URL environment variable
- For build errors, check the Vercel deployment logs
- Ensure all required environment variables are properly set in Vercel

## Important Notes
- Always backup your database before running migrations
- Keep your database connection string and environment variables secure
- Monitor your database usage and performance in Vercel dashboard