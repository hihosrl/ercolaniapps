\<?php
ob_end_clean();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
//print_r($_REQUEST);
if ($_REQUEST['cmd']=='insert'){
  include('/var/www/general_include/general_apridb.inc');
  /*
  le opzioni sono
  Nome e Cognome  Mese di Nascita cittÃ   telefono
  21=newletter demo;
  cmd: "insert"
cognome: "Tozzi"
email: "info@bytoz.com"
nascita: ""
nazione: ""
nome: "Pierpaolo"
privacy: "on"
tel: ""
  */

/*dalla nazione devo ricavare le sottoliste:
nazioni:
"afghanistan", "albania", "algeria", "andorra", "angola", "antarctica", "antigua and barbuda", "argentina", "armenia", "australia", "austria", "azerbaijan", "bahamas", "bahrain", "bangladesh", "barbados", "belarus", "belgium", "belize", "benin", "bermuda", "bhutan", "bolivia", "bosnia and herzegovina", "botswana", "brazil", "brunei", "bulgaria", "burkina faso", "burma", "burundi", "cambodia", "cameroon", "canada", "cape verde", "central african republic", "chad", "chile", "china", "colombia", "comoros", "congo, democratic republic", "congo, republic of the", "costa rica", "cote d'ivoire", "croatia", "cuba", "cyprus", "czech republic", "denmark", "djibouti", "dominica", "dominican republic", "east timor", "ecuador", "egypt", "el salvador", "equatorial guinea", "eritrea", "estonia", "ethiopia", "fiji", "finland", "france", "gabon", "gambia", "georgia", "germany", "ghana", "greece", "greenland", "grenada", "guatemala", "guinea", "guinea-bissau", "guyana", "haiti", "honduras", "hong kong", "hungary", "iceland", "india", "indonesia", "iran", "iraq", "ireland", "israel", "italy", "jamaica", "japan", "jordan", "kazakhstan", "kenya", "kiribati", "korea, north", "korea, south", "kuwait", "kyrgyzstan", "laos", "latvia", "lebanon", "lesotho", "liberia", "libya", "liechtenstein", "lithuania", "luxembourg", "macedonia", "madagascar", "malawi", "malaysia", "maldives", "mali", "malta", "marshall islands", "mauritania", "mauritius", "mexico", "micronesia", "moldova", "mongolia", "morocco", "monaco", "mozambique", "namibia", "nauru", "nepal", "netherlands", "new zealand", "nicaragua", "niger", "nigeria", "norway", "oman", "pakistan", "panama", "papua new guinea", "paraguay", "peru", "philippines", "poland", "portugal", "qatar", "romania", "russia", "rwanda", "samoa", "san marino", " sao tome", "saudi arabia", "senegal", "serbia and montenegro", "seychelles", "sierra leone", "singapore", "slovakia", "slovenia", "solomon islands", "somalia", "south africa", "spain", "sri lanka", "sudan", "suriname", "swaziland", "sweden", "switzerland", "syria", "taiwan", "tajikistan", "tanzania", "thailand", "togo", "tonga", "trinidad and tobago", "tunisia", "turkey", "turkmenistan", "uganda", "ukraine", "united arab emirates", "united kingdom", "united states", "uruguay", "uzbekistan", "vanuatu", "venezuela", "vietnam", "yemen", "zambia", "zimbabwe"

324 LISTA1:ITALIANI
325 LISTA2:EUROPEI
326 LISTA3:USA
327 LISTA4:ALTRI PAESI
328 LISTA5:WINE CLUB
342 LISTA19:SVIZZERAH
369 LISTA10:FRANCIS-USA
343 LISTA20:AUSTRALIA
344 LISTA21:CANADA
367 LISTA25:AFRICA
341 LISTA18:SUD COREA
346 LISTA23:USA TEST
347 LISTA24:TOUR OPERATOR Tour Operator 1
358 LISTA9:D.ITALIA
357 LISTA8:D.GERMANIA, AUSTRIA E POLONIA
356 LISTA7:D.EUROPA FIAMMINGA
355 LISTA6:D.EST EUROPA RUSSIA
361 LISTA12:D.FRANCIA
362 LISTA13:D.SPAGNA E PORTOGALLO
363 LISTA14:D.STATI UNITI E CANADA
364 LISTA15:D.SUD AMERICA
365 LISTA16:D. ASIA
366 LISTA 17: D. AU, HK, NZ, SG, KR, JP
360 LISTA11:D. UK, P. ANGLOSASSONI, P. SCANDINAVI

Cipro, Croazia, Danimarca, Estonia, Finlandia, Francia, Germania, Grecia, Irlanda, Italia, Lettonia, Lituania, Lussemburgo, Malta, Paesi Bassi, Polonia, Portogallo, Repubblica Ceca, Romania, Slovacchia, Slovenia, Spagna, Svezia e Ungheria.
*/
$language='en';
$aSL=array();
switch (strtolower($_REQUEST['nazione'])) {
  case 'united kingdom':
  case 'switzerland':
  case 'norway':
      $aSL[]='386';
    break;
  case 'austria':
  case 'belgium':
  case 'bulgaria':
  case 'cyprus':
  case 'croatia':
  case 'denmark':
  case 'estonia':
  case 'finland':
  case 'france':
  case 'germany':
  case 'greece':
  case 'ireland':
  case 'latvia':
  case 'lithuania':
  case 'luxembourg':
  case 'malta':
  case 'netherlands':
  case 'poland':
  case 'portugal':
  case 'czech republic':
  case 'romania':
  case 'slovakia':
  case 'slovenia':
  case 'spain':
  case 'sweden':
  case 'hungary':
      $aSL[]='384';
    break;  
  case 'canada':
      $aSL[]='388';
    break;
  case 'italy':
      $aSL[]='383';
      $language='it';
    break;
  case 'australia':
  case 'japan':
  case 'united arab emirates':
  case 'south africa':
  case 'hong kong':
  case 'singapore':
  case 'new zealand':
  case 'korea, south':
        $aSL[]='387';
    break;   
  case 'united states':
  case 'puerto rico':
      $aSL[]='385';
    break;  
  default:
      $aSL[]='389';
  break;
}
$emailsplit=explode('@',$_REQUEST['email']);
$nascitasplit=explode('/',$_REQUEST['nascita']); 
  $q="INSERT INTO `letterit_abonnenten` (`BID`, `Email`, `domain`, `Datum`, `Option1`, `Option2`, `Option3`, `Option4`, `Code`, `Abmeldezeit`, `Status`, `IP`, `note`) VALUES
(216, '{$_REQUEST['email']}', '{$emailsplit[1]}', ".time().", '{$_REQUEST['nome']} {$_REQUEST['cognome']}', '{$nascitasplit[1]}', '', '{$_REQUEST['tel']}', '', 0, 1, '{$_SERVER['REMOTE_ADDR']}', 'reg. da vineria')
ON DUPLICATE KEY UPDATE `domain`=VALUES(`domain`), `Option1`=VALUES(`Option1`), `Option2`=VALUES(`Option2`), `Option4`=VALUES(`Option4`), `Status`=VALUES(`Status`), `note`=VALUES(`note`)"; 
  $_REQUEST['query']=$q;
  if($r=mysql_query($q)){
    $_REQUEST['esito']='ok';
    $q2="INSERT INTO `letterit_sottoliste_email` (`BID`, `email`, `sottoliste`, `note`) VALUES
(216, '{$_REQUEST['email']}', '".implode(',',$aSL)."', '')
ON DUPLICATE KEY UPDATE `sottoliste`=VALUES(`sottoliste`)";
    $_REQUEST['query2']=$q2;  
    if($r=mysql_query($q2)){
      $_REQUEST['esito2']='ok';
    }
  }else{
    $_REQUEST['esito']=mysql_error();
  }

if ($_REQUEST['esito']=='ok'){
      $aMailsContent=array('it'=>array(),'en'=>array());
      $aMailsContent['it']['subject']="Vineria Di Motepulciano";
      $aMailsContent['it']['html']="<p>Ciao ".$_REQUEST['nome'].",<br><br>
      Grazie per esserti iscritto alla nostra newsletter!<br>Mostra alla cassa questo codice coupon e ottieni il 10% sull’acquisto dei nostri prodotti.<br><br><b>VINERIA10</b></p>";

      $aMailsContent['en']['subject']="Vineria Di Motepulciano";
      $aMailsContent['en']['html']="<p>Hello ".$_REQUEST['nome'].",<br><br>
      Thank you for subscribing to our newsletter!<br> Show your coupon at check out and get a 10% off from your purchase.<br><br><b>VINERIA10</b></p>";

      // Prefer Composer autoload; fallback to local/global legacy library; else native mail()
      $phpmailer_loaded = false;
      $phpmailer_namespaced = false;
      $from='ercolani.wineclubservice@hiho.it';
      $fromName='Vineria di Montepulciano';

      // Try Composer autoload
      $composerAutoload = __DIR__ . '/vendor/autoload.php';
      if (file_exists($composerAutoload)) {
          require_once $composerAutoload;
          $phpmailer_loaded = class_exists('PHPMailer\\PHPMailer\\PHPMailer');
          $phpmailer_namespaced = $phpmailer_loaded;
      }
      // Fallback to local legacy include
      if (!$phpmailer_loaded) {
          $localPhpMailer = __DIR__ . '/lib/PHPMailer-master/class.phpmailer.php';
          if (file_exists($localPhpMailer)) {
              require_once($localPhpMailer);
              $phpmailer_loaded = class_exists('PHPMailer');
          }
      }
      // Fallback to global legacy include
      if (!$phpmailer_loaded && file_exists('/www/turismo/include_turismo/classi/PHPMailer-master/class.phpmailer.php')) {
          require_once('/www/turismo/include_turismo/classi/PHPMailer-master/class.phpmailer.php');
          $phpmailer_loaded = class_exists('PHPMailer');
      }

      if ($phpmailer_loaded) {
        $mail = $phpmailer_namespaced ? new \PHPMailer\PHPMailer\PHPMailer(true) : new PHPMailer();
        $mail->CharSet = 'UTF-8';
        $forcefrom=0;
        if ($forcefrom && $from!='')
            $mail->From = $from;
        else    
            $mail->From = 'www-data@cloud01.hiho.it';
        $mail->FromName = $fromName;
        $mail->AddAddress($_REQUEST['email']);



  $mail->DKIM_domain = 'hiho.it';
        $mail->DKIM_private = '/etc/dkim/private.key';
        $mail->DKIM_selector = 'cloud01';
        $mail->DKIM_passphrase = '';
        $mail->DKIM_identity = $mail->From; 
        $mail->Encoding = "base64";


        $mail->Sender = 'noreply@hiho.it';

        #$mail->AddAddress("ellen@example.com");                  // name is optional
        $mail->AddReplyTo('vineriatoscana@gmail.com',$fromName);
        //$mail->addBcc($from);
        
        $mail->WordWrap = 50;                                 // set word wrap to 50 characters
       # $mail->AddAttachment("/var/tmp/file.tar.gz");         // add attachments
        #$mail->AddAttachment("/tmp/image.jpg", "new.jpg");    // optional name
        $mail->IsHTML(true);                                  // set email format to HTML
        
        $mail->Subject = $aMailsContent[$language]['subject'];
        $mail->Body    = $aMailsContent[$language]['html'];
        $mail->AltBody = strip_tags($aMailsContent[$language]['html']);
        $mail->MessageID='<ERCOLANI#'.$sendid.'#'.str_replace('@','#',$from).'#'.$to.'#'.uniqid('',1).'##>';
        $_REQUEST['esito_mailcoupon']='ok';
        if(!$mail->Send())
        {
           $_REQUEST['esito_mailcoupon']='ko';
        }
      }
}




  //if (mysql_num_rows(result))
  echo json_encode($_REQUEST);
}

?>