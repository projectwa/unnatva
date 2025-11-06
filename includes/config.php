<?php
/*
    FileName : config
    Function : Contains default settings for site
*/

if(strpos($_SERVER['SERVER_NAME'], 'unnatva.org') !== false){
	//---- SEO Path settings-----
  define('S_IWTPATH','https://www.imaginewebtech.info/');
  define('S_MAINDOMAINPATH','https://unnatva.org/');
  define('S_DOMAINPATH','https://unnatva.org/');
  define('S_ROOTPATH',$_SERVER['DOCUMENT_ROOT'].'/');//Don't change
  // define('S_ROOTPATH','/home2/imaginei/public_html/d1/unnatva/');//Don't change
  define('S_CSSPATH', S_DOMAINPATH . 'css/'); //Don't change
  define('S_IMGPATH',S_DOMAINPATH.'img/');
  define('S_JSPATH',S_DOMAINPATH.'js/');
  define('S_INCLUDESPATH',S_ROOTPATH.'includes/');
}else{
	//---- SEO Path settings-----
  define('S_IWTPATH', 'https://imaginewebtech.com');//Don't change
  define('S_DOMAINPATH','http://localhost/UNNATVA/site/');
  define('S_ROOTPATH','D:/IWT-Workspace/UNNATVA/site/');//Don't change
  define('S_IMGPATH',S_DOMAINPATH.'img/');//Don't change
  define('S_CSSPATH', S_DOMAINPATH . 'css/'); //Don't change
  define('S_JSPATH',S_DOMAINPATH.'js/');//Don't change
  define('S_INCLUDESPATH',S_ROOTPATH.'includes/');//Don't change
}
?>