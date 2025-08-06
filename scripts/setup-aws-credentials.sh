#!/bin/bash

# Script para configurar AWS CLI con credenciales
echo "🔐 Configuración de AWS CLI para Happy Baby Style"
echo "=================================================="
echo ""

echo "📋 Para continuar necesitas tus credenciales de AWS:"
echo "   1. AWS Access Key ID"
echo "   2. AWS Secret Access Key"
echo ""
echo "💡 ¿Cómo obtener estas credenciales?"
echo "   1. Ve a AWS Console → IAM → Users"
echo "   2. Selecciona tu usuario o crea uno nuevo"
echo "   3. Ve a 'Security credentials'"
echo "   4. Click 'Create access key'"
echo "   5. Selecciona 'Command Line Interface (CLI)'"
echo "   6. Copia las credenciales que aparecen"
echo ""

# Verificar si ya está configurado
if aws sts get-caller-identity &>/dev/null; then
    echo "✅ AWS CLI ya está configurado"
    
    # Mostrar configuración actual
    echo "📊 Configuración actual:"
    AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text 2>/dev/null)
    AWS_USER=$(aws sts get-caller-identity --query Arn --output text 2>/dev/null | cut -d'/' -f2)
    AWS_REGION=$(aws configure get region)
    
    echo "   Cuenta: $AWS_ACCOUNT"
    echo "   Usuario: $AWS_USER"
    echo "   Región: $AWS_REGION"
    echo ""
    
    read -p "¿Quieres reconfigurar? (y/n): " reconfigure
    if [[ $reconfigure != "y" && $reconfigure != "Y" ]]; then
        echo "✅ Usando configuración existente"
        exit 0
    fi
fi

echo "🚀 Iniciando configuración..."
echo ""

# Configurar AWS CLI interactivamente
aws configure --profile default

echo ""
echo "🔍 Verificando configuración..."

# Verificar credenciales
if aws sts get-caller-identity &>/dev/null; then
    echo "✅ ¡Credenciales configuradas correctamente!"
    
    # Mostrar información de la cuenta
    AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
    AWS_USER=$(aws sts get-caller-identity --query Arn --output text | cut -d'/' -f2)
    AWS_REGION=$(aws configure get region)
    
    echo ""
    echo "📊 Información de tu cuenta:"
    echo "   Cuenta AWS: $AWS_ACCOUNT"
    echo "   Usuario: $AWS_USER"
    echo "   Región: $AWS_REGION"
    echo ""
    
    # Verificar Free Tier (si es posible)
    echo "🎯 Verificando estado del Free Tier..."
    echo "   💡 Puedes verificar tu Free Tier en:"
    echo "   https://console.aws.amazon.com/billing/home#/freetier"
    echo ""
    
    echo "✅ ¡Configuración completada!"
    echo "🚀 Ahora puedes proceder a crear la instancia RDS"
    
else
    echo "❌ Error en la configuración"
    echo "💡 Verifica que:"
    echo "   - Las credenciales sean correctas"
    echo "   - Tengas permisos de RDS"
    echo "   - La región sea válida"
    exit 1
fi