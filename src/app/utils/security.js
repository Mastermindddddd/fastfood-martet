const SecurityUtils = {
  /**
   * Sanitize user input to prevent XSS or injection attacks
   * Removes dangerous characters/scripts
   */
  sanitizeInput(input) {
    if (typeof input !== "string") return input;
    return input
      .replace(/<script.*?>.*?<\/script>/gi, "") // remove scripts
      .replace(/</g, "&lt;") // escape <
      .replace(/>/g, "&gt;") // escape >
      .trim();
  },

  /**
   * Validate delivery address (basic example)
   * Checks for length and presence of numbers/letters
   */
  validateAddress(address) {
    if (!address || address.trim().length < 5) {
      return { valid: false, message: "Address is too short" };
    }

    // Require both letters and numbers (e.g., "123 Main Street")
    const hasLetters = /[a-zA-Z]/.test(address);
    const hasNumbers = /[0-9]/.test(address);

    if (!hasLetters || !hasNumbers) {
      return { valid: false, message: "Address must contain letters and numbers" };
    }

    return { valid: true, message: "Address looks valid" };
  },

  /**
   * Validate order data (basic example)
   */
  validateOrderData(orderData) {
    const errors = {};

    if (!orderData.orderId) {
      errors.orderId = "Order ID is missing";
    }
    if (!orderData.customer?.email) {
      errors.email = "Customer email is required";
    }
    if (!orderData.items || orderData.items.length === 0) {
      errors.items = "Cart cannot be empty";
    }
    if (!orderData.deliveryAddress) {
      errors.deliveryAddress = "Delivery address is required";
    }
    if (!orderData.amount || orderData.amount <= 0) {
      errors.amount = "Invalid order amount";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

export default SecurityUtils;
