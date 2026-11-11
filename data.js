/* =====================================================================
   内容集中在这个文件里。想改经历、链接、截图,只需要编辑这里。
   - 所有文字都是 { zh: '中文', en: 'English' } 的形式
   - links: 没有 url 的链接不会显示;把 url 填上就会出现
   - images: src 是相对于 index.html 的路径,把截图放进 assets/img/ 即可
   - 「待补」的内容写在 pending 里,会显示成小标签,补好后删掉即可
   - pos 是桌面地图上的位置(百分比),mpos 是手机路线上的位置
   ===================================================================== */
window.PORTFOLIO = {
  profile: {
    name: { zh: '陈笑颜', en: 'Xiaoyan Chen' },
    email: 'smile202406@163.com',
    github: 'https://github.com/Xchen-Xiaoyan',
    oldSite: 'https://xchen-xiaoyan.github.io',
    intro: {
      zh: '芝加哥大学应用数据科学硕士在读(预计 2026.12 毕业,GPA 4.00),本科毕业于威斯康星大学麦迪逊分校数学与数据科学专业(GPA 3.90)。做过数据分析实习、机器学习与计算机视觉项目,关注把杂乱的数据做成可复现、可解释的分析与模型。',
      en: 'M.S. in Applied Data Science at the University of Chicago (expected Dec 2026, GPA 4.00); B.S. in Mathematics and Data Science from UW–Madison (GPA 3.90). I have worked on data-analysis internships plus machine-learning and computer-vision projects, turning messy data into reproducible, explainable analyses and models.'
    }
  },

  experiences: [
    {
      id: 'frog',
      icon: 'office',
      sortKey: '2024-06',
      start: '2024-06', end: '2024-10',
      mapName: { zh: 'Frog 数据分析实习', en: 'Frog · Data Analyst Intern' },
      kind: { zh: '办公楼', en: 'Office' },
      name: { zh: 'Frog 社交 App · 数据分析实习', en: 'Frog Social App · Data Analyst Intern' },
      role: { zh: '数据分析实习生', en: 'Data Analyst Intern' },
      org: '北京七上八上科技有限公司 · Beijing Qishangbashang Technology Co., Ltd.',
      preview: {
        zh: '用 SQL 和 Python 把社交 App 的留存、转化和商业化数据变成每周报表。',
        en: 'SQL and Python turn a social app’s retention, conversion and monetization data into weekly reports.'
      },
      pos: { x: 10, y: 62 }, mpos: { x: 30, y: 230 },
      background: {
        zh: ['Frog 是一款社交应用,有内容发布、观看、互动和钱包商业化等场景,需要持续的数据支持。', '数据需求来自产品、运营和海外同事,指标口径需要对齐。'],
        en: ['Frog is a social app with content publishing, viewing, interaction and wallet monetization, all needing steady data support.', 'Requests came from product, operations and overseas colleagues, so metric definitions had to be aligned.']
      },
      mine: {
        zh: ['用 SQL 提取行为日志和业务表,做留存、转化和商业化分析', '把重复的 Excel 报表更新改成 Python 脚本回填', '对接海外同事的数据需求,澄清指标和数据口径'],
        en: ['Queried behavior logs and business tables for retention, conversion and monetization analysis', 'Replaced repetitive Excel report updates with a Python backfill script', 'Clarified metrics and data requirements with overseas colleagues']
      },
      how: {
        zh: ['用 Hive SQL、Redshift 做多表关联、去重和分组聚合,区分新老用户和地区口径', '用 Python / Pandas 把查询结果按日期和指标映射回填 Excel,计算人均指标、整理奖励分布', '把数仓结果接入可视化工具,排查异常数据', '撰写产品体验报告,记录分享、续拍、聊天、刮奖等功能的体验问题'],
        en: ['Hive SQL and Redshift: multi-table joins, de-duplication and group aggregation, split by new/returning users and region', 'Python / Pandas mapped query results to dates and metrics in Excel, computed per-user measures and reward distributions', 'Connected warehouse outputs to visualization tools and investigated anomalies', 'Wrote a product experience report on sharing, retake, chat and scratch-card features']
      },
      result: {
        zh: ['交付:留存 / 转化 / 内容发布 / 商业化指标分析、周报与广告效果分析', '交付:Excel 自动回填脚本(替代手工重复操作)', '交付:产品体验报告'],
        en: ['Delivered: retention, conversion, content and monetization analyses, plus weekly and ad-performance reports', 'Delivered: an Excel auto-backfill script replacing manual repetition', 'Delivered: a product experience report']
      },
      tags: ['Hive SQL', 'Redshift', 'Python', 'Pandas', 'Excel'],
      pending: { zh: ['量化成果待补'], en: ['Quantified impact TBD'] },
      links: [], images: []
    },

    {
      id: 'bairong',
      icon: 'tower',
      sortKey: '2024-10',
      start: '2024-10', end: '2025-01',
      mapName: { zh: '百融云创 数据运营实习', en: 'Bairong · Data Operations Intern' },
      kind: { zh: '办公楼', en: 'Office' },
      name: { zh: '百融云创 · 数据运营管理实习', en: 'Bairong Cloud · Data Operations Management Intern' },
      role: { zh: '数据运营管理实习生', en: 'Data Operations Management Intern' },
      org: '北京百融云创科技股份有限公司 · Beijing Bairong Cloud Technology Co., Ltd.',
      preview: {
        zh: '把信贷营销数据、圈选模型回溯和语音对话样本,变成可比较的结论。',
        en: 'Turned credit-marketing data, model back-tests and voice-dialogue samples into comparable findings.'
      },
      pos: { x: 27, y: 78 }, mpos: { x: 70, y: 470 },
      background: {
        zh: ['金融营销需要比较不同触达策略的效果,并评估营销模型圈选出的人群表现。', '智能语音对话也需要真实样本来迭代识别规则和话术。'],
        en: ['Financial marketing needs outreach strategies compared and model-selected audiences evaluated.', 'The voice-dialogue system also needed real samples to iterate its recognition rules and scripts.']
      },
      mine: {
        zh: ['整理供应商平台的营销数据,计算接通率、转化率', '参与营销模型效果回溯与圈选方案评估', '标注对话样本,分析语音识别和语义理解问题'],
        en: ['Prepared vendor-platform marketing data and calculated connection and conversion rates', 'Took part in model back-testing and targeting evaluation', 'Labeled dialogue samples and analyzed speech-recognition and NLU errors']
      },
      how: {
        zh: ['用 Python 清洗数据,比较不同触达策略的接通率和转化率', '按评分区间对比首登、复申请的登录、申请、授信表现;分析单模型与交叉圈选的析出率、授信量占比和提升倍数', '对照录音核对 ASR 转写,标注客户意图,分析 NLU 错误并建议调整关键词和优先级', '评估 TTS 的发音、停顿、语速和自然度'],
        en: ['Cleaned data with Python and compared connection and conversion rates across outreach strategies', 'Compared login, application and approval outcomes by score band; analyzed selection rate, approval coverage and lift for single and combined models', 'Checked ASR transcripts against recordings, labeled intent, analyzed NLU errors and proposed keyword and priority changes', 'Evaluated TTS pronunciation, pauses, rate and naturalness']
      },
      result: {
        zh: ['交付:触达策略对比与复盘数据', '交付:评分区间与交叉圈选方案的效果对比,支持圈选阈值评估', '交付:识别问题清单,以及关键词与优先级调整建议'],
        en: ['Delivered: outreach-strategy comparison data for performance reviews', 'Delivered: score-band and combined-targeting comparisons to support threshold decisions', 'Delivered: a list of recognition issues with keyword and priority recommendations']
      },
      tags: ['Python', 'Excel', 'ASR / NLU', 'TTS'],
      pending: { zh: ['量化成果待补'], en: ['Quantified impact TBD'] },
      links: [], images: []
    },

    {
      id: 'credit',
      icon: 'lab',
      sortKey: '2025-09',
      start: '2025-09', end: '2025-12',
      mapName: { zh: '信用卡违约风险预测', en: 'Credit Card Default Prediction' },
      kind: { zh: '风控实验室', en: 'Risk lab' },
      name: { zh: '信用卡客户违约风险预测', en: 'Credit Card Customer Default Risk Prediction' },
      role: { zh: '项目组长(课程团队项目)', en: 'Team Lead (course team project)' },
      org: 'University of Chicago',
      preview: {
        zh: '带队用 FLAML 选模型、MLflow 管实验,把违约预测做成可复现的流程。',
        en: 'Led a team using FLAML for model selection and MLflow for tracking, so default prediction is reproducible.'
      },
      pos: { x: 45, y: 64 }, mpos: { x: 30, y: 710 },
      background: {
        zh: ['课程团队项目:根据客户数据预测信用卡违约风险。', '除了模型本身,还要求实验可追踪、结果可复现。'],
        en: ['A course team project: predict credit-card default risk from customer data.', 'Beyond the model itself, experiments had to be traceable and results reproducible.']
      },
      mine: {
        zh: ['担任组长,统筹分工和进度', '负责数据清洗、特征准备和模型评估', '搭建实验记录和容器化训练流程'],
        en: ['Team lead, coordinating tasks and progress', 'Data cleaning, feature preparation and model evaluation', 'Set up experiment tracking and containerized training']
      },
      how: {
        zh: ['清洗客户数据并准备特征', '用 FLAML 做算法选择和超参数优化,训练并评估 LightGBM 违约预测模型', '用 MLflow 记录参数与指标,对比数据漂移前后的模型表现', '用 Docker 和 Kubernetes 运行容器化训练,保证可复现'],
        en: ['Cleaned customer data and prepared features', 'Used FLAML for algorithm selection and hyperparameter tuning; trained and evaluated a LightGBM default model', 'Logged parameters and metrics in MLflow and compared performance before and after data drift', 'Ran containerized training on Docker and Kubernetes for reproducibility']
      },
      result: {
        zh: ['产出:LightGBM 违约预测模型及评估', '产出:数据漂移前后的表现对比', '产出:可复现的容器化训练流程'],
        en: ['Output: a LightGBM default-prediction model with evaluation', 'Output: performance comparison before and after data drift', 'Output: a reproducible containerized training workflow']
      },
      tags: ['LightGBM', 'FLAML', 'MLflow', 'Docker', 'Kubernetes'],
      pending: { zh: ['公开代码待补', '量化指标待补'], en: ['Public code TBD', 'Metrics TBD'] },
      links: [{ label: { zh: '代码', en: 'Code' }, url: '' }], images: []
    },

    {
      id: 'news',
      icon: 'library',
      sortKey: '2025-12',
      start: '2025-12', end: '2026-02',
      mapName: { zh: 'AI 新闻分析 & RAG 问答', en: 'AI News Analysis & RAG Q&A' },
      kind: { zh: '新闻档案馆', en: 'News archive' },
      name: { zh: 'AI 行业新闻分析与 RAG 问答系统', en: 'AI Industry News Analysis & RAG Q&A System' },
      role: { zh: '项目组长', en: 'Team Lead' },
      org: 'University of Chicago',
      preview: {
        zh: '13 万篇 AI 新闻 → 主题分析,再做成每句都标出处的问答系统。',
        en: '130k+ AI news articles → topic analysis → a Q&A system that cites a source for every sentence.'
      },
      pos: { x: 60, y: 36 }, mpos: { x: 70, y: 950 },
      background: {
        zh: ['想了解 AI 如何影响各个行业和公司,自己翻新闻太慢;直接问大模型又无法核实,还可能编造。', '目标:快,而且每句话都能追溯到原文。'],
        en: ['Reading the news yourself is slow; asking a chatbot is fast but unverifiable and sometimes invented.', 'Goal: fast, with every claim traceable to its source.']
      },
      mine: {
        zh: ['担任组长,负责分析方案和整体推进', '语料处理与主题建模', '检索增强问答(RAG)系统及其评测'],
        en: ['Team lead for the analysis plan and delivery', 'Corpus preparation and topic modeling', 'The retrieval-augmented Q&A (RAG) system and its evaluation']
      },
      how: {
        zh: ['语料:13 万+ 篇 AI 新闻,经去重、相关性筛选、网页噪声清理和文本标准化,剩 3.3 万篇 / 18.8 万段', '主题:用 embedding、BERTopic、UMAP、HDBSCAN 发现主题,通过主题合并和代表文本检查提升可解释性', '检索:BM25 与向量检索混合(RRF 融合),再用交叉编码器重排序', '生成:要求每句话标注来源,问题超出新闻库范围时明确拒答', '评测:构建 75 题人工审核评测集,做消融实验和置信区间'],
        en: ['Corpus: 130k+ AI news articles; de-duplication, relevance filtering, web-noise removal and normalization left 33k articles / 188k passages', 'Topics: embeddings, BERTopic, UMAP and HDBSCAN; topic reduction and representative-text review for interpretability', 'Retrieval: BM25 and dense vectors fused with RRF, then a cross-encoder reranker', 'Generation: every sentence cites a source; out-of-scope questions are declined', 'Evaluation: a reviewed 75-question set with ablations and confidence intervals']
      },
      result: {
        zh: ['Hit@1 0.80 / Hit@10 0.98(75 题人工审核评测集)', '无法回答的问题,正确拒答率 81% → 100%', 'CPU 重排延迟 11 秒 → 1.5 秒', '在线可试用,回答中的 [n] 可点击跳转到对应新闻'],
        en: ['Hit@1 0.80 / Hit@10 0.98 on the reviewed 75-question set', 'Correct abstention on unanswerable questions: 81% → 100%', 'CPU rerank latency: 11 s → 1.5 s', 'Live demo online; each [n] in an answer links to its news article']
      },
      tags: ['BERTopic', 'BM25', 'bge embeddings', 'Cross-encoder', 'FastAPI', 'Streamlit'],
      pending: { zh: ['RAG 部分的具体时间待补'], en: ['Exact dates of the RAG part TBD'] },
      links: [
        { label: { zh: '在线演示', en: 'Live demo' }, url: 'https://ai-news-rag.streamlit.app' },
        { label: { zh: '代码', en: 'Code' }, url: 'https://github.com/Xchen-Xiaoyan/ai-news-rag' },
        { label: { zh: '完整项目页', en: 'Full write-up' }, url: 'https://xchen-xiaoyan.github.io/projects/rag.html' }
      ],
      images: [{ src: 'assets/img/rag-demo.jpg', alt: { zh: '在线演示截图:回答中的 [n] 可跳转到对应新闻', en: 'Live demo screenshot: each [n] jumps to its news article' } }]
    },

    {
      id: 'here',
      icon: 'bridge',
      sortKey: '2026-03',
      start: '2026-03', end: '2026-07',
      mapName: { zh: 'HERE 桥梁净高估计', en: 'HERE · Clearance Height' },
      kind: { zh: '路桥测量站', en: 'Survey station' },
      name: { zh: 'HERE Technologies · 街景照片估计净空高度', en: 'HERE Technologies · Clearance Height from Street Imagery' },
      role: { zh: '机器学习 / 计算机视觉项目成员(企业合作毕业项目)', en: 'ML / Computer Vision team member (industry capstone)' },
      org: 'HERE Technologies · Chicago, IL',
      preview: {
        zh: '只靠街景照片,估计路牌和桥梁下方的净空高度。',
        en: 'Estimating clearance height under signs and bridges from street-level photos alone.'
      },
      pos: { x: 76, y: 62 }, mpos: { x: 30, y: 1190 },
      background: {
        zh: ['与 HERE Technologies 合作的毕业项目(Capstone):4 人团队,HERE 一位同事对接,学校导师指导。', '目标:只用街景照片,估计路牌和桥梁等头顶结构的净空高度。'],
        en: ['A capstone with HERE Technologies: a team of four, a HERE sponsor contact and a faculty advisor.', 'Goal: estimate the clearance height of road signs and overhead structures from street-level photos only.']
      },
      mine: {
        zh: ['把多个 AI 模型接入测量流程', '搭建街景取图流程', '设计与真实高度标注对比的自动评估,并分析误差'],
        en: ['Connected several AI models into the measurement pipeline', 'Built the street-image retrieval pipeline', 'Designed automated evaluation against ground-truth heights and analyzed errors']
      },
      how: {
        zh: ['用 Python 和 Mapillary API 按地理范围检索、提取连续帧,并做可见性过滤,得到同一目标的多视角图片', '整合 Depth Anything 3、VGGT 和 SAM3,完成目标分割、单目深度估计、三维重建和真实尺度的净空高度估计', '按单帧和多视角两种口径,与真实高度标注自动对比', '分析误差,过滤分割质量差、深度不稳定的结果'],
        en: ['Python and the Mapillary API for geographic search, consecutive-frame extraction and visibility filtering, giving multi-view images of each target', 'Integrated Depth Anything 3, VGGT and SAM3 for segmentation, monocular depth, 3D reconstruction and real-scale clearance estimation', 'Automated frame-level and multi-view comparison with ground-truth height labels', 'Analyzed errors and filtered poor segmentations and unstable depth estimates']
      },
      result: {
        zh: ['产出:从街景取图、分割、深度与三维重建、估高到自动评估的完整流程', '产出:单帧与多视角的误差分析'],
        en: ['Output: an end-to-end pipeline from street imagery, segmentation, depth and 3D reconstruction to height estimation and automated evaluation', 'Output: frame-level and multi-view error analysis']
      },
      tags: ['Python', 'Mapillary API', 'Depth Anything 3', 'VGGT', 'SAM3'],
      pending: { zh: ['精度等量化结果待补', '截图待补'], en: ['Accuracy figures TBD', 'Screenshots TBD'] },
      links: [], images: []
    },

    {
      id: 'olist',
      icon: 'observatory',
      sortKey: '9999',
      date: { zh: '时间待补', en: 'Date TBD' },
      mapName: { zh: 'Olist 电商分析看板', en: 'Olist E-commerce Dashboard' },
      kind: { zh: '数据观测站', en: 'Observatory' },
      name: { zh: 'Olist 电商经营分析看板(Power BI)', en: 'Olist E-commerce Performance Dashboard (Power BI)' },
      role: { zh: '个人项目', en: 'Personal project' },
      org: 'Olist public dataset',
      preview: {
        zh: '10 万笔订单的 6 页 Power BI 看板:增长靠拉新,问题集中在少数卖家。',
        en: 'A six-page Power BI dashboard on 100k orders: growth came from new buyers; problems sit with a few sellers.'
      },
      pos: { x: 87, y: 36 }, mpos: { x: 70, y: 1430 },
      background: {
        zh: ['基于巴西电商 Olist 公开的 10 万笔订单、9 张业务表。', '想回答三个问题:增长从哪里来?问题出在哪里?该对谁做什么?'],
        en: ['Built on Olist’s public Brazilian e-commerce data: 100k orders across 9 tables.', 'Three questions: where did growth come from, what is going wrong, and who should be targeted?']
      },
      mine: {
        zh: ['独立完成:数据清洗、星型建模、指标体系、交互看板和业务建议'],
        en: ['End to end on my own: cleaning, star-schema modeling, metric layer, interactive dashboard and recommendations']
      },
      how: {
        zh: ['用 customer_unique_id 识别真实买家(customer_id 每单一个,会让复购率变成 0)', '订单 / 商品双粒度事实表 + 四张维度表,用对账断言校验 GMV', '用 DuckDB SQL 和 Python 处理数据,Power BI + DAX 建指标和看板', '6 个页面:经营总览、GMV 拆解、履约与体验、卖家分析、用户分层(RFM)、用户留存'],
        en: ['Identified real buyers by customer_unique_id (customer_id is per order and would make repeat rate zero)', 'Order- and item-grain fact tables plus four dimension tables, with reconciliation assertions on GMV', 'DuckDB SQL and Python for data prep; Power BI and DAX for measures and report pages', 'Six pages: overview, GMV decomposition, fulfillment, sellers, RFM segments, retention']
      },
      result: {
        zh: ['GMV 同比 +140%,几乎全部来自拉新', '10% 的卖家造成 74% 的延迟订单', '准时订单平均评分 4.29,延迟订单 2.27', '下面可以切换看板页面,逐页看结论'],
        en: ['YoY GMV +140%, almost all from new buyers', '10% of sellers cause 74% of late orders', 'Average review 4.29 on time vs 2.27 when late', 'Switch dashboard pages below to see each finding']
      },
      tags: ['SQL (DuckDB)', 'Python', 'Power BI', 'DAX', 'RFM', 'Cohort analysis'],
      pending: { zh: ['项目时间待补'], en: ['Project dates TBD'] },
      links: [
        { label: { zh: '代码与报表文件', en: 'Code & report files' }, url: 'https://github.com/Xchen-Xiaoyan/olist-bi-dashboard' },
        { label: { zh: '完整项目页', en: 'Full write-up' }, url: 'https://xchen-xiaoyan.github.io/projects/olist-bi.html' }
      ],
      images: [],
      /* 小互动:切换看板页面,每页配一个结论。数字来自原项目页。 */
      tour: {
        title: { zh: '看板巡览:每页回答一个问题', en: 'Dashboard tour: one question per page' },
        steps: [
          { tab: { zh: 'GMV 拆解', en: 'GMV' }, q: { zh: '增长从哪里来?', en: 'Where did growth come from?' },
            a: { zh: 'GMV = 买家数 × 人均订单数 × 客单价。2018 年 GMV 同比 +140%,买家数 +139%,另外两项基本持平;新买家贡献约 97% 的 GMV。', en: 'GMV = buyers × orders per buyer × AOV. 2018 GMV grew 140% YoY with buyers +139% while the other two stayed flat; new buyers made up ~97% of GMV.' },
            img: 'assets/img/olist-growth.jpg', alt: { zh: 'GMV 拆解页截图', en: 'GMV decomposition page' } },
          { tab: { zh: '履约与体验', en: 'Fulfillment' }, q: { zh: '什么在拉低评分?', en: 'What drags reviews down?' },
            a: { zh: '准时订单平均 4.29 分,延迟订单 2.27 分;延迟超过 7 天的订单只有 1.70 分。', en: 'On-time orders average 4.29 stars, late ones 2.27; orders over 7 days late average only 1.70.' },
            img: 'assets/img/olist-fulfillment.jpg', alt: { zh: '履约与体验页截图', en: 'Fulfillment page' } },
          { tab: { zh: '卖家分析', en: 'Sellers' }, q: { zh: '问题集中在哪些卖家?', en: 'Which sellers cause the problems?' },
            a: { zh: '头部 10% 的卖家贡献 66.5% 的 GMV;延迟最多的 10% 卖家造成 73.8% 的延迟订单。针对少数卖家治理就能见效。', en: 'The top 10% of sellers make 66.5% of GMV; the 10% with most delays cause 73.8% of late orders, so targeting a few sellers works.' },
            img: 'assets/img/olist-sellers.jpg', alt: { zh: '卖家分析页截图', en: 'Sellers page' } },
          { tab: { zh: '用户分层', en: 'RFM' }, q: { zh: '该对谁做什么?', en: 'Who should be targeted?' },
            a: { zh: '“高价值待唤醒”客户只占 9.4% 的买家,却贡献 21.7% 的 GMV,是明确的召回目标。', en: 'Lapsed high-value buyers are 9.4% of buyers but 21.7% of GMV: a clear reactivation target.' },
            img: 'assets/img/olist-rfm.jpg', alt: { zh: '用户分层页截图', en: 'RFM page' } },
          { tab: { zh: '用户留存', en: 'Retention' }, q: { zh: '用户会回来吗?', en: 'Do customers come back?' },
            a: { zh: '复购率只有 3.0%。同期群热力矩阵展示了首购后第 1–12 个月的留存。', en: 'Repeat purchase rate is only 3.0%. The cohort heatmap shows retention over months 1–12 after the first purchase.' },
            img: 'assets/img/olist-retention.jpg', alt: { zh: '用户留存页截图', en: 'Retention page' } }
        ]
      }
    }
  ],

  ui: {
    zh: {
      siteTitle: '陈笑颜 · 成长地图',
      kicker: '我的成长地图 · 6 段经历',
      hint: '点击地图上的地点,看我在那里做了什么。',
      start: '开始探索', all: '查看全部经历', contact: '联系我',
      mapLabel: '成长地图:6 个可点击的地点',
      sec: { background: '背景', mine: '我负责什么', how: '我怎么做', result: '结果或产出' },
      prev: '上一段', next: '下一段', close: '关闭详情', of: '/',
      logTitle: '全部经历(按时间排序)', logHint: '点击任意一项查看详情', logClose: '关闭列表',
      contactTitle: '联系我', contactText: '欢迎聊聊数据分析、机器学习和 AI 产品方向的机会与合作。',
      email: '邮箱', github: 'GitHub', oldSite: '更多项目细节',
      pending: '待补', tags: '技术与工具', links: '链接', switchTo: 'EN', switchLabel: 'Switch to English',
      signStart: '起点', signEnd: '未完待续', opened: '已打开:', tourLabel: '看板页面',
      footer: '© 2026 陈笑颜 · 手绘成长地图'
    },
    en: {
      siteTitle: 'Xiaoyan Chen · Growth Map',
      kicker: 'My growth map · 6 stops',
      hint: 'Click a place on the map to see what I did there.',
      start: 'Start exploring', all: 'View all experience', contact: 'Contact me',
      mapLabel: 'Growth map with 6 clickable places',
      sec: { background: 'Background', mine: 'My role', how: 'How I did it', result: 'Outcome' },
      prev: 'Previous', next: 'Next', close: 'Close details', of: '/',
      logTitle: 'All experience (chronological)', logHint: 'Pick any item to open its details', logClose: 'Close list',
      contactTitle: 'Contact me', contactText: 'Happy to talk about data analysis, machine learning and AI product roles or collaborations.',
      email: 'Email', github: 'GitHub', oldSite: 'More project details',
      pending: 'TBD', tags: 'Tech & tools', links: 'Links', switchTo: '中文', switchLabel: '切换为中文',
      signStart: 'Start', signEnd: 'More soon', opened: 'Opened: ', tourLabel: 'Dashboard pages',
      footer: '© 2026 Xiaoyan Chen · hand-drawn growth map'
    }
  },

  /* 地图上的装饰:x/y 为桌面端百分比位置,w 为宽度(占地图宽度的 %),m 为手机上的位置 */
  decor: [
    { t: 'tree', x: 5, y: 95, w: 4.5, m: { x: 8, y: 330, w: 52 } },
    { t: 'pine', x: 20, y: 94, w: 3.6, m: { x: 90, y: 650, w: 44 } },
    { t: 'tree', x: 37, y: 52, w: 4, m: { x: 10, y: 560, w: 50 } },
    { t: 'pine', x: 69, y: 93, w: 3.6, m: { x: 12, y: 900, w: 44 } },
    { t: 'tree', x: 84, y: 91, w: 4.5, m: { x: 88, y: 1160, w: 50 } },
    { t: 'pine', x: 96, y: 64, w: 3.6, m: { x: 10, y: 1480, w: 44 } },
    { t: 'tree', x: 50, y: 27, w: 3.8, m: { x: 90, y: 330, w: 50 } },
    { t: 'cloud', x: 46, y: 12, w: 12, m: { x: 70, y: 70, w: 110 } },
    { t: 'cloud', x: 74, y: 14, w: 10, m: { x: 22, y: 700, w: 90 } },
    { t: 'cloud', x: 95, y: 12, w: 8, m: { x: 80, y: 1090, w: 90 } },
    { t: 'sign', x: 18.5, y: 62, w: 6.5, text: 'signStart', m: { x: 55, y: 215, w: 70 } },
    { t: 'sign', x: 93, y: 60, w: 7.5, text: 'signEnd', m: { x: 40, y: 1590, w: 84 } }
  ]
};
