# --- 最終コンテナ（Miku + Voicevox） ---
FROM node:18

WORKDIR /app

# Miku のコードをコピー
COPY --from=builder /app /app

# Voicevox Engine をコピー
COPY --from=voicevox /opt /opt

# Voicevox を実行するためのユーザー設定
RUN chown -R node:node /opt

# root ユーザーで start.sh を作成
USER root

# Voicevox Engine の起動スクリプトをコピー
COPY start.sh /start.sh

# 実行権限を付与
RUN chmod +x /start.sh

# node ユーザーに切り替え
USER node

CMD ["/bin/bash", "/start.sh"]
