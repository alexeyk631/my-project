const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, password_confirm } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Все поля обязательны" });
    if (password.length < 8)
      return res.status(400).json({ error: "Пароль минимум 8 символов" });
    if (password !== password_confirm)
      return res.status(400).json({ error: "Пароли не совпадают" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email уже занят" });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash });

    req.session.userId = user._id;
    req.session.role = user.role;

    res.json({
      success: true,
      message: "Регистрация успешна",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email и пароль обязательны" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Неверный email или пароль" });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(400).json({ error: "Неверный email или пароль" });

    user.last_login = new Date();
    await user.save();

    req.session.userId = user._id;
    req.session.role = user.role;

    res.json({
      success: true,
      message: "Вход выполнен",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Ошибка выхода" });
    res.json({ success: true, message: "Выход выполнен" });
  });
});

router.get("/profile", async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: "Не авторизован" });
  try {
    const user = await User.findById(req.session.userId).select("-password_hash");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;