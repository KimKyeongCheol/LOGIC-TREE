document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const testScreen = document.getElementById('test-screen');
    const resultScreen = document.getElementById('result-screen');

    const startBtn = document.getElementById('start-btn');
    const retryBtn = document.getElementById('retry-btn');

    const questionText = document.getElementById('question-text');
    const answerButtons = document.getElementById('answer-buttons');
    
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');

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
            title: "논리주의 분석가 (Logic Master)",
            description: "당신은 감정이나 혼돈에 휘둘리지 않고, 오직 데이터와 사실에 근거하여 판단하는 냉철한 분석가입니다. 모든 상황을 객관적으로 파악하고 가장 합리적인 해결책을 찾아내는 데 능숙합니다."
        },
        CHAOTIC_AGENT: {
            title: "혼돈의 에이전트 (Chaotic Agent)",
            description: "당신은 예측 불가능하며, 정해진 규칙이나 질서에 얽매이는 것을 싫어합니다. 당신의 행동은 즉흥적이며, 때로는 혼란을 야기하기도 하지만, 그 속에서 새로운 가능성을 발견하기도 하는 자유로운 영혼입니다."
        },
        ORDERLY_GUARDIAN: {
            title: "질서의 수호자 (Orderly Guardian)",
            description: "당신은 사회의 규칙과 질서를 중요하게 생각하며, 안정적인 상태를 유지하는 데서 평안을 느낍니다. 공동체의 이익을 위해 자신을 희생할 줄도 아는, 책임감 강한 수호자입니다."
        },
        EMPATHETIC_SOUL: {
            title: "공감적 중재자 (Empathetic Soul)",
            description: "당신은 타인의 감정을 깊이 이해하고 공감하는 능력이 뛰어납니다. 이성적인 판단보다는 사람 사이의 관계와 감정적인 조화를 중요하게 생각하며, 갈등을 중재하고 사람들을 하나로 모으는 역할을 합니다."
        }
    };

    let currentQuestionIndex = 0;
    let scores = { logic: 0, emotion: 0, order: 0, chaos: 0 };

    function startTest() {
        currentQuestionIndex = 0;
        scores = { logic: 0, emotion: 0, order: 0, chaos: 0 };
        startScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        testScreen.classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionText.innerText = question.text;
        
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
        } else {
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

        testScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
    }
    
    function restartTest() {
      resultScreen.classList.add('hidden');
      startScreen.classList.remove('hidden');
    }

    startBtn.addEventListener('click', startTest);
    retryBtn.addEventListener('click', restartTest);
});