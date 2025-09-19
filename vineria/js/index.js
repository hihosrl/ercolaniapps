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

var nazioni = new Array("Country / Nazione","Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Morocco", "Monaco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", " Sao Tome", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe");
var timeout='';

    
for(var hi=0; hi<nazioni.length; hi++){
        $('#nazione').append("<option value=\""+nazioni[hi]+"\">"+nazioni[hi]+"</option>");
    }  

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
    event.stopPropagation(e)
    timeout=setTimeout(function(){
       $('.overlay').fadeIn();
        $('body').find("input").removeClass('alert'); 
        $('body').find("input").val("");
        $('#nazione').val('Country / Nazione')
        $('#privacy').prop('checked', false);
    },25000);
})
$('body').on('mounsedown keydown click', function(){
    if (typeof timeout=='number')clearTimeout(timeout);
    timeout=setTimeout(function(){
       $('.overlay').fadeIn();
       $('body').find("input").removeClass('alert'); 
       $('body').find("input").val("");
       $('#nazione').val('Country / Nazione')
       $('#privacy').prop('checked', false); 
    },25000);
})
var current=false;
var data={};
$('#savecmd').on('click',function(event){
    event.stopPropagation();
    //$('#mailSubscribe').submit();
    $('input, select').each(function(){
        console.log($(this).attr('id'));
        console.log($(this).val());
        data[$(this).attr('id')]=$(this).val();
    });
    console.log(data);
    if (!data.email || !data.nome || !data.cognome || !data.nazione || data.nazione=='Country / Nazione' || !$('#privacy').is(':checked') ){
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
    }else{
        $('.nlinput').removeClass('alert');
        if (!localStorage['pending']){
        var pending=[];
        }else{
        var pending=JSON.parse(localStorage['pending']);
        }
        pending.push(data);
        localStorage['pending']=JSON.stringify(pending);
        $('.overlaypost').fadeIn(200);
        $('body').find("input").removeClass('alert'); 
        $('body').find("input").val("");
        $('#privacy').prop('checked', false);
        $('#nazione').val('Country / Nazione')
        setTimeout(function(){
            $('.overlaypost').fadeOut(200);
        },'5000');
        setPendingBagde();
    }
    
})
setInterval(function(){
    checkConnectionSave();
},3000)

function checkConnectionSave(){
    if (localStorage['pending']){
    var pending=JSON.parse(localStorage['pending']);
    if (pending.length>0){
        $.get(SUBSCRIBE_VINERIA_ENDPOINT + '?cmd=insert',pending[0],function(data){
            console.log(data);
            if (data.esito=='ok' || data.esito.substr(0,15)=='Duplicate entry'){
                pending.shift();
                localStorage['pending']=JSON.stringify(pending);
                setPendingBagde();
            }
        },'JSON')
        
    }}
}
function setPendingBagde(){
    if (localStorage['pending'])
    var pending=JSON.parse(localStorage['pending']);
    else 
    var pending=0;
    $('.pendingbadge').html(pending.length);
}