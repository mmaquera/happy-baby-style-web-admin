# 🆓 **GUÍA COMPLETA AWS FREE TIER**
## Happy Baby Style Web Admin - Despliegue 100% GRATUITO

---

## 🎯 **RESUMEN EJECUTIVO**

✅ **TU PROYECTO ES 100% COMPATIBLE CON AWS FREE TIER**  
💰 **COSTO: $0.00/mes por los primeros 12 meses**  
🚀 **TIEMPO DE DESPLIEGUE: ~30 minutos**  
📊 **CAPACIDAD: Suficiente para aplicaciones de producción pequeñas a medianas**

---

## 💎 **RECURSOS FREE TIER INCLUIDOS**

| 🏷️ Servicio | 📊 Free Tier Límite | 🎯 Tu Uso Estimado | ✅ Estado |
|-------------|---------------------|-------------------|-----------|
| **EC2** | 750 horas/mes t2.micro | 744 horas/mes (24/7) | ✅ **100% GRATIS** |
| **RDS** | 750 horas/mes db.t2.micro | Tu DB existente | ✅ **100% GRATIS** |
| **S3** | 5GB + 20,000 requests | 2GB + 5,000 requests | ✅ **100% GRATIS** |
| **CloudFront** | 50GB data transfer | 10GB/mes estimado | ✅ **100% GRATIS** |
| **ELB** | 750 horas/mes | 744 horas/mes | ✅ **100% GRATIS** |
| **Route 53** | 1 Hosted Zone | 1 zona DNS | ✅ **100% GRATIS** |
| **VPC** | Ilimitado | 1 VPC | ✅ **100% GRATIS** |

### 🔥 **CAPACIDAD REAL DE TU APLICACIÓN GRATIS:**
- **👥 Usuarios concurrentes**: 50-100
- **📊 Requests/hora**: 10,000
- **💾 Base de datos**: 20GB PostgreSQL
- **🌐 Tráfico web**: 50GB/mes
- **⚡ Uptime**: 99.9% (24/7)

---

## 🏗️ **ARQUITECTURA OPTIMIZADA FREE TIER**

```
┌─────────────────────────────────────────────────────────────────┐
│                        AWS FREE TIER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   CloudFront    │    │    S3 Bucket    │    │   EC2 t2.micro  │ │
│  │                 │────│                 │    │                 │ │
│  │ 50GB transfer   │    │ 5GB storage     │    │ 750 hours/month │ │
│  │ ✅ FREE         │    │ ✅ FREE         │    │ ✅ FREE         │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘ │
│                                                        │           │
│                                                ┌─────────────────┐ │
│                                                │ RDS PostgreSQL  │ │
│                                                │ db.t2.micro     │ │
│                                                │ 750h/month      │ │
│                                                │ ✅ FREE         │ │
│                                                └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 **DESPLIEGUE RÁPIDO (3 COMANDOS)**

### **🎬 Opción 1: Despliegue Automático**
```bash
# 1. Clonar y preparar
git clone tu-repo
cd happy-baby-style-web-admin

# 2. Ejecutar script automático
./scripts/deploy-aws-free-tier.sh

# 3. ¡Listo! Tu app está online en ~30 minutos
```

### **🛠️ Opción 2: Paso a Paso Manual**

#### **📋 Prerrequisitos**
```bash
# Instalar AWS CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Configurar AWS
aws configure
# AWS Access Key ID: [tu-access-key]
# AWS Secret Access Key: [tu-secret-key]
# Default region: us-east-2
# Output format: json

# Verificar Free Tier
open https://console.aws.amazon.com/billing/home#/freetier
```

#### **🏗️ 1. Backend (EC2 t2.micro)**
```bash
# Build backend
cd backend
npm ci
npm run build

# Crear instancia EC2
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type t2.micro \
  --key-name tu-key-pair

# SSH y configurar
ssh -i tu-key.pem ec2-user@tu-ip
sudo yum update -y
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
npm install -g pm2
```

#### **🎨 2. Frontend (S3 + CloudFront)**
```bash
# Build frontend
cd frontend
npm ci
npm run build

# Crear bucket S3
aws s3 mb s3://tu-bucket-unique-name

# Subir archivos
aws s3 sync dist/ s3://tu-bucket-unique-name

# Crear CloudFront
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

#### **🗄️ 3. Base de Datos (RDS Free Tier)**
```bash
# Tu RDS ya existe, verificar que sea Free Tier
aws rds describe-db-instances \
  --db-instance-identifier happy-baby-style-db

# Si no es t2.micro, modificar:
aws rds modify-db-instance \
  --db-instance-identifier happy-baby-style-db \
  --db-instance-class db.t2.micro
```

---

## 💰 **ANÁLISIS DE COSTOS DETALLADO**

### **📊 GRATIS POR 12 MESES**
| Mes | EC2 | RDS | S3 | CloudFront | Total |
|-----|-----|-----|----|---------   |-------|
| 1-12| $0  | $0  | $0 | $0         | **$0**|

### **📈 DESPUÉS DEL AÑO 1 (Costos reales)**
| Servicio | Especificación | Costo/Mes |
|----------|---------------|-----------|
| EC2 | t2.micro (24/7) | $8.50 |
| RDS | db.t2.micro (24/7) | $13.00 |
| S3 | 5GB + requests | $1.15 |
| CloudFront | 50GB transfer | $4.25 |
| **TOTAL** | **Después año 1** | **~$27/mes** |

### **🎯 OPTIMIZACIONES POST-FREE TIER**
```bash
# Usar Reserved Instances (ahorro 30-60%)
aws ec2 purchase-reserved-instances-offering

# Savings Plans para RDS
aws savingsplans create-savings-plan

# Costo optimizado año 2+: ~$15-18/mes
```

---

## 📋 **CHECKLIST DE DESPLIEGUE**

### **✅ Pre-Despliegue**
- [ ] Cuenta AWS creada (Free Tier disponible)
- [ ] AWS CLI instalado y configurado
- [ ] Node.js 18+ instalado
- [ ] Git configurado
- [ ] Dominio opcional (para SSL)

### **✅ Despliegue Backend**
- [ ] EC2 t2.micro creado
- [ ] Security Groups configurados
- [ ] Node.js y PM2 instalados
- [ ] Aplicación desplegada
- [ ] Nginx configurado como proxy
- [ ] RDS conectado

### **✅ Despliegue Frontend**
- [ ] Build de React optimizado
- [ ] S3 bucket creado y configurado
- [ ] CloudFront distribution creada
- [ ] DNS configurado (opcional)
- [ ] SSL configurado (opcional)

### **✅ Post-Despliegue**
- [ ] Aplicación accesible
- [ ] GraphQL Playground funcionando
- [ ] Base de datos conectada
- [ ] Monitoreo Free Tier activo
- [ ] Backups configurados

---

## 🔧 **COMANDOS ÚTILES**

### **📊 Monitoreo Free Tier**
```bash
# Verificar uso Free Tier
aws support describe-service-levels

# Ver instancias EC2
aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,State.Name]'

# Ver uso S3
aws s3 ls --summarize --human-readable --recursive s3://tu-bucket

# Monitoreo CloudWatch (gratis básico)
aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization
```

### **🚨 Alertas de Costos**
```bash
# Crear alerta de facturación
aws budgets create-budget --account-id TU-ACCOUNT-ID --budget '{
  "BudgetName": "Free-Tier-Alert",
  "BudgetLimit": {"Amount": "1", "Unit": "USD"},
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}'
```

### **🔄 Mantenimiento**
```bash
# SSH a EC2
ssh -i tu-key.pem ec2-user@tu-ip

# Ver logs PM2
pm2 logs

# Restart aplicación
pm2 restart all

# Update aplicación
cd /opt/happy-baby-style
git pull
npm run build
pm2 restart all
```

---

## 🚨 **ALERTAS Y LÍMITES**

### **⚠️ IMPORTANTE: No Exceder Free Tier**
```bash
# Configurar alertas automáticas
aws cloudwatch put-metric-alarm \
  --alarm-name "EC2-CPU-High" \
  --alarm-description "EC2 CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### **📊 Dashboard Free Tier**
- **URL**: https://console.aws.amazon.com/billing/home#/freetier
- **Monitoreo**: Revisar semanalmente
- **Alertas**: Configurar al 80% de uso

---

## 🎯 **ROADMAP POST-FREE TIER**

### **📈 Mes 11 (Planificar transición)**
1. **Evaluar uso real**
2. **Considerar Reserved Instances**
3. **Optimizar instancias (t3.nano vs t2.micro)**
4. **Implementar auto-scaling básico**

### **🚀 Escalamiento futuro**
```bash
# Migrar a arquitectura serverless
aws lambda create-function

# Load balancer con auto-scaling
aws autoscaling create-auto-scaling-group

# Multi-AZ para alta disponibilidad
aws rds modify-db-instance --multi-az
```

---

## 🆘 **TROUBLESHOOTING COMÚN**

### **❌ Error: "Free tier exceeded"**
```bash
# Verificar uso actual
aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-12-31

# Terminar instancias innecesarias
aws ec2 terminate-instances --instance-ids i-xxxxxxxxx
```

### **❌ Error: "t2.micro not available"**
```bash
# Cambiar región
aws configure set region us-west-2

# Verificar disponibilidad
aws ec2 describe-instance-type-offerings --location-type availability-zone
```

### **❌ Error: "S3 bucket name exists"**
```bash
# Usar nombre único
aws s3 mb s3://happy-baby-style-$(date +%s)
```

---

## 📞 **SOPORTE Y RECURSOS**

### **🔗 Enlaces Útiles**
- **AWS Free Tier**: https://aws.amazon.com/free/
- **Calculator**: https://calculator.aws/
- **Documentation**: https://docs.aws.amazon.com/
- **Support**: https://console.aws.amazon.com/support/

### **📚 Tutoriales Adicionales**
- **EC2 Setup**: https://docs.aws.amazon.com/ec2/latest/userguide/
- **RDS PostgreSQL**: https://docs.aws.amazon.com/rds/latest/userguide/
- **S3 Static Website**: https://docs.aws.amazon.com/s3/latest/userguide/

---

## 🎉 **¡FELICIDADES!**

Con esta guía tienes todo lo necesario para desplegar tu aplicación **Happy Baby Style** en AWS completamente **GRATIS** por 12 meses.

**🚀 ¡Tu aplicación estará lista para producción sin costo alguno!**

---

> **💡 Tip**: Guarda este documento y compártelo con tu equipo. Es una guía completa que te servirá durante todo el primer año.