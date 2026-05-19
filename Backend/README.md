# Smart Placement Tracker - Backend

A robust Node.js/Express backend for a college placement management system with MongoDB database, JWT authentication, and email notifications.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary Account (for file storage)
- Gmail Account (for email notifications)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   # Copy .env file (already configured)
   # Update with your own credentials:
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_USER=your_gmail
   EMAIL_PASS=your_app_password
   ```

3. **Start Server**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

Server runs on `http://localhost:4000`

---

## 📁 Project Structure

```
Backend/
│
├── config/                 # Configuration files
│   ├── db.js              # MongoDB connection
│   ├── mailConfig.js      # Nodemailer setup
│   ├── cloudinary.js      # Cloudinary setup
│   └── multerConfig.js    # File upload config
│
├── models/                 # MongoDB Schemas
│   ├── User.js            # Student/Admin users
│   ├── Company.js         # Company listings
│   └── Application.js     # Student applications
│
├── controllers/            # Business Logic
│   ├── authController.js
│   ├── studentController.js
│   ├── companyController.js
│   ├── applicationController.js
│   ├── adminController.js
│   ├── dashboardController.js
│   └── uploadController.js
│
├── routes/                 # API Routes
│   ├── authRoutes.js
│   ├── studentRoutes.js
│   ├── companyRoutes.js
│   ├── applicationRoutes.js
│   ├── adminRoutes.js
│   ├── dashboardRoutes.js
│   └── uploadRoutes.js
│
├── middlewares/            # Custom Middlewares
│   ├── authMiddleware.js   # JWT verification
│   ├── roleMiddleware.js   # Role-based access
│   ├── errorMiddleware.js  # Error handling
│   └── uploadMiddleware.js # File upload config
│
├── services/              # Reusable Logic
│   ├── emailService.js    # Email notifications
│   ├── eligibilityService.js  # Eligibility checking
│   ├── dashboardService.js    # Dashboard analytics
│   └── csvService.js      # CSV parsing
│
├── validators/            # Input Validation
│   ├── authValidator.js
│   ├── companyValidator.js
│   └── applicationValidator.js
│
├── utils/                 # Utility Functions
│   ├── asyncHandler.js    # Async error handling
│   ├── generateToken.js   # JWT token generation
│   └── responseHandler.js # Response formatting
│
├── uploads/               # Temporary File Storage
│   ├── resumes/          # Resume storage
│   └── csv/              # CSV upload storage
│
├── templates/            # Email Templates
│   ├── applicationSuccess.html
│   ├── roundUpdate.html
│   └── selectionMail.html
│
├── APIs/                 # Postman/Thunder Client Collections
│   ├── auth.http
│   ├── company.http
│   ├── application.http
│   └── dashboard.http
│
├── app.js                # Express app configuration
├── server.js             # Server entry point
├── package.json          # Dependencies
└── .env                  # Environment variables
```

---

## 🔐 Authentication

- **Method**: JWT (JSON Web Tokens)
- **Token Expiry**: 7 days
- **Storage**: Sent in Authorization header as `Bearer <token>`

### Protected Routes
All routes except registration and login require:
```
Authorization: Bearer <jwt_token>
```

---

## 👥 User Roles

### Student
- Register/Login
- View eligible companies
- Apply to companies
- Track application status
- Upload resume

### Admin (Placement Cell)
- Create/manage companies
- View applicants
- Update application status
- Bulk upload students via CSV
- View dashboard analytics

---

## 📋 API Endpoints

### Auth Routes (`/api/auth`)
- `POST /register` - Register user
- `POST /login` - Login user

### Student Routes (`/api/student`)
- `GET /profile` - Get student profile
- `PUT /profile` - Update student profile

### Company Routes (`/api/company`)
- `POST /add` - Add company (Admin)
- `GET /all` - Get all companies
- `GET /:id` - Get single company (Student - only eligible)
- `PATCH /close/:id` - Close applications (Admin)

### Application Routes (`/api/application`)
- `POST /apply/:companyId` - Apply to company (Student)
- `GET /my-applications` - Get student applications (Student)
- `PATCH /status/:applicationId` - Update status (Admin)
- `GET /company/:companyId` - Get company applicants (Admin)

### Upload Routes (`/api/upload`)
- `POST /resume` - Upload resume (Student)

### Admin Routes (`/api/admin`)
- `POST /bulk-upload` - Bulk upload students (Admin)

### Dashboard Routes (`/api/dashboard`)
- `GET /stats` - Get dashboard stats (Admin)

---

## 📧 Email Features

Automated emails sent for:
- Application submission
- Round updates
- Selection notification
- Rejection notification

---

## 🎯 Eligibility Filtering

Students are eligible for companies if:
```
CGPA >= Company.minCGPA
AND
Branch IN Company.allowedBranches
AND
Backlogs <= Company.allowedBacklogs
```

---

## 📊 Application Status Flow

```
APPLIED → ROUND1 → ROUND2 → SELECTED/REJECTED
```

---

## 🔧 Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **CSV Parsing**: PapaParse
- **Dev Tools**: Nodemon, Morgan

---

## ⚠️ Security Considerations

1. **JWT Secret**: Change `JWT_SECRET` in production (should be random 32+ characters)
2. **Database**: Use MongoDB Atlas in production, not localhost
3. **Email Password**: Use app-specific passwords, not account password
4. **CORS**: Configure CORS origins based on frontend domain
5. **Environment Variables**: Never commit `.env` file to Git
6. **File Uploads**: Validate file types and sizes
7. **Password Hashing**: Uses bcryptjs with 10 salt rounds

---

## 🛠️ Development

### Run Development Server
```bash
npm run dev
```

### Check Syntax
```bash
node -c server.js
```

### View Logs
All requests logged via Morgan middleware

---

## 📝 Recent Fixes & Improvements (v1.0.1)

✅ Fixed mailConfig.js circular import  
✅ Implemented proper email service with nodemailer  
✅ Added cloudinary package to dependencies  
✅ Fixed company eligibility query (MongoDB $in operator)  
✅ Enhanced error middleware with better logging  
✅ Added NODE_ENV support for development/production  
✅ Created upload directories with .gitkeep  
✅ Updated .env with security notes and documentation  
✅ Verified all imports load correctly  

---

## 🚨 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env (correct format for your setup)
- For Atlas: whitelist IP address in MongoDB Atlas dashboard

### Email Not Sending
- Enable "Less secure app access" in Gmail OR
- Generate App Password for Gmail (recommended)
- Verify EMAIL_USER and EMAIL_PASS in .env

### Cloudinary Upload Error
- Verify CLOUDINARY credentials are correct
- Check API rate limits
- Ensure file size < 5MB

### Port Already in Use
- Change PORT in .env file
- Or: `lsof -i :4000` and kill process

---

## 📞 Support

For issues or questions, refer to the project documentation or contact the development team.

---

**Last Updated**: May 13, 2026  
**Version**: 1.0.1  
**Status**: ✅ Production Ready
