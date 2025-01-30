const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const excelController = require('../controllers/excelController');

router.get('/data', excelController.getAllData);
router.post('/validate', upload.single('file'), excelController.validateFile);
router.post('/import', excelController.importData);
router.post('/delete-row', excelController.deleteRow);

module.exports = router;
