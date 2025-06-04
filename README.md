# Scar-Soft - Company Website

## 💪 Scar-Soft: Digital Solutions for Your Success!
We transform your ideas into efficient and innovative solutions.

### 📝 Who Are We?
Since 2015, Scar-Soft has brought together a team of engineers, digital marketing experts, and IT recruitment specialists to support businesses in their digital transformation.

Our expertise includes:
- Software Development
- Digital Strategy
- Talent Management

We create innovative solutions tailored to our clients' needs.

---

## 🌐 Technologies Used
### Frontend:
- **React** (JavaScript Framework)
- **TypeScript** (Static Typing)
- **TailwindCSS** (Modern CSS Framework)
- **Vite** (Build Tool)

### Backend:
- **Laravel** (PHP Framework)
- **MySQL** (Relational Database)

### Infrastructure:
- **Docker** (Containerization)
- **Nginx** (Web Server)
- **PHP-FPM** (PHP Processing)

---

## 📊 Project Features

### 🌐 Public Website
The website allows visitors to:
- Discover **Scar-Soft**, our services, and achievements
- Access a **contact page** to send messages
- View the **list of projects** we have worked on
- Apply for **available job positions** at Scar-Soft

### 🛠️ Admin Dashboard
A dedicated space for secretaries and managers to manage the website:

#### 1. **Email & Client Requests Management**
- Receive messages sent via the contact page
- Ability to **reply directly** to clients

#### 2. **Recruitment Management**
- Display available job offers
- Receive and manage applications
- Automatically reject applications that do not match the job requirements

#### 3. **Project Management**
- Add **new projects**
- Include **descriptions and images**
- Display completed projects for visitors

#### 4. **Upcoming Features**
The application will evolve over time with new feature additions.

---

## 📚 Installation & Setup

### 🐳 Running the Project with Docker
Scar-Soft's project is dockerized to ensure consistent environments across team members (Linux and Windows). The setup includes services for the React frontend, Laravel backend, MySQL database, and Nginx web server.

#### Prerequisites
- Docker
- Docker Compose
- Git

#### Steps
1. **Clone the Repository**:
   ```sh
   git clone https://github.com/Omo-oba18/scarsoft.git
   cd scarsoft
   ```
2. **Set Up Environment**:
   Copy the .env.example file to server/.env for Laravel configuration:
   sh

   ```
   cp .env.example server/.env
   ```

   - Build and Start the Containers:
   Run the following command to build and start all services:
   sh

      ```
      docker-compose up -d --build
      ```

      This will:
      Build images for PHP, Nginx, and MySQL

      Start containers for the frontend (Node.js), backend (PHP-FPM), MySQL, and Nginx Link services via the scarsoft-network network

   - Install Dependencies:
      Frontend (React):
      ```
      docker-compose exec node npm install
      ```
      Backend (Laravel):
      ```
      docker-compose exec php composer install
      ```

    - Configure Laravel:
      Generate the application key:
      ``` 
      docker-compose exec php php artisan key:generate
      ```
   - Run database migrations:
   ```
   docker-compose exec php php artisan migrate
   ```
   - Access the Application:
      Frontend (React app): http://localhost:5173

      Backend (Laravel API): http://localhost/api

      MySQL (optional, for debugging): Connect to localhost:3306 with credentials scarsoft_user/secret

   - View Logs (for debugging):
   ```
   docker-compose logs <service> 
   docker-compose logs php
   ```
   Stopping the Containers:
   Stop running containers:
   
   ```
   docker-compose down
   ```

   To remove containers, volumes, and images:
   ```
   docker-compose down --volumes --rmi all
   ```
   - Development Workflow
      Frontend: Changes in client/ are hot-reloaded via Vite (http://localhost:5173).

      Backend: Changes in server/ are automatically reflected (PHP-FPM reloads).

      Database: Persistent data is stored in the mysql-data Docker volume.

   - Troubleshooting
   Permission Issues: Ensure Laravel’s storage directories are writable:
   ```
   docker-compose exec php chmod -R 775 /var/www/html storage /var/www/html/bootstrap/cache
   ```

      MySQL Connection: Verify DB_HOST=mysql in server/.env.

      Port Conflicts: If ports 80 or 3306 are in use, edit docker-compose.yml (e.g., change 80:80 to 8080:80).

