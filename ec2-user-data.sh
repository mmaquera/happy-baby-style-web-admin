#!/bin/bash

# EC2 User Data Script para Happy Baby Style Backend
# Este script se ejecuta automáticamente cuando se inicia la instancia

# Actualizar sistema
yum update -y

# Instalar Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Verificar instalación
node --version
npm --version

# Instalar PM2 para manejo de procesos
npm install -g pm2

# Instalar Git
yum install -y git

# Configurar swap para t2.micro (1GB RAM)
dd if=/dev/zero of=/swapfile bs=128M count=8
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile swap swap defaults 0 0' >> /etc/fstab

# Optimizaciones del sistema para t2.micro
echo 'vm.swappiness=10' >> /etc/sysctl.conf
echo 'vm.vfs_cache_pressure=50' >> /etc/sysctl.conf

# Instalar nginx
yum install -y nginx

# Crear directorio para aplicación
mkdir -p /opt/happy-baby-style
chown ec2-user:ec2-user /opt/happy-baby-style

# Configurar nginx como proxy
cat > /etc/nginx/conf.d/app.conf << 'EOF'
server {
    listen 80;
    server_name _;

    # Headers de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Proxy para GraphQL API
    location /graphql {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 10s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
    }

    # Proxy para GraphQL Playground
    location /playground {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001;
        proxy_connect_timeout 3s;
        proxy_send_timeout 3s;
        proxy_read_timeout 3s;
    }

    # Status page para monitoreo
    location /nginx-status {
        stub_status on;
        access_log off;
        allow 127.0.0.1;
        deny all;
    }
}
EOF

# Iniciar servicios
systemctl start nginx
systemctl enable nginx

# Crear directorio de logs
mkdir -p /var/log/happy-baby-style
chown ec2-user:ec2-user /var/log/happy-baby-style

# Log de finalización
echo "$(date): EC2 setup completed successfully" > /var/log/setup.log
echo "Node.js version: $(node --version)" >> /var/log/setup.log
echo "npm version: $(npm --version)" >> /var/log/setup.log
echo "PM2 version: $(pm2 --version)" >> /var/log/setup.log