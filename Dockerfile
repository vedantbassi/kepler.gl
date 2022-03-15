FROM python:3.8.12

SHELL ["/bin/bash", "--login", "-i", "-c"]

RUN apt update
RUN apt install -y git curl xserver-xorg-dev libxi-dev libxext-dev

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

RUN source /root/.bashrc

RUN nvm install 12.22.10

RUN nvm use 12.22.10

# RUN git clone https://github.com/keplergl/kepler.gl.git

WORKDIR /kepler.gl 

ADD . /kepler.gl

RUN npm install

RUN npm install --global yarn

ENV MapboxAccessToken pk.eyJ1IjoibWlrZTE1MDMiLCJhIjoiY2t6emRpa2VsMDA0YTNjcWw2bHBybHc2byJ9.XEO0BneJLV0LJU3LK9QgYA

RUN export PATH=/root/.nvm/versions/node/v12.22.10/bin/npm:$PATH

CMD npm start
