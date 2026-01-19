document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const testScreen = document.getElementById('test-screen');
    const resultScreen = document.getElementById('result-screen');

    const startBtn = document.getElementById('start-btn');
    const retryBtn = document.getElementById('retry-btn');
    const mainH1 = document.querySelector('h1');
    const saveImageBtn = document.getElementById('save-image-btn');

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
    const shortSummaryDiv = document.getElementById('short-summary');
    const humorousInsightDiv = document.getElementById('humorous-insight');
    const callToActionDiv = document.getElementById('call-to-action');

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
                    shortSummary: "데이터와 논리로 무장한 당신, 감성은 잠시 접어두세요! 숫자가 당신의 언어이고, 팩트만이 진실입니다. 복잡한 문제를 명쾌하게 풀어내는 당신은, 마치 살아있는 계산기같네요!",
                    humorousInsight: "당신에게 '직감'이란, 아직 데이터로 증명되지 않은 '가설'일 뿐! 😂 사랑도, 우정도, 효율성이 우선인 당신, 가끔은 머리 말고 가슴이 시키는 일을 해보는 건 어때요?",
                    callToAction: "당신의 비범한 논리력을 세상에 보여주세요! 이 결과를 공유하고, 친구들의 마인드 유형도 분석해보세요!",
                    icon: "🧠",
                    className: "result-logic",
                    highScoreSnippet: "당신의 가장 큰 강점은 뛰어난 논리력입니다. 복잡한 문제를 명확하게 분석하고 합리적인 해결책을 찾아내는 데 탁월합니다. 데이터와 사실에 기반한 당신의 판단은 항상 믿을 수 있습니다.",
                    lowScoreSnippet: "때로는 차가운 논리만으로는 해결하기 어려운 상황들이 있습니다. 감정적 교류나 창의적 접근을 시도하며, 다른 사람들의 감정적 반응에도 귀 기울여 보세요. 이는 당신의 시야를 넓히는 데 도움이 될 것입니다."
                },
                CHAOTIC_AGENT: {
                    title: "혼돈의 에이전트 🌪️",
                    description: "당신은 예측 불가능한 에너지와 창의력으로 가득 찬 마인드입니다. 정해진 규칙이나 틀에 얽매이는 것을 싫어하며, 즉흥적이고 자유로운 방식으로 새로운 가능성을 탐색합니다. 당신의 행동은 때로는 혼란을 야기하지만, 그 속에서 혁신적인 아이디어가 탄생하곤 합니다.",
                    shortSummary: "규칙? 그게 뭔가요? 먹는 건가요? 😋 당신은 예측 불가능한 매력으로 가득 찬, 톡톡 튀는 아이디어 뱅크! 정해진 틀을 깨부수고 새로운 길을 개척하는 진정한 혁신가입니다.",
                    humorousInsight: "당신의 가방 속은 마치 우주와 같죠? 어디서 뭐가 튀어나올지 아무도 모릅니다! 계획은 즉흥적으로 세워야 제맛이라는 당신, 예상치 못한 곳에서 인생의 해답을 찾기도 합니다.",
                    callToAction: "세상은 당신의 혼돈을 기다립니다! 당신의 독특한 마인드 유형을 공유하고, 친구들에게 신선한 충격을 선사하세요!",
                    icon: "🌪️",
                    className: "result-chaos",
                    highScoreSnippet: "당신은 예측 불가능한 에너지와 창의력으로 가득 차 있습니다. 정해진 틀에 얽매이지 않고 새로운 아이디어를 끊임없이 탐색하며, 변화를 두려워하지 않는 혁신가적인 면모가 강점입니다.",
                    lowScoreSnippet: "가끔은 당신의 자유로운 에너지가 주변에 혼란을 주거나, 중요한 세부 사항을 놓치게 만들 수도 있습니다. 때때로 계획을 세우고, 질서 있는 환경에서 안정감을 찾는 연습을 해보는 것은 어떨까요?"
                },
                ORDERLY_GUARDIAN: {
                    title: "질서의 수호자 🛡️",
                    description: "당신은 안정과 조화를 최우선으로 생각하는 책임감 강한 마인드입니다. 사회의 규칙과 질서를 중요하게 여기며, 혼란스러운 상황에서도 평정심을 잃지 않고 체계적인 해결책을 모색합니다. 공동체의 안녕을 위해 헌신하며, 모든 것이 제자리에 있을 때 편안함을 느낍니다.",
                    shortSummary: "세상의 질서를 수호하는 당신은, 마치 움직이는 도서관이자 꼼꼼한 플래너! 📚 모든 것을 제자리에 두고, 예측 가능한 삶에서 안정감을 느낍니다. 당신의 존재 자체가 평화입니다.",
                    humorousInsight: "당신은 약속 시간에 늦는 법이 없죠? 심지어 '미리 가서 기다리는' 유형! 계획에 없던 서프라이즈는 당신을 혼란스럽게 하지만, 당신의 질서는 모두에게 안도감을 줍니다. 가끔은 '무계획'도 계획의 일부라고 생각해보는 건 어때요?",
                    callToAction: "안정과 조화의 아이콘! 당신의 질서정연한 마인드를 공유하고, 친구들의 혼란스러운 세상을 구원해주세요!",
                    icon: "🛡️",
                    className: "result-order",
                    highScoreSnippet: "당신의 가장 큰 강점은 안정과 조화를 추구하는 책임감입니다. 모든 상황을 체계적으로 관리하고 질서를 유지하며, 공동체의 안녕을 위해 헌신하는 믿음직스러운 모습이 돋보입니다.",
                    lowScoreSnippet: "지나치게 계획에 얽매이거나 예측 불가능한 상황에 당황할 수 있습니다. 가끔은 즉흥적인 변화를 받아들이고, 예상치 못한 곳에서 새로운 즐거움을 찾아보는 유연함을 길러보는 것은 어떨까요?"
                },
                EMPATHETIC_SOUL: {
                    title: "공감적 중재자 ❤️",
                    description: "당신은 타인의 감정을 깊이 이해하고 공감하는 능력이 뛰어난 따뜻한 마인드입니다. 이성적인 판단보다는 사람 사이의 관계와 감정적인 조화를 중요하게 생각하며, 갈등을 중재하고 모두가 행복할 수 있는 길을 모색합니다. 당신의 존재 자체가 주변 사람들에게 위안과 힘이 됩니다.",
                    shortSummary: "타인의 마음을 읽는 능력자! 💖 당신의 공감 능력은 마치 마법과 같아서, 주변 사람들에게 따뜻한 위로와 힘을 줍니다. 당신이 있는 곳엔 언제나 평화가 찾아옵니다.",
                    humorousInsight: "누군가 힘들어하면 당신의 지갑은 자동으로 열리고, 친구의 고민은 밤새도록 들어주는 당신! 😂 가끔은 나 자신을 먼저 챙기는 것도 중요해요. 타인의 감정 쓰레기통이 되지는 마시길!",
                    callToAction: "세상에 따뜻한 위로가 필요한가요? 당신의 공감 가득한 마인드를 공유하고, 지친 이들에게 힘을 불어넣어 주세요!",
                    icon: "❤️",
                    className: "result-emotion",
                    highScoreSnippet: "타인의 감정을 깊이 이해하고 공감하는 능력은 당신의 독보적인 강점입니다. 사람과 사람 사이의 관계를 중시하고, 갈등을 원만하게 해결하며, 주변 사람들에게 따뜻한 위로와 힘을 주는 존재입니다.",
                    lowScoreSnippet: "다른 사람의 감정에 너무 깊이 몰입하거나, 개인적인 감정을 객관화하기 어려워할 수 있습니다. 가끔은 자신을 먼저 챙기고, 이성적인 판단과 거리를 두는 연습을 통해 스스로를 보호하는 지혜가 필요합니다."
                }
            },
            questions: [] // Questions will be loaded dynamically
            ,
            shareButtons: {
                kakao: "카카오톡 공유",
                twitter: "트위터 공유",
                facebook: "페이스북 공유",
                saveImage: "이미지로 저장"
            }
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
                    shortSummary: "Armed with data and logic, emotions can take a backseat! Numbers are your language, and facts are the only truth. You're like a living calculator, unraveling complex problems with brilliant clarity.",
                    humorousInsight: "For you, 'gut feeling' is just a 'hypothesis' yet to be proven by data! 😂 Efficiency is key in love and friendship. Ever tried listening to your heart, not just your head?",
                    callToAction: "Unleash your extraordinary logic on the world! Share your results and analyze your friends' mind types too!",
                    icon: "🧠",
                    className: "result-logic",
                    highScoreSnippet: "Your greatest strength is your outstanding logic. You excel at clearly analyzing complex problems and finding rational solutions. Your decisions, based on data and facts, are always reliable.",
                    lowScoreSnippet: "Sometimes, situations require more than just cold logic. Try engaging in emotional exchanges or creative approaches, and pay attention to others' emotional responses. This will help broaden your perspective."
                },
                CHAOTIC_AGENT: {
                    title: "Chaotic Agent 🌪️",
                    description: "You are a mind full of unpredictable energy and creativity. You dislike being bound by fixed rules or frameworks, exploring new possibilities spontaneously and freely. Your actions sometimes cause chaos, but innovative ideas often emerge from them.",
                    shortSummary: "Rules? What are those? 😋 You're a unpredictable, vibrant idea factory! Breaking free from norms, you forge new paths as a true innovator.",
                    humorousInsight: "Your bag is like a universe, you never know what'll pop out! 😂 For you, plans are best made spontaneously. You often find life's answers in unexpected places.",
                    callToAction: "The world awaits your beautiful chaos! Share your unique mind type and shock your friends with a dose of fresh perspective!",
                    icon: "🌪️",
                    className: "result-chaos",
                    highScoreSnippet: "You are full of unpredictable energy and creativity. Your strength lies in not being confined by rigid frameworks, constantly exploring new ideas, and not being afraid of change—a truly innovative spirit.",
                    lowScoreSnippet: "Occasionally, your free-spirited energy might cause confusion or lead you to overlook important details. How about practicing setting plans and finding stability in an orderly environment?"
                },
                ORDERLY_GUARDIAN: {
                    title: "Orderly Guardian 🛡️",
                    description: "You are a responsible mind that prioritizes stability and harmony. You value societal rules and order, seeking systematic solutions even in chaotic situations without losing composure. You dedicate yourself to the well-being of the community and feel at peace when everything is in its proper place.",
                    shortSummary: "A guardian of order, you're a walking library and a meticulous planner! 📚 You find comfort in everything being in its place and a predictable life. Your very presence brings peace.",
                    humorousInsight: "You're never late, are you? In fact, you're the 'early bird' type! Unexpected surprises throw you off, but your order brings relief to all. Perhaps 'no plan' can also be a plan?",
                    callToAction: "Icon of stability and harmony! Share your orderly mind and bring salvation to your friends' chaotic worlds!",
                    icon: "🛡️",
                    className: "result-order",
                    highScoreSnippet: "Your greatest strength is your responsibility, pursuing stability and harmony. You systematically manage all situations, maintain order, and dedicate yourself to the well-being of the community, making you a trustworthy presence.",
                    lowScoreSnippet: "You might be overly bound by plans or flustered by unpredictable situations. How about practicing flexibility, embracing spontaneous changes, and finding new joys in unexpected places?"
                },
                EMPATHETIC_SOUL: {
                    title: "Empathetic Soul ❤️",
                    description: "You are a warm mind with an exceptional ability to deeply understand and empathize with others' feelings. You prioritize human relationships and emotional harmony over rational judgment, mediating conflicts and seeking paths where everyone can be happy. Your very presence brings comfort and strength to those around you.",
                    shortSummary: "A master of reading hearts! 💖 Your empathy is like magic, offering warm comfort and strength to those around you. Peace always finds its way where you are.",
                    humorousInsight: "When someone's struggling, your wallet opens automatically, and you'll listen to a friend's worries all night! 😂 Remember to take care of yourself first. Don't be a human emotional dumpster!",
                    callToAction: "Is the world in need of warm solace? Share your empathetic mind and empower those who are weary!",
                    icon: "❤️",
                    className: "result-emotion",
                    highScoreSnippet: "Your unique strength lies in your deep understanding and empathy for others' emotions. You value human relationships, resolve conflicts smoothly, and bring warm comfort and strength to those around you.",
                    lowScoreSnippet: "You might sometimes get too deeply immersed in others' emotions or find it difficult to objectify personal feelings. It's important to take care of yourself first, and practice wisdom to protect yourself by sometimes maintaining an objective perspective and distance from emotions."
                }
            },
            questions: [] // Questions will be loaded dynamically
            ,
            shareButtons: {
                kakao: "Share KakaoTalk",
                twitter: "Share Twitter",
                facebook: "Share Facebook",
                saveImage: "Save as Image"
            }
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

            // Update share button texts
            document.getElementById('share-kakaotalk').innerText = data.shareButtons.kakao;
            document.getElementById('share-twitter').innerText = data.shareButtons.twitter;
            document.getElementById('share-facebook').innerText = data.shareButtons.facebook;
            document.getElementById('save-image-btn').innerText = data.shareButtons.saveImage;
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
        } else if (!resultScreen.classList.contains('hidden')) { // If result screen is visible, re-render it for new language
            showResult(); // Recalculate and display result with new language
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
        // Get the current question to access its weight
        const currentQuestion = currentTestQuestions[currentQuestionIndex];
        const questionWeight = (currentQuestion && currentQuestion.weight !== undefined && typeof currentQuestion.weight === 'number') ? currentQuestion.weight : 1;

        for (const key in choice.scores) {
            if (scores.hasOwnProperty(key)) {
                scores[key] += choice.scores[key] * questionWeight; // Apply the weight
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
                rawScores: scores, // Include raw scores for debugging
                lowestScoreTypeKey: null // No meaningful lowest score if all are zero
            };
        }

        // Sort by score descending for primary and secondary
        finalScores.sort((a, b) => b[1] - a[1]);
        console.log("finalScores after descending sort:", finalScores);

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

        // Determine secondary results (same logic as before)
        const secondaryResults = [];
        for (let i = 0; i < finalScores.length; i++) {
            const [type, score] = finalScores[i];
            if (score > 0 && type !== primaryTypeKey && secondaryResults.length < 2) {
                const secondaryResultKey = typeKeyToResultKey[type];
                if (langData[currentLang].results.hasOwnProperty(secondaryResultKey)) {
                    secondaryResults.push({
                        type: type,
                        score: score,
                        data: langData[currentLang].results[secondaryResultKey]
                    });
                }
            }
        }
        console.log("Secondary results:", secondaryResults);

        // Determine lowest score type for non-primary types
        let lowestScore = Infinity;
        let lowestScoreRawKey = null; // Store the raw key ('logic', 'emotion' etc.)

        for (const type in scores) {
            if (scores.hasOwnProperty(type) && type !== primaryTypeKey) { // Exclude primary type from lowest score advice
                if (scores[type] < lowestScore) {
                    lowestScore = scores[type];
                    lowestScoreRawKey = type;
                }
            }
        }
        
        const lowestScoreTypeKey = lowestScoreRawKey ? typeKeyToResultKey[lowestScoreRawKey] : null;

        // Fallback if no distinct lowest non-primary score type is found
        if (lowestScoreTypeKey === null && Object.keys(scores).length > 1) { // If there are other types but no clear lowest
             console.warn("Could not determine a distinct lowest non-primary score type. Lowest score advice might not be shown.");
        }


        return {
            primary: primaryResultData,
            secondary: secondaryResults,
            rawScores: scores, // Include raw scores for debugging/future use
            lowestScoreTypeKey: lowestScoreTypeKey // e.g., 'EMPATHETIC_SOUL'
        };
    }

    // Global variable to store the last calculated result for sharing
    let lastCalculatedResult = null;

    function getShareText() {
        const primaryTitle = lastCalculatedResult.primary.title;
        const primaryDescription = lastCalculatedResult.primary.description; // This is the main long description
        const shortSummary = lastCalculatedResult.primary.shortSummary; // New
        const humorousInsight = lastCalculatedResult.primary.humorousInsight; // New
        const siteUrl = window.location.href; // Get current page URL

        let shareText = `${langData[currentLang].appTitle} ${langData[currentLang].resultScreen.h2}\n${primaryTitle}\n\n`;

        // Use shortSummary if available, otherwise fall back to full description (truncated)
        if (shortSummary) {
            shareText += `${shortSummary}\n\n`;
        } else {
            // Truncate description for sharing platforms that have character limits
            const truncatedDescription = primaryDescription.substring(0, 100) + (primaryDescription.length > 100 ? '...' : '');
            shareText += `${truncatedDescription}\n\n`;
        }

        if (humorousInsight) {
            shareText += `${humorousInsight}\n\n`;
        }
        
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
        resultIcon.innerText = '';
        resultScreen.classList.remove('result-logic', 'result-chaos', 'result-order', 'result-emotion', 'result-default');

        // Clear and hide new dynamic text fields
        const highScoreInsightDiv = document.getElementById('high-score-insight');
        const lowScoreAdviceDiv = document.getElementById('low-score-advice');
        
        highScoreInsightDiv.innerText = '';
        lowScoreAdviceDiv.innerText = '';
        highScoreInsightDiv.classList.add('hidden');
        lowScoreAdviceDiv.classList.add('hidden');


        // Display Primary Result
        resultTitle.innerText = fullResult.primary.title;
        resultDescription.innerText = fullResult.primary.description; // Keep the original full description
        resultIcon.innerText = fullResult.primary.icon;
        resultScreen.classList.add(fullResult.primary.className);

        // Display high score snippet
        if (fullResult.primary.highScoreSnippet) {
            highScoreInsightDiv.innerText = fullResult.primary.highScoreSnippet;
            highScoreInsightDiv.classList.remove('hidden');
        }

        // Display low score advice
        if (fullResult.lowestScoreTypeKey && langData[currentLang].results[fullResult.lowestScoreTypeKey] && langData[currentLang].results[fullResult.lowestScoreTypeKey].lowScoreSnippet) {
            const lowestTypeData = langData[currentLang].results[fullResult.lowestScoreTypeKey];
            lowScoreAdviceDiv.innerText = lowestTypeData.lowScoreSnippet;
            lowScoreAdviceDiv.classList.remove('hidden');
        }


        // Display Secondary Results (existing logic)
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
        } else if (!fullResult.primary.className.includes('result-default')) {
             const p = document.createElement('p');
             p.classList.add('secondary-result-item');
             p.innerText = currentLang === 'ko' ? "다른 특출난 성향은 발견되지 않았습니다." : "No other prominent tendencies were found.";
             secondaryResultsDiv.appendChild(p);
        }

        // Display new storytelling fields (existing logic)
        if (fullResult.primary.shortSummary) {
            shortSummaryDiv.innerText = fullResult.primary.shortSummary;
            shortSummaryDiv.classList.remove('hidden');
        } else {
            shortSummaryDiv.classList.add('hidden');
        }

        if (fullResult.primary.humorousInsight) {
            humorousInsightDiv.innerText = fullResult.primary.humorousInsight;
            humorousInsightDiv.classList.remove('hidden');
        } else {
            humorousInsightDiv.classList.add('hidden');
        }
        
        if (fullResult.primary.callToAction) {
            callToActionDiv.innerText = fullResult.primary.callToAction;
            callToActionDiv.classList.remove('hidden');
        } else {
            callToActionDiv.classList.add('hidden');
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
      shortSummaryDiv.classList.add('hidden');
      humorousInsightDiv.classList.add('hidden');
      callToActionDiv.classList.add('hidden');
      document.getElementById('high-score-insight').classList.add('hidden'); // Hide new div
      document.getElementById('low-score-advice').classList.add('hidden');   // Hide new div
    }

    // New function to draw the score chart
    function drawScoreChart(scores) {
        const canvas = document.getElementById('score-chart');
        if (!canvas) {
            console.error("Canvas element with ID 'score-chart' not found.");
            return; // Exit if canvas is not found
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Failed to get 2D context for canvas 'score-chart'.");
            return; // Exit if context cannot be obtained
        }

        // Destroy existing chart if it exists to prevent multiple charts on the same canvas
        const existingChart = Chart.getChart("score-chart");
        if (existingChart) {
            existingChart.destroy();
        }

        let labels = [];
        let chartLabel = '';

        if (langData[currentLang] && langData[currentLang].results) {
            labels = [
                langData[currentLang].results.LOGIC_MASTER.title.split(' ')[0],
                langData[currentLang].results.EMPATHETIC_SOUL.title.split(' ')[0],
                langData[currentLang].results.ORDERLY_GUARDIAN.title.split(' ')[0],
                langData[currentLang].results.CHAOTIC_AGENT.title.split(' ')[0]
            ];
            chartLabel = langData[currentLang].appTitle + ' ' + (currentLang === 'ko' ? '마인드 유형 점수' : 'Mind Type Scores');
        } else {
            console.warn("langData not fully loaded when drawing chart. Using default labels.");
            labels = ['Logic', 'Emotion', 'Order', 'Chaos'];
            chartLabel = 'Mind Type Scores';
        }
        
        const dataValues = [
            scores.logic,
            scores.emotion,
            scores.order,
            scores.chaos
        ];

        // Determine a suitable suggestedMax for the chart scale
        const maxScore = Math.max(...dataValues);
        const dynamicSuggestedMax = maxScore > 0 ? maxScore + 2 : 10; // Add some padding, or default to 10 if all scores are 0

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: chartLabel,
                    data: dataValues,
                    backgroundColor: 'rgba(75, 192, 192, 0.4)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, // Set to true to maintain aspect ratio and prevent excessive height
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: dynamicSuggestedMax,
                        pointLabels: {
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
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
        shortSummaryDiv.classList.add('hidden');
        humorousInsightDiv.classList.add('hidden');
        callToActionDiv.classList.add('hidden');
        document.getElementById('high-score-insight').classList.add('hidden'); // Hide new div
        document.getElementById('low-score-advice').classList.add('hidden');   // Hide new div
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
    // Event listener for the new "Save as Image" button
    saveImageBtn.addEventListener('click', () => {
        const resultScreenElement = document.getElementById('result-screen');
        html2canvas(resultScreenElement, {
            useCORS: true, // Important if there are images loaded from other domains
            scale: 2,     // Increase scale for better image quality
            logging: false // Disable logging for cleaner console
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'my_mind_type_result.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

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