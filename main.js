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

    hideEmptyAdContainers();

    const MODEL_URL = '/models'; // Models will be hosted in a /models directory
    let selectedGender = 'female'; // Default to female
    let faceApiModelsLoaded = false; // Flag to track if models are loaded

    // --- Face-API.js Model Initialization ---
    async function initFaceAPI() {
        if (faceApiModelsLoaded) {
            console.log("Face-API.js models already loaded.");
            return;
        }
        try {
            document.getElementById('loading').classList.remove('hidden'); // Show loading
            console.log("Loading Face-API.js models...");
            await faceapi.nets.ssdMobilenetv1.load(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.load(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.load(MODEL_URL);
            faceApiModelsLoaded = true;
            console.log("Face-API.js models loaded successfully.");
            document.getElementById('loading').classList.add('hidden'); // Hide loading
        } catch (error) {
            console.error("Error loading Face-API.js models:", error);
            document.getElementById('loading').classList.add('hidden');
            document.querySelector('.result-message').innerHTML = '<p>얼굴 분석 모델 로딩에 실패했습니다. (콘솔 확인)</p>';
            document.querySelector('.result-card').classList.remove('hidden');
        }
    }

    // --- Gender Toggle Logic ---
    const genderToggle = document.getElementById('gender');
    if (genderToggle) {
        selectedGender = genderToggle.checked ? 'male' : 'female';
        console.log("Initial selected gender from toggle:", selectedGender);

        genderToggle.addEventListener('change', async function() {
            try {
                selectedGender = this.checked ? 'male' : 'female';
                console.log("Gender changed to:", selectedGender);

                const fileUploadContent = document.querySelector('.file-upload-content');
                if (fileUploadContent && !fileUploadContent.classList.contains('hidden')) {
                    document.getElementById('loading').classList.remove('hidden');
                    document.querySelector('.result-card').classList.add('hidden');
                    document.querySelector('.result-message').innerHTML = '';
                    await analyzeFace(); // Call analyzeFace
                }
            } catch (error) {
                console.error("Error in genderToggle change event:", error);
            }
        });
    } else {
        console.error("Gender toggle element (#gender) not found!");
    }

    // --- Image Upload and Preview Functions ---
    window.readURL = async function(input) {
        try {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = async function(e) {
                    try {
                        const imageUploadWrap = document.querySelector('.image-upload-wrap');
                        const loadingSpinner = document.getElementById('loading');
                        const faceImage = document.getElementById('face-image');
                        const fileUploadContent = document.querySelector('.file-upload-content');
                        const resultCard = document.querySelector('.result-card');

                        if (imageUploadWrap) imageUploadWrap.classList.add('hidden');
                        if (loadingSpinner) loadingSpinner.classList.remove('hidden');
                        if (faceImage) faceImage.src = e.target.result;
                        if (fileUploadContent) fileUploadContent.classList.remove('hidden');
                        if (resultCard) resultCard.classList.add('hidden');
                        console.log("Image loaded and preview displayed.");

                        await initFaceAPI(); // Ensure models are loaded
                        await analyzeFace(); // Perform face analysis
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
            const resultCard = document.querySelector('.result-card');
            const resultMessage = document.querySelector('.result-message');
            const labelContainer = document.getElementById("label-container");


            if (fileUploadContent) fileUploadContent.classList.add('hidden');
            if (imageUploadWrap) imageUploadWrap.classList.remove('hidden');
            if (faceImage) faceImage.src = '#';
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
            if (resultCard) resultCard.classList.add('hidden');
            if (resultMessage) resultMessage.innerHTML = '';
            if (labelContainer) labelContainer.innerHTML = ''; // Clear prediction results
            console.log("Upload removed.");
        } catch (error) {
            console.error("Error in removeUpload:", error);
        }
    };

    // --- Face-API.js Analysis Function ---
    async function analyzeFace() {
        try {
            console.log("analyzeFace function called.");
            document.getElementById('loading').classList.remove('hidden'); // Show loading

            if (!faceApiModelsLoaded) {
                console.error("Face-API.js models not loaded. Attempting to initialize.");
                await initFaceAPI();
                if (!faceApiModelsLoaded) {
                    document.getElementById('loading').classList.add('hidden');
                    document.querySelector('.result-message').innerHTML = '<p>얼굴 분석 모델 로딩에 실패했습니다.</p>';
                    document.querySelector('.result-card').classList.remove('hidden');
                    return;
                }
            }

            const image = document.getElementById("face-image");
            if (!image || !image.src || image.src === '#') {
                console.error("No image to analyze.");
                document.getElementById('loading').classList.add('hidden');
                return;
            }

            // Create a canvas from the image to ensure consistent processing
            const canvas = faceapi.createCanvasFromMedia(image);
            const displaySize = { width: image.width, height: image.height };
            faceapi.matchDimensions(canvas, displaySize);

            // Detect all faces in the image
            const detections = await faceapi.detectAllFaces(image, new faceapi.SsdMobilenetv1Options())
                .withFaceLandmarks()
                .withFaceDescriptors();
            
            if (detections.length === 0) {
                console.log("No faces detected.");
                document.getElementById('loading').classList.add('hidden');
                document.querySelector('.result-message').innerHTML = '<p>사진에서 얼굴을 찾을 수 없습니다.</p>';
                document.querySelector('.result-card').classList.remove('hidden');
                return;
            }

            // For simplicity, let's take the first detected face
            const faceDescriptor = detections[0].descriptor;
            console.log("Face descriptor extracted:", faceDescriptor);

            // --- Placeholder for Similarity Comparison (to be replaced with actual reference data) ---
            const labelContainer = document.getElementById("label-container");
            const resultCard = document.querySelector('.result-card');
            const resultMessage = document.querySelector('.result-message');

            if (resultMessage) {
                resultMessage.innerHTML = `<p>얼굴 특징 분석 완료!</p>`;
            }

            if (labelContainer) {
                labelContainer.innerHTML = ''; // Clear previous bars
                // Dummy results for demonstration
                const animalResults = [
                    { className: "dog", probability: 0.75 },
                    { className: "cat", probability: 0.50 },
                    { className: "fox", probability: 0.30 },
                    { className: "rabbit", probability: 0.20 },
                    { className: "bear", probability: 0.10 },
                ];

                for (let i = 0; i < animalResults.length; i++) {
                    const percent = Math.round(animalResults[i].probability * 100);
                    let barWidth = percent > 0 ? percent + "%" : "0%";

                    let animalName = animalResults[i].className;
                    switch (animalName) {
                        case "dog": animalName = "강아지상"; break;
                        case "cat": animalName = "고양이상"; break;
                        case "rabbit": animalName = "토끼상"; break;
                        case "dinosaur": animalName = "공룡상"; break;
                        case "bear": animalName = "곰상"; break;
                        case "deer": animalName = "사슴상"; break;
                        case "fox": animalName = "여우상"; break;
                        case "monkey": animalName = "원숭이상"; break;
                        case "tiger": animalName = "호랑이상"; break;
                        case "horse": animalName = "말상"; break;
                        case "snake": animalName = "뱀상"; break;
                        case "squirrel": animalName = "다람쥐상"; break;
                    }

                    const predictionElement = document.createElement("div");
                    predictionElement.className = animalResults[i].className;
                    predictionElement.innerHTML = `
                        <div class="animal-label">${animalName}</div>
                        <div class="bar-container">
                            <div class="progress-bar ${animalResults[i].className}" style="width: ${barWidth}">${percent}%</div>
                        </div>
                    `;
                    labelContainer.appendChild(predictionElement);
                }
            }
            
            document.getElementById('loading').classList.add('hidden'); // Hide loading
            if (resultCard) resultCard.classList.remove('hidden'); // Show result card

        } catch (error) {
            console.error("Error during Face-API.js analysis:", error);
            document.getElementById('loading').classList.add('hidden');
            document.querySelector('.result-message').innerHTML = '<p>얼굴 분석 중 오류가 발생했습니다. (콘솔 확인)</p>';
            document.querySelector('.result-card').classList.remove('hidden');
        }
    }

    // Initial load of Face-API.js models
    initFaceAPI();
});
