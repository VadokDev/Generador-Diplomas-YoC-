# Generador de Diplomas para los Talleres YoC+

### Modo de uso:

1. Clonar el repositorio e instalar los paquetes.

```bash
	yarn install
```

2. Renombrar el archivo ```data.example.js``` a ```data.js``` e ingresar en él los nombres de los estudiantes según taller y paralelo.

```Javascript
	module.exports = {
		'basico': {
			'Paralelo 1': [
				'Gonzalo Fernández',
				'Anastasiia Fedorova',
				'María Paz Morales Llopis',
				...
			], 
			'Paralelo 2': [
				'Nombre1 Nombre2 Apellido1 Apellido2',
				...
			],
			...
		},
		'intermedio': {
			'Numero Paralelo': [
				'Nombre1 Nombre2 Apellido1 Apellido2',
				...
			],
			...
		},
		'avanzado': {
			'Numero Paralelo': [
				'Nombre1 Nombre2 Apellido1 Apellido2',
				...
			],
			...
		}
	};
```
3. Generar los diplomas.

```bash
yarn start
```

### Otros

1. Se pueden modificar los templates editando los pdfs de la carpeta ```templates```
2. Se pueden generar diplomas de competencia descomentando la línea 109 de ```index.js``` e indicando el taller correspondiente.
3. Si se agregan más talleres, se debe agregar el template correspondiente, manteniendo la relación de nombre
4. La tipografía de los nombres es **LibreBaskerville-Bold** y puede cambiarse en la línea 102 de ```index.js```, además, se debe dejar la tipografía en la carpeta ```fonts```
