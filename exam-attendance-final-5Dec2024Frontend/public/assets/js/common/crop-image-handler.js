// Function to get dimensions and coordinates
function getDimensions(imageHolderId) {
    const imageHolder = document.getElementById(imageHolderId);

    if (!imageHolder) {
        console.error(`Element with id "${imageHolderId}" not found.`);
        return;
    }

    const absoluteDiv = imageHolder.querySelector('.absoluteDiv');

    if (!absoluteDiv) {
        console.error('No element with class "absoluteDiv" found inside the image holder.');
        return;
    }

    // Dimensions of the image holder

    const imageHolderRect = imageHolder.getBoundingClientRect();
    const absoluteDivRect = absoluteDiv.getBoundingClientRect();

    console.log('Image Holder Dimensions:', {
        width: imageHolderRect.width,
        height: imageHolderRect.height,
        top: imageHolderRect.top,
        left: imageHolderRect.left
    });

    console.log('Absolute Div Coordinates (Viewport):', {
        top: absoluteDivRect.top,
        left: absoluteDivRect.left,
        right: absoluteDivRect.right,
        bottom: absoluteDivRect.bottom
    });
}
