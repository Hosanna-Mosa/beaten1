# Contact Form Email Functionality

## Overview

The contact form on the frontend sends emails to the admin when users submit inquiries. This functionality is implemented using Nodemailer in the backend and integrates with the existing email service.

## Backend Implementation

### Email Service (`backend/utils/emailService.js`)

- **Function**: `sendContactFormEmail(contactData)`
- **Purpose**: Sends professionally formatted HTML emails to admin
- **Features**:
  - Beautiful HTML email template with BEATEN branding
  - Contact information display (name, email, subject)
  - Message content with proper formatting
  - Timestamp of submission
  - Reply-to header set to customer's email for easy response

### Email Controller (`backend/controllers/emailController.js`)

- **Endpoint**: `POST /api/email/send-email`
- **Validation**:
  - All fields required (name, email, subject, message)
  - Email format validation
- **Response**: Success/error messages with appropriate HTTP status codes

### Email Routes (`backend/routes/email.js`)

- **Route**: `/email/send-email` → `sendContactEmail` controller

## Frontend Implementation

### Contact Page (`frontend/src/pages/Contact.js`)

- **API Integration**: Uses centralized API endpoints from `utils/api.js`
- **Features**:
  - Form validation
  - Loading states with spinner
  - Success/error notifications
  - Form reset on successful submission
  - Disabled button during submission

### API Configuration (`frontend/src/utils/api.js`)

- **Endpoint**: `EMAIL_SEND: "/email/send-email"`
- **Helper Functions**:
  - `buildApiUrl()`: Constructs full API URL
  - `handleApiError()`: Standardized error handling

## Email Template Features

### Professional Design

- BEATEN branding and styling
- Responsive layout
- Clean typography and spacing
- Color scheme matching brand (matte black)

### Information Display

- **Contact Information Section**:
  - Customer name
  - Email address (clickable mailto link)
  - Subject line
- **Message Content**: Preserves formatting and line breaks
- **Timestamp**: Shows when the form was submitted
- **Reply-to**: Admin can reply directly to customer

### Email Structure

```
Subject: [Contact Form] {subject} - From {name}

Content:
- BEATEN logo and header
- Contact information box
- Message content
- Submission timestamp
- Footer with instructions
```

## Environment Configuration

### Required Environment Variables

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
REACT_APP_API_URL=http://localhost:8000/api (optional, defaults to localhost)
```

### Gmail Setup

1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password in EMAIL_PASS environment variable

## Testing

### Backend Testing

```bash
# Test successful submission
curl -X POST http://localhost:8000/api/email/send-email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","subject":"Test","message":"Test message"}'

# Test validation (invalid email)
curl -X POST http://localhost:8000/api/email/send-email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"invalid-email","subject":"Test","message":"Test message"}'

# Test validation (missing fields)
curl -X POST http://localhost:8000/api/email/send-email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","subject":"Test"}'
```

### Frontend Testing

1. Fill out the contact form
2. Submit and verify loading state
3. Check success/error messages
4. Verify form reset on success
5. Test with invalid data

## Error Handling

### Backend Errors

- **Validation Errors**: 400 Bad Request with specific messages
- **Email Service Errors**: 500 Internal Server Error
- **Network Errors**: Proper error logging and user-friendly messages

### Frontend Errors

- **API Errors**: Displayed via Snackbar notifications
- **Network Errors**: Graceful fallback with retry option
- **Validation Errors**: Real-time form validation

## Security Considerations

### Input Validation

- Email format validation
- Required field validation
- XSS prevention through proper HTML escaping

### Rate Limiting

- Consider implementing rate limiting for the email endpoint
- Prevent spam and abuse

### Email Security

- Use environment variables for sensitive data
- Implement proper email authentication
- Consider using dedicated email services for production

## Future Enhancements

### Potential Improvements

1. **Email Templates**: Add more template options
2. **Auto-Response**: Send confirmation emails to customers
3. **Spam Protection**: Implement CAPTCHA or other anti-spam measures
4. **Email Queue**: Use message queues for better reliability
5. **Analytics**: Track contact form submissions
6. **File Attachments**: Allow file uploads in contact form

### Monitoring

- Email delivery tracking
- Error rate monitoring
- Response time metrics
- User feedback collection
