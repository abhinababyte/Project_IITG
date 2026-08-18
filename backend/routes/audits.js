const express = require('express');
const prisma = require('../prismaClient');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/audits (Submit daily footprint)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { commuteMode, commuteDistance, acHours, laptopHours, dietType, recycling, co2Saved } = req.body;
    
    // 1. Save the audit to the database
    const audit = await prisma.audit.create({
      data: {
        userId: req.user.id,
        commuteMode,
        commuteDistance: parseFloat(commuteDistance || 0),
        acHours: parseInt(acHours || 0),
        laptopHours: parseInt(laptopHours || 0),
        dietType,
        recycling: Boolean(recycling),
        co2Saved: parseFloat(co2Saved || 0)
      }
    });

    // 2. Award eco-coins based on CO2 saved (e.g., 10 coins per kg saved)
    const coinsEarned = Math.floor((co2Saved || 0) * 10);
    let updatedUser = null;

    if (coinsEarned > 0) {
      updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { eco_coins: { increment: coinsEarned } }
      });
    } else {
      updatedUser = await prisma.user.findUnique({ where: { id: req.user.id }});
    }

    res.json({ 
      message: 'Footprint logged successfully!', 
      audit, 
      newCoinTotal: updatedUser.eco_coins, 
      coinsEarned 
    });
  } catch (error) {
    console.error("Audit submission error:", error);
    res.status(500).json({ error: 'Server error while submitting audit.' });
  }
});

module.exports = router;
