const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/pledges
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { category, action } = req.body;
    const userId = req.user.id;

    const newPledge = await prisma.pledge.create({
      data: {
        userId,
        category,
        action
      }
    });
    
    // Reward for taking a pledge (50 Eco-Coins)
    const user = await prisma.user.update({
      where: { id: userId },
      data: { eco_coins: { increment: 50 } }
    });

    res.status(201).json({ message: "Pledge saved", pledge: newPledge, newCoinTotal: user.eco_coins, coinsEarned: 50 });
  } catch (error) {
    console.error("Pledge Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
