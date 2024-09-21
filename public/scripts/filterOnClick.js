document.getElementById("vendor").onkeypress = function (e) {
  let chr = String.fromCharCode(e.which);
  if ("!@#$%^&*()_+-=][{};,.<>/?`~'\"\\".indexOf(chr) >= 0) return false;
};
document.getElementById("producer").onkeypress = function (e) {
  let chr = String.fromCharCode(e.which);
  if ("!@#$%^&*()_+-=][{};,.<>/?`~'\"\\".indexOf(chr) >= 0) return false;
};
