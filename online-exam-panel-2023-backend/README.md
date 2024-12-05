"# online-exam-panel-2023"

# .

### table = tm_publish_test_list

[This table stores the list of published exams]
-is_test_loaded => start session of the exam
-is_start_exam => exam started
-is_absent_mark => exam students abset mark status
-is_test_generated => end slot & backup (all complete)
-ptl_is_test_done =>
=========================================================================

### table = utr_unlock_list

[This table stores the list of studnets who has been unlocked]
-ul_student_id => student id (roll no)
-ul_unlock_cause => reason for unlock
-ul_time_stamp => when candidate is unlocked (date and time)
-mac_id => when candidate is unlocked the mac id of old pc
=========================================================================

### utr_student_attendance

[This table stores the attendance of student when candidate sign in with his login details]
-student_id => student id (roll no)
=========================================================================

### tn_students_list

[This table stores the students all students data for the exam]
id => student roll no
sl_f_name => first name
sl_m_name => middle name
sl_l_name => last name
sl_image => student image name
sl_sign => student sign name
sl_email => student email
sl_father_name =>fathers name
sl_mother_name => mothers name
sl_address => address of student
sl_mobile_number_parents => parents mobile number
sl_tenth_marks => 10th marks
sl_contact_number => student contact number
sl_class => '-'
sl_roll_number => student roll no
sl_subject => '-'
sl_stream => '-'
sl_addmit_type => '-'
sl_time => time stamp
sl_date => date
sl_time_stamp => date and time
sl_added_by_login_id =>
sl_is_live =>
sl_date_of_birth => birth date
sl_school_name => school name
sl_catagory => category of student
sl_application_number => application number (form number)
sl_is_physical_handicap => handicap status
sl_is_physical_handicap_desc => handicap description
sl_post => post name
sl_center_code => center_code
sl_batch_no => batch no
sl_exam_date => exam_date
sl_password => password
sl_present_status => 0 = 'attendance not marked' , 1= 'attendance marked present', 2 = 'alloted but not market'
sl_cam_image => image captured at the time of attendance
