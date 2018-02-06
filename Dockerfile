# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:8

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

# Install `serve` to run the application.
RUN npm install -g serve

# Set the command to start the node server.
CMD serve -s build -p 80

# Copy all local files into the image.
COPY package.json package.json
RUN npm install
COPY . .

# Build for production.
RUN npm run build

# Tell Docker about the port we'll run on.
EXPOSE 80
