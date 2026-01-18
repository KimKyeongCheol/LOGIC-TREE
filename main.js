// Force a new commit to trigger Cloudflare Pages deployment for cache clearing.

document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const testScreen = document.getElementById('test-screen');
    const resultScreen = document.getElementById('result-screen');

    const startBtn = document.getElementById('start-btn');
    const retryBtn = document.getElementById('retry-btn');
    const mainH1 = document.querySelector('h1');

    const questionText = document.getElementById('question-text');
    const answerButtons = document.getElementById('answer-buttons');
    const progressIndicator = document.getElementById('progress-indicator');
    
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const resultIcon = document.getElementById('result-icon');

    const themeToggleBtn = document.getElementById('theme-toggle');
    const langKoBtn = document.getElementById('lang-ko');
    const langEnBtn = document.getElementById('lang-en');
    const body = document.body;
    const goHomeBtn = document.getElementById('go-to-start-btn');
    const shareKakaoBtn = document.getElementById('share-kakaotalk');
    const shareTwitterBtn = document.getElementById('share-twitter');
    const shareFacebookBtn = document.getElementById('share-facebook');

    let currentQuestionIndex = 0;
    let scores = { logic: 0, emotion: 0, order: 0, chaos: 0 };
    let currentLang = 'ko';
    let currentTestQuestions = [];

    const NUM_QUESTIONS_PER_TEST = 20; // Number of questions to show per test run (increased for more robust results)

    // --- Language Data (questions will be loaded dynamically) ---
    const langData = {
        ko: {
            appTitle: "LOGIC-TREE",
            startScreen: {
                h2: "당신의 마인드 유형을 분석합니다.",
                p: "몇 가지 시나리오 기반 질문에 답변하고 당신의 생각 패턴을 알아보세요."
            },
            startButton: "시작하기",
            retryButton: "다시 테스트하기",
            questionPrefix: "질문",
            of: "/",
            resultScreen: {
                h2: "당신의 마인드 유형은:"
            },
            results: {
                LOGIC_MASTER: {
                    title: "논리주의 분석가 🧠",
                    description: "당신은 감정이나 불확실성에 휘둘리지 않고, 오직 데이터와 명확한 사실에 근거하여 판단하는 냉철한 마인드의 소유자입니다. 모든 상황을 객관적으로 파악하고 가장 효율적이며 합리적인 해결책을 찾아내는 데 탁월한 능력을 발휘합니다.",
                    icon: "🧠",
                    className: "result-logic"
                },
                CHAOTIC_AGENT: {
                    title: "혼돈의 에이전트 🌪️",
                    description: "당신은 예측 불가능한 에너지와 창의력으로 가득 찬 마인드입니다. 정해진 규칙이나 틀에 얽매이는 것을 싫어하며, 즉흥적이고 자유로운 방식으로 새로운 가능성을 탐색합니다. 당신의 행동은 때로는 혼란을 야기하지만, 그 속에서 혁신적인 아이디어가 탄생하곤 합니다.",
                    icon: "🌪️",
                    className: "result-chaos"
                },
                ORDERLY_GUARDIAN: {
                    title: "질서의 수호자 🛡️",
                    description: "당신은 안정과 조화를 최우선으로 생각하는 책임감 강한 마인드입니다. 사회의 규칙과 질서를 중요하게 여기며, 혼란스러운 상황에서도 평정심을 잃지 않고 체계적인 해결책을 모색합니다. 공동체의 안녕을 위해 헌신하며, 모든 것이 제자리에 있을 때 편안함을 느낍니다.",
                    icon: "🛡️",
                    className: "result-order"
                },
                EMPATHETIC_SOUL: {
                    title: "공감적 중재자 ❤️",
                    description: "당신은 타인의 감정을 깊이 이해하고 공감하는 능력이 뛰어난 따뜻한 마인드입니다. 이성적인 판단보다는 사람 사이의 관계와 감정적인 조화를 중요하게 생각하며, 갈등을 중재하고 모두가 행복할 수 있는 길을 모색합니다. 당신의 존재 자체가 주변 사람들에게 위안과 힘이 됩니다.",
                    icon: "❤️",
                    className: "result-emotion"
                }
            },
            questions: [] // Questions will be loaded dynamically
        },
        en: {
            appTitle: "LOGIC-TREE",
            startScreen: {
                h2: "Analyze Your Mind Type.",
                p: "Answer a few scenario-based questions and discover your thought patterns."
            },
            startButton: "Start Test",
            retryButton: "Retake Test",
            questionPrefix: "Question",
            of: "of",
            resultScreen: {
                h2: "Your Mind Type is:"
            },
            results: {
                LOGIC_MASTER: {
                    title: "Logic Master 🧠",
                    description: "You are a cool-headed analyst who makes decisions based solely on data and clear facts, unswayed by emotions or uncertainty. You excel at objectively grasping all situations and finding the most efficient and rational solutions.",
                    icon: "🧠",
                    className: "result-logic"
                },
                CHAOTIC_AGENT: {
                    title: "Chaotic Agent 🌪️",
                    description: "You are a mind full of unpredictable energy and creativity. You dislike being bound by fixed rules or frameworks, exploring new possibilities spontaneously and freely. Your actions sometimes cause chaos, but innovative ideas often emerge from them.",
                    icon: "🌪️",
                    className: "result-chaos"
                },
                ORDERLY_GUARDIAN: {
                    title: "Orderly Guardian 🛡️",
                    description: "You are a responsible mind that prioritizes stability and harmony. You value societal rules and order, seeking systematic solutions even in chaotic situations without losing composure. You dedicate yourself to the well-being of the community and feel at peace when everything is in its proper place.",
                    icon: "🛡️",
                    className: "result-order"
                },
                EMPATHETIC_SOUL: {
                    title: "Empathetic Soul ❤️",
                    description: "You are a warm mind with an exceptional ability to deeply understand and empathize with others' feelings. You prioritize human relationships and emotional harmony over rational judgment, mediating conflicts and seeking paths where everyone can be happy. Your very presence brings comfort and strength to those around you.",
                    icon: "❤️",
                    className: "result-emotion"
                }
            },
            questions: [] // Questions will be loaded dynamically
        }
    };

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to load questions from JSON
    async function loadQuestions() {
        try {
            const response = await fetch('./data/questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            langData.ko.questions = data.ko;
            langData.en.questions = data.en;
            console.log("Questions loaded successfully from questions.json");
        } catch (error) {
            console.error("Error loading questions.json:", error);
            // Fallback to empty questions or show an error message to the user
            langData.ko.questions = [];
            langData.en.questions = [];
            alert("Error loading questions. Please ensure 'data/questions.json' exists and is correctly formatted.");
        }
    }

    function updateUI(lang) {
        const data = langData[lang];
        document.title = data.appTitle;
        mainH1.innerText = data.appTitle;
        
        // Start Screen
        if (startScreen.querySelector('h2')) startScreen.querySelector('h2').innerText = data.startScreen.h2;
        if (startScreen.querySelector('p')) startScreen.querySelector('p').innerText = data.startScreen.p;
        startBtn.innerText = data.startButton;
        retryBtn.innerText = data.retryButton; // Update retry button for language switch

        // If test screen is currently visible, update question and choices text
        if (!testScreen.classList.contains('hidden')) {
            const questionData = currentTestQuestions[currentQuestionIndex];
            if (questionData) { // Only update if there's a valid question
                questionText.innerText = questionData.text;
                progressIndicator.innerText = `${data.questionPrefix} ${currentQuestionIndex + 1} ${data.of} ${currentTestQuestions.length}`;
                
                answerButtons.innerHTML = '';
                questionData.choices.forEach((choice) => {
                    const button = document.createElement('button');
                    button.innerText = choice.text;
                    button.classList.add('answer-btn');
                    button.addEventListener('click', () => selectAnswer(choice));
                    answerButtons.appendChild(button);
                });
            }
        }
        
        // If result screen is currently visible, update result texts
        if (!resultScreen.classList.contains('hidden')) {
            const finalResult = calculateResult(); // This gets localized result data
            resultScreen.querySelector('h2').innerText = data.resultScreen.h2; // Update H2 in result
            resultTitle.innerText = finalResult.title;
            resultDescription.innerText = finalResult.description;
            resultIcon.innerText = finalResult.icon;
        }

        // Update active language button
        langKoBtn.classList.remove('active');
        langEnBtn.classList.remove('active');
        if (lang === 'ko') {
            langKoBtn.classList.add('active');
        } else if (lang === 'en') {
            langEnBtn.classList.add('active');
        }
    }

    function switchLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('logicTreeLang', lang);
        
        // Always regenerate questions based on the new language.
        // This ensures currentTestQuestions holds questions in the selected language.
        generateRandomQuestions(); 

        // Update the UI for the new language.
        updateUI(lang);
        
        // If the test screen is currently visible (meaning user was mid-test), 
        // force it to show the first question of the newly generated set in the new language.
        if (!testScreen.classList.contains('hidden')) {
            currentQuestionIndex = 0; // Reset to the first question of the new set
            showQuestion(); 
        }
    }

    function toggleTheme() {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        themeToggleBtn.innerText = isDarkMode ? '🌙' : '☀️';
        localStorage.setItem('logicTreeTheme', isDarkMode ? 'dark' : 'light');
    }

    function loadPreferences() {
        const savedLang = localStorage.getItem('logicTreeLang');
        if (savedLang) {
            currentLang = savedLang;
        } else {
            const browserLang = navigator.language.split('-')[0];
            currentLang = (browserLang === 'ko' || browserLang === 'en') ? browserLang : 'ko';
        }
        
        const savedTheme = localStorage.getItem('logicTreeTheme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            themeToggleBtn.innerText = '🌙';
        } else {
            body.classList.remove('dark-mode');
            themeToggleBtn.innerText = '☀️';
        }
        updateUI(currentLang);
    }

    function generateRandomQuestions() {
        const fullQuestionPool = langData[currentLang].questions;
        // Check if questions are loaded
        if (!fullQuestionPool || fullQuestionPool.length === 0) {
            console.error("Question pool is empty. Cannot generate random questions.");
            currentTestQuestions = []; // Ensure currentTestQuestions is empty to prevent errors
            return;
        }
        const shuffledPool = shuffleArray([...fullQuestionPool]);
        currentTestQuestions = shuffledPool.slice(0, NUM_QUESTIONS_PER_TEST);
    }

    function startTest() {
        currentQuestionIndex = 0;
        scores = { logic: 0, emotion: 0, order: 0, chaos: 0 };
        
        // Ensure questions are available before attempting to generate or show them
        if (langData[currentLang].questions.length === 0) {
            alert(langData[currentLang].questions.length === 0 && currentLang === 'ko' ? "질문이 로드되지 않아 테스트를 시작할 수 없습니다. 파일을 확인하거나 웹 서버를 사용해 주세요." : "Questions could not be loaded, unable to start test. Please check the file or use a web server.");
            console.error("Cannot start test: Question pool is empty.");
            return; // Prevent further execution if questions are not loaded
        }

        generateRandomQuestions();
        if (currentTestQuestions.length === 0) { // If generateRandomQuestions somehow still resulted in an empty array
            alert(currentLang === 'ko' ? "테스트 질문을 생성할 수 없습니다. 질문 파일 형식을 확인해주세요." : "Could not generate test questions. Please check the question file format.");
            console.error("Cannot start test: currentTestQuestions is empty after generation.");
            return;
        }

        startScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        resultScreen.classList.remove('result-logic', 'result-chaos', 'result-order', 'result-emotion');
        testScreen.classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        const questionData = currentTestQuestions[currentQuestionIndex];
        questionText.innerText = questionData.text;
        progressIndicator.innerText = `${langData[currentLang].questionPrefix} ${currentQuestionIndex + 1} ${langData[currentLang].of} ${currentTestQuestions.length}`;
        
                        answerButtons.innerHTML = '';
                        const shuffledChoices = shuffleArray([...questionData.choices]); // Shuffle choices for the current question
                        shuffledChoices.forEach((choice, index) => {
                            const button = document.createElement('button');
                            button.innerText = choice.text;
                            button.classList.add('answer-btn');
                            button.addEventListener('click', () => selectAnswer(choice));
                            answerButtons.appendChild(button);
                        });    }

    function selectAnswer(choice) {
        for (const key in choice.scores) {
            if (scores.hasOwnProperty(key)) {
                scores[key] += choice.scores[key];
            }
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < currentTestQuestions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }

    function calculateResult() {
        console.log("--- Calculating Result ---");
        console.log("Current scores:", scores); // Log initial scores object

        const finalScores = Object.entries(scores);
        console.log("finalScores before sort:", finalScores); // Log array before sort

        // Check if all scores are zero, indicating no questions were answered or loaded successfully
        const allScoresZero = finalScores.every(([key, value]) => value === 0);

        if (allScoresZero) {
            console.log("All scores are zero. Returning generic message.");
            return {
                primary: {
                    title: langData[currentLang].results.LOGIC_MASTER.title, // Use title from an existing result for consistency
                    description: currentLang === 'ko' ? "질문이 로드되지 않았거나 답변이 선택되지 않아 결과를 도출할 수 없습니다." : "Could not determine result as questions were not loaded or no answers were selected.",
                    icon: "❓",
                    className: "result-default"
                },
                secondary: [], // No secondary results if no answers
                rawScores: scores // Include raw scores for debugging
            };
        }

        finalScores.sort((a, b) => b[1] - a[1]); // Sorts descending by score value
        console.log("finalScores after sort:", finalScores);

        // Determine primary result
        const highestScore = finalScores[0][1];
        const primaryTypeKey = finalScores[0][0];

        const typeKeyToResultKey = {
            emotion: 'EMPATHETIC_SOUL',
            logic: 'LOGIC_MASTER',
            order: 'ORDERLY_GUARDIAN',
            chaos: 'CHAOTIC_AGENT'
        };

        const primaryResultKey = typeKeyToResultKey[primaryTypeKey];
        const primaryResultData = langData[currentLang].results[primaryResultKey] || langData[currentLang].results.LOGIC_MASTER;

        console.log("Primary type determined:", primaryTypeKey);
        console.log("Mapped primary result key:", primaryResultKey);

        // Determine secondary results
        const secondaryResults = [];
        for (let i = 0; i < finalScores.length; i++) {
            const [type, score] = finalScores[i];
            // Include secondary results if their score is non-zero, not the primary type,
            // and their score is close to the highest (e.g., highest - 2 points) or just top N
            if (score > 0 && type !== primaryTypeKey && secondaryResults.length < 2) { // Limit to top 2 secondary results
                const secondaryResultKey = typeKeyToResultKey[type];
                if (langData[currentLang].results.hasOwnProperty(secondaryResultKey)) {
                    secondaryResults.push({
                        type: type, // e.g., 'emotion'
                        score: score,
                        data: langData[currentLang].results[secondaryResultKey]
                    });
                }
            }
        }
        console.log("Secondary results:", secondaryResults);

        return {
            primary: primaryResultData,
            secondary: secondaryResults,
            rawScores: scores // Include raw scores for debugging/future use
        };
    }

    // Global variable to store the last calculated result for sharing
    let lastCalculatedResult = null;

    function getShareText() {
        const primaryTitle = lastCalculatedResult.primary.title;
        const primaryDescription = lastCalculatedResult.primary.description;
        const siteUrl = window.location.href; // Get current page URL

        let shareText = `${langData[currentLang].appTitle} ${langData[currentLang].resultScreen.h2}\n${primaryTitle}\n\n${primaryDescription}\n\n`;

        if (lastCalculatedResult.secondary && lastCalculatedResult.secondary.length > 0) {
            shareText += currentLang === 'ko' ? "또한, 당신은 다음과 같은 성향을 보입니다:\n" : "Additionally, you show tendencies towards:\n";
            lastCalculatedResult.secondary.forEach(secondary => {
                shareText += ` - ${secondary.data.title}\n`;
            });
        }
        shareText += siteUrl; // Add the URL to the share text
        return encodeURIComponent(shareText);
    }

    function shareKakaoTalk() {
        // Kakao SDK integration would go here. For now, use a generic alert.
        // Requires Kakao SDK to be loaded and initialized in index.html.
        alert(currentLang === 'ko' ? "카카오톡 공유 기능은 현재 개발 중입니다. (Kakao SDK 필요)" : "KakaoTalk sharing is currently under development. (Requires Kakao SDK)");
        // Example if Kakao SDK is initialized:
        /*
        if (Kakao && Kakao.isInitialized()) {
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: lastCalculatedResult.primary.title,
                    description: lastCalculatedResult.primary.description,
                    imageUrl: 'YOUR_IMAGE_URL', // You might want an image related to the result
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
                buttons: [
                    {
                        title: currentLang === 'ko' ? '테스트 결과 보기' : 'View Test Result',
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href,
                        },
                    },
                ],
            });
        }
        */
    }

    function shareTwitter() {
        if (!lastCalculatedResult) return;
        const tweetText = getShareText();
        const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
        window.open(twitterUrl, '_blank', 'width=600,height=300');
    }

    function shareFacebook() {
        if (!lastCalculatedResult) return;
        // Facebook's sharer.php works best if the URL is the one to be shared,
        // and it fetches meta tags from that URL. Custom quote might be ignored.
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${getShareText()}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    }



    function showResult() {
        const fullResult = calculateResult();
        lastCalculatedResult = fullResult; // Store the result for sharing

        // Clear previous results
        resultTitle.innerText = '';
        resultDescription.innerText = '';
        resultIcon.innerText = '';
        resultScreen.classList.remove('result-logic', 'result-chaos', 'result-order', 'result-emotion', 'result-default');

        // Display Primary Result
        resultTitle.innerText = fullResult.primary.title;
        resultDescription.innerText = fullResult.primary.description;
        resultIcon.innerText = fullResult.primary.icon;
        resultScreen.classList.add(fullResult.primary.className);

        // Display Secondary Results
        const secondaryResultsDiv = document.getElementById('secondary-results');
        secondaryResultsDiv.innerHTML = ''; // Clear previous secondary results

        if (fullResult.secondary && fullResult.secondary.length > 0) {
            const currentLangData = langData[currentLang];
            const secondaryTitle = document.createElement('h3');
            secondaryTitle.classList.add('secondary-results-title');
            secondaryTitle.innerText = currentLang === 'ko' ? "또한, 당신은 다음과 같은 성향을 보입니다:" : "Additionally, you show tendencies towards:";
            secondaryResultsDiv.appendChild(secondaryTitle);

            fullResult.secondary.forEach(secondary => {
                const p = document.createElement('p');
                p.classList.add('secondary-result-item');
                p.innerHTML = `${secondary.data.icon} <strong>${secondary.data.title}</strong> (${secondary.score} ${currentLang === 'ko' ? '점' : 'pts'})`;
                secondaryResultsDiv.appendChild(p);
            });
        } else if (!fullResult.primary.className.includes('result-default')) { // Only if not already showing generic msg
             const p = document.createElement('p');
             p.classList.add('secondary-result-item');
             p.innerText = currentLang === 'ko' ? "다른 특출난 성향은 발견되지 않았습니다." : "No other prominent tendencies were found.";
             secondaryResultsDiv.appendChild(p);
        }

        testScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        document.getElementById('share-buttons').classList.remove('hidden'); // Ensure share buttons are visible

        drawScoreChart(fullResult.rawScores); // Draw the score chart
    }
    
    function restartTest() {
      resultScreen.classList.add('hidden');
      startScreen.classList.remove('hidden');
      resultScreen.classList.remove('result-logic', 'result-chaos', 'result-order', 'result-emotion', 'result-default');
      document.getElementById('share-buttons').classList.add('hidden'); // Hide share buttons on restart
    }



    // ...

    function goToStartScreen() {
        testScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');

        // Reset test state
        currentQuestionIndex = 0;
        scores = { logic: 0, emotion: 0, order: 0, chaos: 0 };
        // Clear all result classes including the generic one
        resultScreen.classList.remove('result-logic', 'result-chaos', 'result-order', 'result-emotion', 'result-default'); 

        // Ensure start screen UI is updated and new questions are ready
        generateRandomQuestions(); // Prepare fresh questions for the start screen
        updateUI(currentLang); // Update UI to reflect start screen content
    }

    // --- Event Listeners ---
    startBtn.addEventListener('click', startTest);
    retryBtn.addEventListener('click', restartTest);
    themeToggleBtn.addEventListener('click', toggleTheme);
    langKoBtn.addEventListener('click', () => switchLanguage('ko'));
    langEnBtn.addEventListener('click', () => switchLanguage('en'));
    goHomeBtn.addEventListener('click', goToStartScreen);
    shareKakaoBtn.addEventListener('click', shareKakaoTalk);
    shareTwitterBtn.addEventListener('click', shareTwitter);
    shareFacebookBtn.addEventListener('click', shareFacebook);

    // --- Ad Hiding Functionality ---
    function hideEmptyAdContainers() {
        const adContainers = document.querySelectorAll('.ad-top, .ad-bottom, .ad-side-left, .ad-side-right');
        adContainers.forEach(container => {
            if (container.innerHTML.trim() === '') {
                container.classList.add('hidden');
            }
        });
    }

    // Load questions, then preferences, then generate initial questions, then hide empty ads
    loadQuestions().then(() => {
        loadPreferences(); // Load language and theme preferences
        // After questions are loaded and preferences set, generate initial questions
        if (langData[currentLang] && langData[currentLang].questions && langData[currentLang].questions.length > 0) {
            generateRandomQuestions();
        } else {
            console.error("Initial question generation skipped: Question pool is empty or not properly loaded.");
            // Consider alerting the user or disabling start button if no questions can be loaded
        }
        hideEmptyAdContainers();
    }).catch(error => {
        console.error("An error occurred during initial load sequence:", error);
        alert("Failed to load necessary application data. Please ensure the 'data/questions.json' file is accessible and properly formatted, and try running with a local web server.");
    });
});