// ══════════════════════════════════════════════════════════════════════════
// data/i18n.js — THE HERITAGE PATH v5
// ALL user-facing strings live here. NO inline strings in JSX.
// Groups: nav · gate · hero · quick_entry · about · search · pillars ·
//         stages · collections · knowledge_* · glossary_* ·
//         advisor_* · journal · concierge · errors · footer
// ══════════════════════════════════════════════════════════════════════════

export const i18n = {

  // ════════════════════════════════════════════════════════════════
  // VIETNAMESE — Hồn Việt copy (v5 Final)
  // ════════════════════════════════════════════════════════════════
  vi: {
    // ── Nav ────────────────────────────────────────────────────────
    nav_about:       "Giới thiệu về Lộc",
    nav_collections: "Dự án",
    nav_journal:     "Habitus Journal",
    nav_concierge:   "Tư vấn riêng",

    // ── Gatekeeper ──────────────────────────────────────────────────
    gate_mark:      "✦ Private Collection ✦",
    gate_brand:     "The Heritage Path",
    gate_manifesto: "Một tài sản đúng nghĩa luôn phản chiếu con người sở hữu nó. Việc chọn một nơi ở không bắt đầu từ dự án, mà từ cách dòng tiền được vận hành và những giá trị gia đình bạn muốn gìn giữ.",
    gate_vi:        "Tiếng Việt",
    gate_en:        "English",
    gate_vi_sub:    "Vietnamese",
    gate_en_sub:    "Tiếng Anh",

    // ── Hero ────────────────────────────────────────────────────────
    hero_label:    "Dinh thự · Di sản · Thế hệ",
    hero_headline: "Mười năm nữa,\ncon bạn sẽ nhớ về\nnơi mình lớn lên\nra sao?",
    hero_sub:      "Không chỉ là chọn một căn nhà. Đây là lúc định hình cách một gia đình sẽ sống và tiếp nối.",
    hero_cta:      "Tìm hiểu về Lộc",
    hero_cta2:     "Nhận tư vấn riêng",
    hero_hint:     "Nếu bạn chưa rõ mình đang tìm điều gì, hãy bắt đầu với vài lựa chọn bên dưới. Chỉ mất khoảng một phút.",
    hero_scroll:   "Cuộn xuống",

    // ── Quick Entry (new in v5) ──────────────────────────────────────
    quick_label:   "Bắt đầu ngay",
    quick_title:   "Điều nhiều người không để ý",
    quick_sub:     "Sức mua thực của bạn có thể cao hơn bạn nghĩ. Để lại thông tin — chúng tôi sẽ tính toán và gửi lại một phân tích ngắn trong 24 giờ.",
    quick_name:    "Họ và tên",
    quick_phone:   "Số điện thoại",
    quick_submit:  "Nhận phân tích miễn phí",
    quick_sending: "Đang gửi…",
    quick_success: "Đã nhận. Chúng tôi sẽ gửi phân tích trong 24 giờ.",
    quick_note:    "Không spam. Không gọi lại nếu bạn không muốn.",

    // ── About ───────────────────────────────────────────────────────
    about_label:        "Về Lộc",
    about_title:        "Một quyết định đầu tư đúng thường không bắt đầu từ hình ảnh hào nhoáng. Nó bắt đầu từ việc hiểu rõ cách sống của gia đình bạn và cách dòng tiền cần được vận hành.",
    about_trust:        "Không phải một đơn vị môi giới, đây là nơi bạn có thể tìm thấy sự tin cậy, được xây dựng từ sự cẩn trọng và tận tâm trong từng lựa chọn.",
    about_p1_bold:      "Ngành đồng hồ xa xỉ cho tôi một bài học quan trọng.",
    about_p1_body:      "Khách hàng không chỉ chọn sản phẩm. Điều họ thực sự đặt vào đó là niềm tin vào người đứng phía sau.",
    about_p2_bold:      "Không cần nói nhiều về những giao dịch đã qua.",
    about_p2_body:      "Điều đáng giá hơn là những lần được lắng nghe và nhìn thấy sự yên tâm khi tài sản được giữ vững theo thời gian. Tại IQI Global, chúng tôi nhận tối đa 5 hồ sơ gia đình mới mỗi quý — chỉ đề xuất tài sản tôi sẵn sàng đặt tiền nhà vào.",
    about_closing:      "Nếu có điều gì khiến bạn còn băn khoăn, đó chính là điều nên bắt đầu.",
    about_filter_hint:  "Dành một phút để chọn vài sự ưu tiên, bạn sẽ thấy những lựa chọn đáng cân nhắc rõ ràng hơn.",
    about_cta:          "Bắt đầu lựa chọn",

    // ── Bespoke Search ──────────────────────────────────────────────
    search_label:  "Bộ lọc cá nhân",
    search_title:  "Điều bạn đang quan tâm nhất là gì",
    search_equity: "Vốn tự có",
    search_stage:  "Giai đoạn cuộc sống",

    // Equity advisor note template — {equity} and {power} injected at runtime
    equity_advisor_note_vi:
      "Với vốn tự có {equity} tỷ, anh/chị có thể kiểm soát danh mục trị giá đến {power} tỷ — thay vì mua đứt một tài sản duy nhất.",
    equity_advisor_note_unlimited_vi:
      "Ở ngưỡng này, đòn bẩy không phải ưu tiên hàng đầu — lựa chọn tài sản và cấu trúc danh mục mới là điều cần bàn.",

    // ── Pillars ─────────────────────────────────────────────────────
    pillar_1_title: "Dấu ấn cá nhân",
    pillar_1_sub:   "Không gian sống phản ánh những gì bạn đã xây dựng",
    pillar_2_title: "Sự tiếp nối",
    pillar_2_sub:   "Giá trị được gìn giữ và truyền lại qua nhiều thế hệ",
    pillar_3_title: "Sự an tâm",
    pillar_3_sub:   "Một tài sản giữ vững giá trị theo thời gian",

    // ── Life Stages ─────────────────────────────────────────────────
    stage_1_title: "Con cái đang lớn",
    stage_1_sub:   "Thời điểm định hình môi trường sống và giá trị cho con",
    stage_2_title: "Con đã trưởng thành",
    stage_2_sub:   "Giai đoạn nghĩ đến sự tiếp nối dài lâu",
    stage_3_title: "Khoảng riêng của mình",
    stage_3_sub:   "Một không gian đủ tĩnh để tận hưởng theo cách riêng",

    // ── Collections ─────────────────────────────────────────────────
    col_label:   "Danh mục",
    col_title:   "Các lựa chọn",
    col_sub:     "Mỗi dự án là một lời đáp cho một nhu cầu cụ thể.",
    col_none:    "Chưa có lựa chọn phù hợp.",
    col_reset:   "Xem tất cả",
    match_badge: "Phù hợp với bạn",
    col_learn:   "Tìm hiểu thêm",

    // ── Knowledge Lock / Payment Strategy ──────────────────────────
    knowledge_label:                  "Chiến lược thanh toán khôn ngoan",
    knowledge_title:                  "Cách đi phù hợp với lựa chọn của bạn",
    knowledge_teaser_heading:         "Những lựa chọn đáng chú ý",
    knowledge_teaser_sub:             "Các tài sản phù hợp với tiêu chí bạn đã chọn.",
    knowledge_cta:                    "Xem phân tích dòng tiền",
    knowledge_cta_sub:                "Dựa trên thông tin bạn cung cấp, sẽ có một hướng đi riêng phù hợp hơn với gia đình.",
    knowledge_no_filter:              "Hãy chọn ít nhất một tiêu chí để xem nội dung phù hợp.",
    knowledge_no_filter_sub:          "Chỉ mất khoảng một phút.",

    // 5-year lock overlay
    knowledge_5yr_lock_label:         "Kịch bản 5 năm",
    knowledge_5yr_lock_hint:          "Để xem dự phóng dòng tiền đầy đủ, vui lòng để lại thông tin bên dưới.",
    knowledge_5yr_unlock_hint:        "Đã mở khóa. Kịch bản bên dưới được cá nhân hóa theo lựa chọn của bạn.",
    knowledge_5yr_year_label:         "Năm",
    knowledge_5yr_value_label:        "Giá trị tài sản (ước tính)",
    knowledge_5yr_cashflow_label:     "Dòng tiền tích lũy (ước tính)",
    knowledge_5yr_placeholder:        "— Mở khóa để xem —",

    knowledge_payment_section_label:  "Chiến lược vốn",
    knowledge_payment_strategy_label: "Gợi ý phù hợp",
    knowledge_payment_reverse_label:  "Điều thường bị bỏ qua",

    knowledge_payment_title_default:          "Cách phân bổ vốn phù hợp",
    knowledge_payment_title_dau_tu:           "Tối ưu dòng tiền khi đầu tư",
    knowledge_payment_title_an_cu:            "Cách thanh toán khi mua để ở",
    knowledge_payment_title_toa_do_du_phong:  "Giữ sự linh hoạt cho tài sản dự phòng",

    knowledge_payment_body_default:
      "Cách phân bổ vốn nên bắt đầu từ mục tiêu của gia đình. Trước khi quyết định, hãy xác định rõ phần vốn có thể dùng, mức chấp nhận rủi ro và nhu cầu thanh khoản.",
    knowledge_payment_body_dau_tu_any:
      "Với mục tiêu đầu tư, điều quan trọng là không để vốn nằm yên quá nhiều. Giữ một phần vốn tự có và sử dụng thêm đòn bẩy giúp dòng tiền linh hoạt hơn và mở cửa cho cơ hội kế tiếp.",
    knowledge_payment_body_an_cu_any:
      "Khi mua để ở, điều nên ưu tiên là sự ổn định lâu dài. Giữ lại một phần vốn cho những chi phí phát sinh thường sẽ hợp lý hơn là dồn toàn bộ vào tài sản.",
    knowledge_payment_body_toa_do_du_phong_any:
      "Với tài sản dự phòng, sự linh hoạt luôn quan trọng. Không nên để toàn bộ vốn bị giữ lại trong một tài sản duy nhất — mất đi sự sẵn sàng chính là mất đi bản chất của tài sản dự phòng.",

    knowledge_payment_miss_default:
      "Cách thanh toán có thể ảnh hưởng đến kết quả sau nhiều năm, đôi khi còn quan trọng hơn việc chọn dự án.",
    knowledge_payment_miss_dau_tu:
      "Giữ lại dòng tiền để mở rộng thêm lựa chọn thường mang lại giá trị lâu dài hơn là dồn toàn bộ vào một tài sản duy nhất.",
    knowledge_payment_miss_an_cu:
      "Thanh toán nhanh chưa chắc là lựa chọn phù hợp nếu vẫn còn những mục tiêu tài chính khác cần cân nhắc.",
    knowledge_payment_miss_toa_do_du_phong:
      "Một tài sản dự phòng nên giữ được sự sẵn sàng, thay vì chôn toàn bộ nguồn vốn.",

    // ── Glossary definitions ────────────────────────────────────────
    glossary_habitus_def:
      "Hệ giá trị được hình thành từ nếp sống, thẩm mỹ và sự giáo dưỡng của một tầng lớp.",
    glossary_old_money_def:
      "Sự thịnh vượng được tiếp nối qua nhiều thế hệ, nơi giá trị gia đình quan trọng hơn sự phô trương.",
    glossary_cultural_capital_def:
      "Những tri thức, kỹ năng và phong cách sống tạo nên uy tín cá nhân vượt xa giá trị tài chính.",
    glossary_legacy_def:
      "Giá trị truyền đời. Thứ ở lại sau quyết định hôm nay.",
    glossary_portfolio_def:
      "Danh mục tài sản được sắp xếp có chủ đích để bảo toàn và tăng trưởng.",
    glossary_aria_label: "Giải thích thuật ngữ",
    glossary_close:      "Đóng",

    // ── Advisor ──────────────────────────────────────────────────────
    advisor_label:        "Nhận định chuyên gia",
    advisor_why_fit:      "Vì sao phù hợp",
    advisor_why_not:      "Điều cần cân nhắc thêm",
    advisor_default_fit:
      "Chúng tôi không gợi ý vội. Mỗi gia đình có một hành trình riêng — nên bắt đầu bằng câu hỏi thật sự của mình.",
    advisor_an_cu_fit:
      "Với mục tiêu an cư, chúng tôi ưu tiên thiết kế và hệ giá trị cộng đồng hơn quy mô.",
    advisor_an_cu_b1_fit:
      "Ở ngưỡng này, giá trị nằm trong sự tinh tế của thiết kế — không phải diện tích.",
    advisor_an_cu_b1_not:
      "Các dự án tầm vóc lớn hơn chưa phải lúc này — nhưng không có nghĩa là phải đánh đổi sự sang trọng.",
    advisor_an_cu_b2_fit:
      "Ngân sách này mở ra những lựa chọn kiến trúc thực sự khác biệt. Ưu tiên là dự án thấp tầng.",
    advisor_an_cu_b3_fit:
      "Ở ngưỡng này, giá trị vượt ra ngoài bất động sản đơn thuần: cộng đồng, cảnh quan, và lịch sử địa điểm.",
    advisor_dau_tu_fit:
      "Bảo chứng giá trị lâu dài đòi hỏi sự kiên nhẫn. Chúng tôi gợi ý những dự án có quỹ đất hữu hạn.",
    advisor_dau_tu_b1_fit:
      "Ngưỡng này vẫn có thể xây dựng bảo chứng tài chính — nếu chọn đúng tài sản khan hiếm và đặt đúng chu kỳ.",
    advisor_dau_tu_b1_not:
      "Kỳ vọng thanh khoản ngay lập tức cần được quản lý thực tế. Chúng tôi gợi ý tiếp cận theo chiến lược phân kỳ.",
    advisor_dau_tu_b2_fit:
      "Đây là vùng ngân sách ổn định nhất qua các chu kỳ thị trường. Thanh khoản tốt, ít biến động.",
    advisor_dau_tu_b3_fit:
      "Ở ngưỡng cao, chúng tôi chỉ gợi ý tài sản có tính khan hiếm thực sự. Đây là sự tiếp nối cho thế hệ sau.",
    advisor_tod_fit:
      "Tọa độ dự phòng là sự chuẩn bị có chủ đích. Giá trị nằm ở tính thanh khoản và khả năng bảo toàn vốn.",
    advisor_tod_b1_fit:
      "Một căn hộ vị trí trung tâm ở ngưỡng này mang lại sự an tâm thực tế nhất. Dễ thanh khoản, dễ duy trì.",
    advisor_tod_b1_not:
      "Nếu kỳ vọng là tài sản tự vận hành hoàn toàn, có thể cần điều chỉnh ngân sách.",
    advisor_tod_b2_fit:
      "Ngưỡng lý tưởng để sở hữu một tọa độ vừa có giá trị lưu trú vừa sinh lời song song.",
    advisor_tod_b3_fit:
      "Ở ngưỡng này, tọa độ dự phòng có thể là tài sản hoàn chỉnh — tự vận hành và truyền lại nguyên vẹn.",

    // ── Journal ──────────────────────────────────────────────────────
    jour_label:          "Góc nhìn & kiến thức",
    jour_title:          "Habitus Journal",
    jour_habitus_gloss:  "Sự tương đồng về lối sống",
    jour_sub:            "Giải mã những quy tắc không thành văn của tầng lớp thượng lưu.",
    jour_read:           "Đọc tiếp",
    jour_legacy_gloss:   "Giá trị truyền đời",

    // ── Concierge ────────────────────────────────────────────────────
    con_label:      "Cuộc trao đổi riêng",
    con_title:      "Nhận tư vấn cá nhân",
    con_sub:        "Không cần thuyết phục. Chỉ cần đúng người, đúng nhu cầu.",
    con_name:       "Họ và tên",
    con_phone:      "Số điện thoại",
    con_email:      "Email (không bắt buộc)",
    con_message:    "Điều bạn đang quan tâm (không bắt buộc)",
    con_time:       "Thời điểm phù hợp",
    con_morning:    "Buổi sáng",
    con_afternoon:  "Buổi chiều",
    con_evening:    "Buổi tối",
    con_context:    "Lựa chọn của bạn",
    con_project:    "Dự án đang xem",
    con_submit:     "Bắt đầu trao đổi",
    con_sending:    "Đang gửi",
    con_success_h:  "Đã nhận thông tin.",
    con_success_b:  "Sẽ liên hệ lại theo thời điểm bạn chọn.",
    con_quote:      "Những điều giá trị\nhiếm khi xuất hiện công khai.",

    // ── Errors ───────────────────────────────────────────────────────
    errors_phone_invalid:    "Số điện thoại chưa đúng định dạng.",
    errors_not_enough_depth: "Hãy chọn thêm một tiêu chí để nội dung phù hợp hơn.",
    errors_generic:          "Có lỗi xảy ra. Vui lòng thử lại.",
    errors_time_required:    "Vui lòng chọn thời điểm.",

    // ── Footer ───────────────────────────────────────────────────────
    footer_sub:     "Dành cho những gia đình nghĩ xa hơn một thế hệ.",
    footer_copy:    "© 2026 The Heritage Path. Mọi quyền được bảo lưu.",
    footer_curated: "Dành cho những gia đình sống có định hướng.",
  },

  // ════════════════════════════════════════════════════════════════
  // ENGLISH
  // ════════════════════════════════════════════════════════════════
  en: {
    // ── Nav ────────────────────────────────────────────────────────
    nav_about:       "About Lộc",
    nav_collections: "Collections",
    nav_journal:     "Habitus Journal",
    nav_concierge:   "Private Consultation",

    // ── Gatekeeper ──────────────────────────────────────────────────
    gate_mark:      "✦ Private Collection ✦",
    gate_brand:     "The Heritage Path",
    gate_manifesto: "A truly worthy asset reflects its owner. Choosing where to live does not begin with a project — it begins with how your capital is managed and what values your family wishes to preserve.",
    gate_vi:        "Tiếng Việt",
    gate_en:        "English",
    gate_vi_sub:    "Vietnamese",
    gate_en_sub:    "Tiếng Anh",

    // ── Hero ────────────────────────────────────────────────────────
    hero_label:    "Residence · Legacy · Generation",
    hero_headline: "In ten years,\nhow will your children\nremember the home\nthey grew up in?",
    hero_sub:      "This is not simply about choosing a home. It is about defining how a family will live — and what it will pass forward.",
    hero_cta:      "About Lộc",
    hero_cta2:     "Begin a conversation",
    hero_hint:     "If you are not yet sure what you are looking for, start with a few choices below. It only takes a minute.",
    hero_scroll:   "Scroll",

    // ── Quick Entry ──────────────────────────────────────────────────
    quick_label:   "Start here",
    quick_title:   "What most people miss",
    quick_sub:     "Your real purchasing power may be significantly higher than you think. Leave your details — we will send a brief analysis within 24 hours.",
    quick_name:    "Full name",
    quick_phone:   "Phone number",
    quick_submit:  "Receive free analysis",
    quick_sending: "Sending…",
    quick_success: "Received. We will send your analysis within 24 hours.",
    quick_note:    "No spam. No calls unless you want them.",

    // ── About ───────────────────────────────────────────────────────
    about_label:        "About Lộc",
    about_title:        "A sound investment decision rarely begins with glossy images. It begins with understanding how your family lives and how your capital needs to work.",
    about_trust:        "This is not a brokerage. It is a place to find genuine trust — built through care and attention in every decision.",
    about_p1_bold:      "The luxury watch industry gave me an important lesson.",
    about_p1_body:      "Clients do not simply choose a product. What they truly place in it is trust in the person standing behind it.",
    about_p2_bold:      "There is no need to speak of past transactions.",
    about_p2_body:      "What matters more is the quiet reassurance on a family's face when their wealth is held steady over time. At IQI Global, we accept a maximum of five new family mandates per quarter — and only recommend assets I would stake my own capital on.",
    about_closing:      "If there is something still troubling you after reading this — that is exactly where to begin.",
    about_filter_hint:  "Spend one minute selecting your priorities and the right choices will become much clearer.",
    about_cta:          "Begin selecting",

    // ── Bespoke Search ──────────────────────────────────────────────
    search_label:  "Personal filter",
    search_title:  "What matters most to you",
    search_equity: "Available equity",
    search_stage:  "Life stage",

    equity_advisor_note_vi:
      "With {equity}B in equity, you can control a portfolio worth up to {power}B — rather than purchasing a single asset outright.",
    equity_advisor_note_unlimited_vi:
      "At this level, leverage is not the priority — asset selection and portfolio structure are the conversation to have.",

    // ── Pillars ─────────────────────────────────────────────────────
    pillar_1_title: "Personal achievement",
    pillar_1_sub:   "A home that reflects what you have built",
    pillar_2_title: "Continuity",
    pillar_2_sub:   "Value preserved and passed through generations",
    pillar_3_title: "Peace of mind",
    pillar_3_sub:   "An asset that holds its value over time",

    // ── Life Stages ─────────────────────────────────────────────────
    stage_1_title: "Children still growing",
    stage_1_sub:   "The moment to shape living environment and values",
    stage_2_title: "Children now grown",
    stage_2_sub:   "The phase for thinking about long-term continuity",
    stage_3_title: "Personal space",
    stage_3_sub:   "A space quiet enough to enjoy on your own terms",

    // ── Collections ─────────────────────────────────────────────────
    col_label:   "Portfolio",
    col_title:   "The Collections",
    col_sub:     "Each project is an answer to a specific need.",
    col_none:    "No matching options yet.",
    col_reset:   "View all",
    match_badge: "Suited to you",
    col_learn:   "Learn more",

    // ── Knowledge Lock / Payment Strategy ──────────────────────────
    knowledge_label:                  "Smart payment strategy",
    knowledge_title:                  "The approach suited to your selection",
    knowledge_teaser_heading:         "Notable options",
    knowledge_teaser_sub:             "Properties aligned with your selected criteria.",
    knowledge_cta:                    "View cashflow analysis",
    knowledge_cta_sub:                "Based on your profile, a tailored direction will be prepared for your family.",
    knowledge_no_filter:              "Select at least one criterion to see relevant content.",
    knowledge_no_filter_sub:          "It only takes a minute.",

    knowledge_5yr_lock_label:         "5-Year Scenario",
    knowledge_5yr_lock_hint:          "To view the full cashflow projection, please leave your details below.",
    knowledge_5yr_unlock_hint:        "Unlocked. The scenario below is personalised to your selections.",
    knowledge_5yr_year_label:         "Year",
    knowledge_5yr_value_label:        "Asset value (estimated)",
    knowledge_5yr_cashflow_label:     "Cumulative cashflow (estimated)",
    knowledge_5yr_placeholder:        "— Unlock to view —",

    knowledge_payment_section_label:  "Capital strategy",
    knowledge_payment_strategy_label: "Recommended approach",
    knowledge_payment_reverse_label:  "What is often overlooked",

    knowledge_payment_title_default:          "The right capital allocation",
    knowledge_payment_title_dau_tu:           "Optimising cashflow for investment",
    knowledge_payment_title_an_cu:            "Payment approach for a family home",
    knowledge_payment_title_toa_do_du_phong:  "Keeping flexibility in a strategic reserve",

    knowledge_payment_body_default:
      "Capital allocation should start from the family's goals. Before deciding, clarify the available capital, risk tolerance, and liquidity needs.",
    knowledge_payment_body_dau_tu_any:
      "For investment, the key is not letting capital sit idle. Maintaining a portion as equity and adding leverage keeps cashflow flexible and opens the door to the next opportunity.",
    knowledge_payment_body_an_cu_any:
      "When buying to live in, long-term stability is the priority. Retaining a buffer for unforeseen expenses is usually wiser than committing all capital to the asset.",
    knowledge_payment_body_toa_do_du_phong_any:
      "For a strategic reserve, flexibility is always paramount. Locking all capital into a single asset defeats the purpose — readiness is the asset's core value.",

    knowledge_payment_miss_default:
      "The payment decision often affects outcomes over many years — sometimes more than the property selection itself.",
    knowledge_payment_miss_dau_tu:
      "Retaining cashflow to expand options usually delivers more long-term value than concentrating all capital in a single asset.",
    knowledge_payment_miss_an_cu:
      "Paying quickly is not always the right choice if other financial goals still need to be considered.",
    knowledge_payment_miss_toa_do_du_phong:
      "A reserve asset should maintain readiness — not have all its capital locked away.",

    // ── Glossary definitions ────────────────────────────────────────
    glossary_habitus_def:
      "A system of values shaped by lifestyle, aesthetics, and the upbringing of a social class.",
    glossary_old_money_def:
      "Wealth passed through multiple generations, where family values matter more than display.",
    glossary_cultural_capital_def:
      "Knowledge, skills, and refined lifestyle that create personal prestige far beyond financial value.",
    glossary_legacy_def:
      "Value that endures. What remains after today's decision.",
    glossary_portfolio_def:
      "A deliberately curated collection of assets designed for preservation and growth.",
    glossary_aria_label: "Term explanation",
    glossary_close:      "Close",

    // ── Advisor ──────────────────────────────────────────────────────
    advisor_label:        "Expert insight",
    advisor_why_fit:      "Why this fits",
    advisor_why_not:      "Worth considering",
    advisor_default_fit:
      "We do not recommend in haste. Every family has a different journey.",
    advisor_an_cu_fit:
      "For refined living, we prioritise design and community over scale.",
    advisor_an_cu_b1_fit:
      "At this range, value lies in design sophistication — not footprint.",
    advisor_an_cu_b1_not:
      "Larger-scale developments are not yet the right fit — but refinement need not be sacrificed.",
    advisor_an_cu_b2_fit:
      "This range opens truly distinctive architectural choices. Focus: low-rise quality over density.",
    advisor_an_cu_b3_fit:
      "At this level, value extends beyond the property — community, landscape, and the history of the address.",
    advisor_dau_tu_fit:
      "Long-term value preservation requires patience. Projects with limited land supply in sustainable cycles.",
    advisor_dau_tu_b1_fit:
      "Legacy investment is still achievable — with the right scarce asset at the right market timing.",
    advisor_dau_tu_b1_not:
      "Expectations of immediate liquidity need to be managed. A phased approach is recommended.",
    advisor_dau_tu_b2_fit:
      "The most stable investment range across market cycles. Good liquidity, low volatility.",
    advisor_dau_tu_b3_fit:
      "At this level, only assets of genuine scarcity — irreproducible in location or design.",
    advisor_tod_fit:
      "A strategic reserve is intentional preparation. Value lies in liquidity and capital preservation.",
    advisor_tod_b1_fit:
      "A centrally located apartment provides the most practical security. Easy liquidity.",
    advisor_tod_b1_not:
      "If full self-operation is expected, budget adjustment or co-ownership may be worth exploring.",
    advisor_tod_b2_fit:
      "An ideal range to hold an asset serving both residency and investment simultaneously.",
    advisor_tod_b3_fit:
      "At this level, a strategic reserve can be a complete, self-sustaining, inheritable asset.",

    // ── Journal ──────────────────────────────────────────────────────
    jour_label:          "Perspective & knowledge",
    jour_title:          "Habitus Journal",
    jour_habitus_gloss:  "Shared ways of living",
    jour_sub:            "Decoding the unwritten rules of refined culture.",
    jour_read:           "Read more",
    jour_legacy_gloss:   "Inheritance that outlives you",

    // ── Concierge ────────────────────────────────────────────────────
    con_label:      "A private conversation",
    con_title:      "Personal consultation",
    con_sub:        "No persuasion needed. Just the right person and the right need.",
    con_name:       "Full name",
    con_phone:      "Phone number",
    con_email:      "Email (optional)",
    con_message:    "What is on your mind (optional)",
    con_time:       "Preferred time",
    con_morning:    "Morning",
    con_afternoon:  "Afternoon",
    con_evening:    "Evening",
    con_context:    "Your selection",
    con_project:    "Currently viewing",
    con_submit:     "Begin the conversation",
    con_sending:    "Sending",
    con_success_h:  "Information received.",
    con_success_b:  "We will be in touch at the time you selected.",
    con_quote:      "The most valuable things\nrarely appear in public.",

    // ── Errors ───────────────────────────────────────────────────────
    errors_phone_invalid:    "Please enter a valid phone number.",
    errors_not_enough_depth: "Please select one more criterion for better-matched content.",
    errors_generic:          "Something went wrong. Please try again.",
    errors_time_required:    "Please select a preferred time.",

    // ── Footer ───────────────────────────────────────────────────────
    footer_sub:     "For families who think beyond one generation.",
    footer_copy:    "© 2026 The Heritage Path. All rights reserved.",
    footer_curated: "For families who live with intention.",
  },
};
