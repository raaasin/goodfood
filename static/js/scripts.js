const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const ratingStars = document.getElementById('rating-stars');
const reasonText = document.getElementById('reason-text');
const expiryText = document.getElementById('expiry-text');

function startCamera() {
    const constraints = {
        video: {
            facingMode: 'environment', // Use back camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
            video.play();  // Ensure play is called for iOS compatibility
        })
        .catch(err => {
            console.error("Error accessing the camera: ", err);
            alert("Error accessing the camera: " + err.message);
        });
}

function generateStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += i < rating ? '★' : '☆';
    }
    return stars;
}

captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');

    fetch('/process_image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        //console.log(data["rating"]); // Log the response to see the exact keys
        // Correctly handle the JSON response using bracket notation
        ratingStars.innerHTML = data["rating"] === "N/A" ? "N/A" : generateStars(parseInt(data["rating"], 10));
        reasonText.innerText = data["reason"]; // Ensure to match the exact key in JSON
        expiryText.innerText = data["expiry"]; // Ensure to match the exact key in JSON
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    startCamera();
});
