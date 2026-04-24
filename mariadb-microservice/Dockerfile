FROM debian:bookworm

RUN apt-get update && apt-get upgrade && apt-get install -y mariadb-server

COPY ./db-init.bash /tmp/db-init.bash
RUN chmod +x /tmp/db-init.bash

EXPOSE 3306

ENTRYPOINT ["/tmp/db-init.bash"]



