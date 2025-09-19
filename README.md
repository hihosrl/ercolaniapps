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

## Setup
1. Configure database connection in `/var/www/general_include/general_apridb.inc`
2. Set environment mode in `/config/environment.php`
3. Ensure PDF output directory `/pdf/` is writable
4. Configure wkhtmltopdf path for PDF generation

## Recent Updates
- Refactored hardcoded endpoints to use centralized configuration
- Added development/production environment toggle
- Improved code organization and maintainability
