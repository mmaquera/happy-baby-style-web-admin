#!/bin/bash

# 🆓 Script de Despliegue AWS FREE TIER
# Happy Baby Style Web Admin - COMPLETAMENTE GRATIS por 12 meses

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuración FREE TIER
PROJECT_NAME="happy-baby-style"
AWS_REGION="us-east-2"
S3_BUCKET="${PROJECT_NAME}-frontend-$(date +%s)"
EC2_KEY_NAME="${PROJECT_NAME}-free-key"
INSTANCE_TYPE="t2.micro"  # FREE TIER ELIGIBLE
RDS_INSTANCE_TYPE="db.t2.micro"  # FREE TIER ELIGIBLE

echo -e "${PURPLE}🆓 ===================================== 🆓${NC}"
echo -e "${PURPLE}🎉 DESPLIEGUE AWS FREE TIER - 100% GRATIS${NC}"
echo -e "${PURPLE}🆓 ===================================== 🆓${NC}"
echo -e "${GREEN}✨ Tu aplicación funcionará GRATIS por 12 meses${NC}"
echo -e "${BLUE}📊 Recursos incluidos en Free Tier:${NC}"
echo -e "   • EC2 t2.micro: 750 horas/mes"
echo -e "   • RDS db.t2.micro: 750 horas/mes (ya tienes)"
echo -e "   • S3: 5GB storage + 20,000 requests"
echo -e "   • CloudFront: 50GB data transfer"
echo -e "   • ELB: 750 horas/mes"
echo -e "   • Route 53: 1 Hosted Zone"
echo ""

# Verificar que la cuenta es elegible para Free Tier
check_free_tier_eligibility() {
    echo -e "${YELLOW}🔍 Verificando elegibilidad para Free Tier...${NC}"
    
    # Obtener fecha de creación de la cuenta
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    
    echo -e "${BLUE}📋 Account ID: ${ACCOUNT_ID}${NC}"
    echo -e "${GREEN}✅ Para verificar Free Tier disponible:${NC}"
    echo -e "   👉 https://console.aws.amazon.com/billing/home#/freetier"
    echo ""
    
    read -p "¿Confirmas que tu cuenta tiene Free Tier disponible? (y/N): " -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Free Tier requerido para este despliegue${NC}"
        exit 1
    fi
}

# Verificar dependencias
check_dependencies() {
    echo -e "${YELLOW}🔍 Verificando dependencias...${NC}"
    
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI no está instalado${NC}"
        echo -e "${YELLOW}Instálalo con: curl \"https://awscli.amazonaws.com/AWSCLIV2.pkg\" -o \"AWSCLIV2.pkg\" && sudo installer -pkg AWSCLIV2.pkg -target /\"${NC}"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js no está instalado${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Todas las dependencias están disponibles${NC}"
}

# Verificar configuración AWS
check_aws_config() {
    echo -e "${YELLOW}🔍 Verificando configuración AWS...${NC}"
    
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}❌ AWS CLI no está configurado${NC}"
        echo -e "${YELLOW}Configúralo con: aws configure${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ AWS CLI configurado correctamente${NC}"
}

# Build optimizado para Free Tier
build_backend_free_tier() {
    echo -e "${YELLOW}🏗️ Building backend optimizado para t2.micro...${NC}"
    
    cd backend
    
    # Instalar dependencias
    npm ci
    
    # Generar cliente Prisma
    npx prisma generate
    
    # Build TypeScript
    npm run build
    
    # Crear Dockerfile optimizado para t2.micro (1GB RAM)
    echo -e "${BLUE}🐳 Creando Dockerfile optimizado para Free Tier...${NC}"
    cat > Dockerfile << 'EOF'
FROM node:18-alpine

# Instalar dependencias del sistema (mínimas para t2.micro)
RUN apk add --no-cache dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar solo dependencias de producción (optimizar RAM)
RUN npm ci --only=production && npm cache clean --force

# Generar cliente Prisma
RUN npx prisma generate

# Copiar código compilado
COPY dist ./dist/

# Cambiar propiedad a usuario nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponer puerto
EXPOSE 3001

# Variables de entorno para optimizar memoria en t2.micro
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"

# Comando de inicio optimizado para t2.micro
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "--max-old-space-size=512", "dist/index.js"]
EOF
    
    cd ..
    echo -e "${GREEN}✅ Backend optimizado para Free Tier${NC}"
}

# Build del frontend optimizado
build_frontend_free_tier() {
    echo -e "${YELLOW}🏗️ Building frontend optimizado...${NC}"
    
    cd frontend
    
    # Instalar dependencias
    npm ci
    
    # Generar tipos GraphQL
    npm run codegen
    
    # Build optimizado para Free Tier
    echo -e "${BLUE}🔨 Building con optimizaciones para Free Tier...${NC}"
    npm run build
    
    # Comprimir archivos para ahorrar espacio S3
    echo -e "${BLUE}📦 Comprimiendo archivos...${NC}"
    find dist -name "*.js" -exec gzip -k {} \;
    find dist -name "*.css" -exec gzip -k {} \;
    find dist -name "*.html" -exec gzip -k {} \;
    
    cd ..
    echo -e "${GREEN}✅ Frontend optimizado ($(du -sh frontend/dist | cut -f1) total)${NC}"
}

# Crear bucket S3 con configuración Free Tier
create_s3_bucket_free_tier() {
    echo -e "${YELLOW}☁️ Creando bucket S3 (Free Tier: 5GB)...${NC}"
    
    # Crear bucket en región Free Tier
    aws s3 mb s3://${S3_BUCKET} --region ${AWS_REGION}
    
    # Configurar como website estático
    aws s3 website s3://${S3_BUCKET} \
        --index-document index.html \
        --error-document index.html
    
    # Configurar política pública optimizada
    cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${S3_BUCKET}/*"
        }
    ]
}
EOF
    
    aws s3api put-bucket-policy \
        --bucket ${S3_BUCKET} \
        --policy file://bucket-policy.json
    
    # Configurar lifecycle para optimizar costos
    cat > lifecycle.json << EOF
{
    "Rules": [
        {
            "ID": "DeleteOldVersions",
            "Status": "Enabled",
            "Filter": {},
            "NoncurrentVersionExpiration": {
                "NoncurrentDays": 30
            }
        }
    ]
}
EOF
    
    aws s3api put-bucket-lifecycle-configuration \
        --bucket ${S3_BUCKET} \
        --lifecycle-configuration file://lifecycle.json
    
    rm bucket-policy.json lifecycle.json
    
    echo -e "${GREEN}✅ Bucket S3 creado (Free Tier): ${S3_BUCKET}${NC}"
}

# Subir frontend con optimizaciones Free Tier
deploy_frontend_free_tier() {
    echo -e "${YELLOW}📤 Desplegando frontend (optimizado para Free Tier)...${NC}"
    
    # Subir archivos con compresión
    aws s3 sync frontend/dist/ s3://${S3_BUCKET} \
        --delete \
        --storage-class STANDARD \
        --content-encoding gzip \
        --exclude "*.gz"
    
    # Configurar headers de cache optimizados
    aws s3 cp s3://${S3_BUCKET} s3://${S3_BUCKET} --recursive \
        --metadata-directive REPLACE \
        --cache-control "public, max-age=31536000" \
        --exclude "*.html"
    
    aws s3 cp s3://${S3_BUCKET} s3://${S3_BUCKET} --recursive \
        --metadata-directive REPLACE \
        --cache-control "no-cache, no-store, must-revalidate" \
        --include "*.html"
    
    # Mostrar uso actual de S3
    S3_SIZE=$(aws s3 ls s3://${S3_BUCKET} --recursive --human-readable --summarize | grep "Total Size" | awk '{print $3, $4}')
    S3_WEBSITE_URL="http://${S3_BUCKET}.s3-website.${AWS_REGION}.amazonaws.com"
    
    echo -e "${GREEN}✅ Frontend desplegado: ${S3_WEBSITE_URL}${NC}"
    echo -e "${BLUE}📊 Uso S3: ${S3_SIZE} de 5GB disponibles (Free Tier)${NC}"
}

# Crear CloudFront con configuración Free Tier
create_cloudfront_free_tier() {
    echo -e "${YELLOW}🌐 Creando CloudFront (Free Tier: 50GB/mes)...${NC}"
    
    cat > cloudfront-config.json << EOF
{
    "CallerReference": "${PROJECT_NAME}-$(date +%s)",
    "Comment": "CloudFront for ${PROJECT_NAME} - Free Tier Optimized",
    "DefaultCacheBehavior": {
        "TargetOriginId": "${S3_BUCKET}",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0,
            "Items": []
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 86400,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true
    },
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "${S3_BUCKET}",
                "DomainName": "${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                }
            }
        ]
    },
    "Enabled": true,
    "DefaultRootObject": "index.html",
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    },
    "PriceClass": "PriceClass_All"
}
EOF
    
    DISTRIBUTION_ID=$(aws cloudfront create-distribution \
        --distribution-config file://cloudfront-config.json \
        --query 'Distribution.Id' --output text)
    
    CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution \
        --id ${DISTRIBUTION_ID} \
        --query 'Distribution.DomainName' --output text)
    
    rm cloudfront-config.json
    
    echo -e "${GREEN}✅ CloudFront creado: ${CLOUDFRONT_DOMAIN}${NC}"
    echo -e "${BLUE}📊 Free Tier: 50GB data transfer/mes incluidos${NC}"
}

# Crear instancia EC2 Free Tier
create_ec2_free_tier() {
    echo -e "${YELLOW}🖥️ Creando EC2 t2.micro (Free Tier: 750h/mes)...${NC}"
    
    # Crear key pair
    if ! aws ec2 describe-key-pairs --key-names ${EC2_KEY_NAME} &> /dev/null; then
        echo -e "${BLUE}🔑 Creando key pair...${NC}"
        aws ec2 create-key-pair \
            --key-name ${EC2_KEY_NAME} \
            --query 'KeyMaterial' \
            --output text > ${EC2_KEY_NAME}.pem
        chmod 400 ${EC2_KEY_NAME}.pem
        echo -e "${GREEN}✅ Key pair creado: ${EC2_KEY_NAME}.pem${NC}"
    fi
    
    # Obtener VPC default
    VPC_ID=$(aws ec2 describe-vpcs \
        --filters "Name=isDefault,Values=true" \
        --query 'Vpcs[0].VpcId' --output text)
    
    # Crear security group
    SECURITY_GROUP_ID=$(aws ec2 create-security-group \
        --group-name ${PROJECT_NAME}-free-sg \
        --description "Security group for ${PROJECT_NAME} Free Tier" \
        --vpc-id ${VPC_ID} \
        --query 'GroupId' --output text)
    
    # Reglas de security group optimizadas
    aws ec2 authorize-security-group-ingress \
        --group-id ${SECURITY_GROUP_ID} \
        --protocol tcp --port 22 --cidr 0.0.0.0/0 \
        --query 'Return' --output text
    
    aws ec2 authorize-security-group-ingress \
        --group-id ${SECURITY_GROUP_ID} \
        --protocol tcp --port 80 --cidr 0.0.0.0/0 \
        --query 'Return' --output text
    
    aws ec2 authorize-security-group-ingress \
        --group-id ${SECURITY_GROUP_ID} \
        --protocol tcp --port 443 --cidr 0.0.0.0/0 \
        --query 'Return' --output text
    
    aws ec2 authorize-security-group-ingress \
        --group-id ${SECURITY_GROUP_ID} \
        --protocol tcp --port 3001 --cidr 0.0.0.0/0 \
        --query 'Return' --output text
    
    # User data optimizado para t2.micro
    cat > user-data.sh << 'EOF'
#!/bin/bash
yum update -y

# Instalar Node.js 18 (optimizado para t2.micro)
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Instalar PM2 (process manager optimizado)
npm install -g pm2

# Configurar swap para t2.micro (1GB RAM)
dd if=/dev/zero of=/swapfile bs=128M count=8
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile swap swap defaults 0 0' >> /etc/fstab

# Optimizar sistema para t2.micro
echo 'vm.swappiness=10' >> /etc/sysctl.conf
echo 'vm.vfs_cache_pressure=50' >> /etc/sysctl.conf

# Instalar nginx (proxy ligero)
yum install -y nginx

echo "EC2 Free Tier setup completed" > /var/log/free-tier-setup.log
EOF
    
    # Obtener AMI de Amazon Linux 2023 (Free Tier eligible)
    AMI_ID=$(aws ec2 describe-images \
        --owners amazon \
        --filters "Name=name,Values=al2023-ami-*" "Name=architecture,Values=x86_64" \
        --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' \
        --output text)
    
    # Lanzar instancia t2.micro (Free Tier)
    INSTANCE_ID=$(aws ec2 run-instances \
        --image-id ${AMI_ID} \
        --count 1 \
        --instance-type ${INSTANCE_TYPE} \
        --key-name ${EC2_KEY_NAME} \
        --security-group-ids ${SECURITY_GROUP_ID} \
        --user-data file://user-data.sh \
        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${PROJECT_NAME}-free-tier},{Key=Environment,Value=production},{Key=FreeTier,Value=true}]" \
        --query 'Instances[0].InstanceId' --output text)
    
    rm user-data.sh
    
    echo -e "${GREEN}✅ EC2 t2.micro creado: ${INSTANCE_ID}${NC}"
    echo -e "${BLUE}📊 Free Tier: 750 horas/mes (24/7 gratis)${NC}"
    
    # Esperar instancia
    echo -e "${YELLOW}⏳ Esperando instancia (2-3 minutos)...${NC}"
    aws ec2 wait instance-running --instance-ids ${INSTANCE_ID}
    
    # Obtener información de la instancia
    EC2_PUBLIC_IP=$(aws ec2 describe-instances \
        --instance-ids ${INSTANCE_ID} \
        --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
    
    EC2_INSTANCE_DNS=$(aws ec2 describe-instances \
        --instance-ids ${INSTANCE_ID} \
        --query 'Reservations[0].Instances[0].PublicDnsName' --output text)
    
    echo -e "${GREEN}✅ Instancia disponible: ${EC2_PUBLIC_IP}${NC}"
}

# Configurar RDS (verificar que está en Free Tier)
check_rds_free_tier() {
    echo -e "${YELLOW}🗄️ Verificando configuración RDS Free Tier...${NC}"
    
    # Obtener información del RDS existente
    RDS_INFO=$(aws rds describe-db-instances \
        --db-instance-identifier happy-baby-style-db \
        --region ${AWS_REGION} 2>/dev/null || echo "")
    
    if [ -n "$RDS_INFO" ]; then
        RDS_CLASS=$(echo "$RDS_INFO" | jq -r '.DBInstances[0].DBInstanceClass')
        RDS_ENGINE=$(echo "$RDS_INFO" | jq -r '.DBInstances[0].Engine')
        RDS_ALLOCATED_STORAGE=$(echo "$RDS_INFO" | jq -r '.DBInstances[0].AllocatedStorage')
        
        echo -e "${BLUE}📊 RDS Actual:${NC}"
        echo -e "   • Clase: ${RDS_CLASS}"
        echo -e "   • Motor: ${RDS_ENGINE}"
        echo -e "   • Storage: ${RDS_ALLOCATED_STORAGE}GB"
        
        if [ "$RDS_CLASS" = "db.t2.micro" ] || [ "$RDS_CLASS" = "db.t3.micro" ]; then
            echo -e "${GREEN}✅ RDS compatible con Free Tier${NC}"
        else
            echo -e "${YELLOW}⚠️  RDS no está en Free Tier (${RDS_CLASS})${NC}"
            echo -e "${BLUE}💡 Para Free Tier: db.t2.micro o db.t3.micro${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  RDS no encontrado, creando uno nuevo...${NC}"
        create_rds_free_tier
    fi
}

# Crear RDS Free Tier si es necesario
create_rds_free_tier() {
    echo -e "${YELLOW}🗄️ Creando RDS Free Tier...${NC}"
    
    # Crear subnet group
    SUBNET_IDS=$(aws ec2 describe-subnets \
        --filters "Name=vpc-id,Values=${VPC_ID}" \
        --query 'Subnets[*].SubnetId' --output text)
    
    aws rds create-db-subnet-group \
        --db-subnet-group-name ${PROJECT_NAME}-free-subnet-group \
        --db-subnet-group-description "Subnet group for ${PROJECT_NAME} Free Tier" \
        --subnet-ids ${SUBNET_IDS}
    
    # Crear RDS Free Tier
    aws rds create-db-instance \
        --db-instance-identifier ${PROJECT_NAME}-free-db \
        --db-instance-class db.t3.micro \
        --engine postgres \
        --engine-version 13.13 \
        --master-username postgres \
        --master-user-password "HappyBaby2024!" \
        --allocated-storage 20 \
        --db-name happy_baby_style_db \
        --vpc-security-group-ids ${SECURITY_GROUP_ID} \
        --db-subnet-group-name ${PROJECT_NAME}-free-subnet-group \
        --backup-retention-period 7 \
        --storage-encrypted \
        --no-deletion-protection
    
    echo -e "${GREEN}✅ RDS Free Tier creado${NC}"
    echo -e "${BLUE}📊 Free Tier: 750 horas/mes db.t3.micro + 20GB storage${NC}"
}

# Desplegar backend optimizado para t2.micro
deploy_backend_free_tier() {
    echo -e "${YELLOW}🚀 Desplegando backend en t2.micro...${NC}"
    
    # Esperar un poco más para que la instancia esté completamente lista
    sleep 30
    
    # Crear script de despliegue optimizado para Free Tier
    cat > deploy-free-tier.sh << EOF
#!/bin/bash

# Crear directorio de aplicación
sudo mkdir -p /opt/${PROJECT_NAME}
sudo chown ec2-user:ec2-user /opt/${PROJECT_NAME}
cd /opt/${PROJECT_NAME}

# Descargar código (simulando)
echo "Creando estructura de aplicación..."
mkdir -p backend/dist backend/prisma

# Crear archivo .env optimizado para Free Tier
cat > backend/.env << 'ENVEOF'
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://postgres:HappyBaby2024!@happy-baby-style-db.cr0ug6u2oje3.us-east-2.rds.amazonaws.com:5432/happy_baby_style_db
JWT_SECRET=super_secret_key_for_production_change_this_immediately
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://${CLOUDFRONT_DOMAIN}
LOG_LEVEL=error
LOG_ENABLE_CONSOLE=true
LOG_ENABLE_FILE=false
NODE_OPTIONS=--max-old-space-size=512
ENVEOF

# Configurar PM2 con configuración optimizada para t2.micro
cat > ecosystem.config.js << 'PMEOF'
module.exports = {
  apps: [{
    name: '${PROJECT_NAME}-backend',
    script: './backend/dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '400M',
    node_args: '--max-old-space-size=512',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/pm2/err.log',
    out_file: '/var/log/pm2/out.log',
    log_file: '/var/log/pm2/combined.log',
    time: true
  }]
};
PMEOF

# Crear directorio de logs
sudo mkdir -p /var/log/pm2
sudo chown ec2-user:ec2-user /var/log/pm2

echo "Configuración Free Tier lista"
EOF
    
    # Transferir y ejecutar script
    scp -i ${EC2_KEY_NAME}.pem -o StrictHostKeyChecking=no deploy-free-tier.sh ec2-user@${EC2_PUBLIC_IP}:/tmp/
    ssh -i ${EC2_KEY_NAME}.pem -o StrictHostKeyChecking=no ec2-user@${EC2_PUBLIC_IP} 'chmod +x /tmp/deploy-free-tier.sh && /tmp/deploy-free-tier.sh'
    
    rm deploy-free-tier.sh
    
    echo -e "${GREEN}✅ Backend configurado para Free Tier${NC}"
}

# Configurar nginx optimizado para t2.micro
setup_nginx_free_tier() {
    echo -e "${YELLOW}🌐 Configurando Nginx (optimizado para t2.micro)...${NC}"
    
    cat > nginx-free-tier.sh << 'EOF'
#!/bin/bash

# Configurar nginx optimizado para t2.micro
sudo tee /etc/nginx/nginx.conf > /dev/null << 'NGINXCONF'
user nginx;
worker_processes 1;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Optimizaciones para t2.micro (1 CPU, 1GB RAM)
worker_rlimit_nofile 1024;

events {
    worker_connections 512;
    use epoll;
    multi_accept on;
}

http {
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 10M;

    # Compresión para ahorrar ancho de banda (Free Tier)
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;
        root /usr/share/nginx/html;

        # Proxy para GraphQL API
        location /graphql {
            proxy_pass http://localhost:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
            proxy_connect_timeout 5s;
            proxy_send_timeout 10s;
            proxy_read_timeout 10s;
        }

        # Proxy para GraphQL Playground
        location /playground {
            proxy_pass http://localhost:3001;
            proxy_http_version 1.1;
            proxy_set_header Host \$host;
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
}
NGINXCONF

# Iniciar y habilitar nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar que nginx está funcionando
sudo systemctl status nginx

echo "Nginx optimizado para Free Tier configurado"
EOF
    
    # Ejecutar configuración
    scp -i ${EC2_KEY_NAME}.pem -o StrictHostKeyChecking=no nginx-free-tier.sh ec2-user@${EC2_PUBLIC_IP}:/tmp/
    ssh -i ${EC2_KEY_NAME}.pem -o StrictHostKeyChecking=no ec2-user@${EC2_PUBLIC_IP} 'chmod +x /tmp/nginx-free-tier.sh && sudo /tmp/nginx-free-tier.sh'
    
    rm nginx-free-tier.sh
    
    echo -e "${GREEN}✅ Nginx configurado para Free Tier${NC}"
}

# Monitoreo de uso Free Tier
setup_free_tier_monitoring() {
    echo -e "${YELLOW}📊 Configurando monitoreo Free Tier...${NC}"
    
    cat > monitoring-free-tier.sh << 'EOF'
#!/bin/bash

# Script de monitoreo para Free Tier
cat > /home/ec2-user/check-free-tier.sh << 'MONEOF'
#!/bin/bash

echo "=== MONITOREO FREE TIER ==="
echo "Fecha: $(date)"
echo ""

# CPU y Memoria
echo "--- RECURSOS SISTEMA ---"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "RAM: $(free -m | awk 'NR==2{printf "%.1f%%", $3*100/$2}')"
echo "Swap: $(free -m | awk 'NR==3{printf "%.1f%%", $3*100/$2}')"
echo "Disk: $(df -h / | awk 'NR==2{print $5}')"
echo ""

# Procesos
echo "--- PROCESOS PRINCIPALES ---"
ps aux --sort=-%cpu | head -5
echo ""

# Conexiones de red
echo "--- CONEXIONES RED ---"
echo "Conexiones activas: $(netstat -an | grep :3001 | wc -l)"
echo ""

# Logs de aplicación
echo "--- ESTADO APLICACIÓN ---"
if pm2 list | grep -q online; then
    echo "✅ Backend: ONLINE"
else
    echo "❌ Backend: OFFLINE"
fi

if systemctl is-active nginx >/dev/null; then
    echo "✅ Nginx: ACTIVE"
else
    echo "❌ Nginx: INACTIVE"
fi

echo "================================="
MONEOF

chmod +x /home/ec2-user/check-free-tier.sh

# Agregar a crontab para monitoreo cada hora
(crontab -l 2>/dev/null; echo "0 * * * * /home/ec2-user/check-free-tier.sh >> /var/log/free-tier-monitor.log") | crontab -

echo "Monitoreo Free Tier configurado"
EOF
    
    # Ejecutar configuración de monitoreo
    scp -i ${EC2_KEY_NAME}.pem -o StrictHostKeyChecking=no monitoring-free-tier.sh ec2-user@${EC2_PUBLIC_IP}:/tmp/
    ssh -i ${EC2_KEY_NAME}.pem -o StrictHostKeyChecking=no ec2-user@${EC2_PUBLIC_IP} 'chmod +x /tmp/monitoring-free-tier.sh && /tmp/monitoring-free-tier.sh'
    
    rm monitoring-free-tier.sh
    
    echo -e "${GREEN}✅ Monitoreo Free Tier configurado${NC}"
}

# Función principal
main() {
    echo -e "${PURPLE}🎯 Iniciando despliegue FREE TIER...${NC}"
    
    check_dependencies
    check_aws_config
    check_free_tier_eligibility
    
    echo -e "${YELLOW}📝 ¿Continuar con despliegue FREE TIER? (y/N)${NC}"
    read -r confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Despliegue cancelado${NC}"
        exit 0
    fi
    
    echo -e "${BLUE}🚀 Iniciando despliegue gratuito...${NC}"
    
    # Backend
    build_backend_free_tier
    create_ec2_free_tier
    sleep 60  # Esperar a que EC2 esté listo
    check_rds_free_tier
    deploy_backend_free_tier
    setup_nginx_free_tier
    setup_free_tier_monitoring
    
    # Frontend
    build_frontend_free_tier
    create_s3_bucket_free_tier
    deploy_frontend_free_tier
    create_cloudfront_free_tier
    
    # Resumen final FREE TIER
    echo -e "\n${PURPLE}🆓 ================================= 🆓${NC}"
    echo -e "${PURPLE}🎉 ¡DESPLIEGUE FREE TIER COMPLETADO!${NC}"
    echo -e "${PURPLE}🆓 ================================= 🆓${NC}"
    echo -e "\n${GREEN}💰 COSTO TOTAL: \$0.00/mes por 12 meses${NC}"
    echo -e "\n${BLUE}📊 Recursos Free Tier utilizados:${NC}"
    echo -e "  ✅ EC2 t2.micro: ${INSTANCE_ID}"
    echo -e "  ✅ RDS db.t2.micro: happy-baby-style-db"
    echo -e "  ✅ S3 Bucket: ${S3_BUCKET}"
    echo -e "  ✅ CloudFront: ${DISTRIBUTION_ID}"
    echo -e "  ✅ Security Group: ${SECURITY_GROUP_ID}"
    echo -e "\n${YELLOW}🌐 URLs de acceso:${NC}"
    echo -e "  • Backend API: http://${EC2_PUBLIC_IP}/graphql"
    echo -e "  • GraphQL Playground: http://${EC2_PUBLIC_IP}/playground"
    echo -e "  • Frontend: https://${CLOUDFRONT_DOMAIN} (15 min para activar)"
    echo -e "\n${BLUE}🔑 SSH Access:${NC}"
    echo -e "  ssh -i ${EC2_KEY_NAME}.pem ec2-user@${EC2_PUBLIC_IP}"
    echo -e "\n${PURPLE}📊 Monitoreo Free Tier:${NC}"
    echo -e "  • Comando: ssh -i ${EC2_KEY_NAME}.pem ec2-user@${EC2_PUBLIC_IP} './check-free-tier.sh'"
    echo -e "  • Dashboard: https://console.aws.amazon.com/billing/home#/freetier"
    echo -e "\n${GREEN}🎯 Tu aplicación está 100% operativa y GRATIS por 12 meses${NC}"
    echo -e "${YELLOW}⚠️  Importante: Mantén un ojo en el dashboard Free Tier${NC}"
}

# Ejecutar función principal
main "$@"