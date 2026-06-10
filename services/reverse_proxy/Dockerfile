
FROM nginx:latest

RUN apt-get update && apt-get install -y openssl 
RUN mkdir /etc/nginx/ssl
RUN echo $'\n\n\n\n\n\n\n\n\n' | openssl req -x509 -nodes --out /etc/nginx/ssl/certificate.cert --keyout /etc/nginx/ssl/private.key

COPY nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
