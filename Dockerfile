FROM node:18

WORKDIR /app

COPY package.json ./

# 依存関係をインストール（既にインストールされている場合はスキップ）
RUN npm install --check-files

COPY . .

RUN npm run build

CMD ["node", "--experimental-global-webcrypto", "./dist/index.js"]
