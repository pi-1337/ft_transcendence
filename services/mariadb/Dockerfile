FROM debian:bookworm

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y mariadb-server

COPY ./db-init.bash /tmp/db-init.bash
RUN chmod +x /tmp/db-init.bash

ENTRYPOINT ["/tmp/db-init.bash"]



