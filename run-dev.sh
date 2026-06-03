#!/bin/bash
cd /sessions/69fbf58792c415220bc65c0a/workspace

# 设置环境变量使用兼容模式
export ROLLUP_SKIP_NATIVE=1
export VITE_CJS_IGNORE_WARNING=true

# 使用 npx 直接运行 vite
npx --yes vite@5.0.8 --host 0.0.0.0 --port 5173 2>&1
