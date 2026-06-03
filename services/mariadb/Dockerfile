FROM debian:bookworm

# RUN apt-get update && apt-get upgrade && apt-get install -y mariadb-server
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y mariadb-server && \
    apt-get clean

COPY ./db-init.bash /tmp/db-init.bash
RUN chmod +x /tmp/db-init.bash

ENTRYPOINT ["/tmp/db-init.bash"]



