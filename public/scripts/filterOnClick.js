document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keypress", function (e) {
      let chr = String.fromCharCode(e.which);
      if ("!#$%^&*()_+-=][{};,<>/?`~'\"\\".includes(chr)) {
        e.preventDefault(); // Prevent input of special characters
      }
    });
  });
});
