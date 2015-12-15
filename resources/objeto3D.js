/* Prototipo Objeto3D
 * Propiedades:
 * 	- nombre: nombre del objeto
 * 	- programInfo: shaders (programa) del objeto
 * 	- atributos: ubicacion de los atributos de Objeto3D.
 *  - uniformes: ubicacion de las matrices uniformes de Objeto3D.
 *  - datos: datos de la malla (mesh) del Objeto3D.
 *  - buffers: buffers para los datos del Objeto3D.
 */
function Objeto3D(nombre) {
	this.nombre = nombre;
	this.programInfo = null;
	this.atributos = {
		a_VertexPosition: null,	// Atributos
		//a_TextCoord: null,
		a_VertexNormal: null
	}
	this.uniformes = {
		u_Matrix: null,			// Uniformes
		u_VMatrix: null,
		u_PMatrix: null,
		u_LuzPosicion: null,	// Luces
		u_Ambiental: null,
		u_Difusa: null,
		u_Especular: null,
		u_Brillantez: null
	};
	this.datos = {
		vertices: [],	// Array con las coordenadas de los vertices.
		normales: [],	// Array con las normales de los vertices.
		//uvCoords: [],	// Array con las Coordenadas UV de los vertices.
		caras: [],		// IBO
		material: null	// Material
	};
	this.buffers = {
		verticeBuffer: null,
		colorBuffer: null,
		//coordBuffer: null,
		normalBuffer: null,
		carasBuffer: null
	};

	/* Inicia los buffers del Objeto3D a partir de los datos
	 * de this.datos.
	 */
	this.setupBuffer = function()
	{
		/* BUFFER "verticeBuffer" para las coordenadas de los vertices 
		 * de objeto3D.
		 */
		this.buffers.verticeBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.verticeBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, 
			new Float32Array(this.datos.vertices), gl.STATIC_DRAW);

		/* BUFFER "coordBuffer" para las coordenadas UV de los vertices 
		 * de objeto3D.
		 */
		/*
		this.buffers.coordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.coordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, 
			new Float32Array(this.datos.uvCoords), gl.STATIC_DRAW);
		*/

		/* BUFFER "normalBuffer" para las normales de los vertices 
		 * de objeto3D.
		 */
		this.buffers.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, 
			new Float32Array(this.datos.normales), gl.STATIC_DRAW);

		/* BUFFER "caras" con los indices a los vertices de
		 * "vertices" (IBO) que formaran las caras de objeto3D.
		 */
		this.buffers.carasBuffer = gl.createBuffer();
		// Introducimos la longitud del buffer.
		this.buffers.carasBuffer.npuntos = this.datos.caras.length;
		// El buffer almacena los indices de los vertices.
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.carasBuffer);
		// Los indices seran enteros, no necesitamos mas espacio.
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(this.datos.caras), gl.STATIC_DRAW);
	}

	/* Introduce los buffers verticeBuffer y normalBuffer en los
	 * atributos a_VertexPosition y a_VertexNormal.
	 */
	this.setupAttributes = function()
	{
		/* 
		 * BUFFER PARA ATRIBUTO POSICION DE VERTICES
		 */
		// Busca donde debe ir la posicion de los vertices en el programa.
		var positionLocatAttrib = this.atributos.a_VertexPosition;
		gl.enableVertexAttribArray(positionLocatAttrib);
		// Enlazamos con las posiciones de los vertices.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.verticeBuffer);
		gl.vertexAttribPointer(positionLocatAttrib, 3, gl.FLOAT,
			false, 0, 0);			// El 3 es por coordenadas X,Y,Z
		
		/*
		 * BUFFER PARA ATRIBUTO COORDENADAS UV DE VERTICES
		 */
		/*
		// Busca donde debe ir las coordenadas UV en el programa.
		var coordLocatAttrib = this.unifAndAttr.a_TextCoord;
		gl.enableVertexAttribArray(coordLocatAttrib);
		// Enlazamos con las coordenadas UV de los vertices.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.coordBuffer);
		gl.vertexAttribPointer(coordLocatAttrib, 2, gl.FLOAT,
			false, 0, 0);			// El 2 es por UV*/					// No hay texturas todavia

		/*
		 * BUFFER PARA ATRIBUTO NORMALES DE VERTICES
		 */
		// Busca donde deben ir las normales de los vertices en el programa.
		var normalLocatAttrib = this.atributos.a_VertexNormal;
		gl.enableVertexAttribArray(normalLocatAttrib);
		// Enlazamos con las normales de los vertices.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normalBuffer);
		gl.vertexAttribPointer(normalLocatAttrib, 3, gl.FLOAT,
			false, 0, 0);			// El 3 es por [X Y Z]
	};

	/* Almacena mVision, mPerspectiva y mModelo en sus respectivas
	 * matrices uniformes.
	 */
	this.setupUniformes = function(mVision, mPerspectiva, mModelo, luz)
	{
		gl.uniformMatrix4fv(this.uniformes.u_VMatrix, false, mVision);
		gl.uniformMatrix4fv(this.uniformes.u_PMatrix, false, mPerspectiva);
		gl.uniformMatrix4fv(this.uniformes.u_Matrix, false, mModelo);

		// Luces:
		gl.uniform4fv(this.uniformes.u_LuzPosicion, (luz.posicion));

		var pAmbiental = vec4.create();
		vec4.mul(pAmbiental, luz.ambiental, this.datos.material.ambiental);
		gl.uniform4fv(this.uniformes.u_Ambiental, (pAmbiental));

		var pDifusa = vec4.create();
		vec4.mul(pDifusa, luz.difusa, this.datos.material.difusa);
		gl.uniform4fv(this.uniformes.u_Difusa, (pDifusa));

		var pEspecular = vec4.create();
		vec4.mul(pEspecular, luz.especular, this.datos.material.especular);
		gl.uniform4fv(this.uniformes.u_Especular, (pEspecular));

		gl.uniform1f(this.uniformes.u_Brillantez, 
			this.datos.material.brillantez);
	};
}

/* Prototipo Material
 * Propiedades:
 * 	- nombre: nombre del material
 *  - ambiental: colores "ambientales" del material
 *  - difusa: colores "difusos" del material.
 *  - especular: colores "especulares" del material.
 *  - brillantez: constante de "brillantez" del material.
 *  - rutaTextura: ruta de la textura
 *  - textura: la textura del material
 */
function Material(nombre) {
	// Nombre
	this.nombre = nombre;
	// Datos para la iluminacion
	this.ambiental = [0.0, 0.0, 0.0, 1.0];
	this.difusa = [0.0, 0.0, 0.0, 1.0];
	this.especular = [0.0, 0.0, 0.0, 1.0];
	this.brillantez = 0.5;
	// Datos para la textura
	this.rutaTextura = null;
	this.textura = null;
	
	/* Introduce la imagen dada por "rutaTextura" en la "textura".
	 */
	this.cargaTextura = function() {
		this.textura = gl.createTexture();	// Creamos la textura.
		this.textura.image = new Image();	// Añadimos la imagen
		this.textura.image.onload = function() {
			// Una vez cargada la imagen la copiamos a la textura.
			
			// Trabajaremos solo sobre this.textura
			gl.bindTexture(gl.TEXTURE_2D, this.textura);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
				gl.UNSIGNED_BYTE, this.textura.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
				gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
				gl.NEAREST);				
			// Limpiamos los enlaces
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
		this.textura.image.src = this.rutaTextura;
	};
}
