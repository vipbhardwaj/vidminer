# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY src/ ./src/
COPY videos/ ./videos/
COPY transcripts/ ./transcripts/
COPY index/ ./index/

# Create necessary directories
RUN mkdir -p videos transcripts index

# Set permissions
RUN chmod -R 755 /app

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "src/app.py"]