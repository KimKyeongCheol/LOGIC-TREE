document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const testScreen = document.getElementById('test-screen');
    const resultScreen = document.getElementById('result-screen');

    const startBtn = document.getElementById('start-btn');
    const retryBtn = document.getElementById('retry-btn');
    const mainH1 = document.querySelector('h1');
    const saveImageBtn = document.getElementById('save-image-btn');
    const copyResultBtn = document.getElementById('copy-result-btn');

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
    const loadingIndicator = document.getElementById('loading-indicator'); // Get reference to loading indicator

    const hamburgerMenuBtn = document.getElementById('hamburger-menu-btn'); // Hamburger button
    const desktopNavControls = document.getElementById('desktop-nav-controls'); // Desktop navigation container
    const mobileFullScreenMenu = document.getElementById('mobile-full-screen-menu'); // Mobile full-screen menu overlay
    // mobileMenuCloseBtn removed as it is no longer needed
    // Mobile specific controls (inside mobileFullScreenMenu)
    const goHomeBtnMobile = document.getElementById('go-to-start-btn-mobile');
    const langKoBtnMobile = document.getElementById('lang-ko-mobile');
    const langEnBtnMobile = document.getElementById('lang-en-mobile');
    const themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');

    const adminScreen = document.getElementById('admin-screen');
    // const adminLangKoBtn = document.getElementById('admin-lang-ko'); // Removed as this element does not exist
    // const adminLangEnBtn = document.getElementById('admin-lang-en'); // Removed as this element does not exist
    const adminAddQuestionBtn = document.getElementById('admin-add-question-btn');
    const adminQuestionList = document.getElementById('admin-question-list');
    const adminQuestionForm = document.getElementById('admin-question-form');
    const adminQuestionIndex = document.getElementById('admin-question-index');
    const adminQuestionTextKo = document.getElementById('admin-question-text-ko');
    const adminQuestionTextEn = document.getElementById('admin-question-text-en');
    const adminQuestionWeight = document.getElementById('admin-question-weight');
    const adminChoicesContainer = document.getElementById('admin-choices-container');
    const adminSaveQuestionBtn = document.getElementById('admin-save-question-btn');
    const adminCancelEditBtn = document.getElementById('admin-cancel-edit-btn');
    const adminExitBtn = document.getElementById('admin-exit-btn');

    let currentQuestionIndex = 0;
    let scores = { logic: 0, emotion: 0, order: 0, chaos: 0 };
    let currentLang = 'ko';
    let currentTestQuestions = [];

    const NUM_QUESTIONS_PER_TEST = 20; // Number of questions to show per test run (increased for more robust results)
    const QUESTIONS_PER_PAGE_ADMIN = 10; // Number of questions to show per page in admin view
    let currentPageAdmin = 1; // Current page for admin view

    // Helper functions for loading indicator
    function showLoading() {
        if (loadingIndicator) {
            loadingIndicator.classList.remove('hidden');
        }
    }

    function hideLoading() {
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
            // Re-show appropriate screen after loading based on current state (e.g., start screen)
            // This is handled by loadPreferences or startTest
        }
    }

    // Admin functions for managing questions in localStorage
    function loadQuestionsFromStorage() {
        try {
            const storedQuestions = localStorage.getItem('logicTreeQuestions');
            if (storedQuestions) {
                return JSON.parse(storedQuestions);
            }
        } catch (e) {
            console.error("Error loading questions from localStorage:", e);
        }
        return null; // Return null if nothing found or error
    }

    function saveQuestionsToStorage(questionsData) {
        try {
            localStorage.setItem('logicTreeQuestions', JSON.stringify(questionsData));
            console.log("Questions saved to localStorage successfully.");
        } catch (e) {
            console.error("Error saving questions to localStorage:", e);
            alert("질문 저장에 실패했습니다. (Failed to save questions.)");
        }
    }

        // Renders the list of questions in the admin screen

        function renderAdminQuestions() {

            adminQuestionList.innerHTML = ''; // Clear previous list

    

            // Create a copy and sort questions by ID before rendering

            const allQuestionsKo = [...langData.ko.questions].sort((a, b) => b.id - a.id);

            const allQuestionsEn = [...langData.en.questions].sort((a, b) => b.id - a.id); // Assuming parallel IDs

    

            if (!allQuestionsKo || allQuestionsKo.length === 0) {

                adminQuestionList.innerHTML = `<p>등록된 질문이 없습니다. / No questions registered.</p>`;

                renderPaginationControls(0); // Render pagination with 0 total questions

                return;

            }

    

            const totalQuestions = allQuestionsKo.length;

            const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE_ADMIN);

    

            // Ensure currentPageAdmin is within valid range

            if (currentPageAdmin < 1) currentPageAdmin = 1;

            if (currentPageAdmin > totalPages) currentPageAdmin = totalPages;

    

            const startIndex = (currentPageAdmin - 1) * QUESTIONS_PER_PAGE_ADMIN;

            const endIndex = startIndex + QUESTIONS_PER_PAGE_ADMIN;

    

            const questionsToDisplayKo = allQuestionsKo.slice(startIndex, endIndex);

            const questionsToDisplayEn = allQuestionsEn.slice(startIndex, endIndex);

    

            questionsToDisplayKo.forEach((questionKo, idx) => {

                // Find the corresponding English question using its ID

                const questionEn = questionsToDisplayEn.find(q => q.id === questionKo.id) || { text: `[EN translation needed] ${questionKo.text}`, choices: questionKo.choices.map(c => ({...c, text: `[EN translation needed] ${c.text}`})) };

                

                const questionItem = document.createElement('div');

                questionItem.classList.add('question-item');

                // Use the original index from the *allQuestionsKo* array, not the sliced array's index

                const originalIndex = allQuestionsKo.findIndex(q => q.id === questionKo.id);

                questionItem.dataset.index = originalIndex; // Store original index for editing/deleting

    

                let choicesHtml = '';

                // Display both KO and EN choices

                for(let i=0; i<questionKo.choices.length; i++) {

                    const choiceKo = questionKo.choices[i];

                    const choiceEn = questionEn.choices[i] || { text: `[EN translation needed] ${choiceKo.text}`, scores: choiceKo.scores };

                    const effectiveScores = { ...choiceKo.scores }; // Scores are assumed to be consistent

    

                    choicesHtml += `<li><strong>KO:</strong> ${choiceKo.text} <br><strong>EN:</strong> ${choiceEn.text} (L:${effectiveScores.logic}, E:${effectiveScores.emotion}, O:${effectiveScores.order}, C:${effectiveScores.chaos})</li>`;

                }

                

                questionItem.innerHTML = `

                    <div class="question-item-text">

                        <div class="question-lang-line">${questionKo.id}. <strong>KO:</strong> ${questionKo.text} (Weight: ${questionKo.weight || 1})</div>

                        <div class="question-lang-line"><strong>EN:</strong> ${questionEn.text}</div>

                    </div>

                    <ul>${choicesHtml}</ul>

                    <div class="question-item-controls">

                        <button class="edit-btn">편집 / Edit</button>

                        <button class="delete-btn">삭제 / Delete</button>

                    </div>

                `;

                adminQuestionList.appendChild(questionItem);

            });

    

            // Render pagination controls

            renderPaginationControls(totalQuestions, totalPages);

    

            // Attach event listeners for edit/delete buttons

            adminQuestionList.querySelectorAll('.edit-btn').forEach(button => {

                button.addEventListener('click', (e) => {

                    const index = e.target.closest('.question-item').dataset.index;

                    editQuestion(parseInt(index));

                });

            });

    

            adminQuestionList.querySelectorAll('.delete-btn').forEach(button => {

                button.addEventListener('click', (e) => {

                    const index = e.target.closest('.question-item').dataset.index;

                    deleteQuestion(parseInt(index));

                });

            });

        }

    // Helper for admin form to add a choice field
    function addChoiceField(choiceIndex = adminChoicesContainer.children.length, choiceKo = { text: '', scores: { logic: 0, emotion: 0, order: 0, chaos: 0 } }, choiceEn = { text: '', scores: { logic: 0, emotion: 0, order: 0, chaos: 0 } }) {
        const choiceItem = document.createElement('div');
        choiceItem.classList.add('admin-choice-item');
        choiceItem.dataset.choiceIndex = choiceIndex;

        // Create score inputs, assuming scores are consistent across languages for a given choice
        const scoreInputs = ['logic', 'emotion', 'order', 'chaos'].map(type => `
            <div class="score-input-group">
                <label>${type.charAt(0).toUpperCase()}</label>
                <input type="number" data-score-type="${type}" value="${choiceKo.scores[type] || 0}" min="-5" max="5" step="1">
            </div>
        `).join('');

        choiceItem.innerHTML = `
            <div class="dual-language-field">
                <div class="field-group">
                    <label>선택지 텍스트 (KO)</label>
                    <input type="text" class="choice-text-ko" placeholder="선택지 텍스트 (KO)" value="${choiceKo.text}" required>
                </div>
                <div class="field-group">
                    <label>Choice Text (EN)</label>
                    <input type="text" class="choice-text-en" placeholder="Choice Text (EN)" value="${choiceEn.text}" required>
                </div>
            </div>
            <div class="score-inputs-wrapper">
                ${scoreInputs}
            </div>
        `;
        adminChoicesContainer.appendChild(choiceItem);
    }

    function editQuestion(index) { // Removed lang parameter
        const questionKoToEdit = langData.ko.questions[index];
        const questionEnToEdit = langData.en.questions[index] || { text: `[EN translation needed] ${questionKoToEdit.text}`, choices: questionKoToEdit.choices.map(c => ({...c, text: `[EN translation needed] ${c.text}`})) };

        // Fill the form
        adminQuestionIndex.value = index;
        adminQuestionTextKo.value = questionKoToEdit.text;
        adminQuestionTextEn.value = questionEnToEdit.text;
        adminQuestionWeight.value = questionKoToEdit.weight !== undefined ? questionKoToEdit.weight : 1;
        
        // Clear and fill choices for both languages
        adminChoicesContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const choiceKo = questionKoToEdit.choices[i] || { text: '', scores: { logic: 0, emotion: 0, order: 0, chaos: 0 } };
            const choiceEn = questionEnToEdit.choices[i] || { text: '', scores: { logic: 0, emotion: 0, order: 0, chaos: 0 } };
            addChoiceField(i, choiceKo, choiceEn);
        }

        // Show the form and hide the list
        adminQuestionList.classList.add('hidden');
        adminQuestionForm.classList.remove('hidden');
        adminAddQuestionBtn.classList.add('hidden'); // Hide add question button
        adminPaginationControls.classList.add('hidden'); // Hide pagination controls
    }

    function deleteQuestion(index) { // Removed lang parameter
        if (confirm(langData[currentLang].admin?.confirmDeleteQuestion || (currentLang === 'ko' ? '정말로 이 질문을 삭제하시겠습니까?' : 'Are you sure you want to delete this question?'))) {
            langData.ko.questions.splice(index, 1);
            langData.en.questions.splice(index, 1);
            saveQuestionsToStorage({ ko: langData.ko.questions, en: langData.en.questions });
            renderAdminQuestions(); // Removed lang parameter
            // If the deleted question was being edited, clear the form
            if (parseInt(adminQuestionIndex.value) === index) {
                adminQuestionForm.reset();
                adminChoicesContainer.innerHTML = '';
            }
        }
    }

    const adminPaginationControls = document.getElementById('admin-pagination-controls');

    function renderPaginationControls(totalQuestions, totalPages) {
        adminPaginationControls.innerHTML = '';
        if (totalPages <= 1) return;

        const createButton = (text, page, isDisabled = false) => {
            const button = document.createElement('button');
            button.innerText = text;
            button.classList.add('pagination-btn');
            if (isDisabled) {
                button.disabled = true;
                button.classList.add('disabled');
            } else {
                button.addEventListener('click', () => goToAdminPage(page));
            }
            return button;
        };

        // First button
        adminPaginationControls.appendChild(createButton('<<', 1, currentPageAdmin === 1));
        // Previous button
        adminPaginationControls.appendChild(createButton('<', currentPageAdmin - 1, currentPageAdmin === 1));

        // Page numbers
        let startPage = Math.max(1, currentPageAdmin - 2);
        let endPage = Math.min(totalPages, currentPageAdmin + 2);

        if (currentPageAdmin <= 3) {
            endPage = Math.min(totalPages, 5);
        } else if (currentPageAdmin > totalPages - 2) {
            startPage = Math.max(1, totalPages - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            const button = createButton(i, i);
            if (i === currentPageAdmin) {
                button.classList.add('active');
            }
            adminPaginationControls.appendChild(button);
        }

        // Next button
        adminPaginationControls.appendChild(createButton('>', currentPageAdmin + 1, currentPageAdmin === totalPages));
        // Last button
        adminPaginationControls.appendChild(createButton('>>', totalPages, currentPageAdmin === totalPages));
    }

    function goToAdminPage(page) {
        if (page < 1) page = 1;
        // Recalculate totalPages to ensure it's up-to-date
        const totalQuestions = langData.ko.questions.length;
        const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE_ADMIN);
        if (page > totalPages) page = totalPages;

        if (page !== currentPageAdmin) {
            currentPageAdmin = page;
            renderAdminQuestions(); // Re-render the question list for the new page
        }
    }
    
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
                    description: "당신은 모든 것을 데이터와 명확한 사실에 근거하여 판단하는, 감정에 흔들리지 않는 냉철한 분석가입니다. 복잡한 상황에서도 핵심을 꿰뚫어 보고, 가장 효율적이고 합리적인 해결책을 도출하는 데에 매우 뛰어난 재능을 가지고 있습니다. 당신의 판단은 감성적인 고려보다는 객관적인 지표와 검증된 이론에 기반합니다.",
                    shortSummary: "데이터와 논리로 세상을 해석하는 당신! 감성은 잠시 접어두세요. 숫자가 당신의 언어이며, 검증된 사실만이 당신의 진실입니다. 복잡한 문제를 명쾌하게 풀어내는 당신은, 마치 잘 튜닝된 분석 엔진과 같습니다.",
                    humorousInsight: "당신에게 '직감'이란, 아직 데이터로 증명되지 않은 '통계적 가능성'일 뿐! 😂 사랑이나 우정 같은 추상적인 가치도 효율성의 렌즈로 분석하곤 하죠. 가끔은 계산기를 내려놓고 마음의 소리에 귀 기울여보는 건 어떨까요?",
                    callToAction: "당신의 비범한 논리력과 통찰력을 세상에 증명하세요! 이 결과를 친구들과 공유하고, 그들의 숨겨진 마인드 유형도 함께 분석해보세요!",
                    icon: "🧠",
                    className: "result-logic",
                    highScoreSnippet: "당신의 가장 두드러진 강점은 바로 뛰어난 논리력과 분석적 사고입니다. 어떤 문제든 감정적인 동요 없이 객관적으로 분석하여, 데이터에 기반한 합리적인 해결책을 찾아내는 데 탁월합니다. 당신의 결정은 높은 신뢰도를 자랑합니다.",
                    lowScoreSnippet: "때로는 차가운 논리만으로 해결하기 어려운 인간적인 문제들이 있습니다. 다른 사람들의 감정적 반응에 공감하고, 창의적이거나 비정형적인 접근을 시도해 보세요. 이는 당신의 의사결정 모델을 한층 더 발전시키는 데 도움이 될 것입니다."
                },
                CHAOTIC_AGENT: {
                    title: "혼돈의 에이전트 🌪️",
                    description: "당신은 예측 불가능한 에너지와 무한한 창의력으로 가득 찬 자유로운 영혼입니다. 정해진 규칙이나 틀에 얽매이는 것을 답답해하며, 즉흥적이고 유연한 사고방식으로 누구도 생각지 못한 새로운 가능성을 탐색합니다. 당신의 행보는 때로 혼란을 야기하는 것처럼 보이지만, 그 속에서 기존의 질서를 뛰어넘는 혁신적인 아이디어가 탄생합니다.",
                    shortSummary: "규칙이요? 그런 건 누가 만들었죠? 😋 당신은 예측 불가능한 매력으로 가득 찬, 살아있는 아이디어 발전소입니다. 정해진 길을 거부하고 새로운 길을 개척하는 당신은 진정한 의미의 혁신가입니다.",
                    humorousInsight: "당신의 머릿속은 아이디어로 가득 찬 빅뱅 우주와 같군요. 어디서 무엇이 터져 나올지 아무도 예상할 수 없습니다! '계획은 원래 즉흥적으로 세우는 것'이라는 당신, 덕분에 인생이 지루할 틈이 없겠네요.",
                    callToAction: "세상은 당신의 창의적인 혼돈을 필요로 합니다! 당신의 독특한 마인드를 공유하고, 친구들에게 신선한 영감과 충격을 선사하세요!",
                    icon: "🌪️",
                    className: "result-chaos",
                    highScoreSnippet: "당신의 가장 큰 잠재력은 정해진 틀에 얽매이지 않는 창의성과 변화를 두려워하지 않는 혁신적인 태도에 있습니다. 남들이 보지 못하는 새로운 기회를 포착하고, 과감하게 도전하는 당신의 모습은 주변에 신선한 자극을 줍니다.",
                    lowScoreSnippet: "당신의 자유로운 에너지가 때로는 중요한 세부사항을 놓치게 만들거나, 체계적인 접근이 필요한 상황에서 어려움을 겪게 할 수 있습니다. 목표 달성을 위해 때로는 계획을 세우고, 질서의 가치를 활용하는 지혜가 필요합니다."
                },
                ORDERLY_GUARDIAN: {
                    title: "질서의 수호자 🛡️",
                    description: "당신은 안정과 조화를 무엇보다 중요하게 생각하는, 책임감 강한 수호자입니다. 사회의 규칙과 확립된 질서를 존중하며, 혼란스러운 상황에서도 평정심을 잃지 않고 체계적인 해결책을 모색합니다. 당신은 공동체의 안녕과 발전을 위해 헌신하며, 모든 것이 제자리에 있을 때 가장 큰 안정감을 느낍니다.",
                    shortSummary: "세상의 질서와 안정을 수호하는 당신은, 살아있는 규범이자 꼼꼼한 관리자입니다. 📚 모든 것을 예측 가능한 범위 안에 두고, 계획된 삶에서 안정감을 느낍니다. 당신의 존재는 그 자체로 공동체의 든든한 버팀목입니다.",
                    humorousInsight: "혹시 약속 시간에 1분이라도 늦으면 큰일 나는 줄 아는 타입인가요? '미리 가서 기다리기'는 당신의 오랜 습관! 계획에 없던 서프라이즈는 당신을 잠시 당황하게 하지만, 당신의 질서는 모두에게 깊은 신뢰감을 줍니다.",
                    callToAction: "안정과 조화의 아이콘! 당신의 질서정연한 마인드를 공유하고, 혼란에 빠진 친구들의 세상을 구원해주세요!",
                    icon: "🛡️",
                    className: "result-order",
                    highScoreSnippet: "당신의 가장 큰 강점은 공동체의 안정과 조화를 추구하는 깊은 책임감입니다. 모든 상황을 체계적으로 관리하고, 예측 가능한 계획을 통해 리스크를 최소화하는 당신의 능력은 어떤 조직에서든 빛을 발합니다.",
                    lowScoreSnippet: "지나치게 계획에 얽매이거나 예측 불가능한 변화에 대한 저항이 클 수 있습니다. 가끔은 즉흥적인 결정을 시도하고, 예상치 못한 상황이 주는 새로운 즐거움을 발견해 보세요. 유연성은 당신을 더 높은 차원으로 이끌 것입니다."
                },
                EMPATHETIC_SOUL: {
                    title: "공감적 중재자 ❤️",
                    description: "당신은 타인의 감정을 자신의 것처럼 깊이 이해하고 공감하는 능력이 뛰어난, 따뜻한 마음의 소유자입니다. 논리적인 판단보다는 사람 사이의 관계와 감정적인 조화를 우선시하며, 갈등 상황에서 양측의 입장을 모두 고려하여 모두가 행복할 수 있는 상생의 길을 모색합니다. 당신의 존재는 주변 사람들에게 큰 위안과 힘이 됩니다.",
                    shortSummary: "타인의 마음을 비추는 거울! 💖 당신의 깊은 공감 능력은 주변 사람들에게 따뜻한 위로와 강력한 지지를 제공합니다. 당신이 있는 곳에는 언제나 이해와 화합의 에너지가 넘칩니다.",
                    humorousInsight: "친구가 슬퍼하면 같이 울어주고, 기뻐하면 같이 웃어주는 당신! 혹시 타인의 감정에 너무 깊이 빠져들어 정작 자신의 에너지는 방전되고 있지 않나요? 가끔은 자신을 먼저 챙기는 이기심도 필요하답니다.",
                    callToAction: "세상에 따뜻한 위로와 이해가 필요한가요? 당신의 공감 가득한 마인드를 공유하고, 삭막한 세상에 따스한 온기를 불어넣어 주세요!",
                    icon: "❤️",
                    className: "result-emotion",
                    highScoreSnippet: "타인의 감정을 깊이 이해하고 공감하는 능력은 당신의 가장 특별한 재능입니다. 이를 통해 사람들과 강한 유대감을 형성하고, 갈등을 평화롭게 해결하며, 주변 사람들에게 긍정적인 영향을 미치는 리더가 될 수 있습니다.",
                    lowScoreSnippet: "다른 사람의 감정에 지나치게 몰입하여 객관적인 판단을 내리기 어려워하거나, 정서적으로 쉽게 지칠 수 있습니다. 때로는 한 걸음 물러나 이성적인 분석을 통해 상황을 조망하고, 자신의 감정을 보호하는 연습이 필요합니다."
                }
            },
            questions: [] // Questions will be loaded dynamically
            ,
            shareButtons: {
                kakao: "카카오톡 공유",
                twitter: "트위터 공유",
                facebook: "페이스북 공유",
                saveImage: "이미지로 저장",
                copyResult: "결과 복사"
            },
            admin: {
                confirmDeleteQuestion: "정말로 이 질문을 삭제하시겠습니까?",
                addQuestionBtn: "새 질문 추가",
                editFormTitle: "질문 편집/추가",
                questionTextLabel: "질문 텍스트:",
                weightLabel: "가중치 (기본 1):",
                choicesTitle: "선택지 (5개 필수)",
                addChoiceBtn: "선택지 추가",
                saveBtn: "저장",
                cancelBtn: "편집 취소", // Renamed for clarity
                exitAdminBtn: "관리 종료", // New button text
                choiceTextPlaceholder: "선택지 텍스트",
                noQuestions: "등록된 질문이 없습니다.",
                choicesMaxAlert: "선택지는 5개까지 추가할 수 있습니다.",
                fillAllFieldsAlert: "질문 텍스트와 5개의 선택지를 모두 입력해야 합니다."
            },
            alerts: {
                saveQuestionsError: "질문 저장에 실패했습니다.",
                loadQuestionsError: "질문을 불러오는 데 실패했습니다. 'data/questions.json' 파일이 올바르게 존재하는지 확인해주세요.",
                startTestError: "테스트를 시작할 수 없습니다. 질문이 충분히 로드되지 않았습니다.",
                kakaoShareAlert: "카카오톡 공유 기능은 현재 개발 중입니다.",
                copySuccess: "결과 텍스트가 클립보드에 복사되었습니다!",
                copyError: "텍스트 복사에 실패했습니다.",
                weightRangeError: "가중치는 0.1에서 3 사이의 값만 입력할 수 있습니다."
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
                    title: "The Logician 🧠",
                    description: "You are a cool-headed analyst who makes decisions based on data and clear facts, unswayed by emotions. You excel at seeing through complexity to find the most efficient and rational solutions. Your judgments are founded on objective metrics and proven theories rather than subjective feelings.",
                    shortSummary: "You interpret the world through data and logic! For you, numbers are a language and verified facts are the only truth. Unraveling complex problems with brilliant clarity, you operate like a finely-tuned analytical engine.",
                    humorousInsight: "To you, a 'gut feeling' is just a 'statistical probability' that hasn't been quantified yet! 😂 You tend to analyze abstract values like love and friendship through a lens of efficiency. How about putting the calculator down and listening to your heart for a change?",
                    callToAction: "Prove your extraordinary logic and insight to the world! Share these results with your friends and analyze their hidden mind types too!",
                    icon: "🧠",
                    className: "result-logic",
                    highScoreSnippet: "Your most prominent strength is your outstanding logic and analytical thinking. You excel at objectively analyzing any problem without emotional disturbance, leading to highly reliable, data-driven solutions.",
                    lowScoreSnippet: "Sometimes, you may encounter human-centric problems that cold logic alone cannot solve. Try to empathize with others' emotional reactions and consider creative, less-structured approaches. This will help enhance your decision-making model to a new level."
                },
                CHAOTIC_AGENT: {
                    title: "The Chaotic Agent 🌪️",
                    description: "You are a free spirit, full of unpredictable energy and boundless creativity. You feel constrained by established rules and frameworks, preferring to explore new possibilities through spontaneous and flexible thinking. While your actions may sometimes seem to create chaos, it is from this very chaos that groundbreaking ideas, which transcend the existing order, are born.",
                    shortSummary: "Rules? Who made them anyway? 😋 You are a living powerhouse of ideas, full of unpredictable charm. By rejecting the beaten path to forge your own, you embody the true spirit of an innovator.",
                    humorousInsight: "Your mind is like a Big Bang universe of ideas; no one can predict what will explode next! Your motto is 'plans are best made spontaneously,' which certainly keeps life interesting.",
                    callToAction: "The world needs your creative chaos! Share your unique mind type and give your friends a fresh dose of inspiration and shock!",
                    icon: "🌪️",
                    className: "result-chaos",
                    highScoreSnippet: "Your greatest potential lies in your creativity, which is not bound by rigid frameworks, and your innovative attitude that does not fear change. Your ability to spot new opportunities and boldly challenge them inspires those around you.",
                    lowScoreSnippet: "Your free-flowing energy can sometimes cause you to overlook important details or struggle in situations requiring a systematic approach. To achieve your goals, it's sometimes wise to make a plan and leverage the value of order."
                },
                ORDERLY_GUARDIAN: {
                    title: "The Orderly Guardian 🛡️",
                    description: "You are a responsible guardian who values stability and harmony above all. You respect societal rules and established order, seeking systematic solutions in chaotic situations without losing composure. You are dedicated to the well-being and progress of your community, feeling most at ease when everything is in its proper place.",
                    shortSummary: "As a protector of the world's order and stability, you are a living code of conduct and a meticulous manager. 📚 You find comfort in a predictable life where everything is planned. Your presence is a strong pillar for any community.",
                    humorousInsight: "Are you the type who panics if you're even one minute late? 'Arriving early and waiting' is your signature move! Unexpected surprises might fluster you, but your reliability brings a deep sense of trust to everyone.",
                    callToAction: "An icon of stability and harmony! Share your orderly mind and bring salvation to your friends' chaotic worlds!",
                    icon: "🛡️",
                    className: "result-order",
                    highScoreSnippet: "Your greatest strength is a deep sense of responsibility that pursues stability and harmony for your community. Your ability to manage situations systematically and minimize risks through predictable planning shines in any organization.",
                    lowScoreSnippet: "You may be overly attached to plans or resistant to unpredictable changes. Try making a spontaneous decision once in a while and discover the new joys that unexpected situations can bring. Flexibility will lead you to a higher level of excellence."
                },
                EMPATHETIC_SOUL: {
                    title: "The Empathetic Soul ❤️",
                    description: "You are a warm-hearted individual with an exceptional ability to deeply understand and empathize with the feelings of others as if they were your own. You prioritize relationships and emotional harmony over logical judgments, and in conflict, you seek a win-win path that considers both sides. Your presence is a great comfort and source of strength for those around you.",
                    shortSummary: "A mirror that reflects the hearts of others! 💖 Your deep empathy provides warm comfort and powerful support to those around you. Wherever you are, there is an energy of understanding and harmony.",
                    humorousInsight: "You cry when your friends are sad and laugh when they are happy! But are you getting so absorbed in others' emotions that your own energy is draining? Remember, sometimes it's necessary to be a little selfish and take care of yourself first.",
                    callToAction: "Does the world need more comfort and understanding? Share your empathetic mind and bring a warm glow to this chilly world!",
                    icon: "❤️",
                    className: "result-emotion",
                    highScoreSnippet: "Your most special talent is your ability to deeply understand and empathize with others' emotions. This allows you to form strong bonds, peacefully resolve conflicts, and become a leader who positively influences those around you.",
                    lowScoreSnippet: "You may find it difficult to make objective judgments or become emotionally exhausted by being too immersed in others' feelings. It is sometimes necessary to take a step back, view situations through a logical lens, and practice protecting your own emotions."
                }
            },
            questions: [] // Questions will be loaded dynamically
            ,
            shareButtons: {
                kakao: "Share KakaoTalk",
                twitter: "Share Twitter",
                facebook: "Share Facebook",
                saveImage: "Save as Image",
                copyResult: "Copy Result"
            },
            admin: {
                confirmDeleteQuestion: "Are you sure you want to delete this question?",
                addQuestionBtn: "Add New Question",
                editFormTitle: "Edit/Add Question",
                questionTextLabel: "Question Text:",
                weightLabel: "Weight (default 1):",
                choicesTitle: "Choices (5 required)",
                addChoiceBtn: "Add Choice",
                saveBtn: "Save",
                cancelBtn: "Cancel",
                choiceTextPlaceholder: "Choice Text",
                noQuestions: "No questions registered.",
                choicesMaxAlert: "You can add a maximum of 5 choices.",
                fillAllFieldsAlert: "Please enter question text and all 5 choices."
            },
            alerts: {
                saveQuestionsError: "Failed to save questions.",
                loadQuestionsError: "Error loading questions. Please ensure 'data/questions.json' exists and is correctly formatted.",
                startTestError: "Could not start test. Not enough questions have been loaded.",
                kakaoShareAlert: "KakaoTalk sharing is currently under development.",
                copySuccess: "Result text copied to clipboard!",
                copyError: "Failed to copy text.",
                weightRangeError: "Weight must be between 0.1 and 3."
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
        showLoading(); // Show loading indicator
        try {
            // First, try to load questions from localStorage
            const storedQuestions = loadQuestionsFromStorage();
            if (storedQuestions) {
                langData.ko.questions = storedQuestions.ko || [];
                langData.en.questions = storedQuestions.en || [];
                console.log("Questions loaded successfully from localStorage.");
                hideLoading(); // Hide loading indicator here as we're done loading
                return; // Exit if questions loaded from localStorage
            }

            // If not in localStorage, fetch from data/questions.json
            const response = await fetch('./data/questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            langData.ko.questions = data.ko;
            langData.en.questions = data.en;
            console.log("Questions loaded successfully from questions.json");
            // Optionally save fetched questions to localStorage for future use
            saveQuestionsToStorage({ ko: data.ko, en: data.en });

        } catch (error) {
            console.error("Error loading questions:", error);
            // Fallback to empty questions or show an error message to the user
            langData.ko.questions = [];
            langData.en.questions = [];
            alert("Error loading questions. Please ensure 'data/questions.json' exists and is correctly formatted, or check localStorage.");
        } finally {
            hideLoading(); // Hide loading indicator regardless of success or failure
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
            document.getElementById('copy-result-btn').innerText = data.shareButtons.copyResult;
        }

        // Update active language button, considering it might be inside the mobile menu
        document.querySelectorAll('#language-switcher .lang-btn, #language-switcher-mobile .lang-btn').forEach(btn => btn.classList.remove('active'));
        if (lang === 'ko') {
            document.getElementById('lang-ko').classList.add('active');
            document.getElementById('lang-ko-mobile').classList.add('active');
        } else if (lang === 'en') {
            document.getElementById('lang-en').classList.add('active');
            document.getElementById('lang-en-mobile').classList.add('active');
        }
        mobileFullScreenMenu.classList.remove('is-open'); // Close mobile menu if open
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
            // currentQuestionIndex = 0; // Removed to prevent resetting question index on language switch
            showQuestion(); 
        } else if (!resultScreen.classList.contains('hidden')) { // If result screen is visible, re-render it for new language
            showResult(); // Recalculate and display result with new language
        } else if (!adminScreen.classList.contains('hidden')) { // If admin screen is visible, re-render it for new language
            renderAdminQuestions(lang);
        }
    }

    function toggleTheme() {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        themeToggleBtn.innerText = isDarkMode ? '🌙' : '☀️';
        themeToggleBtnMobile.innerText = isDarkMode ? '🌙' : '☀️'; // Update mobile theme button
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
            themeToggleBtnMobile.innerText = '🌙'; // Set mobile theme button
        } else {
            body.classList.remove('dark-mode');
            themeToggleBtn.innerText = '☀️';
            themeToggleBtnMobile.innerText = '☀️'; // Set mobile theme button
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
        mobileFullScreenMenu.classList.remove('is-open'); // Close mobile menu when test starts
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
        const siteUrl = window.location.href;

        const highScoreInsight = lastCalculatedResult.primary.highScoreSnippet;
        let lowScoreAdvice = '';
        if (lastCalculatedResult.lowestScoreTypeKey && langData[currentLang].results[lastCalculatedResult.lowestScoreTypeKey]) {
            lowScoreAdvice = langData[currentLang].results[lastCalculatedResult.lowestScoreTypeKey].lowScoreSnippet;
        }
        const humorousInsight = lastCalculatedResult.primary.humorousInsight; // Get humorous insight

        let shareText = `${langData[currentLang].appTitle} ${langData[currentLang].resultScreen.h2}\n${primaryTitle}\n\n`;

        if (highScoreInsight) {
            shareText += `${highScoreInsight}\n\n`;
        }

        if (lowScoreAdvice) {
            shareText += `${lowScoreAdvice}\n\n`;
        }
        
        // Add humorousInsight back if it exists
        if (humorousInsight) {
            shareText += `${humorousInsight}\n\n`;
        }

        if (lastCalculatedResult.secondary && lastCalculatedResult.secondary.length > 0) {
            shareText += currentLang === 'ko' ? "또한, 당신은 다음과 같은 성향을 보입니다:\n" : "Additionally, you show tendencies towards:\n";
            lastCalculatedResult.secondary.forEach(secondary => {
                shareText += ` - ${secondary.data.title}\n`;
            });
        }
        shareText += siteUrl;
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

        resultScreen.classList.remove('hidden');
        document.getElementById('share-buttons').classList.remove('hidden'); // Ensure share buttons are visible

        // Update URL with result type
        const resultType = fullResult.primary.className.replace('result-', '').toUpperCase(); // e.g., LOGIC_MASTER
        const newUrl = `${window.location.origin}${window.location.pathname}?result=${resultType}`;
        history.pushState({ path: newUrl }, '', newUrl);

        drawScoreChart(fullResult.rawScores); // Draw the score chart
        mobileFullScreenMenu.classList.remove('is-open'); // Close mobile menu when result is shown
    }
    
    // Helper function to simulate a result based on URL parameter
    function displayResultFromUrl(resultTypeKey) {
        // Ensure resultTypeKey is valid
        if (!langData[currentLang].results.hasOwnProperty(resultTypeKey)) {
            console.warn(`Invalid resultTypeKey: ${resultTypeKey}. Showing start screen.`);
            goToStartScreen();
            return;
        }

        // Create a dummy scores object. The actual scores don't matter when displaying from URL,
        // as calculateResult will just use the resultTypeKey to get the primary result data.
        // We just need a non-empty scores object to avoid the "all scores are zero" fallback.
        const dummyScores = { logic: 1, emotion: 1, order: 1, chaos: 1 }; 

        // Temporarily set scores to trigger calculateResult to find the primary result type
        // This is a bit of a hack. A better way would be to refactor calculateResult
        // to directly accept a primaryTypeKey. For now, this works.
        const originalScores = { ...scores }; // Store original scores
        scores = { ...dummyScores }; // Set dummy scores

        const fullResult = calculateResult(); // Calculate result based on dummy scores to get primary/secondary data
        lastCalculatedResult = fullResult; // Store for sharing

        // Override primary result with the one from URL parameter
        fullResult.primary = langData[currentLang].results[resultTypeKey];
        fullResult.primary.className = `result-${resultTypeKey.toLowerCase()}`;
        
        // Restore original scores (important if the user goes back to a new test)
        scores = originalScores;

        // Hide other screens and show result screen
        startScreen.classList.add('hidden');
        testScreen.classList.add('hidden');
        adminScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');

        // Populate result screen
        resultTitle.innerText = fullResult.primary.title;
        resultDescription.innerText = fullResult.primary.description;
        resultIcon.innerText = fullResult.primary.icon;
        resultScreen.classList.add(fullResult.primary.className);

        const highScoreInsightDiv = document.getElementById('high-score-insight');
        const lowScoreAdviceDiv = document.getElementById('low-score-advice');
        const shortSummaryDiv = document.getElementById('short-summary');
        const humorousInsightDiv = document.getElementById('humorous-insight');
        const callToActionDiv = document.getElementById('call-to-action');
        const secondaryResultsDiv = document.getElementById('secondary-results');

        highScoreInsightDiv.innerText = fullResult.primary.highScoreSnippet || '';
        highScoreInsightDiv.classList.toggle('hidden', !fullResult.primary.highScoreSnippet);

        lowScoreAdviceDiv.innerText = ''; // Clear for now, as we don't have lowest score from URL
        lowScoreAdviceDiv.classList.add('hidden'); // Hide

        shortSummaryDiv.innerText = fullResult.primary.shortSummary || '';
        shortSummaryDiv.classList.toggle('hidden', !fullResult.primary.shortSummary);

        humorousInsightDiv.innerText = fullResult.primary.humorousInsight || '';
        humorousInsightDiv.classList.toggle('hidden', !fullResult.primary.humorousInsight);

        callToActionDiv.innerText = fullResult.primary.callToAction || '';
        callToActionDiv.classList.toggle('hidden', !fullResult.primary.callToAction);
        
        secondaryResultsDiv.innerHTML = ''; // Clear secondary results when loading from URL
        
        document.getElementById('share-buttons').classList.remove('hidden');
        drawScoreChart(dummyScores); // Draw a dummy chart or hide it if scores are unknown
        mobileFullScreenMenu.classList.remove('is-open');
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
      mobileFullScreenMenu.classList.remove('is-open'); // Close mobile menu when restarting test
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
        adminScreen.classList.add('hidden'); // Also hide admin screen
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
        mobileFullScreenMenu.classList.remove('is-open'); // Close mobile menu when going to start screen
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
    hamburgerMenuBtn.addEventListener('click', () => {
        mobileFullScreenMenu.classList.toggle('is-open');
        // Toggle hamburger icon between '☰' and '✕'
        if (mobileFullScreenMenu.classList.contains('is-open')) {
            hamburgerMenuBtn.innerText = '✕';
        } else {
            hamburgerMenuBtn.innerText = '☰';
        }
    });

    // mobileMenuCloseBtn event listener removed as the button no longer exists

    // Mobile menu specific listeners
    goHomeBtnMobile.addEventListener('click', () => { goToStartScreen(); mobileFullScreenMenu.classList.remove('is-open'); });
    langKoBtnMobile.addEventListener('click', () => { switchLanguage('ko'); mobileFullScreenMenu.classList.remove('is-open'); });
    langEnBtnMobile.addEventListener('click', () => { switchLanguage('en'); mobileFullScreenMenu.classList.remove('is-open'); });
    themeToggleBtnMobile.addEventListener('click', () => { toggleTheme(); mobileFullScreenMenu.classList.remove('is-open'); });
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

    // Add Event Listener for Copy Result Button
    copyResultBtn.addEventListener('click', () => {
        if (!lastCalculatedResult) return; // Ensure there's a result to copy
        const textToCopy = decodeURIComponent(getShareText()); // Decode URL-encoded text for clipboard
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert(currentLang === 'ko' ? "결과 텍스트가 클립보드에 복사되었습니다!" : "Result text copied to clipboard!");
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert(currentLang === 'ko' ? "텍스트 복사에 실패했습니다." : "Failed to copy text.");
            });
    });

    // Admin screen toggle (Ctrl+M or Cmd+M)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'm') { // Ctrl+M or Cmd+M
            e.preventDefault(); // Prevent default browser action for Ctrl+M
            
            // Toggle admin screen visibility
            if (adminScreen.classList.contains('hidden')) {
                // Hide all other main screens
                startScreen.classList.add('hidden');
                testScreen.classList.add('hidden');
                resultScreen.classList.add('hidden');
                // Show admin screen
                adminScreen.classList.remove('hidden');
                currentPageAdmin = 1; // Reset to first page when opening admin screen
                // Load and render questions for admin view
                renderAdminQuestions();
            } else {
                // Hide admin screen
                adminScreen.classList.add('hidden');
                // Show start screen again
                startScreen.classList.remove('hidden');
                // Potentially reset any admin form state
            }
        }
    });

    adminExitBtn.addEventListener('click', () => {
        adminScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
    });

    // Admin Screen Event Listeners (Removed adminLangKoBtn and adminLangEnBtn listeners)

    adminAddQuestionBtn.addEventListener('click', () => {
        // adminQuestionForm.reset(); // HTML form reset won't clear new textareas by ID
        adminQuestionIndex.value = -1; // Indicate new question
        adminQuestionTextKo.value = '';
        adminQuestionTextEn.value = '';
        adminQuestionWeight.value = '1'; // Reset weight to default
        adminChoicesContainer.innerHTML = ''; // Clear choices
        for (let i = 0; i < 5; i++) {
            addChoiceField(i, { text: '', scores: { logic: 0, emotion: 0, order: 0, chaos: 0 } }, { text: '', scores: { logic: 0, emotion: 0, order: 0, chaos: 0 } });
        }
        adminQuestionForm.classList.remove('hidden');
        adminQuestionList.classList.add('hidden');
        adminAddQuestionBtn.classList.add('hidden');
        adminPaginationControls.classList.add('hidden'); // Hide pagination controls
    });

    adminCancelEditBtn.addEventListener('click', () => {
        adminQuestionForm.classList.add('hidden');
        adminQuestionList.classList.remove('hidden');
        adminAddQuestionBtn.classList.remove('hidden');
        // adminQuestionForm.reset(); // HTML form reset won't clear new textareas by ID
        adminQuestionTextKo.value = ''; // Explicitly clear
        adminQuestionTextEn.value = ''; // Explicitly clear
        adminQuestionWeight.value = '1'; // Reset weight to default
        adminChoicesContainer.innerHTML = ''; // Clear choices
        adminPaginationControls.classList.remove('hidden'); // Show pagination controls
    });

    adminQuestionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const questionTextKo = adminQuestionTextKo.value.trim();
        const questionTextEn = adminQuestionTextEn.value.trim();
        const questionWeight = parseFloat(adminQuestionWeight.value);

        // Add validation for questionWeight range (0.1 to 3)
        if (questionWeight < 0.1 || questionWeight > 3) {
            alert(langData[currentLang].admin?.alerts?.weightRangeError || (currentLang === 'ko' ? '가중치는 0.1에서 3 사이의 값만 입력할 수 있습니다.' : 'Weight must be between 0.1 and 3.'));
            return; // Prevent form submission
        }

        const choicesKo = [];
        const choicesEn = [];

        // Collect choices for both languages
        Array.from(adminChoicesContainer.children).forEach(choiceItem => {
            const textInputKo = choiceItem.querySelector('.choice-text-ko');
            const textInputEn = choiceItem.querySelector('.choice-text-en');
            const scoreInputs = choiceItem.querySelectorAll('.score-inputs-wrapper input[type="number"]');
            
            const scores = {};
            scoreInputs.forEach(input => {
                scores[input.dataset.scoreType] = parseInt(input.value) || 0;
            });

            if (textInputKo.value.trim() && textInputEn.value.trim()) { // Ensure both texts are present
                choicesKo.push({
                    text: textInputKo.value.trim(),
                    scores: scores
                });
                choicesEn.push({
                    text: textInputEn.value.trim(),
                    scores: scores
                });
            }
        });

        if (!questionTextKo || !questionTextEn || choicesKo.length < 5) {
            alert(langData[currentLang].admin.fillAllFieldsAlert);
            return;
        }

        const newQuestionKo = {
            text: questionTextKo,
            weight: questionWeight,
            choices: choicesKo
        };

        const newQuestionEn = {
            text: questionTextEn,
            weight: questionWeight,
            choices: choicesEn
        };

        const index = parseInt(adminQuestionIndex.value);

        if (index === -1) { // Add new question
            langData.ko.questions.push(newQuestionKo);
            langData.en.questions.push(newQuestionEn);
        } else { // Edit existing question
            langData.ko.questions[index] = newQuestionKo;
            langData.en.questions[index] = newQuestionEn;
        }

        saveQuestionsToStorage({ ko: langData.ko.questions, en: langData.en.questions });
        renderAdminQuestions(); // Call without lang parameter
        
        adminQuestionForm.classList.add('hidden');
        adminQuestionList.classList.remove('hidden');
        adminAddQuestionBtn.classList.remove('hidden');
        adminPaginationControls.classList.remove('hidden'); // Show pagination controls
        // Reset form fields
        adminQuestionTextKo.value = '';
        adminQuestionTextEn.value = '';
        adminQuestionWeight.value = '1';
        adminChoicesContainer.innerHTML = '';
    });




    // Load questions, then preferences, then generate initial questions, then hide empty ads
    loadQuestions().then(() => {
        loadPreferences(); // Load language and theme preferences

        // Check for URL result parameter AFTER questions and preferences are loaded
        const urlParams = new URLSearchParams(window.location.search);
        const resultParam = urlParams.get('result');

        if (resultParam) {
            displayResultFromUrl(resultParam);
            // Additionally, if a result is directly loaded, we should remove the parameter from the URL
            // to allow users to navigate back to the start screen cleanly.
            history.replaceState(null, '', window.location.pathname);
        } else {
            // After questions are loaded and preferences set, generate initial questions
            if (langData[currentLang] && langData[currentLang].questions && langData[currentLang].questions.length > 0) {
                generateRandomQuestions();
            } else {
                console.error("Initial question generation skipped: Question pool is empty or not properly loaded.");
                // Consider alerting the user or disabling start button if no questions can be loaded
            }
            // Explicitly show the start screen after initial loading is complete
            startScreen.classList.remove('hidden');
        }
    }).catch(error => {
        console.error("An error occurred during initial load sequence:", error);
        alert("Failed to load necessary application data. Please ensure the 'data/questions.json' file is accessible and properly formatted, and try running with a local web server.");
        // Even if there's an error, hide loading and attempt to show start screen
        startScreen.classList.remove('hidden');
    });
});