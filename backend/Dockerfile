# Step 1: Use official Node.js image
FROM node:18

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy remaining backend code
COPY . .

# Step 6: Expose backend port
EXPOSE 3000

# Step 7: Start the backend
CMD ["node", "server.js"]
