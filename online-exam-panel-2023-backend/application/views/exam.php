<?php
   if (!isset($_SESSION['exam'])) {
      header('location:'.base_url().'starter');
    }
 ?>

<!DOCTYPE html>
<html lang="en">
<head>
  <title>Test Viewer</title>

  <!-- META TAGS START ================================================================ -->
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Cache-control" content="no-cache">
  <meta http-equiv="Expires" content="-1">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
  <style type="text/css">
    .set_profile_size{
      max-height: 70px;
      max-width: 70px;
      min-width: 70px;
      min-height: 70px;
    }
 
   <?php 
        include 'bootstrap/css/font-awesome.min.css';
        include 'bootstrap/css/test.css';
        include 'bootstrap/css/bootstrap.min.css';
     ?>
      </style>
</head>
   <?php if (isBrowserIE()): ?>
       <!--[if gt IE 8]>
      <script src="<?=base_url('plugins/jQuery/jQuery-2.1.4.min.js')?>"></script>
  <![endif]-->

  <!--[if lt IE 9]>
      <script type='text/javascript' src="<?=base_url('dist/js/html5shiv.min.js')?>">
      </script>
      <script type='text/javascript' src="<?=base_url('dist/js/respond.min.js')?>">
      </script>
      <script type='text/javascript' src="<?=base_url('plugins/jQuery/jquery-1.11.2.min.js')?>"></script> 
   <![endif]-->
  <?php else: ?>
    <script src="<?=base_url('plugins/jQuery/jQuery-2.1.4.min.js')?>"></script>
  <?php endif ?>
  <style type="text/css">
    .container
      {
          display:table;
          width: 100%;
      }
      .row
      {
          height: 100%;
          display: table-row;
      }
      .col-sm-*
      {
          display: table-cell;
      }
      .col-lg-*
      {
          display: table-cell;
      }
      .col-md-*
      {
          display: table-cell;
      }
      .col-sm-*
      {
          display: table-cell;
      }

      /* The Modal (background) */
      .modal {
          display: none; /* Hidden by default */
          position: fixed; /* Stay in place */
          z-index: 1; /* Sit on top */
          left: 0;
          top: 0;
          width: 100%; /* Full width */
          height: 100%; /* Full height */
          overflow: auto; /* Enable scroll if needed */
          background-color: rgb(1,1,1); /* Fallback color */
          -moz-opacity: 0.90;
          opacity:.90;
          filter: alpha(opacity=90);
      }

      /* Modal Content/Box */
      .modal-content {
          background-color: #fefefe;
          margin: 15% auto; /* 15% from the top and centered */
          padding: 20px;
          border: 1px solid #888;
          width: 30%; /* Could be more or less, depending on screen size */
      }

      #close-yes{
        color: white;
        background-color: green;
      }

      #close-no{
        color: white;
        background-color: red;
      }
  </style>


<body class="welcome" oncontextmenu="return false;" ondragstart="return false;" ondrop="return false;">
  <div class="container-fluid">
    <!-- top header -->
    <div class="row bg-primary" >
      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
        <h3 id="i-test-name">-</h3>
      </div>
    
      <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 pull-right">
        <h3 class="pull-right"><i class="fa fa-clock-o fa-lg"></i>&nbsp;<span id='i-test-timer'>00:00</span>&nbsp;&nbsp;
          <button type="button" name="button" class="btn btn-success " id="i-submit-test" ><i class="fa fa-cloud-upload"></i> &nbsp;<strong>END EXAM</strong></button>
        </h3>
      </div>
    </div>
    <!-- top header ends-->
    <!-- question set -->
    <div class="row test-area">
      <div class="col-xs-9 col-sm-9 col-md-9 col-lg-9">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 question-panel-1" style="min-width: 800px;max-width: 800px">
            <div style="display: inline;margin-top: 100px;">
             <span style="padding: 10px;" class="label  btn-black btn-sm " >
              <strong id="i-question-number">-</strong>
             </span>
             </div>
             <strong style="text-align:center;margin-left: 38%" id="i_test_type_text"></strong>
             <span class="btn btn-gray pull-right btn-sm" style="margin-right: 2px;" onclick="setFont(this,event,'add')">
              A+
              <!-- strong id="i-ask-in"></strong> -->
            </span>
            <span class="btn btn-gray pull-right btn-sm" style="margin-right: 2px;" onclick="setFont(this,event,'0')">
              A
              <!-- strong id="i-ask-in"></strong> -->
            </span>
            <span class="btn btn-gray pull-right btn-sm" style="margin-right: 2px;" onclick="setFont(this,event,'sub')">
              A-
              <!-- strong id="i-ask-in"></strong> -->
            </span>
          </div>
        </div>
        <div class="row">
          <div class="main-pater-row" id="main-pater-row" style="min-width: 800px;max-width: 800px">

            </div>
          </div>

        <div class="row"> 
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="footer" style="min-width: 800px;max-width: 800px">
            
            <button type="button" class="btn btn-primary btn-sm" name="button" id="i_test_previous_question"><i class="fa fa-backward"></i> &nbsp;&nbsp;Previous</button>
           
            <button type="button" class="btn btn-danger btn-sm hide" name="button" id="i_test_unmark_for_review"><i class="fa fa-history"></i> &nbsp;Un-mark Review</button>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 pull-right">

            <button type="button" class="btn btn-primary  btn-sm pull-right" name="button" id="i_test_save_next" style="margin-left: 10px">Next&nbsp;&nbsp;<i class="fa fa-forward"></i></button>
            <button type="button" class="btn btn-success  btn-sm hide  pull-right" name="button" id="i_test_save_only"> <i class="fa fa-save"></i>&nbsp;&nbsp;Save & Next</button>&nbsp;&nbsp;
            <button type="button" class="btn btn-success  btn-sm hide  pull-right" name="button" id="i_test_save_only-12"> <i class="fa fa-save"></i>&nbsp;&nbsp;Save</button>&nbsp;&nbsp;
           </div>
          </div>
        </div>
      </div>
      <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 test-other-part">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 profile-panel" >
            <div class="row">
              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 pull-left">
               
                 <?php if (isset($_SESSION['exam']['student_info']['sl_image'])): ?>
                         <?php 
                              $student_image =  $_SESSION['exam']['student_info']['sl_image'];
                          ?>
                          <?php if (isset($student_image)): ?>
                           <?php if ($student_image): ?>
                             <img src ="<?=base_url()?><?=$student_image?>" class="set_profile_size" alt = "Pic">
                          <?php else: ?>
                            <img src = "<?=base_url()?>dist/img/user2-160x160.jpg" class="set_profile_size" alt = "Pic">
                              <?php endif ?> 
                            <?php else: ?>

                               <img src = "<?=base_url()?>dist/img/user2-160x160.jpg" class="set_profile_size" alt = "Pic">
                         <?php endif ?>
                      <?php else: ?>
                        
                           <img src = "<?=base_url()?>dist/img/user2-160x160.jpg" class="set_profile_size" alt = "Pic">
                      <?php endif ?>
            
              </div>
            <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8" style="margin-left: 10px">
      
                 
              <span><?=ucfirst($_SESSION['exam']['student_info']['sl_f_name'])?>&nbsp;<?=ucfirst(substr($_SESSION['exam']['student_info']['sl_m_name'],0,1))?>.&nbsp;<?=ucfirst($_SESSION['exam']['student_info']['sl_l_name'])?> </span></span><br>
                 
            <strong style="display: inline;">Roll No:</strong>
              <span><?=ucfirst($_SESSION['exam']['student_info']['sl_roll_number'])?></span><br>
            <strong style="display: inline;">Applied For:</strong>
             <span><?=$_SESSION['exam']['student_info']['sl_stream']?></span><br>
               
            </div>
          </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 question-numbers">
            <p style="text-align:center;margin-top:0.5%"><strong id="i-question-palet"></strong></p>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 question-btn" id="question-btn">
              
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 info-buttons">
            <center>
            <h3 style="display: inline;"><span class="label label-success to-right" id="q-ans-done"></span></h3>
            <h3 style="display: inline;"><span class="label label-default" id="q-not-done"></span></h3>
            </center>
          </div>
        </div>
      </div>
     <!-- Trigger/Open The Modal -->
<!-- The Modal -->
<div id="myModal" class="modal">
  <div class="modal-content">
   
  </div>
</div>

  <script type="text/javascript">
       var _t_s_i = <?=$test_session_info?>;//test_sesion_info 
       var tbi = <?=$test_basic_info?>;//test_basic_info
       var qts = <?=json_encode($question_paper)?>;//question for test
       var user_is_new = 1;
        var _min =50;
       var _sec = <?=$get_time[0]->_sec?>;
       var _moblile_num = "<?=$_SESSION['exam']['student_info']['sl_contact_number']?>";
       var _roll_num = "<?=$_SESSION['exam']['student_info']['sl_roll_number']?>";
       function _getUrl(){return '<?=base_url()?>';}
    <?php 
      include 'dist/js/atob.js';
      include 'dist/js/new.test.js';
      include 'dist/js/default.test.settings.js';
    ?>

  var is_time_pause = false;

  $question_pallet_height = $(document).height()/1.6;
  $question_btn_pallet_height =  $(document).height()/2.2;
  $('#main-pater-row').height($question_pallet_height);
  $('.question-btn').height($question_btn_pallet_height);
  var defult_font = 12;
  function setFont(_this,event,type){
    switch (type) {
      case 'add':
        if (defult_font < 20) {
          defult_font+=2;
        }
        break;
      case 'sub':
        if (defult_font > 12) {
            defult_font-=2;
          }
        break;
      default:
          defult_font = 12;
        break;
    }
        $('#main-pater-row p').css('font-size',defult_font+'pt');
        $('#main-pater-row h5').css('font-size',defult_font+'pt');
        $('#main-pater-row label').css('font-size',defult_font+'pt');
  }

  </script>
</body>
</html>
