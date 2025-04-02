const User = require("../models/user");
const passport = require("passport");
module.exports.registerForm = (req, res) => {
  const pageTitle = "Register";
  res.render("users/register", { pageTitle });
};

module.exports.register = async (req, res) => {
  //validations
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
      "Please make sure your username and password are at least 6 characters long and contain no spaces!"
    );
    res.redirect("/register");
  } else {
    //actual user creation
    try {
      const user = new User({ email, username });
      user.moderator = false;
      user.image = req.file;
      user.image = { url: req.file.path, filename: req.file.filename };
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);

        req.flash("success", "Welcome!");
        res.redirect("/tea");
      });
    } catch (e) {
      if (e.code === 11000) {
        req.flash(
          "error",
          "This email is taken! An account with this email already exists."
        );
      } else if (e.name === "UserExistsError") {
        req.flash(
          "error",
          "This username is taken! An account with this username already exists."
        );
      } else {
        req.flash("error", e.message);
      }
      res.redirect("/register");
    }
  }
};

module.exports.loginForm = (req, res) => {
  const pageTitle = "Login";
  res.render("users/login", { pageTitle });
};

module.exports.login = async (req, res, next) => {
  const redirectUrl = req.session.returnTo || "/tea";

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome back!");
      delete req.session.returnTo;
      res.redirect(redirectUrl);
    });
  })(req, res, next); // Execute passport.authenticate
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
