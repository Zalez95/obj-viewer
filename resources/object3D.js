/* Object3D prototype
 * Properties:
 * 	- oName: Object3D's name
 * 	- programInfo: Object3D's shaders
 * 	- oAttributes: Object3D's Attributes location.
 *  - oUniforms: Object3D's uniform matrixes location.
 *  - oData: Object3D's mesh data.
 *  - buffers: Object3D's data buffers.
 */
function Object3D(name) {
	this.oName = name;
	this.programInfo = null;
	this.oAttributes = {
		a_VertexPosition: null,	// Attributes
		a_VertexNormal: null
	};
	this.oUniforms = {
		u_Matrix: null,			// oUniforms
		u_VMatrix: null,
		u_PMatrix: null,
		u_LightPosition: null,	// Lights
		u_Ambient: null,
		u_Diffuse: null,
		u_Specular: null,
		u_Shininess: null
	};
	this.oData = {
		vertexes: [],	// Array with the vertexes coordinates.
		normals: [],	// Array with the vertexes normals.
		faces: [],		// IBO
		material: new Material("DefaultMaterial")	// Material
	};
	this.buffers = {
		vertexBuffer: null,
		colorBuffer: null,
		normalBuffer: null,
		faceBuffer: null
	};

	/* Introduce the attributes locations of programInfo in the property
	 * "oAttributes" of the Object3D for an easy later access.
	 */
	this.locateAttributes = function() {
		this.oAttributes.a_VertexPosition = gl.getAttribLocation(
			this.programInfo, "a_VertexPosition");
		this.oAttributes.a_VertexNormal = gl.getAttribLocation(
			this.programInfo, "a_VertexNormal");
	}

	/* Introduce the uniform matrixes locations of programInfo in the property
	 * "oUniforms" of the Object3D for an easy later access.
	 */
	this.locateUniforms = function() {
		this.oUniforms.u_Matrix = gl.getUniformLocation(
			this.programInfo, "u_Matrix");
		this.oUniforms.u_VMatrix = gl.getUniformLocation(
			this.programInfo, "u_VMatrix");
		this.oUniforms.u_PMatrix = gl.getUniformLocation(
			this.programInfo, "u_PMatrix");
		this.oUniforms.u_LightPosition = gl.getUniformLocation(
			this.programInfo, "u_LightPosition");
		this.oUniforms.u_Ambient = gl.getUniformLocation(
			this.programInfo, "u_Ambient");
		this.oUniforms.u_Difusse = gl.getUniformLocation(
			this.programInfo, "u_Difusse");
		this.oUniforms.u_Specular = gl.getUniformLocation(
			this.programInfo, "u_Specular");
		this.oUniforms.u_Shininess = gl.getUniformLocation(
			this.programInfo, "u_Shininess");
	}

	/* Init the buffers of Objeto3D with the values stored in this.oData.
	 */
	this.setupBuffer = function()
	{
		/* BUFFER "vertexBuffer" for the vertex coordinates of the Object3D.
		 */
		this.buffers.verticeBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.verticeBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, 
			new Float32Array(this.oData.vertexes), gl.STATIC_DRAW);

		/* BUFFER "vertexBuffer" for the vertex normals of the Object3D.
		 */
		this.buffers.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, 
			new Float32Array(this.oData.normals), gl.STATIC_DRAW);

		/* BUFFER "faceBuffer" with the indexes to the vertexes of "vertexes"
		 * (IBO) which form the faces of Object3D.
		 */
		this.buffers.faceBuffer = gl.createBuffer();
		// The buffer lenght.
		this.buffers.faceBuffer.nPoints = this.oData.faces.length;
		// The buffer will store the indexes to the vertexes.
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.faceBuffer);
		// The indexes will be integers, we don't need more space.
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(this.oData.faces), gl.STATIC_DRAW);
	}

	/* Introduce the buffers "verticeBuffer" and "normalBuffer" in the
	 * oAttributes a_VertexPosition y a_VertexNormal.
	 */
	this.setupAttributes = function()
	{
		/* 
		 * BUFFER FOR THE ATTRIBUTE VERTEX POSITION
		 */
		// Gets the location where the coordinates should be in the program.
		var positionLocatAttrib = this.oAttributes.a_VertexPosition;
		gl.enableVertexAttribArray(positionLocatAttrib);
		// Bind the vertexes's coordinates.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.verticeBuffer);
		gl.vertexAttribPointer(positionLocatAttrib, 3, gl.FLOAT,
			false, 0, 0);			// the 3 is because X,Y,Z coordinates

		/*
		 * BUFFER FOR THE ATTRIBUTE VERTEX NORMALS
		 */
		// Gets the location where the normals should be in the program.
		var normalLocatAttrib = this.oAttributes.a_VertexNormal;
		gl.enableVertexAttribArray(normalLocatAttrib);
		// Bind the vertexes's normals.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normalBuffer);
		gl.vertexAttribPointer(normalLocatAttrib, 3, gl.FLOAT,
			false, 0, 0);			// The 3 is because [X Y Z]
	};

	/* Stores mVision, mPerspective y mModel in their respectives uniform
	 * matrixes.
	 */
	this.setupUniforms = function(mVision, mPerspective, mModel, light)
	{
		gl.uniformMatrix4fv(this.oUniforms.u_VMatrix, false, mVision);
		gl.uniformMatrix4fv(this.oUniforms.u_PMatrix, false, mPerspective);
		gl.uniformMatrix4fv(this.oUniforms.u_Matrix, false, mModel);

		// Lights:
		gl.uniform4fv(this.oUniforms.u_LightPosition, (light.position));

		var pAmbient = vec4.create();
		vec4.mul(pAmbient, light.ambient, this.oData.material.ambient);
		gl.uniform4fv(this.oUniforms.u_Ambient, (pAmbient));

		var pDifusse = vec4.create();
		vec4.mul(pDifusse, light.difusse, this.oData.material.diffuse);
		gl.uniform4fv(this.oUniforms.u_Difusse, (pDifusse));

		var pSpecular = vec4.create();
		vec4.mul(pSpecular, light.specular, this.oData.material.specular);
		gl.uniform4fv(this.oUniforms.u_Specular, (pSpecular));

		gl.uniform1f(this.oUniforms.u_Shininess, 
			this.oData.material.shininess);
	};
}
