var test_question = new Array();//question paper
var test_question_block = [[],[],[],[],[]]//question paper in blocks;
var test_question_block_subject = ['physics', 'chemistry','mathematics','biology','other'];//question paper in blocks;
var test_question_block_subject_caps = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Other'];//question paper in blocks;
var test_question_block_subject_ = [0,0,0,0,0];
var _ttt = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
var last_subject_block_name = 0;
var last_subject_block_index = -1;
var current_block_index = 0;
var test_name = '';// main_test_name
var current_duration = 0;// test time for count down
var ans_review_count = 0;
var ans_done = 0;
var ans_review_count = 0
var ans_not_ans = 0;
var current_question_index = 0;
var question_for_review_count = 0;
var current_time = 0;
var student_temp_ans_list = new Array();
var _tmp_ans = "";
var _tmp_ans_key = "";
var is_time_pause = false;
var min = _min;
var sec = _sec;
var orignal_test_id = _orignal_test_id;
var orignal_publish_id = _orignal_publish_id;
var orignal_student_id = _orignal_student_id;
var unans_review_count = 0;
var last_index = -1;
var auto_save_time_q = 20;



var Mytest = function () {
  this.configTest = function (tbi, qts, callback) {
    var _this = this;
    if (tbi.length > 0) {
      var test_info = tbi[0];
      test_name = "<strong>" + test_info.test_name + "</strong>" ;
    } else {
      test_name = 0;
    }
    
    //test_question = qts;
    
    $.each(qts,function(key,value){
      
        switch(value.main_topic_name){
          case test_question_block_subject[0]:
            test_question_block[0].push(value);

            break;
          case test_question_block_subject[1]:
            test_question_block[1].push(value);
            break;
          case test_question_block_subject[2]:
            test_question_block[2].push(value);
            break;
          case test_question_block_subject[3]:
            test_question_block[3].push(value);
            break;
          default:
            test_question_block[4].push(value);
            break;
        }
    });
    var is_subject_no_found = true;
    $.each(test_question_block, function (key,value){
  
      test_question_block_subject_[key] = test_question.length;
      test_question = test_question.concat(test_question_block[key]);
  
      if (value.length > 0 && key != 4){
        if (is_subject_no_found == true ) { current_block_index = key; }
        is_subject_no_found = false;
        }else{
        $('.sec-'+key).addClass('hide');
        }
    });

    if (is_subject_no_found == true){
      current_block_index = 4;
      $('#id_exam_chapter_dispay').addClass('hide');
    };
  //  test_question = test_question_block[current_block_index];
    callback(test_question);
    
  },//this.configTest = function(qts,callback){}
  this.setQuestionNumbers = function (qty_list) {
      $('#question-btn').html('');
      ans_review_count = 0;
      unans_review_count = 0;
      ans_done = 0;
      ans_not_ans = qty_list.length;
      var old_key = qty_list[0].main_topic_name;
      var question_print_count = 1;
      var _ans_done = 0;
      var _ans_not_ans = 0;
      var _unans_review_count = 0;
      var _ans_review_count = 0;
    
      var main_topic_name = '';
      var indexof_name = -1;
      question_print_count = 1;
      $.each(qty_list, function (key, value) {
         if (main_topic_name != value.main_topic_name && _test_mode == 1) {
              indexof_name += 1;
              main_topic_name = value.main_topic_name;
              _ttt[indexof_name] = [0,0,0,0];
              $('#question-btn').append('<div class="form-group">' +
                '<center>' +
                '<p style="width: 100%;border: 1px solid #000;padding: 2px;margin-top: 5px;background-color:#a09362;color: #fff;border-radius: 10px;"><strong>' + capitalize(main_topic_name) + '</strong></p>' +
                '</center>' +
                '</div>');
              
            
            }

          $i = parseInt(key) + 1;
          var temp_ans = value.student_ans;
          
          if (question_print_count < 10) {
            question_print_count = '0' + question_print_count;
          }
          
          if (parseInt(value.mark_review)) {
            if (temp_ans.length > 0) {
                ans_done = parseInt(ans_done) + 1;
                ans_not_ans = parseInt(ans_not_ans) - 1;
                ans_review_count += 1;

                _ttt[indexof_name][3] += 1;
                _ttt[indexof_name][0] += 1;

                $('#question-btn').append('<a type="button" id="i-btn-view-' + key + '" class="ans_review_done" name="button" onclick="_getQuestionView(this,event,' + key + ')">' + question_print_count + '</a>');
            } else {
                
                unans_review_count += 1;
                $('#question-btn').append('<a type="button" id="i-btn-view-' + key + '" class="ans_review" name="button" onclick="_getQuestionView(this,event,' + key + ')">' + question_print_count + '</a>');
              
                _ttt[indexof_name][1] += 1;
                _ttt[indexof_name][2] += 1;
           
            }
          } else {
            if (temp_ans.length > 0) {
                ans_done = parseInt(ans_done) + 1;
                ans_not_ans = parseInt(ans_not_ans) - 1;
                
                _ttt[indexof_name][0] += 1;
            
              $('#question-btn').append('<a type="button" id="i-btn-view-' + key + '" class="ans_done" name="button" onclick="_getQuestionView(this,event,' + key + ')">' + question_print_count + '</a>');
            } else {
                _ttt[indexof_name][1] += 1;
              $('#question-btn').append('<a type="button" id="i-btn-view-' + key + '" class="ans_not_done" name="button" onclick="_getQuestionView(this,event,' + key + ')">' + question_print_count + '</a>');
            }
          }// main if-else
          // console.log('ans_done'+ _ans_done);
        
        question_print_count = parseInt(question_print_count);
        question_print_count++;

        
      });//  $.each(){}
      this.makeDefaultUpdate(ans_review_count, ans_not_ans, ans_done, unans_review_count);
    },
  this.makeDefaultUpdate = function (ans_review_count, ans_not_ans, ans_done, unans_review_count) {
    // console.log(_ttt);
    $('#q-ans-done').html(this.setPreZero(ans_done));
      // $('#q-not-ans-done').html(ans_not_ans+' Not Answer');
      $('#q-nans-review').html(this.setPreZero(unans_review_count));
      $('#q-ans-review').html(this.setPreZero(ans_review_count));
      $('#q-not-done').html(this.setPreZero(ans_not_ans));
      $('#i-btn-view-' + current_question_index).addClass('selected-question');
    },
  this.setPreZero = function (data) {
      if (data == 0) { return '00'; }

      if (data > 99) { return data; }

      if (data > 9) { return data; }

      if (data <= 9) { return '0' + data; }
    },// setPreZero{}
  this.setIndexOfBlock = function (_data_array, _index_id){
    if (typeof _data_array[_index_id] != 'undefined') {
      current_block_index = test_question_block_subject.indexOf(_data_array[_index_id].main_topic_name);
      $('#id_exam_chapter_dispay_ul').children('li').removeClass('active_chapter');
      $('.sec-' + current_block_index).addClass('active_chapter');
    }
  },
  this.getQuestionView = function (data_array, index_id) {

      question_per_time_sec = 0;
      current_question_index = index_of_question_global = index_id;
    this.setIndexOfBlock(data_array, index_id); 

      _tmp_ans = '';
      
      $('#i_test_save_next').addClass('hide').html('Next&nbsp;&nbsp;<i class="fa fa-forward"></i>');
      $('#i_test_save_only').addClass('hide');
      if (index_id == 0) {
        $('#i_test_previous_question').addClass('hide');
      } else {
        $('#i_test_previous_question').removeClass('hide');
      }
      
      var myindex = parseInt(index_id) + 1;
      $('#i_test_resopnce').addClass('hide');
      if (typeof data_array[myindex] == 'undefined') {
          $('#i_test_save_next-1').removeClass('hide');
          $('#i_test_save_next').addClass('hide');
      } else {
          $('#i_test_save_next-1').addClass('hide');
          $('#i_test_save_next').removeClass('hide');
      }
      
      if (data_array.length - 1 == index_id) {
          $('#i_test_save_only-12').removeClass('hide');
          $('#i_test_save_only-12').prop('disabled', true);
      }

      if (data_array.length >= index_id) {
          current_question_index = index_id;
          var question_array = data_array[index_id];
          question_per_time_sec = question_array.q_time;
        // console.log(question_per_time_sec);
          if (parseInt(question_array.q_display_type) == 1) {
              var q = this._printTypeOne(question_array, index_id);
              $('#i_test_type_text').html(capitalize(question_array.main_topic_name));
              //$('#i_test_type_text').html("Single Answer Type");
          }

          if (parseInt(question_array.q_display_type) == 3) {
              var q = this._printTypeThree(question_array, index_id);
              $('#i_test_type_text').html(capitalize(question_array.main_topic_name));
          }

          if (parseInt(question_array.q_display_type) == 4) {
              var q = this._printTypeFour(question_array, index_id);
              $('#i_test_type_text').html(capitalize(question_array.main_topic_name));
          }
      
          if (question_array.q_ask_in != '') {
            if (question_array.q_ask_in.length < 25) {
              $('#i-ask-in')
                  .html(question_array.q_ask_in)
                  .parent()
                  .removeClass('hide');
            } else {
              $('#i-ask-in')
                  .html(question_array.q_ask_in.substring(0, 25) + '...')
                  .parent()
                  .removeClass('hide');
              }
          } else {
            $('#i-ask-in')
                .html('')
                .parent()
                .addClass('hide');
          }
          
          if (question_array.student_ans != '') {
                //  $('#i_test_mark_for_review').prop('disabled',false);
                $('#i_test_rest').removeClass('hide');
          } else {
                //$('#i_test_mark_for_review').prop('disabled',true);
                $('#i_test_rest').addClass('hide');
          }
      
          if (parseInt(question_array.mark_review) == 0) {
              $('#i_test_unmark_for_review').addClass('hide');
              $('#i_test_mark_for_review').removeClass('hide');
          } else {
              $('#i_test_unmark_for_review').removeClass('hide');
              $('#i_test_mark_for_review').addClass('hide');
          }
          
          $('#main-pater-row').html(q);
          q = '';
          $('#i-question-number').html('Q.' + (parseInt(index_id) + 1));
          $('#question-btn').find('button').removeClass('selected-question');
          $('#question-btn').find('a').removeClass('selected-question');
          $('#question-btn').children('#i-btn-view-' + current_question_index).addClass('selected-question');
          scoll_height = $('#question-btn');
          row = $('#question-btn').children('#i-btn-view-' + current_question_index);

          /* $('#question-btn').animate({scrollTop: row.offset().top - (scoll_height.height())}, 10 );*/
          $('#i-btn-view-' + current_question_index).addClass('selected-question');
          loadMathjax();
      }  else {
      alert('question out of range');
      }

      $('#main-pater-row p').css('font-size', defult_font + 'pt');
      $('#main-pater-row h5').css('font-size', defult_font + 'pt');
      $('#main-pater-row label').css('font-size', defult_font + 'pt');
    },
  this._printTypeFour = function (question, index_id) {
     
      var col_1 = JSON.parse(question.q_col_a);
      var col_2 = JSON.parse(question.q_col_b);
      var _col_tr = '';
      var max_lenth = col_1.length >= col_2.length ? col_1.length : col_2.length;
      var mat_data = JSON.parse(question.q_mat_data);
      var mat_col_count = mat_data[0].length;
      var mat_row_count = mat_data.length;
      var matrix_head = '<tr>';
      var and_option = '';
      var matrix_body = '';

      for (var m_row = 0; m_row < mat_row_count; m_row++) {
        matrix_body += '<tr>';

        for (var m_col = 0; m_col < mat_col_count + 1; m_col++) {
          if (!m_row) {

            if (!m_col) {
              matrix_head += '<th></th>';
            } else {
              matrix_head += '<th>' + String.fromCharCode(64 + parseInt(m_col)) + '</th>';
            }

          }// if (!m_row){}

          if (!m_col) {
            matrix_body += '<td>' + String.fromCharCode(97 + parseInt(m_row)) + '</td>';
          } else {
            matrix_body += '<td>' + mat_data[m_row][m_col - 1] + '</td>';
          }
        }// for(){}

        matrix_body += '</tr>';
        and_option += '<div class="col-sm-1">';
        and_option += this.setOptionData(String.fromCharCode(97 + parseInt(m_row)), '0', index_id, m_row, String.fromCharCode(97 + parseInt(m_row)), question.student_ans);
        and_option += '</div>';
      }//for(){}
      matrix_head += '</tr>';

      for (var i = 0; i < max_lenth; i++) {
          var cap_a = String.fromCharCode(65 + parseInt(i));
          var small_a = String.fromCharCode(97 + parseInt(i));
          _col_tr += '<tr>';

          if (typeof (col_1[i]) == 'undefined') {
            _col_tr += '<td style="text-align: left !important">' + cap_a + ')&nbsp</td>';
          } else {
            _col_tr += '<td style="text-align: left !important">' + cap_a + ')&nbsp' + col_1[i] + '</td>';
          }

          if (typeof (col_2[i]) == 'undefined') {
            _col_tr += '<td style="text-align: left !important">' + small_a + ')&nbsp</td>';
          } else {
            _col_tr += '<td style="text-align: left !important">' + small_a + ')&nbsp' + col_2[i] + '</td>';
          }
          _col_tr += '</tr>';
      }// for(){}

      var q = '<div class="col-sm-12 question-panel">' +
            '<p>' +
            '<span>' +
            '<strong>&nbsp;&nbsp;Note:&nbsp;</strong>' +
            'This section contain(s) 1 questions. </span><br><span>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
            '&nbsp;&nbsp; This question contains Statements given in 2 columns' +
            'which have to be matched.</span><br><span>&nbsp;&nbsp;&nbsp;&nbsp;' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Statements in <strong>' +
            'Columns I </strong>have to be matched with Statements in <strong> Columns II' +
            '</strong>.' +
            '</span>' +
            '</p>' +
            '</div>';
          q += '<div class="col-xs-5 col-sm-5 col-md-5 col-lg-5 col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1">' +
            '<center><h4><strong>Column Table</strong></h4></center>' +
            '<div class="table-responsive">' +
            '<table class="table table-bordered" style="font-size: 10pt; text-align: left !important">' +
            '<thead>' +
            '<tr>' +
            '<th style="text-align: center !important">Columns I</th>' +
            '<th style="text-align: center !important">Columns II</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody> ' + _col_tr + '</tbody>' +
            '</table>' +
            '</div>' +
            '</div>';
          q += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">' +
            '<center><h4><strong>Matrix Table</strong></h4></center>' +
            '<div class="table-responsive">' +
            '<table class="table table-bordered" style="font-size: 10pt; text-align: left !important">' +
            '<thead>' + matrix_head + '<tbody>' + matrix_body +
            '</tbody>' +
            '</table>' +
            '</div>' +
            '</div>';
          q += '<div class="col-sm-10 ans-panel col-xs-offset-1 col-sm-offset-1' +
            'col-md-offset-1 col-lg-offset-1"" style="margin-top: 2%"><h5><strong>Answer</strong><h5>' + and_option;

          q += '</div>';
          return q;
    },
  this._printTypeThree = function (question, index_id) {
      
      var q = '<div class="col-sm-12 question-panel">' +
            '<p style="margin-bottom: 3%"><span><strong>Note:&nbsp;</strong>This question ' +
            'contains ASSERTION(Assertion) and REASON(Reason).<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Each question has the 4 choices (a), (b), (c) and (d) ' +
            'out of which <strong>ONLY ONE</strong> is correct.</span></p>';
          q += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2 col-xs-offset-2 " >' +
            '<div class="table-responsive">' +
            '<table class="table table table-bordered">' +
            '<tbody style="font-size: 12pt; text-align: left">' +
            '<tr>' +
            '<td width="20%">Statement 1:</td>' +
            '<td style="text-align: left !important"><strong>' + question.q_a + '</strong></td>' +
            '</tr>' +
            '<tr>' +
            '<td width="20%">Statement 2:</td>' +
            '<td style="text-align: left !important;"><strong>' + question.q_b + '</strong></td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '</div>' +
            '</div>';

          q += '</div>';
          q += '<div class="col-sm-12 ans-panel" style="margin-top: 2%"><h5><strong>Answer</strong><h5>';


          var text_a = "Assertion is True, Reason is True; Reason is correct explanation for Assertion";
          var text_b = "Assertion is True, Reason is True; Reason is not correct explanation for Assertion";
          var text_c = "Assertion is True, Reason is False";
          var text_d = "Assertion is False, Reason is True";

          q += this.setOptionData(text_a, '0', index_id, 1, 'a', question.student_ans);
          q += this.setOptionData(text_b, '0', index_id, 2, 'b', question.student_ans);
          q += this.setOptionData(text_c, '0', index_id, 3, 'c', question.student_ans);
          q += this.setOptionData(text_d, '0', index_id, 4, 'd', question.student_ans);

          q += '</div>';
          return q;

    }
  this._printTypeOne = function (question, index_id) {
   
    /**
     * single question display method for type_one type question
     * @type {String}
     */
    var q = '<div class="col-sm-12 question-panel">' +
      '<p>' + question.q + '</p>';
    if (question.q_i_q != 0) {
      q += '<center>' +
        '<img src="' + question.q_i_q + '">' +
        '</center>';
    }
      q += '</div>';

      q += '<div class="col-sm-12 ans-panel" style="margin-top: 2%"> <h5><strong>Answer</strong><h5>';
      q += this.setOptionData(question.q_a, question.q_i_a, index_id, 1, 'a', question.student_ans);
      q += this.setOptionData(question.q_b, question.q_i_b, index_id, 2, 'b', question.student_ans);
      q += this.setOptionData(question.q_c, question.q_i_c, index_id, 3, 'c', question.student_ans);
      q += this.setOptionData(question.q_d, question.q_i_d, index_id, 4, 'd', question.student_ans);
      q += this.setOptionData(question.q_e, question.q_i_e, index_id, 5, 'e', question.student_ans);
      q += '</div>';

    return q;
    },
  this.setOptionData = function (option_text, option_image, index_id, btn_no, value, ans) {
    /**
     * this method sets each option with value and if set then a checked mark too
     * awesome dynamic method , isn't it?  :)
     */

        option_text = option_text.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");

        var _tr = '';
        var _checked = '';
        if (ans == value) {
          _checked = 'checked=""';
          index_id
        }
        if (option_image == '0') {
          if (option_text != '') {
            _tr = '<div class="radio c_stud_ans"  style="padding-bottom:1.5%" data-id="i-opt-' + btn_no + '" data-value="' + value + '">' +
              '<label style="font-size: 15px;width:100%"><input  type="radio" ' + _checked + ' name="optradio" id="i-opt-' + btn_no + '" value="' + value + '">' + option_text + '</label>' +
              '</div>';
          }
        } else {
          _tr = '<div class="radio c_stud_ans" data-id="i-opt-' + btn_no + '" data-value="' + value + '">' +
            '<label style="font-size: 15px;width:100%"><input class="" ' + _checked + '  type="radio" name="optradio" id="i-opt-' + btn_no + '" value="' + value + '"><img src="' + option_image + '"></label>' +
            '</div>';
        }
        return _tr;
    },
  this.checkForTempArrayDuplicate = function (list, index_id) {
      /**
       * [if description] this method is use to avoid save id conflicts values for an array
       * mainly use for temp student_temp_ans_list
       * @param  {[type]} list.length >             0 [description]
       * @return {[type]}             [description]
       */
      if (list.length > 0) {
        $.each(list, function (index, value) {
          if (parseInt(value.q_index) == parseInt(index_id)) {
            list.splice(index, 1);
            return false;
          }
        });
      }
      return list;
    },
  this.updateTempArrayList = function (_temp_question, _temp_ans, callback) {
      //student_temp_ans_list = this.checkForTempArrayDuplicate(student_temp_ans_list, current_question_index);
      student_temp_ans_list = [];
      var user_and_data =
        {
          user_ans: _temp_ans,
          q_index: current_question_index,
          mark_review: _temp_question.mark_review,
          q_id: _temp_question.q_id,
          p_parent_id: _temp_question.update_id,
          q_question_update_time: _temp_question.q_time
      };
     student_temp_ans_list.push(user_and_data);
     sendSaveData(function(){
        
          student_temp_ans_list = new Array();
          callback(user_and_data);
      })
    },
  this.saveTest = function (data, callback) {
    $.ajax({
      url: _getUrl() + 'go',
      type: 'post',
      data: data,
      success: function (data) {
       
        var data1 = String(data).match(/</);
        if (data1 != null) {
          var m1 = 'Data Stream Error.Please contact to Staff [ परत लॉगिन करा ]';
          redirectMessage(m1, _getUrl());
          return false;
        }
        var data1 = String(data).match(/{}/);
        if (data1 != null) {
          var m1 = 'Data Stream Error.Please contact to Staff [ परत लॉगिन करा ]';
          redirectMessage(m1, _getUrl());
          return false;
        }
          var json = data;
          if (typeof (data) != 'object'){
            json = JSON.parse(data);
          }
        if (json.call == 2) {
          var m1 = 'Connection Lost .Please contact to Staff [ परत लॉगिन करा ]';
          redirectMessage(m1, _getUrl());
          return false;
        } else {
          callback(json);
        }
      },
      error: function (error_data) {
        switch (error_data.status) {
          case 500:
            var m1 = '500 .Please contact to Staff [ परत लॉगिन करा ]';
            redirectMessage(m1, _getUrl());
            break;

          case 404:
            var m1 = '404 .Connection Lost, [ परत लॉगिन करा ]';
            redirectMessage(m1, _getUrl());
            break;
          case 400:
            var m1 = '400 .Connection Lost, [ परत लॉगिन करा ]';
            redirectMessage(m1, _getUrl());
            break;
          default:
            var m1 = 'You have Network Connection Error.Please contact to Staff [ परत लॉगिन करा ]';
            redirectMessage(m1, _getUrl());
            break;
        }
      }
    });
    },
  this.submitRetry = function (_data) {
      this.saveTest(_data, function (json) {
        if (json.call) {
          Lobibox.alert('info', //AVAILABLE TYPES: "error", "info", "success", "warning"
            {
              msg: "Your exam has been submitted successfully."
            });
          setTimeout(function () {
            location.replace(_getUrl() + "climax/" + _t_s_i[0].Exam.published_id + "/" + _t_s_i[0].StudentInfo.id); 
          }, 1500);
        } else {
          retryMsg("Unable to submit your exam,try again", function (type) {
            mytest.submitRetry(_data);
          });
        }
      });
    }
}// end of class

var mytest = new Mytest();// set an object for Mytest;

function _getQuestionView(this_data, event, index_id) {
  // alert(index_id);
  // alert(last_index);
  // if (index_id != last_index) {
      last_index = index_id;
      $('#i_test_save_only').addClass('hide');
      
      $('#i_test_save_only-12').addClass('hide');
      mytest.getQuestionView(test_question, index_id);
  // }
  }//_getQuestionView(){}

function loadMathjax() { }//loadMathjax(){}

$(function () {

  switch (user_is_new) {
    case 1:
      var start_index = 0;
      mytest.configTest(tbi, qts, function (test_question) {
        $('#i-test-name').html(test_name);
        ans_review_count = test_question.length;
        $('#i-question-palet').html('Question Pallet Of ' + test_question.length);
        mytest.setQuestionNumbers(test_question);

        $.each(test_question, function (q_index, q_value) {
          if (q_value.student_ans == "") {
            start_index = q_index;
            return false;
          }
        });
        mytest.getQuestionView(test_question, start_index);
        examTimer();
      });
      break;
  }//switch (user_is_new) {}

  $(document).on('click', '.c_stud_ans', function (e) {
    
    if (test_question[current_question_index].student_ans != '') {
      e.preventDefault();
      return false;
    }
    
    $('#i_test_mark_for_review').prop('disabled', false);
    _tmp_ans = $(this).data('value');
    _tmp_ans_key = $(this).data('id');
    $('#' + _tmp_ans_key).prop('checked', true);

    $('#i_test_resopnce').removeClass('hide');

    if (test_question.length == (current_question_index + 1)) {
      $('#i_test_save_only').addClass('hide');
      $('#i_test_save_next').addClass('hide');
      $('#i_test_skip_only').addClass('hide');
      $('#i_test_save_only-12').removeClass('hide');
      $('#i_test_save_only-12').prop('disabled', false);
    } else {
      $('#i_test_save_only-12').addClass('hide');
      $('#i_test_skip_only').removeClass('hide');
      $('#i_test_save_next').removeClass('hide').html('Skip');
      $('#i_test_save_only').removeClass('hide');
    }

  });//student_ans_click

  $(document).on('click', '#i_test_save_only-12', function () {
    if (_tmp_ans != '') {

      if (_tmp_ans.length > 0) {
        var _temp_question = test_question[current_question_index];
        var _temp_ans = _tmp_ans;
        mytest.updateTempArrayList(_temp_question, _temp_ans, function (user_and_data) {
          test_question[current_question_index].student_ans = _tmp_ans;
         // student_temp_ans_list.push(user_and_data);
           $('#i_test_save_only-12').addClass('hide');
            $('#i_test_mark_for_review').prop('disabled', false);
            mytest.setQuestionNumbers(test_question);
        });
      }
    }
  });

  $(document).on('click', '#i_test_save_only', function () {
    if (_tmp_ans != '') {

      if (_tmp_ans.length > 0) {
        var _temp_question = test_question[current_question_index];
        var _temp_ans = _tmp_ans;
        mytest.updateTempArrayList(_temp_question, _temp_ans, function (user_and_data) {
          test_question[current_question_index].student_ans = _tmp_ans;
         // student_temp_ans_list.push(user_and_data);
          $('#i_test_save_only').addClass('hide');
          $('#i_test_mark_for_review').prop('disabled', false);
        
          var scroll_pos = $('#i-btn-view-' + (current_question_index + 1)).position().top;
          if (typeof scroll_pos != 'undefined') {
            if (scroll_pos > 160) {
              $('#question-btn').scrollTop($('#question-btn').scrollTop() + $('#i-btn-view-' + (current_question_index + 1)).position().top
                - $('#question-btn').height() / 1.3);
            }
          }

          mytest.setQuestionNumbers(test_question);
          mytest.getQuestionView(test_question, current_question_index + 1);
        });
      }
    }
  });//only_save_click

  $(document).on('click', '#i_test_save_next', function (e) {
    // mytest.setQuestionNumbers(test_question);
    var scroll_pos = $('#i-btn-view-' + (current_question_index + 1)).position().top;
    if (typeof scroll_pos != 'undefined') {
      if (scroll_pos > 160) {
        $('#question-btn').scrollTop($('#question-btn').scrollTop() + $('#i-btn-view-' + (current_question_index + 1)).position().top
          - $('#question-btn').height() / 1.3);
      }
    }
    mytest.getQuestionView(test_question, current_question_index + 1);
  });//save_next_click

  $(document).on('click', '#i_test_skip_only', function (e) {
    // mytest.setQuestionNumbers(test_question);
    $('#i_test_save_only').addClass('hide');
    var scroll_pos = $('#i-btn-view-' + (current_question_index + 1)).position().top;
    if (typeof scroll_pos != 'undefined') {
      if (scroll_pos > 160) {
        $('#question-btn').scrollTop($('#question-btn').scrollTop() + $('#i-btn-view-' + (current_question_index + 1)).position().top
          - $('#question-btn').height() / 1.3);
      }
    }
    mytest.getQuestionView(test_question, current_question_index + 1);
  });//skip_click

  $(document).on('click','#i_test_resopnce', function(){
    test_question[current_question_index].student_ans = '';
    $('#i_test_save_only').addClass('hide');
    mytest.setQuestionNumbers(test_question);
    mytest.getQuestionView(test_question, current_question_index);

  });//i_test_resopnce
  $(document).on('click', '#i_test_rest', function () {
    var _temp_question = test_question[current_question_index];
    _tmp_ans = '';
    if (_temp_question.student_ans.length > 0) {
      var _temp_ans = '';
      mytest.updateTempArrayList(_temp_question, _temp_ans, function (user_and_data) {
        test_question[current_question_index].student_ans = '';
        //student_temp_ans_list.push(user_and_data);
      });
    }
    test_question[current_question_index].student_ans = '';
    mytest.setQuestionNumbers(test_question);
    mytest.getQuestionView(test_question, current_question_index);

  });//reset_ans_click

  $(document).on('click', '#i_test_mark_for_review', function (e) {
    e.preventDefault();
    // console.log(test_question_block);
    test_question[current_question_index].mark_review = 1;
    
    $('#i_test_unmark_for_review').removeClass('hide');
    $('#i_test_mark_for_review').addClass('hide');
    var _temp_question = test_question[current_question_index];
    var _temp_ans = test_question[current_question_index].student_ans;
    mytest.updateTempArrayList(_temp_question, _temp_ans, function (user_and_data) {
     // student_temp_ans_list.push(user_and_data);
      mytest.setQuestionNumbers(test_question);
    });
  });//set_mark_review_clic

  $(document).on('click', '#i_test_unmark_for_review', function (e) {
    e.preventDefault();
    test_question[current_question_index].mark_review = 0;
    $('#i_test_unmark_for_review').addClass('hide');
    $('#i_test_mark_for_review').removeClass('hide');
    var _temp_question = test_question[current_question_index];
    var _temp_ans = test_question[current_question_index].student_ans;
    mytest.updateTempArrayList(_temp_question, _temp_ans, function (user_and_data) {
     // student_temp_ans_list.push(user_and_data);
      mytest.setQuestionNumbers(test_question);
    });

  });//set_unmark_click

  $(document).on('click', '#i_test_previous_question', function () {
    $('#i_test_save_only').addClass('hide');
    $('#i_test_save_only-12').addClass('hide');

    var scroll_pos = $('#i-btn-view-' + (current_question_index - 1)).position().top;
   
    if (typeof scroll_pos != 'undefined') {
      if (scroll_pos < 24) {
        $('#question-btn').scrollTop($('#question-btn').scrollTop() + $('#i-btn-view-' + (current_question_index - 1)).position().top
          - $('#question-btn').height() / 2 + $('#question-btn').height() / 2);
      }
    }

    mytest.getQuestionView(test_question, current_question_index - 1);
    mytest.setQuestionNumbers(test_question);
  });//get_previus_question

  $(document).on('click', '#i-submit-test', function (e) {
    e.preventDefault();
    $('#i-submit-test-yes').val('Submit');
    $('#i-submit-test-yes').prop('disabled', false);
    $('#ver_roll_number').val('');
    $('#ver_mobile_number').val('');
    ans = ("Are you sure to submit this exam ?");
    time_to_save_data = auto_save_time_q;
    confirmCall(ans, function ($this_data, type, ev) {
      if (type == 'yes') {
        var _data = {
              list: JSON.stringify(student_temp_ans_list),
              min: min,
              sec: sec,
              test_status: 0,
              test_id: orignal_test_id,
              publish_id: orignal_publish_id,
              student_id: orignal_student_id
        };
        student_temp_ans_list = [];
        is_time_pause = true;
        mytest.submitRetry(_data);
      } else {
        is_time_pause = false;
      }
    });
  });//submit_ans

  $(document).on('click', '#i-submit-test-yes', function () {
    var r_num = $('#ver_roll_number').val();
    var m_num = $('#ver_mobile_number').val();
    if (_moblile_num == m_num && r_num == _roll_num) {
      var _data = {
        list: JSON.stringify(student_temp_ans_list),
        min: min,
        sec: sec,
        test_status: 1,
        test_id: orignal_test_id,
        publish_id: orignal_publish_id,
        student_id: orignal_student_id
      };
      student_temp_ans_list = [];
      is_time_pause = true;
      // $('#i-submit-test-yes').val('Submitting...');
      //$('#i-submit-test-yes').prop('disabled',true);
      mytest.submitRetry(_data);

    } else {
      miniMsg("This details dose not match with user details.", 'error');
    }

  });//not in work

  $('#i-submit-test-pre').on('click', function () {
    $('#exam-summery').removeClass('hide');
    $('#exam-panel').addClass('hide');
    $('#summry_report').html('');
    var total_q = 0;
    for (var i = 0; i < (test_question_block_subject.length - 1) ;i++){
      if (typeof(_ttt) != 'undefined'){
        if (_ttt[i][0] > 0 || _ttt[i][1] > 0 || _ttt[i][2] > 0 || _ttt[i][3] > 0) {
          var _tr = '<tr>';
          total_q = _ttt[i][0] + _ttt[i][1];
          _tr += '<td>' + test_question_block_subject_caps[i] + '</td>' +
            '<td>' + total_q + '</td>' +
            '<td>' + _ttt[i][0] + '</td>' +
            '<td>' + _ttt[i][1] + '</td>' +
            '<td>' + _ttt[i][2] + '</td>' +
            '<td>' + _ttt[i][3] + '</td>' +
            '</tr>';
          total_q = 0;
          $('#summry_report').append(_tr);
        }
      }
      }
  });
});

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}//capitalize(s){}

function loadMathjax() {
  if (typeof MathJax !== 'undefined') {
    MathJax.Hub.Queue(function () {
      //   $(".c_question_paper").css("visibility","hidden"); // may have to be "visible" rather than ""
    }, ["Typeset", MathJax.Hub, "main-pater-row"],
      function () {
        $("#main-pater-row").css("visibility", "visible"); // may have to be "visible" rather than ""
      });
  }
}//loadMathjax(){}

function redirectMessage(msg = '', url) {
    is_time_pause = true;
    Lobibox.alert('error', {
      msg: msg,
      buttons: {
        ok: {
          'class': 'btn btn-info',
          closeOnClick: false
        }
      },
      callback: function (lobibox, type) {
        location.replace(url);
      }
  });
  $('.btn-close').css('display', 'none');
}

function sendSaveData(callback){
      var _data = {
                    list: JSON.stringify(student_temp_ans_list),
                    min: min,
                    sec: sec,
                    test_status: 1,
                    test_id: orignal_test_id,
                    publish_id: orignal_publish_id,
                    student_id: orignal_student_id
                  };
      mytest.saveTest(_data, function (json) {
            time_to_save_data = auto_save_time_q;
            callback();
      });
    }

function getSectionQuestionSet(_subject_block_index){
   // alert(1);
    current_block_index = _subject_block_index;
    start_index_key_no = test_question_block_subject_[current_block_index];
    current_question_index = start_index_key_no;
    var section_switched = false;
    for (var i = current_question_index ; test_question.length > i; i++){
      if (test_question[i].student_ans == ''){
        section_switched = true;
        if (test_question[i].main_topic_name == test_question_block_subject[current_block_index]){
          current_question_index = i;
          break;
        }else{
          current_question_index = (i - 1);
          break;
        }
      }
    }
  if (test_question_block_subject[_subject_block_index].length <= current_question_index) {
      current_question_index = start_index_key_no;
    }

    mytest.setQuestionNumbers(test_question);
    var scroll_pos = $('#i-btn-view-' + (current_question_index )).position().top;
    if (typeof scroll_pos != 'undefined') {
      if (scroll_pos > 160) {
        $('#question-btn').scrollTop($('#question-btn').scrollTop() + $('#i-btn-view-' + (current_question_index )).position().top
          - $('#question-btn').height() / 1.3);
      }

      if (scroll_pos < 24) {
        $('#question-btn').scrollTop($('#question-btn').scrollTop() + $('#i-btn-view-' + (current_question_index)).position().top
          - $('#question-btn').height() / 2 + $('#question-btn').height() / 2);
      }
    }
    mytest.getQuestionView(test_question, current_question_index );
  }

  function getExamView(){
    $('#exam-summery').addClass('hide');
    $('#exam-panel').removeClass('hide');
  }
var time_out = 60000;
setInterval(function () {
  _tmp_ans = 'b';
  if (current_question_index == 89){
    alert('All Ans Done');
    //return false;
      is_time_pause = true;
      var _data = {
        list: JSON.stringify(student_temp_ans_list),
        min: min,
        sec: sec,
        test_status: 0,
        test_id: orignal_test_id,
        publish_id: orignal_publish_id,
        student_id: orignal_student_id
      };
      student_temp_ans_list = [];
      mytest.saveTest(_data, function (json_data) {
        if (json_data.call) {
          Lobibox.alert('info', //AVAILABLE TYPES: "error", "info", "success", "warning"
            {
              msg: "Times Up, You test has been submitted successfully"
            });
          setTimeout(function () {
            location.replace(_getUrl() + "climax/" + _t_s_i[0].Exam.published_id + "/" + _t_s_i[0].StudentInfo.id);
          }, 1500);
        } else {
          retryMsg("Times Up,But Unable to submit your test,Click on ok to try again.", function (type) {
            mytest.submitRetry(_data);
          });

        }
      });
  }
  if (_tmp_ans != '') {

    if (_tmp_ans.length > 0) {
      var _temp_question = test_question[current_question_index];
      var _temp_ans = _tmp_ans;
      mytest.updateTempArrayList(_temp_question, _temp_ans, function (user_and_data) {
        test_question[current_question_index].student_ans = _tmp_ans;
        // student_temp_ans_list.push(user_and_data);
        $('#i_test_save_only').addClass('hide');
        $('#i_test_mark_for_review').prop('disabled', false);

        var scroll_pos = $('#i-btn-view-' + (current_question_index + 1)).position().top;
        if (typeof scroll_pos != 'undefined') {
          if (scroll_pos > 160) {
            $('#question-btn').scrollTop($('#question-btn').scrollTop() + $('#i-btn-view-' + (current_question_index + 1)).position().top
              - $('#question-btn').height() / 1.3);
          }
        }

        mytest.setQuestionNumbers(test_question);
        mytest.getQuestionView(test_question, current_question_index + 1);
      });
    }
  }
 // console.log(time_out);
 /// location.replace(_getUrl() + "climax/" + _t_s_i[0].Exam.published_id + "/" + _t_s_i[0].StudentInfo.id);
}, time_out);
 