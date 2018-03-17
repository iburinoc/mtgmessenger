FROM alpine:latest

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD app/ /app
ADD aid_cache.rdb /app

RUN apk --no-cache add tini bash python3 redis

RUN pip3 install --trusted-host pypi.python.org -r requirements.txt

ENTRYPOINT ["/sbin/tini", "--"]

# Make port 12000 available to the world outside this container
EXPOSE 12000

# Run app.py when the container launches
CMD ["/bin/bash", "-c", "redis-server --dbfilename aid_cache.rdb --daemonize yes; python3 main.py"]
