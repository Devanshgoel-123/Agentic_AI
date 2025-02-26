# Stage 1: Build
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

ENV NEXT_PUBLIC_BASE_API_URL=https://API_BASEURL_VALUE.eddy.finance/

RUN npm install

# Copy source files
COPY . .


# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-slim

# Install PM2 globally as root
RUN npm install -g pm2

# Create a non-root user
RUN useradd --create-home --shell /bin/bash nonroot

# Set working directory
WORKDIR /app

# Copy production dependencies and build artifacts from build stage
COPY --from=build /app /app

# Change ownership of the working directory
RUN chown -R nonroot:nonroot /app

# Switch to non-root user
USER nonroot

# Install only production dependencies as non-root user
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Run the application with PM2
#CMD ["pm2-runtime", "dist/main.js"]
CMD ["npx", "pm2-runtime", "npm", "--", "start"]

