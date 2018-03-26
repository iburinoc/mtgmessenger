FROM alpine:latest

# Set the working directory to /app
WORKDIR /app


RUN apk --no-cache add tini bash python3 redis

ADD app/requirements.txt /app/
RUN pip3 install --trusted-host pypi.python.org -r requirements.txt

ADD aid_cache.rdb /app/

COPY static /static

# Copy the current directory contents into the container at /app
ADD app/*.py /app/

ENTRYPOINT ["/sbin/tini", "--"]

# Make port 12000 available to the world outside this container
EXPOSE 12000

# Run app.py when the container launches
CMD ["/bin/bash", "-c", "redis-server --dbfilename aid_cache.rdb --daemonize yes; python3 main.py"]
