export type AgeGroup = "elementary" | "middle" | "default";
export type TopicGroup = "art" | "science" | "sports" | "career" | "generic";

export type StarrFieldKey = "S" | "T" | "A" | "R" | "R2";

export type StarrQuestionPreset = {
    label: string;      // 질문 텍스트
    placeholder: string; // 힌트
    example?: string;   // 예시 문장
};

export type StarrPresetMap = {
    [field in StarrFieldKey]: StarrQuestionPreset;
};

export const STARR_PRESETS: Record<
    AgeGroup,
    Record<TopicGroup, StarrPresetMap>
> = {
    elementary: {
        generic: {
            S: { label: "어떤 일이 있었나요?", placeholder: "언제, 어디서 있었던 일인지 말해줄래요?", example: "토요일에 친구들과 학교 운동장에서 축구를 했어요." },
            T: { label: "무엇을 하려고 했나요?", placeholder: "나의 목표나 맡은 역할은 무엇이었나요?", example: "우리 팀이 이기기 위해 골을 넣고 싶었어요." },
            A: { label: "어떻게 행동했나요?", placeholder: "내가 한 행동을 자세히 적어보세요.", example: "친구에게 패스를 잘 해주고, 빈 곳으로 열심히 뛰어갔어요." },
            R: { label: "결과는 어땠나요?", placeholder: "기분이 어땠거나 무슨 일이 생겼나요?", example: "멋진 골을 넣어서 친구들이 박수를 쳐줬어요!" },
            R2: { label: "무엇을 느꼈나요?", placeholder: "새로 알게 된 점이나 아쉬운 점은?", example: "친구들과 힘을 합치면 더 재미있다는 걸 알았어요." }
        },
        art: {
            S: { label: "무엇을 만들거나 그렸나요?", placeholder: "미술 시간이나 집에서 무엇을 했나요?", example: "미술 시간에 '나의 꿈'을 주제로 그림을 그렸어요." },
            T: { label: "어떻게 표현하고 싶었나요?", placeholder: "어떤 모습을 그리고 싶었나요?", example: "우주비행사가 되어 별을 여행하는 모습을 멋지게 그리고 싶었어요." },
            A: { label: "어떤 재료로 어떻게 그렸나요?", placeholder: "사용한 색깔이나 도구를 적어보세요.", example: "반짝이는 크레파스를 사용해 별을 칠하고, 검은색 물감으로 우주를 칠했어요." },
            R: { label: "완성된 작품은 어땠나요?", placeholder: "마음에 들었나요?", example: "선생님이 별이 진짜 빛나는 것 같다고 칭찬해 주셨어요." },
            R2: { label: "만들면서 어떤 생각이 들었나요?", placeholder: "재미있었거나 어려웠던 점은?", example: "꼼꼼하게 색칠하는 게 힘들었지만 완성하니 뿌듯했어요." }
        },
        science: {
            S: { label: "어떤 관찰이나 실험을 했나요?", placeholder: "무엇을 보았거나 실험했나요?", example: "학교 화단에서 개미가 줄지어 가는 것을 관찰했어요." },
            T: { label: "무엇이 궁금했나요?", placeholder: "알아보고 싶었던 점은?", example: "개미들이 어디로 가는지, 무엇을 나르는지 궁금했어요." },
            A: { label: "어떻게 관찰했나요?", placeholder: "자세히 관찰한 방법을 적어보세요.", example: "돋보기를 가지고 개미들의 움직임을 10분 동안 조용히 지켜봤어요." },
            R: { label: "무엇을 발견했나요?", placeholder: "새롭게 알게 된 사실은?", example: "개미들이 과자 부스러기를 힘을 합쳐 집으로 옮기는 걸 봤어요." },
            R2: { label: "관찰하며 어떤 생각이 들었나요?", placeholder: "신기했던 점은 무엇인가요?", example: "작은 개미도 힘을 합치면 무거운 걸 옮길 수 있다는 게 신기했어요." }
        },
        sports: {
            S: { label: "어떤 운동을 했나요?", placeholder: "누구와 어디서 운동했나요?", example: "태권도 학원에서 줄넘기 연습을 했어요." },
            T: { label: "목표는 무엇이었나요?", placeholder: "얼마나 잘하고 싶었나요?", example: "줄넘기 2단 뛰기를 10번 연속으로 성공하고 싶었어요." },
            A: { label: "어떻게 연습했나요?", placeholder: "열심히 노력한 모습을 적어보세요.", example: "발을 가볍게 구르며 타이밍을 맞춰서 계속 연습했어요." },
            R: { label: "성공했나요?", placeholder: "결과가 어땠나요?", example: "처음엔 자꾸 걸렸지만, 마지막엔 12번이나 성공했어요!" },
            R2: { label: "운동을 하며 무엇을 배웠나요?", placeholder: "느낀 점을 적어보세요.", example: "포기하지 않고 계속 연습하면 할 수 있다는 걸 배웠어요." }
        },
        career: {
            S: { label: "어떤 직업 체험을 했나요?", placeholder: "어디를 견학했거나 체험했나요?", example: "소방서 견학을 가서 소방관 아저씨들을 만났어요." },
            T: { label: "무엇을 해보았나요?", placeholder: "체험한 활동은 무엇인가요?", example: "소방복을 입어보고 소화기로 불 끄는 시늉을 해봤어요." },
            A: { label: "어떤 점이 기억에 남나요?", placeholder: "가장 열심히 본 것은?", example: "소방차에 있는 많은 장비들이 어떻게 쓰이는지 설명을 잘 들었어요." },
            R: { label: "체험 후 기분은 어땠나요?", placeholder: "재미있었나요?", example: "무거운 옷을 입고 사람을 구하는 소방관님이 정말 대단해 보였어요." },
            R2: { label: "나중에 어떤 사람이 되고 싶나요?", placeholder: "이 직업에 대해 든 생각은?", example: "저도 나중에 용감하게 다른 사람을 돕는 사람이 되고 싶어요." }
        }
    },
    middle: {
        generic: {
            S: { label: "어떤 상황이었나요?", placeholder: "수행평가, 동아리, 학교 행사 등 구체적인 상황", example: "국어 시간 모둠 과제로 4명이서 UCC 영상을 만들게 되었습니다." },
            T: { label: "해결해야 할 과제는 무엇이었나요?", placeholder: "나의 역할이나 팀의 목표", example: "일주일 안에 시나리오 작성부터 편집까지 마쳐야 했고, 저는 편집을 맡았습니다." },
            A: { label: "어떻게 행동했나요?", placeholder: "내가 기여한 부분이나 노력한 점", example: "친구들의 의견을 모아 자막을 재미있게 넣고, 밤늦게까지 배경음악을 골랐습니다." },
            R: { label: "결과는 어땠나요?", placeholder: "점수, 반응, 완성도 등", example: "반 친구들이 우리 영상을 보고 많이 웃었고, 선생님께 창의적이라는 칭찬을 받았습니다." },
            R2: { label: "무엇을 배울 수 있었나요?", placeholder: "협동, 책임감, 소통 등에 대한 생각", example: "각자 잘하는 걸 맡아서 하니까 훨씬 좋은 결과가 나온다는 걸 느꼈습니다." }
        },
        art: {
            S: { label: "어떤 창작 활동을 했나요?", placeholder: "동아리, 수업, 대회 등", example: "오케스트라 동아리에서 학교 축제 공연을 준비했습니다." },
            T: { label: "어떤 목표를 가졌나요?", placeholder: "완성도, 화음, 개인적인 목표", example: "제가 맡은 플루트 솔로 파트를 실수 없이 완벽하게 연주하는 것이 목표였습니다." },
            A: { label: "어떻게 연습했나요?", placeholder: "구체적인 연습 과정", example: "점심시간마다 음악실에 가서 박자를 맞추는 연습을 반복했습니다." },
            R: { label: "공연 결과는 어땠나요?", placeholder: "관객의 반응이나 나의 만족도", example: "떨렸지만 실수 없이 연주를 마쳤고, 친구들이 멋있다고 해줬습니다." },
            R2: { label: "활동을 통해 성장한 점은?", placeholder: "예술적 감수성이나 태도", example: "꾸준히 연습하면 불안함을 이겨낼 수 있다는 자신감을 얻었습니다." }
        },
        science: {
            S: { label: "어떤 탐구 활동을 했나요?", placeholder: "실험 주제나 동기", example: "과학 수행평가로 '음료수의 설탕 농도 측정' 실험을 했습니다." },
            T: { label: "궁금증이나 목표는 무엇이었나요?", placeholder: "가설 설정", example: "우리가 자주 마시는 탄산음료에 설탕이 얼마나 많이 들어있는지 직접 확인하고 싶었습니다." },
            A: { label: "어떻게 실험했나요?", placeholder: "탐구 과정 및 방법", example: "각 음료수를 끓여서 설탕 결정을 분리해 무게를 비교해 보았습니다." },
            R: { label: "어떤 결과를 얻었나요?", placeholder: "데이터나 결론", example: "생각보다 훨씬 많은 양의 설탕이 나온 것을 보고 정말 놀랐습니다." },
            R2: { label: "탐구를 통해 느낀 점은?", placeholder: "과학적 태도나 실생활 적용", example: "평소에 먹는 간식 성분을 확인하는 습관을 가져야겠다고 생각했습니다." }
        },
        sports: {
            S: { label: "참여한 체육 활동은?", placeholder: "종목, 경기 상황", example: "반 대항 피구 대회에 우리 반 대표로 나갔습니다." },
            T: { label: "어떤 역할을 맡았나요?", placeholder: "전략이나 목표", example: "끝까지 살아남아서 공격 기회를 많이 만드는 것이 목표였습니다." },
            A: { label: "경기 중 어떻게 플레이했나요?", placeholder: "노력한 점", example: "친구들이 공을 피할 수 있게 뒤에서 이름을 불러주고, 공을 잡으면 바로 패스했습니다." },
            R: { label: "경기 결과는?", placeholder: "승패나 분위기", example: "비록 결승에서 졌지만, 우리 반 친구들이 모두 하나가 되어 응원해서 즐거웠습니다." },
            R2: { label: "활동으로 배운 점은?", placeholder: "스포츠맨십, 협동", example: "승패보다 함께 땀 흘리며 최선을 다하는 과정이 더 중요하다는 걸 알았습니다." }
        },
        career: {
            S: { label: "어떤 진로 활동을 했나요?", placeholder: "검사, 상담, 체험 등", example: "진로 심리 검사를 하고 선생님과 상담을 했습니다." },
            T: { label: "알고 싶었던 점은?", placeholder: "고민이나 궁금증", example: "제가 이과 성향인지 문과 성향인지, 어떤 학과가 어울릴지 알고 싶었습니다." },
            A: { label: "어떻게 탐색했나요?", placeholder: "상담 내용이나 찾아본 정보", example: "선생님께 제 흥미 분야를 말씀드리고, 관련 학과가 있는 대학 홈페이지를 찾아봤습니다." },
            R: { label: "무엇을 알게 되었나요?", placeholder: "새로운 정보나 확신", example: "저는 논리적으로 분석하는 걸 좋아해서 컴퓨터 공학이나 통계학과가 어울린다는 결과가 나왔습니다." },
            R2: { label: "앞으로의 계획은?", placeholder: "다짐이나 목표", example: "수학 공부를 더 열심히 해서 데이터 분석가가 되고 싶다는 꿈이 생겼습니다." }
        }
    },
    default: {
        generic: {
            S: { label: "활동 상황 및 동기 (Situation)", placeholder: "동아리, 학생회, 수업 프로젝트 등 구체적인 활동 배경과 참여 계기를 작성하세요.", example: "교내 학술제에서 '지역 사회 문제 해결'을 주제로 한 프로젝트 팀장을 맡았습니다." },
            T: { label: "맡은 역할 및 과제 (Task)", placeholder: "해결해야 했던 문제나 본인의 구체적인 역할을 기술하세요.", example: "팀원 간의 의견 차이를 조율하고, 설문조사를 통해 실질적인 해결 방안을 도출해야 했습니다." },
            A: { label: "구체적 행동 및 노력 (Action)", placeholder: "자료 조사, 갈등 관리, 분석 방법 등 본인의 주도적 행동을 중심으로 서술하세요.", example: "매주 회의록을 작성하여 논의 내용을 시각화하고, 구청 담당자를 직접 인터뷰하여 현실성 있는 대안을 마련했습니다." },
            R: { label: "결과 및 성과 (Result)", placeholder: "수상 실적, 산출물, 수치적 변화 등 객관적인 결과를 작성하세요.", example: "구체적인 정책 제안서가 높은 평가를 받아 학술제 금상을 수상했습니다." },
            R2: { label: "배운 점 및 성장 (Reflection)", placeholder: "자신의 강점 발견, 진로와의 연관성, 가치관의 성장을 기록하세요.", example: "리더로서 경청의 중요성을 배웠으며, 행정 분야로 진로를 구체화하는 계기가 되었습니다." }
        },
        art: {
            S: { label: "창작/예술 활동 배경 (Situation)", placeholder: "작품 제작 의도, 동아리 전시회, 대회 참가 등", example: "미술부 부장으로서 학교 축제 전시회의 기획과 메인 작품 제작을 총괄했습니다." },
            T: { label: "표현 의도 및 목표 (Task)", placeholder: "작품의 주제 의식, 기획상의 난관", example: "청소년의 학업 스트레스를 추상적으로 표현하여 학우들의 공감을 이끌어내고자 했습니다." },
            A: { label: "창작 과정 및 기법 (Action)", placeholder: "재료 선택 이유, 표현 기법, 전시 연출 방식 등", example: "거친 질감의 혼합 재료를 사용하여 불안한 내면을 표현하고, 관객 참여형 전시 코너를 별도로 기획했습니다." },
            R: { label: "평가 및 반응 (Result)", placeholder: "관람객 피드백, 완성도, 수상 여부", example: "많은 친구들이 작품 앞에서 사진을 찍으며 공감해주었고, 전시회 방명록에 100개 이상의 후기가 남았습니다." },
            R2: { label: "예술적 성장 및 의미 (Reflection)", placeholder: "예술관의 변화, 창작 태도 성찰", example: "예술이 개인의 감정을 넘어 타인과 소통하는 강력한 매개체가 됨을 깨달았습니다." }
        },
        science: {
            S: { label: "탐구 동기 및 배경 (Situation)", placeholder: "수업 중 의문점, 동아리 실험, 연구 주제 선정 이유", example: "화학 시간에 배운 '산화-환원 반응'이 실생활에서 어떻게 쓰이는지 궁금해 자율 탐구를 시작했습니다." },
            T: { label: "탐구 목표 및 가설 (Task)", placeholder: "검증하고자 했던 가설, 실험의 목적", example: "과일 껍질을 이용한 천연 전지가 실제로 LED 전구를 켤 수 있을 만큼의 전압을 내는지 확인하고자 했습니다." },
            A: { label: "탐구 과정 및 분석 (Action)", placeholder: "실험 설계, 변인 통제, 데이터 분석 방법", example: "산도가 다른 세 가지 과일을 준비하고, 전극의 종류를 바꿔가며 30회 이상 전압을 측정하여 평균값을 냈습니다." },
            R: { label: "결론 및 산출물 (Result)", placeholder: "실험 결과 데이터, 가설 검증 여부, 보고서 작성", example: "레몬과 구리-아연 전극 조합이 가장 효율이 높음을 입증하고, 실험 결과를 교내 과학 탐구 대회에서 발표했습니다." },
            R2: { label: "과학적 역량 성장 (Reflection)", placeholder: "문제 해결 능력, 비판적 사고, 향후 연구 계획", example: "실패한 데이터를 버리지 않고 오차 원인을 분석하는 과정에서 연구자의 끈기를 배울 수 있었습니다." }
        },
        sports: {
            S: { label: "활동 배경 (Situation)", placeholder: "학교 스포츠 클럽, 체육 대회, 교외 리그", example: "교내 축구 리그에 반 대표 골키퍼로 출전하게 되었습니다." },
            T: { label: "역할 및 목표 (Task)", placeholder: "팀의 전략, 개인적인 기량 목표", example: "이전 경기에서 실점이 많았던 수비 라인을 조율하고 무실점 경기를 하는 것이 목표였습니다." },
            A: { label: "노력 및 팀워크 (Action)", placeholder: "훈련 과정, 경기 중 소통, 멘탈 관리", example: "수비수들과 수신호를 정해 연습하고, 경기 내내 큰 소리로 위치를 잡아주며 사기를 북돋았습니다." },
            R: { label: "경기 결과 (Result)", placeholder: "승패, 개인 기록, 팀의 변화", example: "결승전 승부차기에서 결정적인 선방을 하여 우승에 기여했습니다." },
            R2: { label: "내면의 성장 (Reflection)", placeholder: "협동심, 리더십, 승부욕 조절", example: "화려한 공격수보다 묵묵히 뒤를 지키는 역할도 팀 승리에 필수적이라는 자부심을 느꼈습니다." }
        },
        career: {
            S: { label: "진로 탐색 활동 (Situation)", placeholder: "대학 탐방, 전문가 인터뷰, 직업 체험, 독서", example: "관심 있는 경영학과 교수님의 특강을 듣고 관련 서적을 찾아 읽었습니다." },
            T: { label: "탐구 목적 (Task)", placeholder: "해결하고 싶었던 진로 고민, 구체적인 정보 탐색", example: "경영학이 단순히 돈을 버는 학문이 아니라 조직을 효율적으로 운영하는 리더십 학문인지 확인하고 싶었습니다." },
            A: { label: "탐색 과정 (Action)", placeholder: "구체적인 활동 내용, 생각의 확장", example: "현대 경영학의 트렌드인 ESG 경영에 대해 조사하고, 모의 창업 동아리에서 이를 적용한 사업 계획서를 써보았습니다." },
            R: { label: "활동 결과 (Result)", placeholder: "진로 계획 구체화, 포트폴리오", example: "기업의 사회적 책임에 매력을 느껴 '사회적 기업가'라는 구체적인 꿈을 갖게 되었습니다." },
            R2: { label: "미래 설계 (Reflection)", placeholder: "준비해야 할 역량, 학업 계획", example: "단순한 이윤 창출을 넘어 사회에 기여하는 리더가 되기 위해 경제와 윤리 과목을 깊이 있게 공부해야겠다고 다짐했습니다." }
        }
    }
};
