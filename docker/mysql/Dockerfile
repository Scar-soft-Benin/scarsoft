FROM mysql:8.0

# Copy custom MySQL configuration
COPY docker/mysql/my.cnf /etc/mysql/conf.d/my.cnf

# Expose port
EXPOSE 3306

CMD ["mysqld"]