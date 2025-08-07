#!/bin/bash

# 🚀 Script de Despliegue Automático a AWS
# Happy Baby Style Web Admin

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
PROJECT_NAME="happy-baby-style"
AWS_REGION="us-east-2"
S3_BUCKET="${PROJECT_NAME}-frontend-$(date +%s)"
EC2_KEY_NAME="${PROJECT_NAME}-key"
INSTANCE_TYPE="t3.small"

echo -e "${BLUE}🚀 Iniciando despliegue de Happy Baby Style en AWS...${NC}"

# Verificar dependencias
check_dependencies() {
    echo -e "${YELLOW}🔍 Verificando dependencias...${NC}"
    
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI no está instalado${NC}"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js no está instalado${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm no está instalado${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Todas las dependencias están disponibles${NC}"
}

# Verificar configuración AWS
check_aws_config() {
    echo -e "${YELLOW}🔍 Verificando configuración AWS...${NC}"
    
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}❌ AWS CLI no está configurado correctamente${NC}"
        echo -e "${YELLOW}Ejecuta: aws configure${NC}"
        exit 1
    fi
    
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    echo -e "${GREEN}✅ AWS configurado. Account ID: ${AWS_ACCOUNT_ID}${NC}"
}

# Build del backend
build_backend() {
    echo -e "${YELLOW}🏗️ Building backend...${NC}"
    
    cd backend
    
    # Instalar dependencias
    echo -e "${BLUE}📦 Instalando dependencias del backend...${NC}"
    npm ci
    
    # Generar cliente Prisma
    echo -e "${BLUE}🔧 Generando cliente Prisma...${NC}"
    npx prisma generate
    
    # Build TypeScript
    echo -e "${BLUE}🔨 Compilando TypeScript...${NC}"
    npm run build
    
    # Crear Dockerfile
    echo -e "${BLUE}🐳 Creando Dockerfile...${NC}"
    cat > Dockerfile << 'EOF'
FROM node:18-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias de producción
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

# Comando de inicio con dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
EOF
    
    cd ..
    echo -e "${GREEN}✅ Backend build completado${NC}"
}

# Build del frontend
build_frontend() {
    echo -e "${YELLOW}🏗️ Building frontend...${NC}"
    
    cd frontend
    
    # Instalar dependencias
    echo -e "${BLUE}📦 Instalando dependencias del frontend...${NC}"
    npm ci
    
    # Generar tipos GraphQL
    echo -e "${BLUE}🔧 Generando tipos GraphQL...${NC}"
    npm run codegen
    
    # Build para producción
    echo -e "${BLUE}🔨 Building para producción...${NC}"
    VITE_API_URL="https://${EC2_INSTANCE_DNS}:3001/graphql" npm run build
    
    cd ..
    echo -e "${GREEN}✅ Frontend build completado${NC}"
}

# Crear bucket S3 para frontend
create_s3_bucket() {
    echo -e "${YELLOW}☁️ Creando bucket S3 para frontend...${NC}"
    
    # Crear bucket
    aws s3 mb s3://${S3_BUCKET} --region ${AWS_REGION}
    
    # Configurar como website estático
    aws s3 website s3://${S3_BUCKET} \
        --index-document index.html \
        --error-document index.html
    
    # Configurar política pública
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
    
    rm bucket-policy.json
    
    echo -e "${GREEN}✅ Bucket S3 creado: ${S3_BUCKET}${NC}"
}

# Subir frontend a S3
deploy_frontend() {
    echo -e "${YELLOW}📤 Desplegando frontend a S3...${NC}"
    
    # Subir archivos
    aws s3 sync frontend/dist/ s3://${S3_BUCKET} --delete
    
    # Configurar cache headers
    aws s3 cp s3://${S3_BUCKET} s3://${S3_BUCKET} --recursive \
        --metadata-directive REPLACE \
        --cache-control "public, max-age=31536000" \
        --exclude "*.html"
    
    aws s3 cp s3://${S3_BUCKET} s3://${S3_BUCKET} --recursive \
        --metadata-directive REPLACE \
        --cache-control "no-cache" \
        --include "*.html"
    
    S3_WEBSITE_URL="http://${S3_BUCKET}.s3-website.${AWS_REGION}.amazonaws.com"
    echo -e "${GREEN}✅ Frontend desplegado en: ${S3_WEBSITE_URL}${NC}"
}

# Crear distribución CloudFront
create_cloudfront() {
    echo -e "${YELLOW}🌐 Creando distribución CloudFront...${NC}"
    
    cat > cloudfront-config.json << EOF
{
    "CallerReference": "${PROJECT_NAME}-$(date +%s)",
    "Comment": "CloudFront distribution for ${PROJECT_NAME}",
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
        "MinTTL": 0,
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
    }
}
EOF
    
    DISTRIBUTION_ID=$(aws cloudfront create-distribution \
        --distribution-config file://cloudfront-config.json \
        --query 'Distribution.Id' --output text)
    
    rm cloudfront-config.json
    
    echo -e "${GREEN}✅ CloudFront creado. Distribution ID: ${DISTRIBUTION_ID}${NC}"
    echo -e "${YELLOW}⏳ La distribución tardará ~15 minutos en estar disponible${NC}"
}

# Crear EC2 para backend
create_ec2_instance() {
    echo -e "${YELLOW}🖥️ Creando instancia EC2 para backend...${NC}"
    
    # Crear key pair si no existe
    if ! aws ec2 describe-key-pairs --key-names ${EC2_KEY_NAME} &> /dev/null; then
        echo -e "${BLUE}🔑 Creando key pair...${NC}"
        aws ec2 create-key-pair \
            --key-name ${EC2_KEY_NAME} \
            --query 'KeyMaterial' \
            --output text > ${EC2_KEY_NAME}.pem
        chmod 400 ${EC2_KEY_NAME}.pem
        echo -e "${GREEN}✅ Key pair creado: ${EC2_KEY_NAME}.pem${NC}"
    fi
    
    # Crear security group
    SECURITY_GROUP_ID=$(aws ec2 create-security-group \
        --group-name ${PROJECT_NAME}-sg \
        --description "Security group for ${PROJECT_NAME}" \
        --query 'GroupId' --output text)
    
    # Agregar reglas de security group
    aws ec2 authorize-security-group-ingress \
        --group-id ${SECURITY_GROUP_ID} \
        --protocol tcp --port 22 --cidr 0.0.0.0/0
    
    aws ec2 authorize-security-group-ingress \
        --group-id ${SECURITY_GROUP_ID} \
        --protocol tcp --port 80 --cidr 0.0.0.0/0
    
    aws ec2 authorize-security-group-ingress \
        --group-id ${SECURITY_GROUP_ID} \
        --protocol tcp --port 443 --cidr 0.0.0.0/0
    
    aws ec2 authorize-security-group-ingress \
        --group-id ${SECURITY_GROUP_ID} \
        --protocol tcp --port 3001 --cidr 0.0.0.0/0
    
    # User data script
    cat > user-data.sh << 'EOF'
#!/bin/bash
yum update -y
yum install -y docker git

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Instalar Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Iniciar Docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Instalar PM2 globalmente
npm install -g pm2

echo "EC2 setup completed" > /var/log/setup.log
EOF
    
    # Lanzar instancia
    INSTANCE_ID=$(aws ec2 run-instances \
        --image-id ami-0c02fb55956c7d316 \
        --count 1 \
        --instance-type ${INSTANCE_TYPE} \
        --key-name ${EC2_KEY_NAME} \
        --security-group-ids ${SECURITY_GROUP_ID} \
        --user-data file://user-data.sh \
        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${PROJECT_NAME}-backend}]" \
        --query 'Instances[0].InstanceId' --output text)
    
    rm user-data.sh
    
    echo -e "${GREEN}✅ Instancia EC2 creada: ${INSTANCE_ID}${NC}"
    
    # Esperar a que la instancia esté corriendo
    echo -e "${YELLOW}⏳ Esperando a que la instancia esté corriendo...${NC}"
    aws ec2 wait instance-running --instance-ids ${INSTANCE_ID}
    
    # Obtener IP pública
    EC2_PUBLIC_IP=$(aws ec2 describe-instances \
        --instance-ids ${INSTANCE_ID} \
        --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
    
    EC2_INSTANCE_DNS=$(aws ec2 describe-instances \
        --instance-ids ${INSTANCE_ID} \
        --query 'Reservations[0].Instances[0].PublicDnsName' --output text)
    
    echo -e "${GREEN}✅ Instancia disponible en: ${EC2_PUBLIC_IP} (${EC2_INSTANCE_DNS})${NC}"
}

# Desplegar backend en EC2
deploy_backend() {
    echo -e "${YELLOW}🚀 Desplegando backend en EC2...${NC}"
    
    # Crear archivo de configuración de aplicación
    cat > deploy-backend.sh << EOF
#!/bin/bash

# Crear directorio de aplicación
sudo mkdir -p /opt/${PROJECT_NAME}
cd /opt/${PROJECT_NAME}

# Clonar repositorio (reemplaza con tu repo)
# git clone https://github.com/tu-usuario/happy-baby-style-web-admin.git .

# Crear .env file
cat > .env << 'ENVEOF'
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://postgres:HappyBaby2024!@happy-baby-style-db.cr0ug6u2oje3.us-east-2.rds.amazonaws.com:5432/happy_baby_style_db
JWT_SECRET=\${RANDOM_JWT_SECRET}
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://\${CLOUDFRONT_DOMAIN}
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=https://\${EC2_INSTANCE_DNS}:3001/auth/google/callback
LOG_LEVEL=info
LOG_ENABLE_CONSOLE=true
LOG_ENABLE_FILE=true
ENVEOF

# Instalar dependencias del backend
cd backend
npm ci --only=production

# Generar cliente Prisma
npx prisma generate

# Iniciar aplicación con PM2
pm2 start dist/index.js --name "${PROJECT_NAME}-backend"
pm2 startup
pm2 save

echo "Backend desplegado exitosamente"
EOF
    
    # Subir y ejecutar script en EC2
    scp -i ${EC2_KEY_NAME}.pem -o StrictHostKeyChecking=no deploy-backend.sh ec2-user@${EC2_PUBLIC_IP}:/tmp/
    ssh -i ${EC2_KEY_NAME}.pem -o StrictHostKeyChecking=no ec2-user@${EC2_PUBLIC_IP} 'chmod +x /tmp/deploy-backend.sh && /tmp/deploy-backend.sh'
    
    rm deploy-backend.sh
    
    echo -e "${GREEN}✅ Backend desplegado exitosamente${NC}"
}

# Crear configuración de nginx como proxy
setup_nginx() {
    echo -e "${YELLOW}🌐 Configurando Nginx como proxy...${NC}"
    
    cat > nginx-setup.sh << 'EOF'
#!/bin/bash

# Instalar nginx
sudo yum install -y nginx

# Crear configuración
sudo tee /etc/nginx/conf.d/app.conf > /dev/null << 'NGINXEOF'
server {
    listen 80;
    server_name _;

    # Proxy para API
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
    }

    # Proxy para playground
    location /playground {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
NGINXEOF

# Iniciar nginx
sudo systemctl start nginx
sudo systemctl enable nginx

echo "Nginx configurado exitosamente"
EOF
    
    # Ejecutar en EC2
    scp -i ${EC2_KEY_NAME}.pem -o StrictHostKeyChecking=no nginx-setup.sh ec2-user@${EC2_PUBLIC_IP}:/tmp/
    ssh -i ${EC2_KEY_NAME}.pem -o StrictHostKeyChecking=no ec2-user@${EC2_PUBLIC_IP} 'chmod +x /tmp/nginx-setup.sh && sudo /tmp/nginx-setup.sh'
    
    rm nginx-setup.sh
    
    echo -e "${GREEN}✅ Nginx configurado como proxy${NC}"
}

# Función principal
main() {
    echo -e "${BLUE}🎯 Iniciando despliegue completo...${NC}"
    
    check_dependencies
    check_aws_config
    
    echo -e "${YELLOW}📝 ¿Continuar con el despliegue? (y/N)${NC}"
    read -r confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Despliegue cancelado${NC}"
        exit 0
    fi
    
    # Backend
    build_backend
    create_ec2_instance
    sleep 60  # Esperar a que EC2 esté completamente listo
    deploy_backend
    setup_nginx
    
    # Frontend
    build_frontend
    create_s3_bucket
    deploy_frontend
    create_cloudfront
    
    # Resumen final
    echo -e "\n${GREEN}🎉 ¡DESPLIEGUE COMPLETADO EXITOSAMENTE!${NC}"
    echo -e "${BLUE}📊 Resumen de recursos creados:${NC}"
    echo -e "  • EC2 Instance: ${INSTANCE_ID} (${EC2_PUBLIC_IP})"
    echo -e "  • S3 Bucket: ${S3_BUCKET}"
    echo -e "  • CloudFront Distribution: ${DISTRIBUTION_ID}"
    echo -e "  • Security Group: ${SECURITY_GROUP_ID}"
    echo -e "  • Key Pair: ${EC2_KEY_NAME}.pem"
    echo -e "\n${YELLOW}🌐 URLs de acceso:${NC}"
    echo -e "  • Backend API: http://${EC2_PUBLIC_IP}/graphql"
    echo -e "  • GraphQL Playground: http://${EC2_PUBLIC_IP}/playground"
    echo -e "  • Frontend (S3): ${S3_WEBSITE_URL}"
    echo -e "  • Frontend (CloudFront): https://[DISTRIBUTION_DOMAIN] (disponible en ~15 min)"
    echo -e "\n${BLUE}🔑 Para conectar por SSH:${NC}"
    echo -e "  ssh -i ${EC2_KEY_NAME}.pem ec2-user@${EC2_PUBLIC_IP}"
    echo -e "\n${YELLOW}⚠️  Importante:${NC}"
    echo -e "  • Guarda el archivo ${EC2_KEY_NAME}.pem en un lugar seguro"
    echo -e "  • La distribución CloudFront puede tardar hasta 15 minutos en propagarse"
    echo -e "  • Configura un dominio personalizado para producción"
    echo -e "  • Considera usar Route 53 para DNS management"
}

# Ejecutar función principal
main "$@"