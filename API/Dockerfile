FROM node:alpine
WORKDIR /usr/src/app
COPY API/ ./
RUN npm install --production --no-audit
RUN npm run build
EXPOSE 3000
CMD npm run prod
