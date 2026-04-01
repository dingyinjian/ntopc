# 构建阶段：安装依赖并产出静态资源到 dist/
FROM node:20-alpine AS builder

WORKDIR /app

# 先复制锁文件以利用 Docker 层缓存
COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

# 构建时可通过 --build-arg 传入 Vite 环境变量（如高德 Key）
# docker build --build-arg VITE_AMAP_IP_KEY=xxx .
ARG VITE_AMAP_IP_KEY
ENV VITE_AMAP_IP_KEY=$VITE_AMAP_IP_KEY

RUN npm run build

# 运行阶段：用 Nginx 托管 SPA
FROM nginx:1.27-alpine

# 覆盖默认站点配置（history 路由回退到 index.html）
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
