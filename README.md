# WooWup Challenge - Users Posts API

## Ejecutar localmente

```bash
npm install
npm run dev
```

Servidor en: http://localhost:3000

## 📋 Endpoints

- `GET /users/posts-summary` - Usuarios con posts válidos
- `GET /users/posts-summary?minPosts=5` - Filtrar por posts mínimos  

## ⚙️ Decisiones técnicas

**Validación de emails:** Solo se incluyen usuarios cuyo email contenga `@` (validación simple pero efectiva)

**Filtro minPosts:** Se aplica después de procesar todos los datos, valor por defecto es `0`

**Campo usernameTagline:** Formato `@{username} from {city}` combinando datos del usuario

**Manejo de errores:** Respuesta HTTP 500 con mensaje descriptivo si falla la API externa

**Supuestos:** Se asume que JSONPlaceholder siempre está disponible y devuelve datos consistentes