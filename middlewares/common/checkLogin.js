const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    try {
      const token = cookies[process.env.COOKIE_NAME];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (res.locals.html) {
        res.locals.loggedInUser = decoded;
      }

      next();
    } catch (err) {
      if (res.locals.html) {
        res.redirect("/");
      } else {
        res.status(500).json({
          errors: {
            common: {
              msg: "Authentication failure!",
            },
          },
        });
      }
    }
  } else {
    if (res.locals?.html) {
      res.redirect("/");
    } else {
      res.status(500).json({
        errors: {
          common: {
            msg: "Authentication failure!",
          },
        },
      });
    }
  }
};

const redirectLoggedIn = function (req, res, next) {
  const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (!cookies) {
    next();
  } else {
    res.redirect("/inbox");
  }
};

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role && role.includes[req.user.role]) {
      next();
    } else {
      res.status(401).json({
        errors: {
          common: {
            msg: "You are not authorized!",
          },
        },
      });
    }
  };
}

module.exports = { checkLogin, redirectLoggedIn, requireRole };
