<?php
ob_end_clean();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
//print_r($_REQUEST);

include('/var/www/general_include/general_apridb.inc');
mysql_close($db_result);

// Open a new connection
$db_result = mysql_connect("localhost", "ercolani", "ercolini");
mysql_select_db('ercolaniCassa');

switch ($_REQUEST['cmd']){
	case 'save':
	#print_r($_REQUEST);
	$q="update catalog set descrizione='".mysql_real_escape_string($_REQUEST['tx'])."',custom=0 where id={$_REQUEST['id']}";
	#echo $q;
	mysql_query($q) or die(mysql_error());
	echo json_encode(array('status'=>'ok'));
	exit;
	break;
	case 'savenew':
	#print_r($_REQUEST);
	$q="insert into catalog set descrizione='".mysql_real_escape_string($_REQUEST['tx'])."',custom=0, valore='-'";
	#echo $q;
	mysql_query($q) or die(mysql_error());
	echo json_encode(array('status'=>'ok'));
	exit;
	break;
	case 'delete':
	#print_r($_REQUEST);
	$q="delete from catalog where id={$_REQUEST['id']}";
	#echo $q;
	mysql_query($q) or die(mysql_error());
	echo json_encode(array('status'=>'ok'));
	exit;
	break;
}
$vc=md5(date('Ym').'arxragg'.date('mY'));
	if ($_REQUEST['vc']!=$vc){
		echo "Accesso consentito solo dal pannello autenticato";
		exit;
	}
$q="select * from catalog where custom=0 order by descrizione";
$r=mysql_query($q);
?>
<html>
	<head>
<link rel="stylesheet" href="ercolani_monitor.css">
<link rel="stylesheet" href="casse/css/jquery-ui.min.css">
<script src="casse/js/jquery-v3.6.0.min.js"></script>
<script src="casse/js/jquery-ui.min.js"></script>
<script src="ercolani_catalog.js?v=01"></script>
	</head>	
	<body>
		<h1>gestione catalogo di base</h1>
		<table>
			<tr>
				<th>Descrizione</th>
			</tr>
	
<?php
while ($row=mysql_fetch_assoc($r)){
	if ($row['valore']!='sconto'){
 echo "<tr><td class=\"catconf\" id=\"{$row['id']}\"><div class=\"cdesc\">{$row['descrizione']}</div><span class=\"cbtn save\">SALVA</span><span class=\"cbtn savenew\">AGGIUNGI ALLA LISTA</span><span class=\"cbtn delete\">ELIMINA</span><span class=\"cbtn revert\">ANNULLA MODIFICA</span></td></tr>";
		}
}





?>
	</table>
	</body>