$server = "101.201.173.122"
$username = "root"
$password = "Hyh262880."

$distPath = "./dist"
$remotePath = "/var/www/office-app"

Write-Host "正在上传文件到服务器..."
scp -r $distPath ${username}@${server}:/tmp/

Write-Host "正在执行部署脚本..."
$commands = @(
    "apt-get update -y",
    "apt-get install -y nginx",
    "mkdir -p $remotePath",
    "cp -r /tmp/dist/* $remotePath/",
    "cat > /etc/nginx/sites-available/office-app << 'EOF'",
    "server {",
    "    listen 80;",
    "    server_name $server;",
    "    root $remotePath;",
    "    index index.html;",
    "    location / {",
    "        try_files `$uri `$uri/ /index.html;",
    "    }",
    "}",
    "EOF",
    "ln -sf /etc/nginx/sites-available/office-app /etc/nginx/sites-enabled/",
    "systemctl restart nginx"
)

$command = $commands -join " && "
ssh ${username}@${server} "$command"

Write-Host "部署完成！"
Write-Host "访问地址: http://$server"