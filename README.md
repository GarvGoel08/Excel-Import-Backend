# Excel Data Importer - Backend API

A robust Node.js/Express backend service for handling Excel file imports with validation, data management, and MongoDB integration.

## Features

### File Processing
- Excel file parsing with xlsx library
- Support for multiple sheets in a single file
- Efficient memory handling for large files
- File cleanup after processing

### Data Validation
- Comprehensive validation rules for all fields
- Custom validation for:
  - Name (required, string)
  - Amount (required, valid number)
  - Date (required, valid date format)
  - Verified (boolean)
- Partial data validation with error reporting
- Support for importing valid rows while reporting errors

### Database Operations
- MongoDB integration with Mongoose ODM
- Efficient bulk data insertion
- Atomic update operations
- Data retrieval with pagination
- Support for data deletion

### API Endpoints

#### File Operations
- `POST /api/validate` - Validate Excel file
- `POST /api/import` - Import validated data
- `GET /api/data` - Retrieve all imported data
- `POST /api/delete-row` - Delete specific data row

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **xlsx** - Excel file processing
- **cors** - Cross-origin resource sharing
- **multer** - File upload handling
- **dotenv** - Environment configuration

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/excel_importer
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at http://localhost:5000

## Project Structure

```
backend/
├── config/
│   └── validationConfig.js   # Validation rules configuration
├── controllers/
│   └── excelController.js    # Request handlers
├── models/
│   └── ExcelData.js          # MongoDB data model
├── routes/
│   └── excelRoutes.js        # API routes
├── services/
│   └── excelService.js       # Business logic
├── uploads/                  # Temporary file storage
├── .env                     # Environment variables
└── server.js               # Application entry point
```

## API Documentation

### POST /api/validate
Validates an Excel file.

**Request:**
- Content-Type: multipart/form-data
- Body: file (Excel file)

**Response:**
```json
{
  "data": {
    "Sheet1": [
      {
        "Name": "John Doe",
        "Amount": 1000,
        "Date": "2023-01-01",
        "Verified": true
      }
    ]
  },
  "errors": {
    "Sheet1": [
      {
        "row": 2,
        "message": "Invalid amount format"
      }
    ]
  }
}
```

### POST /api/import
Imports validated data into the database.

**Request:**
```json
{
  "data": {
    "Sheet1": [
      {
        "Name": "John Doe",
        "Amount": 1000,
        "Date": "2023-01-01",
        "Verified": true
      }
    ]
  }
}
```

**Response:**
```json
{
  "message": "Import completed",
  "success": [...],
  "errors": {...}
}
```

### GET /api/data
Retrieves all imported data.

**Response:**
```json
{
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "amount": 1000,
      "date": "2023-01-01T00:00:00.000Z",
      "verified": true,
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

## Error Handling

The API implements comprehensive error handling:
- Input validation errors
- File processing errors
- Database operation errors
- Network and server errors

Each error response includes:
- Appropriate HTTP status code
- Error message
- Additional error details when available

## Best Practices

- RESTful API design
- MVC architecture
- Error handling middleware
- Input sanitization
- Proper logging
- Code modularity
- Performance optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
