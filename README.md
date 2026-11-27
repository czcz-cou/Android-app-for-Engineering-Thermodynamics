# 工热刷题宝 · Engineering Thermodynamics Android App

一款面向《工程热力学》考研与课程复习的**全离线 Android 刷题应用**（包名：`com.thermo.quizapp`，当前版本 `v3.6.0`）。

## 核心特性

- **完整离线题库（367 题 + 65 张配图）**：涵盖第 10–12 章思考题/拓展题、附录考题池（选择/填空/问答/计算与证明/作图）及 150 分全真模拟卷。
- **重点专题**：首页独立「第 12 章热力学证明题（14 题）」专题，跨全库归集麦克斯韦关系、自由焓、范氏气体与一般关系式推导题，进度与原章节实时双向同步。
- **纯离线公式与高清看图**：内置精简 `.woff2` 版 KaTeX 渲染全部公式；集成 `@panzoom/panzoom` 支持题图与笔记图片双指缩放查看。
- **复习本与图文笔记**：自动归集错题/模糊/收藏，支持文字笔记与手机本地拍照/选图上传压缩存储。
- **简洁现代交互**：iOS 风格 Liquid Glass 悬浮五标签底栏、白天/黑夜/跟随系统三主题、全局顺序/随机刷题统一调度、全屏横向滑动吸附题卡与 120fps 纯 GPU 展开动效。
- **数据本地持久化与备份**：通过 Android `AppBridge` 持久化做题记录与笔记图片，并支持 JSON 导出/导入恢复。

## 目录结构

```text
ThermoQuizApp/
├── android/
│   ├── AndroidManifest.xml                   # 应用清单与版本号配置
│   ├── res/mipmap-*/ic_launcher.png          # 启动图标
│   └── src/com/thermo/quizapp/
│       └── MainActivity.java                 # WebView 容器与原生 AppBridge 接口
├── assets_src/
│   ├── index.html                            # 主页面结构（5 Tab + 题卡 + 弹层）
│   ├── styles.css                            # 苹果风格亮/暗双主题与 GPU 动效样式
│   ├── app.js                                # 核心刷题、专题、笔记、设置与动效逻辑
│   ├── questions.json                        # 367 道题库数据（含 LaTeX 公式）
│   ├── formulas.json                         # 9 组核心热力学公式速查表
│   ├── figures/                              # 65 张原书高清插图
│   ├── vendor/                               # 离线开源库（Lucide SVG 图标、Panzoom）
│   └── katex/                                # 离线 KaTeX（仅保留 .woff2 字体）
├── build_apk.py                              # 一键打包、zipalign 与 apksigner 签名脚本
└── .gitignore                                # 忽略签名密钥、编译产物与自动生成文件
```

## 本地预览

在 `assets_src/` 目录下启动静态服务即可在浏览器中预览（需先生成一次 `data_bundle.js`）：

```bash
python -m http.server 8765 --bind 127.0.0.1 --directory assets_src
```

浏览器访问 `http://127.0.0.1:8765/index.html`。

## 构建 Android APK

本仓库默认忽略签名密钥 `release.keystore` 与编译输出目录 `build/`。在配置好 JDK 17 与 Android SDK（`aapt2`、`d8`、`zipalign`、`apksigner`）后运行：

```bash
python build_apk.py
```

> **安全提示**：`release.keystore` 请仅在本地妥善备份，切勿提交到远程仓库；覆盖安装旧版本 App 时必须使用同一签名密钥，否则系统会提示签名冲突。
