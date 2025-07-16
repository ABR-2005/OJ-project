FROM node:20-alpine

# Install compilers and runtime
RUN apk add --no-cache g++ python3 openjdk17-jdk

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5001
CMD ["node", "index.js"]