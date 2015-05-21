var gl = null;
var prog = null;
var aspect = [1.0, 1.0, 1.0, 1.0];

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

function grep_shader(id) {
	shad_raw = document.getElementById(id);
	shad_pass = "";
	var k = shad_raw.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			shad_pass += k.textContent;
		}
		k = k.nextSibling;
	}

	var shad_shad = null;
	if (shad_raw.type == "x-shader/x-vertex")
		{ shad_shad = gl.createShader(gl.VERTEX_SHADER); }
	else if (shad_raw.type == "x-shader/x-fragment")
		{ shad_shad = gl.createShader(gl.FRAGMENT_SHADER); }
	else { alert("w/e you just put in me it was not a shader"); }
	
	gl.shaderSource(shad_shad, shad_pass);
	gl.compileShader(shad_shad);

	if (!gl.getShaderParameter(shad_shad, gl.COMPILE_STATUS))
		{ alert(gl.getShaderInfoLog(shad_shad)); }

	return shad_shad;
}

function init_prog() {
	var vs = grep_shader("shader-vs");
	var fs = grep_shader("shader-fs");

	prog = gl.createProgram();
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
		{ alert("Shader failed"); }
	gl.useProgram(prog);

	prog.obj_pos = gl.getAttribLocation(prog, "obj_pos");

	prog.asp = gl.getUniformLocation(prog, "asp");
	prog.colour = gl.getUniformLocation(prog, "colour");
	prog.pos = gl.getUniformLocation(prog, "pos");
	prog.scl = gl.getUniformLocation(prog, "scl");
	prog.rot = gl.getUniformLocation(prog, "rot");
}

function vec_3_add(a, b)
	{ c = [0.0, 0.0, 0.0]; c[0] = a[0] + b[0]; c[1] = a[1] + b[1]; c[2] = a[2] + b[2]; return c; }

function vec_inv(a)
	{ b = [-a[0], -a[1], -a[2]]; return b; }

function dist_to_point(a, b)
	{ c = Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2)); return c; }



var web_gl = new web_gl_obj();
function web_gl_obj() {}

web_gl_obj.prototype.aniFrame = function(r_loop) {
 rAniFrame(r_loop)
}

rAniFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback, element)
	{ window.setTimeout(callback, 1000/60); };
})();