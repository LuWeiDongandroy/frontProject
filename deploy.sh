#!/usr/bin/env bash
set -euo pipefail

MSG="${1:-deploy: update}"
SERVER="root@114.215.190.68"          # 改成你的
REMOTE_DIR="/opt/frontProject"           # 改成服务器上的路径

git add -A
git status
git commit -m "$MSG" || echo "没有新提交，继续部署"
git push origin main

ssh "$SERVER" "cd $REMOTE_DIR && git pull && docker compose up -d --build"
echo "部署完成 → http://114.215.190.68:8000"