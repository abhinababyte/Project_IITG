const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET /api/feed
router.get('/', async (req, res) => {
  try {
    // Get last 10 audits with positive CO2 saved
    const audits = await prisma.audit.findMany({
      where: { co2Saved: { gt: 0 } },
      take: 10,
      orderBy: { date: 'desc' },
      include: { user: { select: { name: true, hostel: true } } }
    });

    // Get last 10 pledges
    const pledges = await prisma.pledge.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, hostel: true } } }
    });

    const feed = [];
    
    audits.forEach(a => {
      feed.push({
        id: `a-${a.id}`,
        timestamp: a.date,
        type: 'audit',
        message: `🌿 ${a.user.name} from ${a.user.hostel} just saved ${a.co2Saved}kg of CO₂!`
      });
    });

    pledges.forEach(p => {
      feed.push({
        id: `p-${p.id}`,
        timestamp: p.createdAt,
        type: 'pledge',
        message: `🔥 ${p.user.name} from ${p.user.hostel} pledged: ${p.action}!`
      });
    });

    // Sort combined feed by timestamp descending
    feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json(feed.slice(0, 10)); // return latest 10 items
  } catch (error) {
    console.error("Feed Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
