<?
include('dbcon.php');

$branchNameArr = mysql_query('select NA_BZPLNM from branchCheckTable order by binary(NA_BZPLNM)');
$branchAllNum = count($branchNameArr);


?>
const NA_BZPLNM = [];
<?
while ($branchName = mysql_fetch_array($branchNameArr)){ //일반배열 연관배열
?>
        NA_BZPLNM.push(`<?=$branchName[NA_BZPLNM]?>`);
<?
}

?>
