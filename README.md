# Ercolani Apps

A collection of web applications for Ercolani winery operations, including customer order systems and monitoring tools.

## Applications

### 1. Casse (Customer Order System)
- **Location**: `/casse/`
- **Purpose**: Touch-optimized kiosk interface for customer order collection
- **Features**:
  - Bilingual form (Italian/English)
  - Product selection with dynamic pricing
  - PDF shipment module generation
  - Auto-timeout for kiosk mode
  - Newsletter subscription integration

### 2. Vineria (Newsletter Subscription)
- **Location**: `/vineria/`
- **Purpose**: Customer newsletter subscription system
- **Features**:
  - GDPR compliant privacy policy
  - Offline-capable with local storage
  - Automatic sync when connection available

### 3. Monitor System
- **Location**: `/ercolani_monitor.js` + `/ercolani_casse.php`
- **Purpose**: Administrative monitoring of orders and shipments
- **Features**:
  - Real-time order tracking
  - Advanced search and filtering
  - PDF download and management

## Configuration

### Environment Settings
All applications use centralized environment configuration:
- **Main config**: `/config/environment.php`
- **JavaScript config**: `/config/environment-config.php`

To switch between development and production:
```php
// In /config/environment.php
$USE_PROD = false;  // Development
$USE_PROD = true;   // Production
```

### Endpoints
- **Development**: `https://www.ercolaniapps-dev.hiho.it`
- **Production**: `https://www.ercolaniapps.hiho.it`

## Technical Stack
- **Frontend**: HTML5, CSS3, JavaScript (jQuery)
- **Backend**: PHP with MySQL
- **PDF Generation**: wkhtmltopdf
- **UI Framework**: jQuery UI for date pickers and interactions

## Database Schema

The system uses a MySQL database `ercolaniCassa` with the following tables:

- **`catalog`** - Product catalog with descriptions and pricing
- **`shipments`** - Customer shipping information and orders
- **`shipdetails`** - Individual items within each shipment
- **`pdf`** - Generated PDF tracking and metadata

### Database Setup
1. Import the database schema: `mysql -u username -p < ercolaniCassa.sql`
2. Configure database connection in `/var/www/general_include/general_apridb.inc`

## Setup
1. Import database schema from `ercolaniCassa.sql`
2. Configure database connection in `/var/www/general_include/general_apridb.inc`
3. Set environment mode in `/config/environment.php`
4. Ensure PDF output directory `/pdf/` is writable
5. Configure wkhtmltopdf path for PDF generation

## Recent Updates
- Refactored hardcoded endpoints to use centralized configuration
- Added development/production environment toggle
- Improved code organization and maintainability
