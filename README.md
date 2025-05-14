```markdown
# 💸 Expense Tracker Web App

A full-stack web application to track daily expenses with user authentication, data visualization using Chart.js, and a MongoDB backend.

---

## 🔧 Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Chart.js
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Others:** dotenv, cors

---

## 🚀 Features

- User Signup & Login (JWT-based)
- Add, View & Delete Expenses
- Pie Chart visualization of expenses
- Total expense summary
- Protected routes
- Responsive UI

---

## 📁 Folder Structure

```


````

---

## 🛠️ Setup Instructions

1. **Clone Repository**

```bash
git clone https://github.com/JSingh1130/expense-tracker
cd expense-tracker
````

2. **Install Dependencies**

```bash
npm install
```

3. **Setup Environment Variables**

Create a `.env` file in the root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. **Run Server**

```bash
node server.js
```

Server will run on `http://localhost:5000`

5. **Serve Frontend**

Use `Live Server` extension in VSCode or any static server to serve the `public` directory.

---

## 📦 API Endpoints

| Method | Endpoint       | Description       | Protected |
| ------ | -------------- | ----------------- | --------- |
| POST   | /signup        | Register new user | ❌         |
| POST   | /login         | Authenticate user | ❌         |
| GET    | /expenses      | Get all expenses  | ✅         |
| POST   | /expenses      | Add new expense   | ✅         |
| DELETE | /expenses/\:id | Delete an expense | ✅         |

---

## 🔐 JWT Authorization

Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---


## 🧑‍💻 Author

* [Jatinjot Singh]

---


