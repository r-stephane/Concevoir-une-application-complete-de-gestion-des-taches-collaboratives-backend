const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const transporter = require("../email/emailTransporter");
const generateCode = require("../email/generateCode");
const otpModel = require("../models/otpModel");
const authMiddleware = require("../middlewares/authMiddleware");

// enregistrer un user
const register = async (req, res) => {
  const { nameUser, password, email, confirmPassword } = req.body;

  const existEmail = await userModel.findOne({ email });
  if (existEmail) {
    res.send({ message: "email existe deja" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let user;
  try {
    user = await userModel.create({
      nameUser,
      email,
      password: hashedPassword,
      confirmPassword,
    });
  } catch (error) {
    res.send({ message: "utilisateur n est pas enregistrer" });
    return;
  }
  const otp = generateCode();
  console.log(otp);

  const otpToken = v4();
  const otpConcred = await otpModel.create({
    userId: user._id,
    otp,
    otpToken,
    purpose: "verify-email",
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verification de votre email",
    html: `<h1>verification de votre email</h1>
    <div>
    Votre token de verification est :
    <strong>${otp}</strong>
    </div>`,
  });

  res.send({
    message: "utilisateur ajouter avec succe",
    user,
    otpToken,
  });
};

const verifyOtp = async (req, res) => {
  const { otp, otpToken, purpose } = req.body;

  if (purpose !== "verify-email") {
    res.status(422).send({
      message: "invalid purpose",
    });
    return;
  }
  const otpConcred = await otpModel.findOne({
    otpToken,
    purpose,
  });

  if (otp !== otpConcred.otp) {
    res.status(406).send({
      message: "otp invalid",
    });
    return;
  }
  const updatedUser = await userModel.findByIdAndUpdate(
    otpConcred.userId,
    { isEmailVerified: true },
    { new: true }
  );

  res.send({
    message: "user successfuly verified",
    updatedUser,
  });
};
const login = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  // console.log(user);
  if (!user) {
    res.status(404).send({ message: "user not found" });
    return;
  }
  const isExactPassword = bcrypt.compareSync(password, user.password);
  if (!isExactPassword) {
    res.status(401).send({ message: "invalid credentials" });
    return;
  }
  // console.log(isPasswordCorrect);

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.SECRET_KEY
  );
  // console.log(token);
  res.send({
    message: "user connect successfully",
    token,
  });
};

//reinisilize password
const reinisilize = async (req, res) => {
  const { email } = req.body;

  const existEmail = await userModel.findOne({ email });
  if (!existEmail) {
    res.status(404).send({ message: "user not found" });
    return;
  }
  const otp = generateCode();
  const otpToken = v4();
  const generateOtp = await otpModel.create({
    userId: existEmail._id,
    otp,
    otpToken,
    purpose: "reset-password",
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: existEmail.email,
    subject: "Reinisilize password",
    html: `<h1>Reinisilize password</h1>
    <div>
    Votre token de verification est :
    <strong>${otp}</strong>
    </div>`,
  });

  res.send({
    message: "otp send successfully",
    otpToken,
  });
};

const resetPassword = async (req, res) => {
  const { otp, otpToken, purpose, newPassword } = req.body;
  if (purpose !== "reset-password") {
    res.status(422).send({
      message: "invalid purpose",
    });
    return;
  }
  const otpConcred = await otpModel.findOne({
    otpToken,
    purpose,
  });

  if (!otpConcred) {
    res.status(404).send({
      message: "otp not found",
    });
    return;
  }

  if (otp !== otpConcred.otp) {
    res.status(406).send({
      message: "otp invalid",
    });
    return;
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await userModel.findByIdAndUpdate(
    otpConcred.userId,
    { password: hashedPassword },
    { new: true }
  );

  await otpModel.deleteMany({ userId: otpConcred.userId, purpose });

  res.send({
    message: "password reset successfully",
    updatedUser,
  });
};

module.exports = {
  register,
  verifyOtp,
  login,
  resetPassword,
  reinisilize,
  authMiddleware,
};
