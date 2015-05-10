var gl = null;
var prog = null;
var vert_buff = null;
var indi_buff = null;

var verts = [];
var indis  = [];

var c_width = 0;
var c_hight = 0;


function init() {
	init_gl("c");
	init_prog();
	init_buff();
	render_loop();
	setInterval(logic_loop, 33);
}

function init_gl(canvas_id) {
	var c = document.getElementById(canvas_id);
	c_width = c.width;
	c_height = c.height;

	var wgl = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
	for (var n = 0; n < wgl.length; ++n) {
		try { gl = c.getContext(wgl[n]); }
		catch (e) {}
		if (gl) { break; }
	}

	if (gl == null)
		{ alert("dead webGL; RIP"); }
}

function init_prog() {
	var vs = null;
	var fs = null;
	var str = "";
	var shader = null;

	var vs_s = document.getElementById("shader-vs");
	str = "";
	var k = vs_s.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}
	shader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		{ alert(gl.getShaderInfoLog(shader)); }
	vs = shader;
	shader = null;

	var fs_s = document.getElementById("shader-fs");
	str = "";
	k = fs_s.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}
	shader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		{ alert(gl.getShaderInfoLog(shader)); }
	fs = shader;
	shader = null;

	prog = gl.createProgram();
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
		{ alert("Shader failed"); }
	gl.useProgram(prog);

	prog.obj_pos = gl.getAttribLocation(prog, "obj_pos");
}

function init_buff() {
	vert_buff = gl.createBuffer();
	verts =  [
		-0.1, 0.1, 0.0,
		-0.1, -0.1, 0.0,
		0.1, -0.1, 0.0,
		0.1, 0.1, 0.0
	];
	gl.bindBuffer(gl.ARRAY_BUFFER, vert_buff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);


	indi_buff = gl.createBuffer();
	indis = [
		3, 2, 1, 3, 1, 0
	];
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indi_buff);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indis), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function draw() {
	//gl.clearColor(Math.random(), Math.random(), Math.random(), 1.0);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0, c_width, c_height);

	gl.bindBuffer(gl.ARRAY_BUFFER, vert_buff);
	gl.vertexAttribPointer(prog.vecPos, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(prog.vecPos);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indi_buff);
	gl.drawElements(gl.TRIANGLE_STRIP, indis.length, gl.UNSIGNED_BYTE, 0);
}

function render_loop() {
	web_gl.aniFrame(render_loop);
	draw();
}

function logic_loop() {
	//console.log('cats');
}