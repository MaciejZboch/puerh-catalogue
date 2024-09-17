const User = require("../models/user");

module.exports.registerForm = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res) => {
  function hasWhiteSpace(s) {
    return s.indexOf(" ") >= 0;
  }
  const { email, username, password } = req.body;
  if (
    username.length < 6 ||
    password.length < 6 ||
    hasWhiteSpace(password) ||
    hasWhiteSpace(username)
  ) {
    req.flash(
      "error",
      "Please make your username and password at least 6 characters long and contain no spaces!"
    );
    res.redirect("/register");
  } else {
    try {
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);

        req.flash("success", "Welcome!");
        res.redirect("/tea");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/tea";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/tea");
  });
};
