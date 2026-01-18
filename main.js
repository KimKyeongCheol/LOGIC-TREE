document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const testScreen = document.getElementById('test-screen');
    const resultScreen = document.getElementById('result-screen');

    const startBtn = document.getElementById('start-btn');
    const retryBtn = document.getElementById('retry-btn');

    const questionText = document.getElementById('question-text');
    const answerButtons = document.getElementById('answer-buttons');
    const progressIndicator = document.getElementById('progress-indicator'); // New: Get reference to progress indicator
    
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const resultIcon = document.getElementById('result-icon'); // New: Get reference to icon element

    // 데이터 구조 정의
    const questions = [
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
        }
    ];

    const results = {
        LOGIC_MASTER: {
            title: "논리주의 분석가 🧠",
            description: "당신은 감정이나 불확실성에 휘둘리지 않고, 오직 데이터와 명확한 사실에 근거하여 판단하는 냉철한 마인드의 소유자입니다. 모든 상황을 객관적으로 파악하고 가장 효율적이며 합리적인 해결책을 찾아내는 데 탁월한 능력을 발휘합니다.",
            icon: "🧠", // 뇌 이모지
            className: "result-logic"
        },
        CHAOTIC_AGENT: {
            title: "혼돈의 에이전트 🌪️",
            description: "당신은 예측 불가능한 에너지와 창의력으로 가득 찬 마인드입니다. 정해진 규칙이나 틀에 얽매이는 것을 싫어하며, 즉흥적이고 자유로운 방식으로 새로운 가능성을 탐색합니다. 당신의 행동은 때로는 혼란을 야기하지만, 그 속에서 혁신적인 아이디어가 탄생하곤 합니다.",
            icon: "🌪️", // 토네이도 이모지
            className: "result-chaos"
        },
        ORDERLY_GUARDIAN: {
            title: "질서의 수호자 🛡️",
            description: "당신은 안정과 조화를 최우선으로 생각하는 책임감 강한 마인드입니다. 사회의 규칙과 질서를 중요하게 여기며, 혼란스러운 상황에서도 평정심을 잃지 않고 체계적인 해결책을 모색합니다. 공동체의 안녕을 위해 헌신하며, 모든 것이 제자리에 있을 때 편안함을 느낍니다.",
            icon: "🛡️", // 방패 이모지
            className: "result-order"
        },
        EMPATHETIC_SOUL: {
            title: "공감적 중재자 ❤️",
            description: "당신은 타인의 감정을 깊이 이해하고 공감하는 능력이 뛰어난 따뜻한 마인드입니다. 이성적인 판단보다는 사람 사이의 관계와 감정적인 조화를 중요하게 생각하며, 갈등을 중재하고 모두가 행복할 수 있는 길을 모색합니다. 당신의 존재 자체가 주변 사람들에게 위안과 힘이 됩니다.",
            icon: "❤️", // 하트 이모지
            className: "result-emotion"
        }
    };

    let currentQuestionIndex = 0;
    let scores = { logic: 0, emotion: 0, order: 0, chaos: 0 };

    function startTest() {
        currentQuestionIndex = 0;
        scores = { logic: 0, emotion: 0, order: 0, chaos: 0 };
        startScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        // Clear previous result classes
        resultScreen.classList.remove('result-logic', 'result-chaos', 'result-order', 'result-emotion'); // New: Clear old classes
        testScreen.classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionText.innerText = question.text;
        progressIndicator.innerText = `질문 ${currentQuestionIndex + 1} / ${questions.length}`; // New: Update progress indicator
        
        answerButtons.innerHTML = ''; // 이전 버튼들 삭제
        question.choices.forEach(choice => {
            const button = document.createElement('button');
            button.innerText = choice.text;
            button.classList.add('answer-btn');
            button.addEventListener('click', () => selectAnswer(choice));
            answerButtons.appendChild(button);
        });
    }

    function selectAnswer(choice) {
        // 점수 합산
        for (const key in choice.scores) {
            if (scores.hasOwnProperty(key)) {
                scores[key] += choice.scores[key];
            }
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            showQuestion();
        }

        else {
            showResult();
        }
    }

    function calculateResult() {
        // 가장 높은 점수를 받은 유형 찾기
        const finalScores = Object.entries(scores); // [['logic', 2], ['emotion', 4] ...]
        finalScores.sort((a, b) => b[1] - a[1]); // 점수가 높은 순으로 정렬
        const highestType = finalScores[0][0];

        switch(highestType) {
            case 'logic': return results.LOGIC_MASTER;
            case 'chaos': return results.CHAOTIC_AGENT;
            case 'order': return results.ORDERLY_GUARDIAN;
            case 'emotion': return results.EMPATHETIC_SOUL;
            default: return results.LOGIC_MASTER; // 기본값
        }
    }

    function showResult() {
        const finalResult = calculateResult();
        resultTitle.innerText = finalResult.title;
        resultDescription.innerText = finalResult.description;
        resultIcon.innerText = finalResult.icon; // New: Set icon text
        resultScreen.classList.add(finalResult.className); // New: Add specific class to result screen

        testScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
    }
    
    function restartTest() {
      resultScreen.classList.add('hidden');
      startScreen.classList.remove('hidden');
      // Clear previous result classes when restarting
      resultScreen.classList.remove('result-logic', 'result-chaos', 'result-order', 'result-emotion'); // New: Clear old classes
    }

    startBtn.addEventListener('click', startTest);
    retryBtn.addEventListener('click', restartTest);
});