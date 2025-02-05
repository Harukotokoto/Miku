FROM node:18

WORKDIR /app

COPY package.json ./

# 依存関係をインストール（既にインストールされている場合はスキップ）
RUN yarn install --ignore-engines --check-files

COPY . .

RUN yarn build

RUN yarn start