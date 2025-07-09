
# Scarsoft Project Installation Guide for Developers

This guide provides the steps to set up and run the Scarsoft project, which consists of a **React Vite TypeScript frontend**, a **Laravel backend**, and a **MySQL database**, all orchestrated using Docker. The setup is fully automated, supports hot reloading for frontend development, and requires minimal manual intervention.

---

## 📋 Prerequisites

Before beginning, ensure you have the following installed on your machine:

- **[Docker](https://www.docker.com/)** – For container management.
- **[Docker Compose](https://docs.docker.com/compose/)** – For orchestrating multi-container services.
- **[Git](https://git-scm.com/)** – For cloning the repository.

Verify installations by running:

```bash
docker --version
docker-compose --version
git --version
```



## 🛠 Installation Steps

### 1. Clone the Repository

Clone the project repository to your local machine and navigate to the project directory:

```
git clone https://github.com/chablis-mahutin/scarsoft.git
cd scarsoft
```

**Note:** Replace the URL with your actual repository if different.

---

### 2. Configure Environment Variables

The project uses a `.env` file for Laravel and MySQL settings. If not already present, copy the example file:

```bash
cp .env.example .env
```

Edit the `.env` file to include database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=scarsoft
DB_USERNAME=root
DB_PASSWORD=your_secure_password
```

Ensure `DB_HOST` matches the MySQL service name (`mysql`) defined in `docker-compose.yml`.

---

### 3. Build and Start Docker Containers

Start all services in detached mode:

```bash
docker compose -f docker-compose.yml up -d --build
```

This command will:

* Build images for the frontend (`scarsoft-frontend`), backend (`scarsoft-php`), and database (`scarsoft-mysql`).
* Install frontend dependencies and start the Vite dev server.
* Launch Laravel and MySQL services.

---

### 4. Verify Services

Check that containers are running:

```bash
docker ps -a
```

You should see:

* `scarsoft-frontend`
* `scarsoft-php`
* `scarsoft-mysql`

in the "Up" state.

---

## 🌐 Access the Application

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend (Laravel API):** [http://localhost:8010](http://localhost:8010)
* **MySQL:** `localhost:3310` (use MySQL Workbench or similar)

---

## 🧪 Make Code Changes with Hot Reloading

* **Frontend:** Edit files in `client/`. Vite’s HMR will auto-refresh the browser.
* **Backend:** Edit files in `server/`, then restart the PHP container:

```bash
docker-compose restart scarsoft-php
```

> Laravel’s `php artisan serve` doesn't support hot reload.

---

## 🧰 Troubleshooting

### 🔍 Check Logs

```bash
# Frontend
docker logs -f scarsoft-frontend

# Backend
docker logs -f scarsoft-php

# MySQL
docker logs -f scarsoft-mysql
```

### ⚠️ Dependency Issues

If frontend fails to start (`vite: not found`), ensure dependencies are installed:

```bash
docker exec -it scarsoft-frontend bash
cd /app
npm install
npm run dev
```

### ⚙️ Environment Variables

Ensure `.env` values match MySQL container configuration.

### 🔌 Port Conflicts

Make sure these ports are not in use:

* `5173` (Frontend)
* `8000` (Backend)
* `3310` (MySQL)

Update `docker-compose.yml` if needed.

### 🔁 Rebuild Containers

If issues persist:

```bash
docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml build --no-cache
docker compose -f docker-compose.yml up -d
```

### 📁 Volume Issues

If frontend changes don’t reflect, modify your volume config:

Change:

```yaml
./client:/app:cached
```

To:

```yaml
./client:/app
```

Then restart the container.

---

## 📝 Additional Notes

* **Hot Reloading:** Vite supports fast reload for frontend files in `client/`.
* **Laravel Restart:** Backend requires container restart to reflect changes.
* **Database Access:** Use a MySQL GUI (e.g., Workbench) to access on port `3310`.
* **Stopping the Project:**

```bash
docker-compose down
```

---

## 🗂 Project Structure Overview

```
client/             # React Vite TypeScript frontend
server/             # Laravel backend
docker/             # Docker configs for each service
docker-compose.yml  # Main service orchestrator
.dockerignore       # Prevents mounting unnecessary files (e.g., node_modules)
```

---

## ✅ Expected Outcome

After installation, you should have:

* React Vite app at [http://localhost:5173](http://localhost:5173)
* Laravel backend at [http://localhost:8010](http://localhost:8010)
* MySQL DB running on `localhost:3310`
* No need to install dependencies manually — Docker does it all.



