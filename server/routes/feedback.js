const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();

router.post("/", async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: "Только для авторизованных" });

  try {
    const { subject, message, rating } = req.body;
    if (!subject || !message)
      return res.status(400).json({ error: "Тема и сообщение обязательны" });
    if (message.length < 10)
      return res.status(400).json({ error: "Сообщение минимум 10 символов" });
    if (rating && (rating < 1 || rating > 5))
      return res.status(400).json({ error: "Оценка от 1 до 5" });

    const feedback = await Feedback.create({
      user_id: req.session.userId,
      subject,
      message,
      rating,
    });

    res.json({ success: true, message: "Отзыв отправлен", feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user_id", "name email")
      .sort({ created_at: -1 });
    res.json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;