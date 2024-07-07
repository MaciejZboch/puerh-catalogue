const User = require('../models/user')
module.exports.registerForm = (req, res) => {
    res.render('users/register')
}
module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err)

            req.flash('success', 'welcome to camp!')
            res.redirect('/tea')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login')
}

module.exports.login = async (req, res) => {
    req.flash('success', 'welcome back!');
    res.redirect('/tea')
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'goodbye!')
        res.redirect('/tea')
    })
}