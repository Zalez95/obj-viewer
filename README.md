OBJ-3D Model Web Visualizer with WebGL
====
To execute, open: "OBJ_Visualizer.html".

Files:
* ./OBJ_Visualizer.html 		- main web page, it handles the interface, shaders and the render.
* ./resources/object3d.js		- Object3d prototype
* ./resources/material.js		- Material prototype
* ./resources/gl-Matrix.js 	- Javascript Matrix and Vector library for High Performance WebGL apps, more information: http://glmatrix.net
* ./resources/loadOBJ.js 		- functions to read all the data from the MTL and OBJ files and initialize all the arrays, the main function is readOBJ.
* ./objs/*					- directory with .obj examples

Limitations:
* The faces of the .obj meshes must be triangles, and they must include the face's normals.
* The visualizer can't load textures yet.
* If the model is really big, you can appear inside the model and don't see it.
* If the materials from .mtl can't be loaded, the model will be seen with the default material, which is Blue.
* If the object has many polygons, the visualizer can take a long time to load because the normals are calculated at the beginning.

Autor
----
- Daniel González Alonso
