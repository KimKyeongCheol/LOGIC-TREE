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

    let currentQuestionIndex = 0;
    let scores = { logic: 0, emotion: 0, order: 0, chaos: 0 };
    let currentLang = 'ko';
    let currentTestQuestions = [];

    const NUM_QUESTIONS_PER_TEST = 5; // Number of questions to show per test run

    // --- Language Data ---
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
            questions: [
                {
                    text: "길을 가다가 값비싸 보이는 지갑을 주웠다...",
                    choices: [
                        { text: "가까운 경찰서에 바로 가져다준다.", scores: { order: 1 } },
                        { text: "주인을 찾아주기 위해 지갑을 열어 신분증을 확인한다.", scores: { chaos: 1, emotion: 1 } },
                        { text: "내용물만 챙기고 지갑은 버린다.", scores: { chaos: 2 } },
                        { text: "고민하다가 일단 주머니에 넣고 계속 길을 간다.", scores: { logic: 1, chaos: 1 } }
                    ]
                },
                {
                    text: "팀 프로젝트에서 아무도 힘든 역할을 맡으려 하지 않는다...",
                    choices: [
                        { text: "모두를 위해 내가 총대를 메고 힘든 역할을 자처한다.", scores: { emotion: 1, order: 1 } },
                        { text: "가장 합리적이고 공정한 방법으로 역할을 분담하자고 제안한다.", scores: { logic: 2 } },
                        { text: "일단 상황을 지켜보다가, 누군가 하겠지 하고 기다린다.", scores: { chaos: 1 } },
                        { text: "이 상황을 재밌어하며, 누가 맡게 될지 내기를 제안한다.", scores: { chaos: 2, emotion: 1 } }
                    ]
                },
                {
                    text: "내일이 세상의 마지막 날이라는 것이 확실해졌다...",
                    choices: [
                        { text: "사랑하는 사람들과 마지막 순간을 함께 보낸다.", scores: { emotion: 2 } },
                        { text: "혼란 속에서 질서를 유지하기 위해 사람들을 돕는다.", scores: { order: 2 } },
                        { text: "평소에 해보고 싶었던 모든 일(합법 또는 불법)을 시도한다.", scores: { chaos: 2 } },
                        { text: "이 현상이 과학적으로 가능한지, 어떻게든 살아남을 방법은 없는지 분석한다.", scores: { logic: 2 } }
                    ]
                },
                {
                    text: "매우 중요한 시험 전날, 친구가 급한 고민 상담을 요청했다...",
                    choices: [
                        { text: "시험이 중요하지만, 친구를 외면할 수 없어 이야기를 들어준다.", scores: { emotion: 2 } },
                        { text: "친구에게 상황을 설명하고, 시험이 끝난 직후에 바로 만나자고 약속한다.", scores: { logic: 1, order: 1 } },
                        { text: "일단 공부를 계속하며, 메시지로 간간이 답장해준다.", scores: { logic: 2 } },
                        { text: "모르겠다. 일단 같이 술이나 한잔하자고 한다.", scores: { chaos: 2 } }
                    ]
                },
                {
                    text: "새로운 취미를 시작하려고 한다...",
                    choices: [
                        { text: "여러 취미를 탐색하며 즉흥적으로 끌리는 것에 도전한다.", scores: { chaos: 1 } },
                        { text: "흥미와 비용, 시간 효율 등을 따져 가장 합리적인 취미를 선택한다.", scores: { logic: 1 } },
                        { text: "이미 많은 사람들이 즐기며 체계가 잘 잡힌 취미를 선택한다.", scores: { order: 1 } },
                        { text: "주변 친구들이나 지인들이 추천하는 취미를 함께 시작한다.", scores: { emotion: 1 } }
                    ]
                },
                {
                    text: "어려운 문제에 부딪혔을 때...",
                    choices: [
                        { text: "문제의 원인을 철저히 분석하고 해결책을 논리적으로 찾아낸다.", scores: { logic: 2 } },
                        { text: "직관에 따라 여러 방법을 시도해보고 되는대로 밀고 나간다.", scores: { chaos: 2 } },
                        { text: "정해진 절차나 매뉴얼에 따라 차근차근 해결한다.", scores: { order: 2 } },
                        { text: "주변 사람들과 상의하며 도움을 요청한다.", scores: { emotion: 2 } }
                    ]
                },
                {
                    text: "친구가 힘들어할 때...",
                    choices: [
                        { text: "친구의 감정에 공감하며 위로해준다.", scores: { emotion: 2 } },
                        { text: "친구의 문제 상황을 객관적으로 듣고 해결책을 제시한다.", scores: { logic: 2 } },
                        { text: "친구에게 힘내라고 격려하며 함께 시간을 보낸다.", scores: { order: 1, emotion: 1 } },
                        { text: "술이나 한잔하자고 하며 분위기를 전환하려 한다.", scores: { chaos: 2 } }
                    ]
                },
                {
                    text: "예상치 못한 상황으로 계획이 틀어졌다...",
                    choices: [
                        { text: "침착하게 상황을 분석하고 새로운 계획을 세운다.", scores: { logic: 2 } },
                        { text: "뜻밖의 즐거움이 있을지도? 하며 변화를 받아들인다.", scores: { chaos: 2 } },
                        { text: "흐트러진 계획을 수습하고 원래의 목표를 향해 나아간다.", scores: { order: 2 } },
                        { text: "실망하지만, 이내 주변 사람들과 함께 극복하려 한다.", scores: { emotion: 2 } }
                    ]
                },
                {
                    text: "새로운 사람을 만났을 때...",
                    choices: [
                        { text: "상대방의 표정과 말투에서 감정 상태를 먼저 파악한다.", scores: { emotion: 1 } },
                        { text: "상대방의 배경이나 정보 등을 먼저 파악하여 관계의 틀을 세운다.", scores: { logic: 1 } },
                        { text: "대화의 흐름에 몸을 맡기고 편안하게 교류한다.", scores: { chaos: 1 } },
                        { text: "예의와 격식을 갖춰 조심스럽게 관계를 시작한다.", scores: { order: 1 } }
                    ]
                },
                {
                    text: "휴가를 계획한다면...",
                    choices: [
                        { text: "모든 동선과 예산을 철저히 계획하여 효율적인 휴가를 만든다.", scores: { logic: 2 } },
                        { text: "가보고 싶은 곳 몇 군데만 정하고, 나머지는 즉흥적으로 결정한다.", scores: { chaos: 2 } },
                        { text: "유명 관광지나 검증된 코스를 따라 안전하게 휴가를 보낸다.", scores: { order: 2 } },
                        { text: "함께 가는 사람들의 의견을 최대한 수렴하여 모두가 만족하는 휴가를 만든다.", scores: { emotion: 2 } }
                    ]
                },
                {
                    text: "오랜 시간 공들인 프로젝트가 실패로 돌아갔다...",
                    choices: [
                        { text: "실패의 원인을 분석하고 다음 프로젝트에 반영한다.", scores: { logic: 2 } },
                        { text: "이럴 수도 있지' 하며 훌훌 털고 다른 새로운 도전을 찾는다.", scores: { chaos: 2 } },
                        { text: "좌절하지만, 곧 다시 계획을 세워 재도전을 준비한다.", scores: { order: 2 } },
                        { text: "함께 고생한 팀원들의 사기를 먼저 살핀다.", scores: { emotion: 2 } }
                    ]
                },
                {
                    text: "어떤 물건을 살 때...",
                    choices: [
                        { text: "가성비, 기능, 내구성을 꼼꼼히 따져보고 구매한다.", scores: { logic: 2 } },
                        { text: "그때그때 마음에 드는 것을 바로 구매한다.", scores: { chaos: 2 } },
                        { text: "유명 브랜드나 검증된 제품을 선호한다.", scores: { order: 2 } },
                        { text: "주변 사람들이 좋다고 하는 것을 구매한다.", scores: { emotion: 2 } }
                    ]
                },
                {
                    text: "주말에 갑자기 계획이 비었다...",
                    choices: [
                        { text: "평소 미뤄뒀던 자기계발이나 공부를 한다.", scores: { logic: 2 } },
                        { text: "즉흥적으로 친구들을 만나거나 새로운 곳으로 떠난다.", scores: { chaos: 2 } },
                        { text: "집안일을 하거나 정해진 루틴대로 시간을 보낸다.", scores: { order: 2 } },
                        { text: "가족이나 연인과 함께 시간을 보내려 한다.", scores: { emotion: 2 } }
                    ]
                },
                {
                    text: "팀원 중 한 명이 실수를 반복한다...",
                    choices: [
                        { text: "문제의 원인을 파악하고 해결을 위한 구체적인 피드백을 준다.", scores: { logic: 2 } },
                        { text: "솔직하게 실망감을 표현하며, 변화를 요구한다.", scores: { emotion: 2 } },
                        { text: "팀의 규칙과 절차를 다시 강조하며 준수를 요구한다.", scores: { order: 2 } },
                        { text: "실수를 덮어주고, 나중에 만회할 기회를 준다.", scores: { chaos: 2 } }
                    ]
                },
                {
                    text: "오랫동안 연락 없던 친구에게서 갑자기 연락이 왔다...",
                    choices: [
                        { text: "연락 온 목적이 무엇인지 먼저 파악한다.", scores: { logic: 2 } },
                        { text: "반가운 마음에 바로 만나자고 제안한다.", scores: { emotion: 2 } },
                        { text: "혹시 무슨 일이 있는 건 아닐지 걱정하며 조심스럽게 대한다.", scores: { order: 2 } },
                        { text: "무슨 말을 할지 기대하며 일단 만난다.", scores: { chaos: 2 } }
                    ]
                }
            ]
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
            questions: [
                {
                    text: "You found a valuable-looking wallet on the street...",
                    choices: [
                        { text: "Immediately take it to the nearest police station.", scores: { order: 1 } },
                        { text: "Open the wallet to find ID and return it to the owner.", scores: { chaos: 1, emotion: 1 } },
                        { text: "Take only the contents and discard the wallet.", scores: { chaos: 2 } },
                        { text: "Hesitate, put it in your pocket for now, and keep walking.", scores: { logic: 1, chaos: 1 } }
                    ]
                },
                {
                    text: "In a team project, no one wants to take on a difficult role...",
                    choices: [
                        { text: "I volunteer for the tough role for the sake of everyone.", scores: { emotion: 1, order: 1 } },
                        { text: "I suggest a rational and fair method to distribute roles.", scores: { logic: 2 } },
                        { text: "I'll observe the situation, assuming someone else will do it.", scores: { chaos: 1 } },
                        { text: "I find the situation amusing and propose a bet on who will take the role.", scores: { chaos: 2, emotion: 1 } }
                    ]
                },
                {
                    text: "It's certain that tomorrow is the last day of the world...",
                    choices: [
                        { text: "Spend the last moments with loved ones.", scores: { emotion: 2 } },
                        { text: "Help people maintain order amidst chaos.", scores: { order: 2 } },
                        { text: "Try everything I've always wanted to do (legal or illegal).", scores: { chaos: 2 } },
                        { text: "Analyze if this phenomenon is scientifically possible, and if there's any way to survive.", scores: { logic: 2 } }
                    ]
                },
                {
                    text: "The day before a very important exam, a friend urgently asks for advice...",
                    choices: [
                        { text: "The exam is important, but I can't ignore a friend, so I listen.", scores: { emotion: 2 } },
                        { text: "I explain the situation to my friend and promise to meet right after the exam.", scores: { logic: 1, order: 1 } },
                        { text: "I continue studying, replying to messages occasionally.", scores: { logic: 2 } },
                        { text: "I don't know. I just suggest having a drink together.", scores: { chaos: 2 } }
                    ]
                },
                {
                    text: "You're about to start a new hobby...",
                    choices: [
                        { text: "Explore various hobbies and spontaneously try what appeals.", scores: { chaos: 1 } },
                        { text: "Consider interest, cost, and time efficiency to choose the most rational hobby.", scores: { logic: 1 } },
                        { text: "Choose a well-established hobby that many people already enjoy.", scores: { order: 1 } },
                        { text: "Start a hobby together with friends or acquaintances who recommend it.", scores: { emotion: 1 } }
                    ]
                },
                {
                    text: "When faced with a difficult problem...",
                    choices: [
                        { text: "Thoroughly analyze the root cause and logically find a solution.", scores: { logic: 2 } },
                        { text: "Try various methods intuitively and push forward as it goes.", scores: { chaos: 2 } },
                        { text: "Solve it step-by-step according to established procedures or manuals.", scores: { order: 2 } },
                        { text: "Consult with people around you and ask for help.", scores: { emotion: 2 } }
                    ]
                },
                {
                    text: "When a friend is having a hard time...",
                    choices: [
                        { text: "Empathize with their feelings and comfort them.", scores: { emotion: 2 } },
                        { text: "Listen objectively to their problem and offer solutions.", scores: { logic: 2 } },
                        { text: "Encourage them and spend time together.", scores: { order: 1, emotion: 1 } },
                        { text: "Suggest having a drink to change the mood.", scores: { chaos: 2 } }
                    ]
                },
                {
                    text: "Unexpected circumstances disrupt your plans...",
                    choices: [
                        { text: "Calmly analyze the situation and make new plans.", scores: { logic: 2 } },
                        { text: "Think 'there might be unexpected fun!' and embrace the change.", scores: { chaos: 2 } },
                        { text: "Rectify the disrupted plans and proceed towards the original goal.", scores: { order: 2 } },
                        { text: "Disappointed, but soon overcome it with friends.", scores: { emotion: 2 } }
                    ]
                },
                {
                    text: "When meeting new people...",
                    choices: [
                        { text: "First, gauge their emotional state from their expression and tone.", scores: { emotion: 1 } },
                        { text: "First, understand their background or information to set a framework for the relationship.", scores: { logic: 1 } },
                        { text: "Let the conversation flow naturally and interact comfortably.", scores: { chaos: 1 } },
                        { text: "Start the relationship carefully with courtesy and formality.", scores: { order: 1 } }
                    ]
                },
                {
                    text: "If you were to imagine the future...",
                    choices: [
                        { text: "Set clear goals and establish a step-by-step plan.", scores: { order: 2 } },
                        { text: "Think 'it'll work out somehow!' and enjoy going with the flow.", scores: { chaos: 2 } },
                        { text: "Keep various possibilities open and prepare to adapt flexibly.", scores: { logic: 2 } },
                        { text: "Dream of a happy and stable future together with loved ones.", scores: { emotion: 2 } }
                    ]
                },
                {
                    text: "A long-term project fails...",
                    choices: [
                        { text: "Analyze the cause of failure and apply it to the next project.", scores: { logic: 2 } },
                        { text: "Brush it off, thinking 'these things happen,' and look for new challenges.", scores: { chaos: 2 } },
                        { text: "Frustrated, but soon prepare for a re-challenge by planning again.", scores: { order: 2 } },
                        { text: "First, check the morale of the team members who worked hard together.", scores: { emotion: 2 } }
                    ]
                },
                {
                    text: "When buying an item...",
                    choices: [
                        { text: "Carefully consider cost-effectiveness, function, and durability before purchase.", scores: { logic: 2 } },
                        { text: "Buy whatever catches my eye at the moment.", scores: { chaos: 2 } },
                        { text: "Prefer well-known brands or verified products.", scores: { order: 2 } },
                        { text: "Buy what people around me recommend.", scores: { emotion: 2 } }
                    ]
                },
                {
                    text: "Your weekend suddenly became free...",
                    choices: [
                        { text: "Catch up on self-development or studies I've been putting off.", scores: { logic: 2 } },
                        { text: "Spontaneously meet friends or go somewhere new.", scores: { chaos: 2 } },
                        { text: "Do housework or spend time following a fixed routine.", scores: { order: 2 } },
                        { text: "Spend time with family or a loved one.", scores: { emotion: 2 } }
                    ]
                },
                {
                    text: "One team member repeatedly makes mistakes...",
                    choices: [
                        { text: "Identify the cause of the problem and give specific feedback for a solution.", scores: { logic: 2 } },
                        { text: "Honestly express disappointment and demand change.", scores: { emotion: 2 } },
                        { text: "Re-emphasize team rules and procedures, demanding compliance.", scores: { order: 2 } },
                        { text: "Cover up the mistake and give them a chance to make up for it later.", scores: { chaos: 2 } }
                    ]
                },
                {
                    text: "A friend you haven't heard from in a long time suddenly contacts you...",
                    choices: [
                        { text: "First, ascertain the purpose of their contact.", scores: { logic: 2 } },
                        { text: "Happily suggest meeting immediately.", scores: { emotion: 2 } },
                        { text: "Treat them carefully, worrying if something is wrong.", scores: { order: 2 } },
                        { text: "Meet them, anticipating what they might say.", scores: { chaos: 2 } }
                    ]
                }
            ]
        }
    };

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function updateUI(lang) {
        const data = langData[lang];
        document.title = data.appTitle;
        mainH1.innerText = data.appTitle;
        
        // Start Screen
        if (startScreen.querySelector('h2')) startScreen.querySelector('h2').innerText = data.startScreen.h2;
        if (startScreen.querySelector('p')) startScreen.querySelector('p').innerText = data.startScreen.p;
        startBtn.innerText = data.startButton;

        // Result Screen
        if (resultScreen.querySelector('h2')) resultScreen.querySelector('h2').innerText = data.resultScreen.h2;
        retryBtn.innerText = data.retryButton;

        // Update current question text if on test screen or if we are about to start
        if (!testScreen.classList.contains('hidden')) { // Fixed: Only update if test screen is visible
            showQuestion(); // This will re-render the question and progress for currentTestQuestions
        } else if (!resultScreen.classList.contains('hidden')) {
             // If result screen is visible, update result texts
            const finalResult = calculateResult(); // Recalculate based on current scores but use localized data
            resultTitle.innerText = finalResult.title;
            resultDescription.innerText = finalResult.description;
            resultIcon.innerText = finalResult.icon;
        } else if (!startScreen.classList.contains('hidden')) {
            // If start screen is visible, update result texts for start screen (already updated above)
        }
        // If result screen is visible, update result texts
        // This was a duplicate call from above, removed

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
        // Do NOT regenerate currentTestQuestions here if test is active
        if (testScreen.classList.contains('hidden')) { // Only regenerate if test is not active
            generateRandomQuestions();
        }
        updateUI(lang);
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
        generateRandomQuestions(); // Generate initial questions based on loaded lang
        updateUI(currentLang);
    }

    function generateRandomQuestions() {
        const fullQuestionPool = langData[currentLang].questions;
        const shuffledPool = shuffleArray([...fullQuestionPool]);
        currentTestQuestions = shuffledPool.slice(0, NUM_QUESTIONS_PER_TEST);
    }

    function startTest() {
        currentQuestionIndex = 0;
        scores = { logic: 0, emotion: 0, order: 0, chaos: 0 };
        generateRandomQuestions();
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
        questionData.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.innerText = choice.text;
            button.classList.add('answer-btn');
            button.addEventListener('click', () => selectAnswer(choice));
            answerButtons.appendChild(button);
        });
    }

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
        const finalScores = Object.entries(scores);
        finalScores.sort((a, b) => b[1] - a[1]);
        const highestType = finalScores[0][0];

        return langData[currentLang].results[highestType];
    }

    function showResult() {
        const finalResult = calculateResult();
        resultTitle.innerText = finalResult.title;
        resultDescription.innerText = finalResult.description;
        resultIcon.innerText = finalResult.icon;
        resultScreen.classList.add(finalResult.className);

        testScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
    }
    
    function restartTest() {
      resultScreen.classList.add('hidden');
      startScreen.classList.remove('hidden');
      resultScreen.classList.remove('result-logic', 'result-chaos', 'result-order', 'result-emotion');
    }

    // --- Event Listeners ---
    startBtn.addEventListener('click', startTest);
    retryBtn.addEventListener('click', restartTest);
    themeToggleBtn.addEventListener('click', toggleTheme);
    langKoBtn.addEventListener('click', () => switchLanguage('ko'));
    langEnBtn.addEventListener('click', () => switchLanguage('en'));

    // Load user preferences on initial load
    loadPreferences();
});