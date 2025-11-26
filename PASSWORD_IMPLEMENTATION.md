# 🔐 Actualización del Sistema de Autenticación JWT - Campos de Contraseña

## ✅ Cambios Realizados

Se ha actualizado completamente el sistema de autenticación para incluir validación de contraseñas hasheadas en la base de datos.

### 📊 Cambios en la Base de Datos

#### 1. Actualización del Schema de Prisma
Se agregó el campo `password` a los modelos `Teacher` y `Student`:

```prisma
model Teacher {
  ...
  password        String        // Contraseña hasheada con bcrypt
  ...
}

model Student {
  ...
  password        String        // Contraseña hasheada con bcrypt
  ...
}
```

#### 2. Migración Aplicada
Se ejecutó la migración:
- **Nombre:** `20251126144454_add_password_fields`
- **Estado:** ✅ Aplicada exitosamente

### 🔧 Cambios en el Código

#### 1. **AuthService** (`src/auth/auth.service.ts`)
- ✅ Implementación de validación de contraseña con bcrypt en `login()`
- ✅ Hash de contraseña en `register()` 
- ✅ Manejo correcto de tipos de usuario (Teacher vs Student)

#### 2. **DTOs Actualizados**

**CreateStudentDto** (`src/student/dto/create-student.dto.ts`):
```typescript
password?: string  // Opcional, mínimo 6 caracteres
```

**CreateTeacherDto** (`src/teacher/dto/create-teacher.dto.ts`):
```typescript
password?: string  // Opcional, mínimo 6 caracteres
```

#### 3. **Servicios Actualizados**

**StudentService** (`src/student/student.service.ts`):
- Importa bcrypt
- Hash automático de contraseña al crear
- Contraseña por defecto si no se proporciona

**TeacherService** (`src/teacher/teacher.service.ts`):
- Importa bcrypt
- Hash automático de contraseña al crear
- Contraseña por defecto si no se proporciona

### 📝 Script de Seed

Se creó un script de seed completo (`prisma/seed.ts`) que:
- ✅ Crea especialidades
- ✅ Crea carreras
- ✅ Crea ciclos
- ✅ Crea 2 maestros con contraseña hasheada
- ✅ Crea 2 estudiantes con contraseña hasheada
- ✅ Crea asignaturas de ejemplo

**Credenciales de Prueba:**
```
Maestro 1:
  Email: teacher1@example.com
  Contraseña: password123

Maestro 2:
  Email: teacher2@example.com
  Contraseña: password123

Estudiante 1:
  Email: student1@example.com
  Contraseña: password123

Estudiante 2:
  Email: student2@example.com
  Contraseña: password123
```

### 🛠️ Instalación de Scripts

Se actualizó `package.json` con:

```json
{
  "scripts": {
    "prisma:seed": "ts-node prisma/seed.ts",
    "prisma:generate": "npx prisma generate"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### 🚀 Cómo Usar

#### 1. Ejecutar el Seed
```bash
npm run prisma:seed
```

#### 2. Hacer Login con Credenciales Válidas
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher1@example.com","password":"password123"}'
```

#### 3. Usar Token en Endpoints Protegidos
```bash
curl -X GET http://localhost:3000/student \
  -H "Authorization: Bearer <TOKEN>"
```

### 🔒 Flujo de Autenticación Mejorado

```
1. Usuario intenta login
   POST /auth/login {email, password}
   
2. AuthService busca usuario
   - Primero en Teachers
   - Luego en Students
   
3. Si existe, valida contraseña
   bcrypt.compare(passwordIngresada, passwordHasheada)
   
4. Si es correcta
   - Genera token JWT
   - Retorna access_token
   
5. Cliente usa token
   GET /protected
   Authorization: Bearer <token>
   
6. JwtAuthGuard valida token
   - Extrae payload
   - req.user = { id, email, role }
```

### 📋 Campos del JWT Payload

```json
{
  "sub": 1,                    // ID del usuario
  "email": "user@example.com",
  "role": "teacher|student",
  "iat": 1700000000,          // Emitido en
  "exp": 1700086400           // Expira en (24h después)
}
```

### ✅ Estado Final

- ✅ Base de datos con campos de contraseña
- ✅ Migración aplicada
- ✅ AuthService con validación bcrypt
- ✅ DTOs con campo password opcional
- ✅ Servicios de Student y Teacher con hash
- ✅ Script de seed con datos de prueba
- ✅ Proyecto compila sin errores
- ✅ Login funcional con contraseña validada

### 🧪 Testing Rápido

```bash
# 1. Seed de datos
npm run prisma:seed

# 2. Iniciar servidor
npm run start:dev

# 3. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher1@example.com","password":"password123"}'

# 4. Copiar token de respuesta y usarlo
curl -X GET http://localhost:3000/student \
  -H "Authorization: Bearer eyJhbGc..."
```

### 🔑 Puntos Clave

1. **Contraseña Hasheada:** bcrypt con salt rounds de 10
2. **Seguridad:** Las contraseñas nunca se guardan en texto plano
3. **Compatibilidad:** Los DTOs aceptan password opcional
4. **Validación:** `bcrypt.compare()` en login
5. **Seed:** Proporciona datos de prueba listos para usar

### 📚 Archivos Modificados

```
✅ prisma/schema.prisma                    - Agregado campo password
✅ src/auth/auth.service.ts                - Validación bcrypt
✅ src/student/dto/create-student.dto.ts   - Password opcional
✅ src/teacher/dto/create-teacher.dto.ts   - Password opcional
✅ src/student/student.service.ts          - Hash de contraseña
✅ src/teacher/teacher.service.ts          - Hash de contraseña
✅ package.json                            - Scripts de seed
✅ prisma/seed.ts                         - Script de seed creado
```

---

**Estado:** ✅ Implementado y Compilado Exitosamente  
**Fecha:** Noviembre 26, 2025  
**Versión:** 1.0 con Autenticación Completa
