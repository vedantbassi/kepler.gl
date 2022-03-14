FROM python:3.8.12

SHELL ["/bin/bash", "--login", "-i", "-c"]

RUN apt update
RUN apt install -y git curl xserver-xorg-dev libxi-dev libxext-dev

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

RUN source /root/.bashrc

RUN nvm install 12.22.10

RUN nvm use 12.22.10

RUN git clone https://github.com/keplergl/kepler.gl.git

WORKDIR /kepler.gl 

RUN npm install

CMD ["npm", "start"]
