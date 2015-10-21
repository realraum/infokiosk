<?

// this is a quick "hack" 
// to be used until xro enables proper redirect via apache2

    if(empty($_SERVER['HTTPS'])) {
        Header('Location:http://wp.realraum.at/');
    } else {
        Header('Location:https://wp.realraum.at/');
    }
?>
