# Use Python 3.11 alpine for smaller base image
FROM python:3.11-alpine

# Set working directory
WORKDIR /app

# Install system dependencies (alpine packages are much smaller)
RUN apk add --no-cache \
    ffmpeg \
    gcc \
    g++ \
    musl-dev \
    linux-headers \
    libffi-dev

# Copy requirements and install only essential dependencies
COPY requirements-minimal.txt ./requirements.txt
RUN pip install --no-cache-dir --no-deps -r requirements.txt

# Copy only source code (no videos/transcripts/index to reduce size)
COPY src/ ./src/

# Create necessary directories
RUN mkdir -p videos transcripts index

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "src/app.py"]