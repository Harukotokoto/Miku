# Node.js の環境を構築
FROM node:18 as builder

WORKDIR /app

COPY package.json ./

# 依存関係をインストール（既にインストールされている場合はスキップ）
RUN yarn install --ignore-engines --check-files

COPY . .

RUN yarn build

# --- Voicevox Engine のセットアップ ---
FROM voicevox/voicevox_engine:cpu-ubuntu20.04-latest as voicevox

# gosu のインストール
RUN apt-get update && apt-get install -y gosu sudo && rm -rf /var/lib/apt/lists/*

# 必要な権限を付与
RUN chown -R user:user /opt

# --- 最終コンテナ（Miku + Voicevox） ---
FROM node:18

WORKDIR /app

# Miku のコードをコピー
COPY --from=builder /app /app

# Voicevox Engine をコピー
COPY --from=voicevox /opt /opt

# Voicevox を実行するためのユーザー設定
RUN chown -R node:node /opt

USER node

# Voicevox Engine の起動スクリプト
COPY <<EOF /start.sh
#!/bin/bash
# Voicevox Engine の起動
/opt/python/bin/python3 /opt/voicevox_engine/run.py --voicelib_dir /opt/voicevox_core/ --runtime_dir /opt/onnxruntime/lib --host 0.0.0.0 --cors_policy_mode all &

# Miku の起動
node --experimental-global-webcrypto ./dist/index.js
EOF

RUN chmod +x /start.sh

CMD ["/bin/bash", "/start.sh"]
