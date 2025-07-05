# Dockerfile in /frontend/chatbot
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the environment variable for the host
ENV HOST=0.0.0.0

# Expose the port for the chatbot
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
