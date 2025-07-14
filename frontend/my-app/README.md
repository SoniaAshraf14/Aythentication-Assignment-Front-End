# Frontend README - User Authentication Dashboard

## Project Title:

**User Signup & Dashboard (Frontend)**

## Author:

**Sonia**

---

## Technologies Used:

* React.js (Vite)
* Tailwind CSS
* Axios
* React Hook Form
* React Router DOM

---

## Project Features:

* Signup with validation (email, password, gender, date of birth, phone number)
* Auto-generated username (read-only for 24 hours)
* Login with JWT token
* Dashboard showing:

  * Cover photo
  * Profile image
  * Email, Gender, Date of Birth (DOB), Username (editable after 24 hours)
* Image upload for profile & cover images (Multer integrated backend)
* Logout functionality (clears token & userId from localStorage)

---

## Validations:

* **Password:** Must contain 8+ characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
* **Phone Number:** Must start with "03" and be 11 digits long (Pakistani number)
* **DOB:** Minimum age 15 years
* **Gender:** Male, Female, Custom

---

## What I Learned:

* How to handle forms with `react-hook-form`
* Axios integration with token headers
* Conditional rendering and state management
* File input handling in React
* Route protection using JWT stored in localStorage

---

## How to Run (Frontend):

```bash
cd frontend
npm install
npm run dev
```

---

## AI Contribution:

* 5% Frontend developed by **me (Sonia)**
* 95% Guidance, logic corrections & form validations helped by **ChatGPT**

---

## Folder Structure

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
└── tailwind.config.js
```

---

## Credits:

This project is created by **Sonia** as part of a personal learning journey into full-stack authentication systems using React and Node.js.
