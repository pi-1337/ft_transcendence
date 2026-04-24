#!/bin/bash
mkdir -p /run/mysqld/

DB_NAME=name
DB_USER=user
DB_PASS=pass

# Create the seed file properly
cat << EOF > /tmp/seed.sql
CREATE DATABASE IF NOT EXISTS $DB_NAME;
CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';
FLUSH PRIVILEGES;
EOF

# using root is dangerous, but we pros
exec mysqld --user=root --bind-address=0.0.0.0 --init-file=/tmp/seed.sql
