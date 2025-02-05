#!/bin/bash

# Voicevox Engine の起動
/opt/python/bin/python3 /opt/voicevox_engine/run.py --voicelib_dir /opt/voicevox_core/ --runtime_dir /opt/onnxruntime/lib --host 0.0.0.0 --cors_policy_mode all &

# Miku の起動
node --experimental-global-webcrypto ./dist/index.js
