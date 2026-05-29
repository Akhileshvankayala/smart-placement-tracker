# Smart Placement Tracker - Deployment Guide

This guide provides step-by-step instructions for deploying your Smart Placement Tracker application. The frontend will be deployed on **Vercel** and the backend on **Render**.

---

## Part 1: Backend Deployment on Render

Render is a modern cloud platform suitable for hosting Express/Node.js backend applications.

### 1. Prerequisite Accounts
Ensure you have:
* A [Render](https://render.com/) Account.
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database (to host the production MongoDB instance).
* A [Cloudinary](https://cloudinary.com/) Account (to store uploaded resumes).
* A Gmail account with an **App Password** created (to send automated email notifications).

### 2. Deployment Steps
1. Log in to the [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the following options:
   * **Name**: `smart-placement-tracker-backend` (or your preferred name)
   * **Region**: Choose a region close to your target audience.
   * **Branch**: `main`
   * **Root Directory**: `Backend` (⚠️ **Crucial**: This tells Render to compile and run from the `Backend` subfolder)
   * **Language**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
5. Select the **Free** instance type (or any higher tier depending on requirements).
6. Under **Advanced Settings**, add the following **Environment Variables**:

| Environment Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations and disables stack traces in error logs |
| `PORT` | `10000` (or leave default) | Render injects this automatically, but you can set it if needed |
| `MONGO_URI` | `mongodb+srv://...` | Connection string for your production MongoDB Atlas cluster |
| `JWT_SECRET` | *(generate a random string)* | Strong secret key used for signing JWT login tokens |
| `CLOUDINARY_CLOUD_NAME` | *(from Cloudinary Dashboard)* | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | *(from Cloudinary Dashboard)* | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | *(from Cloudinary Dashboard)* | Cloudinary API secret |
| `EMAIL_USER` | `example@gmail.com` | Email address from which automated emails will be sent |
| `EMAIL_PASS` | `xxxx xxxx xxxx xxxx` | 16-character Gmail App Password (not your primary password) |

7. Click **Create Web Service**. 
8. Once deployment is complete, Render will provide a public URL (e.g., `https://smart-placement-tracker-backend.onrender.com`). **Copy this URL** as you will need it for the frontend deployment.

---

## Part 2: Frontend Deployment on Vercel

Vercel is optimized for building and serving Vite-based single-page React applications.

### Deployment Steps
1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** and select **Project**.
3. Import your GitHub repository.
4. On the **Configure Project** screen, configure the following settings:
   * **Framework Preset**: `Vite` (Vercel should automatically detect this)
   * **Root Directory**: Click *Edit* and select the `frontend` folder (⚠️ **Crucial**: This ensures Vercel only builds the frontend React application)
   * **Build and Development Settings**: Keep defaults (`npm run build` and output directory `dist` will be automatically selected)
5. Expand the **Environment Variables** section and add:

| Environment Variable | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-backend.onrender.com/api` | The URL of your backend deployed on Render, appended with `/api` |

6. Click **Deploy**.
7. Vercel will build the frontend and provide you with a production URL (e.g., `https://your-project.vercel.app`).

---

## Part 3: Verification

Once both frontend and backend are deployed:
1. Open your Vercel URL.
2. Register/Login as a student or admin.
3. Test a file upload (like uploading a resume as a student) to verify it gets stored in Cloudinary correctly.
4. Test a bulk student upload via CSV (as an admin) to ensure parsing and database saves work correctly.
5. If there are any issues, you can check:
   * **Render Logs**: Select your Web Service and click on **Logs**.
   * **Vercel Logs**: Navigate to your project, click on **Deployments**, choose the latest deployment, and click **Runtime Logs**.
