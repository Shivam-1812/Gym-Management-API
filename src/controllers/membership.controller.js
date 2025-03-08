const db = require("../models");
const Membership = db.membership;

exports.viewMembershipStatus = async (req, res) => {
  try {
    const userId = req.userId; // Assuming user ID is available in the request
    const membership = await Membership.findOne({ where: { userId } });

    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    res.status(200).json(membership);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.renewOrUpgradeMembership = async (req, res) => {
  try {
    const userId = req.userId; // Assuming user ID is available in the request
    const { type, autoRenew } = req.body;

    const membership = await Membership.findOne({ where: { userId } });

    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    // Update membership type and auto-renew status
    membership.type = type || membership.type;
    membership.autoRenew = autoRenew || membership.autoRenew;

    // Extend end date by 1 month (for renewal)
    if (req.body.renew) {
      const newEndDate = new Date(membership.endDate);
      newEndDate.setMonth(newEndDate.getMonth() + 1);
      membership.endDate = newEndDate;
    }

    await membership.save();

    res.status(200).json({ message: "Membership updated successfully", membership });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};