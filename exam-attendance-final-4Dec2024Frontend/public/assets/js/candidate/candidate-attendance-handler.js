import { dummyAttendanceCount, dummyPcDetails, dummyStudentData } from '../common/data.js';
import { showBsModal } from '../alertjs.js';
import { backendUrl } from '../common/establish-connection-handler.js';
import { CROP_HEIGHT, CROP_WIDTH, isDevMode, printDev } from '../common/project-mode-handler.js';
import { base64ToBlob } from '../common/utility-handler.js';
import { Toast } from '../common/toasts.js';

// Inside inside public both
let relativeImagePath = `/`;
let relativeSignPath = `/`;

const contentSection = document.querySelectorAll('.content-section');

// Webcam handler

const snapshotDiv = document.getElementById('snapshot-div');
const video = document.getElementById('video');
const cropPreviewCanvas = document.getElementById('crop-preview');
const croppedImageElement = document.getElementById('cropped-image');
// const captureButton = document.getElementById('capture');
const cropPreviewCtx = cropPreviewCanvas.getContext('2d');
// By default focus on input
const searchCandidateInput = document.getElementById('student-id');

let snapshotBlob = null;

// Define the cropping size (e.g., 200x200 pixels)
// w: h = 5 : 6 ratio
// width = 180px
// height = 216px
const cropWidth = CROP_WIDTH;
const cropHeight = CROP_HEIGHT;

// Access the user's camera
navigator.mediaDevices
    .getUserMedia({ video: true }) // Requests access to the user's camera with video enabled
    .then((stream) => {
        // Once access is granted, set the camera stream as the source for the video element
        video.srcObject = stream;

        // Add an event listener to the video element to execute when its metadata is loaded
        video.addEventListener('loadedmetadata', () => {
            // Set the dimensions of the crop preview canvas to match the cropping dimensions
            cropPreviewCanvas.width = cropWidth;
            cropPreviewCanvas.height = cropHeight;

            // Start the cropping process for the live video feed
            cropLiveVideo();
        });
    })
    .catch((err) => {
        // Log an error if accessing the camera fails
        console.error('Error accessing the camera:', err);
    });

// Function to crop the live video feed
function cropLiveVideo() {
    /**
     * Calculate the coordinates for cropping the video feed.
     * `cropX` and `cropY` are the starting points for the crop, centered horizontally and vertically.
     * - `cropX`: Horizontal offset to start cropping, calculated as the center position relative to the video width.
     * - `cropY`: Vertical offset to start cropping, calculated as the center position relative to the video height.
     */
    const cropX = (video.videoWidth - cropWidth) / 2; // Center horizontally
    const cropY = (video.videoHeight - cropHeight) / 2; // Center vertically

    /**
     * Function to draw the cropped portion of the live video feed onto the preview canvas.
     * Uses the `requestAnimationFrame` loop for smooth, continuous updates of the cropped feed.
     */
    function drawCrop() {
        // Clear the previous frame from the canvas
        cropPreviewCtx.clearRect(0, 0, cropWidth, cropHeight);

        // Draw the cropped portion of the video onto the canvas
        cropPreviewCtx.drawImage(
            video, // Source video element
            cropX, // Starting x-coordinate of the crop in the video
            cropY, // Starting y-coordinate of the crop in the video
            cropWidth, // Width of the crop
            cropHeight, // Height of the crop
            0, // x-coordinate on the canvas where the crop will be drawn
            0, // y-coordinate on the canvas where the crop will be drawn
            cropWidth, // Width of the crop on the canvas
            cropHeight // Height of the crop on the canvas
        );

        // Call this function on the next animation frame for continuous cropping
        requestAnimationFrame(drawCrop);
    }

    // Start the cropping loop by invoking `drawCrop` for the first time
    drawCrop();
}

function resetData() {
    // video.style.display = 'block';
    cropPreviewCanvas.style.display = 'block';
    snapshotDiv.style.display = 'none';
    snapshotBlob = undefined;
}

const takeSnapBtn = document.getElementById('take-snap-btn');
takeSnapBtn.addEventListener('click', () => {
    // Get the cropped image as a data URL
    const croppedImageDataURL = cropPreviewCanvas.toDataURL('image/png');
    // Set the captured cropped image as the source of the <img> element
    croppedImageElement.src = croppedImageDataURL;
    cropPreviewCanvas.style.display = 'none';
    snapshotDiv.style.display = 'block';
    snapshotBlob = base64ToBlob(croppedImageDataURL);
});

const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', resetData);

const showHideButtons = ({ show }) => {
    const cameraButtonsContainer = document.querySelector('.camera-buttons');
    const statusButtonsContainer = document.querySelector('.status-buttons');
    const labPcStatusContainer = document.getElementById('lab-pc-status-container');

    cameraButtonsContainer.style.display = show ? 'flex' : 'none';
    statusButtonsContainer.style.display = show ? 'flex' : 'none';

    // labPcStatusContainer.style.display = show ? 'none' : 'flex';
};

const updateStudentDetailsInView = ({
    student = null,
    attendenceCount,
    batchAttendanceCount,
    pcDetails,
    wasMarkedPresentJust = false,
}) => {
    try {
        // -==============================================================================
        // FOR OVERALL ATTENDANCE
        const totalAllotedElement = document.getElementById('total-alloted');
        const totalPresentElement = document.getElementById('total-present');
        const totalAbsentElement = document.getElementById('total-absent');

        totalAllotedElement.innerText = attendenceCount?.total_students;
        totalPresentElement.innerText = attendenceCount?.present_count;
        totalAbsentElement.innerText = attendenceCount?.attendance_not_marked;

        //-=============================================================================
        // FOR BATCH ATTENDANCE

        const batchTotalAllotedElement = document.getElementById('batch-alloted');
        const batchTotalPresentElement = document.getElementById('batch-present');
        const batchTotalAbsentElement = document.getElementById('batch-absent');

        batchTotalAllotedElement.innerText = batchAttendanceCount?.total_students || 0;
        batchTotalPresentElement.innerText = batchAttendanceCount?.present_count || 0;
        batchTotalAbsentElement.innerText = batchAttendanceCount?.attendance_not_marked || 0;

        // const labPcContainer = document.querySelectorAll(".lab-pc-container");

        // labPcContainer.forEach(
        //   (_infoContainer) => (_infoContainer.style.display = "flex")
        // );

        if (wasMarkedPresentJust || student?.sl_present_status == 1) {
            document.getElementById('lab-number').innerText = pcDetails?.lab;
            document.getElementById('pc-number').innerText = `C${pcDetails?.pc_no}`;

            // Once detials are marked present,
            // Hide snapshot buttons and othe below buttons
            showHideButtons({ show: false });
        }
    } catch (err) {
        console.log(`Error while updating student details in view : ${err}`);
    }
};

const handleMarkAttendence = async (sendData) => {
    try {
        // console.log("getin ackecn url = ", backendUrl);
        // console.log('marking presnt : ', sendData);
        const _url = `${backendUrl}/api/attendence/v1/mark-present`;
        // console.log(_url);
        const _response = await fetch(_url, {
            method: 'POST',
            body: sendData,
        });

        const { call, message, data } = await _response.json();
        const { attendenceCount, batchAttendanceCount, pcDetails } = data;
        if (call == 1) {
            Toast.success(message);
            updateStudentDetailsInView({
                pcDetails,
                attendenceCount: attendenceCount?.[0] ?? {},
                batchAttendanceCount: batchAttendanceCount?.[0] ?? {},
                wasMarkedPresentJust: true,
            });
        }

        if (call == 0) {
            Toast.success(message);
            updateStudentDetailsInView({
                attendenceCount: attendenceCount[0],
                pcDetails,
                batchAttendanceCount: batchAttendanceCount[0],
                wasMarkedPresentJust: true,
            });
        }
    } catch (err) {
        console.log(`Error while marking the attendence : ${err}`);
        Toast.error(err?.message);
    }
};

const handleRejection = async (rejectData) => {
    try {
    } catch (err) {
        console.log(`Error while rejecting : ${err}`);
    }
};

function handleSendImageToServer() {
    if (!snapshotBlob) {
        Toast.warning('Please capture candidate photo');
        return;
    }

    const sendData = new FormData();

    const id = +markPresentBtn.getAttribute('data-studentId');

    sendData.set('id', id);
    sendData.set('student_photo', snapshotBlob);
    handleMarkAttendence(sendData);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            handleSendImageToServer();
        }
    }
});

const markPresentBtn = document.getElementById('mark-present-btn');
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'mark-present-btn') {
        e.preventDefault();
        handleSendImageToServer();
    }

    if (e.target && e.target.id === 'reject-btn') {
        e.preventDefault();
        const data = {};
        handleMarkAttendence(data);
    }

    if (e.target && e.target.id === 'reset-page-btn') {
        e.preventDefault();
        document.querySelectorAll('.toggle-content')?.forEach((element) => {
            element.style.display = 'none';
        });
        document.getElementById('initial-text').style.display = 'block';
    }
});

/**
 * Function: focusOnSearchInput
 * Description: This function should contain the logic to set focus on the
 * desired input field (e.g., a search bar). Ensure this function is implemented.
 */

export function focusOnSearchInput() {
    if (searchCandidateInput) {
        searchCandidateInput.focus();
    } else {
        console.warn('Search input not found!');
    }
}

/**
 * Adds an event listener to the document that listens for the combination of
 * Ctrl + K (or Command + K on macOS) to trigger a specific action.
 *
 * When the combination is detected:
 * - Prevents the default behavior of the browser (e.g., opening the browser search in some cases).
 * - Calls the `focusOnSearchInput` function to focus on a specific input element (e.g., a search bar).
 */
document.addEventListener('keydown', function (e) {
    // Check if either Ctrl key (Windows/Linux) or Command key (macOS) is pressed
    if ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() == 'k') {
        e.preventDefault(); // Prevent the default behavior (e.g., browser search box)
        focusOnSearchInput(); // Call the function to focus on the search input
    }
});

const webcamImageRelativePath = '/pics/_webcam_images/';

// SHOW THE STUDENT DATA PROPERLY IN THE VIEW
function showStudentData(_student) {
    document.getElementById('initial-text').style.display = 'none';
    document.querySelectorAll('.toggle-content').forEach((element) => {
        element.style.display = 'block';
    });

    let student = _student;

    const idValue = [
        {
            id: 'name',
            val: student.full_name || '-',
        },
        {
            id: 'application-number',
            val: student.sl_application_number || '-',
        },
        {
            id: 'username',
            val: student.id || '-',
        },
        {
            id: 'dob',
            val: student.dob || '-',
        },
        {
            id: 'post',
            val: student.sl_post || '-',
        },
        {
            id: 'exam-date',
            val: student.exam_date || '-',
        },
        {
            id: 'batch',
            val: student.sl_batch_no || '-',
        },
    ];

    idValue.forEach(({ id, val }) => {
        document.getElementById(id).innerHTML = val;
    });

    markPresentBtn.setAttribute('data-studentId', student.id);

    const labPcStatusContainer = document.getElementById('lab-pc-status-container');

    resetData();

    showHideButtons({ show: student.sl_present_status == 2 });

    const studentImageAbsolutePath = `${backendUrl}${relativeImagePath}/${student.sl_image}`;
    const studentSignAbsolutePath = `${backendUrl}${relativeSignPath}/${student.sl_sign}`;

    document.getElementById('student-image').src = studentImageAbsolutePath;
    document.getElementById('student-sign').src = studentSignAbsolutePath;

    // Toast.success(`Attendance Status: ${student.sl_present_status}`);

    if (student.sl_present_status == 1) {
        const webcamImageAbsPath = `${backendUrl}/${webcamImageRelativePath}${student.sl_cam_image}`;

        croppedImageElement.src = webcamImageAbsPath;

        cropPreviewCanvas.style.display = 'none';
        snapshotDiv.style.display = 'block';
        snapshotBlob = undefined;
    } else {
        resetData();
    }
}

// ==============================================================================//
//HANDLING SEARCH STUDENT FUNCTIONALITY PART
// ==============================================================================//

const loaderContainerDiv = document.getElementById('btn-loader-container');

const handleFetchStudentDetails = async (id) => {
    try {
        if (isDevMode()) {
            showStudentData(dummyStudentData);
            // loaderContainerDiv.style.display = 'block';

            updateStudentDetailsInView({
                dummyStudentData,
                attendenceCount: dummyAttendanceCount?.[0] ?? {},
                batchAttendanceCount:
                    dummyAttendanceCount && dummyAttendanceCount.length
                        ? dummyAttendanceCount[0]
                        : {},
                pcDetails:
                    dummyPcDetails && dummyPcDetails.length > 0 ? dummyPcDetails[0] : undefined,
            });
            showHideButtons({ show: true });
            return;
        }

        loaderContainerDiv.style.display = 'block';
        document.getElementById('initial-text').style.display = 'none';
        // document.querySelectorAll(".toggle-content").forEach((element) => {
        //   element.style.display = "none";
        // });

        const _url = `${backendUrl}/api/attendence/v1/student-details`;

        const _response = await fetch(_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });

        const { success, data } = await _response.json();

        console.log(data);

        if (success) {
            loaderContainerDiv.style.display = 'none';

            const {
                student,
                already_present,
                pcDetails,
                studentAttendenceCount,
                batchAttendanceCount,
            } = data;

            if (!student) {
                Toast.warning('No Candidate Found.');
                return;
            }

            showStudentData(student);
            // console.log(student, studentAttendenceCount, pcDetails);

            updateStudentDetailsInView({
                student,
                attendenceCount: studentAttendenceCount?.[0] ?? {},
                batchAttendanceCount: batchAttendanceCount?.[0] ?? {},
                pcDetails: pcDetails && pcDetails.length > 0 ? pcDetails[0] : undefined,
            });
        }
    } catch (err) {
        console.log(`Error while fetching the student details : ${err}`);
        loaderContainerDiv.style.display = 'none';
    }
};

if (isDevMode()) {
    searchCandidateInput.value = 11;
}

// HANDLING FUNCTIONS OF SEARCHING STUDENT

const searchStudentBtn = document.getElementById('search-btn');
searchStudentBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const id = +document.getElementById('student-id').value;
    if (!id || isNaN(id)) {
        Toast.warning('Please enter a valid student ID.');
        return;
    }
    handleFetchStudentDetails(id);
});

const studentIdInput = document.getElementById('student-id');

studentIdInput.addEventListener('keypress', async function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const id = +studentIdInput.value;
        if (!id || isNaN(id)) {
            Toast.warning('Please enter a valid student ID.');
            return;
        }
        await handleFetchStudentDetails(id);
    }
});

// ==============================================================================//
//END HANDLING SEARCH STUDENT FUNCTIONALITY PART
// ==============================================================================//

export { backendUrl };

document.getElementById('student-image').addEventListener('click', function (e) {
    console.log('click');
    showBsModal('viewPhotoModal');
    console.log(e.target.getAttribute('src'));
    let _imgSrc = e.target.getAttribute('src');
    document.getElementById('view-image').src = _imgSrc;
});

document.getElementById('student-sign').addEventListener('click', function (e) {
    console.log('click');
    showBsModal('viewPhotoModal');
    console.log(e.target.getAttribute('src'));
    let _imgSrc = e.target.getAttribute('src');
    document.getElementById('view-image').src = _imgSrc;
});
