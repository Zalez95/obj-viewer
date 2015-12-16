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
