<?php
/**
 * Environment Configuration Generator for JavaScript
 * This file generates JavaScript configuration from PHP environment settings
 */

// Include the main environment configuration
require_once __DIR__ . '/environment.php';

// Set content type for JavaScript
header('Content-Type: application/javascript');

// Generate JavaScript configuration
echo "/**\n";
echo " * Auto-generated Environment Configuration for JavaScript\n";
echo " * Generated from PHP environment settings\n";
echo " * Last updated: " . date('Y-m-d H:i:s') . "\n";
echo " */\n\n";

echo "// Environment configuration\n";
echo "var USE_PROD = " . ($USE_PROD ? 'true' : 'false') . ";\n";
echo "var API_BASE_URL_DEV = '" . $API_BASE_URL_DEV . "';\n";
echo "var API_BASE_URL_PROD = '" . $API_BASE_URL_PROD . "';\n";
echo "var API_BASE_URL = USE_PROD ? API_BASE_URL_PROD : API_BASE_URL_DEV;\n\n";

echo "// Endpoint configurations\n";
echo "var CASSE_ENDPOINT = API_BASE_URL + '/ercolani_casse.php';\n";
echo "var SUBSCRIBE_CANTINE_ENDPOINT = '/ercolani_subscribe_cantine.php';\n";
echo "var SUBSCRIBE_VINERIA_ENDPOINT = API_BASE_URL + '/ercolani_subscribe_vineria.php';\n";
?>
