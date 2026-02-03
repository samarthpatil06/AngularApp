# --- STAGE 1: Build the Angular App ---
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy code and build for production
COPY . .
RUN npx ng build --configuration production

# --- STAGE 2: Serve with Nginx ---
FROM nginx:stable-alpine

# Copy the build output from the first stage to Nginx's html folder
COPY --from=build /usr/src/app/dist/migcoin-application/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]