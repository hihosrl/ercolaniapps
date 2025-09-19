/**
 * Centralized Environment Configuration for JavaScript
 * This file contains the environment settings for all Ercolani applications
 */

// Environment configuration
var USE_PROD = false;
var API_BASE_URL_DEV = 'https://www.ercolaniapps-dev.hiho.it';
var API_BASE_URL_PROD = 'https://www.ercolaniapps.hiho.it';
var API_BASE_URL = USE_PROD ? API_BASE_URL_PROD : API_BASE_URL_DEV;

// Endpoint configurations
var CASSE_ENDPOINT = API_BASE_URL + '/ercolani_casse.php';
var SUBSCRIBE_CANTINE_ENDPOINT = '/ercolani_subscribe_cantine.php';
var SUBSCRIBE_VINERIA_ENDPOINT = API_BASE_URL + '/ercolani_subscribe_vineria.php';
