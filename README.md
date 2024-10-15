<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Pricetracker API

1. Clonar proyecto
2. ```yarn install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar las variables de entorno
5. Levantar la base de datos
BUILD DATABASE ONLY
```
docker-compose up -d
```
BUILD DATABASE AND BACKEND
1. Crear el archivo ```.env.prod```
2. Definir las variables para producción
3. Construir la imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build -d
```

6. Levantar: ```yarn start:dev```

7. Ejecutar SEED 
```
http://localhost:3000/api/seed
```
