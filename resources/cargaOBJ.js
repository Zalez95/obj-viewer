/* Prototipo Vertice
 * Propiedades:
 * 	- coordenadas: coordenadas X,Y,Z del Vertice.
 *  - uvCoords: coordenadas UV del Vertice.
 * 	- normales: vector normal del Vertice.
 */
 function Vertice() {
	this.coordenadas = [];
	//this.uvCoords = [];
	this.normales = [];

	/* A partir de los indices a las normales de "normalArray", almacenados
	 * en la propiedad "normales" del vertice, calculamos la normal del 
	 * vertice mediante una media normalizada.
	 */
	this.calcNormalV = function(normalArray) {
		// this.normales = (N1+N2+...+Nn) / |N1+N2+...+Nn|
		var norm = vec3.create();
		for (var i in this.normales) {
			vec3.add(norm, norm, normalArray[this.normales[i]]);
		}
		vec3.normalize(this.normales, norm);
	}
}

/* Retorna una lista con las lineas del de texto "texto".
 */
function textoToLinea(texto) {
	return texto.split('\n');
}

/* Retorna una lista con las palabras de la linea de texto "linea".
 */
function lineaToPalabras(linea) {
	return linea.split(' ');
}

/* Retorna indices o subpalabras a partir de una palabra.
 */
function palabraToIndice(palabra) {
	return palabra.split('/');
}

/* Crea un vertice con las coordenadas del Vertice de "palabra" y lo 
 * introduce de forma temporal en objeto3D.data.vertices
 */
function introduceCoordVert(palabra, objeto3D) {
	var vertice = new Vertice();
	for (var i = 1; i < palabra.length; i++) {
		vertice.coordenadas.push(parseFloat(palabra[i]));
	}
	objeto3D.datos.vertices.push(vertice);
}

/* Almacena las coordenadas UV de "palabra" en uvArray para acceder
 * posteriormente por indice.
 */
/*function introduceUVcVert(palabra, uvArray) {
	var uv = [];
	for (var i = 1; i < palabra.length; i++) {
		uv.push(parseFloat(palabra[i]));
	}
	uvArray.push(uv);
}*/

/* Almacena las coordenadas del vector normal de "palabra" en normalArray
 * para acceder posteriormente por indice.
 */
function introduceNormVert(palabra, normalArray) {
	var normal = [];
	for (var i = 1; i < palabra.length; i++) {
		normal.push(parseFloat(palabra[i]));
	}
	normalArray.push(normal);
}

/* Introduce el indice de los vertices que forman las caras en
 * objeto3D.datos.caras y los indices a las normales de cada vertice
 * en objeto3D.datos.vertices.normales
 */
function introduceCara(palabra, objeto3D, restaV) {
	for (var i = 1; i < palabra.length; i++) {
		// Obtenemos los indices vX/tX/vnX
		var subPalabra = palabraToIndice(palabra[i]);
		var indiceV = parseInt(subPalabra[0]) - restaV,
			//indiceUv = parseInt(subPalabra[1]) - 1,
			indiceN = parseInt(subPalabra[2]) - 1;
		// Introducimos los indices a los vertices de la cara en "caras"
		objeto3D.datos.caras.push(indiceV);
		/* Introducimos los indices de las coordenadas UV en el respectivo
		 * vertice si no estan ya introducidos.
		 */
		/*if (objeto3D.datos.vertices[indiceV].uvCoords.indexOf(indiceUv) < 0) {
			objeto3D.datos.vertices[indiceV].uvCoords.push(indiceUv);
		}*/
		/* Introducimos los indices de las normales en el respectivo vertice
		 * si no estan ya introducidos.
		 */
		if (objeto3D.datos.vertices[indiceV].normales.indexOf(indiceN) < 0) {
			objeto3D.datos.vertices[indiceV].normales.push(indiceN);
		}


		/*
			objeto3D.datos.caras.push(indiceV);

			if (subPalabra[1] != null) {
				// Tiene todos los datos
				indiceUv = palabraToIndice(subPalabra[1]) - restaT;
				indiceN = palabraToIndice(subPalabra[2]) - restaN;
				objeto3D.datos.vertices.[indiceV].normales
				objeto3D.datos.uvCoords.push(uvArray[indiceUv]);
				objeto3D.datos.vertNorm.push(normalArray[indiceN]);
			} else {
				// falta vt
				indiceN = palabraToIndice(subPalabra[2]) - restaN;
				objeto3D.datos.vertNorm.push(normalArray[indiceN]);
			}
		}
		if (subPalabra.length == 2) {
			//falta vn
			indiceUv = palabraToIndice(subPalabra[1]) - restaT;
			objeto3D.datos.uvCoords.push(uvArray[indiceUv]);
		}*/
	}
}

/* Retorna un array con los objetos3D a partir del texto "archivoOBJString" 
 * pasado. En "archivoMTLString" estan los materiales de los objetos.
 * Las caras de los objetos han de ser triangulos.
 */
function leerOBJ(archivoOBJString, archivoMTLString) {
	var lineasOBJ = textoToLinea(archivoOBJString);
	var objetos3D = [],		// Array donde meteremos todos los Objeto3D
		materiales = [],	// Array donde metermos los materiales
		//uvArray = [],		// Array con las coordenadas UV de los vertices
		normalArray = [];	// Array con las normales de los vertices
	var indiceObj = -1, contador = 1, resta = 1;
	var palabra = null;
	for (var i = 0; i < lineasOBJ.length; i++){
		if (lineasOBJ[i] != null) {
			palabra = lineaToPalabras(lineasOBJ[i]);
			switch (palabra[0]) {
				case 'o':		// o: nombreObjeto
					objetos3D.push(new Objeto3D(palabra[1]));	// Nuevo objeto
					indiceObj++;
					resta = contador;
					continue;
				case "mtllib":	// mtllib: nombreArchivoMTL
					materiales = leerMTL(archivoMTLString);
					continue;
				case "usemtl":	// usemtl: nombreMtl
					objetos3D[indiceObj].datos.material = new Material(
						palabra[1]);
					continue;
				case 'v':		// v: v.x v.y v.z
					introduceCoordVert(palabra, objetos3D[indiceObj]);
					contador++;
					continue;
				case "vt":		// vt: vt.u vt.v [vt.w]
					//introduceUVcVert(palabra, uvArray);
					continue;
				case "vn":		// vn: vn.x vn.y vn.z
					introduceNormVert(palabra, normalArray);
					continue;
				case 'f':		// f: v0/t0/vn0 v1/t1/vn1 v2/t2/vn2 - indices
					introduceCara(palabra, objetos3D[indiceObj], resta);
					continue;
				default:
					continue;
			}
		}
	}
	//setData(objetos3D, normalArray, uvArray, materiales);
	setData(objetos3D, normalArray, materiales);
	return objetos3D.reverse();
}

/* Retorna un array con los materiales a partir del texto pasado.
 */
function leerMTL(archivoMTLString) {
	var lineasMTL = textoToLinea(archivoMTLString);
	var materiales = [];
	var indiceMtl = -1;
	for (var i = 0; i < lineasMTL.length; i++){
		if (lineasMTL[i] != null) {
			palabra = lineaToPalabras(lineasMTL[i]);
			switch (palabra[0]) {
				case "newmtl":	// newmtl: nombreMtl
					materiales.push(new Material(palabra[1]));
					indiceMtl++;
					continue;
				case "map_Kd":	// map_Kd: rutaTextura
					materiales[indiceMtl].rutaTextura = palabra[1];
					continue;
				case "Ns":		// Ns: valor de brillantez
					materiales[indiceMtl].brillantez = palabra[1];
					continue;
				case "Ka":		// Ka: R G B - Ambiental
					materiales[indiceMtl].ambiental[0] = parseFloat(palabra[1]);
					materiales[indiceMtl].ambiental[1] = parseFloat(palabra[2]);
					materiales[indiceMtl].ambiental[2] = parseFloat(palabra[3]);
					continue;
				case "Kd":		// Kd: R G B - Difusa
					materiales[indiceMtl].difusa[0] = parseFloat(palabra[1]);
					materiales[indiceMtl].difusa[1] = parseFloat(palabra[2]);
					materiales[indiceMtl].difusa[2] = parseFloat(palabra[3]);
					continue;
				case "Ks":		// Ks: R G B - Especular
					materiales[indiceMtl].especular[0] = parseFloat(palabra[1]);
					materiales[indiceMtl].especular[1] = parseFloat(palabra[2]);
					materiales[indiceMtl].especular[2] = parseFloat(palabra[3]);
					continue;
				default:
					continue;
			}
		}
	}
	return materiales;
}

/* A partir de los datos "Vertice" almacenados actualmente en cada
 * objeto3D.data.vertices calculamos las normales y las introducimos
 * en la propiedad "normales" de los objetos3D.
 * Tambien sustituye los datos Vertice en objeto3D.data.vertices por las
 * coordenadas de los vertices e introduce el respectivo material de
 * cada objeto3D.
 */
function setData(objetos3D, normalArray, materiales) {
	objetos3D.forEach(function(objeto3D) {
		var vertice;
		var arrayVCoord = [],
			//arrayVUvCoord = [],
			arrayVNormal = [];
		for (var i in objeto3D.datos.vertices) {
			vertice = objeto3D.datos.vertices[i];
			vertice.calcNormalV(normalArray);
			arrayVCoord = arrayVCoord.concat(vertice.coordenadas);
			//arrayVUvCoord = arrayVUvCoord.concat(vertice.uvCoords);
			arrayVNormal = arrayVNormal.concat(vertice.normales);
		}	
		objeto3D.datos.vertices = arrayVCoord;
		//objeto3D.datos.uvCoords = arrayVUvCoord;
		objeto3D.datos.normales = arrayVNormal;
		introduceMateriales(objeto3D, materiales);
	});
}

/* Introduce el material que le corresponde a objeto3D a partir del array 
 * "materiales".
 */
function introduceMateriales(objeto3D, materiales) {
	materiales.forEach(function(material) {
		if (objeto3D.datos.material.nombre == material.nombre) {
			objeto3D.datos.material = material;
		}
	});
}
