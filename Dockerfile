FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_BASE_URL=http://localhost:2404
ARG VITE_STRIPE_PUBLISHABLE_KEY=
ARG VITE_TURNSTILE_SITE_KEY=
#defines build-time variables

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY
#ENV sets runtime environment variables

COPY package*.json ./

RUN npm ci
# npm ci installs exactly what’s in package-lock.json, ensuring reproducible builds.
# Faster than npm install because it skips dependency resolution and tree upda
COPY . .

RUN npm run build


FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]




# cd ./keep-frontend

# # Build the image with build args
# docker build \
#   --build-arg VITE_API_BASE_URL=http://localhost:2404 \
#   --build-arg VITE_STRIPE_PUBLISHABLE_KEY= \
#   --build-arg VITE_TURNSTILE_SITE_KEY= \
#   -t keep-frontend:latest .

# # Run the container
# docker run -d \
#   --name frontend_service \
#   --network app_network \
#   -p 3000:80 \
#   keep-frontend:latest

