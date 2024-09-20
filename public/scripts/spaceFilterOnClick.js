document.getElementById("username").onkeypress = function (e) {
  let chr = String.fromCharCode(e.which);
  if (" ".indexOf(chr) >= 0) return false;
};
document.getElementById("password").onkeypress = function (e) {
  let chr = String.fromCharCode(e.which);
  if (" ".indexOf(chr) >= 0) return false;
};
document.getElementById("email").onkeypress = function (e) {
  let chr = String.fromCharCode(e.which);
  if (" ".indexOf(chr) >= 0) return false;
};
