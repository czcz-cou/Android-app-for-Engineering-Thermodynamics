/* 工热刷题宝 v3.6 — iOS App Store Liquid Glass, 120fps GPU Morph & Ch12 Proof Special */
(function () {
  "use strict";

  const QUESTIONS = window.THERMO_QUESTIONS || [];
  const FORMULAS = window.THERMO_FORMULAS || [];
  const ic = window.ic || function () { return ""; };
  const Q_MAP = {};
  QUESTIONS.forEach((q) => {
    Q_MAP[q.id] = q;
  });

  const CH12_PROOF_IDS = [
    "ch12_think_09",
    "ch12_think_12",
    "ch12_ext_02",
    "ch12_ext_08",
    "ch12_ext_09",
    "ch12_ext_11",
    "ch12_ext_13",
    "pool_187",
    "pool_200",
    "pool_263",
    "pool_264",
    "pool_268",
    "pool_269",
    "exam_10"
  ];

  const SECTION_SHORT_LABELS = {
    ch10_think: "10.1 思考题",
    ch10_ext: "10.2 拓展题",
    ch11_think: "11.1 思考题",
    ch11_ext: "11.2 拓展题",
    ch12_think: "12.1 思考题",
    ch12_ext: "12.2 拓展题",
    pool_choice: "考题池 · 选择",
    pool_blank: "考题池 · 填空",
    pool_qa: "考题池 · 问答",
    pool_calc: "考题池 · 计算证明",
    pool_draw: "考题池 · 作图",
    exam_paper: "全真模拟卷"
  };

  const SECTIONS_META = [
    {
      group: "重点专题",
      sub: "跨章高频考点精编",
      layout: "stack",
      items: [
        {
          id: "special_ch12_proof",
          code: "证明专题",
          icon: "sigma",
          isSpecial: true,
          eyebrow: "重点专题 · 第 12 章热力学证明",
          title: "第 12 章热力学证明题（14 题）",
          sub: "跨全库归集第 12 章、考题池与模拟卷中的麦克斯韦关系、自由焓、范氏气体与热力学一般关系式证明推导题",
          questionIds: CH12_PROOF_IDS
        }
      ]
    },
    {
      group: "第 10 章",
      sub: "蒸汽动力装置循环",
      layout: "grid",
      items: [
        { id: "ch10_think", code: "10.1", eyebrow: "第 10 章 · 10.1", title: "思考题解析", sub: "朗肯循环、再热、混合/表面式回热与热电合供" },
        { id: "ch10_ext", code: "10.2", eyebrow: "第 10 章 · 10.2", title: "拓展题解析", sub: "给水加热器热平衡、朗肯/再热/核电循环计算" }
      ]
    },
    {
      group: "第 11 章",
      sub: "制冷循环",
      layout: "grid",
      items: [
        { id: "ch11_think", code: "11.1", eyebrow: "第 11 章 · 11.1", title: "思考题解析", sub: "逆卡诺、压缩空气/蒸气制冷、节流过冷与热泵" },
        { id: "ch11_ext", code: "11.2", eyebrow: "第 11 章 · 11.2", title: "拓展题解析", sub: "空气变比热制冷、R134a/氨制冷与吸收式 COP" }
      ]
    },
    {
      group: "第 12 章",
      sub: "实际气体性质及一般关系式",
      layout: "grid",
      items: [
        { id: "ch12_think", code: "12.1", eyebrow: "第 12 章 · 12.1", title: "思考题解析", sub: "压缩因子、范氏/维里方程、特征函数与麦克斯韦" },
        { id: "ch12_ext", code: "12.2", eyebrow: "第 12 章 · 12.2", title: "拓展题解析", sub: "R-K 方程、通用压缩因子图与克拉佩龙方程" }
      ]
    },
    {
      group: "附录考题池",
      sub: "分题型专项训练",
      layout: "stack",
      items: [
        { id: "pool_choice", code: "一", eyebrow: "考题池 · 一", title: "选择题（1–62 题）", sub: "概念辨析、湿空气 h-d 图、多变过程 T-s 图、喷管选型" },
        { id: "pool_blank", code: "二", eyebrow: "考题池 · 二", title: "填空题（63–81 题）", sub: "表压力、卡诺极限、混合熵、多级压缩、化学反应熵流" },
        { id: "pool_qa", code: "三", eyebrow: "考题池 · 三", title: "问答题（82–193 题）", sub: "112 道概念陷阱剖析、克劳修斯积分、㶲损、节流转回曲线" },
        { id: "pool_calc", code: "四", eyebrow: "考题池 · 四", title: "计算与证明题（194–284 题）", sub: "91 道综合大题：充放气、湿空气、压气机、动力与制冷循环" },
        { id: "pool_draw", code: "五", eyebrow: "考题池 · 五", title: "作图题（285–291 题）", sub: "T-s 图、p-v 图、h-d 图、lg p-h 图与不可逆传热㶲损标定" }
      ]
    },
    {
      group: "全真模拟",
      sub: "考前整卷自测",
      layout: "stack",
      items: [
        { id: "exam_paper", code: "卷", eyebrow: "全真模拟 · 150 分", title: "实测试卷（1–11 题）", sub: "判断辨析、过程作图、空气标准循环简化、回热、喷管与除湿" }
      ]
    }
  ];

  const TYPE_LABELS = {
    choice: "选择题",
    blank: "填空题",
    qa: "问答题",
    calc: "计算与证明",
    draw: "作图题"
  };

  const FONT_FAMILIES = {
    sans: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", sans-serif',
    serif: '"Songti SC", "Noto Serif CJK SC", "STSong", "SimSun", Georgia, serif',
    round: '"Hiragino Sans GB", "Yuanti SC", "HarmonyOS Sans SC", "PingFang SC", sans-serif'
  };

  const LINE_HEIGHTS = {
    compact: "1.48",
    normal: "1.68",
    relaxed: "1.88"
  };

  const STORAGE_KEY = "thermo_quiz_state_v1";

  let state = {
    uiRev: 30,
    theme: "light", // Strictly 3 themes: 'light' | 'dark' | 'auto'
    fontScale: 1.0,
    fontFamily: "sans",
    lineHeight: "normal",
    defaultMode: "quiz",
    defaultOrder: "seq",
    autoRemoveWrong: false,
    autoNextOnCorrect: false,
    hapticEnabled: true,
    records: {},
    favorites: {},
    notes: {},
    noteImages: {},
    todayDate: "",
    todayCount: 0,
    lastSession: null
  };

  let session = {
    open: false,
    title: "",
    eyebrow: "",
    sectionId: "",
    baseQueue: [],
    queue: [],
    order: "seq",
    index: 0,
    mode: "quiz",
    qStates: {}, // per-question { revealed, selectedChoice, tempBlanks }
    sourceCardId: null,
    sourceRect: null,
    unmasteredOnly: false
  };

  let currentMainTab = "home";
  let currentNbTab = "wrong";
  let currentNbFilter = "all";
  let currentSearchFilter = "all";
  let pzInstance = null;
  let lastBackPress = 0;
  let browserUploadTargetQid = null;
  const noteImgCache = {};

  let isMorphing = false;
  let carouselScrollRaf = 0;
  let carouselSettleTimer = null;
  let programmaticScrollUntil = 0;

  function hydrateStaticIcons() {
    document.querySelectorAll("[data-icon]").forEach((el) => {
      const name = el.getAttribute("data-icon");
      const cls = el.getAttribute("data-cls") || "";
      el.innerHTML = ic(name, cls);
    });
    const lbDock = document.getElementById("lightbox-dock");
    if (lbDock) {
      lbDock.innerHTML = `
        <button class="lb-btn" onclick="zoomLightbox(-0.4)">${ic("zoom-out", "ic-sm")}<span>缩小</span></button>
        <button class="lb-btn" onclick="resetLightboxZoom()">${ic("rotate-ccw", "ic-sm")}<span>1:1 复位</span></button>
        <button class="lb-btn" onclick="zoomLightbox(0.4)">${ic("zoom-in", "ic-sm")}<span>放大</span></button>
      `;
    }
    const sUnm = document.getElementById("sheet-btn-unmastered");
    const sAll = document.getElementById("sheet-btn-all");
    const sSet = document.getElementById("sheet-btn-goto-settings");
    if (sUnm) sUnm.innerHTML = `${ic("filter", "ic-xs")}<span>仅看未掌握</span>`;
    if (sAll) sAll.innerHTML = `${ic("layers", "ic-xs")}<span>显示全部</span>`;
    if (sSet) sSet.innerHTML = `${ic("settings", "ic-xs")}<span>设置顺序/模式</span>`;
  }

  /* ---------- Utilities ---------- */
  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function hasNativeBridge() {
    return !!(window.AppBridge && typeof window.AppBridge.loadState === "function");
  }

  function findSectionMeta(sectionId) {
    for (let g = 0; g < SECTIONS_META.length; g++) {
      const items = SECTIONS_META[g].items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === sectionId) return items[i];
      }
    }
    return null;
  }

  function getSectionQuestions(secOrId) {
    const sec = typeof secOrId === "string" ? findSectionMeta(secOrId) : secOrId;
    if (sec && Array.isArray(sec.questionIds)) {
      return sec.questionIds.map((id) => Q_MAP[id]).filter(Boolean);
    }
    const id = typeof secOrId === "string" ? secOrId : sec && sec.id;
    return id ? QUESTIONS.filter((q) => q.section === id) : [];
  }

  /* ---------- Persistence & Appearance (Strictly Light / Dark / Auto) ---------- */
  function loadState() {
    try {
      let raw = null;
      if (hasNativeBridge()) {
        raw = window.AppBridge.loadState();
      }
      if (!raw) {
        raw = localStorage.getItem(STORAGE_KEY);
      }
      if (raw) {
        const parsed = JSON.parse(raw);
        state = Object.assign(state, parsed);
        if (!["light", "dark", "auto"].includes(state.theme)) {
          state.theme = "light";
        }
        state.uiRev = 30;
        if (!state.noteImages || typeof state.noteImages !== "object") {
          state.noteImages = {};
        }
      }
    } catch (e) {
      console.warn("Load state error:", e);
    }
    const today = new Date().toISOString().slice(0, 10);
    if (state.todayDate !== today) {
      state.todayDate = today;
      state.todayCount = 0;
    }
    applyAppearance();
  }

  function saveState() {
    try {
      const raw = JSON.stringify(state);
      try {
        localStorage.setItem(STORAGE_KEY, raw);
      } catch (_) {}
      if (window.AppBridge && typeof window.AppBridge.saveState === "function") {
        window.AppBridge.saveState(raw);
      }
    } catch (e) {
      console.warn("Save state error:", e);
    }
  }

  function haptic(ms) {
    if (!state.hapticEnabled) return;
    try {
      if (window.AppBridge && typeof window.AppBridge.vibrate === "function") {
        window.AppBridge.vibrate(ms || 15);
      } else if (navigator.vibrate) {
        navigator.vibrate(ms || 15);
      }
    } catch (_) {}
  }

  function showToast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.remove("show"), 1900);
  }

  function resolveEffectiveTheme() {
    if (state.theme === "auto") {
      try {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } catch (_) {
        return "light";
      }
    }
    return state.theme === "dark" ? "dark" : "light";
  }

  function applyAppearance() {
    const effTheme = resolveEffectiveTheme();
    document.documentElement.setAttribute("data-theme", effTheme);
    document.documentElement.style.setProperty("--font-scale", String(state.fontScale || 1));
    document.documentElement.style.setProperty("--font-family", FONT_FAMILIES[state.fontFamily] || FONT_FAMILIES.sans);
    document.documentElement.style.setProperty("--line-height", LINE_HEIGHTS[state.lineHeight] || LINE_HEIGHTS.normal);

    if (window.AppBridge && typeof window.AppBridge.setThemeBar === "function") {
      try {
        if (effTheme === "dark") window.AppBridge.setThemeBar("#000000", false);
        else window.AppBridge.setThemeBar("#FFFFFF", true);
      } catch (_) {}
    }
  }

  try {
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      if (mq && mq.addEventListener) {
        mq.addEventListener("change", () => {
          if (state.theme === "auto") applyAppearance();
        });
      }
    }
  } catch (_) {}

  /* ---------- Rich Markdown + KaTeX Renderer ---------- */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderTeX(tex, displayMode) {
    if (window.katex) {
      try {
        return window.katex.renderToString(tex.trim(), {
          displayMode: displayMode,
          throwOnError: false,
          strict: false,
          trust: true
        });
      } catch (e) {
        return `<code>${escapeHtml(tex)}</code>`;
      }
    }
    return `<code>${escapeHtml(tex)}</code>`;
  }

  function parseMarkdownTable(lines) {
    if (lines.length < 2) return lines.join("<br/>");
    const parseRow = (line) =>
      line
        .trim()
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((c) => formatInlineMarkdown(c.trim()));

    const headers = parseRow(lines[0]);
    let startBody = 1;
    if (/^[\s|:-]+$/.test(lines[1])) {
      startBody = 2;
    }
    let html = '<div class="table-wrap"><table><thead><tr>';
    headers.forEach((h) => (html += `<th>${h}</th>`));
    html += "</tr></thead><tbody>";
    for (let i = startBody; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const cols = parseRow(lines[i]);
      html += "<tr>";
      cols.forEach((c) => (html += `<td>${c}</td>`));
      html += "</tr>";
    }
    html += "</tbody></table></div>";
    return html;
  }

  function formatInlineMarkdown(s) {
    return s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/_{3,}/g, '<span class="blank-slot">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
  }

  function renderRichText(raw) {
    if (!raw) return "";
    const mathTokens = [];
    let text = String(raw).replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => {
      const id = `@@MATH_D_${mathTokens.length}@@`;
      mathTokens.push({ id, html: renderTeX(tex, true) });
      return "\n" + id + "\n";
    });

    text = text.replace(/\$([^\$\n]+?)\$/g, (_, tex) => {
      const id = `@@MATH_I_${mathTokens.length}@@`;
      mathTokens.push({ id, html: renderTeX(tex, false) });
      return id;
    });

    text = escapeHtml(text);

    const lines = text.split(/\r?\n/);
    const outBlocks = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        i++;
        continue;
      }

      if (trimmed.startsWith("|") && trimmed.endsWith("|") && i + 1 < lines.length && lines[i + 1].trim().startsWith("|")) {
        const tblLines = [];
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          tblLines.push(lines[i]);
          i++;
        }
        outBlocks.push(parseMarkdownTable(tblLines));
        continue;
      }

      if (/^@@MATH_D_\d+@@$/.test(trimmed)) {
        outBlocks.push(trimmed);
        i++;
        continue;
      }

      if (/^[-•·]\s+/.test(trimmed)) {
        let ul = "<ul>";
        while (i < lines.length && /^[-•·]\s+/.test(lines[i].trim())) {
          ul += `<li>${formatInlineMarkdown(lines[i].trim().replace(/^[-•·]\s+/, ""))}</li>`;
          i++;
        }
        ul += "</ul>";
        outBlocks.push(ul);
        continue;
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        let ol = "<ol>";
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          ol += `<li>${formatInlineMarkdown(lines[i].trim().replace(/^\d+\.\s+/, ""))}</li>`;
          i++;
        }
        ol += "</ol>";
        outBlocks.push(ol);
        continue;
      }

      outBlocks.push(`<p>${formatInlineMarkdown(trimmed)}</p>`);
      i++;
    }

    let finalHtml = outBlocks.join("");
    for (let k = 0; k < mathTokens.length; k++) {
      finalHtml = finalHtml.split(mathTokens[k].id).join(mathTokens[k].html);
    }
    return finalHtml;
  }

  /* ---------- Note Image Storage & Upload ---------- */
  function resolveNoteImgSrc(item) {
    if (!item) return "";
    if (item.startsWith("data:image/")) return item;
    if (noteImgCache[item]) return noteImgCache[item];
    if (window.AppBridge && typeof window.AppBridge.getNoteImageDataUrl === "function") {
      try {
        const dataUrl = window.AppBridge.getNoteImageDataUrl(item);
        if (dataUrl) {
          noteImgCache[item] = dataUrl;
          return dataUrl;
        }
      } catch (_) {}
    }
    return "";
  }

  window.triggerNoteImageUpload = function (qid) {
    if (window.AppBridge && typeof window.AppBridge.pickNoteImage === "function") {
      window.AppBridge.pickNoteImage(qid);
    } else {
      browserUploadTargetQid = qid;
      const inp = document.getElementById("browser-note-img-input");
      inp.value = "";
      inp.click();
    }
  };

  window.onNativeNoteImagesAdded = function (qid, filenames) {
    if (!qid || !Array.isArray(filenames) || filenames.length === 0) return;
    if (!state.noteImages[qid]) state.noteImages[qid] = [];
    filenames.forEach((fn) => {
      if (fn && state.noteImages[qid].indexOf(fn) === -1) {
        state.noteImages[qid].push(fn);
      }
    });
    saveState();
    haptic(15);
    showToast(`已添加 ${filenames.length} 张笔记图片`);
    if (session.open) {
      const idx = session.queue.indexOf(qid);
      if (idx >= 0) renderSlideAt(idx, true);
    } else if (currentMainTab === "notebook") {
      renderNotebook();
    }
  };

  window.handleBrowserNoteFiles = function (inputEl) {
    const qid = browserUploadTargetQid;
    if (!qid || !inputEl.files || inputEl.files.length === 0) return;
    const files = Array.from(inputEl.files);
    let processed = 0;
    if (!state.noteImages[qid]) state.noteImages[qid] = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (ev) {
        const img = new Image();
        img.onload = function () {
          const maxDim = 1200;
          let w = img.width, h = img.height;
          if (w > maxDim || h > maxDim) {
            const scale = Math.min(maxDim / w, maxDim / h);
            w = Math.round(w * scale);
            h = Math.round(h * scale);
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          state.noteImages[qid].push(dataUrl);
          processed++;
          if (processed === files.length) {
            saveState();
            showToast(`已添加 ${files.length} 张笔记图片`);
            if (session.open) {
              const idx = session.queue.indexOf(qid);
              if (idx >= 0) renderSlideAt(idx, true);
            }
          }
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  window.deleteNoteImageItem = function (qid, imgIdx, event) {
    if (event) event.stopPropagation();
    const list = state.noteImages[qid];
    if (!list || imgIdx < 0 || imgIdx >= list.length) return;
    if (!window.confirm("确定删除这张笔记图片吗？")) return;

    const removed = list.splice(imgIdx, 1)[0];
    if (list.length === 0) delete state.noteImages[qid];
    if (removed && !removed.startsWith("data:image/")) {
      delete noteImgCache[removed];
      if (window.AppBridge && typeof window.AppBridge.deleteNoteImage === "function") {
        try {
          window.AppBridge.deleteNoteImage(removed);
        } catch (_) {}
      }
    }
    saveState();
    haptic(12);
    showToast("图片已删除");
    if (session.open) {
      const idx = session.queue.indexOf(qid);
      if (idx >= 0) renderSlideAt(idx, true);
    } else if (currentMainTab === "notebook") {
      renderNotebook();
    }
  };

  /* ---------- Stats & Home Rendering (App Store Today Style) ---------- */
  function getOverallStats() {
    let practiced = 0, mastered = 0, fuzzy = 0, wrong = 0, noteCount = 0;
    QUESTIONS.forEach((q) => {
      const r = state.records[q.id];
      if (r && r.status) {
        practiced++;
        if (r.status === "mastered") mastered++;
        else if (r.status === "fuzzy") fuzzy++;
        else if (r.status === "wrong") wrong++;
      }
      if ((state.notes[q.id] && state.notes[q.id].trim()) || (state.noteImages[q.id] && state.noteImages[q.id].length > 0)) {
        noteCount++;
      }
    });
    const favCount = Object.keys(state.favorites).filter((k) => state.favorites[k]).length;
    return { total: QUESTIONS.length, practiced, mastered, fuzzy, wrong, favCount, noteCount };
  }

  function updateBadges() {
    const st = getOverallStats();
    const badge = document.getElementById("wrong-nav-badge");
    const needReview = st.wrong + st.fuzzy;
    if (needReview > 0) {
      badge.style.display = "inline-flex";
      badge.textContent = needReview > 99 ? "99+" : String(needReview);
    } else {
      badge.style.display = "none";
    }
    const qrDesc = document.getElementById("quick-review-desc");
    if (qrDesc) {
      qrDesc.textContent = needReview > 0 ? `待攻克 ${needReview} 题` : "暂无待复习";
    }
  }

  function renderHome() {
    const st = getOverallStats();
    const pct = st.total ? Math.round((st.practiced / st.total) * 100) : 0;

    // Top-right mini circular progress ring
    const topBtn = document.getElementById("home-top-ring-btn");
    if (topBtn) {
      const rMini = 16;
      const cMini = 2 * Math.PI * rMini;
      const offMini = cMini - (pct / 100) * cMini;
      topBtn.innerHTML = `
        <svg class="header-ring-svg" viewBox="0 0 40 40">
          <circle class="header-ring-track" cx="20" cy="20" r="${rMini}"></circle>
          <circle class="header-ring-fill" cx="20" cy="20" r="${rMini}" stroke-dasharray="${cMini.toFixed(2)}" stroke-dashoffset="${offMini.toFixed(2)}"></circle>
        </svg>
        <span class="header-ring-text num-tab">${pct}%</span>`;
    }

    const radius = 32;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (pct / 100) * circ;
    const orderLabel = state.defaultOrder === "random" ? "随机刷题" : "顺序刷题";
    const orderIco = state.defaultOrder === "random" ? ic("shuffle", "ic-xs") : ic("list-ordered", "ic-xs");

    let footerKicker = "开始学习";
    let footerTitle = "第 10 章 · 思考题解析";
    let footerAction = "开始";
    let heroOnClick = "openSection('ch10_think', this)";
    if (state.lastSession && state.lastSession.queueIds && state.lastSession.queueIds.length > 0) {
      const ls = state.lastSession;
      const curNum = Math.min((ls.index || 0) + 1, ls.queueIds.length);
      footerKicker = `继续上次 · 第 ${curNum} / ${ls.queueIds.length} 题`;
      footerTitle = ls.title;
      footerAction = "继续";
      heroOnClick = "resumeLastSession(this)";
    }

    document.getElementById("hero-dashboard").innerHTML = `
      <div class="today-hero-card" data-card-id="hero_resume" onclick="${heroOnClick}">
        <div class="today-hero-cover">
          <div class="hero-top-row">
            <span class="hero-eyebrow">${ic("flame", "ic-xs")}<span>学习概览</span></span>
            <span class="hero-schedule-tag">${orderIco}<span>${orderLabel}</span></span>
          </div>
          <div class="hero-metrics-row">
            <div class="ring-wrap">
              <svg class="ring-svg" viewBox="0 0 78 78">
                <circle class="ring-track" cx="39" cy="39" r="${radius}"></circle>
                <circle class="ring-fill" cx="39" cy="39" r="${radius}" stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"></circle>
              </svg>
              <div class="ring-center num-tab">
                <span class="ring-pct">${pct}%</span>
                <span class="ring-lbl">总进度</span>
              </div>
            </div>
            <div class="hero-stats">
              <div class="hero-headline num-tab">
                <span><strong>${st.practiced}</strong>/ ${st.total} 题</span>
                <span>今日 ${state.todayCount} 题</span>
              </div>
              <div class="hero-tri-grid num-tab">
                <div class="stat-cell">
                  <div class="stat-val" style="color:var(--success);">${st.mastered}</div>
                  <div class="stat-lbl">已掌握</div>
                </div>
                <div class="stat-cell">
                  <div class="stat-val" style="color:var(--warn);">${st.fuzzy}</div>
                  <div class="stat-lbl">模糊</div>
                </div>
                <div class="stat-cell">
                  <div class="stat-val" style="color:var(--danger);">${st.wrong}</div>
                  <div class="stat-lbl">错题</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="today-hero-footer">
          <div class="hero-footer-info">
            <div class="hero-footer-kicker num-tab">${escapeHtml(footerKicker)}</div>
            <div class="hero-footer-title">${escapeHtml(footerTitle)}</div>
          </div>
          <span class="apple-action-pill">${footerAction}</span>
        </div>
      </div>
    `;

    const needReview = st.wrong + st.fuzzy;
    document.getElementById("quick-deck-strip").innerHTML = `
      <div class="quick-pill" data-card-id="quick_review" onclick="startSmartReview(this)">
        <div class="quick-pill-ico">${ic("zap")}</div>
        <div class="quick-pill-title">智能复习</div>
        <div class="quick-pill-sub num-tab" id="quick-review-desc">${needReview > 0 ? `待攻克 ${needReview} 题` : "暂无待复习"}</div>
      </div>
      <div class="quick-pill" data-card-id="quick_random" onclick="startRandomQuiz(20, this)">
        <div class="quick-pill-ico">${ic("shuffle")}</div>
        <div class="quick-pill-title">跨章抽测</div>
        <div class="quick-pill-sub">精选 20 题</div>
      </div>
      <div class="quick-pill" data-card-id="quick_exam" onclick="openSection('exam_paper', this)">
        <div class="quick-pill-ico">${ic("file-text")}</div>
        <div class="quick-pill-title">实测试卷</div>
        <div class="quick-pill-sub">150分全真卷</div>
      </div>
    `;

    let html = "";
    SECTIONS_META.forEach((grp) => {
      const containerCls = grp.layout === "grid" ? "deck-grid-2" : "deck-stack";
      html += `
        <div class="group-heading">
          <span>${escapeHtml(grp.group)}</span>
          <span class="group-heading-sub">${escapeHtml(grp.sub)}</span>
        </div>
        <div class="${containerCls}">`;

      grp.items.forEach((sec) => {
        const qs = getSectionQuestions(sec);
        let done = 0;
        qs.forEach((q) => {
          const r = state.records[q.id];
          if (r && r.status) done++;
        });
        const barPct = qs.length ? Math.round((done / qs.length) * 100) : 0;
        const wideCls = grp.layout === "stack" ? " wide" : "";
        const specialCls = sec.isSpecial ? " special-card" : "";
        const badgeIcon = sec.icon ? ic(sec.icon, "ic-xs") : "";
        html += `
          <div class="deck-card${wideCls}${specialCls}" data-card-id="sec_${sec.id}" onclick="openSection('${sec.id}', this)">
            <div class="deck-cover">
              <div class="deck-cover-top">
                <span class="deck-code-badge num-tab">${badgeIcon}<span>${escapeHtml(sec.code)}</span></span>
                <span class="deck-count-pill num-tab">${done}/${qs.length}</span>
              </div>
              <div class="deck-title">${escapeHtml(sec.title)}</div>
              <div class="deck-sub">${escapeHtml(sec.sub)}</div>
            </div>
            <div class="deck-foot">
              <div class="deck-prog-wrap">
                <div class="deck-prog-track"><div class="deck-prog-fill" style="width:${barPct}%"></div></div>
              </div>
              <span class="deck-open-lbl">练习${ic("chevron-right", "ic-xs")}</span>
            </div>
          </div>`;
      });
      html += `</div>`;
    });

    document.getElementById("syllabus-container").innerHTML = html;
    updateBadges();
  }

  /* ---------- Main Bottom Floating Dock Navigation ---------- */
  window.switchMainTab = function (tab) {
    currentMainTab = tab;
    document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
    const target = document.getElementById("tab-" + tab);
    if (target) target.classList.add("active");

    document.querySelectorAll("#floating-dock .nav-item").forEach((el) => {
      el.classList.toggle("active", el.getAttribute("data-tab") === tab);
    });

    if (tab === "home") renderHome();
    else if (tab === "notebook") renderNotebook();
    else if (tab === "formulas") renderFormulas();
    else if (tab === "search") renderSearchTab();
    else if (tab === "settings") renderSettingsPage();
  };

  /* ---------- Quiz Session & Card-to-Fullscreen Morph Transition ---------- */
  function getQuestionState(qid) {
    if (!session.qStates[qid]) {
      const q = Q_MAP[qid];
      const rec = state.records[qid];
      session.qStates[qid] = {
        revealed: session.mode === "recite",
        selectedChoice: null,
        tempBlanks: q && q.blanks ? q.blanks.map((_, idx) => (rec && rec.blankVals && rec.blankVals[idx]) || "") : []
      };
    }
    return session.qStates[qid];
  }

  function launchQuizQueue(title, eyebrow, baseIds, startIndex, sectionId, orderOverride, sourceEl) {
    if (!baseIds || baseIds.length === 0) {
      showToast("当前列表暂无题目");
      return;
    }
    if (isMorphing) return;

    const effectiveOrder = orderOverride || state.defaultOrder || "seq";
    session.open = true;
    session.title = title;
    session.eyebrow = eyebrow || (effectiveOrder === "random" ? "随机刷题" : "顺序刷题");
    session.sectionId = sectionId || "";
    session.baseQueue = baseIds.slice();
    session.order = effectiveOrder;
    session.queue = effectiveOrder === "random" ? shuffleArray(baseIds) : baseIds.slice();
    session.index = effectiveOrder === "random" ? 0 : Math.max(0, Math.min(startIndex || 0, session.queue.length - 1));
    session.mode = state.defaultMode;
    session.qStates = {};
    session.unmasteredOnly = false;
    session.sourceCardId = sourceEl ? sourceEl.getAttribute("data-card-id") : null;

    openQuizWithMorph(sourceEl);
    // Defer disk/localStorage write until after open transition so Frame 1 never blocks
    setTimeout(() => {
      if (session.open) persistSessionPointer();
    }, 360);
  }

  function computeOriginMotion(rect, vw, vh) {
    if (!rect) return { dx: 0, dy: 28, scale: 0.92 };
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.round((cx - vw / 2) * 0.22);
    const dy = Math.round((cy - vh / 2) * 0.34);
    const scale = rect.width > vw * 0.7 ? 0.92 : 0.86;
    return { dx, dy, scale };
  }

  function openQuizWithMorph(sourceEl) {
    const appEl = document.getElementById("app");
    const backdrop = document.getElementById("quiz-backdrop");
    const qv = document.getElementById("quiz-view");

    // 1. Measure source card BEFORE any DOM writes
    const canMorph = sourceEl && typeof sourceEl.getBoundingClientRect === "function";
    let rect = null;
    if (canMorph) {
      rect = sourceEl.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) rect = null;
    }

    // 2. Render ONLY the single active question synchronously; neighbors hydrate after animation
    buildQuizCarousel(true);
    updateQuizChrome();

    const vw = Math.max(window.innerWidth || 360, 1);
    const vh = Math.max(window.innerHeight || 640, 1);
    const motion = computeOriginMotion(rect, vw, vh);
    session.sourceRect = rect ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height } : null;

    isMorphing = true;
    qv.setAttribute("aria-hidden", "false");
    qv.style.transition = "none";
    qv.classList.remove("morph-entered");
    qv.classList.add("open", "is-morphing", "morph-entering");

    // Start at balanced origin-aware uniform scale (0.86~0.92) -> ZERO 0.42x crunch, ZERO clip-path CPU repaint, ZERO white hole!
    qv.style.opacity = "0";
    qv.style.transform = `translate3d(${motion.dx}px, ${motion.dy}px, 0) scale(${motion.scale})`;

    // Align active slide once at full viewport width
    scrollCarouselToIndex(session.index, false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        backdrop.classList.add("open");
        appEl.classList.add("behind-quiz");

        // Pure GPU Compositor-Thread ONLY (transform + fast opacity ramp so card turns solid immediately)
        qv.style.transition = "transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.14s ease-out";
        qv.style.transform = "translate3d(0px, 0px, 0) scale(1)";
        qv.style.opacity = "1";

        qv.classList.remove("morph-entering");
        qv.classList.add("morph-entered");

        setTimeout(() => {
          if (!session.open) return;
          qv.classList.remove("is-morphing");
          qv.style.cssText = "";
          isMorphing = false;
          // Hydrate neighbor slides AFTER 120fps GPU transition settles
          hydrateWindowAround(session.index);
        }, 340);
      });
    });
  }

  window.closeQuizView = function (skipTabRefresh) {
    if (!session.open || isMorphing) return;
    isMorphing = true;
    session.open = false;

    const appEl = document.getElementById("app");
    const backdrop = document.getElementById("quiz-backdrop");
    const qv = document.getElementById("quiz-view");

    const vw = Math.max(window.innerWidth || 360, 1);
    const vh = Math.max(window.innerHeight || 640, 1);
    const motion = computeOriginMotion(session.sourceRect, vw, vh);

    // Zero Home DOM rebuild before close! Pure GPU transform + opacity back toward tapped card origin!
    qv.style.transition = "none";
    qv.style.opacity = "1";
    qv.style.transform = "translate3d(0px, 0px, 0) scale(1)";
    qv.classList.add("is-morphing");

    appEl.classList.remove("behind-quiz");
    backdrop.classList.remove("open");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        qv.style.transition = "transform 0.25s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.18s ease-in 0.05s";
        qv.style.transform = `translate3d(${motion.dx}px, ${motion.dy}px, 0) scale(${motion.scale})`;
        qv.style.opacity = "0";

        setTimeout(() => {
          qv.classList.remove("open", "is-morphing", "morph-entering", "morph-entered");
          qv.setAttribute("aria-hidden", "true");
          qv.style.cssText = "";
          isMorphing = false;

          // Refresh underlying tab quietly AFTER close finishes -> zero close-frame jank!
          if (!skipTabRefresh) {
            if (currentMainTab === "home") renderHome();
            else if (currentMainTab === "notebook") renderNotebook();
            else if (currentMainTab === "search") renderSearchTab();
            else if (currentMainTab === "settings") renderSettingsPage();
          }
        }, 265);
      });
    });
  };

  function persistSessionPointer() {
    state.lastSession = {
      title: session.title,
      eyebrow: session.eyebrow,
      sectionId: session.sectionId,
      baseQueueIds: session.baseQueue,
      queueIds: session.queue,
      order: session.order,
      index: session.index
    };
    saveState();
  }

  window.openSection = function (sectionId, sourceEl) {
    const meta = findSectionMeta(sectionId);
    const secTitle = meta ? meta.title : sectionId;
    const secEyebrow = meta ? meta.eyebrow : "章节练习";
    const qs = getSectionQuestions(meta || sectionId).map((q) => q.id);
    const ord = state.defaultOrder || "seq";
    let startIdx = 0;
    if (ord === "seq") {
      if (state.lastSession && state.lastSession.sectionId === sectionId && state.lastSession.order === "seq") {
        startIdx = state.lastSession.index || 0;
      } else {
        const firstUnseen = qs.findIndex((id) => !state.records[id]);
        if (firstUnseen >= 0) startIdx = firstUnseen;
      }
    }
    launchQuizQueue(secTitle, secEyebrow, qs, startIdx, sectionId, ord, sourceEl);
  };

  window.resumeLastSession = function (sourceEl) {
    if (!state.lastSession || !state.lastSession.queueIds) return;
    const validIds = state.lastSession.queueIds.filter((id) => Q_MAP[id]);
    const validBase = (state.lastSession.baseQueueIds || state.lastSession.queueIds).filter((id) => Q_MAP[id]);
    if (validIds.length === 0) return;
    if (isMorphing) return;

    session.open = true;
    session.title = state.lastSession.title;
    session.eyebrow = state.lastSession.eyebrow || (state.lastSession.order === "random" ? "继续随机刷题" : "继续顺序刷题");
    session.sectionId = state.lastSession.sectionId || "";
    session.baseQueue = validBase;
    session.queue = validIds;
    session.order = state.lastSession.order || "seq";
    session.index = Math.max(0, Math.min(state.lastSession.index || 0, validIds.length - 1));
    session.mode = state.defaultMode;
    session.qStates = {};
    session.unmasteredOnly = false;
    session.sourceCardId = sourceEl ? sourceEl.getAttribute("data-card-id") : null;

    openQuizWithMorph(sourceEl);
  };

  window.startSmartReview = function (sourceEl) {
    const reviewIds = QUESTIONS.filter((q) => {
      const r = state.records[q.id];
      return r && (r.status === "wrong" || r.status === "fuzzy");
    }).map((q) => q.id);
    if (reviewIds.length === 0) {
      showToast("当前没有待复习的错题或模糊题目");
      return;
    }
    launchQuizQueue("智能待复习", "错题与模糊专项", reviewIds, 0, "smart_review", null, sourceEl);
  };

  window.startRandomQuiz = function (count, sourceEl) {
    const pool = shuffleArray(QUESTIONS.map((q) => q.id)).slice(0, count);
    launchQuizQueue(`跨章抽测（${count}题）`, "跨章节综合自测", pool, 0, "random_quiz", "random", sourceEl);
  };

  window.filterSessionUnmastered = function () {
    if (!session.open) return;
    const unm = session.baseQueue.filter((id) => {
      const r = state.records[id];
      return !r || r.status !== "mastered";
    });
    if (unm.length === 0) {
      showToast("本组题目已全部掌握");
      return;
    }
    session.unmasteredOnly = true;
    session.queue = session.order === "random" ? shuffleArray(unm) : unm;
    session.index = 0;
    closeQuestionSheet();
    buildQuizCarousel();
    updateQuizChrome();
    scrollCarouselToIndex(0, false);
    showToast(`已筛选出 ${unm.length} 道未掌握题目`);
  };

  window.restoreSessionAll = function () {
    if (!session.open) return;
    session.unmasteredOnly = false;
    session.queue = session.order === "random" ? shuffleArray(session.baseQueue) : session.baseQueue.slice();
    session.index = 0;
    closeQuestionSheet();
    buildQuizCarousel();
    updateQuizChrome();
    scrollCarouselToIndex(0, false);
    showToast(`已显示全部 ${session.queue.length} 道题目`);
  };

  window.jumpFromQuizToSettings = function () {
    closeQuestionSheet();
    closeQuizView(true);
    setTimeout(() => switchMainTab("settings"), 180);
  };

  /* ---------- Horizontal Swipeable Question Card Carousel ---------- */
  function renderFigsHtml(figs, labelPrefix) {
    if (!figs || figs.length === 0) return "";
    return figs
      .map(
        (fn) => `
      <div class="fig-box">
        <img src="figures/${encodeURI(fn)}" decoding="async" alt="${escapeHtml(labelPrefix)}" onclick="openLightbox('figures/${encodeURI(fn)}')" />
        <div><span class="fig-zoom-tag">${ic("maximize-2", "ic-xs")}<span>点击图片双指缩放查看</span></span></div>
      </div>`
      )
      .join("");
  }

  function renderNoteImagesHtml(qid) {
    const imgs = state.noteImages[qid];
    if (!imgs || imgs.length === 0) return "";
    const items = imgs
      .map((item, idx) => {
        const src = resolveNoteImgSrc(item);
        if (!src) return "";
        return `
          <div class="note-img-item" onclick="openNoteImgLightbox('${qid}', ${idx})">
            <img src="${src}" alt="笔记图片 ${idx + 1}" />
            <button class="note-img-del" onclick="deleteNoteImageItem('${qid}', ${idx}, event)" title="删除图片">${ic("x", "ic-xs")}</button>
          </div>`;
      })
      .join("");
    return items ? `<div class="note-img-grid">${items}</div>` : "";
  }

  window.openNoteImgLightbox = function (qid, idx) {
    const imgs = state.noteImages[qid];
    if (!imgs || !imgs[idx]) return;
    const src = resolveNoteImgSrc(imgs[idx]);
    if (src) openLightbox(src);
  };

  function buildSlideInnerHtml(idx) {
    const qid = session.queue[idx];
    const q = Q_MAP[qid];
    if (!q) return "";
    const qs = getQuestionState(qid);
    const rec = state.records[qid];

    let statusBadge = "";
    if (rec && rec.status === "mastered") statusBadge = `<span class="pill pill-status-mastered">${ic("circle-check", "ic-xs")}已掌握</span>`;
    else if (rec && rec.status === "fuzzy") statusBadge = `<span class="pill pill-status-fuzzy">${ic("circle-help", "ic-xs")}模糊</span>`;
    else if (rec && rec.status === "wrong") statusBadge = `<span class="pill pill-status-wrong">${ic("circle-x", "ic-xs")}错题</span>`;

    const orderPill = session.order === "random" ? `<span class="pill pill-order">${ic("shuffle", "ic-xs")}随机</span>` : "";
    const curSecMeta = session.sectionId ? findSectionMeta(session.sectionId) : null;
    const isCrossSection = !!(curSecMeta && curSecMeta.isSpecial) || ["smart_review", "random_quiz", "search"].includes(session.sectionId) || String(session.sectionId || "").startsWith("nb_");
    const sourceLabel = isCrossSection && SECTION_SHORT_LABELS[q.section] ? SECTION_SHORT_LABELS[q.section] : "";
    const sourcePill = sourceLabel ? `<span class="pill pill-source">${escapeHtml(sourceLabel)}</span>` : "";

    let html = `
      <div class="q-meta-bar">
        <div class="q-tags">
          <span class="pill pill-type">${TYPE_LABELS[q.type] || "题目"}</span>
          ${sourcePill}
          ${orderPill}
          <span class="pill pill-page num-tab">原书 P.${q.page}</span>
          ${statusBadge}
        </div>
        <span class="num-tab" style="font-size:12px; color:var(--text-muted); font-weight:600;">${idx + 1} / ${session.queue.length}</span>
      </div>

      <div class="q-stem-block">
        <div class="md-content">
          <span class="q-num-title">${escapeHtml(q.num)}</span>
          ${renderRichText(q.stem)}
        </div>
        ${renderFigsHtml(q.stem_figs, q.num + " 题干附图")}
      </div>
    `;

    if (q.type === "choice") {
      html += `<div class="options-list">`;
      (q.options || []).forEach((opt) => {
        let cls = "opt-btn";
        let rightIcon = "";
        if (qs.revealed) {
          if (opt.key === q.answer) {
            cls += " correct";
            rightIcon = `<span class="opt-status-ico" style="color:var(--success);">${ic("circle-check", "ic-sm")}</span>`;
          } else if (qs.selectedChoice === opt.key && opt.key !== q.answer) {
            cls += " wrong";
            rightIcon = `<span class="opt-status-ico" style="color:var(--danger);">${ic("circle-x", "ic-sm")}</span>`;
          }
        }
        html += `
          <button class="${cls}" onclick="selectChoiceOption('${qid}', '${opt.key}')">
            <span class="opt-key">${escapeHtml(opt.key)}</span>
            <div class="opt-text md-content">${renderRichText(opt.text)}</div>
            ${rightIcon}
          </button>`;
      });
      html += `</div>`;
      if (!qs.revealed) {
        html += `<button class="btn-ghost-full" onclick="revealSolution('${qid}')">${ic("eye", "ic-sm")}<span>不作答，直接查看解析</span></button>`;
      }
    } else if (q.type === "blank") {
      const blanks = q.blanks && q.blanks.length > 0 ? q.blanks : [q.answer];
      html += `<div class="blank-inputs-card">
        <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px; font-weight:600;">在此输入作答（或直接点击下方核对答案）</div>`;
      blanks.forEach((_, bIdx) => {
        const val = qs.tempBlanks[bIdx] || "";
        html += `
          <div class="blank-input-row">
            <span class="blank-lbl">第 ${bIdx + 1} 空</span>
            <input type="text" class="blank-field" value="${escapeHtml(val)}" placeholder="输入答案..." oninput="updateBlankInput('${qid}', ${bIdx}, this.value)" />
          </div>`;
      });
      html += `</div>`;
      if (!qs.revealed) {
        html += `<button class="btn-primary-full" onclick="revealSolution('${qid}')">${ic("eye", "ic-sm")}<span>核对标准答案与详细解析</span></button>`;
      }
    } else {
      if (!qs.revealed) {
        const promptHint =
          session.sectionId === "special_ch12_proof"
            ? "先选定独立变量、写出状态方程偏导并套用麦克斯韦或一般关系式，再核对推导"
            : q.type === "draw"
            ? "先在草稿纸上绘制曲线走势与特征状态点，再核对标准图解"
            : q.type === "calc"
            ? "先梳理控制体、热力学方程与查表思路，再核对分步解答"
            : "先独立思考核心结论与热力学定律依据，再展开详细解析";
        html += `
          <div style="font-size:12px; color:var(--text-muted); text-align:center; margin: 4px 0 12px;">${promptHint}</div>
          <button class="btn-primary-full" onclick="revealSolution('${qid}')">${ic("eye", "ic-sm")}<span>展开答案与详细解析</span></button>`;
      }
    }

    if (qs.revealed) {
      html += `
        <div class="analysis-card">
          ${
            q.answer
              ? `<div class="ans-summary-box">
                  <div class="ans-summary-title">${q.type === "choice" ? "正确答案" : "核心结论 / 参考答案"}</div>
                  <div class="ans-summary-val md-content">${renderRichText(q.answer)}</div>
                </div>`
              : ""
          }
          <div class="analysis-header">${ic("book-open", "ic-sm")}<span>详细解析与推导</span></div>
          <div class="md-content">${renderRichText(q.analysis)}</div>
          ${renderFigsHtml(q.ans_figs, q.num + " 解析图")}
        </div>

        <div class="self-eval-box">
          <div class="self-eval-title">自评本题掌握情况</div>
          <div class="self-eval-btns">
            <button class="eval-btn wrong ${rec && rec.status === "wrong" ? "selected" : ""}" onclick="markQuestionStatus('${qid}', 'wrong', false)">
              ${ic("circle-x", "ic-sm")}
              <span>没掌握</span>
              <span class="eval-sub">加入错题</span>
            </button>
            <button class="eval-btn fuzzy ${rec && rec.status === "fuzzy" ? "selected" : ""}" onclick="markQuestionStatus('${qid}', 'fuzzy', false)">
              ${ic("circle-help", "ic-sm")}
              <span>有点模糊</span>
              <span class="eval-sub">后续巩固</span>
            </button>
            <button class="eval-btn mastered ${rec && rec.status === "mastered" ? "selected" : ""}" onclick="markQuestionStatus('${qid}', 'mastered', true)">
              ${ic("circle-check", "ic-sm")}
              <span>已掌握</span>
              <span class="eval-sub">进入下题</span>
            </button>
          </div>
        </div>
      `;
    }

    const noteText = state.notes[qid] || "";
    const imgCount = (state.noteImages[qid] || []).length;
    html += `
      <div class="note-card">
        <div class="note-header-row">
          <span style="font-size:13px; font-weight:600; color:var(--text-secondary); display:inline-flex; align-items:center; gap:5px;">
            ${ic("notebook-pen", "ic-sm")}<span>本题笔记${imgCount > 0 ? ` · ${imgCount} 张图` : ""}</span>
          </span>
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="note-mini-btn accent" onclick="triggerNoteImageUpload('${qid}')">${ic("image-plus", "ic-xs")}<span>传图</span></button>
            <button class="note-mini-btn" onclick="shareQuestion('${qid}')">${ic("share-2", "ic-xs")}<span>分享</span></button>
          </div>
        </div>
        <textarea class="note-textarea" placeholder="记录公式变形、正负号注意点，或上传手写推导草稿图..." oninput="debouncedSaveNote('${qid}', this.value)" onchange="saveQuestionNote('${qid}', this.value, true)">${escapeHtml(noteText)}</textarea>
        ${renderNoteImagesHtml(qid)}
      </div>
    `;
    return html;
  }

  function renderSlideAt(idx, force) {
    const carousel = document.getElementById("quiz-carousel");
    if (!carousel) return;
    const slide = carousel.children[idx];
    if (!slide) return;
    if (!force && slide.getAttribute("data-hydrated") === "1") return;
    const prevScroll = slide.scrollTop;
    slide.innerHTML = `<div class="q-slide-inner">${buildSlideInnerHtml(idx)}</div>`;
    slide.setAttribute("data-hydrated", "1");
    if (force) slide.scrollTop = prevScroll;
  }

  function hydrateWindowAround(centerIdx) {
    const carousel = document.getElementById("quiz-carousel");
    if (!carousel) return;
    const total = session.queue.length;
    const lo = Math.max(0, centerIdx - 2);
    const hi = Math.min(total - 1, centerIdx + 2);
    for (let i = lo; i <= hi; i++) {
      renderSlideAt(i, false);
    }
    Array.from(carousel.children).forEach((el, idx) => {
      el.classList.toggle("is-active", idx === centerIdx);
    });
  }

  function buildQuizCarousel(onlyActive) {
    const carousel = document.getElementById("quiz-carousel");
    const frag = document.createDocumentFragment();
    for (let i = 0; i < session.queue.length; i++) {
      const q = Q_MAP[session.queue[i]];
      const slide = document.createElement("article");
      slide.className = "q-slide selectable" + (i === session.index ? " is-active" : "");
      slide.setAttribute("data-slide-idx", String(i));
      slide.setAttribute("data-hydrated", "0");
      slide.innerHTML = `<div class="q-slide-placeholder"><span class="num-tab" style="font-weight:600;color:var(--primary);">${escapeHtml(q ? q.num : "")}</span><span>滑动加载题目</span></div>`;
      frag.appendChild(slide);
    }
    carousel.innerHTML = "";
    carousel.appendChild(frag);
    if (onlyActive) {
      renderSlideAt(session.index, false);
    } else {
      hydrateWindowAround(session.index);
    }
  }

  function scrollCarouselToIndex(idx, smooth) {
    const carousel = document.getElementById("quiz-carousel");
    if (!carousel) return;
    const slide = carousel.children[idx];
    if (!slide) return;
    const targetLeft = Math.max(0, slide.offsetLeft);
    if (smooth) {
      programmaticScrollUntil = Date.now() + 480;
      carousel.scrollTo({ left: targetLeft, behavior: "smooth" });
    } else {
      programmaticScrollUntil = Date.now() + 120;
      carousel.scrollLeft = targetLeft;
    }
  }

  function updateQuizChrome() {
    const qid = session.queue[session.index];
    document.getElementById("quiz-hero-eyebrow").textContent = session.eyebrow;
    document.getElementById("quiz-header-title").textContent = session.title;
    const progPct = session.queue.length ? Math.round(((session.index + 1) / session.queue.length) * 100) : 0;
    document.getElementById("quiz-top-progress").style.width = progPct + "%";

    const modeBtn = document.getElementById("quiz-mode-toggle");
    modeBtn.innerHTML = session.mode === "recite" ? ic("book-open", "ic-sm") : ic("pen-line", "ic-sm");
    modeBtn.classList.toggle("active", session.mode === "recite");

    const isFav = !!(qid && state.favorites[qid]);
    const favBtn = document.getElementById("quiz-fav-btn");
    favBtn.innerHTML = ic(isFav ? "bookmark-check" : "bookmark", "ic-sm");
    favBtn.classList.toggle("active", isFav);

    const prevBtn = document.getElementById("btn-prev-q");
    prevBtn.disabled = session.index === 0;
    prevBtn.innerHTML = `${ic("chevron-left", "ic-sm")}<span>上一题</span>`;

    document.getElementById("btn-sheet-q").innerHTML = `${ic("layout-grid", "ic-sm")}<span>${session.index + 1}/${session.queue.length}</span>`;

    const nextBtn = document.getElementById("btn-next-q");
    nextBtn.innerHTML =
      session.index === session.queue.length - 1
        ? `${ic("check", "ic-sm")}<span>完成</span>`
        : `<span>下一题</span>${ic("chevron-right", "ic-sm")}`;
  }

  function detectCenteredSlideIndex() {
    const carousel = document.getElementById("quiz-carousel");
    if (!carousel || carousel.children.length === 0) return session.index;
    const viewCenter = carousel.scrollLeft + carousel.clientWidth / 2;
    let bestIdx = session.index;
    let bestDist = Infinity;
    for (let i = 0; i < carousel.children.length; i++) {
      const s = carousel.children[i];
      const sCenter = s.offsetLeft + s.offsetWidth / 2;
      const dist = Math.abs(sCenter - viewCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  function initCarouselScrollSync() {
    const carousel = document.getElementById("quiz-carousel");
    if (!carousel) return;
    carousel.addEventListener(
      "scroll",
      () => {
        if (!session.open || isMorphing) return;
        if (carouselScrollRaf) cancelAnimationFrame(carouselScrollRaf);
        carouselScrollRaf = requestAnimationFrame(() => {
          const centered = detectCenteredSlideIndex();
          if (Date.now() >= programmaticScrollUntil && centered !== session.index) {
            session.index = centered;
            hydrateWindowAround(centered);
            updateQuizChrome();
          }
        });
        clearTimeout(carouselSettleTimer);
        carouselSettleTimer = setTimeout(() => {
          if (!session.open || isMorphing) return;
          const settled = detectCenteredSlideIndex();
          if (settled !== session.index) {
            session.index = settled;
          }
          hydrateWindowAround(session.index);
          updateQuizChrome();
          persistSessionPointer();
        }, 140);
      },
      { passive: true }
    );
  }

  /* ---------- Question Interactions ---------- */
  window.selectChoiceOption = function (qid, key) {
    const q = Q_MAP[qid];
    const qs = getQuestionState(qid);
    if (!q || qs.revealed) return;
    qs.selectedChoice = key;
    qs.revealed = true;
    const isRight = key === q.answer;
    haptic(isRight ? 12 : 30);

    const prev = state.records[qid];
    if (!prev) state.todayCount++;

    let newStatus = isRight ? "mastered" : "wrong";
    if (isRight && prev && prev.status === "wrong" && !state.autoRemoveWrong) {
      newStatus = "fuzzy";
      showToast("答对了，已由错题转为「模糊待巩固」");
    } else if (!isRight) {
      showToast("答错了，已自动加入错题本");
    }

    state.records[qid] = {
      status: newStatus,
      choiceAns: key,
      updatedAt: Date.now()
    };
    saveState();
    updateBadges();
    const idx = session.queue.indexOf(qid);
    if (idx >= 0) renderSlideAt(idx, true);

    if (isRight && state.autoNextOnCorrect && session.index < session.queue.length - 1) {
      setTimeout(() => {
        if (session.open && session.queue[session.index] === qid) {
          stepQuestion(1);
        }
      }, 650);
    }
  };

  window.updateBlankInput = function (qid, bIdx, val) {
    const qs = getQuestionState(qid);
    qs.tempBlanks[bIdx] = val;
    if (state.records[qid]) {
      state.records[qid].blankVals = qs.tempBlanks.slice();
      saveState();
    }
  };

  window.revealSolution = function (qid) {
    const qs = getQuestionState(qid);
    qs.revealed = true;
    haptic(10);
    const idx = session.queue.indexOf(qid);
    if (idx >= 0) renderSlideAt(idx, true);
  };

  window.markQuestionStatus = function (qid, status, autoNext) {
    const qs = getQuestionState(qid);
    if (!state.records[qid]) {
      state.todayCount++;
    }
    state.records[qid] = {
      status: status,
      choiceAns: qs.selectedChoice || (state.records[qid] && state.records[qid].choiceAns) || null,
      blankVals: qs.tempBlanks.slice(),
      updatedAt: Date.now()
    };
    saveState();
    updateBadges();
    haptic(15);

    const idx = session.queue.indexOf(qid);
    if (idx >= 0) renderSlideAt(idx, true);

    if (autoNext && session.index < session.queue.length - 1) {
      stepQuestion(1);
    } else {
      showToast(status === "mastered" ? "已标记为：已掌握" : status === "fuzzy" ? "已标记为：模糊待巩固" : "已加入错题本");
    }
  };

  window.toggleQuizLocalMode = function () {
    session.mode = session.mode === "quiz" ? "recite" : "quiz";
    const curQid = session.queue[session.index];
    if (curQid) {
      const qs = getQuestionState(curQid);
      qs.revealed = session.mode === "recite";
      renderSlideAt(session.index, true);
    }
    // Also update un-visited neighbor slides
    for (let d = -2; d <= 2; d++) {
      const ni = session.index + d;
      if (ni >= 0 && ni < session.queue.length && ni !== session.index) {
        const nqid = session.queue[ni];
        if (session.qStates[nqid] && !session.qStates[nqid].selectedChoice) {
          session.qStates[nqid].revealed = session.mode === "recite";
          renderSlideAt(ni, true);
        }
      }
    }
    updateQuizChrome();
    showToast(session.mode === "recite" ? "当前已切换为：背题模式" : "当前已切换为：刷题模式");
  };

  window.toggleCurrentFav = function () {
    const qid = session.queue[session.index];
    if (!qid) return;
    if (state.favorites[qid]) {
      delete state.favorites[qid];
      showToast("已取消收藏");
    } else {
      state.favorites[qid] = true;
      showToast("已加入收藏夹");
    }
    haptic(15);
    saveState();
    updateQuizChrome();
  };

  let noteSaveTimer = null;
  window.debouncedSaveNote = function (qid, text) {
    clearTimeout(noteSaveTimer);
    noteSaveTimer = setTimeout(() => window.saveQuestionNote(qid, text, false), 450);
  };

  window.saveQuestionNote = function (qid, text, notify) {
    const t = (text || "").trim();
    if (t) state.notes[qid] = t;
    else delete state.notes[qid];
    saveState();
    if (notify) showToast("笔记已保存");
  };

  window.stepQuestion = function (delta) {
    const nextIdx = session.index + delta;
    if (nextIdx < 0) return;
    if (nextIdx >= session.queue.length) {
      showToast("本组题目已全部完成");
      closeQuizView();
      return;
    }
    session.index = nextIdx;
    hydrateWindowAround(nextIdx);
    updateQuizChrome();
    scrollCarouselToIndex(nextIdx, true);
    persistSessionPointer();
  };

  window.shareQuestion = function (qid) {
    const q = Q_MAP[qid];
    if (!q) return;
    const shareTxt = `【工热刷题宝 · ${q.num} (P.${q.page})】\n${q.stem}\n\n【参考答案】${q.answer}\n【解析】\n${q.analysis}`;
    if (window.AppBridge && typeof window.AppBridge.shareText === "function") {
      window.AppBridge.shareText(q.num, shareTxt);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareTxt).then(() => showToast("题目与解析已复制到剪贴板"));
    }
  };

  /* ---------- Question Sheet Modal ---------- */
  window.openQuestionSheet = function () {
    const hint = document.getElementById("sheet-order-hint");
    if (hint) {
      hint.textContent = `当前调度：${session.order === "random" ? "随机刷题" : "顺序刷题"} · 共 ${session.queue.length} 题（可在底部「设置」统一调整）`;
    }
    document.getElementById("sheet-btn-unmastered").classList.toggle("active", session.unmasteredOnly);
    document.getElementById("sheet-btn-all").classList.toggle("active", !session.unmasteredOnly);

    let html = "";
    session.queue.forEach((qid, idx) => {
      const r = state.records[qid];
      let cls = "q-grid-cell";
      if (idx === session.index) cls += " current";
      if (r && r.status) cls += " " + r.status;
      html += `<div class="${cls}" onclick="jumpToQuestion(${idx})">${idx + 1}</div>`;
    });
    document.getElementById("sheet-grid").innerHTML = html;
    document.getElementById("sheet-modal").classList.add("open");
  };

  window.closeQuestionSheet = function () {
    document.getElementById("sheet-modal").classList.remove("open");
  };

  window.jumpToQuestion = function (idx) {
    closeQuestionSheet();
    session.index = idx;
    hydrateWindowAround(idx);
    updateQuizChrome();
    scrollCarouselToIndex(idx, true);
    persistSessionPointer();
  };

  /* ---------- Tab 2: Review Notebook ---------- */
  window.switchNotebookTab = function (nb) {
    currentNbTab = nb;
    document.querySelectorAll("#tab-notebook .seg-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-nb") === nb);
    });
    renderNotebook();
  };

  window.setNbFilter = function (f) {
    currentNbFilter = f;
    renderNotebook();
  };

  function getNotebookItems() {
    return QUESTIONS.filter((q) => {
      if (currentNbTab === "wrong") {
        if (!state.records[q.id] || state.records[q.id].status !== "wrong") return false;
      } else if (currentNbTab === "fuzzy") {
        if (!state.records[q.id] || state.records[q.id].status !== "fuzzy") return false;
      } else if (currentNbTab === "fav") {
        if (!state.favorites[q.id]) return false;
      } else if (currentNbTab === "notes") {
        const hasTxt = !!(state.notes[q.id] && state.notes[q.id].trim());
        const hasImg = !!(state.noteImages[q.id] && state.noteImages[q.id].length > 0);
        if (!hasTxt && !hasImg) return false;
      }
      if (currentNbFilter !== "all") {
        if (["ch10", "ch11", "ch12"].includes(currentNbFilter)) {
          return q.chapter === currentNbFilter;
        }
        return q.type === currentNbFilter;
      }
      return true;
    });
  }

  function renderNotebook() {
    const chips = [
      { k: "all", lbl: "全部" },
      { k: "ch10", lbl: "第10章" },
      { k: "ch11", lbl: "第11章" },
      { k: "ch12", lbl: "第12章" },
      { k: "choice", lbl: "选择题" },
      { k: "blank", lbl: "填空题" },
      { k: "qa", lbl: "问答题" },
      { k: "calc", lbl: "计算题" },
      { k: "draw", lbl: "作图题" }
    ];
    document.getElementById("nb-type-chips").innerHTML = chips
      .map(
        (c) =>
          `<button class="filter-chip ${currentNbFilter === c.k ? "active" : ""}" onclick="setNbFilter('${c.k}')">${c.lbl}</button>`
      )
      .join("");

    const list = getNotebookItems();
    const titles = { wrong: "错题本", fuzzy: "模糊待巩固", fav: "收藏夹", notes: "我的笔记" };
    const orderTag = state.defaultOrder === "random" ? "随机" : "顺序";

    if (list.length > 0) {
      document.getElementById("nb-action-bar").innerHTML = `
        <button class="btn-primary-full" data-card-id="nb_launch" style="margin-bottom:0;" onclick="practiceNotebookList(this)">
          ${ic("play", "ic-sm")}<span>开始${titles[currentNbTab]}练习（${list.length} 题 · ${orderTag}）</span>
        </button>`;
    } else {
      document.getElementById("nb-action-bar").innerHTML = "";
    }

    if (list.length === 0) {
      document.getElementById("nb-list-container").innerHTML = `
        <div class="empty-state">
          <div class="empty-ico-circle">${ic("bookmark", "ic-lg")}</div>
          <div style="font-weight:600; color:var(--text-secondary);">当前「${titles[currentNbTab]}」为空</div>
          <div style="font-size:12.5px; margin-top:4px;">${
            currentNbTab === "notes"
              ? "在题目底部写下文字或上传草稿照片，都会自动收纳于此"
              : "刷题时答错或自评为「没掌握/模糊」的题目会自动归集到这里"
          }</div>
        </div>`;
      return;
    }

    document.getElementById("nb-list-container").innerHTML = `<div class="grouped-card">${list
      .map((q, idx) => {
        const plainStem = q.stem.replace(/\$\$[\s\S]*?\$\$/g, "[公式]").replace(/\$[^\$]+\$/g, "[公式]").slice(0, 82);
        const imgs = state.noteImages[q.id] || [];
        let notePreview = "";
        if (currentNbTab === "notes") {
          const txtHtml = state.notes[q.id] ? `<div>${escapeHtml(state.notes[q.id])}</div>` : "";
          const imgBadge = imgs.length > 0 ? `<div style="margin-top:3px; color:var(--primary); font-weight:600; display:inline-flex; align-items:center; gap:4px;">${ic("image", "ic-xs")}<span>附 ${imgs.length} 张笔记图片</span></div>` : "";
          notePreview = `<div style="margin-top:6px; padding:6px 9px; background:var(--surface-subtle); border-radius:8px; font-size:12px; color:var(--text-secondary);">${txtHtml}${imgBadge}</div>`;
        }
        return `
          <div class="list-row" data-card-id="nb_${q.id}" onclick="openNotebookItem(${idx}, this)">
            <div class="row-body">
              <div class="row-title">${escapeHtml(q.num)} <span style="font-size:11.5px; font-weight:500; color:var(--text-muted);">· ${TYPE_LABELS[q.type]} · P.${q.page}</span></div>
              <div class="row-sub">${escapeHtml(plainStem)}${q.stem.length > 82 ? "..." : ""}</div>
              ${notePreview}
            </div>
            <div class="row-right">${ic("chevron-right", "ic-sm")}</div>
          </div>`;
      })
      .join("")}</div>`;
  }

  window.practiceNotebookList = function (sourceEl) {
    const list = getNotebookItems().map((q) => q.id);
    const titles = { wrong: "错题专项", fuzzy: "模糊巩固", fav: "收藏夹复习", notes: "笔记回顾" };
    launchQuizQueue(titles[currentNbTab], "复习本专项", list, 0, "nb_" + currentNbTab, null, sourceEl);
  };

  window.openNotebookItem = function (idx, sourceEl) {
    const list = getNotebookItems().map((q) => q.id);
    const titles = { wrong: "错题本", fuzzy: "模糊待巩固", fav: "收藏夹", notes: "我的笔记" };
    launchQuizQueue(titles[currentNbTab], "复习本", list, idx, "nb_" + currentNbTab, "seq", sourceEl);
  };

  /* ---------- Tab 3: Core Formula Reference ---------- */
  window.renderFormulas = function () {
    const kw = (document.getElementById("formula-search").value || "").trim().toLowerCase();
    let html = "";
    FORMULAS.forEach((grp) => {
      const matchedItems = grp.items.filter((it) => {
        if (!kw) return true;
        return (
          grp.title.toLowerCase().includes(kw) ||
          it.name.toLowerCase().includes(kw) ||
          it.formula.toLowerCase().includes(kw) ||
          it.note.toLowerCase().includes(kw)
        );
      });
      if (matchedItems.length === 0) return;

      html += `
        <div class="formula-group-card">
          <div class="formula-group-head">
            <span>${escapeHtml(grp.title)}</span>
            <span class="pill pill-type num-tab">${escapeHtml(grp.tag)} · ${matchedItems.length}条</span>
          </div>
          ${matchedItems
            .map(
              (it) => `
            <div class="formula-item selectable">
              <div class="formula-item-title">${escapeHtml(it.name)}</div>
              <div class="md-content">${renderRichText(it.formula)}</div>
              <div class="formula-item-note md-content">${renderRichText(it.note)}</div>
            </div>`
            )
            .join("")}
        </div>`;
    });

    if (!html) {
      html = `<div class="empty-state"><div class="empty-ico-circle">${ic("sigma", "ic-lg")}</div>未找到匹配「${escapeHtml(kw)}」的公式条目</div>`;
    }
    document.getElementById("formulas-container").innerHTML = html;
  };

  /* ---------- Tab 4: Global Search & Overview ---------- */
  function renderSearchChips() {
    const chips = [
      { k: "all", lbl: "全部题型 (367)" },
      { k: "choice", lbl: "选择题 (62)" },
      { k: "blank", lbl: "填空题 (19)" },
      { k: "qa", lbl: "思考与问答 (152)" },
      { k: "calc", lbl: "计算与拓展 (125)" },
      { k: "draw", lbl: "作图题 (9)" }
    ];
    document.getElementById("search-type-chips").innerHTML = chips
      .map(
        (c) =>
          `<button class="filter-chip ${currentSearchFilter === c.k ? "active" : ""}" onclick="setSearchFilter('${c.k}')">${c.lbl}</button>`
      )
      .join("");
  }

  window.setSearchFilter = function (f) {
    currentSearchFilter = f;
    renderSearchChips();
    handleGlobalSearch();
  };

  window.handleGlobalSearch = function () {
    const kw = (document.getElementById("global-search-input").value || "").trim().toLowerCase();
    const container = document.getElementById("search-results-container");
    const overviewBox = document.getElementById("search-overview-container");

    if (!kw) {
      container.innerHTML = `<div style="font-size:12.5px; color:var(--text-muted); text-align:center; padding:8px 0;">输入术语、公式符号或题号（如：卡诺、朗肯、露点、麦克斯韦、壅塞、258）检索全库 367 题</div>`;
      overviewBox.style.display = "block";
      return;
    }

    overviewBox.style.display = "none";
    const matches = QUESTIONS.filter((q) => {
      if (currentSearchFilter !== "all" && q.type !== currentSearchFilter) return false;
      const hay = (
        q.num + " " +
        q.stem + " " +
        q.answer + " " +
        q.analysis + " " +
        (q.options || []).map((o) => o.text).join(" ")
      ).toLowerCase();
      return hay.includes(kw);
    });

    if (matches.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-ico-circle">${ic("search", "ic-lg")}</div>未找到包含「${escapeHtml(kw)}」的${currentSearchFilter === "all" ? "" : TYPE_LABELS[currentSearchFilter]}题目</div>`;
      return;
    }

    window._lastSearchIds = matches.map((m) => m.id);
    container.innerHTML =
      `<div style="font-size:12.5px; color:var(--text-muted); margin-bottom:10px; font-weight:500; display:flex; justify-content:space-between; align-items:center;">
        <span class="num-tab">共找到 ${matches.length} 道相关原题</span>
        <button class="filter-chip active" data-card-id="search_start" onclick="launchSearchSession(this)">${ic("play", "ic-xs")}<span>进入本组刷题</span></button>
      </div><div class="grouped-card">` +
      matches
        .slice(0, 80)
        .map((q, idx) => {
          const snippet = q.stem.replace(/\$\$[\s\S]*?\$\$/g, " ").replace(/\$[^\$]+\$/g, " ").slice(0, 88);
          return `
            <div class="list-row" data-card-id="sr_${q.id}" onclick="openSearchResult(${idx}, this)">
              <div class="row-body">
                <div class="row-title">${escapeHtml(q.num)} <span style="font-size:11.5px;font-weight:500;color:var(--text-muted);">· ${TYPE_LABELS[q.type]} · P.${q.page}</span></div>
                <div class="row-sub">${escapeHtml(snippet)}...</div>
              </div>
              <div class="row-right"><span class="row-count num-tab">#${q.seq}</span>${ic("chevron-right", "ic-sm")}</div>
            </div>`;
        })
        .join("") + `</div>`;
  };

  window.openSearchResult = function (idx, sourceEl) {
    const ids = window._lastSearchIds || [];
    const kw = (document.getElementById("global-search-input").value || "").trim();
    launchQuizQueue(`搜索：${kw}`, "全局搜索结果", ids, idx, "search", "seq", sourceEl);
  };

  window.launchSearchSession = function (sourceEl) {
    const ids = window._lastSearchIds || [];
    const kw = (document.getElementById("global-search-input").value || "").trim();
    launchQuizQueue(`搜索：${kw}`, "全局搜索结果", ids, 0, "search", null, sourceEl);
  };

  function renderSearchTab() {
    renderSearchChips();
    handleGlobalSearch();

    const typesBreakdown = ["choice", "blank", "qa", "calc", "draw"].map((t) => {
      const qs = QUESTIONS.filter((q) => q.type === t);
      const done = qs.filter((q) => state.records[q.id] && state.records[q.id].status).length;
      const mastered = qs.filter((q) => state.records[q.id] && state.records[q.id].status === "mastered").length;
      const pct = qs.length ? Math.round((done / qs.length) * 100) : 0;
      return `
        <div class="list-row" style="cursor:default;">
          <div class="row-body">
            <div class="row-title">${TYPE_LABELS[t]}（${qs.length} 题）</div>
            <div class="row-sub num-tab">已刷 ${done} 题 · 已掌握 ${mastered} 题</div>
            <div class="row-progress-track"><div class="row-progress-fill" style="width:${pct}%"></div></div>
          </div>
          <div class="row-right"><span class="row-count num-tab">${pct}%</span></div>
        </div>`;
    }).join("");

    document.getElementById("search-overview-container").innerHTML = `
      <div class="group-heading" style="margin-top:6px;">
        <span>各题型进度</span>
        <span class="group-heading-sub">共 367 题</span>
      </div>
      <div class="grouped-card">${typesBreakdown}</div>
    `;
  }

  /* ---------- Tab 5: Unified Settings Page (3 Themes + Central Order Scheduling) ---------- */
  function renderSettingsPage() {
    const st = getOverallStats();
    let imgStatsText = "";
    const totalImgs = Object.values(state.noteImages || {}).reduce((acc, a) => acc + (a ? a.length : 0), 0);
    if (window.AppBridge && typeof window.AppBridge.getStorageStats === "function") {
      try {
        const info = JSON.parse(window.AppBridge.getStorageStats());
        const mb = (info.imageBytes / (1024 * 1024)).toFixed(2);
        imgStatsText = `本地图片 ${info.imageCount} 张（${mb} MB）`;
      } catch (_) {}
    } else {
      imgStatsText = `笔记图片 ${totalImgs} 张`;
    }

    const fontPct = Math.round((state.fontScale || 1) * 100);
    const previewFormula = renderRichText("示例排版：内可逆多热源循环热效率 $\\eta_{\\text{t}} = 1 - \\frac{T_{\\text{mL}}}{T_{\\text{mH}}}$，焦耳-汤姆逊系数 $\\mu_J = \\left(\\frac{\\partial T}{\\partial p}\\right)_h$。");

    document.getElementById("settings-page-body").innerHTML = `
      <div class="settings-section-label"><span>外观主题</span></div>
      <div class="settings-group">
        <div class="theme-grid-3">
          <button class="theme-card ${state.theme === "light" ? "active" : ""}" onclick="setThemeMode('light')">
            <span class="theme-icon-wrap">${ic("sun", "ic-sm")}</span>
            <span>白天</span>
          </button>
          <button class="theme-card ${state.theme === "dark" ? "active" : ""}" onclick="setThemeMode('dark')">
            <span class="theme-icon-wrap">${ic("moon", "ic-sm")}</span>
            <span>黑夜</span>
          </button>
          <button class="theme-card ${state.theme === "auto" ? "active" : ""}" onclick="setThemeMode('auto')">
            <span class="theme-icon-wrap">${ic("monitor", "ic-sm")}</span>
            <span>跟随系统</span>
          </button>
        </div>
      </div>

      <div class="settings-section-label"><span>刷题调度与偏好</span></div>
      <div class="settings-group">
        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-name">刷题顺序调度</div>
            <div class="setting-row-desc">统一控制全部章节、考题池与复习本的出题顺序</div>
          </div>
          <div class="seg-control">
            <button class="seg-btn ${state.defaultOrder === "seq" ? "active" : ""}" onclick="setGlobalOrder('seq')">${ic("list-ordered", "ic-xs")}<span>顺序</span></button>
            <button class="seg-btn ${state.defaultOrder === "random" ? "active" : ""}" onclick="setGlobalOrder('random')">${ic("shuffle", "ic-xs")}<span>随机</span></button>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-name">默认答题模式</div>
            <div class="setting-row-desc">刷题隐藏答案解析，背题直接展开全解析</div>
          </div>
          <div class="seg-control">
            <button class="seg-btn ${state.defaultMode === "quiz" ? "active" : ""}" onclick="setGlobalMode('quiz')">刷题</button>
            <button class="seg-btn ${state.defaultMode === "recite" ? "active" : ""}" onclick="setGlobalMode('recite')">背题</button>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-name">选择题答对自动切至下一题</div>
            <div class="setting-row-desc">展示正确反馈后自动平滑滑向下一张题目卡片</div>
          </div>
          <button class="toggle-switch ${state.autoNextOnCorrect ? "on" : ""}" onclick="toggleSettingFlag('autoNextOnCorrect')"></button>
        </div>

        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-name">错题答对直接移出错题本</div>
            <div class="setting-row-desc">关闭时答对先转为「模糊」，二次巩固更稳妥</div>
          </div>
          <button class="toggle-switch ${state.autoRemoveWrong ? "on" : ""}" onclick="toggleSettingFlag('autoRemoveWrong')"></button>
        </div>

        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-name">按键震动反馈</div>
            <div class="setting-row-desc">答题、收藏与标记时的触感回馈</div>
          </div>
          <button class="toggle-switch ${state.hapticEnabled ? "on" : ""}" onclick="toggleSettingFlag('hapticEnabled')"></button>
        </div>
      </div>

      <div class="settings-section-label">
        <span>字体与阅读排版</span>
        <span class="num-tab" style="color:var(--primary); font-weight:600;">当前字号 ${fontPct}%</span>
      </div>
      <div class="settings-group">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
          <span style="font-size:12px; color:var(--text-muted);">A-</span>
          <input type="range" class="range-slider" min="0.9" max="1.32" step="0.06" value="${state.fontScale}" oninput="setFontScaleValue(this.value)" />
          <span style="font-size:16px; font-weight:700; color:var(--text-muted);">A+</span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px;">
          ${[
            { v: 0.9, l: "紧凑 90%" },
            { v: 1.0, l: "标准 100%" },
            { v: 1.12, l: "舒适 112%" },
            { v: 1.24, l: "大字 124%" },
            { v: 1.32, l: "超大 132%" }
          ]
            .map(
              (p) =>
                `<button class="filter-chip ${Math.abs(state.fontScale - p.v) < 0.03 ? "active" : ""}" onclick="setFontScaleValue(${p.v})">${p.l}</button>`
            )
            .join("")}
        </div>

        <div class="setting-row">
          <div class="setting-row-info"><div class="setting-row-name">字体风格</div></div>
          <div class="seg-control">
            <button class="seg-btn ${state.fontFamily === "sans" ? "active" : ""}" onclick="setFontFamily('sans')">无衬线</button>
            <button class="seg-btn ${state.fontFamily === "serif" ? "active" : ""}" onclick="setFontFamily('serif')">宋体</button>
            <button class="seg-btn ${state.fontFamily === "round" ? "active" : ""}" onclick="setFontFamily('round')">清晰体</button>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-row-info"><div class="setting-row-name">行距舒适度</div></div>
          <div class="seg-control">
            <button class="seg-btn ${state.lineHeight === "compact" ? "active" : ""}" onclick="setLineHeight('compact')">紧凑</button>
            <button class="seg-btn ${state.lineHeight === "normal" ? "active" : ""}" onclick="setLineHeight('normal')">标准</button>
            <button class="seg-btn ${state.lineHeight === "relaxed" ? "active" : ""}" onclick="setLineHeight('relaxed')">宽松</button>
          </div>
        </div>

        <div class="preview-box md-content">${previewFormula}</div>
      </div>

      <div class="settings-section-label"><span>数据与备份</span><span class="num-tab">v3.6.0 · 367 题</span></div>
      <div class="settings-group">
        <div class="num-tab" style="font-size:12.5px; color:var(--text-muted); margin-bottom:12px;">
          已刷 ${st.practiced} 题 · 收藏 ${st.favCount} 题 · 笔记 ${st.noteCount} 题 · ${imgStatsText}
        </div>
        <div class="dual-btn-row" style="margin-bottom:10px;">
          <button class="foot-btn" onclick="exportBackupData()">${ic("upload", "ic-sm")}<span>导出备份</span></button>
          <button class="foot-btn" onclick="importBackupData()">${ic("download", "ic-sm")}<span>导入恢复</span></button>
        </div>
        <button class="foot-btn" style="width:100%; color:var(--danger); background:var(--danger-soft);" onclick="resetAllProgress()">
          ${ic("trash-2", "ic-sm")}<span>清空做题进度（保留收藏与图文笔记）</span>
        </button>
      </div>
    `;
  }

  window.setGlobalMode = function (m) {
    state.defaultMode = m;
    saveState();
    renderSettingsPage();
    showToast(m === "recite" ? "默认模式：背题速览" : "默认模式：刷题自测");
  };

  window.setGlobalOrder = function (ord) {
    state.defaultOrder = ord;
    saveState();
    renderSettingsPage();
    showToast(ord === "random" ? "已切换为：全局随机刷题" : "已切换为：全局顺序刷题");
  };

  window.setThemeMode = function (t) {
    state.theme = t;
    applyAppearance();
    saveState();
    renderSettingsPage();
    haptic(10);
  };

  window.setFontScaleValue = function (val) {
    state.fontScale = Math.max(0.88, Math.min(1.36, parseFloat(val) || 1));
    applyAppearance();
    saveState();
    renderSettingsPage();
  };

  window.setFontFamily = function (fam) {
    state.fontFamily = fam;
    applyAppearance();
    saveState();
    renderSettingsPage();
  };

  window.setLineHeight = function (lh) {
    state.lineHeight = lh;
    applyAppearance();
    saveState();
    renderSettingsPage();
  };

  window.toggleSettingFlag = function (key) {
    state[key] = !state[key];
    saveState();
    renderSettingsPage();
    haptic(10);
  };

  window.exportBackupData = function () {
    const json = JSON.stringify(state);
    if (window.AppBridge && typeof window.AppBridge.shareText === "function") {
      window.AppBridge.shareText("工热刷题宝进度备份", json);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(json).then(() => showToast("备份数据已复制到剪贴板"));
    }
  };

  window.importBackupData = function () {
    const raw = window.prompt("请粘贴导出的备份 JSON 数据：");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.records === "object") {
        state = Object.assign(state, parsed);
        if (!["light", "dark", "auto"].includes(state.theme)) state.theme = "light";
        state.uiRev = 30;
        saveState();
        applyAppearance();
        renderSettingsPage();
        renderHome();
        updateBadges();
        showToast("学习记录与笔记已成功恢复");
      } else {
        showToast("备份格式无效");
      }
    } catch (e) {
      showToast("JSON 解析失败，请检查粘贴内容是否完整");
    }
  };

  window.resetAllProgress = function () {
    if (!window.confirm("确定清空做题状态开启新一轮刷题吗？（收藏夹、文字笔记与笔记图片都会完整保留）")) return;
    state.records = {};
    state.todayCount = 0;
    state.lastSession = null;
    saveState();
    renderSettingsPage();
    renderHome();
    updateBadges();
    showToast("已重置做题进度，开启新一轮刷题");
  };

  /* ---------- Panzoom Fullscreen Diagram Lightbox ---------- */
  window.openLightbox = function (src) {
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    if (pzInstance) {
      try {
        pzInstance.resetStyle();
        pzInstance.destroy();
      } catch (_) {}
      pzInstance = null;
    }
    img.style.transform = "";
    img.style.transition = "";
    img.src = src;
    lb.classList.add("open");
    if (window.Panzoom) {
      pzInstance = window.Panzoom(img, {
        maxScale: 4.5,
        minScale: 0.6,
        startScale: 1,
        startX: 0,
        startY: 0,
        step: 0.35
      });
    }
  };

  window.closeLightbox = function () {
    const img = document.getElementById("lightbox-img");
    if (pzInstance) {
      try {
        pzInstance.resetStyle();
        pzInstance.destroy();
      } catch (_) {}
      pzInstance = null;
    }
    if (img) {
      img.style.transform = "";
      img.style.transition = "";
    }
    document.getElementById("lightbox").classList.remove("open");
  };

  window.zoomLightbox = function (delta) {
    if (!pzInstance) return;
    const cur = pzInstance.getScale();
    pzInstance.zoom(Math.max(0.6, Math.min(4.5, cur + delta)), { animate: true });
  };

  window.resetLightboxZoom = function () {
    if (!pzInstance) return;
    if (Math.abs(pzInstance.getScale() - 1) > 0.08 || Math.abs(pzInstance.getPan().x) > 4 || Math.abs(pzInstance.getPan().y) > 4) {
      pzInstance.reset({ animate: true });
    } else {
      pzInstance.zoom(2.2, { animate: true });
    }
  };

  /* ---------- Android Hardware Back Gesture Handler ---------- */
  window.handleAndroidBack = function () {
    if (document.getElementById("lightbox").classList.contains("open")) {
      closeLightbox();
      return "handled";
    }
    if (document.getElementById("sheet-modal").classList.contains("open")) {
      closeQuestionSheet();
      return "handled";
    }
    if (session.open) {
      closeQuizView();
      return "handled";
    }
    if (currentMainTab !== "home") {
      switchMainTab("home");
      return "handled";
    }
    const now = Date.now();
    if (now - lastBackPress < 1800) {
      return "exit";
    }
    lastBackPress = now;
    showToast("再按一次返回键退出工热刷题宝");
    return "handled";
  };

  /* ---------- Bootstrap ---------- */
  hydrateStaticIcons();
  loadState();
  initCarouselScrollSync();
  renderHome();
})();
