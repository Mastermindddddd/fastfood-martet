// Payment Service for South African Payment Gateways
// This service handles integration with popular SA payment providers

class PaymentService {
  constructor() {
    this.paymentProviders = {
      payfast: {
        name: 'PayFast',
        merchantId: process.env.REACT_APP_PAYFAST_MERCHANT_ID || 'demo_merchant',
        merchantKey: process.env.REACT_APP_PAYFAST_MERCHANT_KEY || 'demo_key',
        sandbox: process.env.NODE_ENV !== 'production',
        url: process.env.NODE_ENV === 'production' 
          ? 'https://www.payfast.co.za/eng/process' 
          : 'https://sandbox.payfast.co.za/eng/process'
      },
      ozow: {
        name: 'Ozow',
        siteCode: process.env.REACT_APP_OZOW_SITE_CODE || 'demo_site',
        privateKey: process.env.REACT_APP_OZOW_PRIVATE_KEY || 'demo_private_key',
        apiKey: process.env.REACT_APP_OZOW_API_KEY || 'demo_api_key',
        sandbox: process.env.NODE_ENV !== 'production',
        url: process.env.NODE_ENV === 'production'
          ? 'https://api.ozow.com'
          : 'https://staging.ozow.com'
      },
      peachPayments: {
        name: 'Peach Payments',
        entityId: process.env.REACT_APP_PEACH_ENTITY_ID || 'demo_entity',
        accessToken: process.env.REACT_APP_PEACH_ACCESS_TOKEN || 'demo_token',
        sandbox: process.env.NODE_ENV !== 'production',
        url: process.env.NODE_ENV === 'production'
          ? 'https://oppwa.com'
          : 'https://test.oppwa.com'
      }
    }
  }

  // Generate secure payment reference
  generatePaymentReference(orderId) {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    return `FH_${orderId}_${timestamp}_${random}`.toUpperCase()
  }

  // Validate payment amount
  validateAmount(amount) {
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error('Invalid payment amount')
    }
    if (amount < 1) {
      throw new Error('Minimum payment amount is R1.00')
    }
    if (amount > 50000) {
      throw new Error('Maximum payment amount is R50,000.00')
    }
    return true
  }

  // Create PayFast payment
  async createPayFastPayment(orderData) {
    try {
      this.validateAmount(orderData.amount)
      
      const paymentData = {
        merchant_id: this.paymentProviders.payfast.merchantId,
        merchant_key: this.paymentProviders.payfast.merchantKey,
        return_url: `${window.location.origin}/order/${orderData.orderId}?status=success`,
        cancel_url: `${window.location.origin}/cart?status=cancelled`,
        notify_url: `${window.location.origin}/api/payments/payfast/notify`,
        name_first: orderData.customer.firstName,
        name_last: orderData.customer.lastName,
        email_address: orderData.customer.email,
        m_payment_id: this.generatePaymentReference(orderData.orderId),
        amount: orderData.amount.toFixed(2),
        item_name: `FoodHub SA Order #${orderData.orderId}`,
        item_description: `Food order from ${orderData.restaurant.name}`,
        custom_str1: orderData.orderId,
        custom_str2: orderData.restaurant.id
      }

      // In production, generate signature hash
      if (!this.paymentProviders.payfast.sandbox) {
        paymentData.signature = this.generatePayFastSignature(paymentData)
      }

      return {
        provider: 'payfast',
        url: this.paymentProviders.payfast.url,
        data: paymentData,
        method: 'POST'
      }
    } catch (error) {
      throw new Error(`PayFast payment creation failed: ${error.message}`)
    }
  }

  // Create Ozow payment
  async createOzowPayment(orderData) {
    try {
      this.validateAmount(orderData.amount)
      
      const paymentData = {
        SiteCode: this.paymentProviders.ozow.siteCode,
        CountryCode: 'ZA',
        CurrencyCode: 'ZAR',
        Amount: orderData.amount,
        TransactionReference: this.generatePaymentReference(orderData.orderId),
        BankReference: `FoodHub-${orderData.orderId}`,
        Customer: orderData.customer.email,
        SuccessUrl: `${window.location.origin}/order/${orderData.orderId}?status=success`,
        CancelUrl: `${window.location.origin}/cart?status=cancelled`,
        ErrorUrl: `${window.location.origin}/cart?status=error`,
        NotifyUrl: `${window.location.origin}/api/payments/ozow/notify`,
        IsTest: this.paymentProviders.ozow.sandbox
      }

      // Generate request hash for security
      paymentData.HashCheck = this.generateOzowHash(paymentData)

      return {
        provider: 'ozow',
        url: `${this.paymentProviders.ozow.url}/PostPaymentRequest`,
        data: paymentData,
        method: 'POST'
      }
    } catch (error) {
      throw new Error(`Ozow payment creation failed: ${error.message}`)
    }
  }

  // Create Peach Payments checkout
  async createPeachPayment(orderData) {
    try {
      this.validateAmount(orderData.amount)
      
      const paymentData = {
        entityId: this.paymentProviders.peachPayments.entityId,
        amount: orderData.amount.toFixed(2),
        currency: 'ZAR',
        paymentType: 'DB',
        merchantTransactionId: this.generatePaymentReference(orderData.orderId),
        customer: {
          email: orderData.customer.email,
          givenName: orderData.customer.firstName,
          surname: orderData.customer.lastName
        },
        billing: {
          street1: orderData.deliveryAddress,
          city: 'Cape Town',
          state: 'Western Cape',
          country: 'ZA',
          postcode: '8001'
        },
        customParameters: {
          orderId: orderData.orderId,
          restaurantId: orderData.restaurant.id
        }
      }

      // This would typically be a server-side API call
      const response = await fetch(`${this.paymentProviders.peachPayments.url}/v1/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paymentProviders.peachPayments.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      if (!response.ok) {
        throw new Error('Failed to create Peach Payments checkout')
      }

      const result = await response.json()
      
      return {
        provider: 'peach',
        checkoutId: result.id,
        url: `${this.paymentProviders.peachPayments.url}/v1/paymentWidgets.js?checkoutId=${result.id}`,
        method: 'WIDGET'
      }
    } catch (error) {
      throw new Error(`Peach Payments creation failed: ${error.message}`)
    }
  }

  // Process cash on delivery
  async processCashOnDelivery(orderData) {
    try {
      this.validateAmount(orderData.amount)
      
      // Simulate cash payment processing
      return {
        provider: 'cash',
        paymentReference: this.generatePaymentReference(orderData.orderId),
        status: 'pending',
        message: 'Cash on delivery order created successfully'
      }
    } catch (error) {
      throw new Error(`Cash payment processing failed: ${error.message}`)
    }
  }

  // Main payment processing method
  async processPayment(paymentMethod, orderData) {
    try {
      switch (paymentMethod) {
        case 'payfast':
          return await this.createPayFastPayment(orderData)
        case 'ozow':
          return await this.createOzowPayment(orderData)
        case 'peach':
          return await this.createPeachPayment(orderData)
        case 'cash':
          return await this.processCashOnDelivery(orderData)
        default:
          throw new Error('Unsupported payment method')
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      throw error
    }
  }

  // Generate PayFast signature (simplified version)
  generatePayFastSignature(data) {
    // In production, implement proper MD5 signature generation
    // This is a simplified version for demo purposes
    const crypto = require('crypto')
    const queryString = Object.keys(data)
      .sort()
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&')
    
    return crypto.createHash('md5').update(queryString).digest('hex')
  }

  // Generate Ozow hash (simplified version)
  generateOzowHash(data) {
    // In production, implement proper SHA512 hash generation
    // This is a simplified version for demo purposes
    const crypto = require('crypto')
    const hashString = `${data.SiteCode}${data.CountryCode}${data.CurrencyCode}${data.Amount}${data.TransactionReference}${data.BankReference}`
    
    return crypto.createHash('sha512').update(hashString + this.paymentProviders.ozow.privateKey).digest('hex')
  }

  // Verify payment status
  async verifyPaymentStatus(paymentReference, provider) {
    try {
      // This would typically query the payment provider's API
      // For demo purposes, we'll simulate different statuses
      const statuses = ['completed', 'pending', 'failed', 'cancelled']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      
      return {
        reference: paymentReference,
        status: randomStatus,
        provider: provider,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      throw new Error(`Payment verification failed: ${error.message}`)
    }
  }

  // Get supported payment methods for South Africa
  getSupportedPaymentMethods() {
    return [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Visa, Mastercard, American Express',
        icon: 'credit-card',
        providers: ['payfast', 'peach'],
        processingFee: 0.035, // 3.5%
        available: true
      },
      {
        id: 'eft',
        name: 'EFT/Bank Transfer',
        description: 'Instant EFT via major SA banks',
        icon: 'building-2',
        providers: ['ozow', 'payfast'],
        processingFee: 0.015, // 1.5%
        available: true
      },
      {
        id: 'cash',
        name: 'Cash on Delivery',
        description: 'Pay with cash when your order arrives',
        icon: 'banknote',
        providers: ['internal'],
        processingFee: 0,
        available: true
      },
      {
        id: 'wallet',
        name: 'Digital Wallet',
        description: 'SnapScan, Zapper, Samsung Pay',
        icon: 'smartphone',
        providers: ['peach'],
        processingFee: 0.025, // 2.5%
        available: false // Coming soon
      }
    ]
  }
}

export default new PaymentService()
