/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
    console.log(window.localStorage);




    //});
}

var nazioni = new Array("Country / Nazione","Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Morocco", "Monaco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", " Sao Tome", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe");
var prodotti=[];
var timeout='';
var customerLookupTimeout;
var nameSearchTimeout;
var isNameSearching = false;
var nameAutocompleteActiveIndex = -1;
$(function(){ 
    console.log('fgsfdg');
    $.get(CASSE_ENDPOINT + '?cmd=getProd',function(data){
        prodotti=data;
        setItems();
    },'JSON')

    
for(var hi=0; hi<nazioni.length; hi++){
        $('#nazione').append("<option value=\""+nazioni[hi]+"\">"+nazioni[hi]+"</option>");
    }  

// Customer lookup button functionality - moved inside document ready
$(document).ready(function() {
    console.log('Document ready, looking for lookup button...');
    var lookupBtn = $('#lookupCustomer');
    console.log('Lookup button found:', lookupBtn.length > 0);
    
    if (lookupBtn.length > 0) {
        lookupBtn.on('click', function(e){
            e.preventDefault();
            console.log('Lookup button clicked!');
            var email = $('#email').val();
            console.log('Email value:', email);
            if (email && validateEmail(email)) {
                console.log('Valid email, executing customer lookup');
                lookupCustomerByEmail(email);
            } else {
                console.log('Invalid email or empty:', email);
                alert('Please enter a valid email address first');
            }
        });
        console.log('Click event handler attached to lookup button');
    } else {
        console.error('Lookup button not found in DOM!');
    }

    // Name autocomplete functionality
    $('#nome').on('input', function() {
        var query = $(this).val().trim();
        
        // If user already filled email, disable name search to avoid overriding manual input
        var emailVal = ($('#email').val() || '').trim();
        if (emailVal.length > 0) {
            hideNameAutocomplete();
            setNameSpinner(false);
            return;
        }
        
        // Clear previous timeout
        if (nameSearchTimeout) {
            clearTimeout(nameSearchTimeout);
        }
        
        // Hide autocomplete if less than 3 characters
        if (query.length < 3) {
            hideNameAutocomplete();
            setNameSpinner(false);
            return;
        }
        
        // Set timeout to avoid too many requests
        nameSearchTimeout = setTimeout(function() {
            setNameSpinner(true);
            searchCustomersByName(query);
        }, 300);
    });

    // Keyboard navigation for autocomplete list
    $('#nome').on('keydown', function(e) {
        var overlayOpen = $('.name-autocomplete-overlay').length > 0;
        var items = $('.name-autocomplete-item');
        // Handle Tab/Enter regardless of items presence to ensure first-time behavior works
        if (e.key === 'Tab') {
            // User wants to accept typed text and move on
            if (overlayOpen) {
                hideNameAutocomplete();
            }
            // Do not prevent default so Tab moves focus to next field
            return; // nothing else to do on Tab
        } else if (e.key === 'Enter') {
            // Accept typed text without selecting a suggestion; just hide the dropdown
            if (overlayOpen) {
                hideNameAutocomplete();
            }
            // Prevent default to avoid accidental form submission
            e.preventDefault();
            return;
        }

        // Arrow navigation requires items
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            nameAutocompleteActiveIndex = (nameAutocompleteActiveIndex + 1) % items.length;
            updateNameAutocompleteActiveItem();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            nameAutocompleteActiveIndex = (nameAutocompleteActiveIndex - 1 + items.length) % items.length;
            updateNameAutocompleteActiveItem();
        } else if (e.key === 'Escape') {
            hideNameAutocomplete();
        }
    });

    // Hide autocomplete when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#nome, .name-autocomplete-overlay').length) {
            hideNameAutocomplete();
        }
    });

    // Clear form button handler (top-right)
    $(document).on('click', '#clearFormBtn', function(e){
        e.preventDefault();
        // Clear inputs and selects
        $('input[type="text"], input[type="email"], input[type="tel"]').val('');
        $('#nazione').val('Country / Nazione');
        $('#privacy').prop('checked', false);
        // Remove validation highlights
        $('.nlinput').removeClass('alert');
        $('input').removeClass('alert');
        // Keep items and totals intact (do not clear itemsContainer)
        // Hide overlays related to autocomplete and post
        hideNameAutocomplete();
        $('.overlaypost').hide();
        // Hide spinner if visible
        setNameSpinner(false);
    });
});

//$('#nascita').on('focus',function(){
        $( "#nascita" ).datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "c-96:c",
        dateFormat: "dd/mm/yy"
});
$('h1').on('click',function(){
    //alert('ok');
    d=new Date();
    obj={'nome':'pippo'+d.getTime(),'mail':'dsfzdsf@sdfgsd.it'};
    if (window.localStorage.pending){
        current=JSON.parse(window.localStorage.pending);
    }else{
        current=[];

    }
    current.push(obj);
    window.localStorage.setItem('pending',JSON.stringify(current));
    $('h1').html('trovato ' + current.length);
});

$('.pprivl').on('click',function(){
    $('#prvctxtita').toggle();
    $('#prvctxteng').toggle();
})

$('.overlay').on('click',function (e) {
    $('.overlay').fadeOut();
    e.stopPropagation();
    // Once the user taps to start, unlock inputs so iOS can open the keyboard
    $('.nlinput input').not('#privacy').prop('readonly', false);
    $('#nascita').prop('readonly', false);
    timeout=setTimeout(function(){
       $('.overlay').fadeIn();
        $('body').find("input").removeClass('alert'); 
        $('body').find("input").val("");
        $('#nazione').val('Country / Nazione')
        $('#privacy').prop('checked', false);
    },2500000);
})
$('body').on('mousedown keydown click', function(){
    if (typeof timeout=='number')clearTimeout(timeout);
    timeout=setTimeout(function(){
       $('.overlay').fadeIn();
       $('body').find("input").removeClass('alert'); 
       $('body').find("input").val("");
       $('#nazione').val('Country / Nazione')
       $('#privacy').prop('checked', false); 
    },2500000);
})

// iOS/Safari: if an input is readonly, the keyboard will not appear.
// Ensure that tapping an input will remove readonly and focus it immediately.
$(document).on('touchend click', '.nlinput input[readonly]', function(){
    var $inp = $(this);
    // Do not toggle for checkboxes
    if ($inp.attr('id') === 'privacy') return;
    $inp.prop('readonly', false);
    // Focus inside the same user gesture to satisfy iOS requirement
    this.focus();
});
var current=false;
var data={};
$('#savecmd').on('click',function(event){
    event.stopPropagation();
    // Build payload using an allowlist of field IDs to avoid traps and undefined keys
    var allowedIds = ['email','nome','cognome','indirizzo','citta','cap','nazione','prov','tel','nascita'];
    data = {};
    allowedIds.forEach(function(fid){
        var $el = $('#'+fid);
        if ($el.length) {
            if ($el.is(':checkbox')) {
                data[fid] = $el.is(':checked') ? 'on' : '';
            } else {
                data[fid] = $el.val();
            }
        }
    });
    // Debug
    console.log('Submit data (header fields):', data);
    console.log(data);
    if (!$('.itemRow')[0] || $('.itemRow').length==0 || !data.email || !data.prov || !data.nome || !data.cognome || !data.indirizzo || !data.citta || !data.cap || !data.tel || !data.nascita || !data.nazione || data.nazione=='Country / Nazione' || !$('#privacy').is(':checked') ){
        if (!data.email){
            $('.nlinput.email').addClass('alert');
            //alert('email is mandatory/Il campo email è obbilgatorio')
        }else{
            $('.nlinput.email').removeClass('alert');
        }
        if(!data.nome){
            $('.nlinput.nome').addClass('alert');
            //alert('Name is mandatory/Il campo Nome è obbilgatorio')
        }else{
            $('.nlinput.nome').removeClass('alert');
        }
        if(!data.cognome){
            $('.nlinput.cognome').addClass('alert');
            //alert('Second Name is mandatory/Il campo Cognome è obbilgatorio')
        }else{
            $('.nlinput.cognome').removeClass('alert');
        }
        if(!data.indirizzo){
            $('.nlinput.indirizzo').addClass('alert');
            //alert('Second Name is mandatory/Il campo Cognome è obbilgatorio')
        }else{
            $('.nlinput.indirizzo').removeClass('alert');
        }
        if(!data.prov){
            $('.nlinput.prov').addClass('alert');
            //alert('Second Name is mandatory/Il campo Cognome è obbilgatorio')
        }else{
            $('.nlinput.prov').removeClass('alert');
        }
        if(!data.citta){
            $('.nlinput.citta').addClass('alert');
            //alert('Second Name is mandatory/Il campo Cognome è obbilgatorio')
        }else{
            $('.nlinput.citta').removeClass('alert');
        }
        if(!data.cap){
            $('.nlinput.cap').addClass('alert');
            //alert('Second Name is mandatory/Il campo Cognome è obbilgatorio')
        }else{
            $('.nlinput.cap').removeClass('alert');
        }
        if(!data.nascita){
            $('.nlinput.nascita').addClass('alert');
            //alert('Second Name is mandatory/Il campo Cognome è obbilgatorio')
        }else{
            $('.nlinput.nascita').removeClass('alert');
        }
        if(!data.tel){
            $('.nlinput.tel').addClass('alert');
            //alert('Second Name is mandatory/Il campo Cognome è obbilgatorio')
        }else{
            $('.nlinput.tel').removeClass('alert');
        }
        if(!data.nazione || data.nazione=='Country / Nazione'){
            $('.nlinput.nazione').addClass('alert');
            //alert('Second Name is mandatory/Il campo Cognome è obbilgatorio')
        }else{
            $('.nlinput.nazione').removeClass('alert');
        }
        if(!$('#privacy').is(':checked')){
            $('.nlinput.privacy').addClass('alert');
            //alert('Privacy has to be agreed/Devi accettare informativa privacy')
        }else{
            $('.nlinput.privacy').removeClass('alert');
        }
        if (!$('.itemRow')[0] || $('.itemRow').length==0){
            $('#chooser').addClass('blinkbd');
        }else{
            $('#chooser').removeClass('blinkbd');
        }
    }else{
        $('.nlinput').removeClass('alert');
        $('#chooser').removeClass('blinkbd');
        //pending.push(data);
        //<div class="itemRow"><div class="qtyItem">10</div> x <div itemid="2" class="nomeItem">vino2</div>=<div class="prezzoItem">20.00</div><div class="btn removeClass">X</div></div>
        var items=[];
        $('.itemRow').each(function(){
            var item={};
            item.qty=$(this).find('.qtyItem').text();
            item.id=$(this).find('.nomeItem').attr('itemid');
            item.desc=$(this).find('.nomeItem').text();
            item.price=$(this).find('.prezzoItem').text();
            console.log(item);
            items.push(item);
        })
        data.items=items;
        console.log(data);
        //localStorage['pending']=JSON.stringify(pending);
        $.get(CASSE_ENDPOINT + '?cmd=insertData',data,function(data){
            if (data.status=='ok'){
                $('#postContainer').append('<div class="printBtn" link="'+data.pdf+'">print SHIPMENT MODULE / stampa MUDULO DI INVIO</div>');
                $('#postContainer').append('<div class="discardBtn">CREATE NEW SHIPMENT / NUOVO MODULO INVIO</div>');
            }else{
                $('#postContainer').append('<div class="discardBtn alert">IMPOSSIBILE CREARE IL PDF</div>');
            }
            setItems();
        },'JSON').fail(function(xhr, status, error){
            console.error('insertData failed:', status, error);
            console.error('Response:', xhr && xhr.responseText);
            alert('Errore durante la creazione del modulo. Riprova o contatta il supporto.');
        })

        $('.overlaypost').fadeIn(200);
        $('body').find("input").removeClass('alert'); 
        $('body').find("input").val("");
        $('#privacy').prop('checked', false);
        $('#nazione').val('Country / Nazione');
        $('.itemRow').remove();
        $('.totalShip').remove();
        setTimeout(function(){
            //$('.overlaypost').fadeOut(200);
        },'10000');
        // Determine the correct subscription endpoint from environment-config with sensible fallbacks
        var subscribeEndpoint = (typeof SUBSCRIBE_CANTINE_ENDPOINT !== 'undefined')
            ? SUBSCRIBE_CANTINE_ENDPOINT
            : (typeof SUBSCRIBE_VINERIA_ENDPOINT !== 'undefined'
                ? SUBSCRIBE_VINERIA_ENDPOINT
                : '../ercolani_subscribe_cantine.php');

        $.get(subscribeEndpoint + '?cmd=insert',data,function(data){
            console.log(data);
            if (data.esito=='ok' || data.esito.substr(0,15)=='Duplicate entry'){
            console.log('newsletter aggiornata');
            }
        },'JSON')
    }
    
})
    $(document).on('click','.btn.removeClass',function(e){
        $(this).closest('.itemRow').remove();
        top.caclTotal();
    })

    $(document).on('click','.btn',function(){
            if (!$(this).hasClass('removeClass')){
            if ($(this).parent().find('select').val() != '0'){
            if ($(this).parent().find('select').val() == 'custom'){
                console.log('no');
                let i=$(this).parent().find('textarea').val();
                let q=$(this).parent().find('#qty').val();
                let p=$(this).parent().find('#prezzo').val();
                let x='-';
                p=(p*1).toFixed(2);
                operator='add';
                if (i==''){$(this).parent().find('textarea').addClass('blinkbd');return false}
                else $(this).parent().find('textarea').removeClass('blinkbd');
                if (q==''){$(this).parent().find('#qty').addClass('blinkbd');return false}
                else $(this).parent().find('#qty').removeClass('blinkbd')
                if (p=='0.00'){$(this).parent().find('#prezzo').addClass('blinkbd');return false}
                else $(this).parent().find('#prezzo').removeClass('blinkbd')
                $('.itemsContainer').append('<div class="itemRow" action="'+(x=='-'?'add':'subtract')+'"><div class="qtyItem">'+q+'</div> x <div itemid="custom" class="nomeItem">'+i+'</div>=<div class="prezzoItem">'+p+'</div><div class="btn removeClass">X</div></div/>');
                $(this).parent().find('textarea').val('');
                $(this).parent().find('textarea').hide();
                $(this).parent().find('select').val('');
                $(this).parent().find('#qty').val('');
                $(this).parent().find('#prezzo').val('');
            }else{
                let i=$(this).parent().find('select').val();
                let itxt=$(this).parent().find('select option:selected').html();
                let q=$(this).parent().find('#qty').val();
                let p=$(this).parent().find('#prezzo').val();
                let x=$(this).parent().find('select option:selected').attr('xtra');
                p=(p*1).toFixed(2);
                if (i=='0'){$(this).parent().find('select').addClass('blinkbd');return false}
                else $(this).parent().find('select').removeClass('blinkbd');
                if (q==''){$(this).parent().find('#qty').addClass('blinkbd');return false}
                else $(this).parent().find('#qty').removeClass('blinkbd')
                if (p=='0.00'){$(this).parent().find('#prezzo').addClass('blinkbd');return false}
                else $(this).parent().find('#prezzo').removeClass('blinkbd')
                $('.itemsContainer').append('<div class="itemRow" action="'+(x=='-'?'add':'subtract')+'"><div class="qtyItem">'+q+'</div> x <div itemid="'+i+'" class="nomeItem">'+itxt+'</div>=<div class="prezzoItem">'+p+'</div><div class="btn removeClass">X</div></div/>');
                $(this).parent().find('select').val('');
                $(this).parent().find('#qty').val('');
                $(this).parent().find('#prezzo').val('');
            }
        }
        console.log('click');
        }
        top.caclTotal();




})

        $(document).on('click','.printBtn',function(){
            window.open($(this).attr('link'));
            //printJS($(this).attr('link'));
        });
        $(document).on('click','.discardBtn',function(){
            if (confirm('Confitm to proceed withot printing the module? / Confermi di procedere senza stamapre il modulo?')){
                $('.overlaypost').fadeOut(500);
            }
        
        });
})    
    function setItems(){
        var current=$('.itemsContainer > div.used').length;
        if (!$('#itemSel')[0]){
        $('.itemsContainer').append('<div id="chooser" class="nlinput"><div class="selectContainer"><select id="itemSel"></select></div><input type=number id="qty" placeholder="qty" value=""><input id="prezzo" type=number placeholder="€" value=""><div class="btn" style="display:none" btext="+"></div><textarea id="custItem" style="display:none" />');
        $('select[id="itemSel"]').append('<option value="0">scegli / choose one</option>');
        $('select[id="itemSel"]').append('<option value="custom">non in elenco / not in dropdown</option>')
        for (p of prodotti){
            $('select[id="itemSel"]').append('<option xtra="'+p.valore+'" value="'+p.id+'">'+p.descrizione+'</option>');
        }
        }
        $('#chooser select').on('change',function(){
           let x= $('#chooser').find('select option:selected').attr('xtra'); 
           if (x=='sconto' && $('#chooser').find('#qty').val()=='')$('#chooser').find('#qty').val('1') 
           if ($(this).val()==0){
               $('.btn').hide();
           }else{
               if ($(this).val()=='custom'){
                   $('#custItem').show();
               }else{
                   $('#custItem').hide();
               }
               $('.btn').show();
           }
        });
    }
caclTotal=function(){
    $('.totalShip').remove();
    let tot=0;
    $('.itemRow').each(function(){
        if ($(this).attr('action')=='subtract'){
            tot -= parseFloat($(this).find('.prezzoItem').text())
        }else{
            tot += parseFloat($(this).find('.prezzoItem').text())
        }
    })
    if (tot>0){
        tot=(tot*1).toFixed(2)
        if(!$('.itemsContainer').find('.totalShip')[0]){
            $('.itemsContainer').append('<div class="totalShip">'+tot+'</div>')    
        }else{
            $('.itemsContainer').find('.totalShip').text(tot);    
        } 
    }else{
        $('.totalShip').remove();
    }
}

    // Email validation function
    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Customer lookup function
    function lookupCustomerByEmail(email) {
        // Check if CASSE_ENDPOINT is defined
        if (typeof CASSE_ENDPOINT === 'undefined') {
            console.error('CASSE_ENDPOINT is not defined. Environment config may not be loaded.');
            // Fallback to direct endpoint
            var endpoint = '../ercolani_casse.php';
        } else {
            var endpoint = CASSE_ENDPOINT;
        }
        
        console.log('Making API call to:', endpoint + '?cmd=getCustomerByEmail&email=' + encodeURIComponent(email));
        
        $.get(endpoint + '?cmd=getCustomerByEmail&email=' + encodeURIComponent(email), function(data) {
        console.log('API response:', data);
        if (data.status === 'found') {
            console.log('Customer found, populating data');
            populateCustomerData(data.customer);
        } else {
            console.log('Customer not found');
            clearFormExceptEmail();
            showCustomerNotFoundModal(email);
        }
    }, 'JSON').fail(function(xhr, status, error) {
        console.error('Customer lookup failed:', status, error);
        console.error('Response:', xhr.responseText);
        clearFormExceptEmail();
        showCustomerNotFoundModal(email);
    });
}

    // Populate form with customer data
    function populateCustomerData(customer) {
        console.log('Populating form with customer data:', customer);
        
        // Show a subtle indication that data was found
        $('#email').addClass('customer-found');
        
        // Populate fields with existing data
        $('#nome').val(customer.nome);
        $('#cognome').val(customer.cognome);
        $('#indirizzo').val(customer.indirizzo);
        $('#citta').val(customer.citta);
        $('#cap').val(customer.cap);
        $('#tel').val(customer.telefono);
        $('#prov').val(customer.prov);
        $('#nascita').val(customer.nascita);
        
        // Set country dropdown
        if (customer.nazione) {
            $('#nazione').val(customer.nazione);
        }
        
        console.log('Form populated successfully');
        
        // Add visual feedback
        setTimeout(function() {
            $('#email').removeClass('customer-found');
        }, 2000);
    }

// Clear form fields except email when customer not found
function clearFormExceptEmail() {
    console.log('Clearing form fields except email');
    $('#nome').val('');
    $('#cognome').val('');
    $('#indirizzo').val('');
    $('#citta').val('');
    $('#cap').val('');
    $('#tel').val('');
    $('#prov').val('');
    $('#nascita').val('');
    $('#nazione').val('Country / Nazione');
}

// Show custom modal for customer not found
function showCustomerNotFoundModal(email) {
    $('#modalEmail').text(email);
    $('#customerNotFoundModal').fadeIn(300);
}

// Close customer not found modal
function closeCustomerNotFoundModal() {
    $('#customerNotFoundModal').fadeOut(300);
}

// Search customers by name function
function searchCustomersByName(query) {
    // Check if CASSE_ENDPOINT is defined
    if (typeof CASSE_ENDPOINT === 'undefined') {
        console.error('CASSE_ENDPOINT is not defined. Environment config may not be loaded.');
        var endpoint = '../ercolani_casse.php';
    } else {
        var endpoint = CASSE_ENDPOINT;
    }
    
    console.log('Searching customers by name:', query);
    
    $.get(endpoint + '?cmd=searchCustomersByName&query=' + encodeURIComponent(query), function(data) {
        console.log('Name search response:', data);
        if (data.status === 'found' && data.customers.length > 0) {
            showNameAutocomplete(data.customers);
        } else {
            hideNameAutocomplete();
        }
    }, 'JSON').fail(function(xhr, status, error) {
        console.error('Name search failed:', status, error);
        hideNameAutocomplete();
    }).always(function(){
        setNameSpinner(false);
    });
}

// Show name autocomplete overlay
function showNameAutocomplete(customers) {
    // Remove existing overlay
    $('.name-autocomplete-overlay').remove();
    
    // Get position of nome input
    var $nomeInput = $('#nome');
    var position = $nomeInput.offset();
    var width = $nomeInput.outerWidth();
    
    // Create overlay HTML
    var overlayHtml = '<div class="name-autocomplete-overlay">';
    
    customers.forEach(function(customer) {
        overlayHtml += '<div class="name-autocomplete-item" data-nome="' + customer.nome + '" data-cognome="' + customer.cognome + '" data-email="' + customer.email + '" data-nazione="' + customer.nazione + '">';
        overlayHtml += '<span class="customer-name">' + customer.nome + ' ' + customer.cognome + '</span>';
        overlayHtml += ' - <span class="customer-email">' + customer.email + '</span>';
        overlayHtml += ' - <span class="customer-country">' + customer.nazione + '</span>';
        overlayHtml += '</div>';
    });
    
    overlayHtml += '</div>';
    
    // Add to body
    $('body').append(overlayHtml);
    
    // Position the overlay
    $('.name-autocomplete-overlay').css({
        position: 'absolute',
        top: position.top + $nomeInput.outerHeight(),
        left: position.left,
        width: width,
        zIndex: 9999
    });
    
    // Reset active index and highlight first item by default
    nameAutocompleteActiveIndex = customers.length ? 0 : -1;
    updateNameAutocompleteActiveItem();

    // Add click handlers for autocomplete items
    $('.name-autocomplete-item').on('click', function() {
        var nome = $(this).data('nome');
        var cognome = $(this).data('cognome');
        var email = $(this).data('email');
        var nazione = $(this).data('nazione');
        
        // Fill the form with selected customer data
        $('#nome').val(nome);
        $('#cognome').val(cognome);
        $('#email').val(email);
        if (nazione) {
            $('#nazione').val(nazione);
        }
        
        // Try to lookup full customer data by email
        if (email && validateEmail(email)) {
            lookupCustomerByEmail(email);
        }
        
        // Hide autocomplete
        hideNameAutocomplete();
    });

    // Add keyboard navigation
    $(document).on('keydown', function(e) {
        if ($('.name-autocomplete-overlay').length) {
            if (e.which === 38) { // up
                nameAutocompleteActiveIndex--;
                if (nameAutocompleteActiveIndex < 0) nameAutocompleteActiveIndex = 0;
                updateNameAutocompleteActiveItem();
            } else if (e.which === 40) { // down
                nameAutocompleteActiveIndex++;
                if (nameAutocompleteActiveIndex >= $('.name-autocomplete-item').length) nameAutocompleteActiveIndex = $('.name-autocomplete-item').length - 1;
                updateNameAutocompleteActiveItem();
            } else if (e.which === 9) { // tab
                // Hide overlay and allow focus to move forward
                hideNameAutocomplete();
                // Do not prevent default
            } else if (e.which === 13) { // enter
                // Hide overlay and prevent default submit
                hideNameAutocomplete();
                e.preventDefault();
                return;
            }
        }
    });
}

// Hide name autocomplete overlay
function hideNameAutocomplete() {
    $('.name-autocomplete-overlay').remove();
    nameAutocompleteActiveIndex = -1;
    setNameSpinner(false);
}

// Helper: Update visual active item
function updateNameAutocompleteActiveItem() {
    var items = $('.name-autocomplete-item');
    items.removeClass('active');
    if (nameAutocompleteActiveIndex >= 0 && nameAutocompleteActiveIndex < items.length) {
        var $active = $(items[nameAutocompleteActiveIndex]);
        $active.addClass('active');
        // ensure into view
        var container = $('.name-autocomplete-overlay');
        var top = $active.position().top;
        var cScroll = container.scrollTop();
        var cHeight = container.height();
        if (top < 0) container.scrollTop(cScroll + top);
        else if (top + $active.outerHeight() > cHeight) container.scrollTop(cScroll + (top + $active.outerHeight() - cHeight));
    }
}

// Helper: Show/hide spinner next to name field
function setNameSpinner(show) {
    var $sp = $('#nameLoadingSpinner');
    if (!$sp.length) return;
    if (show) $sp.show(); else $sp.hide();
}