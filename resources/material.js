/* Material prototype
 * Properties:
 * 	- mName: material's name
 *  - ambient: material's "ambient" color.
 *  - diffuse: material's "diffuse" color.
 *  - specular: material's "specular" color.
 *  - shininess: material's "shininess".
 */
function Material(name) {
	this.mName = name;	// Name
	// Ilumination data
	this.ambient = [0.0, 0.75, 1.0, 1.0];		// Default: "DeepSkyBlue"
	this.diffuse = [0.0, 0.75, 1.0, 1.0];		// Default: "DeepSkyBlue"
	this.specular = [0.75, 0.75, 0.75, 1.0];	// Default: "Silver"
	this.shininess = 0.5;
}
