// Dummy student data with Indian details
const dummyStudentData = {
    full_name: 'Amit Kumar',
    sl_application_number: 'SL123456789',
    id: 'amit_kumar_123',
    dob: '15-08-2000', // Date of birth in dd-MM-yyyy format
    sl_post: 'Mathematics', // Subject/Post
    exam_date: '01-12-2024', // Exam date in dd-MM-yyyy format
    sl_batch_no: 'BATCH001',
};

const dummyAttendanceCount = [
    {
        total_students: 100,
        present_count: 50,
        attendance_not_marked: 50,
    },
];

const dummyPcDetails = {
    lab: 'labTest',
    pc_no: 'Test pc no',
};

export { dummyStudentData, dummyAttendanceCount, dummyPcDetails };
