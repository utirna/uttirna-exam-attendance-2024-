var keyStr = "ABCDEFGHIJKLMNOP" +
              "QRSTUVWXYZabcdef" +
              "ghijklmnopqrstuv" +
              "wxyz0123456789+/" +
              "=";

 function encode64(input) {
    input = escape(input);
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    do {
       chr1 = input.charCodeAt(i++);
       chr2 = input.charCodeAt(i++);
       chr3 = input.charCodeAt(i++);

       enc1 = chr1 >> 2;
       enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
       enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
       enc4 = chr3 & 63;

       if (isNaN(chr2)) {
          enc3 = enc4 = 64;
       } else if (isNaN(chr3)) {
          enc4 = 64;
       }

       output = output +
          keyStr.charAt(enc1) +
          keyStr.charAt(enc2) +
          keyStr.charAt(enc3) +
          keyStr.charAt(enc4);
       chr1 = chr2 = chr3 = "";
       enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;
 }

 function decode64(input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
       alert("There were invalid base64 characters in the input text.\n" +
             "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
             "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    do {
       enc1 = keyStr.indexOf(input.charAt(i++));
       enc2 = keyStr.indexOf(input.charAt(i++));
       enc3 = keyStr.indexOf(input.charAt(i++));
       enc4 = keyStr.indexOf(input.charAt(i++));
       chr1 = (enc1 << 2) | (enc2 >> 4);
       chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
       chr3 = ((enc3 & 3) << 6) | enc4;
       output = output + String.fromCharCode(chr1);
       if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
       }
       if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
       }
       chr1 = chr2 = chr3 = "";
       enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);
    return unescape(output);
 }

 function shuffle(a) {
   var j, x, i;
   for (i = a.length; i; i--) {
       j = Math.floor(Math.random() * i);
       x = a[i - 1];
       a[i - 1] = a[j];
       a[j] = x;
   }
   return a;
}

function setAlermColorToTimer(minutes,sec,_hrs){
  
  if (Number(_hrs) == 0) {
    if (parseInt(minutes) < 2) {
      if (parseInt(sec) % 2) {
        $('#i-test-timer').css('color', 'red');
        $('#i-test-timer').parent().css('color', 'red');
      } else {
        $('#i-test-timer').css('color', '#ffffff');
        $('#i-test-timer').parent().css('color', '#ffffff');
      }
    } 
  }
  
}
function examTimer() {
    if(parseInt(min) < 0){
      endThisExamination();
      return false;
    }
    var hours = '0'+Math.floor( min / 60);          
    var minutes = min % 60;

    if (min < show_time || show_time < 0) {
      $('#i-submit-test-pre').removeClass('hide');
    }
    
    if (parseInt(sec) >0) {

        if (!is_time_pause) {// timer is paused
           question_per_time_sec += 1; // question_count_inc;
          
        
          var per_q_min =  Math.floor(question_per_time_sec / 60);
          var per_q_sec = question_per_time_sec % 60;
          $('#single-question-time').html(per_q_min + ':' + per_q_sec);
          test_question[index_of_question_global].q_time = question_per_time_sec; 
          if (time_to_save_data == 0) {
            time_to_save_data = auto_save_time_q;
            sendSaveData(function () { });
          } else {
            time_to_save_data -= 1;
          }
          
          if (parseInt(minutes) < 10 && parseInt(sec) < 10) {
            setAlermColorToTimer(minutes, sec, Number(hours));
            $('#i-test-timer').html(hours+' : '+'0'+minutes+' : 0'+sec);
          }
          if (parseInt(minutes) >= 10 && parseInt(sec) < 10) {
            $('#i-test-timer').html(hours+' : '+minutes+' : 0'+sec);
          }

          if (parseInt(minutes) < 10 && parseInt(sec) >= 10) {
            setAlermColorToTimer(minutes,sec, Number(hours));
            $('#i-test-timer').html(hours+' : '+'0'+minutes+' : '+sec);
          }

          if (parseInt(minutes) >= 10 && parseInt(sec) >= 10) {
            $('#i-test-timer').html(hours+' : '+minutes+' : '+sec);
          }
           sec = parseInt(sec) - 1;
                tim = setTimeout("examTimer()", 1000);
            }
        }
      else {
        if (!is_time_pause) {
          if (parseInt(min) < 0 ){
            endThisExamination();
          }else{
            if (parseInt(min) == 0 && parseInt(sec) == 0){
              endThisExamination();
            }
          }
         
              if (parseInt(sec) == 0) {
                $('#i-test-timer').html(hours+' : '+minutes+' : 0'+sec);
                min = parseInt(min) - 1;
                sec=59;
                  tim = setTimeout("examTimer()", 1000);
                }
          }
        }
}

function endThisExamination(){
      $('#i-test-timer').html('00 : 00');
      is_time_pause = true;
        var _data = {
                      list:JSON.stringify(student_temp_ans_list),
                      min:0,
                      sec:0,
                      test_status:0,
                      test_id: orignal_test_id,
                      publish_id: orignal_publish_id,
                      student_id: orignal_student_id
                    };
              student_temp_ans_list = [];
              mytest.saveTest(_data,function(json_data){
                    if(json_data.call){
                        Lobibox.alert('info', //AVAILABLE TYPES: "error", "info", "success", "warning"
                          {
                          msg: "Times Up, You test has been submitted successfully"
                          });
                        setTimeout(function() {
                          location.replace(_getUrl() + "climax/" + _t_s_i[0].Exam.published_id + "/" + _t_s_i[0].StudentInfo.id); 
                        }, 1000);
                    }else{
                        retryMsg("Times Up,But Unable to submit your test,Click on ok to try again.",function(type){
                            mytest.submitRetry(_data); 
                        });

                    }
              });
 }

 function onPageLoaded() {
  var jqxhrs = [];

  window.onbeforeunload = function(){
     $.each(jqxhrs, function (idx, jqxhr) {
        if (jqxhr)
            jqxhr.abort();
    });
  };
 
  function registerJqxhr(event, jqxhr, settings) {
      jqxhrs.push(jqxhr);
  }

  function unregisterJqxhr(event, jqxhr, settings) {
      var idx = $.inArray(jqxhr, jqxhrs);
      jqxhrs.splice(idx, 1);
  }

  $(document).ajaxSend(registerJqxhr);
  $(document).ajaxComplete(unregisterJqxhr);
};

$(onPageLoaded);