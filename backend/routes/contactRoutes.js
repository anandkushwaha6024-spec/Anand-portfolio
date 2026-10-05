const express = require('express');
const router = express.Router();
const { submitContact, getContacts } = require('../controllers/contactController');

// POST /api/contact - Submit contact message
// GET /api/contact - Retrieve all contact messages
router.route('/')
  .post(submitContact)
  .get(getContacts);

module.exports = router;
