<?php
// API pre AP admin cast
// 20.11.0214  

  require("ap_defines.php");
  
  $collate = "cp1250";//"utf8";
  
  //$dsn = 'mysql:dbname='.NAME_DB.';host='.LOCAL_HOST1;

  // UTF8 to CP1250
  function convtext($t) {  
    setlocale(LC_CTYPE, 'sk_SK');
    return iconv('UTF-8', 'WINDOWS-1250//TRANSLIT//IGNORE', "$t");  // ASCII//TRANSLIT
  }
  // CP1250 to UTF8
  function convtextback($t) {  
    setlocale(LC_CTYPE, 'sk_SK');
    return iconv('WINDOWS-1250', 'UTF-8//TRANSLIT//IGNORE', "$t");  // ASCII//TRANSLIT
  }
  
  // kontrola parametrov:
  if (!isset($_REQUEST['task'])) 
    die('{"status":"Error: nevyplnene parametre!"}');
    
  $func = $_REQUEST['task'];
     
  // spojenie s DB:
  try {
    //$dbh = new PDO($dsn, $user, $password,
    //               array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES cp1250"));
    $dbh = new PDO("mysql:host=".LOCAL_HOST1.";dbname=".NAME_DB.";charset=$collate", LOCAL_USER1, LOCAL_PASS1);
  } catch (PDOException $e) {
    die('Connection failed: ' . $e->getMessage());
  }
  
  try {
    $dbh->exec("SET NAMES $collate");   
    $dbh->exec("SET character_set_connection $collate");                               	
    $dbh->exec("SET character_set_client $collate");                               	
    $dbh->exec("SET character_set_results $collate");                 
                                          	
    $dbh->exec("USE ".NAME_DB);                               	
  }
  catch(PDOException $e) {
    die('Error: '.$e->getMessage());
  }
  
  
  $rx = array();
  
  switch ($func) {  
    /*************************************************************************/
    case "racelist":
      $query = "SELECT pretekid ".
               "FROM ".REGISTRATION_TAB.
               " GROUP BY pretekid;";
      try {
        $sth = $dbh->query($query); 
        if (!$sth) {
          echo "\nPDO::errorInfo(): $query \n";
          //print_r($DBH->errorInfo());
          //die("SQL query failed!" . $query); 
          //die('{"status":"Error: chyba MYSQL [1]"}');
          die('{"status":"Bez zaznamov"}');
        }
    		        
        $sth->setFetchMode(PDO::FETCH_ASSOC);  
        foreach ($sth as $row) {
          $arr = array(
            'id' => $row['pretekid'], 'Nazov' => $row['pretekid']);
          array_push($rx,$arr);
        }                 
        $sth->closeCursor();
      } catch (PDOException $e) {
        die('{"status":"Error: chyba MYSQL [2]"}');
        //die('Query failed: ' . $e->getMessage());
      }
      break;
            
    /*************************************************************************/
    case "raceracerslist":
      if (!isset($_REQUEST['pretekid']))
        die('{"status":"ERROR: Chyba parametrov!"}');
        
      $pretekid = $_REQUEST['pretekid'];
        
      $query = "SELECT * FROM ".REGISTRATION_TAB.
               " WHERE pretekid=$pretekid ORDER BY id;";
      try {
        $sth = $dbh->query($query); 
        if (!$sth) {
          echo "\nPDO::errorInfo(): $query \n";
          //print_r($DBH->errorInfo());
          //die("SQL query failed!" . $query); 
          //die('{"status":"Error: chyba MYSQL [1]"}');
          die('{"status":"Bez zaznamov"}');
        }
    		        
        $sth->setFetchMode(PDO::FETCH_ASSOC);  
        foreach ($sth as $row) {
          $arr = array(
            'id' => $row['id'], //'Nazov' => $row['pretekid'], 
            'Meno' => convtextback($row['priezvisko'] .' '. $row['meno'] .' '. $row['titul']),
            'Narodeny' => $row['rnarod'], 'Adresa' => convtextback($row['mesto'] .' '. $row['stat']), 
            'Kontakt' => $row['email'] .' '. $row['telefon'], 'Uhrada' => $row['uhrada'],
            'Tim' => convtextback($row['nazovtimu']), 'Disciplina' => convtextback($row['disciplina']));
          array_push($rx,$arr);
        }                 
        $sth->closeCursor();
      } catch (PDOException $e) {
        die('{"status":"Error: chyba MYSQL [2]"}');
        //die('Query failed: ' . $e->getMessage());
      }
      break;
      
    /*************************************************************************/
    default:
      die('{"status":"ERROR: Chybny prikaz!"}');
  }

  echo json_encode($rx);
?>