import { formatDate, formatTime } from "./utils";
import { SupportedLanguage, TRANSLATIONS } from "./i18n";

export interface WhatsAppMessageParams {
  guestName: string;
  phone?: string;
  coupleTitle: string;
  ceremonyNames: string[];
  rsvpUrl: string;
  startDate: string;
  city: string;
  customMessage?: string;
  language?: SupportedLanguage;
}

/**
 * Generates an elegant, culturally authentic WhatsApp invitation message
 * in any of the 11 supported Indian languages.
 */
export function generateWhatsAppInvitation({
  guestName,
  phone,
  coupleTitle,
  ceremonyNames,
  rsvpUrl,
  startDate,
  city,
  customMessage,
  language = "en",
}: WhatsAppMessageParams): { text: string; waUrl: string } {
  const ceremonyList = ceremonyNames.map((name) => `✨ ${name}`).join("\n");
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  let messageText = "";

  if (language === "hi") {
    messageText = `नमस्ते ${guestName} जी 🙏,

अत्यंत हर्ष के साथ हम आपको और आपके परिवार को *${city}* में आयोजित *${coupleTitle}* के शुभ विवाह समारोह में सादर आमंत्रित करते हैं। समारोह का शुभारंभ *${formatDate(startDate)}* से होगा।

आप सस्नेह निमंत्रित हैं:
${ceremonyList}

${customMessage ? customMessage + "\n\n" : ""}कृपया अपनी उपस्थिति, भोजन प्राथमिकता (शाकाहारी/जैन) एवं साथ आने वाले परिजनों का विवरण इस निजी लिंक पर दर्ज करें:
🔗 ${rsvpUrl}

हम आपके शुभागमन की प्रतीक्षा करेंगे!
हार्दिक शुभकामनाएं एवं सादर प्रणाम 🙏
परिवार`.trim();
  } else if (language === "pa") {
    messageText = `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${guestName} ਜੀ 🙏,

ਬਹੁਤ ਖੁਸ਼ੀ ਦੇ ਨਾਲ ਅਸੀਂ ਤੁਹਾਨੂੰ ਅਤੇ ਤੁਹਾਡੇ ਪਰਿਵਾਰ ਨੂੰ *${city}* ਵਿਖੇ *${coupleTitle}* ਦੇ ਸ਼ੁਭ ਵਿਆਹ ਸਮਾਗਮਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਣ ਦਾ ਨਿੱਘਾ ਸੱਦਾ ਦਿੰਦੇ ਹਾਂ। ਸਮਾਗਮ *${formatDate(startDate)}* ਤੋਂ ਸ਼ੁਰੂ ਹੋਣਗੇ।

ਤੁਸੀਂ ਸਤਿਕਾਰ ਸਹਿਤ ਸੱਦੇ ਗਏ ਹੋ:
${ceremonyList}

${customMessage ? customMessage + "\n\n" : ""}ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਦਿੱਤੇ ਲਿੰਕ ਰਾਹੀਂ ਆਪਣੀ ਹਾਜ਼ਰੀ ਅਤੇ ਖਾਣ-ਪੀਣ ਦੀ ਪਸੰਦ ਦਰਜ ਕਰੋ:
🔗 ${rsvpUrl}

ਸ਼ੁਭਕਾਮਨਾਵਾਂ ਸਹਿਤ,
ਸਮੂਹ ਪਰਿਵਾਰ 🙏`.trim();
  } else if (language === "gu") {
    messageText = `નમસ્તે ${guestName} જી 🙏,

ખૂબ જ આનંદ સાથે અમે તમને અને તમારા પરિવારને *${city}* ખાતે *${coupleTitle}* ના શુભ લગ્નોત્સવમાં પધારવા હાર્દિક નિમંત્રણ આપીએ છીએ. શુભારંભ તારીખ: *${formatDate(startDate)}*.

આપનું ભાવભર્યું નિમંત્રણ:
${ceremonyList}

${customMessage ? customMessage + "\n\n" : ""}કૃપા કરીને આપની ઉપસ્થિતિ અને ભોજનની પસંદગી નીચે આપેલ લિંક પર જણાવો:
🔗 ${rsvpUrl}

સ્નેહ વંદન સહ,
પરિવાર 🙏`.trim();
  } else if (language === "mr") {
    messageText = `नमस्कार ${guestName} जी 🙏,

अत्यंत आनंदपूर्वक आम्ही आपणास आणि आपल्या परिवारास *${city}* येथे आयोजित *${coupleTitle}* यांच्या शुभ विवाह सोहळ्यास सस्नेह निमंत्रित करत आहोत। सोहळ्याचा प्रारंभ *${formatDate(startDate)}* पासून होत आहे।

आपण सस्नेह निमंत्रित आहात:
${ceremonyList}

${customMessage ? customMessage + "\n\n" : ""}कृपया आपल्या उपस्थितीची नोंद आणि भोजनाची पसंती या लिंकवर नोंदवावी:
🔗 ${rsvpUrl}

आपल्या स्नेहाची अपेक्षा,
सादर प्रणाम 🙏
समस्त परिवार`.trim();
  } else if (language === "bn") {
    messageText = `নমস্কার ${guestName} বাবু 🙏,

অত্যন্ত আনন্দের সাথে আমরা আপনাকে এবং আপনার পরিবারকে *${city}*-তে অনুষ্ঠিত *${coupleTitle}*-এর শুভ বিবাহ উৎসবে আন্তরিকভাবে আমন্ত্রণ জানাচ্ছি। অনুষ্ঠান শুরু: *${formatDate(startDate)}*।

আপনি সাদরে আমন্ত্রিত:
${ceremonyList}

${customMessage ? customMessage + "\n\n" : ""}অনুগ্রহ করে আপনার উপস্থিতি ও খাবারের পছন্দ নিচে দেওয়া লিঙ্কে নিশ্চিত করুন:
🔗 ${rsvpUrl}

শ্রদ্ধা ও প্রণাম সহ,
পরিবার 🙏`.trim();
  } else if (language === "te") {
    messageText = `నమస్కారం ${guestName} గారు 🙏,

ఎంతో సంతోషంతో *${city}* లో జరుగుతున్న *${coupleTitle}* శుభ వివాహ మహోత్సవానికి మిమ్మల్ని మరియు మీ కుటుంబాన్ని సాదరంగా ఆహ్వానిస్తున్నాము. ప్రారంభం: *${formatDate(startDate)}*.

మీరు ఆహ్వానింపబడిన వేడుకలు:
${ceremonyList}

${customMessage ? customMessage + "\n\n" : ""}దయచేసి మీ హాజరు మరియు భోజన వివరాలను క్రింది లింక్ ద్వారా తెలపగలరు:
🔗 ${rsvpUrl}

శుభాకాంక్షలతో,
కుటుంబ సభ్యులు 🙏`.trim();
  } else if (language === "ta") {
    messageText = `வணக்கம் ${guestName} அவர்களே 🙏,

மிக்க மகிழ்ச்சியுடன் *${city}* நகரில் நடைபெறும் *${coupleTitle}* திருமண விழாவிற்கு தங்களையும் தங்கள் குடும்பத்தினரையும் அன்புடன் அழைக்கின்றோம். தொடக்கம்: *${formatDate(startDate)}*.

நீங்கள் அழைக்கப்பட்டுள்ள நிகழ்வுகள்:
${ceremonyList}

${customMessage ? customMessage + "\n\n" : ""}தயவுசெய்து தங்கள் வருகையையும் உணவு விருப்பத்தையும் கீழே உள்ள இணைப்பில் உறுதிப்படுத்தவும்:
🔗 ${rsvpUrl}

அன்புடன்,
குடும்பத்தினர் 🙏`.trim();
  } else if (language === "kn") {
    messageText = `ನಮಸ್ಕಾರ ${guestName} ರವರೇ 🙏,

ಅತೀವ ಸಂತೋಷದಿಂದ *${city}* ನಲ್ಲಿ ನಡೆಯಲಿರುವ *${coupleTitle}* ಅವರ ಶುಭ ವಿವಾಹ ಮಹೋತ್ಸವಕ್ಕೆ ನಿಮ್ಮನ್ನು ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬವನ್ನು ಆತ್ಮೀಯವಾಗಿ ಆಹ್ವಾನಿಸುತ್ತಿದ್ದೇವೆ. ಪ್ರಾರಂಭ: *${formatDate(startDate)}*.

ಆಹ್ವಾನಿತ ಸಮಾರಂಭಗಳು:
${ceremonyList}

${customMessage ? customMessage + "\n\n" : ""}ದಯವಿಟ್ಟು ನಿಮ್ಮ ಉಪಸ್ಥಿತಿ ಮತ್ತು ಊಟದ ಆದ್ಯತೆಯನ್ನು ಕೆಳಗಿನ ಲಿಂಕ್ ಮೂಲಕ ಖಚಿತಪಡಿಸಿ:
🔗 ${rsvpUrl}

ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳೊಂದಿಗೆ,
ಕುಟುಂಬ 🙏`.trim();
  } else if (language === "ml") {
    messageText = `നമസ്കാരം ${guestName} 🙏,

അത്യധികം സന്തോഷത്തോടെ *${city}* വെച്ച് നടക്കുന്ന *${coupleTitle}* വിവാഹ ചടങ്ങുകളിലേക്ക് നിങ്ങളെയും കുടുംബത്തെയും സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു. തീയതി: *${formatDate(startDate)}*.

ക്ഷണിക്കപ്പെട്ട ചടങ്ങുകൾ:
${ceremonyList}

${customMessage ? customMessage + "\n\n" : ""}ദയവായി നിങ്ങളുടെ പങ്കാളിത്തവും ഭക്ഷണ മുൻഗണനയും താഴെയുള്ള ലിങ്കിലൂടെ അറിയിക്കുക:
🔗 ${rsvpUrl}

സ്നേഹാദരങ്ങളോടെ,
കുടുംബം 🙏`.trim();
  } else if (language === "or") {
    messageText = `ନମସ୍କାର ${guestName} ଆଜ୍ଞା 🙏,

ଅତ୍ୟନ୍ତ ଆନନ୍ଦର ସହିତ ଆମେ ଆପଣଙ୍କୁ ଏବଂ ଆପଣଙ୍କ ପରିବାରକୁ *${city}* ଠାରେ ଅନୁଷ୍ଠିତ ହେଉଥିବା *${coupleTitle}* ଙ୍କ ଶୁଭ ବିବାହ ଉତ୍ସବକୁ ସସ୍ନେହ ନିମନ୍ତ୍ରଣ କରୁଛୁ। ଶୁଭାରମ୍ଭ: *${formatDate(startDate)}*।

ଆପଣ ନିମନ୍ତ୍ରିତ ହୋଇଥିବା ସମାରୋହ:
${ceremonyList}

${customMessage ? customMessage + "\n\n" : ""}ଦୟାକରି ଆପଣଙ୍କ ଉପସ୍ଥିତି ଏବଂ ଖାଦ୍ୟ ପସନ୍ଦ ତଳେ ଥିବା ଲିଙ୍କରେ ନିଶ୍ଚିତ କରନ୍ତୁ:
🔗 ${rsvpUrl}

ଶୁଭେଚ୍ଛା ସହ,
ପରିବାରବର୍ଗ 🙏`.trim();
  } else {
    // English default
    messageText = `Namaste ${guestName} ji 🙏,

With immense joy, we invite you and your family to celebrate the wedding festivities of *${coupleTitle}* in *${city}*, commencing on *${formatDate(startDate)}*.

You are cordially invited to:
${ceremonyList}

${customMessage ? customMessage + "\n\n" : ""}Please confirm your attendance, food preferences (Veg/Jain), and accompanying family members via your private RSVP link below:
🔗 ${rsvpUrl}

We look forward to celebrating together!
Warm regards & Pranam,
The Family`.trim();
  }

  const encodedText = encodeURIComponent(messageText);
  let cleanPhone = (phone || "").replace(/[^0-9]/g, "");
  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone;
  }

  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;

  return { text: messageText, waUrl };
}

/**
 * Generates a reminder message for guests who have pending RSVP status.
 */
export function generateWhatsAppRsvpReminder({
  guestName,
  phone,
  coupleTitle,
  rsvpUrl,
  daysLeft = 7,
}: {
  guestName: string;
  phone?: string;
  coupleTitle: string;
  rsvpUrl: string;
  daysLeft?: number;
}): { text: string; waUrl: string } {
  const messageText = `Namaste ${guestName} ji 🙏,

A gentle reminder regarding the upcoming wedding celebrations of *${coupleTitle}* (starting in ${daysLeft} days).

To ensure appropriate banquet arrangements and seating, please kindly confirm your RSVP by clicking your personal link:
🔗 ${rsvpUrl}

Thank you!
Warm regards,
The Wedding Team`.trim();

  const encodedText = encodeURIComponent(messageText);
  let cleanPhone = (phone || "").replace(/[^0-9]/g, "");
  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone;
  }

  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;

  return { text: messageText, waUrl };
}
