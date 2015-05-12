var vert_buff = null;
var indi_buff = null;

var verts = [];
var indis  = [];

var obj_count = 100;
var colour_mat = [0.0, 0.0, 0.0];
var box_pos = [];
var box_stack = [];

var c_width = 0;
var c_hight = 0;


function init() {
	init_gl("c");
	init_prog();
	init_buff();

	for (var n = 0; n < obj_count; n++) {
		box_pos.push([(Math.random() * 2) - 1, (Math.random() * 2) - 1, 0.0]);
		t_box = {pos: [0.0, 0.0, 0.0], vec: [0.0, 0.0, 0.0]};
		t_box.pos = [(Math.random() * 2) - 1, (Math.random() * 2) - 1, 0.0];
		t_box.vec = [(Math.random() * 0.1) - 0.05, (Math.random() * 0.1) - 0.05, 0.0];
		box_stack.push(t_box);
	}

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
		0, 1, 0, 2, 0, 3, 2, 3, 2, 1
	];
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indi_buff);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indis), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function draw() {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var dw = window.innerWidth;
	var dh = window.innerHeight;
	aspect = [gl.canvas.height / gl.canvas.width, 1.0, 1.0, 1.0];

	if (gl.canvas.width != dw ||
		gl.canvas.height != dh) {

		gl.canvas.width = dw;
		gl.canvas.height = dh;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	}

	gl.uniform4fv(prog.asp, aspect);

	for (var n = 0; n < obj_count; n++) {
		gl.uniform3fv(prog.colour, colour_mat);
		// gl.uniform3fv(prog.pos, box_pos[n]);
		gl.uniform3fv(prog.pos, box_stack[n].pos);

		gl.bindBuffer(gl.ARRAY_BUFFER, vert_buff);
		gl.vertexAttribPointer(prog.vecPos, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(prog.vecPos);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indi_buff);
		gl.drawElements(gl.LINES, indis.length, gl.UNSIGNED_SHORT, 0);
	}
}

function render_loop() {
	web_gl.aniFrame(render_loop);
	draw();
}

function logic_loop() {
	colour_mat = [Math.random(), Math.random(), Math.random()];
	for (var n = 0; n < obj_count; n++) {
		box_stack[n].vec = vec_3_add(box_stack[n].vec, [(0 - box_stack[n].pos[0]) / 1000, (0 - box_stack[n].pos[1]) / 1000, 0.0]);
		box_stack[n].pos = vec_3_add(box_stack[n].pos, box_stack[n].vec);
	}
}