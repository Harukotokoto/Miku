# ---- Miku のビルドステージ ----
FROM node:18 AS builder

WORKDIR /app

# 依存関係をインストール
COPY package.json yarn.lock ./
RUN yarn install --ignore-engines --check-files

# アプリのソースコードをコピー
COPY . .

# TypeScript のビルド
RUN yarn build

# ---- Voicevox Engine のビルドステージ ----
FROM voicevox/voicevox_engine:cpu-ubuntu20.04-latest AS voicevox

# gosu のインストール
RUN apt-get update && apt-get install -y gosu sudo && rm -rf /var/lib/apt/lists/*

# 必要な権限を付与
RUN chown -R user:user /opt

# ---- 最終的なイメージ ----
FROM node:18

WORKDIR /app

# Miku のコードをコピー
COPY --from=builder /app /app

# Voicevox Engine をコピー
COPY --from=voicevox /opt /opt

# Voicevox を実行するためのユーザー設定
RUN chown -R node:node /opt

# root ユーザーで start.sh をセットアップ
USER root

# Voicevox を起動するスクリプトをコピー
COPY start.sh /start.sh
RUN chmod +x /start.sh

# node ユーザーに切り替え
USER node

CMD ["/bin/bash", "/start.sh"]
