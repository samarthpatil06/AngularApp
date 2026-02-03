# --- STAGE 1: Build (Keep as is) ---
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx ng build --configuration production

# --- STAGE 2: Serve ---
FROM nginx:stable-alpine

# 1. Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# 2. Copy your custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. Copy build output (Ensure this path matches your project name!)
COPY --from=build /usr/src/app/dist/migcoin-application/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]