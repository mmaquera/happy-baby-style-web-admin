# Happy Baby Style - API Documentation

## 📖 Overview

This directory contains the static API documentation for the Happy Baby Style backend. The documentation is completely decoupled from the main application and can be served independently.

## 🚀 Quick Start

### Option 1: Open directly in browser
Simply open `index.html` in your web browser to view the documentation.

### Option 2: Serve with a local server
```bash
# Using Python 3
python -m http.server 8080

# Using Node.js (if you have http-server installed)
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

Then visit `http://localhost:8080` in your browser.

## 🎯 Features

### 📋 API Endpoints Documentation
- **Products API** - Complete CRUD operations for product management
- **Orders API** - Order creation, retrieval, and status management
- **Users API** - User management with role-based access
- **Images API** - File upload and management

### 🔐 Authentication Support
- **JWT Token** - Bearer token authentication
- **API Key** - Header-based API key authentication
- **Persistent Settings** - Authentication settings are saved in localStorage

### 🧪 Interactive Testing
- **Real-time API Testing** - Test endpoints directly from the documentation
- **Request Builder** - Build and send HTTP requests
- **Response Viewer** - View formatted JSON responses
- **Error Handling** - Clear error messages and status codes

### 🎨 Modern UI
- **Responsive Design** - Works on desktop and mobile devices
- **Dark Syntax Highlighting** - Code examples with syntax highlighting
- **Smooth Navigation** - Easy navigation between sections
- **Professional Styling** - Clean, modern interface using Tailwind CSS

## 📁 File Structure

```
backend/docs/
├── index.html          # Main documentation file
├── README.md          # This file
└── assets/            # (Optional) Additional assets
```

## 🔧 Configuration

### Base URL
The default base URL is set to `http://localhost:3000`. You can change this in the Authentication settings modal.

### Authentication
1. Click the "Authentication" button in the header
2. Enter your JWT token and/or API key
3. Set your base URL
4. Click "Save" to persist the settings

### Testing Endpoints
1. Click the "Test API" button to open the testing panel
2. Enter the endpoint path (e.g., `/api/products`)
3. Select the HTTP method
4. Add request body if needed (JSON format)
5. Click "Send Request" to test the endpoint

## 📚 API Sections

### Products API (`/api/products`)
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders API (`/api/orders`)
- `GET /api/orders` - Get all orders
- `GET /api/orders/stats` - Get order statistics
- `GET /api/orders/status/:status` - Get orders by status
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order

### Users API (`/api/users`)
- `GET /api/users` - Get all users with filtering
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user

### Images API (`/api/images`)
- `POST /api/images/upload` - Upload image
- `GET /api/images/:entityType/:entityId` - Get images by entity
- `DELETE /api/images/:id` - Delete image

## 🛠️ Customization

### Adding New Endpoints
To add new endpoints to the documentation:

1. Add a new section in the HTML file
2. Follow the existing structure with proper styling classes
3. Include example request/response data
4. Add navigation link in the sidebar

### Styling
The documentation uses Tailwind CSS for styling. You can customize the appearance by:

1. Modifying the CSS classes in the HTML
2. Adding custom CSS in the `<style>` section
3. Replacing Tailwind with your preferred CSS framework

### JavaScript Functionality
The documentation includes JavaScript for:
- Authentication management
- API testing
- Smooth scrolling navigation
- Local storage persistence

## 🔒 Security Notes

- Authentication tokens are stored in localStorage (client-side)
- No sensitive data is sent to external services
- The documentation is static and doesn't require server-side processing
- API testing is done directly from the browser

## 🌐 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📝 License

This documentation is part of the Happy Baby Style project and follows the same license terms.

## 🤝 Contributing

To contribute to the API documentation:

1. Follow the existing code style and structure
2. Test all examples and ensure they work correctly
3. Update the README if adding new features
4. Ensure responsive design works on mobile devices

---

**Happy Baby Style API Documentation** - Built with ❤️ for developers 