# WooWup Challenge - Users Posts API

## Ejecutar localmente

```bash
git clone https://github.com/Maximiliano-Toledo/WoowUp-Challenge.git
npm install
npm run dev
```

Servidor en: http://localhost:3000

## Endpoints

- `GET /users/posts-summary` - Usuarios con posts válidos
- `GET /users/posts-summary?minPosts=5` - Filtrar por posts mínimos  

## Decisiones técnicas

**Validación de emails:** Solo se incluyen usuarios cuyo email contenga `@` (validación simple pero efectiva)

**Filtro minPosts:** Se aplica después de procesar todos los datos, valor por defecto es `0`

**Retry simple:** Un reintento automático si falla la primera llamada a la API externa

**Campo usernameTagline:** Formato `@{username} from {city}` combinando datos del usuario

**Manejo de errores:** Respuesta HTTP 500 con mensaje descriptivo si falla la API externa

**Supuestos:** Se asume que JSONPlaceholder siempre está disponible y devuelve datos consistentes

## Algunos usuarios pueden no tener posts. ¿Los incluís con postsCount: 0 o los omitís?

Aquellos usuarios sin posts se representan con`postsCount: 0`. Esta decisión permite mantener la integridad del conjunto de datos y tener el analisis completo de usuarios activos e inactivos