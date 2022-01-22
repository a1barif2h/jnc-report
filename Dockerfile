#FROM node:14
FROM node:16

RUN apt update #&& apt add --no-cache tzdata
RUN rm -f /etc/localtime \
&& ln -sv /usr/share/zoneinfo/Asia/Dhaka /etc/localtime \
&& echo "Asia/Dhaka" > /etc/timezone

RUN mkdir -p /usr/share/fonts/truetype/SolaimanLipi_bengali
COPY /fonts/SolaimanLipi_22-02-2012.ttf  /usr/share/fonts/truetype/SolaimanLipi_bengali
# Rebuild the font cache.
#RUN fc-cache -fv
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 5010
CMD [ "node", "server.js" ]
