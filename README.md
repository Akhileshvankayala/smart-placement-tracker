# Smart Placement Tracker 🎓🚀

The **Smart Placement Tracker** is a full-stack MERN web application designed for college Training & Placement Offices (TPO) to efficiently manage recruitment drives, student applications, company hiring workflows, and placement analytics through a centralized, automated digital platform.

## 🌟 Key Features

### For Students:
- **Intuitive Dashboard:** Track active recruitment drives, application statuses, and personalized placement analytics.
- **One-Click Apply:** Easily apply to eligible companies based on CGPA, branch, and backlogs.
- **Resume Management:** Securely upload and manage resumes (powered by Cloudinary).
- **Real-Time Tracking:** Receive automated email notifications for application status updates (e.g., Round 1, Selected, Rejected).
- **Interactive UI:** Beautiful glassmorphic modals and responsive UI built with modern React.

### For Administrators (TPO):
- **Centralized Command Center:** Manage students, recruiters, and placement statistics in one place.
- **Bulk Operations:** Upload student data via CSV parsing.
- **Company Management:** Create new company drives, set eligibility criteria (CGPA, branches, deadlines), and close/open applications.
- **Application Workflows:** Easily update applicant statuses and instantly notify students via automated emails.
- **Access Control:** Block/unblock students directly from the dashboard (with automatic email triggers).
- **Advanced Reporting:** Export comprehensive Placement Reports (Excel) populated with real-time student and company data using ExcelJS.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Axios, Lucide React, Vanilla CSS (Glassmorphism UI)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT), bcrypt.js
- **File Storage:** Cloudinary & Multer
- **Email Notifications:** Nodemailer
- **Report Generation:** ExcelJS, PapaParse

---

## 💻 Getting Started (Local Development)

### Prerequisites
Make sure you have the following installed on your machine:
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Cloudinary Account
- Gmail account (for Nodemailer App Password)

### 1. Clone the repository
```bash
git clone https://github.com/Akhileshvankayala/smart-placement-tracker.git
cd smart-placement-tracker
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory and configure the following variables:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:4000/api
```

Start the frontend development server:
```bash
npm run dev
```

---

## 🚀 Deployment Guide

This project is fully configured for production deployment on **Vercel** (Frontend) and **Render** (Backend).

### Backend Deployment (Render)
1. Push your repository to GitHub.
2. Log into Render and create a new **Web Service**.
3. Select the `Backend` folder as your Root Directory.
4. Set the build command to `npm install` and start command to `npm start`.
5. Add all your `.env` variables under the Environment tab.
6. Deploy! Render will give you a live URL (e.g., `https://your-backend.onrender.com`).

### Frontend Deployment (Vercel)
1. Log into Vercel and create a **New Project**.
2. Select your GitHub repository and set the Root Directory to `frontend`.
3. Vercel will automatically detect the Vite configuration.
4. Add the following Environment Variable:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api` (Use your actual Render URL).
5. Click **Deploy**. Vercel will build and serve your frontend, with client-side routing automatically handled via the included `vercel.json` file.

---

## 🤝 Contribution

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is open-source and available under the MIT License.
