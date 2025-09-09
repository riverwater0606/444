export interface GuidedMeditation {
  id: string;
  title: { en: string; zh: string };
  duration: number;
  category: { en: string; zh: string };
  steps: { en: string[]; zh: string[] };
  benefits: { en: string[]; zh: string[] };
}

export const GUIDED_MEDITATIONS: GuidedMeditation[] = [
  {
    id: "breathing-basic",
    title: { en: "Basic Breathing Meditation", zh: "基礎呼吸冥想" },
    duration: 5,
    category: { en: "Breathing", zh: "呼吸" },
    steps: {
      en: [
        "Find a comfortable sitting position and gently close your eyes",
        "Focus your attention on your breath",
        "Take a deep breath in, counting to 4",
        "Hold your breath, counting to 4",
        "Slowly exhale, counting to 6",
        "Repeat this process 5-10 times",
      ],
      zh: [
        "找一個舒適的坐姿，輕輕閉上眼睛",
        "將注意力放在呼吸上",
        "深深吸氣，數到4",
        "屏住呼吸，數到4",
        "緩緩呼氣，數到6",
        "重複這個過程5-10次",
      ],
    },
    benefits: {
      en: ["Reduce stress", "Improve focus", "Calm the mind"],
      zh: ["減輕壓力", "提高專注力", "平靜心靈"],
    },
  },
  {
    id: "body-scan",
    title: { en: "Body Scan Meditation", zh: "身體掃描冥想" },
    duration: 10,
    category: { en: "Mindfulness", zh: "正念" },
    steps: {
      en: [
        "Lie down or sit in a comfortable position",
        "Starting from the top of your head, slowly feel each part",
        "Notice any tension or discomfort",
        "Imagine breathing into that area",
        "Gradually scan down to your toes",
        "Finally, feel the relaxation throughout your entire body",
      ],
      zh: [
        "躺下或坐在舒適的位置",
        "從頭頂開始，慢慢感受每個部位",
        "注意任何緊張或不適的感覺",
        "想像呼吸流向那個部位",
        "逐漸向下掃描至腳趾",
        "最後感受整個身體的放鬆",
      ],
    },
    benefits: {
      en: ["Release body tension", "Improve body awareness", "Deep relaxation"],
      zh: ["釋放身體緊張", "提高身體覺察", "深度放鬆"],
    },
  },
  {
    id: "loving-kindness",
    title: { en: "Loving-Kindness Meditation", zh: "慈心冥想" },
    duration: 15,
    category: { en: "Compassion", zh: "慈悲" },
    steps: {
      en: [
        "Sit in a comfortable position and close your eyes",
        "Start by saying to yourself: May I be happy, may I be healthy, may I be safe",
        "Imagine someone you love and send them the same wishes",
        "Extend to neutral people (like strangers)",
        "Finally include all beings",
        "Feel this loving energy filling your heart",
      ],
      zh: [
        "坐在舒適的位置，閉上眼睛",
        "先對自己說：願我快樂、願我健康、願我平安",
        "想像一個你愛的人，對他們送出同樣的祝福",
        "擴展到中性的人（如陌生人）",
        "最後包括所有眾生",
        "感受這份慈愛的能量充滿你的心",
      ],
    },
    benefits: {
      en: ["Enhance empathy", "Improve relationships", "Increase happiness"],
      zh: ["增強同理心", "改善人際關係", "提升幸福感"],
    },
  },
  {
    id: "mindful-walking",
    title: { en: "Mindful Walking", zh: "正念行走" },
    duration: 20,
    category: { en: "Movement", zh: "動態冥想" },
    steps: {
      en: [
        "Choose a quiet place to walk",
        "Begin walking slowly, feeling each step",
        "Notice the contact between your feet and the ground",
        "Feel your body's movement and balance",
        "If your mind wanders, gently bring back your attention",
        "Maintain a natural breathing rhythm",
      ],
      zh: [
        "選擇一個安靜的地方行走",
        "開始緩慢行走，感受每一步",
        "注意腳與地面的接觸",
        "感受身體的移動和平衡",
        "如果思緒飄走，溫柔地帶回注意力",
        "保持自然的呼吸節奏",
      ],
    },
    benefits: {
      en: ["Combine exercise with meditation", "Improve present awareness", "Release anxiety"],
      zh: ["結合運動與冥想", "提高當下覺察", "釋放焦慮"],
    },
  },
  {
    id: "chakra-balance",
    title: { en: "Chakra Balancing Meditation", zh: "脈輪平衡冥想" },
    duration: 25,
    category: { en: "Energy", zh: "能量" },
    steps: {
      en: [
        "Sit upright, imagine your spine as an energy channel",
        "Start with the root chakra, visualize red light",
        "Move up to the sacral chakra, visualize orange light",
        "Solar plexus - yellow, heart chakra - green",
        "Throat chakra - blue, third eye - indigo",
        "Crown chakra - purple or white light",
        "Feel all chakras resonating in harmony",
      ],
      zh: [
        "坐直，想像脊椎是一條能量通道",
        "從海底輪開始，想像紅色光芒",
        "向上移動到臍輪，想像橙色光芒",
        "太陽神經叢-黃色，心輪-綠色",
        "喉輪-藍色，眉心輪-靛藍色",
        "頂輪-紫色或白色光芒",
        "感受所有脈輪和諧共振",
      ],
    },
    benefits: {
      en: ["Balance energy", "Enhance spiritual awareness", "Overall harmony"],
      zh: ["平衡能量", "提升靈性覺察", "整體和諧"],
    },
  },
  {
    id: "sleep-meditation",
    title: { en: "Deep Sleep Meditation", zh: "深度睡眠冥想" },
    duration: 30,
    category: { en: "Sleep", zh: "睡眠" },
    steps: {
      en: [
        "Lie in bed and adjust to the most comfortable position",
        "Starting from your toes, gradually relax each part",
        "Imagine yourself lying on a cloud, light and soft",
        "With each exhale, let your body sink deeper into the mattress",
        "Count breaths from 10 to 1, becoming more relaxed",
        "Let thoughts drift by like clouds, without attachment",
      ],
      zh: [
        "躺在床上，調整到最舒適的姿勢",
        "從腳趾開始，逐漸放鬆每個部位",
        "想像自己躺在雲朵上，輕盈柔軟",
        "每次呼氣，讓身體更深地沉入床墊",
        "數息從10倒數到1，越來越放鬆",
        "讓思緒如雲朵般飄過，不執著",
      ],
    },
    benefits: {
      en: ["Improve sleep quality", "Reduce insomnia", "Deep rest"],
      zh: ["改善睡眠質量", "減少失眠", "深度休息"],
    },
  },
];

export const MEDITATION_TIPS = [
  {
    category: "初學者",
    tips: [
      "從短時間開始，每天5-10分鐘即可",
      "選擇固定的時間和地點練習",
      "不要評判自己的想法，只是觀察",
      "使用引導音頻或應用程式輔助",
      "保持耐心，冥想是一個漸進的過程",
    ],
  },
  {
    category: "進階練習",
    tips: [
      "嘗試不同類型的冥想技巧",
      "延長冥想時間至20-30分鐘",
      "參加冥想團體或工作坊",
      "記錄冥想日誌，追蹤進展",
      "將正念融入日常活動中",
    ],
  },
  {
    category: "克服困難",
    tips: [
      "思緒紛亂是正常的，溫柔地帶回注意力",
      "身體不適時可以調整姿勢",
      "昏沉時可以睜開眼睛或坐直",
      "焦躁時縮短時間，循序漸進",
      "尋求指導老師的幫助",
    ],
  },
];

export const BREATHING_TECHNIQUES = [
  {
    name: "4-7-8呼吸法",
    description: "快速放鬆和助眠",
    steps: ["吸氣4秒", "屏息7秒", "呼氣8秒"],
    benefits: ["減輕焦慮", "幫助入睡", "降低血壓"],
  },
  {
    name: "方形呼吸",
    description: "平衡和專注",
    steps: ["吸氣4秒", "屏息4秒", "呼氣4秒", "屏息4秒"],
    benefits: ["提高專注", "情緒穩定", "減壓"],
  },
  {
    name: "腹式呼吸",
    description: "深度放鬆",
    steps: ["手放腹部", "深吸氣讓腹部鼓起", "緩慢呼氣腹部收縮"],
    benefits: ["激活副交感神經", "深度放鬆", "改善消化"],
  },
];

export const MEDITATION_QUOTES = [
  "靜心不是逃避生活，而是更深入地體驗生活。",
  "呼吸是連接身心的橋樑。",
  "當下這一刻，是你唯一真正擁有的時刻。",
  "接納當下的一切，包括你的不完美。",
  "冥想是給心靈的禮物。",
  "在寧靜中，你會找到真正的力量。",
  "每一次呼吸都是新的開始。",
  "放下控制，讓生命自然流動。",
  "慈悲始於對自己的善待。",
  "覺察是改變的第一步。",
];