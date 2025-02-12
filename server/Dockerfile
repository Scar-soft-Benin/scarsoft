# Use official Python image
FROM python:3.12

# Set working directory
WORKDIR /app


# Install dependencies
COPY requirements.txt .
# Install system dependencies for MySQL client
RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt


# Copy project files
COPY . .

# Expose the port
EXPOSE 8000

# Run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
