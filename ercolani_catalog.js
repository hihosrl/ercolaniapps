$(function(){
   $('.catconf').on('click',function(){
      if ($('.cbtn.visible').length==0){
      if ($(this).find('div.cdesc').attr('contenteditable')!=='true'){
      $('.cbtn').removeClass('visible')
      $(this).find('.cbtn').addClass('visible')
      $('div.cdesc').attr('contenteditable',false);
      $(this).find('div.cdesc').attr('contenteditable',true);
      $(this).find('div.cdesc').trigger('focus')
      }}
   })
   $('.catconf .cbtn.revert').on('click',function(){
      location.reload();
   })
   $('.catconf .cbtn.save').on('click',function(){
      var id=$(this).closest('td').attr('id')
      var tx=$(this).closest('td').find('div').text()
      console.log(id + tx)
      $.get('/ercolani_catalog.php?cmd=save&id='+id+'&tx='+tx,function(data){
         if(data.status=='ok'){
          location.reload()
         }else{
            alert('Dati non salvati. Contattare assistenza');
         }
      },'JSON')
   })
      $('.catconf .cbtn.savenew').on('click',function(){
      var id=$(this).closest('td').attr('id')
      var tx=$(this).closest('td').find('div').text()
      console.log(id + tx)
      $.get('/ercolani_catalog.php?cmd=savenew&id='+id+'&tx='+tx,function(data){
         if(data.status=='ok'){
          location.reload()
         }else{
            alert('Dati non salvati. Contattare assistenza');
         }
      },'JSON')
   })
      $('.catconf .cbtn.delete').on('click',function(){
      var id=$(this).closest('td').attr('id')
      var tx=$(this).closest('td').find('div').text()
      console.log(id + tx)
      $.get('/ercolani_catalog.php?cmd=delete&id='+id+'&tx='+tx,function(data){
         if(data.status=='ok'){
          location.reload()
         }else{
            alert('Dati non salvati. Contattare assistenza');
         }
      },'JSON')
   })
})