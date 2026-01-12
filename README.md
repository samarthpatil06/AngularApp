# 🚀 Angular Application Setup Guide

This document describes the **prerequisites**, **installation steps**, and **instructions** to run the Angular application along with its backend server.

---

## 📌 Prerequisites

Ensure the following software is installed on your system:

- **Node.js** (LTS recommended)
- **npm** (comes bundled with Node.js)
- **Angular CLI**

---

## 🛠 Installation

### 1️⃣ Install Node.js and npm

Download and install **Node.js (LTS version recommended)** from the official website:

👉 https://nodejs.org

```bash
node -v
npm -v
```

---

### 2️⃣ Install Angular CLI

```bash
npm install -g @angular/cli
```

```bash
ng version
```

---

## ▶️ Running the Application

### 1️⃣ Clone the Repository

```bash
git clone <repo_link>
cd <project_folder_name>
```

---

### 2️⃣ Project Structure

```text
backend/                # Express.js backend server
MigcoinApplication/     # Angular frontend application
```

---

### 3️⃣ Run the Backend (Express Server)

```bash
cd backend
npm install
node server.js
```

---

### 4️⃣ Run the Angular Frontend

```bash
cd MigcoinApplication
npm install
ng serve
```

---

## 🌐 Application URL

```text
http://localhost:4200
```
