/* Vertex prototype
 * Properties:
 * 	- coordinates: X,Y,Z coordinates of the vertex.
 * 	- normals: normal vector of the Vertex.
 */
 function Vertex() {
	this.coordinates = [];
	this.normals = [];

	/* With the normal indexes to the normals of normalArray that we stored
	 * in the vertex's "normals" property, calculates the real vertex normal
	 * with the normalized average.
	 */
	this.calcNormalV = function(normalArray) {
		// this.normals = (N1+N2+...+Nn) / |N1+N2+...+Nn|
		var norm = vec3.create();
		for (var i in this.normals) {
			vec3.add(norm, norm, normalArray[this.normals[i]]);
		}
		vec3.normalize(this.normals, norm);
	}
}

/* Returns a list with the "text" lines.
 */
function textToLine(text) {
	return text.split('\n');
}

/* Returns a list with the "line" words.
 */
function lineToWords(line) {
	return line.split(' ');
}

/* Returns index/sub-words from the word.
 */
function wordToIndex(word) {
	return word.split('/');
}

/* Creates a vertex with the "word" coordinates and temporaly stores it in
 * object3D.oData.vertexes
 */
function appendCoordVert(word, object3D) {
	var vertex = new Vertex();
	for (var i = 1; i < word.length; i++) {
		vertex.coordinates.push(parseFloat(word[i]));
	}
	object3D.oData.vertexes.push(vertex);
}

/* Stores the normal coordinates from "word" in normalArray to later access
 * by index.
 */
function appendNormVert(word, normalArray) {
	var normal = [];
	for (var i = 1; i < word.length; i++) {
		normal.push(parseFloat(word[i]));
	}
	normalArray.push(normal);
}

/* Append the vertex's indexes of the face in object3D.oData.faces and the
 * normal's indexes of every vertex in object3D.oData.vertexes.normals
 */
function appendFace(word, object3D, subV) {
	for (var i = 1; i < word.length; i++) {
		// gets the vX/tX/vnX indexes
		var subWord = wordToIndex(word[i]);
		var indexV = parseInt(subWord[0]) - subV,
			indexN = parseInt(subWord[2]) - 1;
		// Append the indexes to the face's vertexes in "faces"
		object3D.oData.faces.push(indexV);
		/* Append the normal index to the vertex's normals in the respective
		 * vertex if it wasn't stored yet.
		 */
		if (object3D.oData.vertexes[indexV].normals.indexOf(indexN) < 0) {
			object3D.oData.vertexes[indexV].normals.push(indexN);
		}
	}
}

/* Returns an array with the Object3Ds from the passed text "fileOBJString".
 * In "fileMTLString" there are the Object3D's materials.
 * The faces must be triangles and have the normals stored.
 */
function readOBJ(fileOBJString, fileMTLString) {
	var linesOBJ = textToLine(fileOBJString);
	var objects3D = [],		// Array where we will store the Object3Ds
		materials = [],		// Array where we will store the materials
		normalArray = [];	// Array where we will store the vertexes
	var indexObj = -1, counter = 1, subV = 1;
	var word = null;
	for (var i = 0; i < linesOBJ.length; i++){
		if (linesOBJ[i] != null) {
			word = lineToWords(linesOBJ[i]);
			switch (word[0]) {
				case 'o':		// o: Object_Name
					objects3D.push(new Object3D(word[1]));	// New Object3D
					indexObj++;
					subV = counter;
					continue;
				case "mtllib":	// mtllib: MTL_File_Name
					materials = readMTL(fileMTLString);
					continue;
				case "usemtl":	// usemtl: MTL_Name
					objects3D[indexObj].oData.material = new Material(
						word[1]);		// New Material
					continue;
				case 'v':		// v: v.x v.y v.z
					appendCoordVert(word, objects3D[indexObj]);
					counter++;
					continue;
				case "vt":		// vt: vt.u vt.v [vt.w]
					continue;
				case "vn":		// vn: vn.x vn.y vn.z
					appendNormVert(word, normalArray);
					continue;
				case 'f':		// f: v0/t0/vn0 v1/t1/vn1 v2/t2/vn2 - indexes
					appendFace(word, objects3D[indexObj], subV);
					continue;
				default:
					continue;
			}
		}
	}
	setData(objects3D, normalArray, materials);
	return objects3D.reverse();
}

/* Returns an array with the materials from the text of "fileMTLString".
 */
function readMTL(fileMTLString) {
	var linesMTL = textToLine(fileMTLString);
	var materials = [];
	var indexMTL = -1;
	for (var i = 0; i < linesMTL.length; i++){
		if (linesMTL[i] != null) {
			word = lineToWords(linesMTL[i]);
			switch (word[0]) {
				case "newmtl":	// newmtl: MTL_Name
					materials.push(new Material(word[1]));	// New Material
					indexMTL++;
					continue;
				case "Ns":		// Ns: shininess value
					materials[indexMTL].shininess = parseFloat(word[1]);
					continue;
				case "Ka":		// Ka: R G B - Ambient
					materials[indexMTL].ambient[0] = parseFloat(word[1]);
					materials[indexMTL].ambient[1] = parseFloat(word[2]);
					materials[indexMTL].ambient[2] = parseFloat(word[3]);
					continue;
				case "Kd":		// Kd: R G B - Diffuse
					materials[indexMTL].diffuse[0] = parseFloat(word[1]);
					materials[indexMTL].diffuse[1] = parseFloat(word[2]);
					materials[indexMTL].diffuse[2] = parseFloat(word[3]);
					continue;
				case "Ks":		// Ks: R G B - Specular
					materials[indexMTL].specular[0] = parseFloat(word[1]);
					materials[indexMTL].specular[1] = parseFloat(word[2]);
					materials[indexMTL].specular[2] = parseFloat(word[3]);
					continue;
				default:
					continue;
			}
		}
	}
	return materials;
}

/* From the "Vertex" data stored in every object3D.oData.vertexes we calculate
 * the normals and append them in the "normals" property of every Object3D.
 * Also we replace the Vertex data in object3D.oData.vertexes with the vertex
 * coordinates of every vertex and inserte the correspoding Material in the
 * every Object3D.
 */
function setData(objects3D, normalArray, materials) {
	objects3D.forEach(function(object3D) {
		var vertex;
		var arrayVCoord = [],
			arrayVNormal = [];
		for (var i in object3D.oData.vertexes) {
			vertex = object3D.oData.vertexes[i];
			vertex.calcNormalV(normalArray);
			arrayVCoord = arrayVCoord.concat(vertex.coordinates);
			arrayVNormal = arrayVNormal.concat(vertex.normals);
		}	
		object3D.oData.vertexes = arrayVCoord;
		object3D.oData.normals = arrayVNormal;
		attachMaterials(object3D, materials);
	});
}

/* Insert the "object3D"'s corresponding material from the "materials" array.
 */
function attachMaterials(object3D, materials) {
	materials.forEach(function(material) {
		if (object3D.oData.material.mName == material.mName) {
			object3D.oData.material = material;
		}
	});
}
