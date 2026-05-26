#!/bin/bash

echo "更新系统..."
apt-get update -y

echo "安装 Nginx..."
apt-get install -y nginx

echo "停止 Nginx..."
systemctl stop nginx

echo "创建部署目录..."
mkdir -p /var/www/office-app

echo "复制文件..."
cp -r /tmp/dist/* /var/www/office-app/

echo "配置 Nginx..."
cat > /etc/nginx/sites-available/office-app << 'EOF'
server {
    listen 80;
    server_name 101.201.173.122;

    root /var/www/office-app;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

echo "启用站点..."
ln -s /etc/nginx/sites-available/office-app /etc/nginx/sites-enabled/

echo "重启 Nginx..."
systemctl start nginx

echo "部署完成！"
echo "访问地址: http://101.201.173.122"