const express = require("express");
const { prisma } = require("../config/prisma");
const loginController = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

loginController.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user)
    return res.status(401).send({ message: "Invalid email or password" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(401).send({ message: "Invalid email or password" });

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET
  );

  // Set cookie with token
  res.cookie(" ", token, { httpOnly: true, maxAge: 3600000 }); // Expires in 10 detik
  res.send({ message: "Login successful", token: token });
});

module.exports = { loginController };
