# ScarSoft Project

ScarSoft is a full-stack web application powered by a **Laravel backend** and a **React frontend**, designed for **local development using Docker**. It integrates a PHP-FPM backend, Nginx web server, MySQL database, and a Node.js container for React development and build processes.

---

## 📁 Project Structure

```
scarsoft/
├── client/               # React frontend (Vite + TypeScript)
├── server/               # Laravel backend
├── docker/               # Docker configurations
│   ├── frontend/         # Dockerfile for frontend build
│   ├── nginx/            # Nginx configuration
│   ├── php/              # PHP-FPM configuration
│   └── mysql/            # MySQL configuration
├── docker-compose.yml    # Docker Compose configuration
├── README.md             # Project documentation
└── .gitignore            # Git ignore file
```

---

## ✅ Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)
- A `.env` file at the root with the following variables:

```env
DB_HOST=mysql
DB_PORT=3310
DB_DATABASE=scarsoft
DB_USERNAME=root
DB_PASSWORD=secret
```

---

## 🚀 Getting Started

### 1. Build Docker Images

```bash
docker compose -f docker-compose.yml build
```

### 2. Start Docker Containers

```bash
docker compose -f docker-compose.yml up -d
```

### 3. Install Backend Dependencies

```bash
docker compose -f docker-compose.yml exec php composer install
```

### 4. Run Database Migrations

```bash
docker compose -f docker-compose.yml exec php php artisan migrate
```

### 5. Install Frontend Dependencies

```bash
docker compose -f docker-compose.yml exec node npm install
```

---

## 🌐 Access the Application

- **Frontend (Development):** [http://localhost:5173](http://localhost:5173)
- **Frontend (Production):** [http://localhost:88/frontend/](http://localhost:88/frontend/)
- **Backend (Laravel):** [http://localhost:88](http://localhost:88)
- **MySQL:** Connect via `localhost:3310` using `.env` credentials.

---

## 🛠 Optional Commands

### Generate Frontend Build

```bash
docker compose -f docker-compose.yml exec node npm run build
```

### Run ESLint

```bash
docker compose -f docker-compose.yml exec node npm run lint
```

### Run TypeScript Check

```bash
docker compose -f docker-compose.yml exec node npm run typecheck
```

### Stop All Containers

```bash
docker compose -f docker-compose.yml stop
```

### Restart Containers

```bash
docker compose -f docker-compose.yml up -d
```

---

## 🧩 Troubleshooting

- **Missing `client/build`:** Ensure `frontend-build` service runs correctly:
  ```bash
  docker logs scarsoft-frontend-build
  ```

- **Nginx 404 Errors:** Check Nginx config and ensure the build is mounted properly.

- **DB Connection Issues:** Validate `.env` and run:
  ```bash
  docker logs scarsoft-mysql
  ```

- **Frontend Dev Server Not Working:** Ensure port `5173` is free and check:
  ```bash
  docker logs scarsoft-node
  ```

---

## 📚 Development Notes

- **Frontend:**  
  - React + Vite + TypeScript  
  - TailwindCSS  
  - GSAP + ScrollTrigger  
  - React Router

- **Backend:**  
  - Laravel + PHP 8.2  
  - Composer for dependency management

- **Docker:**  
  - Dev (Vite hot-reload) and production builds (Nginx-served)

---

## 📦 Dependencies

### Frontend

- React
- TypeScript
- TailwindCSS
- Vite
- GSAP (with ScrollTrigger)
- React Router

### Backend

- Laravel
- PHP 8.2
- Composer
- MySQL

---

## 🤝 Contributing

For issues, suggestions, or contributions, please [open an issue](../../issues) or submit a pull request.

---

## 📁 Setup Notes

If not already created, add the frontend build Dockerfile:

```bash
mkdir -p docker/frontend
touch docker/frontend/Dockerfile
```

Then populate `docker/frontend/Dockerfile` with your build instructions.

