// Configuration loaded from centralized environment file

var filters={};
$(function(){
   $( "#sdatada" ).datepicker({dateFormat: "mm-dd-yy"});
   $( "#sdataa" ).datepicker({dateFormat: "mm-dd-yy"});
   

//$('.btn.download').on('click',function(){console.log('ok')})
$(document).on('click','.btn.download',function(){
   window.open($(this).attr('link'));
   $.get(CASSE_ENDPOINT + '?cmd=markViewed&pdf='+$(this).text().replace(/^ER-[0]+/,''),function(data){
        if (data.status=='ok'){
           $('tr#'+data.id).removeClass('new');
        }
    },'JSON') 
});
   $('.ricerca_content input').on('keyup change',function () {
   console.log('filtro cambiato');
   filters[$(this).attr('id')]=$(this).val(); 
   console.log(filters);
   $('table tr').each(function(){
      if ($(this).find('th,td')[0].tagName=='TD'){
         var vis=true;
         if (filters.sdatada){
            d=new Date(filters.sdatada);
            d2=new Date ($(this).find(':nth-child(1)').text().substring(0,19));
            if (d2<d)vis=false
         }
         if (filters.sdataa){
            d=new Date(filters.sdataa);
            d2=new Date ($(this).find(':nth-child(1)').text().substring(0,19));
            d.setDate(d.getDate() + 1);
            if (d2>d)vis=false
         }
         if (filters.semail){
            var re=new RegExp(filters.semail,'i')
            if ($(this).find(':nth-child(4)').text().replace(re,'')==$(this).find(':nth-child(4)').text())vis=false
         }
         if (filters.snome){
            var re=new RegExp(filters.snome,'i')
            if ($(this).find(':nth-child(2)').text().replace(re,'')==$(this).find(':nth-child(2)').text())vis=false
         }
         if (filters.snazione){
            var re=new RegExp(filters.snazione,'i')
            if ($(this).find(':nth-child(5)').text().replace(re,'')==$(this).find(':nth-child(5)').text())vis=false
         }
         if (!vis){
            $(this).hide();
         }else{
            $(this).show();
         }
      }
   })   
});

})
setInterval(function(){
   $.get(CASSE_ENDPOINT + '?cmd=getNewest&last='+lastId,function(data){
      if(data.length>0){
         console.log('nuovo');
         let intestazioni=$('table tr:first-child')[0].outerHTML;
         $('table tr:first-child').remove();
         for (i in data){
            $('table tbody').prepend(data[i].tr);   
         }
         if (data[i].id>lastId){
            lastId=data[i].id;
         }
         $('table tbody').prepend(intestazioni);
      }
   },'JSON');
},5000)