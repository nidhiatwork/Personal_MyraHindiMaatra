/* ============================================================================
   Myra's Hindi Maatra Adventure — 31-Day Curriculum
   ----------------------------------------------------------------------------
   Each day object:
     day        : lesson number (1..31)
     kind       : "lesson" | "review" | "celebrate"
     title      : Hindi title shown big
     titleEn    : English/Hinglish subtitle
     maatra     : the vowel-sign character (e.g. "ा") — "" for day 1 / specials
     maatraName : friendly name ("aa ki maatra")
     sound      : Hindi sound to pronounce (spoken by Mithu)
     soundRoman : roman hint ("aa")
     intro      : one short Hindi sentence
     introEn    : simple English explanation for Myra / parent
     tip        : a kid-friendly memory tip (English)
     syllables  : [{s:"का", r:"kaa"}]  consonant+maatra practice
     words      : [{w:"आम", r:"aam", m:"mango", e:"🥭"}]
     game       : "listen" | "match" | "build" | "whichMaatra" | "sentence" | "read"
     sentences  : (optional) [{s:"यह आम है।", r:"yeh aam hai", m:"This is a mango."}]
     poem       : (optional) [lines...] for read-along days
   The engine builds quizzes automatically from `words`/`syllables`.
   ========================================================================== */
const CURRICULUM = [
  /* ------------------------- WEEK 1 : a, aa, i, ee ------------------------ */
  {
    day: 1, kind: "lesson",
    title: "अ की आवाज़", titleEn: "The 'a' sound (no maatra)",
    maatra: "", maatraName: "बिना मात्रा (plain letters)",
    sound: "अ", soundRoman: "a",
    intro: "हर अक्षर में 'अ' छुपा होता है।",
    introEn: "Every plain letter already says 'a'. क = ka, म = ma, न = na!",
    tip: "No stick, no sign — the letter just says its 'a' sound.",
    letters: ["क","म","न","ल","प","र","ग","स","ब","त","द","ह","ज","व"],
    syllables: [
      {s:"क", r:"ka"},{s:"म", r:"ma"},{s:"न", r:"na"},{s:"ल", r:"la"},
      {s:"प", r:"pa"},{s:"र", r:"ra"},{s:"ग", r:"ga"},{s:"स", r:"sa"}
    ],
    words: [
      {w:"घर", r:"ghar", m:"home", e:"🏠"},
      {w:"नल", r:"nal", m:"tap", e:"🚰"},
      {w:"बस", r:"bas", m:"bus", e:"🚌"},
      {w:"जल", r:"jal", m:"water", e:"💧"},
      {w:"पर", r:"par", m:"feather", e:"🪶"},
      {w:"मन", r:"man", m:"heart", e:"❤️"},
      {w:"कलम", r:"kalam", m:"pen", e:"🖊️"},
      {w:"कमल", r:"kamal", m:"lotus", e:"🪷"},
      {w:"नमक", r:"namak", m:"salt", e:"🧂"},
      {w:"वन", r:"van", m:"forest", e:"🌳"},
      {w:"मगर", r:"magar", m:"crocodile", e:"🐊"},
      {w:"बतख", r:"batakh", m:"duck", e:"🦆"},
      {w:"कप", r:"kap", m:"cup", e:"☕"},
      {w:"रथ", r:"rath", m:"chariot", e:"🛕"},
      {w:"सड़क", r:"sadak", m:"road", e:"🛣️"}
    ],
    game: "listen"
  },
  {
    day: 2, kind: "lesson",
    title: "आ की मात्रा", titleEn: "aa ki maatra ( ा )",
    maatra: "ा", maatraName: "aa ki maatra",
    sound: "आ", soundRoman: "aa",
    intro: "अक्षर के बाद एक खड़ी लकीर — आ!",
    introEn: "Add a standing stick AFTER the letter to make 'aa'. क + ा = का!",
    tip: "The 'aa' stick stands tall right after the letter.",
    syllables: [
      {s:"का", r:"kaa"},{s:"गा", r:"gaa"},{s:"मा", r:"maa"},{s:"ना", r:"naa"},
      {s:"पा", r:"paa"},{s:"रा", r:"raa"},{s:"दा", r:"daa"},{s:"बा", r:"baa"}
    ],
    words: [
      {w:"आम", r:"aam", m:"mango", e:"🥭"},
      {w:"नाव", r:"naav", m:"boat", e:"⛵"},
      {w:"हाथ", r:"haath", m:"hand", e:"✋"},
      {w:"बाल", r:"baal", m:"hair", e:"💇"},
      {w:"माला", r:"maalaa", m:"garland", e:"📿"},
      {w:"राजा", r:"raajaa", m:"king", e:"🤴"},
      {w:"काम", r:"kaam", m:"work", e:"💼"},
      {w:"नाम", r:"naam", m:"name", e:"📛"},
      {w:"आग", r:"aag", m:"fire", e:"🔥"},
      {w:"कान", r:"kaan", m:"ear", e:"👂"},
      {w:"नाक", r:"naak", m:"nose", e:"👃"},
      {w:"आठ", r:"aath", m:"eight", e:"8️⃣"},
      {w:"गाय", r:"gaay", m:"cow", e:"🐄"},
      {w:"दाल", r:"daal", m:"lentils", e:"🍲"},
      {w:"बादल", r:"baadal", m:"cloud", e:"☁️"}
    ],
    game: "match"
  },
  {
    day: 3, kind: "review",
    title: "अ और आ — दोहराओ", titleEn: "Review: a & aa",
    maatra: "ा", maatraName: "a vs aa",
    sound: "आ", soundRoman: "aa",
    intro: "छोटी 'अ' और लंबी 'आ' को पहचानो।",
    introEn: "Let's mix short 'a' and long 'aa' words. Listen carefully!",
    tip: "Short 'a' = quick. Long 'aa' = stretch it: aaa!",
    syllables: [
      {s:"क", r:"ka"},{s:"का", r:"kaa"},{s:"म", r:"ma"},{s:"मा", r:"maa"},
      {s:"न", r:"na"},{s:"ना", r:"naa"}
    ],
    words: [
      {w:"कमल", r:"kamal", m:"lotus", e:"🪷"},
      {w:"नमक", r:"namak", m:"salt", e:"🧂"},
      {w:"आम", r:"aam", m:"mango", e:"🥭"},
      {w:"नाना", r:"naanaa", m:"grandpa", e:"👴"},
      {w:"बादल", r:"baadal", m:"cloud", e:"☁️"},
      {w:"कपड़ा", r:"kapdaa", m:"cloth", e:"🧺"},
      {w:"घर", r:"ghar", m:"home", e:"🏠"},
      {w:"काम", r:"kaam", m:"work", e:"💼"},
      {w:"आग", r:"aag", m:"fire", e:"🔥"},
      {w:"हाथ", r:"haath", m:"hand", e:"✋"},
      {w:"जल", r:"jal", m:"water", e:"💧"},
      {w:"गाय", r:"gaay", m:"cow", e:"🐄"},
      {w:"नाव", r:"naav", m:"boat", e:"⛵"}
    ],
    game: "listen"
  },
  {
    day: 4, kind: "lesson",
    title: "इ की मात्रा", titleEn: "choti ee ( ि )",
    maatra: "ि", maatraName: "choti ee ki maatra",
    sound: "इ", soundRoman: "i",
    intro: "यह मात्रा अक्षर से पहले लगती है!",
    introEn: "Surprise! The choti-ee sign is written BEFORE the letter. ि + द = दि (di)!",
    tip: "Choti-ee jumps to the FRONT — but you still say it after: 'di'.",
    syllables: [
      {s:"कि", r:"ki"},{s:"दि", r:"di"},{s:"नि", r:"ni"},{s:"ति", r:"ti"},
      {s:"लि", r:"li"},{s:"गि", r:"gi"},{s:"मि", r:"mi"},{s:"सि", r:"si"}
    ],
    words: [
      {w:"दिन", r:"din", m:"day", e:"🌞"},
      {w:"दिल", r:"dil", m:"heart", e:"❤️"},
      {w:"तिल", r:"til", m:"sesame", e:"⚫"},
      {w:"गिन", r:"gin", m:"count", e:"🔢"},
      {w:"मिल", r:"mil", m:"meet", e:"🤝"},
      {w:"किताब", r:"kitaab", m:"book", e:"📖"},
      {w:"चिड़िया", r:"chidiyaa", m:"bird", e:"🐦"},
      {w:"खिड़की", r:"khidkee", m:"window", e:"🪟"},
      {w:"दिया", r:"diyaa", m:"lamp", e:"🪔"},
      {w:"पिन", r:"pin", m:"pin", e:"📌"},
      {w:"टिकट", r:"tikat", m:"ticket", e:"🎫"},
      {w:"किला", r:"kilaa", m:"fort", e:"🏰"},
      {w:"सिर", r:"sir", m:"head", e:"🧑"},
      {w:"हिरन", r:"hiran", m:"deer", e:"🦌"},
      {w:"दिशा", r:"dishaa", m:"direction", e:"🧭"}
    ],
    game: "build"
  },
  {
    day: 5, kind: "lesson",
    title: "ई की मात्रा", titleEn: "badi ee ( ी )",
    maatra: "ी", maatraName: "badi ee ki maatra",
    sound: "ई", soundRoman: "ee",
    intro: "यह मात्रा अक्षर के बाद लगती है — लंबी ई!",
    introEn: "The badi-ee sign goes AFTER the letter for a long 'ee'. न + ी = नी (nee)!",
    tip: "Badi-ee stands after the letter. Stretch it: 'neee'!",
    syllables: [
      {s:"की", r:"kee"},{s:"नी", r:"nee"},{s:"दी", r:"dee"},{s:"ती", r:"tee"},
      {s:"पी", r:"pee"},{s:"ली", r:"lee"},{s:"मी", r:"mee"},{s:"सी", r:"see"}
    ],
    words: [
      {w:"नानी", r:"naanee", m:"grandma", e:"👵"},
      {w:"दीदी", r:"deedee", m:"big sister", e:"👧"},
      {w:"पानी", r:"paanee", m:"water", e:"💧"},
      {w:"नदी", r:"nadee", m:"river", e:"🏞️"},
      {w:"चाबी", r:"chaabee", m:"key", e:"🔑"},
      {w:"हाथी", r:"haathee", m:"elephant", e:"🐘"},
      {w:"बकरी", r:"bakree", m:"goat", e:"🐐"},
      {w:"मछली", r:"machhlee", m:"fish", e:"🐟"},
      {w:"साड़ी", r:"saadee", m:"saree", e:"🥻"},
      {w:"दाढ़ी", r:"daadhee", m:"beard", e:"🧔"},
      {w:"टीवी", r:"teevee", m:"TV", e:"📺"},
      {w:"घी", r:"ghee", m:"ghee", e:"🧈"},
      {w:"खीर", r:"kheer", m:"rice pudding", e:"🍮"},
      {w:"चीता", r:"cheetaa", m:"cheetah", e:"🐆"},
      {w:"लकड़ी", r:"lakadee", m:"wood", e:"🪵"}
    ],
    game: "match"
  },
  {
    day: 6, kind: "review",
    title: "इ बनाम ई", titleEn: "choti ee vs badi ee",
    maatra: "ी", maatraName: "i vs ee",
    sound: "ई", soundRoman: "ee",
    intro: "छोटी इ छोटी आवाज़, बड़ी ई लंबी आवाज़।",
    introEn: "The big one! Choti-ee is short 'i', badi-ee is long 'ee'. Which do you hear?",
    tip: "दिन (din) is short. दीदी (deedee) is long. Listen for the stretch!",
    syllables: [
      {s:"दि", r:"di"},{s:"दी", r:"dee"},{s:"नि", r:"ni"},{s:"नी", r:"nee"},
      {s:"पि", r:"pi"},{s:"पी", r:"pee"}
    ],
    words: [
      {w:"दिन", r:"din", m:"day", e:"🌞"},
      {w:"दीदी", r:"deedee", m:"sister", e:"👧"},
      {w:"तिल", r:"til", m:"sesame", e:"⚫"},
      {w:"तीर", r:"teer", m:"arrow", e:"🏹"},
      {w:"किला", r:"kilaa", m:"fort", e:"🏰"},
      {w:"नीला", r:"neelaa", m:"blue", e:"🔵"},
      {w:"पानी", r:"paanee", m:"water", e:"💧"},
      {w:"नदी", r:"nadee", m:"river", e:"🏞️"},
      {w:"हाथी", r:"haathee", m:"elephant", e:"🐘"},
      {w:"दिल", r:"dil", m:"heart", e:"❤️"},
      {w:"चाबी", r:"chaabee", m:"key", e:"🔑"},
      {w:"मछली", r:"machhlee", m:"fish", e:"🐟"},
      {w:"टीवी", r:"teevee", m:"TV", e:"📺"},
      {w:"बकरी", r:"bakree", m:"goat", e:"🐐"}
    ],
    game: "whichMaatra"
  },
  {
    day: 7, kind: "celebrate",
    title: "पहला हफ़्ता पूरा!", titleEn: "Week 1 Complete! 🎉",
    maatra: "", maatraName: "celebration",
    sound: "शाबाश", soundRoman: "shaabaash",
    intro: "मायरा, तुमने अ, आ, इ, ई सीख लिया!",
    introEn: "You did it, Myra! You learned a, aa, choti-ee and badi-ee. Read these!",
    tip: "You are already reading real Hindi words. Amazing!",
    syllables: [
      {s:"का", r:"kaa"},{s:"कि", r:"ki"},{s:"की", r:"kee"},{s:"ना", r:"naa"},
      {s:"नि", r:"ni"},{s:"नी", r:"nee"}
    ],
    words: [
      {w:"आम", r:"aam", m:"mango", e:"🥭"},
      {w:"नानी", r:"naanee", m:"grandma", e:"👵"},
      {w:"किताब", r:"kitaab", m:"book", e:"📖"},
      {w:"पानी", r:"paanee", m:"water", e:"💧"},
      {w:"हाथी", r:"haathee", m:"elephant", e:"🐘"},
      {w:"बादल", r:"baadal", m:"cloud", e:"☁️"},
      {w:"घर", r:"ghar", m:"home", e:"🏠"},
      {w:"दिन", r:"din", m:"day", e:"🌞"},
      {w:"नदी", r:"nadee", m:"river", e:"🏞️"},
      {w:"मछली", r:"machhlee", m:"fish", e:"🐟"},
      {w:"गाय", r:"gaay", m:"cow", e:"🐄"},
      {w:"चाबी", r:"chaabee", m:"key", e:"🔑"},
      {w:"माला", r:"maalaa", m:"garland", e:"📿"}
    ],
    game: "read", badge: "⭐ हफ़्ता 1"
  },

  /* ------------------------- WEEK 2 : u, oo, e, ai ------------------------ */
  {
    day: 8, kind: "lesson",
    title: "उ की मात्रा", titleEn: "chota u ( ু → ु )",
    maatra: "ु", maatraName: "chota u ki maatra",
    sound: "उ", soundRoman: "u",
    intro: "अक्षर के नीचे छोटा हुक — उ!",
    introEn: "Add a little hook UNDER the letter for a short 'u'. त + ु = तु (tu)!",
    tip: "Chota-u hides under the letter. Say it short: 'tu'.",
    syllables: [
      {s:"कु", r:"ku"},{s:"तु", r:"tu"},{s:"सु", r:"su"},{s:"मु", r:"mu"},
      {s:"गु", r:"gu"},{s:"लु", r:"lu"},{s:"बु", r:"bu"},{s:"धु", r:"dhu"}
    ],
    words: [
      {w:"तुम", r:"tum", m:"you", e:"🫵"},
      {w:"गुड़", r:"gud", m:"jaggery", e:"🟤"},
      {w:"सुन", r:"sun", m:"listen", e:"👂"},
      {w:"धुन", r:"dhun", m:"tune", e:"🎵"},
      {w:"बुरा", r:"buraa", m:"bad", e:"👎"},
      {w:"मुकुट", r:"mukut", m:"crown", e:"👑"},
      {w:"गुड़िया", r:"gudiyaa", m:"doll", e:"🪆"},
      {w:"गुलाब", r:"gulaab", m:"rose", e:"🌹"},
      {w:"सुई", r:"suee", m:"needle", e:"🪡"},
      {w:"पुल", r:"pul", m:"bridge", e:"🌉"},
      {w:"मधु", r:"madhu", m:"honey", e:"🍯"},
      {w:"गुफा", r:"gufaa", m:"cave", e:"🕳️"},
      {w:"सुबह", r:"subah", m:"morning", e:"🌅"},
      {w:"बुलबुल", r:"bulbul", m:"nightingale", e:"🐦"},
      {w:"कुरता", r:"kurtaa", m:"kurta", e:"👕"}
    ],
    game: "build"
  },
  {
    day: 9, kind: "lesson",
    title: "ऊ की मात्रा", titleEn: "bada u ( ू )",
    maatra: "ू", maatraName: "bada u ki maatra",
    sound: "ऊ", soundRoman: "oo",
    intro: "अक्षर के नीचे बड़ा हुक — ऊ!",
    introEn: "A bigger hook under the letter makes a long 'oo'. फ + ू = फू, फूल (phool)!",
    tip: "Bada-oo is the long one: 'phooool' — like a big flower.",
    syllables: [
      {s:"कू", r:"koo"},{s:"तू", r:"too"},{s:"सू", r:"soo"},{s:"फू", r:"phoo"},
      {s:"झू", r:"jhoo"},{s:"भू", r:"bhoo"},{s:"चू", r:"choo"},{s:"जू", r:"joo"}
    ],
    words: [
      {w:"फूल", r:"phool", m:"flower", e:"🌸"},
      {w:"झूला", r:"jhoolaa", m:"swing", e:"🛝"},
      {w:"आलू", r:"aaloo", m:"potato", e:"🥔"},
      {w:"भालू", r:"bhaaloo", m:"bear", e:"🐻"},
      {w:"चूहा", r:"choohaa", m:"mouse", e:"🐭"},
      {w:"जूता", r:"jootaa", m:"shoe", e:"👟"},
      {w:"चूड़ी", r:"choodee", m:"bangle", e:"💍"},
      {w:"झाड़ू", r:"jhaadoo", m:"broom", e:"🧹"},
      {w:"काजू", r:"kaajoo", m:"cashew", e:"🥜"},
      {w:"मूली", r:"moolee", m:"radish", e:"🥬"},
      {w:"सूरज", r:"sooraj", m:"sun", e:"🌞"},
      {w:"कबूतर", r:"kabootar", m:"pigeon", e:"🕊️"},
      {w:"भूत", r:"bhoot", m:"ghost", e:"👻"},
      {w:"दूध", r:"doodh", m:"milk", e:"🥛"},
      {w:"चाकू", r:"chaakoo", m:"knife", e:"🔪"}
    ],
    game: "match"
  },
  {
    day: 10, kind: "review",
    title: "उ बनाम ऊ", titleEn: "chota u vs bada u",
    maatra: "ू", maatraName: "u vs oo",
    sound: "ऊ", soundRoman: "oo",
    intro: "छोटी उ और लंबी ऊ की आवाज़ पहचानो।",
    introEn: "Short 'u' or long 'oo'? Listen to the hook under the letter!",
    tip: "गुड़ (gud) is short. फूल (phool) is long. Feel the difference!",
    syllables: [
      {s:"कु", r:"ku"},{s:"कू", r:"koo"},{s:"तु", r:"tu"},{s:"तू", r:"too"},
      {s:"सु", r:"su"},{s:"सू", r:"soo"}
    ],
    words: [
      {w:"गुड़", r:"gud", m:"jaggery", e:"🟤"},
      {w:"फूल", r:"phool", m:"flower", e:"🌸"},
      {w:"सुबह", r:"subah", m:"morning", e:"🌅"},
      {w:"आलू", r:"aaloo", m:"potato", e:"🥔"},
      {w:"चूहा", r:"choohaa", m:"mouse", e:"🐭"},
      {w:"तुम", r:"tum", m:"you", e:"🫵"},
      {w:"गुलाब", r:"gulaab", m:"rose", e:"🌹"},
      {w:"सूरज", r:"sooraj", m:"sun", e:"🌞"},
      {w:"भालू", r:"bhaaloo", m:"bear", e:"🐻"},
      {w:"मुकुट", r:"mukut", m:"crown", e:"👑"},
      {w:"दूध", r:"doodh", m:"milk", e:"🥛"},
      {w:"झूला", r:"jhoolaa", m:"swing", e:"🛝"},
      {w:"सुई", r:"suee", m:"needle", e:"🪡"},
      {w:"काजू", r:"kaajoo", m:"cashew", e:"🥜"}
    ],
    game: "whichMaatra"
  },
  {
    day: 11, kind: "lesson",
    title: "ए की मात्रा", titleEn: "e ki maatra ( े )",
    maatra: "े", maatraName: "e ki maatra",
    sound: "ए", soundRoman: "e",
    intro: "अक्षर के ऊपर एक लकीर — ए!",
    introEn: "One little line on TOP of the letter makes 'e'. प + े = पे, पेड़ (ped)!",
    tip: "One line on top = 'e'. Like a tiny hat!",
    syllables: [
      {s:"के", r:"ke"},{s:"से", r:"se"},{s:"मे", r:"me"},{s:"ले", r:"le"},
      {s:"दे", r:"de"},{s:"ने", r:"ne"},{s:"पे", r:"pe"},{s:"बे", r:"be"}
    ],
    words: [
      {w:"पेड़", r:"ped", m:"tree", e:"🌳"},
      {w:"सेब", r:"seb", m:"apple", e:"🍎"},
      {w:"तेल", r:"tel", m:"oil", e:"🛢️"},
      {w:"रेल", r:"rel", m:"train", e:"🚂"},
      {w:"मेला", r:"melaa", m:"fair", e:"🎡"},
      {w:"बेर", r:"ber", m:"berry", e:"🫐"},
      {w:"केला", r:"kelaa", m:"banana", e:"🍌"},
      {w:"बेटा", r:"betaa", m:"son", e:"👦"},
      {w:"शेर", r:"sher", m:"lion", e:"🦁"},
      {w:"जेब", r:"jeb", m:"pocket", e:"👖"},
      {w:"केक", r:"kek", m:"cake", e:"🍰"},
      {w:"खेल", r:"khel", m:"game", e:"⚽"},
      {w:"मेज़", r:"mez", m:"table", e:"🪑"},
      {w:"सवेरा", r:"saveraa", m:"morning", e:"🌅"},
      {w:"सेना", r:"senaa", m:"army", e:"🪖"}
    ],
    game: "build"
  },
  {
    day: 12, kind: "lesson",
    title: "ऐ की मात्रा", titleEn: "ai ki maatra ( ै )",
    maatra: "ै", maatraName: "ai ki maatra",
    sound: "ऐ", soundRoman: "ai",
    intro: "अक्षर के ऊपर दो लकीरें — ऐ!",
    introEn: "TWO little lines on top make 'ai'. ह + ै = है (hai)!",
    tip: "Two lines on top = 'ai'. One more than 'e'!",
    syllables: [
      {s:"कै", r:"kai"},{s:"है", r:"hai"},{s:"मै", r:"mai"},{s:"बै", r:"bai"},
      {s:"तै", r:"tai"},{s:"थै", r:"thai"},{s:"पै", r:"pai"},{s:"गै", r:"gai"}
    ],
    words: [
      {w:"है", r:"hai", m:"is", e:"✅"},
      {w:"बैल", r:"bail", m:"ox", e:"🐂"},
      {w:"थैला", r:"thailaa", m:"bag", e:"🛍️"},
      {w:"पैसा", r:"paisaa", m:"money", e:"🪙"},
      {w:"मैना", r:"mainaa", m:"myna bird", e:"🐦"},
      {w:"गैस", r:"gais", m:"gas", e:"🔥"},
      {w:"पैर", r:"pair", m:"foot", e:"🦶"},
      {w:"हैट", r:"hait", m:"hat", e:"🎩"},
      {w:"नैना", r:"nainaa", m:"eyes", e:"👀"},
      {w:"सैर", r:"sair", m:"stroll", e:"🚶"},
      {w:"तैर", r:"tair", m:"swim", e:"🏊"},
      {w:"मैदान", r:"maidaan", m:"field", e:"🏞️"},
      {w:"थैली", r:"thailee", m:"pouch", e:"👛"},
      {w:"बैठ", r:"baith", m:"sit", e:"🪑"},
      {w:"कैसा", r:"kaisaa", m:"how", e:"❓"}
    ],
    game: "match"
  },
  {
    day: 13, kind: "review",
    title: "ए बनाम ऐ", titleEn: "e vs ai",
    maatra: "ै", maatraName: "e vs ai",
    sound: "ऐ", soundRoman: "ai",
    intro: "एक लकीर 'ए', दो लकीर 'ऐ'।",
    introEn: "One line = 'e', two lines = 'ai'. Count the lines on top!",
    tip: "सेब (seb) has 'e'. है (hai) has 'ai'. Look on top!",
    syllables: [
      {s:"के", r:"ke"},{s:"कै", r:"kai"},{s:"से", r:"se"},{s:"सै", r:"sai"},
      {s:"मे", r:"me"},{s:"मै", r:"mai"}
    ],
    words: [
      {w:"सेब", r:"seb", m:"apple", e:"🍎"},
      {w:"है", r:"hai", m:"is", e:"✅"},
      {w:"पेड़", r:"ped", m:"tree", e:"🌳"},
      {w:"पैसा", r:"paisaa", m:"money", e:"🪙"},
      {w:"रेल", r:"rel", m:"train", e:"🚂"},
      {w:"बैल", r:"bail", m:"ox", e:"🐂"},
      {w:"केला", r:"kelaa", m:"banana", e:"🍌"},
      {w:"थैला", r:"thailaa", m:"bag", e:"🛍️"},
      {w:"शेर", r:"sher", m:"lion", e:"🦁"},
      {w:"पैर", r:"pair", m:"foot", e:"🦶"},
      {w:"खेल", r:"khel", m:"game", e:"⚽"},
      {w:"मैना", r:"mainaa", m:"myna", e:"🐦"},
      {w:"केक", r:"kek", m:"cake", e:"🍰"},
      {w:"सैर", r:"sair", m:"stroll", e:"🚶"}
    ],
    game: "whichMaatra"
  },
  {
    day: 14, kind: "celebrate",
    title: "दूसरा हफ़्ता पूरा!", titleEn: "Week 2 Complete! 🎉",
    maatra: "", maatraName: "celebration",
    sound: "बहुत बढ़िया", soundRoman: "bahut badhiya",
    intro: "उ, ऊ, ए, ऐ भी आ गया मायरा को!",
    introEn: "Superstar! Now you know u, oo, e and ai too. Read these proudly!",
    tip: "Half-way there. You're becoming a Hindi reader!",
    syllables: [
      {s:"तु", r:"tu"},{s:"तू", r:"too"},{s:"के", r:"ke"},{s:"कै", r:"kai"},
      {s:"फू", r:"phoo"},{s:"से", r:"se"}
    ],
    words: [
      {w:"फूल", r:"phool", m:"flower", e:"🌸"},
      {w:"सेब", r:"seb", m:"apple", e:"🍎"},
      {w:"झूला", r:"jhoolaa", m:"swing", e:"🛝"},
      {w:"पैसा", r:"paisaa", m:"money", e:"🪙"},
      {w:"भालू", r:"bhaaloo", m:"bear", e:"🐻"},
      {w:"पेड़", r:"ped", m:"tree", e:"🌳"},
      {w:"केला", r:"kelaa", m:"banana", e:"🍌"},
      {w:"सूरज", r:"sooraj", m:"sun", e:"🌞"},
      {w:"गुलाब", r:"gulaab", m:"rose", e:"🌹"},
      {w:"शेर", r:"sher", m:"lion", e:"🦁"},
      {w:"बैल", r:"bail", m:"ox", e:"🐂"},
      {w:"दूध", r:"doodh", m:"milk", e:"🥛"},
      {w:"हाथी", r:"haathee", m:"elephant", e:"🐘"},
      {w:"मछली", r:"machhlee", m:"fish", e:"🐟"}
    ],
    game: "read", badge: "⭐ हफ़्ता 2"
  },

  /* --------------------- WEEK 3 : o, au, anusvar, chandra --------------- */
  {
    day: 15, kind: "lesson",
    title: "ओ की मात्रा", titleEn: "o ki maatra ( ो )",
    maatra: "ो", maatraName: "o ki maatra",
    sound: "ओ", soundRoman: "o",
    intro: "आ की लकीर के ऊपर एक लकीर — ओ!",
    introEn: "The 'aa' stick plus one line on top makes 'o'. म + ो = मो, मोर (mor)!",
    tip: "Stick + one top line = 'o'.",
    syllables: [
      {s:"को", r:"ko"},{s:"गो", r:"go"},{s:"तो", r:"to"},{s:"सो", r:"so"},
      {s:"मो", r:"mo"},{s:"लो", r:"lo"},{s:"दो", r:"do"},{s:"रो", r:"ro"}
    ],
    words: [
      {w:"मोर", r:"mor", m:"peacock", e:"🦚"},
      {w:"दो", r:"do", m:"two", e:"✌️"},
      {w:"गोल", r:"gol", m:"round", e:"⚪"},
      {w:"रोटी", r:"rotee", m:"bread", e:"🫓"},
      {w:"टोपी", r:"topee", m:"cap", e:"🧢"},
      {w:"सोना", r:"sonaa", m:"gold", e:"🥇"},
      {w:"घोड़ा", r:"ghodaa", m:"horse", e:"🐴"},
      {w:"कोयल", r:"koyal", m:"cuckoo", e:"🐦"},
      {w:"गोभी", r:"gobhee", m:"cauliflower", e:"🥦"},
      {w:"कोट", r:"kot", m:"coat", e:"🧥"},
      {w:"सोफ़ा", r:"sofaa", m:"sofa", e:"🛋️"},
      {w:"लोमड़ी", r:"lomdee", m:"fox", e:"🦊"},
      {w:"भोजन", r:"bhojan", m:"meal", e:"🍛"},
      {w:"ढोल", r:"dhol", m:"drum", e:"🥁"},
      {w:"चोटी", r:"chotee", m:"braid", e:"💇"}
    ],
    game: "build"
  },
  {
    day: 16, kind: "lesson",
    title: "औ की मात्रा", titleEn: "au ki maatra ( ौ )",
    maatra: "ौ", maatraName: "au ki maatra",
    sound: "औ", soundRoman: "au",
    intro: "आ की लकीर के ऊपर दो लकीरें — औ!",
    introEn: "The 'aa' stick plus TWO top lines makes 'au'. न + ौ = नौ (nau)!",
    tip: "Stick + two top lines = 'au'. One more than 'o'!",
    syllables: [
      {s:"कौ", r:"kau"},{s:"गौ", r:"gau"},{s:"चौ", r:"chau"},{s:"दौ", r:"dau"},
      {s:"मौ", r:"mau"},{s:"नौ", r:"nau"},{s:"रौ", r:"rau"},{s:"तौ", r:"tau"}
    ],
    words: [
      {w:"नौ", r:"nau", m:"nine", e:"9️⃣"},
      {w:"कौआ", r:"kauaa", m:"crow", e:"🐦‍⬛"},
      {w:"चौक", r:"chauk", m:"square", e:"🔲"},
      {w:"मौसम", r:"mausam", m:"weather", e:"🌦️"},
      {w:"दौड़", r:"daud", m:"run/race", e:"🏃"},
      {w:"पौधा", r:"paudhaa", m:"plant", e:"🌱"},
      {w:"लौकी", r:"laukee", m:"gourd", e:"🥒"},
      {w:"सौ", r:"sau", m:"hundred", e:"💯"},
      {w:"हथौड़ा", r:"hathaudaa", m:"hammer", e:"🔨"},
      {w:"तौलिया", r:"tauliyaa", m:"towel", e:"🧻"},
      {w:"कौड़ी", r:"kaudee", m:"shell", e:"🐚"},
      {w:"नौका", r:"naukaa", m:"boat", e:"⛵"},
      {w:"फौज", r:"fauj", m:"army", e:"🪖"},
      {w:"खिलौना", r:"khilaunaa", m:"toy", e:"🧸"},
      {w:"चौराहा", r:"chauraahaa", m:"crossroad", e:"🚦"}
    ],
    game: "match"
  },
  {
    day: 17, kind: "review",
    title: "ओ बनाम औ", titleEn: "o vs au",
    maatra: "ौ", maatraName: "o vs au",
    sound: "औ", soundRoman: "au",
    intro: "एक लकीर 'ओ', दो लकीर 'औ'।",
    introEn: "One top line = 'o', two = 'au'. Count them, just like e and ai!",
    tip: "मोर (mor) has 'o'. नौ (nau) has 'au'.",
    syllables: [
      {s:"को", r:"ko"},{s:"कौ", r:"kau"},{s:"तो", r:"to"},{s:"तौ", r:"tau"},
      {s:"मो", r:"mo"},{s:"मौ", r:"mau"}
    ],
    words: [
      {w:"मोर", r:"mor", m:"peacock", e:"🦚"},
      {w:"कौआ", r:"kauaa", m:"crow", e:"🐦‍⬛"},
      {w:"रोटी", r:"rotee", m:"bread", e:"🫓"},
      {w:"मौसम", r:"mausam", m:"weather", e:"🌦️"},
      {w:"टोपी", r:"topee", m:"cap", e:"🧢"},
      {w:"पौधा", r:"paudhaa", m:"plant", e:"🌱"},
      {w:"घोड़ा", r:"ghodaa", m:"horse", e:"🐴"},
      {w:"नौ", r:"nau", m:"nine", e:"9️⃣"},
      {w:"गोभी", r:"gobhee", m:"cauliflower", e:"🥦"},
      {w:"लौकी", r:"laukee", m:"gourd", e:"🥒"},
      {w:"ढोल", r:"dhol", m:"drum", e:"🥁"},
      {w:"दौड़", r:"daud", m:"race", e:"🏃"},
      {w:"कोट", r:"kot", m:"coat", e:"🧥"},
      {w:"खिलौना", r:"khilaunaa", m:"toy", e:"🧸"}
    ],
    game: "whichMaatra"
  },
  {
    day: 18, kind: "lesson",
    title: "अं — अनुस्वार", titleEn: "anusvar — the 'n/m' dot ( ं )",
    maatra: "ं", maatraName: "anusvar (bindu)",
    sound: "अं", soundRoman: "an",
    intro: "अक्षर के ऊपर एक बिंदी — नाक से आवाज़!",
    introEn: "A single dot on top adds a soft 'n/m' from the nose. रग → रंग (rang)!",
    tip: "The dot hums through your nose: 'rang', 'anda'.",
    syllables: [
      {s:"कं", r:"kan"},{s:"गं", r:"gan"},{s:"रं", r:"ran"},{s:"मं", r:"man"},
      {s:"बं", r:"ban"},{s:"तं", r:"tan"},{s:"दं", r:"dan"},{s:"पं", r:"pan"}
    ],
    words: [
      {w:"रंग", r:"rang", m:"colour", e:"🌈"},
      {w:"अंडा", r:"andaa", m:"egg", e:"🥚"},
      {w:"बंदर", r:"bandar", m:"monkey", e:"🐒"},
      {w:"गंगा", r:"gangaa", m:"Ganga river", e:"🏞️"},
      {w:"ठंड", r:"thand", m:"cold", e:"🥶"},
      {w:"कंघी", r:"kanghee", m:"comb", e:"💇"},
      {w:"पतंग", r:"patang", m:"kite", e:"🪁"},
      {w:"मंदिर", r:"mandir", m:"temple", e:"🛕"},
      {w:"झंडा", r:"jhandaa", m:"flag", e:"🚩"},
      {w:"घंटी", r:"ghantee", m:"bell", e:"🔔"},
      {w:"संतरा", r:"santaraa", m:"orange", e:"🍊"},
      {w:"चंदा", r:"chandaa", m:"moon", e:"🌙"},
      {w:"कंबल", r:"kambal", m:"blanket", e:"🛏️"},
      {w:"गेंद", r:"gend", m:"ball", e:"⚽"},
      {w:"जंगल", r:"jangal", m:"forest", e:"🌴"}
    ],
    game: "build"
  },
  {
    day: 19, kind: "lesson",
    title: "चंद्रबिंदु", titleEn: "chandrabindu — moon dot ( ँ )",
    maatra: "ँ", maatraName: "chandrabindu",
    sound: "चाँद", soundRoman: "chaand",
    intro: "अक्षर के ऊपर चाँद और बिंदी — हल्की नाक की आवाज़।",
    introEn: "A little moon with a dot gives a gentle nasal sound. चाद → चाँद (chaand)!",
    tip: "Softer than the plain dot. Say माँ (maa) — feel your nose!",
    syllables: [
      {s:"आँ", r:"aan"},{s:"माँ", r:"maan"},{s:"चाँ", r:"chaan"},{s:"दाँ", r:"daan"},
      {s:"हँ", r:"han"},{s:"पाँ", r:"paan"}
    ],
    words: [
      {w:"चाँद", r:"chaand", m:"moon", e:"🌙"},
      {w:"आँख", r:"aankh", m:"eye", e:"👁️"},
      {w:"दाँत", r:"daant", m:"tooth", e:"🦷"},
      {w:"माँ", r:"maa", m:"mother", e:"👩"},
      {w:"पाँच", r:"paanch", m:"five", e:"5️⃣"},
      {w:"साँप", r:"saanp", m:"snake", e:"🐍"},
      {w:"आँगन", r:"aangan", m:"courtyard", e:"🏡"},
      {w:"गाँव", r:"gaanv", m:"village", e:"🏘️"},
      {w:"धुआँ", r:"dhuaan", m:"smoke", e:"💨"},
      {w:"बाँसुरी", r:"baansuree", m:"flute", e:"🪈"},
      {w:"चाँदी", r:"chaandee", m:"silver", e:"🥈"},
      {w:"टाँग", r:"taang", m:"leg", e:"🦵"},
      {w:"बाँह", r:"baanh", m:"arm", e:"💪"},
      {w:"हँसी", r:"hansee", m:"laughter", e:"😄"},
      {w:"पाँव", r:"paanv", m:"foot", e:"🦶"}
    ],
    game: "match"
  },
  {
    day: 20, kind: "review",
    title: "सब मात्राएँ — जासूसी", titleEn: "Maatra Detective! (mega review)",
    maatra: "", maatraName: "all maatra",
    sound: "मात्रा", soundRoman: "maatra",
    intro: "हर शब्द में मात्रा ढूँढो!",
    introEn: "Detective time! Every word has a maatra hiding. Can you spot it?",
    tip: "You've learned them ALL: aa, i, ee, u, oo, e, ai, o, au, and the dot!",
    syllables: [
      {s:"का", r:"kaa"},{s:"कि", r:"ki"},{s:"की", r:"kee"},{s:"कु", r:"ku"},
      {s:"कू", r:"koo"},{s:"के", r:"ke"},{s:"कै", r:"kai"},{s:"को", r:"ko"},{s:"कौ", r:"kau"}
    ],
    words: [
      {w:"बादल", r:"baadal", m:"cloud", e:"☁️"},
      {w:"किताब", r:"kitaab", m:"book", e:"📖"},
      {w:"हाथी", r:"haathee", m:"elephant", e:"🐘"},
      {w:"फूल", r:"phool", m:"flower", e:"🌸"},
      {w:"मोर", r:"mor", m:"peacock", e:"🦚"},
      {w:"रंग", r:"rang", m:"colour", e:"🌈"},
      {w:"गुलाब", r:"gulaab", m:"rose", e:"🌹"},
      {w:"सेब", r:"seb", m:"apple", e:"🍎"},
      {w:"नौ", r:"nau", m:"nine", e:"9️⃣"},
      {w:"चाँद", r:"chaand", m:"moon", e:"🌙"},
      {w:"पतंग", r:"patang", m:"kite", e:"🪁"},
      {w:"केला", r:"kelaa", m:"banana", e:"🍌"},
      {w:"दूध", r:"doodh", m:"milk", e:"🥛"},
      {w:"घोड़ा", r:"ghodaa", m:"horse", e:"🐴"},
      {w:"मछली", r:"machhlee", m:"fish", e:"🐟"},
      {w:"टोपी", r:"topee", m:"cap", e:"🧢"}
    ],
    game: "whichMaatra"
  },
  {
    day: 21, kind: "celebrate",
    title: "तीसरा हफ़्ता पूरा!", titleEn: "Week 3 Complete! 🎉",
    maatra: "", maatraName: "celebration",
    sound: "वाह वाह", soundRoman: "waah waah",
    intro: "मायरा अब सारी मात्राएँ जानती है!",
    introEn: "Incredible, Myra! You now know EVERY maatra. Read this little rhyme!",
    tip: "Tap each line to hear it, then read along with Mithu!",
    syllables: [
      {s:"मो", r:"mo"},{s:"कौ", r:"kau"},{s:"रं", r:"ran"},{s:"चाँ", r:"chaan"}
    ],
    words: [
      {w:"मोर", r:"mor", m:"peacock", e:"🦚"},
      {w:"कौआ", r:"kauaa", m:"crow", e:"🐦‍⬛"},
      {w:"चाँद", r:"chaand", m:"moon", e:"🌙"},
      {w:"रंग", r:"rang", m:"colour", e:"🌈"},
      {w:"फूल", r:"phool", m:"flower", e:"🌸"},
      {w:"गुलाब", r:"gulaab", m:"rose", e:"🌹"},
      {w:"पतंग", r:"patang", m:"kite", e:"🪁"},
      {w:"सेब", r:"seb", m:"apple", e:"🍎"},
      {w:"हाथी", r:"haathee", m:"elephant", e:"🐘"},
      {w:"केला", r:"kelaa", m:"banana", e:"🍌"},
      {w:"मंदिर", r:"mandir", m:"temple", e:"🛕"},
      {w:"घोड़ा", r:"ghodaa", m:"horse", e:"🐴"}
    ],
    poem: [
      {s:"चंदा मामा दूर के,", r:"chandaa maamaa door ke", m:"Moon uncle far away,"},
      {s:"बड़े रंग के फूल के।", r:"bade rang ke phool ke", m:"like a big colourful flower."}
    ],
    game: "read", badge: "⭐ हफ़्ता 3"
  },

  /* ----------------- WEEK 4 : words, sentences, mastery ----------------- */
  {
    day: 22, kind: "lesson",
    title: "दो मात्रा वाले शब्द", titleEn: "Words with two maatra",
    maatra: "", maatraName: "mixed maatra words",
    sound: "शब्द", soundRoman: "shabd",
    intro: "एक शब्द में दो अलग मात्राएँ भी हो सकती हैं।",
    introEn: "Big kid words! Some words mix two different maatra. Sound them out slowly.",
    tip: "Break it into pieces: का-म-रा → कमरा. Easy!",
    syllables: [
      {s:"कम", r:"kam"},{s:"रा", r:"raa"},{s:"गु", r:"gu"},{s:"लाब", r:"laab"}
    ],
    words: [
      {w:"कमरा", r:"kamraa", m:"room", e:"🚪"},
      {w:"गुलाब", r:"gulaab", m:"rose", e:"🌹"},
      {w:"मकान", r:"makaan", m:"house", e:"🏘️"},
      {w:"बादल", r:"baadal", m:"cloud", e:"☁️"},
      {w:"सलाद", r:"salaad", m:"salad", e:"🥗"},
      {w:"दावत", r:"daavat", m:"feast", e:"🍽️"},
      {w:"किताब", r:"kitaab", m:"book", e:"📖"},
      {w:"समोसा", r:"samosaa", m:"samosa", e:"🥟"},
      {w:"तराजू", r:"taraajoo", m:"scale", e:"⚖️"},
      {w:"सितारा", r:"sitaaraa", m:"star", e:"⭐"},
      {w:"कबूतर", r:"kabootar", m:"pigeon", e:"🕊️"},
      {w:"दरवाज़ा", r:"darvaazaa", m:"door", e:"🚪"},
      {w:"खिलौना", r:"khilaunaa", m:"toy", e:"🧸"},
      {w:"अखबार", r:"akhbaar", m:"newspaper", e:"📰"},
      {w:"किनारा", r:"kinaaraa", m:"shore", e:"🏖️"}
    ],
    game: "build"
  },
  {
    day: 23, kind: "lesson",
    title: "तीन अक्षर वाले शब्द", titleEn: "Three-letter words",
    maatra: "", maatraName: "longer words",
    sound: "शब्द", soundRoman: "shabd",
    intro: "अब लंबे शब्द पढ़ते हैं!",
    introEn: "Let's read longer words. Take your time, letter by letter.",
    tip: "ति-त-ली → तितली. You can read long words now!",
    syllables: [
      {s:"अ", r:"a"},{s:"नार", r:"naar"},{s:"ति", r:"ti"},{s:"तली", r:"talee"}
    ],
    words: [
      {w:"अनार", r:"anaar", m:"pomegranate", e:"🍎"},
      {w:"तितली", r:"titlee", m:"butterfly", e:"🦋"},
      {w:"समोसा", r:"samosaa", m:"samosa", e:"🥟"},
      {w:"बादाम", r:"baadaam", m:"almond", e:"🌰"},
      {w:"पतंग", r:"patang", m:"kite", e:"🪁"},
      {w:"कमल", r:"kamal", m:"lotus", e:"🪷"},
      {w:"मछली", r:"machhlee", m:"fish", e:"🐟"},
      {w:"कबूतर", r:"kabootar", m:"pigeon", e:"🕊️"},
      {w:"बकरी", r:"bakree", m:"goat", e:"🐐"},
      {w:"तराजू", r:"taraajoo", m:"scale", e:"⚖️"},
      {w:"हिरन", r:"hiran", m:"deer", e:"🦌"},
      {w:"सितारा", r:"sitaaraa", m:"star", e:"⭐"},
      {w:"चिड़िया", r:"chidiyaa", m:"bird", e:"🐦"},
      {w:"मंदिर", r:"mandir", m:"temple", e:"🛕"},
      {w:"कछुआ", r:"kachhuaa", m:"turtle", e:"🐢"}
    ],
    game: "match"
  },
  {
    day: 24, kind: "lesson",
    title: "छोटे वाक्य", titleEn: "Little sentences",
    maatra: "", maatraName: "reading sentences",
    sound: "वाक्य", soundRoman: "vaakya",
    intro: "अब हम पूरे वाक्य पढ़ेंगे!",
    introEn: "Wow — whole sentences now! Tap to hear, then read each one.",
    tip: "Read left to right, word by word. You've got this!",
    syllables: [
      {s:"यह", r:"yeh"},{s:"वह", r:"vah"},{s:"है", r:"hai"}
    ],
    words: [
      {w:"यह", r:"yeh", m:"this", e:"👇"},
      {w:"वह", r:"vah", m:"that", e:"👉"},
      {w:"मेरा", r:"meraa", m:"my", e:"🙋"},
      {w:"है", r:"hai", m:"is", e:"✅"},
      {w:"तेरा", r:"teraa", m:"your", e:"🫵"},
      {w:"नाम", r:"naam", m:"name", e:"📛"},
      {w:"अच्छा", r:"achchhaa", m:"good", e:"👍"},
      {w:"बड़ा", r:"badaa", m:"big", e:"🔼"},
      {w:"छोटा", r:"chhotaa", m:"small", e:"🔽"}
    ],
    sentences: [
      {s:"यह आम है।", r:"yeh aam hai", m:"This is a mango."},
      {s:"वह घर है।", r:"vah ghar hai", m:"That is a house."},
      {s:"मेरा नाम मायरा है।", r:"meraa naam Myra hai", m:"My name is Myra."},
      {s:"मुझे केला पसंद है।", r:"mujhe kelaa pasand hai", m:"I like banana."},
      {s:"यह मेरा घर है।", r:"yeh meraa ghar hai", m:"This is my house."},
      {s:"वह मोर है।", r:"vah mor hai", m:"That is a peacock."},
      {s:"गाय दूध देती है।", r:"gaay doodh detee hai", m:"The cow gives milk."},
      {s:"फूल लाल है।", r:"phool laal hai", m:"The flower is red."}
    ],
    game: "sentence"
  },
  {
    day: 25, kind: "lesson",
    title: "रोज़ के शब्द", titleEn: "Everyday sight words",
    maatra: "", maatraName: "sight words",
    sound: "शब्द", soundRoman: "shabd",
    intro: "ये शब्द बार-बार आते हैं — इन्हें झट से पहचानो!",
    introEn: "These tiny words appear everywhere. Learn to read them in a flash!",
    tip: "See it, say it fast — no sounding out needed!",
    syllables: [
      {s:"और", r:"aur"},{s:"में", r:"mein"},{s:"को", r:"ko"},{s:"से", r:"se"}
    ],
    words: [
      {w:"और", r:"aur", m:"and", e:"➕"},
      {w:"यह", r:"yeh", m:"this", e:"👇"},
      {w:"वह", r:"vah", m:"that", e:"👉"},
      {w:"मैं", r:"main", m:"I", e:"🙋"},
      {w:"तुम", r:"tum", m:"you", e:"🫵"},
      {w:"हम", r:"ham", m:"we", e:"👨‍👩‍👧"},
      {w:"है", r:"hai", m:"is", e:"✅"},
      {w:"में", r:"mein", m:"in", e:"📥"},
      {w:"को", r:"ko", m:"to", e:"➡️"},
      {w:"से", r:"se", m:"from", e:"↖️"},
      {w:"नहीं", r:"naheen", m:"no", e:"🚫"},
      {w:"हाँ", r:"haan", m:"yes", e:"✔️"},
      {w:"क्या", r:"kyaa", m:"what", e:"❓"},
      {w:"मेरा", r:"meraa", m:"mine", e:"🙋"},
      {w:"अच्छा", r:"achchhaa", m:"good", e:"👍"}
    ],
    game: "read"
  },
  {
    day: 26, kind: "lesson",
    title: "जानवरों के नाम", titleEn: "Animal names",
    maatra: "", maatraName: "animal reading",
    sound: "जानवर", soundRoman: "jaanvar",
    intro: "आओ जानवरों के नाम पढ़ें!",
    introEn: "Let's read animal names and make their sounds. So much fun!",
    tip: "Which maatra hides in each animal? You know them all now!",
    syllables: [
      {s:"हा", r:"haa"},{s:"थी", r:"thee"},{s:"बं", r:"ban"},{s:"दर", r:"dar"}
    ],
    words: [
      {w:"हाथी", r:"haathee", m:"elephant", e:"🐘"},
      {w:"बंदर", r:"bandar", m:"monkey", e:"🐒"},
      {w:"चूहा", r:"choohaa", m:"mouse", e:"🐭"},
      {w:"मोर", r:"mor", m:"peacock", e:"🦚"},
      {w:"भालू", r:"bhaaloo", m:"bear", e:"🐻"},
      {w:"साँप", r:"saanp", m:"snake", e:"🐍"},
      {w:"शेर", r:"sher", m:"lion", e:"🦁"},
      {w:"बकरी", r:"bakree", m:"goat", e:"🐐"},
      {w:"घोड़ा", r:"ghodaa", m:"horse", e:"🐴"},
      {w:"कबूतर", r:"kabootar", m:"pigeon", e:"🕊️"},
      {w:"गाय", r:"gaay", m:"cow", e:"🐄"},
      {w:"लोमड़ी", r:"lomdee", m:"fox", e:"🦊"},
      {w:"हिरन", r:"hiran", m:"deer", e:"🦌"},
      {w:"कछुआ", r:"kachhuaa", m:"turtle", e:"🐢"},
      {w:"ऊँट", r:"oont", m:"camel", e:"🐫"}
    ],
    game: "match"
  },
  {
    day: 27, kind: "lesson",
    title: "दुगने अक्षर", titleEn: "Double-letter words (easy conjuncts)",
    maatra: "", maatraName: "simple conjuncts",
    sound: "अच्छा", soundRoman: "achchhaa",
    intro: "कुछ शब्दों में अक्षर दुगना बोलते हैं।",
    introEn: "Some words press two letters together — say the middle sound twice!",
    tip: "अच्छा = ach-chhaa. Press it: 'chch'!",
    syllables: [
      {s:"अच्", r:"ach"},{s:"छा", r:"chhaa"},{s:"बच्", r:"bach"},{s:"चा", r:"chaa"}
    ],
    words: [
      {w:"अच्छा", r:"achchhaa", m:"good", e:"👍"},
      {w:"बच्चा", r:"bachchaa", m:"child", e:"👶"},
      {w:"पक्का", r:"pakkaa", m:"firm/ripe", e:"💪"},
      {w:"चक्की", r:"chakkee", m:"grinder", e:"⚙️"},
      {w:"मक्खन", r:"makkhan", m:"butter", e:"🧈"},
      {w:"गुड्डा", r:"guddaa", m:"doll (boy)", e:"🪆"},
      {w:"बिल्ली", r:"billee", m:"cat", e:"🐱"},
      {w:"कुत्ता", r:"kuttaa", m:"dog", e:"🐕"},
      {w:"पत्ता", r:"pattaa", m:"leaf", e:"🍃"},
      {w:"बत्तख", r:"battakh", m:"duck", e:"🦆"},
      {w:"रस्सी", r:"rassee", m:"rope", e:"🪢"},
      {w:"डिब्बा", r:"dibbaa", m:"box", e:"📦"},
      {w:"लड्डू", r:"laddoo", m:"laddu", e:"🍬"},
      {w:"चप्पल", r:"chappal", m:"slipper", e:"🩴"},
      {w:"उल्लू", r:"ulloo", m:"owl", e:"🦉"}
    ],
    game: "build"
  },
  {
    day: 28, kind: "lesson",
    title: "खाने के शब्द", titleEn: "Yummy food words",
    maatra: "", maatraName: "food reading",
    sound: "खाना", soundRoman: "khaanaa",
    intro: "स्वादिष्ट शब्द पढ़ें!",
    introEn: "Read the menu! All the tasty words you know.",
    tip: "Read the food, then tell me your favourite!",
    syllables: [
      {s:"रो", r:"ro"},{s:"टी", r:"tee"},{s:"दा", r:"daa"},{s:"ल", r:"l"}
    ],
    words: [
      {w:"रोटी", r:"rotee", m:"bread", e:"🫓"},
      {w:"दाल", r:"daal", m:"lentils", e:"🍲"},
      {w:"चावल", r:"chaaval", m:"rice", e:"🍚"},
      {w:"दूध", r:"doodh", m:"milk", e:"🥛"},
      {w:"सेब", r:"seb", m:"apple", e:"🍎"},
      {w:"आम", r:"aam", m:"mango", e:"🥭"},
      {w:"केला", r:"kelaa", m:"banana", e:"🍌"},
      {w:"समोसा", r:"samosaa", m:"samosa", e:"🥟"},
      {w:"लड्डू", r:"laddoo", m:"laddu", e:"🍬"},
      {w:"आलू", r:"aaloo", m:"potato", e:"🥔"},
      {w:"खीर", r:"kheer", m:"kheer", e:"🍮"},
      {w:"संतरा", r:"santaraa", m:"orange", e:"🍊"},
      {w:"अंगूर", r:"angoor", m:"grapes", e:"🍇"},
      {w:"जलेबी", r:"jalebee", m:"jalebi", e:"🍥"},
      {w:"पनीर", r:"paneer", m:"cheese", e:"🧀"}
    ],
    game: "match"
  },
  {
    day: 29, kind: "lesson",
    title: "रंग, गिनती, परिवार", titleEn: "Colours, numbers & family",
    maatra: "", maatraName: "everyday reading",
    sound: "परिवार", soundRoman: "parivaar",
    intro: "रंग, नंबर और परिवार के नाम पढ़ें!",
    introEn: "Read colours, numbers, and family names — the words closest to you!",
    tip: "Point to your family and say each word in Hindi!",
    syllables: [
      {s:"ला", r:"laa"},{s:"ल", r:"l"},{s:"ती", r:"tee"},{s:"न", r:"n"}
    ],
    words: [
      {w:"लाल", r:"laal", m:"red", e:"🔴"},
      {w:"नीला", r:"neelaa", m:"blue", e:"🔵"},
      {w:"पीला", r:"peelaa", m:"yellow", e:"🟡"},
      {w:"तीन", r:"teen", m:"three", e:"3️⃣"},
      {w:"माँ", r:"maa", m:"mother", e:"👩"},
      {w:"नानी", r:"naanee", m:"grandma", e:"👵"},
      {w:"हरा", r:"haraa", m:"green", e:"🟢"},
      {w:"काला", r:"kaalaa", m:"black", e:"⚫"},
      {w:"सफेद", r:"safed", m:"white", e:"⚪"},
      {w:"एक", r:"ek", m:"one", e:"1️⃣"},
      {w:"दो", r:"do", m:"two", e:"✌️"},
      {w:"पाँच", r:"paanch", m:"five", e:"5️⃣"},
      {w:"पापा", r:"paapaa", m:"papa", e:"👨"},
      {w:"दादा", r:"daadaa", m:"grandpa", e:"👴"},
      {w:"भाई", r:"bhaaee", m:"brother", e:"👦"}
    ],
    game: "read"
  },
  {
    day: 30, kind: "lesson",
    title: "कविता पढ़ो", titleEn: "Read a rhyme!",
    maatra: "", maatraName: "read-along poem",
    sound: "कविता", soundRoman: "kavitaa",
    intro: "आओ मिलकर एक प्यारी कविता पढ़ें!",
    introEn: "Read-along time! Tap each line, then read it with Mithu.",
    tip: "This famous rhyme uses words you already know!",
    syllables: [
      {s:"मछ", r:"machh"},{s:"ली", r:"lee"},{s:"जल", r:"jal"},{s:"की", r:"kee"}
    ],
    words: [
      {w:"मछली", r:"machhlee", m:"fish", e:"🐟"},
      {w:"जल", r:"jal", m:"water", e:"💧"},
      {w:"रानी", r:"raanee", m:"queen", e:"👸"},
      {w:"पानी", r:"paanee", m:"water", e:"🌊"},
      {w:"जीवन", r:"jeevan", m:"life", e:"🌱"},
      {w:"हाथ", r:"haath", m:"hand", e:"✋"},
      {w:"डर", r:"dar", m:"fear", e:"😨"},
      {w:"बाहर", r:"baahar", m:"outside", e:"🚪"},
      {w:"दूर", r:"door", m:"far", e:"↔️"},
      {w:"घर", r:"ghar", m:"home", e:"🏠"}
    ],
    poem: [
      {s:"मछली जल की रानी है,", r:"machhlee jal kee raanee hai", m:"The fish is the queen of water,"},
      {s:"जीवन उसका पानी है।", r:"jeevan uskaa paanee hai", m:"water is her whole life."},
      {s:"हाथ लगाओ डर जाएगी,", r:"haath lagaao dar jaayegee", m:"Touch her and she gets scared,"},
      {s:"बाहर निकालो मर जाएगी।", r:"baahar nikaalo mar jaayegee", m:"take her out and she cannot live."}
    ],
    game: "read"
  },
  {
    day: 31, kind: "celebrate",
    title: "बधाई हो — एक्सपर्ट!", titleEn: "GRADUATION! Hindi Reading Expert! 🎓",
    maatra: "", maatraName: "graduation",
    sound: "बधाई हो मायरा", soundRoman: "badhaai ho Myra",
    intro: "मायरा अब हिंदी पढ़ने में एक्सपर्ट है!",
    introEn: "You did it, Myra! You can read Hindi words all by yourself. So proud of you! 🎉",
    tip: "Tap your certificate to celebrate. You are a Hindi Reading Star!",
    syllables: [
      {s:"बधाई", r:"badhaai"},{s:"हो", r:"ho"}
    ],
    words: [
      {w:"मायरा", r:"Myra", m:"Myra (you!)", e:"🌟"},
      {w:"हिंदी", r:"hindee", m:"Hindi", e:"🇮🇳"},
      {w:"एक्सपर्ट", r:"expert", m:"expert", e:"🎓"},
      {w:"शाबाश", r:"shaabaash", m:"well done", e:"👏"},
      {w:"किताब", r:"kitaab", m:"book", e:"📖"},
      {w:"पानी", r:"paanee", m:"water", e:"💧"},
      {w:"होशियार", r:"hoshiyaar", m:"clever", e:"🧠"},
      {w:"खुश", r:"khush", m:"happy", e:"😄"},
      {w:"बधाई", r:"badhaai", m:"congrats", e:"🎉"},
      {w:"स्टार", r:"staar", m:"star", e:"⭐"},
      {w:"दोस्त", r:"dost", m:"friend", e:"🤝"},
      {w:"पढ़ाई", r:"padhaai", m:"studies", e:"📚"}
    ],
    sentences: [
      {s:"मैं हिंदी पढ़ सकती हूँ।", r:"main hindee padh saktee hoon", m:"I can read Hindi."},
      {s:"मुझे पढ़ना पसंद है।", r:"mujhe padhnaa pasand hai", m:"I love reading."}
    ],
    game: "read", badge: "🎓 एक्सपर्ट", certificate: true
  }
];

if (typeof window !== "undefined") { window.CURRICULUM = CURRICULUM; }
if (typeof module !== "undefined") { module.exports = CURRICULUM; }
