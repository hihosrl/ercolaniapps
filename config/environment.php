<?php
/**
 * Centralized Environment Configuration
 * This file contains the environment settings for all Ercolani applications
 */

// Environment configuration
$USE_PROD = false;
$API_BASE_URL_DEV = 'https://ercolaniapps-dev.hiho.it';  // Removed www to avoid 301 redirect
$API_BASE_URL_PROD = 'https://www.ercolaniapps.hiho.it';
$API_BASE_URL = $USE_PROD ? $API_BASE_URL_PROD : $API_BASE_URL_DEV;

// Export for JavaScript usage
$ENVIRONMENT_CONFIG = array(
    'USE_PROD' => $USE_PROD,
    'API_BASE_URL_DEV' => $API_BASE_URL_DEV,
    'API_BASE_URL_PROD' => $API_BASE_URL_PROD,
    'API_BASE_URL' => $API_BASE_URL
);
?>
