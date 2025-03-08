/**
 * Validates an email address
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validates a phone number (simple validation for international format)
   * 
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phoneNumber);
  };
  
  /**
   * Validates password strength
   * Requires minimum 8 characters, at least one uppercase letter, 
   * one lowercase letter, one number and one special character
   * 
   * @param {string} password - Password to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  const isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  
  /**
   * Validates if a string is empty or only contains whitespace
   * 
   * @param {string} str - String to validate
   * @returns {boolean} - True if not empty, false if empty
   */
  const isNotEmpty = (str) => {
    return str !== null && str !== undefined && str.trim() !== '';
  };
  
  /**
   * Validates if a value is within a specified range
   * 
   * @param {number} value - Value to check
   * @param {number} min - Minimum allowed value
   * @param {number} max - Maximum allowed value
   * @returns {boolean} - True if within range, false otherwise
   */
  const isInRange = (value, min, max) => {
    return value >= min && value <= max;
  };
  
  module.exports = {
    isValidEmail,
    isValidPhoneNumber,
    isStrongPassword,
    isNotEmpty,
    isInRange
  };