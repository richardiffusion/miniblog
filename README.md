
# Personal Blog Project

This project is a blog post project built on React + Vite + Tailwind CSS, and Nodejs Express + MongoDB.

## Functions and Features
- Blog Edit, Post and Revise
- Dashboard
- Interactive Calendar
- Contacts (Send Email Function)

## Tech Stack
- Frontend: React 18, Vite, Tailwind CSS, shadcn/ui Components
- Backend: nodejs, express
- Database: MongoDB
- Deployment: Docker (Not included in this file but strongly recommended!)

## Installation and Operation
1. Install Requirements
``` bash
cd frontend
npm install

cd backend
npm install
```
2. Development Commands
``` bash
cd frontend
npm run dev

cd backend
npm run dev
```
3. Production Commands
``` bash
cd frontend
npm run build

cd backend
npm start
```

4. Database - MongoDB Config (for Windows,for other system like MacOS and Linux please refer to MongoDB website)
Download here: https://www.mongodb.com/try/download/community
Install and then create data file
```bash
# Create data folder
mkdir -p E:\data\db

# Start MongoDB (admin mode)
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath=E:\data\db
```

5. .env environment config
Make sure backend/.env MONGODB_URI and Email info(for Contact page) is configured.

## Preview

### Main Page
<img width="1924" height="1594" alt="image" src="https://github.com/user-attachments/assets/57c1f82e-f633-4609-a4ee-3efdb306f653" />

### Dashboard
<img width="1901" height="976" alt="image" src="https://github.com/user-attachments/assets/406fb119-9e37-45aa-be1a-c6620d132af0" />

### Contact
<img width="1911" height="1492" alt="image" src="https://github.com/user-attachments/assets/9bb71788-b70d-474a-8618-853f73a55508" />

### Posting New Article
<img width="1888" height="1606" alt="image" src="https://github.com/user-attachments/assets/778e8887-e9d5-4185-8311-84af0675ecb3" />
