$(document).ready(function() {
  $("#student_list").DataTable();
  $("#downloadStudentBatchWise").on("click", function() {
    if ($("#batch_list").val() === "0") {
      alert("Please Select a Batch");
      return false;
    }
    prompt("Enter Authentication Password", "*******", "password", function(
      value
    ) {
      if (parseInt(value, 10) !== cc) {
        alert("Invalid Password !!!!");
        return false;
      }
      addLoading();
      $.ajax({
        url: getUrl() + "download-student",
        type: "POST",
        data: {
          batch_list: $("#batch_list").val(),
          center_code: $("#center_code").val()
        },
        success: function(data) {
          removeLoading();
          if (data.call == 1) {
            getBatchStudentList();
            alert("Student List Downloaded Successfully.");
            return false;
          }
          if (data.call == 0) {
            alert("Internal Query Error.");
            return false;
          }
          if (data.call == 5) {
            alert("Student List Not Found.");
          }
          if (data.call == 999) {
            alert("Master Sever Not Found");
          }
        },
        error: function(error) {
          removeLoading();
          alert("Server Error");
          console.log(error);
        }
      });
    });
  });
  $("#refreshList").click(function() {
    getBatchStudentList();
  });

  $("#batch_list").on("change", function() {
    getBatchStudentList();
    // $('#student_list').DataTable( {
    //     "processing": true,
    //     "serverSide": true,
    //     "ajax": {
    //         "url": getUrl()+"get-batch-student-list",
    //         "type": "POST",
    //         "data":{
    //                 batch_list:batch_list,
    //                 center_code:center_code
    //         }
    //     },
    //     "columns": [
    //         { "data": "student_name" },
    //         { "data": "roll_number" },
    //         { "data": "contact_number" },
    //         { "data": "dob" },
    //         { "data": "password" },
    //         { "data": "application_number" },

    //     ]
    // } );
  });
});
var stud_count_summery = {
  p: 0,
  a: 0,
  alloted: 0
};
function getBatchStudentList() {
  addLoading();
  $.ajax({
    url: getUrl() + "get-batch-student-list",
    type: "POST",
    data: {
      batch_list: $("#batch_list").val(),
      center_code: $("#center_code").val()
    },
    success: function(data) {
      var stud_count = data.data.length;
      if (stud_count > 0) {
        stud_count_summery.p = data.data.filter(function(data) {
          return data.p_state == 1;
        }).length;

        stud_count_summery.a = data.data.filter(function(data) {
          return data.p_state == 0;
        }).length;

        stud_count_summery.alloted = data.data.filter(function(data) {
          return data.p_state == 2;
        }).length;

        $("#state_count").html(
          '<table class="table table-striped table-bordered table-hover">' +
            "<thead>" +
            "<tr>" +
            '<th width="10%" class="text-danger ns_exam">Alloted :- ' +
            stud_count_summery.alloted +
            "</th>" +
            '<th width="10%" class="text-primary p_exam">Absent :- ' +
            stud_count_summery.a +
            "</th>" +
            '<th width="10%" class="text-success c_exam"> Present:- ' +
            stud_count_summery.p +
            "</th>" +
            "</tr>" +
            "</thead>" +
            "</table>"
        );

        $("#stud_count").html("has " + stud_count + " Students");
      } else {
        stud_count_summery = {
          p: 0,
          a: 0,
          alloted: 0
        };
        $("#state_count").html("");
        $("#stud_count").html("");
      }
      table.destroy();
      table = $("#student_list").DataTable({
        processing: true,
        stateSave: true,
        bDestroy: true,
        data: data.data,
        columns: [
          { data: "roll_number" },
          { data: "student_name" },
          { data: "application_number" },
          { data: "dob" },
          { data: "password" },
          { data: "contact_number" },
          { data: "student_status" }
        ]
      });
      removeLoading();
    },
    error: function(error) {
      console.log(error);
      removeLoading();
      alert("Server Error... Check console");
    }
  });

  var table = $("#student_list").DataTable();
}
