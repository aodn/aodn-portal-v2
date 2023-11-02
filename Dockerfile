FROM node:18-alpine

WORKDIR /aodn-portal/

COPY public/ /aodn-portal/public
COPY src/ /aodn-portal/src
COPY package.json /aodn-portal/
COPY tsconfig.json /aodn-portal/

RUN npm install -g npm
RUN npm install

CMD ["npm", "start"]