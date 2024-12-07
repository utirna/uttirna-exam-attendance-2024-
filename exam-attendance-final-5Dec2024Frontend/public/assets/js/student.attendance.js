$(function(){
    $('#getStudentInfo').on('click',function(){
        $.post(
                getUrl()+'single-student-details',
                {
                    applicant_id:$('#applicant_id').val()
                },
                function(data,status){
                    if(status == 'success'){
                        var json_data = data;
                        if(json_data.call == 1){
                            json_data = json_data.data[0]
                            $('#student_name').html(json_data.student_name);
                            $('#student_bob').html(json_data.dob);
                            $('#student_appeared_for').html(json_data.stream);
                            $('#applicant_id').prop('disabled',true);
                            $('#getStudentInfo').addClass('hide');
                            $('#btn-to-save').removeClass('hide');
                            $('#btn-to-reset').removeClass('hide');
                            
                        }else{
                            alert('No details Found For This Application Id');
                        }
                    }
                    console.log(data);
                    console.log(status);
                });
    });

    $('#btn-to-save').on('click',function(){
        $.post(
                getUrl()+'mark-student-attendace',
                {
                    applicant_id:$('#applicant_id').val()
                },
                function(data,status){
                    if(status == 'success'){
                        var json_data = data;
                        if(json_data.call == 1){
                            alert('Done !!!');
                            resetData();
                        }else{
                            alert('Fail To Marks Attendance Try Again');
                        }
                    }
                });
    });

    $('#btn-to-reset').on('click',function(){
        resetData();
    });
    
});

function resetData(){
    $('#student_name').html('');
    $('#student_bob').html('');
    $('#student_appeared_for').html('');
    $('#applicant_id').val('').prop('disabled',false);
    $('#getStudentInfo').removeClass('hide');
    $('#btn-to-save').addClass('hide');
    $('#btn-to-reset').addClass('hide');
}