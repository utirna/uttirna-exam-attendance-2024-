<?php
if(!function_exists('sg_load')){$__v=phpversion();$__x=explode('.',$__v);$__v2=$__x[0].'.'.(int)$__x[1];$__u=strtolower(substr(php_uname(),0,3));$__ts=(@constant('PHP_ZTS') || @constant('ZEND_THREAD_SAFE')?'ts':'');$__f=$__f0='ixed.'.$__v2.$__ts.'.'.$__u;$__ff=$__ff0='ixed.'.$__v2.'.'.(int)$__x[2].$__ts.'.'.$__u;$__ed=@ini_get('extension_dir');$__e=$__e0=@realpath($__ed);$__dl=function_exists('dl') && function_exists('file_exists') && @ini_get('enable_dl') && !@ini_get('safe_mode');if($__dl && $__e && version_compare($__v,'5.2.5','<') && function_exists('getcwd') && function_exists('dirname')){$__d=$__d0=getcwd();if(@$__d[1]==':') {$__d=str_replace('\\','/',substr($__d,2));$__e=str_replace('\\','/',substr($__e,2));}$__e.=($__h=str_repeat('/..',substr_count($__e,'/')));$__f='/ixed/'.$__f0;$__ff='/ixed/'.$__ff0;while(!file_exists($__e.$__d.$__ff) && !file_exists($__e.$__d.$__f) && strlen($__d)>1){$__d=dirname($__d);}if(file_exists($__e.$__d.$__ff)) dl($__h.$__d.$__ff); else if(file_exists($__e.$__d.$__f)) dl($__h.$__d.$__f);}if(!function_exists('sg_load') && $__dl && $__e0){if(file_exists($__e0.'/'.$__ff0)) dl($__ff0); else if(file_exists($__e0.'/'.$__f0)) dl($__f0);}if(!function_exists('sg_load')){$__ixedurl='http://www.sourceguardian.com/loaders/download.php?php_v='.urlencode($__v).'&php_ts='.($__ts?'1':'0').'&php_is='.@constant('PHP_INT_SIZE').'&os_s='.urlencode(php_uname('s')).'&os_r='.urlencode(php_uname('r')).'&os_m='.urlencode(php_uname('m'));$__sapi=php_sapi_name();if(!$__e0) $__e0=$__ed;if(function_exists('php_ini_loaded_file')) $__ini=php_ini_loaded_file(); else $__ini='php.ini';if((substr($__sapi,0,3)=='cgi')||($__sapi=='cli')||($__sapi=='embed')){$__msg="\nPHP script '".__FILE__."' is protected by SourceGuardian and requires a SourceGuardian loader '".$__f0."' to be installed.\n\n1) Download the required loader '".$__f0."' from the SourceGuardian site: ".$__ixedurl."\n2) Install the loader to ";if(isset($__d0)){$__msg.=$__d0.DIRECTORY_SEPARATOR.'ixed';}else{$__msg.=$__e0;if(!$__dl){$__msg.="\n3) Edit ".$__ini." and add 'extension=".$__f0."' directive";}}$__msg.="\n\n";}else{$__msg="<html><body>PHP script '".__FILE__."' is protected by <a href=\"http://www.sourceguardian.com/\">SourceGuardian</a> and requires a SourceGuardian loader '".$__f0."' to be installed.<br><br>1) <a href=\"".$__ixedurl."\" target=\"_blank\">Click here</a> to download the required '".$__f0."' loader from the SourceGuardian site<br>2) Install the loader to ";if(isset($__d0)){$__msg.=$__d0.DIRECTORY_SEPARATOR.'ixed';}else{$__msg.=$__e0;if(!$__dl){$__msg.="<br>3) Edit ".$__ini." and add 'extension=".$__f0."' directive<br>4) Restart the web server";}}$__msg.="</body></html>";}die($__msg);exit();}}return sg_load('EAE93A934756CA16AAQAAAAXAAAABHAAAACABAAAAAAAAAD/+wYywVP/SFZmv++oa9h4XvVfHTp1x3ddjwUTmx94/PVktmpRu7FK1BazRgFbs6gRXHcip098Fths6D1mLyF3wxsuRh0soSPXlEC3kg0/d1FAA6gQTJAB9FQcsCalODpAkCIDmaZobrvTi38e+T8IxDgAAACgAwAAM/ctW33YTvhnfIdcEwT9fTC/8Qbqa0eeo5dfU3TzF6dFxdleHDD5af45e99iBcvu53LMD2S/+wMo2zQSvBWdYUN3Hnr0WoJw3nLoGiB2JC0X7jw49X3Qlbe189Q9YrYdFa0DVXp3vXXlNX2e8fMDOz9tBoFOZxIpQASZBM0i8OpX36e/eztiosmVozNz8i4QArMDA1uW2GKzipoWq1TIQ8qdzQzWf0i78WGx30JzWJ2LK0FTaGdqwugAc5bIIpPw3swmFGziAcAN92Dfhxk/mM2FSrZ+ZFj+vnREAU5ajRAmIPXIb2irCHBYDE3e10icuNhqv38KE9urbivCDF6YPJphDODn3u+iIlfvgXpYtahj8N5iPfYQBZOS4Yhet0j8IUe15epTAgggGD4gVH6tzGQ2cJqZUI7seBjwPVyulybfOLBYSTJ/5uJ82DH3gBKMO932J1NOiv9JkeyEK1J+n7x2VIvI9qZS9cEhMFaptFaRxrR/4sOptxx7ta65umnH7Rz7d2SSeWeGme7XQPweuYwO66dgDQKmNm7KB378bHSP9tDKgCML336VmlY37nksnJHwv/S7DkOaz3F5GKDzwhhwUBu2isiZ1lr26s5A9ib6g64HO6DtVn06EvyQoYnU1RlpTYC1mQ0bH0/+UTYjxCvLuLYRtV+JfEHrJAHAKKUqPScovXyO/TwqtMye0t+NyefJXWbZ6C2tGqX+fJUHcx5lJuZw7Cr1cQiLRqcvI4Jbt87rV0YSeN2+Vv7DLP9ujEOeTVaO5YL7EavHYXG+MXRVzH609U9sr3GXsBcOYJV+ZQllXMA2I3Dy3YbHwV8LPHWqqiTvBCYHeu6DvlQI2/nutfzE9Rf5YtZDJazpBRKg27Y7bmNOG4wpyK5hdb0Y+NBmdtyHcCMoDjUtaqVdb0/3K6z7RWyqvoLH0obhvZo7fIxNezwEWqvdJ8PlC8t0N5468b/+cOs5Tu/phGZ1caRfbTnWa5t4LbVOZbL8Inqhy4stlSu7GeTaOeFUOt16nIbvt/IGh5XcZ6neftfWq7dtA8RkdDePbyYw7G1UnG9o8d/L6S9qFpm5k/M+Ua8peEccONliKydXqaP0g4iEdiX3bKzPAB+5ToNpeIlomCWGr1IEd5zA/j/rHbT9lxfe+gWGAyKUI2XD6wtGqZQ0f4RqHeo8w4z16Yzw6S0aecdFgYD2uZ4W2TF5zAXTg+c15/wfOrXGp0/MRNZdhxQnbwAAAAA=');