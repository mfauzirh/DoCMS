FROM node:alpine as builder

WORKDIR /usr/src/app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run-script build

FROM nginx:alpine

COPY --from=builder /usr/src/app/dist /var/www
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]