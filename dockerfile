FROM node:16-alpine 
#Set working directory to /app
WORKDIR /app

ENV PORT=5050 \  
    AWS_ACCESS_KEY=AKIAUSI6SOP4YVPPEXFV \
    AWS_SECRET_KEY=BELZE6QBLY/2d9JjPQ5iYjIn5RI4P8KJzI1e9MUXAGWH \
    MAIL_PORT=465 \
    MAIL_HOST=email-smtp.us-east-1.amazonaws.com 
 
#Copy package.json in the image
COPY package.json ./

RUN npm install

#Copy the app
COPY . ./

EXPOSE 5050

#Start the app
CMD ["node", "index.js"]