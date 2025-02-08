FROM node:20

WORKDIR /app

COPY package.json ./

# 依存関係をインストール（既にインストールされている場合はスキップ）
RUN yarn install --check-files

COPY . .

RUN yarn build

CMD ["node", "--experimental-global-webcrypto", "./dist/index.js"]
