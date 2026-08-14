#!/usr/bin/env bash
set -euo pipefail

MSG="${1:-deploy: update}"
SERVER="root@114.215.190.68"          # 改成你的
REMOTE_DIR="/opt/frontProject"           # 改成服务器上的路径

git add -A
git status
git commit -m "$MSG" || echo "没有新提交，继续部署"
git push origin main

# 服务器拉代码并重新构建前端
ssh "$SERVER" "cd $REMOTE_DIR && git pull && npm install && npm run build"
echo "部署完成 → http://114.215.190.68:你的前端端口"