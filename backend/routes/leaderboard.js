const express = require('express');
const prisma = require('../prismaClient');

const router = express.Router();

// GET /api/leaderboard (Get hostel rankings)
router.get('/', async (req, res) => {
  try {
    // Fetch all users and their audits
    const allUsers = await prisma.user.findMany({
      include: {
        audits: true
      }
    });

    const hostelStats = {};

    // Aggregate CO2 saved and student counts by hostel
    allUsers.forEach(user => {
      if (!hostelStats[user.hostel]) {
        hostelStats[user.hostel] = { totalCO2Saved: 0, studentCount: 0 };
      }
      hostelStats[user.hostel].studentCount += 1;
      
      user.audits.forEach(audit => {
        hostelStats[user.hostel].totalCO2Saved += audit.co2Saved;
      });
    });

    // Convert object to array and sort by total CO2 saved
    const leaderboard = Object.keys(hostelStats).map(hostel => ({
      hostel,
      totalCO2Saved: parseFloat(hostelStats[hostel].totalCO2Saved.toFixed(2)),
      studentCount: hostelStats[hostel].studentCount
    })).sort((a, b) => b.totalCO2Saved - a.totalCO2Saved);

    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: 'Server error while fetching leaderboard.' });
  }
});

module.exports = router;
