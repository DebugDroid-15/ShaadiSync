"use client";

import * as React from "react";

/**
 * Animated Royal Indian Wedding Thali (Cuisine Serving Sequence)
 * Animates a lavish Indian wedding platter being served bowl-by-bowl:
 * - Golden Brass / Silver Royal Thali platter with intricate carved rim
 * - Steaming aromatic Dal Makhani with fresh cream swirl
 * - Shahi Paneer with golden saffron gravy
 * - Pulao rice with peas & fried cashews in center
 * - Gulab Jamun sweet in rose syrup with pistachio flakes
 * - Crisp Papad & soft Phulka / Naan with dollop of white butter (Makhan)
 * - Mint chutney katori & lemon pickle
 * - Interactive / looping serving animation with serving ladle and rising aroma
 */
export function AnimatedRoyalThaliServing() {
  const [currentStep, setCurrentStep] = React.useState<number>(0);

  // Auto-progress the royal food serving sequence bowl-by-bowl
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 6);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const dishes = [
    { name: "Jeera & Saffron Rice", label: "Center Rice" },
    { name: "Dal Makhani (Makhani Cream)", label: "Bowl 1: Dal" },
    { name: "Shahi Paneer (Cashew Gravy)", label: "Bowl 2: Paneer" },
    { name: "Kashmiri Dum Aloo", label: "Bowl 3: Sabzi" },
    { name: "Pudina Chutney & Achaar", label: "Bowl 4: Chutney" },
    { name: "Hot Gulab Jamun & Rabdi", label: "Bowl 5: Mithai" },
  ];

  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex flex-col items-center justify-center select-none">
      {/* Warm Golden Banquet Aura */}
      <div className="absolute inset-2 bg-gradient-to-r from-amber-500/20 via-gold-500/30 to-amber-600/20 rounded-full blur-2xl animate-pulse" />

      {/* SVG Royal Thali */}
      <svg
        viewBox="0 0 240 240"
        className="w-full h-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Thali Metal Gradient */}
          <radialGradient id="thaliBase" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="70%" stopColor="#FEF3C7" />
            <stop offset="90%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>
          <linearGradient id="thaliRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Katori (Bowl) Metallic Gradient */}
          <radialGradient id="katoriGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F3F4F6" />
            <stop offset="90%" stopColor="#D1D5DB" />
            <stop offset="100%" stopColor="#9CA3AF" />
          </radialGradient>

          {/* Food Gravy Gradients */}
          <radialGradient id="dalGravy" cx="45%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#451A03" />
            <stop offset="60%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#3E1902" />
          </radialGradient>
          <radialGradient id="paneerGravy" cx="45%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="70%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#9A3412" />
          </radialGradient>
          <radialGradient id="alooGravy" cx="45%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="80%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </radialGradient>
          <radialGradient id="chutneyGrad" cx="45%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="80%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#14532D" />
          </radialGradient>
          <radialGradient id="mithaiGrad" cx="45%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="80%" stopColor="#451A03" />
            <stop offset="100%" stopColor="#290E02" />
          </radialGradient>
        </defs>

        {/* Outer Royal Thali Rim */}
        <circle cx="120" cy="120" r="112" fill="url(#thaliRim)" stroke="#78350F" strokeWidth="2.5" />
        
        {/* Carved Jaali / Pearl rim beads around the thali */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const bx = 120 + 107 * Math.cos(angle);
          const by = 120 + 107 * Math.sin(angle);
          return <circle key={i} cx={bx} cy={by} r="2.2" fill="#FEF08A" />;
        })}

        {/* Inner Plate Surface */}
        <circle cx="120" cy="120" r="102" fill="url(#thaliBase)" stroke="#B45309" strokeWidth="1.5" />

        {/* Center Platter Dish: Fragrant Basmati Pulao Rice */}
        <g className={`transition-all duration-700 ${currentStep >= 0 ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
          {/* Banana Leaf cutout accent under rice */}
          <path
            d="M85 105 C85 85, 155 85, 155 105 C155 145, 85 145, 85 105 Z"
            fill="#16A34A"
            opacity="0.85"
          />
          <ellipse cx="120" cy="118" rx="34" ry="24" fill="#FEFCE8" stroke="#FDE047" strokeWidth="1" />
          {/* Basmati grains & green peas */}
          <circle cx="112" cy="114" r="3.5" fill="#22C55E" />
          <circle cx="128" cy="122" r="3" fill="#22C55E" />
          <circle cx="124" cy="110" r="2.5" fill="#F59E0B" />
          {/* Fried cashew / Kaju */}
          <ellipse cx="116" cy="124" rx="4.5" ry="2.5" fill="#FDE68A" transform="rotate(-20 116 124)" />
          {/* Steam coming from hot rice */}
          <path d="M115 96 Q112 88 116 80" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" className="animate-pulse" />
          <path d="M125 94 Q128 86 124 78" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" className="animate-pulse" />
        </g>

        {/* Katori 1 (Top Center): Dal Makhani */}
        <g
          className={`transition-all duration-700 origin-center ${
            currentStep >= 1 ? "opacity-100 translate-y-0" : "opacity-20 -translate-y-2"
          }`}
        >
          <circle cx="120" cy="48" r="22" fill="url(#katoriGrad)" stroke="#B45309" strokeWidth="1.5" />
          <circle cx="120" cy="48" r="18" fill="url(#dalGravy)" />
          {/* Fresh Cream Swirl (Malai) */}
          <path d="M113 46 Q120 40 126 48 Q120 54 114 50" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="120" cy="48" r="2" fill="#FFFFFF" />
          {/* Butter Cube / Makhan */}
          <rect x="117" y="45" width="5" height="5" fill="#FEF08A" rx="1" />
        </g>

        {/* Katori 2 (Top Right): Shahi Paneer */}
        <g
          className={`transition-all duration-700 origin-center ${
            currentStep >= 2 ? "opacity-100 scale-100" : "opacity-20 scale-90"
          }`}
        >
          <circle cx="172" cy="74" r="22" fill="url(#katoriGrad)" stroke="#B45309" strokeWidth="1.5" />
          <circle cx="172" cy="74" r="18" fill="url(#paneerGravy)" />
          {/* Paneer Cubes */}
          <rect x="166" y="68" width="6" height="6" fill="#FFFFFF" rx="1" stroke="#FDE68A" strokeWidth="0.5" />
          <rect x="172" y="74" width="7" height="6" fill="#FFFFFF" rx="1" stroke="#FDE68A" strokeWidth="0.5" />
          {/* Coriander leaf garnish */}
          <circle cx="169" cy="73" r="1.5" fill="#22C55E" />
        </g>

        {/* Katori 3 (Bottom Right): Kashmiri Dum Aloo */}
        <g
          className={`transition-all duration-700 origin-center ${
            currentStep >= 3 ? "opacity-100 scale-100" : "opacity-20 scale-90"
          }`}
        >
          <circle cx="178" cy="135" r="22" fill="url(#katoriGrad)" stroke="#B45309" strokeWidth="1.5" />
          <circle cx="178" cy="135" r="18" fill="url(#alooGravy)" />
          {/* Baby Potatoes in rich curry */}
          <circle cx="173" cy="133" r="5" fill="#D97706" />
          <circle cx="182" cy="137" r="4.5" fill="#B45309" />
          <path d="M172 131 Q178 128 183 133" stroke="#FEF3C7" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>

        {/* Katori 4 (Bottom Left): Mint Chutney & Achaar */}
        <g
          className={`transition-all duration-700 origin-center ${
            currentStep >= 4 ? "opacity-100 scale-100" : "opacity-20 scale-90"
          }`}
        >
          <circle cx="68" cy="145" r="20" fill="url(#katoriGrad)" stroke="#B45309" strokeWidth="1.5" />
          <circle cx="68" cy="145" r="16" fill="url(#chutneyGrad)" />
          {/* Swirl in chutney */}
          <path d="M64 143 Q68 139 72 145" stroke="#86EFAC" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Red chilli speck */}
          <circle cx="67" cy="148" r="1" fill="#EF4444" />
        </g>

        {/* Katori 5 (Top Left): Royal Gulab Jamun & Rabdi */}
        <g
          className={`transition-all duration-700 origin-center ${
            currentStep >= 5 ? "opacity-100 scale-100" : "opacity-20 scale-90"
          }`}
        >
          <circle cx="66" cy="80" r="22" fill="url(#katoriGrad)" stroke="#B45309" strokeWidth="1.5" />
          <circle cx="66" cy="80" r="18" fill="#FEF3C7" />
          {/* Golden Rabdi bed */}
          <ellipse cx="66" cy="82" rx="14" ry="12" fill="#FDE68A" />
          {/* Two Gulab Jamuns */}
          <circle cx="62" cy="78" r="6.5" fill="url(#mithaiGrad)" stroke="#F59E0B" strokeWidth="0.5" />
          <circle cx="71" cy="82" r="5.5" fill="url(#mithaiGrad)" />
          {/* Pistachio / Pista flakes & Silver Vark */}
          <circle cx="63" cy="77" r="1" fill="#22C55E" />
          <circle cx="70" cy="81" r="1" fill="#FFFFFF" />
        </g>

        {/* Traditional Bread / Tandoori Roti / Naan & Roasted Papad on the side */}
        <g className="transition-all duration-500">
          {/* Triangular Roasted Papad */}
          <path
            d="M95 162 L135 185 L105 192 Z"
            fill="#FEF08A"
            stroke="#D97706"
            strokeWidth="1"
            opacity="0.9"
          />
          <circle cx="110" cy="180" r="1.2" fill="#78350F" />
          <circle cx="120" cy="183" r="1" fill="#78350F" />

          {/* Butter Naan / Tandoori Roti */}
          <ellipse
            cx="135"
            cy="165"
            rx="20"
            ry="14"
            fill="#FED7AA"
            stroke="#EA580C"
            strokeWidth="1.2"
            transform="rotate(15 135 165)"
          />
          {/* Tandoori Char Spots */}
          <circle cx="130" cy="163" r="1.8" fill="#9A3412" />
          <circle cx="140" cy="166" r="2" fill="#7C2D12" />
          <circle cx="134" cy="169" r="1.5" fill="#C2410C" />
          {/* Butter Glaze */}
          <ellipse cx="136" cy="164" rx="6" ry="3" fill="#FEF08A" opacity="0.8" />
        </g>

        {/* Serving Ladle Action / Royal Karchi sprinkling food */}
        <g className="animate-bounce-gentle">
          <path
            d="M175 35 L215 5"
            stroke="#D97706"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <ellipse cx="172" cy="37" rx="8" ry="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          <circle cx="172" cy="37" r="2.5" fill="#FEF3C7" className="animate-ping" />
        </g>
      </svg>

      {/* Serving Sequence Status Pill */}
      <div className="mt-2 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 border border-gold-300 text-[11px] font-serif font-bold text-navy-950 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          Serving: <span className="text-burgundy-800">{dishes[currentStep].name}</span>
        </span>
      </div>
    </div>
  );
}

/**
 * Animated High-Energy Indian Baraat Crowd Celebration
 * Renders joyful wedding guests dancing in traditional Indian attire:
 * - Baraati with traditional Rajasthani Pagri (Turban) raising arms in bhangra rhythm
 * - Lady guest in glittering crimson embroidered Lehenga / Dupatta swirling in celebration
 * - Dhol player beating a brass-ringed Dhol drum with sticks (dagga & tihli)
 * - Animated musical festive notes, flying golden marigold petals, and celebratory sparkles
 */
export function AnimatedDancingCrowdCelebration() {
  return (
    <div className="relative w-64 h-64 sm:w-76 sm:h-72 mx-auto flex flex-col items-center justify-center select-none">
      {/* Festive Vibrant Lighting Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/25 via-rose-500/20 to-purple-500/25 rounded-full blur-2xl animate-pulse" />

      {/* Dynamic Celebration Characters SVG */}
      <svg
        viewBox="0 0 260 220"
        className="w-full h-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Turban Gradients */}
          <linearGradient id="turbanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="50%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>

          {/* Royal Sherwani Gradient */}
          <linearGradient id="sherwaniGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="60%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Crimson Lehenga Gradient */}
          <linearGradient id="lehengaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="50%" stopColor="#BE123C" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>

          {/* Dhol Drum Wood Gradient */}
          <linearGradient id="dholGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="50%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>

        {/* Floating Festive Confetti & Notes in the Air */}
        <g className="opacity-90">
          <text x="35" y="45" fill="#FCD34D" fontSize="14" className="animate-bounce">♪</text>
          <text x="215" y="40" fill="#F43F5E" fontSize="16" className="animate-bounce" style={{ animationDelay: "0.4s" }}>♫</text>
          <circle cx="65" cy="30" r="3" fill="#FB923C" className="animate-ping" />
          <circle cx="195" cy="25" r="3.5" fill="#FDE047" className="animate-ping" style={{ animationDelay: "0.6s" }}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
          {/* Flying Marigold Petal */}
          <ellipse cx="130" cy="20" rx="4" ry="7" fill="#F97316" transform="rotate(45 130 20)" />
        </g>

        {/* ==============================================================
            CHARACTER 1 (LEFT): BARAATI IN ROYAL SAFA / PAGRI (DANCING BHANGRA)
            ============================================================== */}
        <g className="animate-bounce-gentle" style={{ transformOrigin: "65px 170px" }}>
          {/* Raised Arms in Joyous Bhangra Pose */}
          <path
            d="M50 105 L35 70 L25 55"
            stroke="#FDBA74"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="24" cy="53" r="4.5" fill="#FDBA74" />
          {/* Gold Kada on wrist */}
          <circle cx="28" cy="60" r="3" fill="#F59E0B" />

          <path
            d="M75 105 L88 72 L102 58"
            stroke="#FDBA74"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="103" cy="57" r="4.5" fill="#FDBA74" />
          <circle cx="98" cy="64" r="3" fill="#F59E0B" />

          {/* Kurta / Royal Sherwani Body */}
          <path
            d="M48 100 L78 100 L84 150 L42 150 Z"
            fill="url(#sherwaniGrad)"
            stroke="#78350F"
            strokeWidth="1.2"
          />
          {/* Gold Zari Buttons down Sherwani */}
          <circle cx="63" cy="110" r="1.5" fill="#FFFFFF" />
          <circle cx="63" cy="120" r="1.5" fill="#FFFFFF" />
          <circle cx="63" cy="130" r="1.5" fill="#FFFFFF" />

          {/* Churidar Pyjama Legs */}
          <path d="M52 150 L50 190" stroke="#FEF3C7" strokeWidth="6" strokeLinecap="round" />
          <path d="M74 150 L76 188" stroke="#FEF3C7" strokeWidth="6" strokeLinecap="round" />
          {/* Royal Jutti Shoes */}
          <ellipse cx="48" cy="192" rx="6" ry="3" fill="#B45309" />
          <ellipse cx="78" cy="190" rx="6" ry="3" fill="#B45309" />

          {/* Head & Face */}
          <circle cx="63" cy="85" r="13" fill="#FDBA74" />
          {/* Joyous Closed Eyes & Big Wedding Smile */}
          <path d="M57 84 Q60 81 63 84" stroke="#78350F" strokeWidth="1.2" fill="none" />
          <path d="M64 84 Q67 81 70 84" stroke="#78350F" strokeWidth="1.2" fill="none" />
          <path d="M59 89 Q63 93 68 89" stroke="#991B1B" strokeWidth="1.5" fill="none" />
          {/* Groom/Baraati Royal Moustache */}
          <path d="M58 87 Q63 86 65 89 Q67 86 70 87" stroke="#451A03" strokeWidth="1.2" fill="none" />

          {/* Traditional Royal Rajasthani Pagri / Turban with Kalgi Feather */}
          <path
            d="M50 78 C48 62, 78 62, 76 78 Z"
            fill="url(#turbanGrad)"
            stroke="#9A3412"
            strokeWidth="1"
          />
          <path
            d="M48 76 C55 68, 72 68, 78 76"
            stroke="#FEF08A"
            strokeWidth="2"
            fill="none"
          />
          {/* Jeweled Kalgi Feather */}
          <path d="M63 62 L63 50" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="63" cy="50" r="3" fill="#EF4444" />
          <ellipse cx="63" cy="46" rx="2" ry="4" fill="#22C55E" />
        </g>

        {/* ==============================================================
            CHARACTER 2 (CENTER): DHOL PLAYER WITH TRADITIONAL DHOL DRUM
            ============================================================== */}
        <g className="animate-bounce" style={{ animationDuration: "0.9s", transformOrigin: "130px 180px" }}>
          {/* Head & Red Bandhana */}
          <circle cx="130" cy="88" r="11" fill="#FDBA74" />
          <ellipse cx="130" cy="80" rx="12" ry="6" fill="#DC2626" />
          <circle cx="127" cy="88" r="1" fill="#451A03" />
          <circle cx="133" cy="88" r="1" fill="#451A03" />
          <path d="M128 93 Q130 96 133 93" stroke="#991B1B" strokeWidth="1.2" fill="none" />

          {/* Yellow Kurta */}
          <path d="M118 99 L142 99 L146 145 L114 145 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />

          {/* Dhol Drum Suspended on Neck Strap */}
          {/* Strap */}
          <path d="M122 98 L112 120" stroke="#1E293B" strokeWidth="2" />
          <path d="M138 98 L148 120" stroke="#1E293B" strokeWidth="2" />
          
          {/* Dhol Barrel Body (Wood with decorative brass rings) */}
          <ellipse cx="130" cy="130" rx="24" ry="15" fill="url(#dholGrad)" stroke="#451A03" strokeWidth="1.5" />
          {/* Tightening Ropes & Brass Rings on Dhol */}
          <path d="M112 125 L148 135 M112 135 L148 125" stroke="#FEF3C7" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="108" cy="130" r="14" fill="#FEF3C7" stroke="#78350F" strokeWidth="2" />
          <circle cx="108" cy="130" r="10" fill="#451A03" opacity="0.8" />
          <circle cx="152" cy="130" r="14" fill="#FEF3C7" stroke="#78350F" strokeWidth="2" />

          {/* Dhol Sticks (Dagga curved stick & Tihli thin stick) */}
          {/* Left Dagga curved stick striking bass drumhead */}
          <path d="M96 112 Q102 120 106 128" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
          {/* Right Tihli stick striking treble */}
          <path d="M164 116 L154 126" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Acoustic Dhol Sound Waves (Dhinka-Chika rhythm) */}
          <g className="animate-pulse">
            <path d="M90 124 C85 127, 85 133, 90 136" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M84 120 C78 126, 78 134, 84 140" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M170 124 C175 127, 175 133, 170 136" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>

          {/* Legs */}
          <path d="M122 145 L120 185" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          <path d="M138 145 L140 185" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="118" cy="188" rx="5" ry="2.5" fill="#1E293B" />
          <ellipse cx="142" cy="188" rx="5" ry="2.5" fill="#1E293B" />
        </g>

        {/* ==============================================================
            CHARACTER 3 (RIGHT): FEMALE GUEST IN SWIRLING LEHENGA & DUPATTA
            ============================================================== */}
        <g className="animate-bounce-gentle" style={{ animationDelay: "0.3s", transformOrigin: "195px 170px" }}>
          {/* Graceful Dancing Arms & Bangles (Chooda) */}
          <path
            d="M182 105 L168 85 L162 70"
            stroke="#FDBA74"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <circle cx="161" cy="69" r="4" fill="#FDBA74" />
          {/* Chooda / Bangles stack */}
          <rect x="163" y="74" width="4" height="6" fill="#DC2626" rx="1" />

          <path
            d="M208 105 L222 82 L232 68"
            stroke="#FDBA74"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <circle cx="233" cy="67" r="4" fill="#FDBA74" />
          <rect x="222" y="74" width="4" height="6" fill="#DC2626" rx="1" />

          {/* Blouse (Choli) */}
          <path d="M185 100 L210 100 L212 120 L183 120 Z" fill="#F43F5E" stroke="#9F1239" strokeWidth="1" />
          {/* Gold neckline embroidery */}
          <path d="M190 100 Q197 106 205 100" stroke="#FDE047" strokeWidth="1.5" fill="none" />

          {/* Swirling Festive Flared Lehenga (Skirt) */}
          <path
            d="M185 120 C175 145, 160 170, 165 178 C195 186, 225 186, 235 176 C238 168, 220 145, 210 120 Z"
            fill="url(#lehengaGrad)"
            stroke="#881337"
            strokeWidth="1.2"
          />
          {/* Heavy Gold Gota-Patti Border on Lehenga Flairs */}
          <path
            d="M165 174 C195 182, 225 182, 235 172"
            stroke="#FDE047"
            strokeWidth="3.5"
            fill="none"
          />
          <path
            d="M167 170 C195 178, 223 178, 233 168"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            fill="none"
          />

          {/* Swirling Georgette Dupatta */}
          <path
            d="M178 98 Q195 85 215 95 Q235 110 228 140"
            stroke="#FDE68A"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />

          {/* Head, Hair Bun & Maang Tikka */}
          <circle cx="197" cy="85" r="11" fill="#FDBA74" />
          {/* Sleek Black Hair Bun with Jasmine Flowers (Gajra) */}
          <ellipse cx="197" cy="78" rx="11" ry="8" fill="#1C1917" />
          <circle cx="197" cy="72" r="5" fill="#FEF08A" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Maang Tikka */}
          <path d="M197 75 L197 81" stroke="#F59E0B" strokeWidth="1.2" />
          <circle cx="197" cy="82" r="1.8" fill="#EF4444" />
          {/* Expressive Eyes & Smile */}
          <circle cx="194" cy="85" r="1" fill="#1C1917" />
          <circle cx="201" cy="85" r="1" fill="#1C1917" />
          <path d="M194 89 Q197 93 201 89" stroke="#BE123C" strokeWidth="1.5" fill="none" />
          {/* Gold Jhumka Earrings */}
          <circle cx="186" cy="88" r="2" fill="#FDE047" />
          <circle cx="208" cy="88" r="2" fill="#FDE047" />
        </g>
      </svg>

      {/* Crowd Energy Status Pill */}
      <div className="mt-2 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-950/80 border border-gold-400/50 text-[11px] font-serif font-bold text-gold-300 shadow-xs">
          <span className="text-sm">🥁</span>
          Baraat Celebration Mode • <span className="text-emerald-400">Zero Ingress Queue</span>
        </span>
      </div>
    </div>
  );
}
