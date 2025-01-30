const validationConfig = {
  default: {
    requiredFields: ['Name', 'Amount', 'Date', 'Verified'],
    fieldValidations: {
      Name: {
        required: true,
        validate: (value) => !!value,
        errorMessage: 'Name is required'
      },
      Amount: {
        required: true,
        validate: (value) => !isNaN(value) && parseFloat(value) > 0,
        errorMessage: 'Amount must be a number greater than zero'
      },
      Date: {
        required: true,
        validate: (value) => {
          const date = new Date(value);
          const now = new Date();
          return (
            date instanceof Date && !isNaN(date) &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        },
        errorMessage: 'Date must be valid and within the current month'
      },
      Verified: {
        required: true,
        validate: (value) => ['Yes', 'No'].includes(value),
        errorMessage: 'Verified must be either "Yes" or "No"'
      }
    }
  }
};

module.exports = validationConfig;
