const ExcelService = require('../services/excelService');
const ExcelData = require('../models/ExcelData');
const fs = require('fs').promises;

exports.validateFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const excelData = ExcelService.parseExcelFile(req.file.path);
    const validationResults = {};
    const validData = {};

    // Validate each sheet and separate valid and invalid rows
    Object.entries(excelData).forEach(([sheetName, rows]) => {
      const { validRows, errors } = ExcelService.validateSheetWithPartialData(rows, sheetName);
      if (errors.length > 0) {
        validationResults[sheetName] = errors;
      }
      validData[sheetName] = validRows;
    });

    // Delete the uploaded file after processing
    await fs.unlink(req.file.path);

    res.json({
      data: validData,
      errors: Object.keys(validationResults).length > 0 ? validationResults : null
    });
  } catch (error) {
    console.error('Error validating file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
};

exports.importData = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    const importResults = {
      success: [],
      errors: {}
    };

    // Process each sheet
    for (const [sheetName, rows] of Object.entries(data)) {
      if (!Array.isArray(rows)) continue;

      const documents = rows.map(row => ({
        sheetName,
        name: row.Name,
        amount: parseFloat(row.Amount),
        date: new Date(row.Date),
        verified: row.Verified
      }));

      try {
        const imported = await ExcelData.insertMany(documents, { ordered: false });
        importResults.success.push(...imported);
      } catch (error) {
        if (error.writeErrors) {
          importResults.errors[sheetName] = error.writeErrors.map(err => ({
            row: err.index + 1,
            message: err.errmsg
          }));
        } else {
          throw error;
        }
      }
    }

    res.json({
      message: 'Import completed',
      success: importResults.success,
      errors: Object.keys(importResults.errors).length > 0 ? importResults.errors : null
    });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ error: 'Error importing data' });
  }
};

exports.deleteRow = async (req, res) => {
  try {
    const { sheetName, rowIndex } = req.body;

    if (typeof rowIndex !== 'number') {
      return res.status(400).json({ error: 'Invalid row index' });
    }

    // Since we don't have a direct way to identify the row,
    // we'll need to find all records for the sheet and delete the specific one
    const records = await ExcelData.find({ sheetName })
      .sort({ createdAt: 1 })
      .skip(rowIndex)
      .limit(1);

    if (records.length === 0) {
      return res.status(404).json({ error: 'Row not found' });
    }

    await ExcelData.deleteOne({ _id: records[0]._id });

    res.json({ message: 'Row deleted successfully' });
  } catch (error) {
    console.error('Error deleting row:', error);
    res.status(500).json({ error: 'Error deleting row' });
  }
};

exports.getAllData = async (req, res) => {
  try {
    const data = await ExcelData.find({})
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
};
