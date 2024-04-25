const loggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ message: "ACCESS DENIED - YOU ARE NOT LOGGED IN" });
  }
  next();
};
module.exports = { loggedIn };