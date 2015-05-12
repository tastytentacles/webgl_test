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