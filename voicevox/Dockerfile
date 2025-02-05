FROM voicevox/voicevox_engine:cpu-ubuntu20.04-latest

# gosu のインストール
RUN apt-get update && apt-get install -y gosu sudo && rm -rf /var/lib/apt/lists/*

# 必要な権限を付与
RUN chown -R user:user /opt

# ユーザー 'user' で実行
USER user

# 実行コマンド
CMD ["/opt/python/bin/python3", "./run.py", "--voicelib_dir", "/opt/voicevox_core/", "--runtime_dir", "/opt/onnxruntime/lib", "--host", "0.0.0.0", "--cors_policy_mode", "all"]