FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY app ./app

EXPOSE 80

CMD ["npm", "start"]
