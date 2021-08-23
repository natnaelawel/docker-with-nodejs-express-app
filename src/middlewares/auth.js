const protectRoute = (req, res, next) => {
  if (!req.session) {
    return next(
      new Error({ success: false, message: "You are not logged in" })
    ); // handle error
  }
  const { user } = req.session;
  if (!user) {
    return res.status(401).json({ success: false, message: "UnAuthorized" });
  }
  next(); // otherwise continue
};

module.exports = {
  protectRoute,
};
