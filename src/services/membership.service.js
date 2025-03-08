const db = require("../models");
const Membership = db.membership;

class MembershipService {
  async createMembership(membershipData) {
    try {
      // Calculate default dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // Default 1 month membership

      // Set default membership data with correct field names and values
      const defaultMembershipData = {
        membershipType: 'Basic',    
        startDate: startDate,
        endDate: endDate,
        status: 'active',          // Changed from 'Active' to 'active'
        autoRenew: false,
        ...membershipData
      };

      // Validate membership type
      if (!['Basic', 'Premium', 'Gold'].includes(defaultMembershipData.membershipType)) {
        throw new Error('Invalid membership type. Must be Basic, Premium, or Gold');
      }

      // Validate status
      if (!['active', 'expired', 'cancelled'].includes(defaultMembershipData.status)) {
        throw new Error('Invalid status. Must be active, expired, or cancelled');
      }

      const membership = await Membership.create(defaultMembershipData);
      return membership;
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new Error(`Validation error: ${error.message}`);
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('User already has an active membership');
      }
      throw new Error(`Failed to create membership: ${error.message}`);
    }
  }
}

module.exports = new MembershipService();