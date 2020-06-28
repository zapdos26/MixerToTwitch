FROM node:alpine
WORKDIR /usr/src/app
COPY ./ ./
RUN npm install --production --no-audit
RUN npm run build
EXPOSE 3000
CMD npm run prod
