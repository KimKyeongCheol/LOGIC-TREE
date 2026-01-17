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

    let URL;
    const urlMale = "https://teachablemachine.withgoogle.com/models/o9D1N5TN/"; // Placeholder from original project
    const urlFemale = "https://teachablemachine.withgoogle.com/models/bB3YHn5r/"; // Placeholder from original project
    let model, maxPredictions;
    let selectedGender = 'female'; // Default to female

    // --- Teachable Machine Model Initialization ---
    async function init() {
        try {
            document.getElementById('loading').classList.remove('hidden'); // Show loading when initializing model
            URL = selectedGender === 'male' ? urlMale : urlFemale;
            console.log("Initializing model for gender:", selectedGender, "URL:", URL);

            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";

            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();
            console.log("Model initialized. Max predictions:", maxPredictions);

            // Clear previous results container
            const labelContainer = document.getElementById("label-container");
            if (labelContainer) {
                labelContainer.innerHTML = '';
            }
            // Create placeholders for prediction results (labels and bars)
            for (let i = 0; i < maxPredictions; i++) {
                if (labelContainer) {
                    const predictionElement = document.createElement("div");
                    labelContainer.appendChild(predictionElement);
                }
            }
            document.getElementById('loading').classList.add('hidden'); // Hide loading after model init
        } catch (error) {
            console.error("Error during model initialization (init function):", error);
            document.getElementById('loading').classList.add('hidden');
            document.querySelector('.result-message').innerHTML = '<p>모델 로딩에 실패했습니다. 다시 시도해주세요.</p>';
            document.querySelector('.result-card').classList.remove('hidden');
        }
    }

    // --- Gender Toggle Logic ---
    const genderToggle = document.getElementById('gender');
    if (genderToggle) {
        // Initial setup for selectedGender and model initialization
        selectedGender = genderToggle.checked ? 'male' : 'female';
        console.log("Initial selected gender from toggle:", selectedGender);
        // We will initialize the model only when an image is uploaded or gender is changed after upload

        genderToggle.addEventListener('change', async function() {
            try {
                selectedGender = this.checked ? 'male' : 'female';
                console.log("Gender changed to:", selectedGender);

                // Re-initialize model if needed (if a different gender model is required)
                await init();

                // If an image is already uploaded and displayed, re-run prediction
                const fileUploadContent = document.querySelector('.file-upload-content');
                if (fileUploadContent && !fileUploadContent.classList.contains('hidden')) {
                    document.getElementById('loading').classList.remove('hidden'); // This will be shown by predict
                    document.querySelector('.result-card').classList.add('hidden');
                    document.querySelector('.result-message').innerHTML = '';
                    predict(); // Call predict after re-init
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

                        // Initialize model if not already (or if gender changed and model not updated)
                        if (!model || (URL !== (selectedGender === 'male' ? urlMale : urlFemale))) {
                             await init();
                        }
                        predict(); // Call predict after init (if needed)
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

    // --- AI Prediction Function ---
    async function predict() {
        try {
            console.log("Predict function called with current model and image.");
            document.getElementById('loading').classList.remove('hidden'); // Show loading while predicting

            if (!model) {
                console.error("Model not loaded. Attempting to initialize.");
                await init(); // Try to initialize if not loaded
                if (!model) { // If still no model, something went wrong
                    document.getElementById('loading').classList.add('hidden');
                    document.querySelector('.result-message').innerHTML = '<p>AI 모델이 준비되지 않았습니다. 다시 시도해주세요.</p>';
                    document.querySelector('.result-card').classList.remove('hidden');
                    return;
                }
            }

            const image = document.getElementById("face-image");
            if (!image || !image.src || image.src === '#') {
                console.error("No image to predict.");
                document.getElementById('loading').classList.add('hidden');
                return;
            }

            const prediction = await model.predict(image, false);
            prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
            console.log("Prediction results:", prediction);

            // Display top result message
            const resultMessage = document.querySelector('.result-message');
            if (resultMessage) {
                let topResultText = '';
                // Original JoCoding logic had specific messages for each animal type
                // For simplicity, let's just show the top animal type and a generic message for now
                switch (prediction[0].className) {
                    case "dog":
                        topResultText = "귀여운 강아지상";
                        break;
                    case "cat":
                        topResultText = "매력적인 고양이상";
                        break;
                    case "rabbit":
                        topResultText = "상큼발랄한 토끼상";
                        break;
                    case "dinosaur":
                        topResultText = "따뜻한 공룡상";
                        break;
                    case "bear":
                        topResultText = "포근한 곰상";
                        break;
                    case "deer":
                        topResultText = "온순한 사슴상";
                        break;
                    case "fox":
                        topResultText = "섹시한 여우상";
                        break;
                    case "monkey":
                        topResultText = "장난기 가득한 원숭이상";
                        break;
                    case "tiger":
                        topResultText = "강렬한 카리스마 호랑이상";
                        break;
                    case "horse":
                        topResultText = "시원시원한 말상";
                        break;
                    case "snake":
                        topResultText = "신비로운 뱀상";
                        break;
                    case "squirrel":
                        topResultText = "귀여운 다람쥐상";
                        break;
                    default:
                        topResultText = "알 수 없는 동물상";
                }
                resultMessage.innerHTML = `<p>당신은 ${topResultText}입니다!</p>`;
            } else {
                console.error("Result message element not found!");
            }

            // Display all probabilities
            const labelContainer = document.getElementById("label-container");
            if (labelContainer) {
                labelContainer.innerHTML = ''; // Clear previous bars
                for (let i = 0; i < maxPredictions; i++) {
                    const probability = prediction[i].probability.toFixed(2);
                    const percent = Math.round(parseFloat(probability) * 100);
                    let barWidth = percent > 0 ? percent + "%" : "0%"; // Ensure at least 0% width

                    let animalName = prediction[i].className;
                    // Map class names to Korean animal names
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
                    predictionElement.className = prediction[i].className; // Add class for specific bar styling
                    predictionElement.innerHTML = `
                        <div class="animal-label">${animalName}</div>
                        <div class="bar-container">
                            <div class="progress-bar ${prediction[i].className}" style="width: ${barWidth}">${percent}%</div>
                        </div>
                    `;
                    labelContainer.appendChild(predictionElement);
                }
            } else {
                console.error("Label container (#label-container) not found!");
            }
            
            document.getElementById('loading').classList.add('hidden'); // Hide loading after prediction
            document.querySelector('.result-card').classList.remove('hidden'); // Show result card
        } catch (error) {
            console.error("Error during prediction (predict function):", error);
            document.getElementById('loading').classList.add('hidden');
            document.querySelector('.result-message').innerHTML = '<p>분석 중 오류가 발생했습니다. 다시 시도해주세요.</p>';
            document.querySelector('.result-card').classList.remove('hidden');
        }
    }
});