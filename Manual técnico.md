# Manual Técnico - Proyecto Ahoralo

## Tabla de Contenidos

1. [Arquitectura del Sistema](#1-arquitectura-del-sistema)
2. [Especificaciones Técnicas](#2-especificaciones-técnicas)
3. [Configuración del Entorno](#3-configuración-del-entorno)
4. [Estructura del Proyecto](#4-estructura-del-proyecto)
5. [APIs y Endpoints](#5-apis-y-endpoints)
6. [Base de Datos](#6-base-de-datos)
7. [Seguridad](#7-seguridad)


## 1. Arquitectura del Sistema

### 1.1 Visión General

Tecnologías principales usadas 

- Frontend:![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- Backend: ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) + ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- Base de Datos: ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) (![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white))
- Servicios Cloud: ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) + ![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)
### 1.2 Diagrama de Arquitectura

```
Cliente Mobile → API Gateway → Servicios Backend → Supabase/Servicios Cloud
```

## 2. Especificaciones Técnicas

### 2.1 Requisitos del Sistema

#### Cliente Mobile
- ![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=ios&logoColor=white): Versión 13.0 o superior
- ![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white): API Level 29 (Android 10.0) o superior




  

## 3. Configuración del Entorno

### 3.1 Instalación

```bash
# Usando npm
npm start

# Usando npm
yarn start
```

Para Android 

```bash
# Usando npm
npm run android

# Usando npm
yarn android


```

Para iOS

```bash
# Usando npm
npm run ios

# Usando npm
yarn ios


```
### 3.2 Variables de Entorno

```env
# Backend
PORT=8080
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret


# Frontend
API_URL=http://localhost:8080
GOOGLE_MAPS_KEY=your_google_maps_key
```

## 4. Estructura del Proyecto

### 4.1 Frontend

```
frontend/
├── src/
│   ├── actions/
│   ├── assets/
│   ├── config/
│   ├── domain/
│   ├── infrastructure/
│   ├── presentation/
│   ├── providers/
│   └── types/
└── index.js

```

### 4.2 Backend

```
backend/
├── src/
│   ├── audit-log/
│   ├── auth/
│   ├── cities/
│   ├── comcity/
│   ├── common/
│   ├── companies/
│   ├── files/
│   ├── prodcomcity/
│   ├── products/
│   └── seed/
├── config/
└── server.js
```

## 5. APIs y Endpoints

### 5.1 Autenticación
```javascript
POST /api/auth/register
POST /api/auth/login
GET /api/auth/check-status
POST /api/auth/validate-google-token
```

### 5.2  Seed
```javascript

GET /api/seed

```

### 5.3 Productos
```javascript
POST /api/products
GET /api/products
PATCH /api/products/{id} 
DELETE /api/products/{id}


```

### 5.4 Cuidades

```javascript
POST /api/cities
GET /api/cities
GET /api/cities/search
GET /api/cities/{id}
PATCH /api/cities/{id}
DELETE /api/cities/{id}

```

ñ
### 5.5 Compañias

```javascript
POST /api/companies
GET  /api/companies
GET /api/companies/search
GET /api/companies/{id}
PATCH /api/companies/{id}
DELETE /api/companies/{id}

```



## 6. Base de Datos

### 6.1 Esquemas PostgreSQL (Supabase)



[![SGnFY.jpg](https://s7.gifyu.com/images/SGnFY.jpg)](https://gifyu.com/image/SGnFY)

## 7. Seguridad

### 7.1 Autenticación
- Supabase Authentication
- JWT para tokens de acceso
- Políticas de seguridad Row Level Security (RLS)

### 7.2 Validaciones
```javascript
const validateReceipt = (data) => {
  const schema = Joi.object({
    items: Joi.array().required(),
    store: Joi.object().required(),
    timestamp: Joi.date().required()
  });
  return schema.validate(data);
};
```
