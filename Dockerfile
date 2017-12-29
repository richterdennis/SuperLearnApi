# Use an official Python runtime as a parent image
FROM node:8.7

# Copy the current directory contents into the container at /app
COPY . /app

# Set the working directory to /app
WORKDIR /app

# Install dependencies
RUN npm install --only:production

# Run index.js when the container launches
CMD ["node", "index.js"]
