// ══════════════════════════════════════════════════════════════════════════
// data/dataStore.js — THE HERITAGE PATH v5
// Single source of truth. Updated via n8n GitHub API push.
// Structure is Airtable-ready: each array maps 1:1 to a base table.
// ══════════════════════════════════════════════════════════════════════════

// ── Equity range config (replaces budget filter in v5) ───────────────────
// Logic: purchasePower = maxEquity / LEVERAGE_RATIO
// Advisor note auto-computed from this table.
export const LEVERAGE_RATIO = 0.3; // 30% down payment standard

export const EQUITY_RANGES = [
  {
    val:          "3-5",
    label_vi:     "3 – 5 tỷ",
    label_en:     "3 – 5B VND",
    maxEquity:    5,
    purchasePower: Math.round(5 / LEVERAGE_RATIO * 10) / 10,   // 16.7
    affordablePriceRanges: ["5-10", "10-20"],
  },
  {
    val:          "5-10",
    label_vi:     "5 – 10 tỷ",
    label_en:     "5 – 10B VND",
    maxEquity:    10,
    purchasePower: Math.round(10 / LEVERAGE_RATIO * 10) / 10,  // 33.3
    affordablePriceRanges: ["5-10", "10-20", "20+"],
  },
  {
    val:          "10-20",
    label_vi:     "10 – 20 tỷ",
    label_en:     "10 – 20B VND",
    maxEquity:    20,
    purchasePower: Math.round(20 / LEVERAGE_RATIO * 10) / 10,  // 66.7
    affordablePriceRanges: ["5-10", "10-20", "20+"],
  },
  {
    val:          "20+",
    label_vi:     "Trên 20 tỷ",
    label_en:     "20B+ VND",
    maxEquity:    null,
    purchasePower: null, // unlimited
    affordablePriceRanges: ["5-10", "10-20", "20+"],
  },
];

// ── Projects — n8n pushes new entries here ────────────────────────────────
export const projects = [
  {
    id: "p1",
    name: "The Resonance",
    priceRange: "20+",
    category: "an_cu",
    location: "Thảo Điền, TP.HCM",
    shortLabel_vi: "Tĩnh lặng giữa nhịp thành phố",
    shortLabel_en: "Quiet in the city's rhythm",
    description_vi:
      "Kiến trúc thấp tầng theo triết lý wabi-sabi — trân trọng sự tinh tế của thời gian. Mỗi căn là một tác phẩm riêng, không căn nào giống căn nào.",
    description_en:
      "Low-rise architecture inspired by wabi-sabi — honouring the quiet refinement of time. Each apartment is a singular work.",
    teasers: {
      vi: "Vị trí khan hiếm. Thiết kế không tái lập.",
      en: "Rare location. Design that cannot be replicated.",
    },
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80",
  },
  {
    id: "p2",
    name: "Meridian Residence",
    priceRange: "10-20",
    category: "dau_tu",
    location: "Quận 2, TP.HCM",
    shortLabel_vi: "Bảo chứng giá trị thế hệ sau",
    shortLabel_en: "Value assured for the next generation",
    description_vi:
      "Vị trí hiếm tại trục kết nối trung tâm và khu dân cư quốc tế. Giá trị bền vững theo chu kỳ 10 năm, quản lý bởi hội đồng cư dân độc lập.",
    description_en:
      "Rare position on the axis connecting the centre to international residential districts. Ten-year value cycle, independent council management.",
    teasers: {
      vi: "Thanh khoản ổn định. Chu kỳ tăng trưởng dài hạn.",
      en: "Stable liquidity. Long-term growth cycle.",
    },
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80",
  },
  {
    id: "p3",
    name: "The Parallels",
    priceRange: "5-10",
    category: "an_cu",
    location: "Bình Thạnh, TP.HCM",
    shortLabel_vi: "Phong cách sống không cần giải thích",
    shortLabel_en: "A way of living that needs no explanation",
    description_vi:
      "Ngôn ngữ kiến trúc cao cấp ở phân khúc vừa tầm. Chứng minh rằng sự tinh tế không phụ thuộc vào quy mô hay giá cả.",
    description_en:
      "Premium architectural language at an accessible tier. Proof that refinement is independent of scale.",
    teasers: {
      vi: "Hệ giá trị đúng. Ngân sách tối ưu.",
      en: "Right values. Optimised budget.",
    },
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80",
  },
  {
    id: "p4",
    name: "Atelier Saigon",
    priceRange: "20+",
    category: "toa_do_du_phong",
    location: "Quận 1, TP.HCM",
    shortLabel_vi: "Tọa độ dự phòng tại trung tâm",
    shortLabel_en: "Strategic reserve at the centre",
    description_vi:
      "Không phải nơi ở thường ngày — đây là không gian dự phòng cho những quyết định quan trọng của gia đình. Thanh khoản cao, sẵn sàng mọi lúc.",
    description_en:
      "Not an everyday residence — a reserve space for the family's critical decisions. High liquidity, always available.",
    teasers: {
      vi: "Trung tâm. Thanh khoản cao. Tự vận hành.",
      en: "Central. High liquidity. Self-managing.",
    },
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=700&q=80",
  },
  {
    id: "p5",
    name: "Heritage Grove",
    priceRange: "10-20",
    category: "an_cu",
    location: "Long An, Vùng ven",
    shortLabel_vi: "Đất và cây — bảo chứng hữu hình nhất",
    shortLabel_en: "Land and trees — the most tangible assurance",
    description_vi:
      "Biệt thự vườn trong khuôn viên rộng, thiết kế cho gia đình nhiều thế hệ. Không gian để con cái lớn lên với đất, cây xanh và sự yên tĩnh thực sự.",
    description_en:
      "Garden villas in a generous compound, designed for multi-generational families. Land, greenery, and genuine quiet.",
    teasers: {
      vi: "Thiết kế đa thế hệ. Đất sạch sổ hồng.",
      en: "Multi-generational design. Clear land title.",
    },
    image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=700&q=80",
  },
  {
    id: "p6",
    name: "Celestine Tower",
    priceRange: "20+",
    category: "dau_tu",
    location: "Thủ Thiêm, TP.HCM",
    shortLabel_vi: "Đầu tư vào tầm nhìn thành phố",
    shortLabel_en: "Investing in the city's horizon",
    description_vi:
      "Penthouse và căn hộ cao tầng nhìn ra sông Sài Gòn. Thanh khoản cao, quản lý tài sản chuyên nghiệp.",
    description_en:
      "Penthouses and high-floor apartments facing the Saigon River. High liquidity, professional asset management.",
    teasers: {
      vi: "Tầm nhìn sông. Quản lý chuyên nghiệp.",
      en: "River views. Professional management.",
    },
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&q=80",
  },
];

// ── Journal — Claude / n8n posts here ────────────────────────────────────
export const journal = [
  {
    id: "j1",
    title_vi:
      "Những gia đình lâu đời không phô trương — họ nhận ra nhau qua những gì họ không nói",
    title_en:
      "Old families do not display — they recognise each other through what they leave unsaid",
    excerpt_vi:
      "Hệ giá trị của tầng lớp thượng lưu lâu đời không nằm ở logo hay giá cả. Nó nằm trong cách im lặng đúng lúc, cách chọn không gian, cách từ chối đúng chỗ.",
    excerpt_en:
      "The values of long-established families do not rest in logos or price. They rest in knowing when to be silent, how to choose a space, how to decline gracefully.",
    category_vi: "Văn hóa thượng lưu",
    category_en: "Refined culture",
    date: "12 Tháng 3, 2026",
    image: "https://images.unsplash.com/photo-1447772697977-a37e0f6dda06?w=700&q=80",
    slug: "gia-dinh-lau-doi-khong-pho-truong",
    tags: ["habitus", "van-hoa", "vi-the", "di-san"],
  },
  {
    id: "j2",
    title_vi: "Địa chỉ là câu đầu tiên người ta nói về bạn",
    title_en: "Your address is the first sentence people say about you",
    excerpt_vi:
      "Trong thế giới của những cuộc gặp đầu tiên, tọa độ bạn chọn nói trước khi bạn kịp mở miệng.",
    excerpt_en:
      "In a world of first impressions, the address you choose speaks before you do.",
    category_vi: "Vị thế xã hội",
    category_en: "Social position",
    date: "5 Tháng 3, 2026",
    image: "https://images.unsplash.com/photo-1529408686214-b48b8532f72c?w=700&q=80",
    slug: "dia-chi-la-cau-dau-tien",
    tags: ["vi-the", "mang-luoi", "khong-gian-song"],
  },
  {
    id: "j3",
    title_vi:
      "Thế hệ thứ nhất xây dựng của cải. Thế hệ thứ hai kế thừa gì, nếu không được chuẩn bị?",
    title_en:
      "The first generation builds wealth. What does the second inherit, if unprepared?",
    excerpt_vi:
      "Của cải tài chính không có vốn văn hóa đi kèm thường tan biến chỉ trong hai thế hệ.",
    excerpt_en:
      "Financial capital without cultural capital tends to disappear within two generations.",
    category_vi: "Sự tiếp nối gia đình",
    category_en: "Family continuity",
    date: "28 Tháng 2, 2026",
    image: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=700&q=80",
    slug: "the-he-thu-nhat-xay-dung-cua-cai",
    tags: ["di-san", "gia-dinh", "von-van-hoa", "the-he-sau"],
  },
  {
    id: "j4",
    title_vi:
      "Một đứa trẻ lớn lên trong không gian đẹp — và tự nhiên trở thành người có thẩm mỹ",
    title_en:
      "A child raised in beautiful space naturally becomes a person of taste",
    excerpt_vi:
      "Môi trường sống định hình tư duy thẩm mỹ từ những năm đầu đời — đây không phải xa xỉ.",
    excerpt_en:
      "The living environment shapes aesthetic thinking from the earliest years — this is not luxury.",
    category_vi: "Giáo dục & Môi trường",
    category_en: "Education & Environment",
    date: "18 Tháng 2, 2026",
    image: "https://images.unsplash.com/photo-1530099486328-e021101a494a?w=700&q=80",
    slug: "dua-tre-lon-len-trong-khong-gian-dep",
    tags: ["giao-duc", "moi-truong-song", "tham-my", "tre-em"],
  },
  {
    id: "j5",
    title_vi: "Vì sao những gia đình thực sự giàu không bao giờ nói về tiền",
    title_en: "Why truly wealthy families never talk about money",
    excerpt_vi:
      "Khi tài sản đạt đến ngưỡng nhất định, nó trở nên vô hình. Bài học từ các gia tộc lâu đời.",
    excerpt_en:
      "When assets reach a certain level, they become invisible. A lesson from established families.",
    category_vi: "Triết lý tài sản",
    category_en: "Asset philosophy",
    date: "10 Tháng 2, 2026",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=80",
    slug: "gia-dinh-giau-khong-noi-ve-tien",
    tags: ["triet-ly", "tai-san", "habitus", "quiet-luxury"],
  },
];

// ── Quotes — internal only, never rendered in UI ─────────────────────────
export const quotes = [
  { id: "kiyosaki", type: "leverage", author: "Robert Kiyosaki" },
  { id: "buffett",  type: "safety",   author: "Warren Buffett" },
  { id: "hill",     type: "legacy",   author: "Napoleon Hill" },
];

// ── Glossary — term → i18n key reference ─────────────────────────────────
export const glossary = {
  habitus:          { term: "Habitus",         defKey: "glossary_habitus_def" },
  old_money:        { term: "Old Money",        defKey: "glossary_old_money_def" },
  cultural_capital: { term: "Cultural Capital", defKey: "glossary_cultural_capital_def" },
  legacy:           { term: "Legacy",           defKey: "glossary_legacy_def" },
  portfolio:        { term: "Portfolio",        defKey: "glossary_portfolio_def" },
};

// ── Financial policies — placeholder, Airtable maps here ────────────────
export const financialPolicies = {
  p1: { projectName: "The Resonance",      yieldEst: "—", ltvRange: "—", note: "Airtable pending" },
  p2: { projectName: "Meridian Residence", yieldEst: "—", ltvRange: "—", note: "Airtable pending" },
  p3: { projectName: "The Parallels",      yieldEst: "—", ltvRange: "—", note: "Airtable pending" },
  p4: { projectName: "Atelier Saigon",     yieldEst: "—", ltvRange: "—", note: "Airtable pending" },
  p5: { projectName: "Heritage Grove",     yieldEst: "—", ltvRange: "—", note: "Airtable pending" },
  p6: { projectName: "Celestine Tower",    yieldEst: "—", ltvRange: "—", note: "Airtable pending" },
};

// ── Scoring constants — used by interaction scoring engine ───────────────
// n8n uses interaction_score to prioritise lead follow-up
export const SCORE_WEIGHTS = {
  EQUITY_SELECTED:       5,
  NEED_SELECTED:         5,
  STAGE_SELECTED:        5,
  KNOWLEDGE_LOCK_VIEWED: 25,
  JOURNAL_VIEWED:        10,
  QUICK_ENTRY_SUBMIT:    20,
  FORM_SUBMIT:           50,
};

// ── Pillars & stages config ──────────────────────────────────────────────
export const PILLARS = [
  { val: "an_cu",           titleKey: "pillar_1_title", subKey: "pillar_1_sub" },
  { val: "dau_tu",          titleKey: "pillar_2_title", subKey: "pillar_2_sub" },
  { val: "toa_do_du_phong", titleKey: "pillar_3_title", subKey: "pillar_3_sub" },
];

export const STAGES = [
  { val: "children_growing", titleKey: "stage_1_title", subKey: "stage_1_sub" },
  { val: "children_grown",   titleKey: "stage_2_title", subKey: "stage_2_sub" },
  { val: "enjoying_privacy", titleKey: "stage_3_title", subKey: "stage_3_sub" },
];
