const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      res.status(400).send({
        message: "token is required",
      });
    }

    // console.log(req.headers.authorization);
    const [type, token] = req.headers.authorization.split(" ");

    if (type.toLocaleLowerCase() != "bearer") {
      res.status(406).send({
        message: "invalid  type",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(decoded);

    req.decoded = decoded;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = authMiddleware;
