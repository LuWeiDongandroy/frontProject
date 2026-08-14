# 简历 Demo：Vue + FastAPI 最小前后端

## 本地开发

### 1. 启动后端

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. 启动前端（另开终端）

```bash
cd client
npm install
npm run dev
```

浏览器打开 http://127.0.0.1:5173 ，点击按钮调用 `/api/hello`。

## 服务器部署（推荐 Docker）

服务器需安装 Docker / Docker Compose。把项目上传到服务器后：

```bash
docker compose up -d --build
```

访问：`http://你的服务器IP:8000`

一个容器同时提供：
- 前端页面 `/`
- 接口 `/api/hello`、`/api/health`

### 开放端口

云厂商安全组放行 **8000**（或改成 80 后映射 `80:8000`）。

## 无 Docker 时

```bash
cd client && npm install && npm run build && cd ..
cd server
source .venv/bin/activate   # 或新建虚拟环境
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

注意：需在项目根目录的上级结构下运行，保证 `client/dist` 相对 `server/main.py` 的路径正确。推荐在项目根目录执行：

```bash
cd /path/to/项目部署
uvicorn server.main:app --host 0.0.0.0 --port 8000
```
