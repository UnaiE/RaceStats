# 🔐 Panel de Autenticación - RaceStats

## ✅ Implementación Completada

### 🎯 Funcionalidades

1. **Inicio de sesión** con email y contraseña
2. **Registro de nuevos usuarios** con validación
3. **Toggle dinámico** entre formularios de login y registro
4. **Validaciones en frontend y backend**
5. **Integración completa** con PostgreSQL + SQLAlchemy

---

## 📋 Archivos Modificados/Creados

### Backend (FastAPI)

#### ✨ Nuevos
- **schemas/sql/user_schemas.py**: 
  - `UserLogin` con EmailStr
  - `UserLoginResponse` con datos completos del usuario

#### 🔧 Modificados
- **routes/sql/login_router.py**:
  - Endpoint: `POST /auth/login`
  - Response model completo
  - Documentación Swagger

- **controllers/sql/user_controller.py**:
  - Retorna `user_id`, `username`, `email`, `message`

- **main.py**:
  - Router de login registrado correctamente

### Frontend (React)

#### ✨ Nuevos
- **components/RegisterForm.jsx**:
  - Formulario de registro
  - Validación de contraseñas coincidentes
  - Mínimo 6 caracteres
  - Toggle para cambiar a login

- **pages/AuthPage.jsx**:
  - Contenedor principal
  - Toggle entre Login/Registro
  - Logo y título de la app
  - Callbacks de éxito configurables

#### 🔧 Modificados
- **components/LoginForm.jsx**:
  - Props para callbacks (`onSuccess`, `onSwitchToRegister`)
  - Endpoint actualizado a `/auth/login`
  - Manejo de errores mejorado
  - Toggle para cambiar a registro

- **api/authApi.js**:
  - `loginUser(email, password)`
  - `registerUser(username, email, password)`
  - `getUserProfile(userId)`

- **App.jsx**:
  - Cambiado de `LoginPage` a `AuthPage`

---

## 🚀 Cómo Usar

### 1. Acceder a la aplicación

```
http://localhost:5173
```

### 2. Crear una cuenta

1. Click en **"¿No tienes cuenta? Regístrate"**
2. Completar formulario:
   - Nombre de usuario (mínimo 3 caracteres)
   - Email válido
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
3. Click en **"Crear cuenta"**
4. Automáticamente te redirige a login después de 2 segundos

### 3. Iniciar sesión

1. Ingresar email y contraseña
2. Click en **"Entrar"**
3. Mensaje de bienvenida: "Bienvenido/a, [nombre]"

---

## 🔍 Endpoints API

### Registro
```http
POST http://localhost:8000/users/
Content-Type: application/json

{
  "username": "TestUser",
  "email": "test@racestats.com",
  "password": "test1234"
}
```

**Response:**
```json
{
  "id": 2,
  "username": "TestUser",
  "email": "test@racestats.com"
}
```

### Login
```http
POST http://localhost:8000/auth/login
Content-Type: application/json

{
  "email": "test@racestats.com",
  "password": "test1234"
}
```

**Response:**
```json
{
  "user_id": 2,
  "username": "TestUser",
  "email": "test@racestats.com",
  "message": "Bienvenido/a, TestUser"
}
```

---

## 🎨 Características de UI

- **Diseño moderno** con Tailwind CSS
- **Gradiente de fondo** azul/índigo
- **Formularios con validación** en tiempo real
- **Mensajes de error/éxito** diferenciados por color
- **Transiciones suaves** entre estados
- **Responsive** (adaptable a móviles)

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con **bcrypt**
- ✅ Validación de email con **EmailStr** de Pydantic
- ✅ Mensajes de error genéricos (no revela si el email existe)
- ✅ CORS configurado correctamente
- ✅ Validaciones en frontend y backend

---

## 📝 Próximos Pasos Sugeridos

1. **Gestión de sesión**:
   - Implementar JWT tokens
   - Guardar token en localStorage
   - Crear Context/Provider para usuario autenticado

2. **Protección de rutas**:
   - HOC o componente PrivateRoute
   - Redirigir a login si no autenticado

3. **Perfil de usuario**:
   - Página para ver/editar perfil
   - Cambiar contraseña
   - Subir avatar

4. **Recuperación de contraseña**:
   - Endpoint para reset
   - Envío de emails

---

## ✅ Usuario de Prueba

Ya existe un usuario creado para testing:

- **Email**: test@racestats.com
- **Contraseña**: test1234
- **Username**: TestUser

---

## 🐛 Troubleshooting

### El login no funciona
1. Verificar que el backend esté corriendo: `docker ps`
2. Verificar logs: `docker logs racestats_backend_fastapi`
3. Probar endpoint directamente con curl/Postman

### El registro devuelve error
1. Verificar que PostgreSQL esté corriendo
2. Comprobar que el email no exista ya
3. Verificar que la contraseña tenga mínimo 6 caracteres

### Frontend no muestra cambios
1. Verificar que el frontend esté corriendo en puerto 5173
2. Limpiar cache del navegador (Ctrl + Shift + R)
3. Revisar consola del navegador por errores

---

**Desarrollado por**: GitHub Copilot
**Fecha**: Noviembre 2025
**Stack**: FastAPI + PostgreSQL + React + Tailwind CSS
