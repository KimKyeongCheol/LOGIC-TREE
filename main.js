document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM Content Loaded.");

    // Function to hide empty ad containers
    function hideEmptyAdContainers() {
        try {
            const adContainers = document.querySelectorAll('.ad-top, .ad-bottom, .ad-side-left, .ad-side-right');
            console.log("Checking ad containers:", adContainers.length);
            adContainers.forEach(container => {
                if (container.innerHTML.trim() === '') {
                    container.classList.add('hidden');
                    console.log(`Hidden empty ad container: ${container.className}`);
                }
            });
        } catch (error) {
            console.error("Error in hideEmptyAdContainers:", error);
        }
    }

    // Run on page load
    hideEmptyAdContainers();

    const genderToggle = document.getElementById('gender');
    if (genderToggle) {
        let selectedGender = genderToggle.checked ? 'male' : 'female'; // 'male' if checked, 'female' if unchecked (as per original JoCoding logic)
        console.log("Initial selected gender:", selectedGender);

        // Event listener for the gender toggle switch
        genderToggle.addEventListener('change', function() {
            try {
                selectedGender = this.checked ? 'male' : 'female';
                console.log("Gender changed to:", selectedGender);
                // If an image is already uploaded and displayed, re-run prediction
                const fileUploadContent = document.querySelector('.file-upload-content');
                if (fileUploadContent && !fileUploadContent.classList.contains('hidden')) {
                    document.getElementById('loading').classList.remove('hidden');
                    document.querySelector('.result-message').innerHTML = '';
                    predict();
                }
            } catch (error) {
                console.error("Error in genderToggle change event:", error);
            }
        });
    } else {
        console.error("Gender toggle element (#gender) not found!");
    }


    // Image upload and preview functions
    window.readURL = function(input) {
        try {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const imageUploadWrap = document.querySelector('.image-upload-wrap');
                        const loadingSpinner = document.getElementById('loading');
                        const faceImage = document.getElementById('face-image');
                        const fileUploadContent = document.querySelector('.file-upload-content');

                        if (imageUploadWrap) imageUploadWrap.classList.add('hidden');
                        if (loadingSpinner) loadingSpinner.classList.remove('hidden');
                        if (faceImage) faceImage.src = e.target.result;
                        if (fileUploadContent) fileUploadContent.classList.remove('hidden');
                        console.log("Image loaded and preview displayed.");

                        // Simulate AI prediction
                        predict();
                    } catch (error) {
                        console.error("Error in FileReader.onload:", error);
                    }
                };
                reader.readAsDataURL(input.files[0]);
            } else {
                removeUpload();
            }
        } catch (error) {
            console.error("Error in readURL:", error);
        }
    };

    window.removeUpload = function() {
        try {
            const fileUploadContent = document.querySelector('.file-upload-content');
            const imageUploadWrap = document.querySelector('.image-upload-wrap');
            const faceImage = document.getElementById('face-image');
            const loadingSpinner = document.getElementById('loading');
            const resultMessage = document.querySelector('.result-message');

            if (fileUploadContent) fileUploadContent.classList.add('hidden');
            if (imageUploadWrap) imageUploadWrap.classList.remove('hidden');
            if (faceImage) faceImage.src = '#'; // Clear image source
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
            if (resultMessage) resultMessage.innerHTML = ''; // Clear result message
            console.log("Upload removed.");
        } catch (error) {
            console.error("Error in removeUpload:", error);
        }
    };

    // Placeholder AI Prediction Function
    function predict() {
        try {
            console.log("Predict function called.");
            // Simulate a delay for AI processing
            setTimeout(() => {
                try {
                    document.getElementById('loading').classList.add('hidden');
                    let result = '';

                    // JoCoding's original toggle logic: unchecked is female, checked is male
                    if (selectedGender === 'female') {
                        result = '당신은 사랑스러운 고양이상입니다!';
                    } else { // selectedGender === 'male'
                        result = '당신은 듬직한 강아지상입니다!';
                    }
                    const resultMessage = document.querySelector('.result-message');
                    if (resultMessage) {
                        resultMessage.innerHTML = `<p>${result}</p><p>실제 AI 분석 결과는 다를 수 있습니다.</p>`;
                        console.log("Prediction result displayed.");
                    } else {
                        console.error("Result message element not found!");
                    }
                } catch (error) {
                    console.error("Error inside predict setTimeout:", error);
                }
            }, 3000); // 3 second delay
        } catch (error) {
            console.error("Error in predict function:", error);
        }
    }
});
