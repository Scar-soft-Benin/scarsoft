FROM nginx:alpine

# Copy Nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy Laravel public folder and React build
COPY server/public /var/www/html/public
COPY client/build /var/www/html/public/frontend

EXPOSE 88

CMD ["nginx", "-g", "daemon off;"]