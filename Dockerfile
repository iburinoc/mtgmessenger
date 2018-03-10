# Use an official Python runtime as a parent image
FROM python:3-jessie

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD app/ /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 8000

# Run app.py when the container launches
CMD ["python", "main.py", "abc"]
