
docker build .
docker run -d --restart always -p 3002:80 <IMAGE_ID>

# thus we listen in localhost:3002 in dev mode

