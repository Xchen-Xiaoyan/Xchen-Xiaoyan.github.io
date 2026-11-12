# 陈笑颜 · 成长地图作品集

按主题分区的手绘数据小镇。纯 HTML / CSS / JS,无构建、无外部 CDN,GitHub Pages 直接部署。
本地预览:`python -m http.server 8800`

## 以后新增一条经历
只改 `data.js`,在 `experiences` 里复制一段,改这些字段,地图、街区数量、项目清单、时间列表都会自动更新(不用写坐标):

| 字段 | 说明 |
|---|---|
| `id` | 唯一英文 id(也是网址 `#id`) |
| `district` | 所属街区,填 `districts` 里的 id |
| `icon` | 建筑外观:`office / tower / lab / library / bridge / observatory / house / workshop` |
| `start` / `end` | `'2026-03'` 格式;没有日期就写 `date: { zh, en }` 并省略 start/end |
| `short` | 地图近景短名(中文 ≤10 字,英文 ≤22 字符) |
| `name` `role` `org` `preview` | 完整标题、职位、机构、悬停预览一句话(中英文) |
| `background` `mine` `how` `result` | 详情四段(中英文,每段是字符串数组) |
| `links` `images` `tags` `pending` | 链接(url 为空则隐藏)、截图路径、标签、待补项 |

新增街区:在 `districts` 里加一项(`id` / `icon` / `name` / `blurb`),`icon` 可选 `internships / observatory / archive / lab`。
街区最多 6 个时位置是调好的,超过后自动排成网格。

## 文件
- `data.js` 内容 · `app.js` 地图与交互 · `icons.js` 建筑与装饰 · `style.css` 样式
- `projects/` 三个项目的完整说明页(地图详情里的链接指向这里)
