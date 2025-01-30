const xlsx = require('xlsx');
const validationConfig = require('../config/validationConfig');

class ExcelService {
  static validateSheet(sheetData, sheetName) {
    const config = validationConfig.default;
    const errors = [];

    // Check for required columns
    const headers = Object.keys(sheetData[0] || {});
    const missingColumns = config.requiredFields.filter(
      field => !headers.includes(field)
    );

    if (missingColumns.length > 0) {
      errors.push({
        row: 0,
        message: `Missing required columns: ${missingColumns.join(', ')}`
      });
      return errors;
    }

    // Validate each row
    sheetData.forEach((row, index) => {
      Object.entries(config.fieldValidations).forEach(([field, validation]) => {
        const value = row[field];
        if (validation.required && !value) {
          errors.push({
            row: index + 2, // Add 2 to account for 0-based index and header row
            message: `${validation.errorMessage} in column ${field}`
          });
        } else if (value && !validation.validate(value)) {
          errors.push({
            row: index + 2,
            message: `${validation.errorMessage} in column ${field}`
          });
        }
      });
    });

    return errors;
  }

  static validateSheetWithPartialData(sheetData, sheetName) {
    const config = validationConfig.default;
    const errors = [];
    const validRows = [];

    // Check for required columns
    const headers = Object.keys(sheetData[0] || {});
    const missingColumns = config.requiredFields.filter(
      field => !headers.includes(field)
    );

    if (missingColumns.length > 0) {
      errors.push({
        row: 0,
        message: `Missing required columns: ${missingColumns.join(', ')}`
      });
      return { validRows: [], errors };
    }

    // Validate each row
    sheetData.forEach((row, index) => {
      let isRowValid = true;
      const rowErrors = [];

      Object.entries(config.fieldValidations).forEach(([field, validation]) => {
        const value = row[field];
        if (validation.required && !value) {
          isRowValid = false;
          rowErrors.push(`${validation.errorMessage} in column ${field}`);
        } else if (value && !validation.validate(value)) {
          isRowValid = false;
          rowErrors.push(`${validation.errorMessage} in column ${field}`);
        }
      });

      if (isRowValid) {
        validRows.push(row);
      } else {
        errors.push({
          row: index + 2, // Add 2 to account for 0-based index and header row
          message: rowErrors.join('; ')
        });
      }
    });

    return { validRows, errors };
  }

  static parseExcelFile(filePath) {
    const workbook = xlsx.readFile(filePath);
    const result = {};

    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);
      result[sheetName] = jsonData;
    });

    return result;
  }

  static validateExcelData(data) {
    const errors = {};
    let hasErrors = false;

    Object.entries(data).forEach(([sheetName, sheetData]) => {
      const sheetErrors = this.validateSheet(sheetData, sheetName);
      if (sheetErrors.length > 0) {
        errors[sheetName] = sheetErrors;
        hasErrors = true;
      }
    });

    return {
      isValid: !hasErrors,
      errors: errors
    };
  }
}

module.exports = ExcelService;
