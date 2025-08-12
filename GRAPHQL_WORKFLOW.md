# Flujo de Trabajo GraphQL - Happy Baby Style Admin

## Descripción General

Este documento describe el flujo de trabajo para mantener sincronizados el esquema GraphQL del backend con los tipos TypeScript generados en el frontend.

## Scripts Disponibles

### 1. `npm run graphql:download-schema`
**Descripción**: Descarga el esquema GraphQL actualizado desde el servidor backend.

**Comando**: 
```bash
npx @apollo/rover graph introspect http://localhost:3001/graphql --output src/graphql/schema.graphql
```

**Qué hace**:
- Se conecta al endpoint GraphQL del backend (`http://localhost:3001/graphql`)
- Descarga el esquema completo en formato SDL (Schema Definition Language)
- Guarda el esquema en `src/graphql/schema.graphql`

**Cuándo usarlo**:
- Cuando se inicia el desarrollo
- Después de cambios en el backend que modifiquen el esquema
- Antes de ejecutar codegen

### 2. `npm run codegen`
**Descripción**: Genera tipos TypeScript basados en el esquema GraphQL y las operaciones definidas.

**Comando**: 
```bash
graphql-codegen --config codegen.yml
```

**Qué hace**:
- Lee el esquema descargado (`schema.graphql`)
- Procesa todos los archivos `.graphql` en `src/graphql/`
- Genera tipos TypeScript en `src/generated/graphql.ts`
- Crea hooks de React Apollo para las operaciones

**Cuándo usarlo**:
- Después de descargar un esquema actualizado
- Después de modificar operaciones GraphQL
- Antes de compilar el proyecto

### 3. `npm run graphql:generate`
**Descripción**: Ejecuta ambos comandos en secuencia para un flujo completo.

**Comando**: 
```bash
npm run graphql:download-schema && npm run codegen
```

**Qué hace**:
1. Descarga el esquema más reciente del backend
2. Genera automáticamente los tipos TypeScript

**Cuándo usarlo**:
- **Flujo de trabajo estándar** para mantener todo sincronizado
- Al inicio de cada sesión de desarrollo
- Después de cambios en el backend

## Flujo de Trabajo Recomendado

### Para Desarrolladores Frontend

1. **Al iniciar el desarrollo**:
   ```bash
   npm run graphql:generate
   ```

2. **Después de cambios en el backend**:
   ```bash
   npm run graphql:generate
   ```

3. **Al modificar operaciones GraphQL**:
   ```bash
   npm run codegen
   ```

### Para Desarrolladores Backend

1. **Después de modificar el esquema**:
   - Notificar al equipo frontend
   - El equipo frontend ejecuta `npm run graphql:generate`

## Estructura de Archivos

```
src/
├── graphql/
│   ├── schema.graphql          # Esquema descargado del backend
│   ├── users.graphql           # Operaciones de usuarios
│   ├── products.graphql        # Operaciones de productos
│   ├── orders.graphql          # Operaciones de órdenes
│   └── auth.graphql            # Operaciones de autenticación
└── generated/
    └── graphql.ts              # Tipos TypeScript generados
```

## Configuración del Codegen

El archivo `codegen.yml` está configurado para:
- Leer el esquema desde `src/graphql/schema.graphql`
- Procesar operaciones desde `src/graphql/**/*.graphql`
- Generar tipos TypeScript en `src/generated/graphql.ts`
- Crear hooks de React Apollo para las operaciones

## Solución de Problemas

### Error: "Cannot query field X on type Y"
**Causa**: El esquema del backend ha cambiado y no coincide con las operaciones definidas.

**Solución**:
1. Ejecutar `npm run graphql:download-schema` para obtener el esquema actualizado
2. Revisar y corregir las operaciones GraphQL que ya no son válidas
3. Ejecutar `npm run codegen` para regenerar los tipos

### Error: "GraphQL Document Validation failed"
**Causa**: Las operaciones GraphQL no son válidas según el esquema actual.

**Solución**:
1. Verificar que el backend esté ejecutándose en `localhost:3001`
2. Ejecutar `npm run graphql:generate` para sincronizar todo
3. Revisar los errores de validación y corregir las operaciones

### Error: "Cannot use GraphQLSchema from another module"
**Causa**: Conflictos de versiones de la librería `graphql`.

**Solución**:
1. Limpiar dependencias: `rm -rf node_modules package-lock.json`
2. Reinstalar: `npm install`
3. Usar `npm run graphql:generate` en lugar de comandos apollo legacy

## Comandos Útiles

### Verificar el esquema descargado
```bash
# Ver el tamaño del archivo
ls -la src/graphql/schema.graphql

# Ver las primeras líneas del esquema
head -20 src/graphql/schema.graphql

# Buscar un tipo específico
grep "type User" src/graphql/schema.graphql
```

### Verificar tipos generados
```bash
# Ver el archivo generado
ls -la src/generated/graphql.ts

# Verificar que no hay errores de TypeScript
npm run type-check
```

## Integración con el Flujo de Desarrollo

### Pre-commit Hook (Recomendado)
Considerar agregar un pre-commit hook que ejecute `npm run graphql:generate` para asegurar que los tipos estén siempre sincronizados.

### CI/CD Pipeline
En el pipeline de CI/CD, ejecutar `npm run graphql:generate` antes de `npm run build` para asegurar que la compilación incluya los tipos más recientes.

## Notas Importantes

1. **Siempre ejecutar `graphql:generate`** antes de empezar a trabajar con GraphQL
2. **El esquema se descarga desde localhost:3001** - asegurarse de que el backend esté ejecutándose
3. **Los tipos se generan automáticamente** - no editar manualmente `src/generated/graphql.ts`
4. **Las operaciones GraphQL** deben ser válidas según el esquema actual del backend

## Referencias

- [Apollo Rover CLI](https://go.apollo.dev/migration)
- [GraphQL Code Generator](https://www.graphql-code-generator.com/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
