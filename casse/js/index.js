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
$(function(){ 
    console.log('fgsfdg');
    $.get(CASSE_ENDPOINT + '?cmd=getProd',function(data){
        prodotti=data;
        setItems();
    },'JSON')

    
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
    },2500000);
})
$('body').on('mounsedown keydown click', function(){
    if (typeof timeout=='number')clearTimeout(timeout);
    timeout=setTimeout(function(){
       $('.overlay').fadeIn();
       $('body').find("input").removeClass('alert'); 
       $('body').find("input").val("");
       $('#nazione').val('Country / Nazione')
       $('#privacy').prop('checked', false); 
    },2500000);
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
        },'JSON')

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
        $.get(SUBSCRIBE_ENDPOINT + '?cmd=insert',data,function(data){
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