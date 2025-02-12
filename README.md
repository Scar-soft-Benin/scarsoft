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

### Backend:
- **Python Django** (Robust Backend Framework)
- **MySQL** (Relational Database)

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
Scar-Soft's project can be run using Docker for both frontend and backend services. This makes the setup easy and ensures that all dependencies are handled correctly.

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/Omo-oba18/scarsoft.git
   cd scarsoft
   ```

2. **Build and Start the Containers**:
   Ensure you have Docker and Docker Compose installed. To build and run the project, use the following command:
   ```sh
   docker-compose up --build
   ```

   This will:
   - Build the frontend and backend images
   - Start the containers for the frontend and backend services
   - Automatically link the services for smooth communication

3. **Access the Application**:
   - The frontend (React app) will be available at `http://localhost:5173`
   - The backend (Django app) will be available at `http://localhost:8000`

4. **Stopping the Containers**:
   To stop the running containers, use:
   ```sh
   docker-compose down
   ```

   If you want to remove the containers, images, and volumes, use:
   ```sh
   docker-compose down --volumes --rmi all
   ```

---

### 🐋 Development with Docker (Without Rebuilding Every Time)
If you want to develop without rebuilding the images each time, you can run the containers in detached mode:
```sh
docker-compose up -d
```

To view the logs for the frontend container, for example:
```sh
docker-compose logs frontend
```

---

### Without Docker (Manual Setup)
If you prefer to run the project without Docker, you can still follow these steps:

#### Start the Frontend (React + TypeScript + TailwindCSS)
```sh
cd frontend
npm install
npm run dev
```

#### Start the Backend (Django + MySQL)
```sh
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
...
```

---

## 🛠️ Contributing
We welcome contributions to improve the platform!
1. Fork the project
2. Create a branch with your feature
3. Submit a pull request

---

## 💌 Contact
For any inquiries, feel free to contact us at [contact@scar-soft.com](mailto:contact@scar-soft.com).