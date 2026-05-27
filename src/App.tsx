import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Heart,
  Search,
  Compass,
  User,
  Languages,
  Flame,
  Play,
  Square,
  Home as HomeIcon,
  Sparkles,
  Award,
  BookOpen,
  HelpCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  MapPin,
  Bell,
  MessageCircle,
  Plus,
  Bookmark,
  Activity,
  Check,
  Volume2,
  Info,
  Pause,
  SkipBack,
  SkipForward,
  VolumeX,
  ArrowLeft
} from "lucide-react";
import { Language, YogaAsana, ChatMessage, CommonSymptom } from "./types";
import { translations } from "./translations";
import suryaNamaskaraImg from "./assets/surya_namaskara.png";

// Initial set of common issues that can instantly be queried
const COMMON_SYMPTOMS: CommonSymptom[] = [
  {
    id: "backpain",
    localTitle: {
      English: "Back Pain",
      Telugu: "వెన్నునొప్పి",
      Hindi: "पीठ दर्द"
    },
    englishTitle: "Back Pain",
    iconName: "personal_injury",
    bgColorClass: "bg-emerald-50 hover:bg-emerald-100",
    hoverColorClass: "hover:bg-[#ccebc8]/20",
    avatarColorClass: "bg-[#ccebc8]/40 text-[#4a654a]",
    textAccentColorClass: "text-[#4a654a]"
  },
  {
    id: "stress",
    localTitle: {
      English: "Stress Relief",
      Telugu: "ఒత్తిడి నివారణ",
      Hindi: "तनाव मुक्ति"
    },
    englishTitle: "Stress Relief",
    iconName: "psychology",
    bgColorClass: "bg-indigo-50 hover:bg-indigo-100",
    hoverColorClass: "hover:bg-[#e2dfff]/40",
    avatarColorClass: "bg-[#e2dfff]/60 text-[#5b5b81]",
    textAccentColorClass: "text-[#5b5b81]"
  },
  {
    id: "digestion",
    localTitle: {
      English: "Better Digestion",
      Telugu: "జీర్ణక్రియ పెంపు",
      Hindi: "पाचन में सुधार"
    },
    englishTitle: "Better Digestion",
    iconName: "body_system",
    bgColorClass: "bg-[#d2d0fd]/20 hover:bg-[#d2d0fd]/40",
    hoverColorClass: "hover:bg-[#d2d0fd]/40",
    avatarColorClass: "bg-[#d2d0fd]/60 text-[#5b5b81]",
    textAccentColorClass: "text-[#5b5b81]"
  },
  {
    id: "flexibility",
    localTitle: {
      English: "Flexibility",
      Telugu: "వశ్యత & సాగదీత",
      Hindi: "लचीलापन"
    },
    englishTitle: "Flexibility",
    iconName: "self_improvement",
    bgColorClass: "bg-amber-50 hover:bg-amber-100",
    hoverColorClass: "hover:bg-[#ccebc8]/20",
    avatarColorClass: "bg-[#b0ceae]/40 text-[#4a654a]",
    textAccentColorClass: "text-[#4a654a]"
  }
];

// Reference static libraries if search fails or to let users browse instantly
const FOUNDATIONAL_ASANAS: Record<Language, YogaAsana[]> = {
  English: [
    {
      englishName: "Cobra Pose",
      sanskritName: "Bhujangasana",
      localName: "Cobra Pose (Bhujangasana)",
      benefits: "Deeply opens chest, massages spine alignment, combats sitting fatigue.",
      difficulty: "Beginner",
      duration: "5-10 soft breaths",
      steps: [
        "Lie face down, chin resting on the floor and feet together.",
        "Keep hands flat on the mat directly below the shoulders.",
        "Inhale and lift your upper trunk, letting your back support the raise.",
        "Roll shoulders back, lookup softly, and breathe."
      ],
      breathingCue: "Inhale to raise the spine, exhale to hold steady without tensing shoulders.",
      contraindications: "Avoid in case of active spinal inflammation, wrist syndromes, or pregnancy."
    },
    {
      englishName: "Child's Pose",
      sanskritName: "Balasana",
      localName: "Child's Pose (Balasana)",
      benefits: "Instantly slows down heart rates, releases hips and lower back load.",
      difficulty: "Beginner",
      duration: "2-3 minutes",
      steps: [
        "Take a kneeling position on the mat, sitting directly back on heels.",
        "Gently separate your knees and lean forward.",
        "Rest forehead on the floor and stretch arms straight in front."
      ],
      breathingCue: "Breathe deeply into the back body, feeling the rib cage expand.",
      contraindications: "Avoid during acute knee injuries or dynamic diarrheal symptoms."
    },
    {
      englishName: "Bridge Pose",
      sanskritName: "Setu Bandhasana",
      localName: "Bridge Pose (Setu Bandhasana)",
      benefits: "Strengthens pelvic floor legs, neutralizes sitting stress, expands lungs.",
      difficulty: "Intermediate",
      duration: "5-8 breaths",
      steps: [
        "Lie flat on your back, knees bent, feet hip-width on the floor.",
        "Extend arms sideways with palms flat near your hips.",
        "Inhale, push your heels down, and elevate hips high.",
        "Keep neck loose, expand chest."
      ],
      breathingCue: "Engage lower belly and keep a continuous smooth inhalation cycle.",
      contraindications: "Avoid with heavy cervical neck pain or recent abdominal concerns."
    },
    {
      englishName: "Downward-Facing Dog",
      sanskritName: "Adho Mukha Svanasana",
      localName: "Downward-Facing Dog (Adho Mukha Svanasana)",
      benefits: "Stretches shoulders, hamstrings, and calves, while energizing the body.",
      difficulty: "Beginner",
      duration: "1-2 minutes",
      steps: [
        "Start on hands and knees, knees under hips.",
        "Tuck your toes under, lift hips high and back.",
        "Press heels down towards mat, look at your navel."
      ],
      breathingCue: "Breathe slowly and expand chest; exhale to sink heels lower.",
      contraindications: "Avoid with carpal tunnel, late pregnancy, or high blood pressure."
    },
    {
      englishName: "Triangle Pose",
      sanskritName: "Trikonasana",
      localName: "Triangle Pose (Trikonasana)",
      benefits: "Improves balance, opens chest and hips, strengthens thighs.",
      difficulty: "Beginner",
      duration: "30-60 seconds",
      steps: [
        "Stand feet wide, turn right foot out 90 degrees.",
        "Extend arms, reach to the right side, lower right hand to shin.",
        "Reach left arm straight up towards sky."
      ],
      breathingCue: "Breathe into the chest, feel expansion on side ribs.",
      contraindications: "Avoid with severe neck pain or low blood pressure."
    },
    {
      englishName: "Tree Pose",
      sanskritName: "Vrksasana",
      localName: "Tree Pose (Vrksasana)",
      benefits: "Enhances physical balance, strengthens ankles and spine.",
      difficulty: "Beginner",
      duration: "1 minute per leg",
      steps: [
        "Stand tall, shift weight to your left leg.",
        "Place sole of right foot on inner left thigh or calf.",
        "Bring hands to heart center or reach them overhead."
      ],
      breathingCue: "Focus on a fixed point, breathe steady to maintain balance.",
      contraindications: "Avoid with active migraine or low blood pressure."
    },
    {
      englishName: "Plank Pose",
      sanskritName: "Phalakasana",
      localName: "Plank Pose (Phalakasana)",
      benefits: "Deeply strengthens the core, shoulders, and wrists.",
      difficulty: "Intermediate",
      duration: "30-60 seconds",
      steps: [
        "Start in table top, step feet straight back.",
        "Keep shoulders directly above wrists, body in a line.",
        "Engage core, do not sag hips."
      ],
      breathingCue: "Breathe slowly and keep core actively engaged.",
      contraindications: "Avoid with carpal tunnel or shoulder injury."
    },
    {
      englishName: "Legs-Up-The-Wall",
      sanskritName: "Viparita Karani",
      localName: "Legs-Up-The-Wall (Viparita Karani)",
      benefits: "Relieves tired legs, stretches back, calms nervous system.",
      difficulty: "Beginner",
      duration: "5-15 minutes",
      steps: [
        "Sit close to wall, lie on back.",
        "Extend legs straight up against the wall.",
        "Rest arms out sideways, palms facing up."
      ],
      breathingCue: "Inhale peace, exhale and completely surrender tension.",
      contraindications: "Avoid with serious eye disorders like glaucoma."
    }
  ],
  Telugu: [
    {
      englishName: "Cobra Pose",
      sanskritName: "Bhujangasana",
      localName: "భుజంగాసనం (Bhujangasana)",
      benefits: "నడుము లేదా వెన్నునొప్పి నుండి గొప్ప ఉపశమనం ఇస్తుంది, వెన్నెముకను దృఢపరుస్తుంది.",
      difficulty: "ప్రారంభ స్థాయి (Beginner)",
      duration: "5-10 లయబద్ధమైన శ్వాసలు",
      steps: [
        "నేలపై బోర్లా పడుకుని కాళ్లు చాచి ఉంచాలి.",
        "చేతి అరచేతులను భుజాల కింద నేలపై స్థిరంగా ఆనించాలి.",
        "నెమ్మదిగా శ్వాస పీల్చుకుంటూ తల, ఛాతీ పైకి లేపాలి.",
        "భుజాలు వెనక్కి లాగి ఉంచి ప్రశాంతంగా శ్వాస తీసుకోండి."
      ],
      breathingCue: "పైకి లేచేటప్పుడు శ్వాస పీల్చుకోండి, ఆవరణలో ఉన్నప్పుడు స్థిరంగా ఉండండి.",
      contraindications: "తీవ్రమైన కడుపు నొప్పి ఉన్నవారు లేదా గర్భిణీలు ఈ ఆసనాన్ని చేయరాదు."
    },
    {
      englishName: "Child's Pose",
      sanskritName: "Balasana",
      localName: "బాలాసనం (Balasana)",
      benefits: "మెదడు నరాలను ప్రశాంతపరుస్తుంది, ఒత్తిడి మరియు అలసటను దూరం చేస్తుంది.",
      difficulty: "ప్రారంభ స్థాయి (Beginner)",
      duration: "1-3 నిమిషాలు",
      steps: [
        "మడమలపై మోకాళ్లు వేసి వజ్రాసనం స్థితిలో కూర్చోండి.",
        "నెమ్మదిగా ముందుకు వంగుతూ మీ నుదురును నేలకు తాకించండి.",
        "చేతులను ముందుకు చాచి శరీరాన్ని పూర్తిగా వదిలివేయండి."
      ],
      breathingCue: "వెన్ను భాగంలోకి శ్వాసను నిండుగా వదులుతూ శరీరాన్ని తేలికగా మార్చండి.",
      contraindications: "మోకాళ్ల నొప్పులు ఉన్నవారు ప్రొఫెషనల్ పర్యవేక్షణలో మాత్రమే చేయాలి."
    },
    {
      englishName: "Bridge Pose",
      sanskritName: "Setu Bandhasana",
      localName: "சேతుబంధాసనం (Setu Bandhasana)",
      benefits: "భుజాలు, మెడ మరియు వెన్నెముక స్థిరత్వాన్ని పెంచుతుంది, జీర్ణక్రియను మెరుగుపరుస్తుంది.",
      difficulty: "మధ్యంతర స్థాయి (Intermediate)",
      duration: "5-8 నిమిషాలు",
      steps: [
        "వెల్లకిలా పడుకుని మోకాళ్లను మడవండి, పాదాలను నేలపై ఉంచండి.",
        "చేతులను ఇరువైపులా ఉంచి, నెమ్మదిగా శ్వాసతో నడుము భాగాన్ని పైకి లేపండి.",
        "ఛాతీ గడ్డం వైపుకు వచ్చి కింద పాదాల పట్టు స్థిరంగా ఉండాలి."
      ],
      breathingCue: "పొత్తికడుపు ద్వారా లోతుగా గాలి పీల్చుకోండి మరియు వదలండి.",
      contraindications: "మెడ నొప్పులు ఉన్నవారు ఈ ఆసనం దూరంగా ఉండాలి."
    },
    {
      englishName: "Downward-Facing Dog",
      sanskritName: "Adho Mukha Svanasana",
      localName: "అధో ముఖ శ్వానాసనం (Downward Dog)",
      benefits: "భుజాలు మరియు కాళ్ల నరాలను సాగదీసి శరీరాన్ని ఉల్లాసపరుస్తుంది.",
      difficulty: "ప్రారంభ స్థాయి (Beginner)",
      duration: "1-2 నిమిషాలు",
      steps: [
        "మోకాళ్లు మరియు చేతులపై నిలబడి మోచేతులను చాచండి.",
        "నడుము భాగాన్ని పైకి లేపి కాళ్లు నిటారుగా ఉంచండి.",
        "శరీరం విలోమ 'V' ఆకృతిలోకి వచ్చేలా నేలను నొక్కండి."
      ],
      breathingCue: "నడుము పైకి లేపేటప్పుడు శ్వాస వదలండి, నిలకడగా శ్వాస తీసుకోండి.",
      contraindications: "తీవ్రమైన మణికట్టు నొప్పి ఉన్నవారు చేయరాదు."
    },
    {
      englishName: "Triangle Pose",
      sanskritName: "Trikonasana",
      localName: "త్రికోణాసనం (Trikonasana)",
      benefits: "శరీర సమతుల్యతను పెంచుతుంది, కాళ్లను బలపరుస్తుంది.",
      difficulty: "ప్రారంభ స్థాయి (Beginner)",
      duration: "30-60 సెకన్లు",
      steps: [
        "రెండు కాళ్లను వెడల్పుగా ఉంచి నిలబడండి.",
        "కుడి పాదాన్ని 90 డిగ్రీల వైపు తిప్పండి.",
        "కుడి వైపుకు వంగి కుడి చేతిని నేలకు తాకించి, ఎడమ చేతిని పైకి చాచండి."
      ],
      breathingCue: "ఛాతీ తెరిచేటప్పుడు శ్వాస తీసుకోండి.",
      contraindications: "తీవ్ర మెడ నొప్పులు ఉన్నవారు పైకి చూడరాదు."
    },
    {
      englishName: "Tree Pose",
      sanskritName: "Vrksasana",
      localName: "వృక్షాసనం (Vrksasana)",
      benefits: "నరాల ఏకాగ్రతను మరియు శారీరక సమతుల్యతను పెంపొందిస్తుంది.",
      difficulty: "ప్రారంభ స్థాయి (Beginner)",
      duration: "ప్రతి కాలుపై 1 నిమిషం",
      steps: [
        "నేలపై నిటారుగా నిలబడండి.",
        "కుడి పాదాన్ని ఎడమ తొడ లోపలి భాగానికి ఆనించండి.",
        "చేతులు రెండింటిని నమస్కార ముద్రలో పైకి చాచండి."
      ],
      breathingCue: "దృష్టిని ఒకే చోట నిలిపి, నెమ్మదిగా శ్వాస తీసుకోండి.",
      contraindications: "తలనొప్పి లేదా తలతిరగడం ఉన్నప్పుడు చేయకండి."
    },
    {
      englishName: "Plank Pose",
      sanskritName: "Phalakasana",
      localName: "ఫలకాసనం (Plank)",
      benefits: "ఉదర కండరాలను, భుజాలను బాగా దృఢపరుస్తుంది.",
      difficulty: "మధ్యంతర స్థాయి (Intermediate)",
      duration: "30-60 సెకన్లు",
      steps: [
        "చేతులు మరియు కాళ్లపై శరీరాన్ని నిటారుగా ఉంచండి.",
        "శరీరం తల నుండి కాళ్ల వరకు ఒకే సరళరేఖలో ఉండాలి.",
        "పొట్ట కండరాలను బిగించి ఉంచండి."
      ],
      breathingCue: "శ్వాసను ఆపకుండా సాధారణ శ్వాస తీసుకోండి.",
      contraindications: "భుజాలు లేదా మణికట్టు గాయాలున్నవారు దూరంగా ఉండాలి."
    },
    {
      englishName: "Legs-Up-The-Wall",
      sanskritName: "Viparita Karani",
      localName: "విపరీత కరణి (Legs-Up-Wall)",
      benefits: "అలసిన కాళ్లకు విశ్రాంతినిస్తుంది, మనస్సును ప్రశాంతపరుస్తుంది.",
      difficulty: "ప్రారంభ స్థాయి (Beginner)",
      duration: "5-15 నిమిషాలు",
      steps: [
        "గోడకు ఆనుకొని పడుకోండి.",
        "రెండు కాళ్లను పైకి గోడకు ఆనించండి.",
        "చేతులను ఇరువైపులా చాచి ప్రశాంతంగా విశ్రాంతి తీసుకోండి."
      ],
      breathingCue: "శరీరాన్ని వదిలేసి, ప్రశాంతంగా శ్వాస పీల్చుకోండి.",
      contraindications: "గ్లాకోమా (కంటి సమస్యలు) ఉన్నవారు చేయకూడదు."
    }
  ],
  Hindi: [
    {
      englishName: "Cobra Pose",
      sanskritName: "Bhujangasana",
      localName: "भुजंगासन (Bhujangasana)",
      benefits: "यह फेफड़ों और हृदय को खोलता है, कमर के दर्द में तुरंत आराम देता है।",
      difficulty: "शुरुआती स्तर (Beginner)",
      duration: "5-10 गहरी सांसें",
      steps: [
        "पेट के बल सीधे लेट जाएं, पैरों को सटाकर रखें।",
        "दोनों हाथों को कंधों के समानांतर भूमि पर टिकाएं।",
        "साँस लेते हुए नाभि तक के हिस्से को धीरे-धीरे उठाएं और ऊपर देखें।"
      ],
      breathingCue: "ऊपर उठते समय साँस अंदर खींचें, कंधे पीछे की ओर खुले रखें।",
      contraindications: "हर्निया, रीढ़ की गंभीर समस्या या गर्भावस्था में अभ्यास न करें।"
    },
    {
      englishName: "Child's Pose",
      sanskritName: "Balasana",
      localName: "बालासन (Balasana)",
      benefits: "मानसिक तनाव, चिंता और शारीरिक थकान से मुक्ति दिलाता है।",
      difficulty: "शुरुआती स्तर (Beginner)",
      duration: "1-3 मिनट",
      steps: [
        "वज्रासन की स्थिति में बैठें, गहरी साँस लें।",
        "साँस छोड़ते हुए आगे की ओर झुकें और सिर भूमि पर टिकाएं।",
        "हाथों को आगे सीधा रखें या बगल में ढीला छोड़ दें।"
      ],
      breathingCue: "धीमी और गहरी गति से साँस लेते रहें, पूरे शरीर को शिथिल करें।",
      contraindications: "घुटने के पुराने गंभीर दर्द या दस्त की स्थिति में न करें।"
    },
    {
      englishName: "Bridge Pose",
      sanskritName: "Setu Bandhasana",
      localName: "सेतुबंधासन (Setu Bandhasana)",
      benefits: "थायरॉयड ग्रंथि को उत्तेजित करता है और पीठ के निचले हिस्से को मजबूत बनाता है।",
      difficulty: "मध्यम स्तर (Intermediate)",
      duration: "5-8 आरामदायक सांसें",
      steps: [
        "पीठ के बल लेटें और घुटनों को मोड़कर पैरों को कूल्हों के पास लाएं।",
        "साँस लेते हुए कूल्हों और पीठ को धीरे-धीरे जमीन से ऊपर उठाएं।",
        "हाथ थामकर नीचे जमीन पर स्थिर रखें, कंधे चौड़े करें।"
      ],
      breathingCue: "साँस को सामान्य रखें, pet के निचले भाग में खिंचाव महसूस करें।",
      contraindications: "गर्दन या कंधे में गंभीर चोट हो तो इसका अभ्यास न करें।"
    },
    {
      englishName: "Downward-Facing Dog",
      sanskritName: "Adho Mukha Svanasana",
      localName: "अधोमुख श्वानासन (Downward Dog)",
      benefits: "यह पूरे शरीर को ऊर्जा प्रदान करता है और रीढ़ को सीधा करता है।",
      difficulty: "शुरुआती स्तर (Beginner)",
      duration: "1-2 मिनट",
      steps: [
        "हाथों और घुटनों के बल शुरुआत करें।",
        "घुटनों को ऊपर उठाएं और कूल्हों को पीछे की ओर धकेलें।",
        "शरीर को 'V' आकार में लाएं और नाभि की ओर देखें।"
      ],
      breathingCue: "कूल्हों को उठाते समय सांस छोड़ें, लंबी और गहरी सांसें लें।",
      contraindications: "उच्च रक्तचाप या मणिक Wrist सिंड्रोम में डॉक्टर की सलाह लें।"
    },
    {
      englishName: "Triangle Pose",
      sanskritName: "Trikonasana",
      localName: "त्रिकोणासन (Trikonasana)",
      benefits: "शारीरिक संतुलन में सुधार लाता है और जांघों को मजबूत बनाता है।",
      difficulty: "शुरुआती स्तर (Beginner)",
      duration: "30-60 सेकंड",
      steps: [
        "पैरों को फैलाकर सीधे खड़े हो जाएं।",
        "दाएं पैर को बाहर 90 डिग्री घुमाएं।",
        "दाईं तरफ झुककर दाएं हाथ से पैर छुएं और बाएं हाथ को ऊपर उठाएं।"
      ],
      breathingCue: "छाती को फैलाते हुए गहरी सांस लें और छोड़ें।",
      contraindications: "गर्दन में दर्द होने पर ऊपर की तरफ न देखें।"
    },
    {
      englishName: "Tree Pose",
      sanskritName: "Vrksasana",
      localName: "वृक्षासन (Vrksasana)",
      benefits: "संतुलन और एकाग्रता को बढ़ाता है, रीढ़ को मजबूत करता है।",
      difficulty: "शुरुआती स्तर (Beginner)",
      duration: "1 मिनट प्रति पैर",
      steps: [
        "सीधे खड़े होकर शरीर का वजन बाएं पैर पर लाएं।",
        "दाएं पैर के तलवे को बाईं जांघ के अंदरूनी हिस्से पर टिकाएं।",
        "हाथों को प्रार्थना की स्थिति में छाती या सिर के ऊपर ले जाएं।"
      ],
      breathingCue: "स्थिर रहने के लिए सांसों को धीमा और गहरा रखें।",
      contraindications: "चक्कर आने या सिरदर्द की स्थिति में इसे न करें।"
    },
    {
      englishName: "Plank Pose",
      sanskritName: "Phalakasana",
      localName: "फलकासन (Plank)",
      benefits: "कंधों, कलाई और पेट की मांसपेशियों को शक्ति देता है।",
      difficulty: "मध्यम स्तर (Intermediate)",
      duration: "30-60 सेकंड",
      steps: [
        "हाथों और पैरों के बल आकर शरीर को सीधा रखें।",
        "सुनिश्चित करें कि कंधे कलाई के ठीक ऊपर हों।",
        "पीठ और पेट को कड़ा रखें, ढीला न छोड़ें।"
      ],
      breathingCue: "सांस सामान्य रखें, रोके नहीं।",
      contraindications: "कंधे या कलाई में हालिया चोट होने पर न करें।"
    },
    {
      englishName: "Legs-Up-The-Wall",
      sanskritName: "Viparita Karani",
      localName: "विपरीत करणी (Legs-Up-Wall)",
      benefits: "थके हुए पैरों को आराम देता है और मानसिक तनाव दूर करता है।",
      difficulty: "शुरुआती स्तर (Beginner)",
      duration: "5-15 मिनट",
      steps: [
        "दीवार के पास बैठें और पीठ के बल लेट जाएं।",
        "दोनों पैरों को सीधे ऊपर दीवार पर टिकाएं।",
        "हाथों को बगल में आराम से फैलाकर आंखें बंद कर लें।"
      ],
      breathingCue: "धीमी सांस लें, प्रत्येक सांस के साथ शरीर को ढीला छोड़ें।",
      contraindications: "आंखों की गंभीर बीमारी (ग्लूकोमा) होने पर न करें।"
    }
  ]
};;

// Static map of precise yoga pose images provided by the user
const ASANA_IMAGE_MAP: Record<string, string> = {
  "cobra": "https://www.shutterstock.com/image-vector/cobra-pose-beautiful-girl-practice-600nw-2086235635.jpg",
  "child": "https://www.theyogacollective.com/wp-content/uploads/2019/10/4143473057707883372_IMG_8546-2-1200x800.jpg",
  "bridge": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSS35d1vG6IgXBswJAgPd8MSUrbfYvrfoV3g&s",

  // Placeholders for other common poses (can be replaced by user provided links)
  "downward-facing dog": "data:image/jpeg;base64,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",
  "warrior": "",
  "triangle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiwWnwFNDhCiuug23tKKFucVsiJOjOMNv-Tg&s",
  "tree": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFji5Rcnk0FWMhIR-iZGeBa49MQD0Gokr2WA&s",
  "plank": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPgLF0y-CNCx96bOy9g3VE4HAaKfNd3fuVDg&s",
  "corpse": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB83gK3Zp_ddMccTG3xxKeUhav21aTJcJZqQ&s",
  "mountain": "",
  "Legs-Up-The-Wall": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyncbZqXSlJ4LwkX2PcpcdqMoYm2igiMFMzA&s",
  "wind relieving pose": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM28OgtJmgklfPkCq7pijcbeVGKUUzp4n6dw&s",
  "thunderbolt pose": "https://adventureyogaonline.com/wp-content/uploads/2020/05/vajrasana-1.jpg",
  "half lord of the fishes pose": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwpXISYqzqr1JYA2YG4FANRbmEdf0h3_BXCA&s",
  "sphinx pose": "https://www.doyou.com/wp-content/uploads/2021/01/How-to-do-Sphinx-Pose.jpg",

};

interface AsanaIllustrationProps {
  englishName: string;
  localName: string;
  className?: string;
}

const AsanaIllustration: React.FC<AsanaIllustrationProps> = ({ englishName, localName, className }) => {
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Find matching key in static map
  let matchedUrl = "";
  const normalizedInput = normalize(englishName);
  const foundKey = Object.keys(ASANA_IMAGE_MAP).find(key => {
    const normalizedKey = normalize(key);
    return normalizedInput.includes(normalizedKey) || normalizedKey.includes(normalizedInput);
  });

  if (foundKey && ASANA_IMAGE_MAP[foundKey]) {
    matchedUrl = ASANA_IMAGE_MAP[foundKey];
  } else {
    // Serene default silhouette placeholder
    matchedUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCwuiGfeUuwUmBuw--aYKbpCAQAYN7uKLaxAK9Is8cDzTIy-S5GkvKqf3CJixA-8EukwcmCGoSKZwc06elZazywuleCHdWnuu48yhpI1Ry9dYMQM1e4ihifM61Hf2oCy0yjVhoMS1NvPvcuKqiSmiqJCM004Ge8BlgTscUgW2QeAgDNfjaqFWx5YTTSTGgA-xdfMPD7Sqjg_Nz6ChyvJrt3X-3YZkzKBLr396fIdO4Mbx148840viKeJGZxNFnT3nDjE2R3GqJOq9nx";
  }

  return (
    <div className="relative w-full h-full bg-[#fbf9f4] flex items-center justify-center">
      <img
        src={matchedUrl}
        alt={localName}
        className={`${className} transition-opacity duration-300`}
        loading="lazy"
      />
    </div>
  );
};

// Helper: find best available voice for a language code with broad fallback
const findVoiceForLang = (langCode: string): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // 1. Exact match (e.g. "te-IN")
  let voice = voices.find(v => v.lang === langCode);
  if (voice) return voice;

  // 2. Prefix match (e.g. "te")
  const prefix = langCode.split("-")[0].toLowerCase();
  voice = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
  if (voice) return voice;

  // 3. Name-based match (some voices have language in their name)
  const langNames: Record<string, string[]> = {
    "te": ["telugu"],
    "hi": ["hindi"],
    "en": ["english"]
  };
  const keywords = langNames[prefix] || [];
  for (const kw of keywords) {
    voice = voices.find(v => v.name.toLowerCase().includes(kw));
    if (voice) return voice;
  }

  // 4. BCP-47 underscore variant (e.g. "te_IN")
  const underscoreVariant = langCode.replace("-", "_");
  voice = voices.find(v => v.lang.replace("-", "_").toLowerCase() === underscoreVariant.toLowerCase());
  if (voice) return voice;

  return null;
};

const YOGA_QUOTES = [
  "Yoga is the journey of the self, through the self, to the self.",
  "Yoga does not just change the way we see things, it transforms the person who sees.",
  "Inhale the future, exhale the past.",
  "The body benefits from movement, and the mind benefits from stillness.",
  "Yoga takes you into the present moment. The only place where life exists."
];

export default function App() {
  // App states
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [activeTab, setActiveTabState] = useState<"home" | "search" | "asanas" | "profile">("home");
  const tabHistoryRef = useRef<string[]>(["home"]);
  const isPopRef = useRef(false);
  const [isExitingWelcome, setIsExitingWelcome] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteFade, setQuoteFade] = useState(true);

  useEffect(() => {
    if (selectedLang) return;
    const interval = setInterval(() => {
      setQuoteFade(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % YOGA_QUOTES.length);
        setQuoteFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedLang]);

  const handleLanguageSelect = (lang: Language) => {
    setIsExitingWelcome(true);
    setTimeout(() => {
      changeLanguage(lang);
      setIsExitingWelcome(false);
    }, 400); // Wait for transition to complete
  };

  // Navigate to a tab and push to history
  const setActiveTab = useCallback((tab: "home" | "search" | "asanas" | "profile") => {
    setActiveTabState(prev => {
      if (prev !== tab && !isPopRef.current) {
        tabHistoryRef.current.push(tab);
        window.history.pushState({ tab }, "");
      }
      isPopRef.current = false;
      return tab;
    });
  }, []);

  // Browser back button handler
  useEffect(() => {
    const handlePopState = () => {
      isPopRef.current = true;
      const history = tabHistoryRef.current;
      if (history.length > 1) {
        history.pop();
        const prevTab = history[history.length - 1] as "home" | "search" | "asanas" | "profile";
        setActiveTabState(prevTab);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Dropdown & General Voice states
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [speakingTextId, setSpeakingTextId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    explanation: string;
    suggestedAsanas: YogaAsana[];
  } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    // Inject welcoming first message depending on the language state
    return [];
  });
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Expanded Pose Accordion states
  const [expandedPoseIndex, setExpandedPoseIndex] = useState<number | null>(0);

  // Interactive Breath Timer states
  const [timerStage, setTimerStage] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(4);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Profile preferences & logs
  const [favoriteAsanas, setFavoriteAsanas] = useState<string[]>(["Cobra Pose", "Child's Pose"]);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(3);
  const [userStreakDays, setUserStreakDays] = useState(5);
  const [showSpecialDisclaimer, setShowSpecialDisclaimer] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Text-to-Speech (TTS) Voice Guide States
  const [speakingAsana, setSpeakingAsana] = useState<string | null>(null);
  const [speakingStepIndex, setSpeakingStepIndex] = useState<number>(0);
  const [isSpeakingPaused, setIsSpeakingPaused] = useState<boolean>(false);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [voicesLoaded, setVoicesLoaded] = useState<boolean>(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle browser speech voices loading asynchronously
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const handleVoicesChanged = () => {
      setVoicesLoaded(true);
    };
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoicesLoaded(true);
    }
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Stop speaking and clear states
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    setSpeakingAsana(null);
    setSpeakingStepIndex(0);
    setIsSpeakingPaused(false);
  };

  // Pause speech guide
  const pauseSpeaking = () => {
    if (!window.speechSynthesis || !speakingAsana) return;
    window.speechSynthesis.cancel();
    setIsSpeakingPaused(true);
  };

  // Resume speech guide
  const resumeSpeaking = (steps: string[]) => {
    if (!speakingAsana) return;
    speakStep(speakingAsana, steps, speakingStepIndex);
  };

  // Play a specific step
  const speakStep = (asanaName: string, steps: string[], stepIdx: number) => {
    if (!window.speechSynthesis) return;

    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }

    window.speechSynthesis.cancel();

    if (stepIdx < 0 || stepIdx >= steps.length) {
      stopSpeaking();
      return;
    }

    setSpeakingAsana(asanaName);
    setSpeakingStepIndex(stepIdx);
    setIsSpeakingPaused(false);

    const textToSpeak = steps[stepIdx];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    // Set standard localized lang code
    let langCode = "en-US";
    if (selectedLang === "Telugu") langCode = "te-IN";
    else if (selectedLang === "Hindi") langCode = "hi-IN";

    utterance.lang = langCode;

    // Peaceful, slower pacing for yoga practice
    utterance.rate = selectedLang === "English" ? 0.85 : 0.78;
    utterance.pitch = 1.0;

    // Find and set language-specific voice
    const matchedVoice = findVoiceForLang(langCode);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      if (autoAdvance && stepIdx + 1 < steps.length) {
        // 3.5 seconds gap gives user time to hold the posture
        autoAdvanceTimeoutRef.current = setTimeout(() => {
          speakStep(asanaName, steps, stepIdx + 1);
        }, 3500);
      } else if (stepIdx + 1 === steps.length) {
        autoAdvanceTimeoutRef.current = setTimeout(() => {
          stopSpeaking();
        }, 2000);
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech Synthesis error:", e);
      stopSpeaking();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Helper: play voice for other texts (like benefits or breathing cues)
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    let langCode = "en-US";
    if (selectedLang === "Telugu") langCode = "te-IN";
    else if (selectedLang === "Hindi") langCode = "hi-IN";
    utterance.lang = langCode;
    utterance.rate = selectedLang === "English" ? 0.85 : 0.78;

    const matchedVoice = findVoiceForLang(langCode);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Helper: read a chat message and track if it's currently playing
  const speakChatMessage = (msgId: string, text: string) => {
    if (!window.speechSynthesis) return;

    if (speakingTextId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingTextId(null);
      return;
    }

    // Stop any other active speech guides
    stopSpeaking();
    window.speechSynthesis.cancel();
    setSpeakingTextId(msgId);

    const utterance = new SpeechSynthesisUtterance(text);
    let langCode = "en-US";
    if (selectedLang === "Telugu") langCode = "te-IN";
    else if (selectedLang === "Hindi") langCode = "hi-IN";

    utterance.lang = langCode;
    utterance.rate = selectedLang === "English" ? 0.9 : 0.82;

    const matchedVoice = findVoiceForLang(langCode);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      setSpeakingTextId(null);
    };
    utterance.onerror = () => {
      setSpeakingTextId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Synthesize a relaxing chime sound using the Web Audio API
  const playBreathSound = (stage: "inhale" | "hold" | "exhale") => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      let freq = 440;
      if (stage === "inhale") {
        freq = 523.25; // C5 - soft clear note
      } else if (stage === "hold") {
        freq = 392.00; // G4 - grounding note
      } else {
        freq = 329.63; // E4 - relaxing note
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05); // low volume
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } catch (err) {
      console.warn("Audio Context playback failed:", err);
    }
  };

  // Preload speech synthesis voices (especially important for Telugu/Hindi)
  useEffect(() => {
    if (!window.speechSynthesis) return;
    // Trigger voice loading – many browsers load them lazily
    window.speechSynthesis.getVoices();
    const onVoicesChanged = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
    };
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  // Play breath transition sound cues
  useEffect(() => {
    if (isTimerRunning) {
      playBreathSound(timerStage);
    }
  }, [timerStage, isTimerRunning]);

  // Sync initial language or persist changes
  const changeLanguage = (lang: Language) => {
    stopSpeaking();
    setSelectedLang(lang);
    if (searchResults && searchQuery) {
      triggerYogaSearch(searchQuery, lang);
    }
  };

  // Keep chat updated with initial welcoming prompt when language changes
  useEffect(() => {
    if (!selectedLang) return;
    const welcomeTexts = {
      English: "Namaste! I am your Sthira Sukham AI Wellness Coach. How can I support your practice, alignments, or breathing today?",
      Telugu: "నమస్తే! నేను మీ స్థిర సుఖం AI యోగా సహాయకుడిని. ఈరోజు మీ సాధన, శ్వాస లేదా ప్రత్యామ్నాయ ఆసనాల గురించి ఏమైనా అడగండి.",
      Hindi: "नमस्ते! मैं आपका स्थिर सुखम AI योग मार्गदर्शक हूँ। आज मैं आपके अभ्यास, आसन विधि या सावधानियों में किस प्रकार सहायता कर सकता हूँ?"
    };
    setChatMessages([
      {
        id: "welcome-msg",
        role: "assistant",
        content: welcomeTexts[selectedLang],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [selectedLang]);

  // Persist Favorites and Stats
  // (State resets on reload to ensure a fresh start)

  // Auto-run Breath Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            // Roll over stage
            setTimerStage((currentStage) => {
              if (currentStage === "inhale") return "hold";
              if (currentStage === "hold") return "exhale";
              return "inhale";
            });
            return 4; // Reset to 4 seconds
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimerStage("inhale");
      setTimerSecondsLeft(4);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const activeTrans = selectedLang ? translations[selectedLang] : translations["English"];

  // Search trigger call
  const triggerYogaSearch = async (queryToSearch: string, langOverride?: Language) => {
    if (!queryToSearch.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    setSearchResults(null);
    setExpandedPoseIndex(0);

    // Switch to search tab to show results
    setActiveTab("search");

    const targetLang = langOverride || selectedLang || "English";

    try {
      const resp = await fetch("/api/asana-recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: queryToSearch,
          language: targetLang
        })
      });

      if (!resp.ok) {
        throw new Error("Failed to receive structured search responses.");
      }

      const data = await resp.json();
      setSearchResults(data);
    } catch (err: any) {
      console.error(err);
      setSearchError(targetLang === "Telugu"
        ? "సర్వర్ కనెక్ట్ కాలేకపోయింది. దయచేసి మళ్లీ ప్రయత్నించండి."
        : targetLang === "Hindi"
          ? "सर्वर कनेक्ट करने में असमर्थ। कृपया पुनः प्रयास करें।"
          : "Failed to connect to fullstack helper. Showing local recovery recommendations instead.");

      // Load static fallback matching the active language
      const localPresets = FOUNDATIONAL_ASANAS[targetLang];
      setSearchResults({
        explanation: targetLang === "Telugu"
          ? `తాత్కాలిక లోపం సంభవించింది. కానీ చింతించకండి! మీ ప్రశ్న "${queryToSearch}" కోసం స్థానిక ఆసనాల సలహాలు సమర్పించబడ్డాయి:`
          : targetLang === "Hindi"
            ? `सर्वर में समस्या आई। आपके प्रश्न "${queryToSearch}" के लिए हमारी सिफ़ारिशें यहाँ उपलब्ध हैं:`
            : `We encountered high volume. Showing our foundational offline recovery poses for "${queryToSearch}":`,
        suggestedAsanas: localPresets
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle active typing submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerYogaSearch(searchQuery);
  };

  // Quick launch card click
  const handleSymptomCardClick = (symptom: CommonSymptom) => {
    const titleText = symptom.localTitle[selectedLang || "English"];
    setSearchQuery(titleText);
    triggerYogaSearch(titleText);
  };

  // AI Chat Submit Action
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const originalInput = chatInput;
    setChatInput("");
    setIsChatLoading(true);

    try {
      // Keep only last 8 messages to stay within prompt boundaries safely
      const historicalFeeds = [...chatMessages, userMsg].slice(-8).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await fetch("/api/asana-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: historicalFeeds,
          language: selectedLang || "English"
        })
      });

      if (!res.ok) {
        throw new Error("Chat service returned bad status");
      }

      const data = await res.json();
      const assistantReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, assistantReply]);

    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: selectedLang === "Telugu"
          ? "క్షమించండి, మీ ప్రశ్న ప్రస్తుతం కనెక్ట్ అవ్వడం లేదు. నిలకడగా శ్వాస పీల్చుకుంటూ మళ్లీ ప్రయత్నించండి."
          : selectedLang === "Hindi"
            ? "क्षमा करें, वर्तमान में कनेक्शन स्थापित नहीं हो सका। कृपया गहरी सांस लें और पुनः प्रयास करें।"
            : "Namaste! Deep breathing is the foundation of recovery. Let me know if you want to search standard modifications instead.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Bookmark / Favorite trigger
  const toggleFavorite = (asanaName: string) => {
    if (favoriteAsanas.includes(asanaName)) {
      setFavoriteAsanas(prev => prev.filter(n => n !== asanaName));
    } else {
      setFavoriteAsanas(prev => [...prev, asanaName]);
    }
  };

  // Complete session logger
  const logSessionCompletion = () => {
    const updatedCount = completedSessionsCount + 1;
    setCompletedSessionsCount(updatedCount);

    const updatedStreak = userStreakDays + 1;
    setUserStreakDays(updatedStreak);

    // Simple alert-free confirmation visual
    setShowSpecialDisclaimer(true);
    setTimeout(() => {
      setShowSpecialDisclaimer(false);
    }, 4500);
  };

  // If language is not selected yet, show the beautiful Welcome Language Selector screen
  if (!selectedLang) {
    return (
      <div className={`min-h-screen bg-[#fbf9f4] font-sans text-on-background flex flex-col items-center justify-center p-4 relative overflow-hidden transition-opacity duration-500 ease-in-out ${isExitingWelcome ? "opacity-0" : "opacity-100"}`}>
        {/* Desktop Yoga Quotes */}
        <div className="hidden lg:flex absolute left-10 top-0 bottom-0 w-1/3 flex-col justify-center pointer-events-none z-20">
          <div className={`transition-opacity duration-500 ease-in-out ${quoteFade ? "opacity-100" : "opacity-0"}`}>
            <p className="text-3xl font-serif text-[#4a654a] italic leading-relaxed">
              "{YOGA_QUOTES[quoteIndex]}"
            </p>
          </div>
        </div>

        {/* Serene organic background blobs */}
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full bg-[#b0ceae]/20 blur-3xl animate-blob-1"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full bg-[#e2dfff]/20 blur-3xl animate-blob-2"></div>
          <div className="absolute top-[30%] left-[20%] w-64 h-64 rounded-full bg-[#c2e8ff]/20 blur-3xl animate-blob-3"></div>
        </div>
        <main className="w-full max-w-md mx-auto flex flex-col items-center justify-between min-h-screen py-10 relative z-10">

          <header className="flex flex-col items-center text-center mt-6">
            {/* Self Improvement Material Symbol represented in HTML mockup */}
            <div className="w-20 h-20 mb-5 rounded-full bg-[#b0ceae] flex items-center justify-center ambient-bloom">
              <span className="text-4xl text-[#4a654a]">🧘</span>
            </div>

            <h1 className="text-3xl font-bold text-[#4a654a] tracking-tight mb-2">Sthira Sukham</h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#434841] opacity-80">
              Yoga for Everyone
            </p>
          </header>

          <section className="w-full my-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-[#1b1c19]">Welcome</h2>
              <p className="text-[#434841] text-base italic space-y-1 block leading-tight">
                <span className="block font-medium">Select Language</span>
                <span className="block text-sm text-[#434841]/80 mt-1">భాషను ఎంచుకోండి • अपनी भाषा चुनें</span>
              </p>
            </div>

            <div className="space-y-3 w-full">
              {/* Option English */}
              <button
                id="lang-btn-english"
                onClick={() => handleLanguageSelect("English")}
                className="w-full h-15 bg-white border border-[#c3c8bf]/30 rounded-xl flex items-center justify-between px-6 shadow-sm hover:bg-[#b0ceae]/10 active:scale-98 transition-all group duration-150"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[#4a654a] font-bold group-hover:scale-110 transition-transform">🌸</span>
                  <span className="text-base text-[#1b1c19] font-medium">English</span>
                </div>
                <span className="text-xs font-bold text-[#737971]">➔</span>
              </button>

              {/* Option Telugu */}
              <button
                id="lang-btn-telugu"
                onClick={() => handleLanguageSelect("Telugu")}
                className="w-full h-15 bg-white border border-[#c3c8bf]/30 rounded-xl flex items-center justify-between px-6 shadow-sm hover:bg-[#b0ceae]/10 active:scale-98 transition-all group duration-150"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[#4a654a] font-bold group-hover:scale-110 transition-transform">🕉️</span>
                  <span className="text-base text-[#1b1c19] font-medium">తెలుగు (Telugu)</span>
                </div>
                <span className="text-xs font-bold text-[#737971]">➔</span>
              </button>

              {/* Option Hindi */}
              <button
                id="lang-btn-hindi"
                onClick={() => handleLanguageSelect("Hindi")}
                className="w-full h-15 bg-white border border-[#c3c8bf]/30 rounded-xl flex items-center justify-between px-6 shadow-sm hover:bg-[#b0ceae]/10 active:scale-98 transition-all group duration-150"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[#4a654a] font-bold group-hover:scale-110 transition-transform">✨</span>
                  <span className="text-base text-[#1b1c19] font-medium">हिन्दी (Hindi)</span>
                </div>
                <span className="text-xs font-bold text-[#737971]">➔</span>
              </button>
            </div>

            {/* Decorative landscape image hotlinked exactly from mockup instructions */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/40 shadow-md">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY1DxvNBfZxitbeuA9VvvqxxwM5xDKWXS2iHuD3Wi9mGw4S7i695VoB8f15JN_W5wVctJhVSg8MLHoIragRfSF3yY-7TmarfQRlLqbv71fJcqyKMxFO6dHgk0wKeGyHbSL0dcv4Y3aWYuZdFwvBhgyZY1xIxL1DaVPBCKZie02dqTClSWnbDruYqeIEAVOjMsz50nhd89Fgx9vrU6UzjrKsb7kQPiATaH3rNRoFnmq9-7jW9IDfXWeA-6dWI595Nsj36pwQ6eIy15Q"
                alt="Dawn landscape with yogic silhouette representing mental clarity"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4a654a]/30 to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <p className="text-xs italic opacity-95 text-center font-medium">
                  "Steadiness and ease for every body."
                </p>
              </div>
            </div>
          </section>

          <footer className="w-full text-center space-y-4">
            <p className="text-[10px] text-[#434841] opacity-70 leading-relaxed max-w-xs mx-auto">
              © 2026 Sthira Sukham Yoga. This is for educational purpose only. Please consult a health coach or doctor before practicing.
            </p>
            <div className="flex justify-center gap-4 text-xs">
              <span className="text-[#4a654a] hover:underline cursor-pointer font-medium">Disclaimer</span>
              <span className="text-[#c3c8bf]">•</span>
              <span className="text-[#4a654a] hover:underline cursor-pointer font-medium">Privacy</span>
            </div>
          </footer>

        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f4] font-sans text-on-background flex flex-col pb-26 md:pb-12 text-base">

      {/* Dynamic Header */}
      <header className="bg-[#fbf9f4] shadow-sm sticky top-0 z-50 px-4 md:px-8 py-4 flex justify-between items-center opacity-[0.98] border-b border-[#eae8e3]">
        <div className="flex items-center gap-2">
          {/* Back button – shown only when there's history to pop */}
          {tabHistoryRef.current.length > 1 && (
            <button
              onClick={() => window.history.back()}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#ccebc8]/40 active:scale-90 transition-all cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-[#4a654a]" />
            </button>
          )}
          <div onClick={() => setActiveTab("home")} className="w-8 h-8 rounded-full bg-[#ccebc8] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
            <span className="text-sm">🧘</span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-[#4a654a] tracking-tight flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab("home")}>
              Sthira Sukham
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-[#434841] -mt-1 hidden md:block">
              {activeTrans.tagline}
            </p>
          </div>
        </div>

        {/* Header Interactions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Quick Language Dropdown Toggle */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="header-lang-toggle"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-[#4a654a] bg-[#ccebc8]/50 hover:bg-[#ccebc8] active:scale-95 transition-all cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-[#4a654a]" />
              <span>{selectedLang}</span>
              <ChevronDown className={`w-3 h-3 text-[#4a654a] transition-transform duration-200 ${isLangDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-[#eae8e3] rounded-xl shadow-lg shadow-black/5 z-50 animate-fade-in">
                <button
                  onClick={() => {
                    changeLanguage("English");
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-[#ccebc8]/20 cursor-pointer ${selectedLang === "English" ? "font-bold text-[#4a654a]" : "text-[#434841]"}`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    changeLanguage("Telugu");
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-[#ccebc8]/20 cursor-pointer ${selectedLang === "Telugu" ? "font-bold text-[#4a654a]" : "text-[#434841]"}`}
                >
                  తెలుగు
                </button>
                <button
                  onClick={() => {
                    changeLanguage("Hindi");
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-[#ccebc8]/20 cursor-pointer ${selectedLang === "Hindi" ? "font-bold text-[#4a654a]" : "text-[#434841]"}`}
                >
                  हिन्दी
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab("profile")}
            className="p-1.5 text-[#4a654a] rounded-full hover:bg-[#ccebc8]/45 active:scale-95 transition-all"
            title="Profile details"
          >
            <User className="w-5 h-5 text-[#4a654a]" />
          </button>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-grow max-w-3xl w-full mx-auto px-4 md:px-8 py-8 space-y-8 animate-fade-in focus:outline-none">

        {/* TAB 1: HOME */}
        {activeTab === "home" && (
          <div className="space-y-10">
            {/* Cozy Greeting */}
            <div className="text-center space-y-3 py-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c19] leading-tight">
                {activeTrans.heroTitle}
              </h2>
              <p className="text-sm md:text-base text-[#434841] max-w-xl mx-auto leading-relaxed">
                {activeTrans.heroSubtitle}
              </p>
            </div>

            {/* Quick-action Search Bar mimicking mockup style */}
            <div className="relative group max-w-2xl mx-auto shadow-sm">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-[#4a654a]" />
                </div>
                <input
                  id="home-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeTrans.searchPlaceholder}
                  className="w-full h-15 pl-13 pr-6 bg-white border border-[#c3c8bf]/30 rounded-full text-sm font-medium text-[#1b1c19] placeholder:text-[#c3c8bf] focus:ring-2 focus:ring-[#4a654a]/20 focus:scale-[1.01] duration-150 outline-none shadow-sm ambient-bloom"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 h-11 px-5 bg-[#4a654a] text-white rounded-full text-xs font-semibold hover:bg-[#4a654a]/95 active:scale-95 transition-all shadow-sm flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{activeTrans.searchBtn}</span>
                </button>
              </form>
            </div>

            {/* Bento Grid: Common Health Pain Points */}
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider font-bold text-[#434841] px-1">
                {activeTrans.commonIssuesTitle}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {COMMON_SYMPTOMS.map((symptom) => {
                  const localName = symptom.localTitle[selectedLang];
                  const detailsText = selectedLang === "Telugu" ? `${symptom.englishTitle} సంబంధిత` : selectedLang === "Hindi" ? `${symptom.englishTitle} हेतु` : symptom.englishTitle;
                  return (
                    <div
                      key={symptom.id}
                      onClick={() => handleSymptomCardClick(symptom)}
                      className={`group cursor-pointer bg-white border border-[#c3c8bf]/20 rounded-2xl p-5 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all duration-250 flex flex-col items-center text-center`}
                    >
                      <div className={`w-12 h-12 ${symptom.avatarColorClass} rounded-full flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-200`}>
                        <span className="text-xl">
                          {symptom.iconName === "personal_injury" ? "🧘" :
                            symptom.iconName === "psychology" ? "🍃" :
                              symptom.iconName === "body_system" ? "🍏" : "🌸"}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#1b1c19] mb-1 leading-snug">
                        {localName}
                      </h4>
                      <p className="text-[10px] text-[#434841] opacity-75 font-mono">
                        {detailsText}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rhythmic Guided Breath Timer Widget (Mindfulness highlight) */}
            <section className="bg-white border border-[#c3c8bf]/15 rounded-3xl p-6 shadow-sm ambient-bloom flex flex-col md:flex-row items-center gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5b5b81] bg-[#e2dfff]/60 px-2.5 py-1 rounded-full w-fit">
                  <Activity className="w-3 h-3 text-[#5b5b81]" />
                  <span>Prana Control</span>
                </div>
                <h3 className="text-lg font-bold text-[#1b1c19]">
                  {activeTrans.breathTimerTitle}
                </h3>
                <p className="text-xs text-[#434841] leading-relaxed">
                  {activeTrans.breathTimerDesc}
                </p>
                <div className="pt-2">
                  {!isTimerRunning ? (
                    <button
                      onClick={() => {
                        setIsTimerRunning(true);
                        setTimerStage("inhale");
                        setTimerSecondsLeft(4);
                      }}
                      className="h-10 px-5 bg-[#5b5b81] text-white rounded-full text-xs font-semibold hover:bg-[#5b5b81]/90 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Breathing Circle</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsTimerRunning(false)}
                      className="h-10 px-5 bg-[#ba1a1a] text-white rounded-full text-xs font-semibold hover:bg-[#ba1a1a]/90 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Pause Anchor</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Graphical Circular Pulser */}
              <div className="relative flex items-center justify-center w-36 h-36">
                <div className={`absolute inset-0 rounded-full opacity-10 transition-all duration-1000 ${timerStage === "inhale" ? "bg-emerald-500 scale-110" :
                  timerStage === "hold" ? "bg-amber-500 scale-100" :
                    "bg-indigo-500 scale-90"
                  }`}></div>
                <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-3 transition-transform duration-1000 shadow-inner z-10 ${timerStage === "inhale" ? "border-emerald-500/40 text-emerald-800 bg-[#ccebc8]/20 scale-105" :
                  timerStage === "hold" ? "border-amber-500/40 text-amber-800 bg-amber-50" :
                    "border-indigo-500/40 text-indigo-800 bg-indigo-50/70 scale-95"
                  }`}>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#434841]">
                    {timerStage === "inhale" ? "Inhale" : timerStage === "hold" ? "Hold" : "Exhale"}
                  </span>
                  <span className="text-2xl font-black mt-0.5 font-mono">
                    {timerSecondsLeft}s
                  </span>
                </div>
              </div>
            </section>

            {/* Surya Namaskar Promotional Banner exactly as loaded with user's assets */}
            <section className="bg-[#ccebc8]/30 rounded-[2rem] p-6 md:p-8 overflow-hidden relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <span className="bg-[#4a654a] text-white px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                    {activeTrans.todaysHighlight}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-[#4a654a]">
                    {activeTrans.highlightTitle}
                  </h3>
                  <p className="text-xs md:text-sm text-[#334d34] leading-relaxed">
                    {activeTrans.highlightDesc}
                  </p>

                  <div className="flex gap-2.5">
                    <button
                      onClick={() => triggerYogaSearch("Surya Namaskar / Sun Salutation")}
                      className="h-10 px-5 bg-[#4a654a] text-white rounded-full text-xs font-semibold hover:bg-[#4a654a]/90 active:scale-95 transition-all shadow-sm"
                    >
                      {activeTrans.learnMore}
                    </button>

                    <button
                      onClick={logSessionCompletion}
                      className="h-10 px-4 bg-white text-[#4a654a] border border-[#c3c8bf]/30 rounded-full text-xs font-semibold hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Done Today</span>
                    </button>
                  </div>
                </div>

                {/* Handled dynamic popup/animation toast for session logging to keep experience rich */}
                <div className="relative">
                  {showSpecialDisclaimer && (
                    <div className="absolute top-2 left-2 right-2 bg-white/95 text-[#4a654a] text-xs py-2.5 px-3.5 rounded-xl z-20 shadow-md border border-[#c3c8bf]/30 animate-fade-in flex items-start gap-2">
                      <span className="text-sm">🌟</span>
                      <div>
                        <p className="font-bold">Sadhana logged successfully!</p>
                        <p className="text-[10px] opacity-90 text-[#434841]">Your daily streak improved. Your lungs will thank you!</p>
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl overflow-hidden shadow-sm aspect-video md:aspect-square border border-white/60">
                    <img
                      src={suryaNamaskaraImg}
                      alt="Serene person practicing Surya Namaskar yoga outdoors at sunrise"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: AI SEARCH RESULTS */}
        {activeTab === "search" && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-[#1b1c19] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#4a654a]" />
                <span>{selectedLang === "Telugu" ? "AI శోధన సహాయకుడు" : selectedLang === "Hindi" ? "AI खोज मार्गदर्शक" : "AI Yoga Finder"}</span>
              </h2>
              <p className="text-xs md:text-sm text-[#434841]">
                {selectedLang === "Telugu"
                  ? "మీ శారీరక లేదా మానసిక అసౌకర్యాన్ని ఇక్కడ టైప్ చేయండి (ఉదాహరణ: మెడ నొప్పి, ఒత్తిడి) — స్థిర సుఖం AI మీకు తగిన శాస్త్రీయ ఆసనాలను రికమండ్ చేస్తుంది."
                  : selectedLang === "Hindi"
                    ? "अपनी परेशानी या स्वास्थ्य लक्ष्य का विवरण दें (जैसे: तनाव, कब्ज, गर्दन का दर्द) — हमारी कृत्रिम बुद्धिमत्ता आपके लिए सुरक्षित आसनों का चयन करेगी।"
                    : "Detail any specific symptom (e.g. neck tension, migraine, flat feet) and Sthira Sukham AI will recommend highly precise, safe restorative sequences."}
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                id="search-tab-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTrans.searchPlaceholder}
                className="flex-grow h-13 px-4 bg-white border border-[#c3c8bf]/30 rounded-xl text-sm font-medium text-[#1b1c19] focus:ring-2 focus:ring-[#4a654a]/25 focus:border-[#4a654a]/50 outline-none shadow-inner"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="h-13 px-6 bg-[#4a654a] text-white rounded-xl text-xs font-semibold hover:bg-[#4a654a]/90 active:scale-95 disabled:opacity-70 transition-all shadow-sm flex items-center gap-1"
              >
                {isSearching ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Sparkles className="w-4 h-4 animate-pulse" />
                )}
                <span className="hidden sm:inline">{activeTrans.searchBtn}</span>
              </button>
            </form>

            {/* Loading Indicator */}
            {isSearching && (
              <div className="bg-[#f0eee9] border border-[#c3c8bf]/20 rounded-2xl p-8 text-center space-y-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-[#ccebc8] text-[#4a654a] flex items-center justify-center mx-auto text-xl font-bold animate-spin">🧘</div>
                <p className="text-xs text-[#1b1c19] max-w-sm mx-auto leading-relaxed">
                  {activeTrans.loadingMessage}
                </p>
                <div className="w-32 bg-slate-200 h-1.5 rounded-full mx-auto overflow-hidden">
                  <div className="bg-[#4a654a] h-full rounded-full w-2/3 animate-infinite"></div>
                </div>
              </div>
            )}

            {/* Results Content Rendered with accordion details */}
            {!isSearching && searchResults && (
              <div className="space-y-6">

                {/* Offline Mode Warning Banner */}
                {(searchResults as any).apiOffline && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm text-amber-900 text-xs">
                    <span className="text-base">⚠️</span>
                    <div className="space-y-0.5">
                      <p className="font-bold">
                        {selectedLang === "Telugu"
                          ? "ఆఫ్‌లైన్ మోడ్ యాక్టివ్‌గా ఉంది"
                          : selectedLang === "Hindi"
                            ? "ऑफ़लाइन मोड सक्रिय है"
                            : "Offline Mode Active"}
                      </p>
                      <p className="opacity-90 leading-relaxed">
                        {selectedLang === "Telugu"
                          ? "రియల్ టైమ్ AI రికమండేషన్స్ కోసం సర్వర్ లో GEMINI_API_KEY సెట్ చేయండి. ప్రస్తుతం ముందుగా సేవ్ చేసిన ఆసనాలు చూపిస్తున్నాము."
                          : selectedLang === "Hindi"
                            ? "रीयल-टाइम व्यक्तिगत AI सुझावों के लिए GEMINI_API_KEY सेट करें। वर्तमान में प्रीसेट लाइब्रेरी का उपयोग किया जा रहा है।"
                            : "Add GEMINI_API_KEY in your environment configuration to enable dynamic, real-time AI routines. Using pre-cached, offline yoga recommendations instead."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Intro advice Explanation card */}
                <div className="bg-white border-l-4 border-[#4a654a] border-y border-r border-[#c3c8bf]/20 rounded-r-2xl p-4 md:p-5 shadow-sm">
                  <h4 className="text-xs font-extrabold text-[#4a654a] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{activeTrans.aiExplanationHeader}</span>
                  </h4>
                  <p className="text-xs md:text-sm text-[#1b1c19] leading-relaxed italic">
                    "{searchResults.explanation}"
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-[#434841] px-1">
                    {activeTrans.suggestedAsanasHeader}
                  </h3>

                  <div className="space-y-4">
                    {searchResults.suggestedAsanas.map((asana, index) => {
                      const isExpanded = expandedPoseIndex === index;
                      const hasFaved = favoriteAsanas.includes(asana.englishName);
                      return (
                        <div
                          key={asana.englishName}
                          className="bg-white border border-[#c3c8bf]/20 rounded-2xl overflow-hidden shadow-sm transition-all"
                        >
                          {/* Header toggle row */}
                          <div
                            onClick={() => setExpandedPoseIndex(isExpanded ? null : index)}
                            className="p-4 md:p-5 hover:bg-slate-50 cursor-pointer flex justify-between items-center select-none"
                          >
                            <div className="space-y-1">
                              <span className="text-[10px] text-white bg-[#5b5b81] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider mr-2">
                                {asana.difficulty}
                              </span>
                              <h4 className="text-base font-bold text-[#1b1c19] inline-block">
                                {asana.localName}
                              </h4>
                              <p className="text-[11px] text-[#434841]/85 italic block">
                                {asana.sanskritName} • {asana.duration}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Favorite Heart action */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(asana.englishName);
                                }}
                                className="p-2 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-colors text-slate-400 active:scale-90"
                                title="Add to Favorites"
                              >
                                <Heart className={`w-4.5 h-4.5 ${hasFaved ? "fill-rose-500 text-rose-500" : ""}`} />
                              </button>

                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                          </div>

                          {/* Expansion detail card drawer */}
                          {isExpanded && (
                            <div className="p-4 md:p-5 border-t border-[#eae8e3] bg-[#fbf9f4]/60 space-y-4 text-xs md:text-sm animate-fade-in">

                              <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Visual Pose Illustration */}
                                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-2xl overflow-hidden border border-[#c3c8bf]/20 bg-white shadow-sm shrink-0">
                                  <AsanaIllustration
                                    englishName={asana.englishName}
                                    localName={asana.localName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                <div className="flex-grow w-full space-y-5">
                                  {/* specific localized benefits */}
                                  <div className="space-y-1">
                                    <h5 className="font-extrabold text-[#1b1c19] text-xs uppercase tracking-wider">
                                      💎 {selectedLang === "English" ? "Why it works" : selectedLang === "Telugu" ? "ఇది ఎలా సహాయపడుతుంది" : "यह कैसे मदद करता है"}
                                    </h5>
                                    <p className="text-[#434841] text-xs">
                                      {asana.benefits}
                                    </p>
                                  </div>

                                  {/* Practice Steps */}
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <h5 className="font-extrabold text-xs uppercase tracking-wider text-[#4a654a] flex items-center gap-1">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        <span>{activeTrans.stepsLabel}</span>
                                      </h5>

                                      {/* Simple Play Button when voice is idle */}
                                      {speakingAsana !== asana.englishName && (
                                        <button
                                          type="button"
                                          onClick={() => speakStep(asana.englishName, asana.steps, 0)}
                                          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#4a654a]/10 hover:bg-[#4a654a]/20 text-[#4a654a] transition-all active:scale-95 cursor-pointer"
                                          title={activeTrans.speechPlay}
                                        >
                                          <Volume2 className="w-3.5 h-3.5" />
                                          <span>{activeTrans.speechPlay}</span>
                                        </button>
                                      )}
                                    </div>

                                    {/* Active Speech Player Controls */}
                                    {speakingAsana === asana.englishName && (
                                      <div className="bg-[#ccebc8]/25 border border-[#ccebc8]/60 p-3 rounded-2xl space-y-3 shadow-sm animate-fade-in">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                          {/* Playing step counter indicator */}
                                          <div className="flex items-center gap-2">
                                            <span className="flex h-2.5 w-2.5 relative">
                                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isSpeakingPaused ? "hidden" : ""}`}></span>
                                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                            </span>
                                            <span className="text-xs font-bold text-[#334d34] flex items-center gap-1">
                                              <span>{activeTrans.speechGuideTitle}:</span>
                                              <span className="bg-[#4a654a] text-white px-2 py-0.5 rounded-full text-[10px]">
                                                {activeTrans.speechStepOf} {speakingStepIndex + 1}/{asana.steps.length}
                                              </span>
                                            </span>
                                          </div>

                                          {/* Audio controls */}
                                          <div className="flex items-center gap-2">
                                            {/* Prev Step */}
                                            <button
                                              type="button"
                                              onClick={() => speakStep(asana.englishName, asana.steps, speakingStepIndex - 1)}
                                              disabled={speakingStepIndex === 0}
                                              className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-[#4a654a] disabled:opacity-40 disabled:hover:bg-white/80 transition-all cursor-pointer border border-[#c3c8bf]/10 shadow-sm"
                                              title="Previous Step"
                                            >
                                              <SkipBack className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Play / Pause Toggle */}
                                            {isSpeakingPaused ? (
                                              <button
                                                type="button"
                                                onClick={() => resumeSpeaking(asana.steps)}
                                                className="p-1.5 rounded-lg bg-[#4a654a] text-white hover:bg-[#4a654a]/90 transition-all cursor-pointer shadow-sm"
                                                title={activeTrans.speechPlay}
                                              >
                                                <Play className="w-3.5 h-3.5 fill-white text-white" />
                                              </button>
                                            ) : (
                                              <button
                                                type="button"
                                                onClick={pauseSpeaking}
                                                className="p-1.5 rounded-lg bg-white text-[#4a654a] hover:bg-[#eae8e3] transition-all cursor-pointer border border-[#c3c8bf]/10 shadow-sm"
                                                title={activeTrans.speechPause}
                                              >
                                                <Pause className="w-3.5 h-3.5" />
                                              </button>
                                            )}

                                            {/* Next Step */}
                                            <button
                                              type="button"
                                              onClick={() => speakStep(asana.englishName, asana.steps, speakingStepIndex + 1)}
                                              disabled={speakingStepIndex === asana.steps.length - 1}
                                              className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-[#4a654a] disabled:opacity-40 disabled:hover:bg-white/80 transition-all cursor-pointer border border-[#c3c8bf]/10 shadow-sm"
                                              title="Next Step"
                                            >
                                              <SkipForward className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Stop Button */}
                                            <button
                                              type="button"
                                              onClick={stopSpeaking}
                                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer border border-rose-200 shadow-sm"
                                              title={activeTrans.speechStop}
                                            >
                                              <Square className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                                            </button>
                                          </div>
                                        </div>

                                        {/* Auto-play and Device Voice Pack Warnings */}
                                        <div className="flex flex-col gap-1.5 border-t border-[#ccebc8]/50 pt-2 text-[10px] text-[#334d34]">
                                          <label className="flex items-center gap-1.5 font-semibold cursor-pointer select-none">
                                            <input
                                              type="checkbox"
                                              checked={autoAdvance}
                                              onChange={(e) => setAutoAdvance(e.target.checked)}
                                              className="rounded border-[#c3c8bf] text-[#4a654a] focus:ring-[#4a654a]/25 w-3.5 h-3.5"
                                            />
                                            <span>{activeTrans.speechAutoAdvance}</span>
                                          </label>
                                          {selectedLang !== "English" && (
                                            <p className="text-[9px] opacity-80 leading-normal italic">
                                              {activeTrans.speechVoiceWarning}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Ordered list of steps with highlighting */}
                                    <ol className="space-y-2 pl-1.5 text-xs text-[#1b1c19] leading-relaxed list-none">
                                      {asana.steps.map((st, i) => {
                                        const isActive = speakingAsana === asana.englishName && speakingStepIndex === i;
                                        return (
                                          <li
                                            key={i}
                                            onClick={() => {
                                              speakStep(asana.englishName, asana.steps, i);
                                            }}
                                            className={`flex gap-2.5 p-2 rounded-xl transition-all duration-300 cursor-pointer ${isActive
                                              ? "bg-[#ccebc8]/40 border-l-4 border-[#4a654a] pl-3.5 font-semibold text-[#334d34] shadow-sm scale-[1.01]"
                                              : "hover:bg-slate-50 border-l-4 border-transparent pl-3"
                                              }`}
                                          >
                                            <span className={`font-bold font-mono ${isActive ? "text-[#4a654a]" : "text-slate-400"}`}>
                                              {i + 1}.
                                            </span>
                                            <span className="flex-1">{st}</span>
                                          </li>
                                        );
                                      })}
                                    </ol>
                                  </div>

                                  {/* Breathe direction & precaution callouts side-by-side on desktop */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1.5">
                                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
                                      <div className="flex justify-between items-center">
                                        <h6 className="font-bold text-[10px] uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                                          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                                          <span>{activeTrans.breathingLabel}</span>
                                        </h6>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            speakText(asana.breathingCue);
                                          }}
                                          className="p-1 rounded hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                                          title={activeTrans.speechPlay}
                                        >
                                          <Volume2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                      <p className="text-[#434841] text-[11px] leading-relaxed italic">
                                        "{asana.breathingCue}"
                                      </p>
                                    </div>

                                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1">
                                      <h6 className="font-bold text-[10px] uppercase tracking-wider text-amber-800 flex items-center gap-1">
                                        <Info className="w-3.5 h-3.5 text-amber-700" />
                                        <span>{activeTrans.cautionLabel}</span>
                                      </h6>
                                      <p className="text-[#434841] text-[11px] leading-relaxed">
                                        {asana.contraindications}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Practice session action logger directly nested in detail card */}
                                  <div className="pt-2 flex justify-end gap-2 text-xs">
                                    <button
                                      onClick={() => {
                                        logSessionCompletion();
                                      }}
                                      className="px-4 py-2 bg-[#4a654a] text-white rounded-lg font-semibold hover:bg-[#4a654a]/90 active:scale-95 transition-all text-[11px]"
                                    >
                                      {selectedLang === "Telugu" ? "ఈ ఆసనం పూర్తయింది" : selectedLang === "Hindi" ? "यह आसन पूरा हुआ" : "Log Practice Done"}
                                    </button>
                                  </div>

                                </div>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* Interactive Chat Dialogue Coach to support severe cases, adjustments, questions */}
            <section className="bg-white border border-[#c3c8bf]/20 rounded-3xl overflow-hidden shadow-sm mt-8">
              {/* Chat header */}
              <div className="p-4 bg-[#ccebc8]/20 border-b border-[#eae8e3] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#primary-fixed-dim] text-[#4a654a] flex items-center justify-center">
                  <span className="text-xl">🕉️</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1b1c19]">
                    {activeTrans.chatCoachHeader}
                  </h3>
                  <p className="text-[11px] text-[#434841]">
                    {activeTrans.chatCoachDesc}
                  </p>
                </div>
              </div>

              {/* Chat dialogue list */}
              <div className="p-4 h-62 overflow-y-auto space-y-3 bg-slate-50/30 text-xs">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm leading-relaxed ${msg.role === "user"
                      ? "bg-[#5b5b81] text-white rounded-tr-none"
                      : "bg-[#f0eee9] text-[#1b1c19] rounded-tl-none border border-[#c3c8bf]/10"
                      }`}>
                      <p className="text-xs font-normal whitespace-pre-wrap">{msg.content}</p>

                      <div className="flex justify-between items-center mt-1.5 gap-4">
                        {/* Speaker Button for assistant responses */}
                        {msg.role === "assistant" && (
                          <button
                            type="button"
                            onClick={() => speakChatMessage(msg.id, msg.content)}
                            className="p-1 px-1.5 rounded-md bg-black/5 hover:bg-black/10 text-[#4a654a] transition-all active:scale-90 flex items-center gap-1.5 cursor-pointer"
                            title="Speak response"
                          >
                            {speakingTextId === msg.id ? (
                              <>
                                <Square className="w-2.5 h-2.5 fill-[#4a654a]" />
                                <span className="text-[9px] font-semibold">{activeTrans.speechStop}</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-2.5 h-2.5" />
                                <span className="text-[9px] font-semibold">{activeTrans.speechPlay}</span>
                              </>
                            )}
                          </button>
                        )}

                        <span className={`block text-[8px] font-mono ml-auto opacity-65 ${msg.role === "user" ? "text-slate-200" : "text-[#434841]"}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#f0eee9] text-[#434841] rounded-2xl rounded-tl-none px-4 py-2.5 border border-[#c3c8bf]/10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat input form */}
              <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-[#eae8e3] flex gap-2">
                <input
                  id="chat-input-field"
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={activeTrans.chatPlaceholder}
                  className="flex-grow h-10 px-3 bg-[#f5f3ee] border-none rounded-xl text-xs text-[#1b1c19] placeholder:text-[#c3c8bf] focus:ring-1 focus:ring-[#4a654a]/30 focus:bg-white transition-all outline-none"
                />
                <button
                  type="submit"
                  className="h-10 px-4 bg-[#4a654a] text-white rounded-xl text-xs font-bold hover:bg-[#4a654a]/95 active:scale-95 transition-all outline-none"
                >
                  {activeTrans.chatSend}
                </button>
              </form>
            </section>
          </div>
        )}

        {/* TAB 3: FOUNDATIONAL ASANAS LIBRARY DESCRIPTION */}
        {activeTab === "asanas" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-[#1b1c19] flex items-center gap-1.5">
                <Compass className="w-5.5 h-5.5 text-[#4a654a]" />
                <span>{selectedLang === "Telugu" ? "ఆసనాల భాండాగారం" : selectedLang === "Hindi" ? "आसन पुस्तकालय" : "Asana Library"}</span>
              </h2>
              <p className="text-xs md:text-sm text-[#434841]">
                {selectedLang === "Telugu"
                  ? "ఏ శోధన అవసరం లేకుండా సమతుల్యమైన జీవనం కొరకు మా ప్రామాణిక యోగాసనాలను ఇక్కడ నేరుగా పర్యవేక్షించండి."
                  : selectedLang === "Hindi"
                    ? "बिना किसी खोज के, हमारे प्राचीन योग ग्रंथों पर आधारित आसनों की सूची यहाँ देखें और सीखें।"
                    : "Consult our static reference guide detailing foundational Hatha and restorative postures containing instructions and cues."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FOUNDATIONAL_ASANAS[selectedLang || "English"].map((asana) => {
                const hasFaved = favoriteAsanas.includes(asana.englishName);
                return (
                  <div
                    key={asana.englishName}
                    className="bg-white border border-[#c3c8bf]/25 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-bold tracking-wider text-[#4a654a] bg-[#ccebc8] px-2 py-0.5 rounded-full uppercase">
                            {asana.difficulty}
                          </span>
                          <h3 className="text-base font-bold text-[#1b1c19] mt-1.5">
                            {asana.localName}
                          </h3>
                        </div>

                        <button
                          onClick={() => toggleFavorite(asana.englishName)}
                          className="p-1.5 rounded-full hover:bg-slate-50 transition-all text-slate-400"
                        >
                          <Heart className={`w-4.5 h-4.5 ${hasFaved ? "fill-rose-500 text-rose-500" : ""}`} />
                        </button>
                      </div>

                      {/* Visual Pose Illustration in Library */}
                      <div className="w-full aspect-video rounded-xl overflow-hidden border border-[#c3c8bf]/10 bg-[#fbf9f4] shadow-inner shrink-0 mb-3">
                        <AsanaIllustration
                          englishName={asana.englishName}
                          localName={asana.localName}
                          className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                        />
                      </div>

                      <p className="text-xs text-[#434841] font-mono leading-relaxed italic">
                        "{asana.sanskritName}"
                      </p>

                      <p className="text-xs text-[#1b1c19] leading-relaxed">
                        {asana.benefits}
                      </p>

                      <div className="border-t border-[#eae8e3] pt-2 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] uppercase font-bold text-[#4a654a]">
                            {activeTrans.stepsLabel}
                          </h4>
                          {/* TTS Speaker button for static cards */}
                          {speakingAsana !== asana.englishName ? (
                            <button
                              type="button"
                              onClick={() => speakStep(asana.englishName, asana.steps, 0)}
                              className="p-1 rounded bg-[#4a654a]/10 hover:bg-[#4a654a]/20 text-[#4a654a] transition-all active:scale-95 cursor-pointer"
                              title={activeTrans.speechPlay}
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={stopSpeaking}
                              className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all active:scale-95 cursor-pointer"
                              title={activeTrans.speechStop}
                            >
                              <Square className="w-3 h-3 fill-rose-600 text-rose-600" />
                            </button>
                          )}
                        </div>
                        {speakingAsana === asana.englishName && (
                          <div className="bg-[#ccebc8]/25 border border-[#ccebc8]/60 p-2.5 rounded-xl space-y-1.5 text-[11px] text-[#334d34] animate-fade-in">
                            <div className="flex justify-between items-center font-bold">
                              <span>{activeTrans.speechGuideTitle}: {speakingStepIndex + 1}/{asana.steps.length}</span>
                              <div className="flex gap-1.5">
                                <button type="button" onClick={() => speakStep(asana.englishName, asana.steps, speakingStepIndex - 1)} disabled={speakingStepIndex === 0} className="px-1.5 py-0.5 rounded bg-white hover:bg-[#eae8e3] disabled:opacity-40 border border-[#c3c8bf]/10 cursor-pointer">◀</button>
                                <button type="button" onClick={() => speakStep(asana.englishName, asana.steps, speakingStepIndex + 1)} disabled={speakingStepIndex === asana.steps.length - 1} className="px-1.5 py-0.5 rounded bg-white hover:bg-[#eae8e3] disabled:opacity-40 border border-[#c3c8bf]/10 cursor-pointer">▶</button>
                              </div>
                            </div>
                            <p className="italic font-medium">"{asana.steps[speakingStepIndex]}"</p>
                          </div>
                        )}
                        <ul className="list-disc list-inside space-y-1 text-xs text-[#434841] leading-relaxed">
                          {asana.steps.slice(0, 3).map((st, i) => (
                            <li key={i}>{st}</li>
                          ))}
                          {asana.steps.length > 3 && (
                            <li className="list-none text-[10px] text-[#4a654a] font-semibold mt-1">
                              + {asana.steps.length - 3} {selectedLang === "Telugu" ? "మరిన్ని దశలు..." : selectedLang === "Hindi" ? "अधिक चरण..." : "more steps..."}
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => {
                          setSearchQuery(asana.englishName);
                          triggerYogaSearch(asana.englishName);
                        }}
                        className="w-full text-center py-2 bg-[#5b5b81]/15 text-[#5b5b81] rounded-lg text-xs font-semibold hover:bg-[#5b5b81]/25 active:scale-98 transition-all"
                      >
                        {selectedLang === "Telugu" ? "పూర్తి వివరాలు చూడండి" : selectedLang === "Hindi" ? "पूर्ण विवरण देखें" : "View Full Safety Guide"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: USER PROFILE TRACKER */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-[#1b1c19] flex items-center gap-1.5">
                <User className="w-5.5 h-5.5 text-[#4a654a]" />
                <span>{selectedLang === "Telugu" ? "వ్యక్తిగత పురోగతి" : selectedLang === "Hindi" ? "व्यक्तिगत प्रोफ़ाइल" : "Your Sadhana Tracker"}</span>
              </h2>
              <p className="text-xs md:text-sm text-[#434841]">
                {selectedLang === "Telugu"
                  ? "మీ రోజువారీ యోగా అలవాట్లను, ఇష్టమైన ఆసనాలను మరియు స్థిర ఆరోగ్య లక్ష్యాలను ఇక్కడ సులువుగా పర్యవేక్షించండి."
                  : selectedLang === "Hindi"
                    ? "अपनी दैनिक योग आदतों, पसंदीदा आसनों, और स्थिर स्वास्थ्य लक्ष्यों को यहाँ ट्रैक करें।"
                    : "Track your wellness consistency, log daily completions, and re-access bookmarked safety modifications."}
              </p>
            </div>

            {/* Profile bento row statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Daily Streak Card */}
              <div className="bg-white border border-[#c3c8bf]/20 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Flame className="w-5 h-5 fill-amber-500 text-amber-500 animate-pulse" />
                </div>
                <span className="text-2xl font-black text-slate-800 font-mono">
                  {userStreakDays}
                </span>
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {selectedLang === "Telugu" ? "రోజుల పరంపర" : selectedLang === "Hindi" ? "लगातार दिन" : "Day Streak"}
                </h4>
                <p className="text-[10px] text-[#434841]/70 leading-normal">
                  Consistently steady! Keep up the momentum.
                </p>
              </div>

              {/* Total completed sessions */}
              <div className="bg-white border border-[#c3c8bf]/20 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#4a654a] flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#4a654a]" />
                </div>
                <span className="text-2xl font-black text-slate-800 font-mono">
                  {completedSessionsCount}
                </span>
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {selectedLang === "Telugu" ? "పూర్తయిన సెషన్స్" : selectedLang === "Hindi" ? "कुल योगाभ्यास" : "Asanas Logged"}
                </h4>
                <p className="text-[10px] text-[#434841]/70 leading-normal">
                  Each session contributes directly to celular healing.
                </p>
              </div>

              {/* Level / Focus state */}
              <div className="bg-white border border-[#c3c8bf]/20 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-[#5b5b81] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#5b5b81]" />
                </div>
                <span className="text-lg font-black text-slate-800">
                  {selectedLang === "Telugu" ? "యోగ అభ్యాసకుడు" : selectedLang === "Hindi" ? "योग साधक" : "Sadhaka"}
                </span>
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {selectedLang === "Telugu" ? "ప్రస్తుత హోదా" : selectedLang === "Hindi" ? "अभ्यास स्तर" : "Core status"}
                </h4>
                <p className="text-[10px] text-[#434841]/70 leading-normal">
                  Grounding mind and trunk with steady posture.
                </p>
              </div>
            </div>

            {/* Bookmarked Favorites List section */}
            <div className="bg-white border border-[#c3c8bf]/20 rounded-2xl p-5 shadow-sm space-y-3.5">
              <h3 className="text-sm font-bold text-[#1b1c19] flex items-center gap-1.5">
                <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500" />
                <span>{selectedLang === "Telugu" ? "ఇష్టమైన ఆసనాల జాబితా" : selectedLang === "Hindi" ? "मेरे पसंदीदा आसन" : "My Saved Anchors"}</span>
              </h3>

              {favoriteAsanas.length === 0 ? (
                <p className="text-xs text-[#434841] py-4 text-center italic">
                  No bookmarked asanas yet. Search or click on the heart icon of any recommended pose to save suggestions here.
                </p>
              ) : (
                <div className="divide-y divide-[#eae8e3] text-xs">
                  {favoriteAsanas.map((fav) => (
                    <div
                      key={fav}
                      className="py-3 flex justify-between items-center hover:bg-slate-50/50 px-1"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#1b1c19] text-sm block">
                          {fav}
                        </span>
                        <span className="text-[11px] text-[#434841]/80 block">
                          Restorative posture saved in local cache
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSearchQuery(fav);
                            triggerYogaSearch(fav);
                          }}
                          className="px-3 py-1.5 bg-[#4a654a]/10 text-[#4a654a] rounded-lg text-xs font-semibold hover:bg-[#4a654a]/20"
                        >
                          {selectedLang === "Telugu" ? "చూడు" : selectedLang === "Hindi" ? "देखें" : "Practice"}
                        </button>

                        <button
                          onClick={() => toggleFavorite(fav)}
                          className="text-xs text-rose-500 hover:underline px-2.5"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Practice resetting options (Offline developer clean utility) */}
            <div className="bg-[#ba1a1a]/5 p-4 rounded-2xl border border-[#ba1a1a]/15 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-[#ba1a1a]">Reset practice statistics</h4>
                <p className="text-[11px] text-[#434841] mt-0.5">Clear local storage counters, favorites list, and selected language settings.</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("sthira_favorites");
                  localStorage.removeItem("sthira_sessions_count");
                  localStorage.removeItem("sthira_streak");
                  localStorage.removeItem("sthira_language");
                  setFavoriteAsanas([]);
                  setCompletedSessionsCount(0);
                  setUserStreakDays(0);
                  setSelectedLang(null); // Return to languages overlay
                }}
                className="px-4 py-2 bg-[#ba1a1a] text-white rounded-lg font-semibold hover:bg-[#ba1a1a]/90 active:scale-95 text-[11px]"
              >
                Reset All
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Elegant, nature-loving Sticky Footer conforming to screens */}
      <footer className="w-full bg-[#f5f3ee] border-t border-[#c3c8bf]/15 px-4 md:px-8 py-8 flex flex-col items-center text-center gap-4 mt-auto">
        <div className="font-bold text-base text-[#4a654a] flex items-center gap-1">
          <span>🧘</span>
          <span>Sthira Sukham</span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-[#434841] text-xs font-medium">
          <button onClick={() => changeLanguage("Telugu")} className="hover:text-[#4a654a] transition-colors">Telugu</button>
          <button onClick={() => changeLanguage("Hindi")} className="hover:text-[#4a654a] transition-colors">Hindi</button>
          <button onClick={() => changeLanguage("English")} className="hover:text-[#4a654a] transition-colors">English</button>
          <span className="text-[#c3c8bf] hidden sm:inline">|</span>
          <span className="hover:text-[#4a654a] cursor-pointer">Disclaimer</span>
          <span className="hover:text-[#4a654a] cursor-pointer">Privacy</span>
        </div>

        <p className="text-[10px] text-[#434841] max-w-lg mt-2 opacity-80 leading-relaxed">
          {activeTrans.footerWarning}
        </p>
      </footer>

      {/* Fixed Sticky Bottom Navigation Bar conforming to Screen mockup design perfectly */}
      <nav id="bottom-navigation-bar" className="fixed bottom-0 left-0 right-0 w-full z-45 flex justify-around items-center px-4 py-3 bg-white border-t border-[#eae8e3] shadow-lg rounded-t-2xl md:hidden">

        {/* Home */}
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center justify-center w-16 transition-all duration-150 active:scale-90 ${activeTab === "home" ? "text-[#4a654a] font-bold" : "text-[#434841]"
            }`}
        >
          <HomeIcon className={`w-5 h-5 ${activeTab === "home" ? "stroke-[2.5]" : "opacity-80"}`} />
          <span className="text-[10px] mt-1">{activeTrans.homeNav}</span>
        </button>

        {/* AI Search Icon active toggle matching screen visual capsule style */}
        <button
          onClick={() => setActiveTab("search")}
          className={`flex flex-col items-center justify-center transition-all duration-150 active:scale-90 ${activeTab === "search"
            ? "bg-[#ccebc8] text-[#07200b] rounded-full px-5 py-1 font-bold"
            : "text-[#434841]"
            }`}
        >
          <Search className={`w-5 h-5 ${activeTab === "search" ? "stroke-[2.5]" : "opacity-80"}`} />
          <span className="text-[10px] mt-0.5">{activeTrans.searchNav}</span>
        </button>

        {/* Asana Library */}
        <button
          onClick={() => setActiveTab("asanas")}
          className={`flex flex-col items-center justify-center w-16 transition-all duration-150 active:scale-90 ${activeTab === "asanas" ? "text-[#4a654a] font-bold" : "text-[#434841]"
            }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === "asanas" ? "stroke-[2.5]" : "opacity-80"}`} />
          <span className="text-[10px] mt-1">{activeTrans.asanasNav}</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center justify-center w-16 transition-all duration-150 active:scale-90 ${activeTab === "profile" ? "text-[#4a654a] font-bold" : "text-[#434841]"
            }`}
        >
          <User className={`w-5 h-5 ${activeTab === "profile" ? "stroke-[2.5]" : "opacity-80"}`} />
          <span className="text-[10px] mt-1">{activeTrans.profileNav}</span>
        </button>

      </nav>

    </div>
  );
}
