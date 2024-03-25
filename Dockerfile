# Build env
FROM node:18-alpine as build

WORKDIR /app/

COPY public/ /app/public
COPY src/ /app/src
COPY nginx /app/nginx
COPY package.json /app/
COPY tsconfig.json /app/

# production environment
FROM nginx:stable-alpine

# Mulit-stage build, need copy output from the "as build"
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
