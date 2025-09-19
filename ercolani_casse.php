<?php
ob_end_clean();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

// Load centralized environment configuration
require_once __DIR__ . '/config/environment.php';

//print_r($_REQUEST);
include('/var/www/general_include/general_apridb.inc');
mysql_close($db_result);

// Open a new connection
$db_result = mysql_connect("localhost", "ercolani", "ercolini");
mysql_select_db('ercolaniCassa');


//$q="select * from catalog where custom='0'";
$q="select id,upper(`descrizione`) as descrizione,`valore`,`custom` from catalog where custom='0' order by  if (descrizione='DISCOUNT - SCONTO','01',descrizione)";
$r=mysql_query($q);

$aProdotti=array();
while($row=mysql_fetch_assoc($r)){
  $aProdotti[]=$row;
}

switch($_REQUEST['cmd']){
	case 'getPdf':
	if ($_REQUEST['url']){
		$mtype = "application/octet-stream"; 
		header("Content-Type: " . $mtype);  
		readfile(dirname(__FILE__).$_REQUEST['url']);
	}
	exit;
	break;
		case 'getB64':
	if ($_REQUEST['url']){
		
		$file=implode('',file($_REQUEST['url']));
		//echo $file;
		$file=base64_encode($file);
		echo json_encode(array('pdf'=>$file));

	}
	exit;
	break;
  case 'getProd':
	echo json_encode($aProdotti);
	exit;
	break;
	case 'markViewed':
	if ($_REQUEST['pdf']!=''){
		if (mysql_query("update pdf set is_new='0' where shipment_id='{$_REQUEST['pdf']}'")){
			echo json_encode(array('status'=>'ok','id'=>$_REQUEST['pdf']));
		}

	}
	exit;
	break;
  case 'getNewest':
  $newRecords=array();
  if ($_REQUEST['last']!=''){
  	$q="select *,a.id as id_sped from shipments a left join pdf b on a.id=b.shipment_id where a.id > '{$_REQUEST['last']}' order by b.creato ASC";
		$r=mysql_query($q) or die (mysql_error() .  $q);
		if (mysql_num_rows($r)>0){
			while($row=mysql_fetch_assoc($r)){
				ob_start();
				?>
				<tr id="<?=$row['id_sped']?>" class="<?=($row['is_new']==1?'new':'')?>"isNew=""><td><?=$row['creato']?></td><td><?=$row['nome']?> <?=$row['cognome']?></td><td><div class="btn download" link="<?=$row['pdf']?>">ER-<?=str_pad($row['id_sped'], 5, '0', STR_PAD_LEFT)?></div></td><td><?=$row['email']?></td><td><?=$row['indirizzo']?> ,<?=$row['civico']?> <?=$row['cap']?> <?=$row['citta']?> - <?=$row['nazione']?> </td></tr>
  			<?php
				$newRecords[]=array('id'=>$row['id_sped'],'tr'=>ob_get_contents());
				ob_end_clean();
			}
		}
  }
  echo json_encode($newRecords);
 	exit;
  break;
  case 'insertData':
  $destpath=(dirname(__FILE__)).'/pdf/';
  //print_r($_REQUEST);
  $q="insert into shipments values('','BT','".mysql_escape_string($_REQUEST['nome'])."','".mysql_escape_string($_REQUEST['cognome'])."','".mysql_escape_string($_REQUEST['indirizzo'])."','".mysql_escape_string($_REQUEST['citta'])."','".mysql_escape_string($_REQUEST['cap'])."','".mysql_escape_string($_REQUEST['nazione'])."','".mysql_escape_string($_REQUEST['tel'])."','".mysql_escape_string($_REQUEST['email'])."','".mysql_escape_string($_REQUEST['prov'])."','".mysql_escape_string($_REQUEST['nascita'])."')";
  //echo $q;
  if ($r=mysql_query($q)){
	$id=mysql_insert_id();
	foreach($_REQUEST['items'] as $item){
		if ($item['id']=='custom'){
			$r=mysql_query("insert into catalog set custom=1, descrizione='".$item['desc']."'");
			$item['id']=mysql_insert_id();
		}
		$q2="insert into shipdetails values ('',$id,'".mysql_escape_string($item['id'])."','".mysql_escape_string($item['qty'])."','".mysql_escape_string($item['price'])."')";
		if ($r2=mysql_query($q2)){
			
		}else{
			echo "errore query dett";
		}
	}
  }else{
	echo "errore query main";
  }
  //eseguo la creazione del pdf
  //./wkhtmltopdf.sh 'http://ercolani.hiho.it/ercolani_casse.php?cmd=createPDF&shipment_id=4' /www/testercolani.pdf
  $execcmd="/bin/bash -c \"wkhtmltopdf.sh '".$API_BASE_URL."/ercolani_casse.php?cmd=createPDF&shipment_id=".$id."' ".$destpath."er_".str_pad($id, 5, '0', STR_PAD_LEFT).".pdf\"";
  //echo $execcmd;
  exec($execcmd, $output, $retval);
	//echo "Returned with status $retval and output:\n";
	//print_r($output);
	if ($retval==0){
		// eseguo la insert nel db
		$q="INSERT INTO `pdf` (`shipment_id`, `pdf`, `is_new`, `creato`, `cancellato`) VALUES ('".$id."', '".$API_BASE_URL."/pdf/er_".str_pad($id, 5, '0', STR_PAD_LEFT).".pdf', 1, '".date('Y-m-d H:i:s')."', '0000-00-00 00:00:00')";
			mysql_query($q) or die(mysql_error());

  		echo json_encode(array('status'=>'ok','pdf'=>$API_BASE_URL."/pdf/er_".str_pad($id, 5, '0', STR_PAD_LEFT).".pdf"));
			exit;
	}
	echo json_encode(array('status'=>'ko','error'=>"errore nella creazione del pdf"));
  exit;
  break;
  case 'createPDF':
  if ($_REQUEST['shipment_id'] !=''){
	$q="select * from shipments where id='".$_REQUEST['shipment_id']."'";
	$r=mysql_query($q) or die (mysql_error() .  $q);
	$data=array();
	while($row=mysql_fetch_assoc($r)){
	  $row['details']=array();
	  //print_r($row);
	  $q2="select * from shipdetails a left join catalog b on a.catalog_id=b.id where shipment_id='".$_REQUEST['shipment_id']."'";
	  $r2=mysql_query($q2) or die (mysql_error() .  $q2);
	  while($row2=mysql_fetch_assoc($r2)){
		$row['details'][]=$row2;
	  }
	  $data=$row;
	}

	$template = <<<DOC
	<link rel="stylesheet" href="ercolani_casse.css?tt=etr">
	<div class="page">
		<div class="row root nopad">
			<div class="col2">#LOGO1#</div>
			<div class="col2 rightA">#LOGO2#</div>
		</div>
		<div class="row root rightA">
			<div class="col1 tlink">Track your shipment through MBE code on: <b>https://track.bencienni.it/#/tracking</b></div>
		</div>
		<div class="row root rightA">
			<div class="col1">MBE CODE (TRACKING NUMBER) <span class="tnum">#TNUMBER#</span></div>
		</div>
		<div class="row root addresses">
			<div class="col1"><b>BENCIENNI SRL</b> - P.IVA e C.F. 06583970485<br><b>Mail Boxes Etc. 2529</b>, Via Traquandi, 5/7 - 52025 Montevarchi (AR) - Tel. +39 055.9850095 - Email: mbe2529@mbe.it<br><b>Mail Boxes Etc. 2682</b>, Via dello Sprone, 20/22R - 50125 Firenze (FI) - Tel. +39 055.217314 - Email: mbe2682@mbe.it<br><b>Mail Boxes Etc. 3063</b>, Strada provinciale Badia di sant’Antimo, 7 - 53024 Montalcino, (SI) - Tel +39 0577.848398 – Email: mbe3063@mbe.it<br><b>Mail Boxes Etc. 3196</b>, Via Benvenuto Cellini, 29 - 57025 Piombino (LI) - Tel +39 0565.472466 – Email: mbe3196@mbe.it</div></div>
		<div class="row">
			<div class="col1 title root">RECEIVER SHIPPING INFORMATION</div>
		</div>
		<div class="box anagrafica root">
	  		<div class="row">
				<div class="col2" label="NOME / NAME"><span>#NOME#</span></div>
				<div class="col2" label="COGNOME / SECOND NAME"><span>#COGNOME#</span></div>
			</div>
			<div class="row">
				<div class="col1" label="INDIRIZZO / ADDRESS"><span>#INDIRIZZO#</span></div>
			</div>
			<div class="row">
					<div class="col8" label="CAP / POSTAL CODE"><span>#CAP#</span></div>
					<div class="col3" label="CITTA' / CITY"><span>#CITTA#</span></div>
				  <div class="col10" label="PROVINCIA / STATE"><span>#PROV#</span></div>
		  		<div class="col04" label="NAZIONE / COUNTRY"><span>#NAZIONE#</span></div>
	  		</div>
  		<div class="row">
  				<div class="col8" label="DATA NASCITA / BIRTH DATE"><span>#DATAN#</span></div>
				<div class="col5" label="TELEFONO / PHONE NUMBER"><span>#TEL#</span></div>
				<div class="col05" label="EMAIL"><span>#EMAIL#</span></div>
			</div>
		</div>
		<div class="row">
			<div class="col1 title root">DESCRIPTION OF THE GOODS</div>
		</div>
		<div class="box anagrafica root">
			<div class="row head">
				<div class="col10"><span>Quantity</span></div>
				<div class="col08"><span>Description</span></div>
				<div class="col10"><span>Value</span></div>
			</div>
			#ROWS#
		</div>
		<div class="row root nopad bottom">
			<div class="col2">CUSTOMER SIGNATURE .......................................</div>
			<div class="col2 rightA">MBE SIGNATURE ..........................................</div>
			<div class="col1 rightA">#DATE#</div>
		</div>		  
	</div>
DOC;

	$aRows=array();
	$tot=0;
	foreach($data['details'] as $item){

		if ($item['valore']!='sconto'){
			$sign='';
			$tot+=$item['price'];
		}else{
			$tot-=$item['price'];
			$sign='-';
		}
		$aRows[]='<div class="row"><div class="col10 centerA"><span>'.$item['qty'].'</span></div><div class="col08"><span>'.$item['descrizione'].'</span></div><div class="col10 rightA"><span>'.$sign.number_format($item['price'], 2, ',', '.').'</span></div></div>';
	}
	$aRows[]='<div class="row"><div class="col10 centerA"><span>&nbsp;</span></div><div class="col08 rightA"><span><i>TOTAL</i></span></div><div class="col10 rightA"><span>'.number_format($tot, 2, ',', '.').'</span></div></div>';
	//print_r($data);
	$template=preg_replace('/#LOGO1#/','<div class="logo mbe"></div>',$template);
	$template=preg_replace('/#LOGO2#/','<div class="logo erc"></div>',$template);
	$template=preg_replace('/#TNUMBER#/','ER-'.str_pad($data['id'], 5, '0', STR_PAD_LEFT),$template);
	$template=preg_replace('/#NOME#/',$data['nome'],$template);
	$template=preg_replace('/#COGNOME#/',$data['cognome'],$template);
	$template=preg_replace('/#INDIRIZZO#/',$data['indirizzo'],$template);
	$template=preg_replace('/#CITTA#/',$data['citta'],$template);
	$template=preg_replace('/#PROV#/',$data['prov'],$template);
	$template=preg_replace('/#CAP#/',$data['cap'],$template);
	$template=preg_replace('/#NAZIONE#/',$data['nazione'],$template);
	$template=preg_replace('/#TEL#/',$data['telefono'],$template);
	$template=preg_replace('/#EMAIL#/',$data['email'],$template);
	$template=preg_replace('/#DATAN#/',$data['nascita'],$template);
	$template=preg_replace('/#ROWS#/',implode('',$aRows),$template);
	$template=preg_replace('/#DATE#/',date('F, d - Y'),$template);
	echo $template;

  }
  exit;
  break;
  default:
	// monitor dello stato ( pagina senza parametri)
	$vc=md5(date('Ym').'arxragg'.date('mY'));
	if ($_REQUEST['vc']!=$vc){
		echo "Accesso consentito solo dal pannello autenticato";
		exit;
	}
	$q="select *,a.id as id_sped from shipments a left join pdf b on a.id=b.shipment_id order by b.creato DESC";

	$r=mysql_query($q) or die (mysql_error() .  $q);
?>
<link rel="stylesheet" href="ercolani_monitor.css">
<link rel="stylesheet" href="casse/css/jquery-ui.min.css">
<script src="casse/js/jquery-v3.6.0.min.js"></script>
<script src="casse/js/jquery-ui.min.js"></script>
<script src="config/environment-config.php"></script>
<script src="ercolani_monitor.js?v=01"></script>
<div class="ricerca">Ricerca Avanzata</div>
<div class="ricerca_content">
<div><div class="label">data inizio</div><div><input type=text id=sdatada class=searchf></div></div>
<div><div class="label">data fine</div><div><input type=text id=sdataa class=searchf></div></div>
<div><div class="label">email</div><div><input type=text id=semail class=searchf></div></div>
<div><div class="label">nome o cognome (anche parziale)</div><div><input type=text id=snome class=searchf></div></div>
<div><div class="label">indirizzo (anche parziale)</div><div><input type=text id=snazione class=searchf></div></div>
</div>
<div class="catalog"><a href="/ercolani_catalog.php?vc=<?php echo $vc?>" target="_blank">mod. catalogo</a></div>
<table><tbody><tr><th>DATA</th><th>CLIENTE</th><th>PDF</th><th>EMAIL</th><th>INDIRIZZO</th></tr>
<?php	
$last_id=0;
while($row=mysql_fetch_assoc($r)){
	if ($row['id_sped']>$last_id)
		$last_id=$row['id_sped'];
	//print_r($row);
  	?>
  	<tr id="<?=$row['id_sped']?>" class="<?=($row['is_new']==1?'new':'')?>"isNew=""><td><?=$row['creato']?></td><td><?=$row['nome']?> <?=$row['cognome']?></td><td><div class="btn download" link="<?=$row['pdf']?>">ER-<?=str_pad($row['id_sped'], 5, '0', STR_PAD_LEFT)?></div></td><td><?=$row['email']?></td><td><?=$row['indirizzo']?>, <?=$row['civico']?> <?=$row['cap']?> <?=$row['citta']?> - <?=$row['nazione']?> </td></tr>
  	<?php
	}
	?></tbody></table>
	<script>
		var lastId=<?=$last_id?>
	</script>	
	<?php
  break;
}

?>