const Contact = require('../models/Contact');

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate Input Fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, subject, and message.',
      });
    }

    // Save to Database
    const newContact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
      data: newContact,
    });
  } catch (error) {
    console.error('Contact Submission Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while sending message. Please try again later.',
      error: error.message,
    });
  }
};

// @desc    Get all contact messages (Admin/Dashboard view)
// @route   GET /api/contact
// @access  Public / Private
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching contact messages.',
      error: error.message,
    });
  }
};

module.exports = {
  submitContact,
  getContacts,
};
