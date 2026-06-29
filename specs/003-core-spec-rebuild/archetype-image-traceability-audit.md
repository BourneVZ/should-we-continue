# Archetype 图片可追溯性审计表

更新时间：2026-06-29

## 1. 审计范围

本审计只覆盖当前 `core-spec-rebuild` 分支实际运行中的 25 张 archetype 图片：

- 24 张标准类型：`CTRL` 到 `FRAY`
- 1 张回退类型：`NOIS`

不覆盖 `001-core-functionality` 里的 `public/personas/P01-P12.svg` 那套 12 角色插画。

## 2. 审计口径

本表回答 4 个问题：

1. 当前页面展示的图片是否为固定资产，而不是运行时按用户答案现生成
2. 图片背后的类型是否真的由 15 维结果决定
3. 仓库里是否保留了足够的 prompt / 视觉规则证据，证明图片不是只看类型名瞎编
4. 是否存在“图片看起来合理，但生成链不可复核”的缺口

判定口径：

- `运行时固定资产`：代码直接映射到 `public/archetypes/<CODE>.png`
- `15维语义有来源`：该类型有 15 维原型或补丁值，且能从问卷向量匹配到该类型
- `视觉 prompt 证据较强`：仓库里有可复核的分层 prompt、类型层描述或锁脸约束
- `视觉 prompt 证据较弱`：只有家族语义和类型文案，没有保留该 PNG 的可复核最终 prompt

等级说明：

- `A`：有固定资产、有运行时映射、有 15 维语义来源，并且仓库里保留了较强的视觉 prompt 证据
- `B`：有固定资产、有运行时映射、有 15 维语义来源，但缺少该图的完整 prompt 留档

## 3. 核心证据

### 3.1 运行时并不现生成图片

- `CoreSpecRebuildApp` 直接读取 `archetype.artwork.posterPath` 或 `/archetypes/thumbs/<CODE>.png`，并未调用任何图像模型或 prompt 构造器。
- `model.ts` 把 24 个标准类型和 `NOIS` 映射到 `/archetypes/<CODE>.png`。

关键来源：

- `src/core-spec-rebuild/CoreSpecRebuildApp.tsx:122-127`
- `src/core-spec-rebuild/CoreSpecRebuildApp.tsx:156`
- `src/core-spec-rebuild/CoreSpecRebuildApp.tsx:169-175`
- `src/core-spec-rebuild/model.ts:819-837`
- `src/core-spec-rebuild/model.ts:848-851`

### 3.2 类型结果由 15 维向量决定

- 30 题先汇总成 15 个维度。
- `buildScoreVector()` 对每个维度取平均。
- `matchArchetype()` 用 15 维向量和 24 个 archetype prototype 做距离匹配；距离过大且矛盾过多时落到 `NOIS`。

关键来源：

- `src/core-spec-rebuild/model.ts:63-79`
- `src/core-spec-rebuild/scoring.ts:71-85`
- `src/core-spec-rebuild/scoring.ts:110-124`
- `src/core-spec-rebuild/scoring.ts:127-140`

### 3.3 视觉 prompt 留档并不完整

- `visual-prompt-system.md` 定义了应使用的 5 层 prompt 结构：统一风格、家族风格、单个类型设定、面部锁定、负向约束。
- `family-visual-reference-prompts.md` 只给出了 4 个代表类型的分层 prompt：`CTRL`、`BASE`、`HOLD`、`GLOW`。
- `projection-family-face-locks.md` 额外给出 `GLOW / FILM / NEST` 的差异化锁脸约束。
- 仓库里没有找到 25 张 `public/archetypes/*.png` 每张图各自的“最终原始 prompt 快照”。

关键来源：

- `specs/003-core-spec-rebuild/visual-prompt-system.md:11-17`
- `specs/003-core-spec-rebuild/visual-prompt-system.md:46-57`
- `specs/003-core-spec-rebuild/family-visual-reference-prompts.md:19-24`
- `specs/003-core-spec-rebuild/family-visual-reference-prompts.md:27-65`
- `specs/003-core-spec-rebuild/family-visual-reference-prompts.md:77-107`
- `specs/003-core-spec-rebuild/family-visual-reference-prompts.md:119-149`
- `specs/003-core-spec-rebuild/family-visual-reference-prompts.md:161-191`
- `specs/003-core-spec-rebuild/projection-family-face-locks.md:24-28`

### 3.4 与主规格要求存在缺口

`001-core-functionality/personas.md` 要求插画的生成提示、源文件、导出尺寸和映射留在仓库中，便于替换和审查。当前 25 archetype 分支已经满足“固定资产存在”，但没有满足“25 张逐张最终 prompt 可审计留档”。

关键来源：

- `specs/001-core-functionality/personas.md:157-168`

## 4. 总体结论

### 4.1 可以确认的事实

- 25/25 图片都是固定静态资产，尺寸统一为 `1024x1536`
- 25/25 图片都被运行时代码直接引用
- 25/25 类型都不是只靠名字硬映射；它们都先经过 15 维向量匹配，再选出对应图片
- 从整套图的视觉结果看，8 个家族的视觉分组是明显存在的，不像“只换标题”

### 4.2 不能确认的事实

- 不能确认 25 张 PNG 各自的最终生成 prompt
- 不能确认所有图片都严格按“5 层 prompt”完整执行过
- 未见证据表明图片生成直接使用了医学、心理学或社会学事实字段

### 4.3 审计判断

- 结论不是“仅根据类型名瞎编”
- 但也不能说“生成链完全可追溯”
- 更准确的表述是：
  当前图片与 15 维类型语义和家族视觉语法有明显对应关系，但仓库只保留了部分代表型 prompt 文档，没有保留 25 张最终 PNG 的逐张原始 prompt 快照，因此生成过程只能证明“不是纯名字瞎编”，不能证明“每张图都能逐步复盘”

## 5. 25 张逐张审计表

列说明：

- `15维语义来源`：对应 `ARCHETYPE_SPECS` 的语义文案与 `patch`
- `视觉证据`：仓库内是否存在该图的 prompt / 视觉约束留档
- `结论`：`A` 或 `B`
- `主要缺口`：缺失什么，导致无法完全复盘

| 类型 | 家族 | 资产 / 运行时 | 15维语义来源 | 视觉证据 | 结论 | 主要缺口 |
| --- | --- | --- | --- | --- | --- | --- |
| `CTRL` | control | `public/archetypes/CTRL.png`；运行时映射存在 | `model.ts:554-562` | 有代表性分层 prompt：`family-visual-reference-prompts.md:27-65`；另有旧版 seed prompt：`persona-sample-ctrl.md:128` | `A` | 无该 PNG 的最终 prompt 快照 |
| `SCAN` | control | `public/archetypes/SCAN.png`；运行时映射存在 | `model.ts:565-573` | 只有家族级视觉系统和类型语义；无 `SCAN` 专属 prompt 留档 | `B` | 缺 `SCAN` 类型层 prompt、锁脸约束、最终 prompt 快照 |
| `GRID` | control | `public/archetypes/GRID.png`；运行时映射存在 | `model.ts:576-584` | 只有家族级视觉系统；`visual-prompt-system.md:202` 有 `GRID` 作为示例句，不是最终 prompt | `B` | 缺 `GRID` 专属 prompt 和最终 prompt 快照 |
| `DRAG` | delay | `public/archetypes/DRAG.png`；运行时映射存在 | `model.ts:587-595` | 只有 delay 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `FOGG` | delay | `public/archetypes/FOGG.png`；运行时映射存在 | `model.ts:598-606` | 只有 delay 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `HUSH` | delay | `public/archetypes/HUSH.png`；运行时映射存在 | `model.ts:609-617` | 只有 delay 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `QCER` | audit | `public/archetypes/QCER.png`；运行时映射存在 | `model.ts:620-628` | 只有 audit 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `LIST` | audit | `public/archetypes/LIST.png`；运行时映射存在 | `model.ts:631-639` | 只有 audit 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `TICK` | audit | `public/archetypes/TICK.png`；运行时映射存在 | `model.ts:642-650` | 只有 audit 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `WALL` | boundary | `public/archetypes/WALL.png`；运行时映射存在 | `model.ts:653-661` | 只有 boundary 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `SOLO` | boundary | `public/archetypes/SOLO.png`；运行时映射存在 | `model.ts:664-672` | 只有 boundary 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `EXIT` | boundary | `public/archetypes/EXIT.png`；运行时映射存在 | `model.ts:675-683` | 只有 boundary 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `HOLD` | sacrifice | `public/archetypes/HOLD.png`；运行时映射存在 | `model.ts:686-694` | 有代表性分层 prompt：`family-visual-reference-prompts.md:119-149` | `A` | 无该 PNG 的最终 prompt 快照 |
| `GIVE` | sacrifice | `public/archetypes/GIVE.png`；运行时映射存在 | `model.ts:697-705` | 只有 sacrifice 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `SPNG` | sacrifice | `public/archetypes/SPNG.png`；运行时映射存在 | `model.ts:708-716` | 只有 sacrifice 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `GLOW` | projection | `public/archetypes/GLOW.png`；运行时映射存在 | `model.ts:719-727` | 有代表性分层 prompt：`family-visual-reference-prompts.md:161-191`；另有 projection 锁脸约束：`projection-family-face-locks.md:24-28` | `A` | 无该 PNG 的最终 prompt 快照 |
| `FILM` | projection | `public/archetypes/FILM.png`；运行时映射存在 | `model.ts:730-738` | 有 projection 专属锁脸与差异化约束：`projection-family-face-locks.md:24-28`；无完整分层 prompt | `A` | 缺 `FILM` 完整分层 prompt 和最终 prompt 快照 |
| `NEST` | projection | `public/archetypes/NEST.png`；运行时映射存在 | `model.ts:741-749` | 有 projection 专属锁脸与差异化约束：`projection-family-face-locks.md:24-28`；无完整分层 prompt | `A` | 缺 `NEST` 完整分层 prompt 和最终 prompt 快照 |
| `BASE` | foundation | `public/archetypes/BASE.png`；运行时映射存在 | `model.ts:752-760` | 有代表性分层 prompt：`family-visual-reference-prompts.md:77-107` | `A` | 无该 PNG 的最终 prompt 快照 |
| `LOAD` | foundation | `public/archetypes/LOAD.png`；运行时映射存在 | `model.ts:763-771` | 只有 foundation 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `PLAN` | foundation | `public/archetypes/PLAN.png`；运行时映射存在 | `model.ts:774-782` | 只有 foundation 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `SHAK` | disorder | `public/archetypes/SHAK.png`；运行时映射存在 | `model.ts:785-793` | 只有 disorder 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `CLAS` | disorder | `public/archetypes/CLAS.png`；运行时映射存在 | `model.ts:796-804` | 只有 disorder 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `FRAY` | disorder | `public/archetypes/FRAY.png`；运行时映射存在 | `model.ts:807-815` | 只有 disorder 家族通则和类型语义 | `B` | 缺类型层 prompt、锁脸约束、最终 prompt 快照 |
| `NOIS` | fallback | `public/archetypes/NOIS.png`；运行时映射存在 | `model.ts:839-869`；触发规则在 `scoring.ts:127-140` | 有 fallback / 噪点综合体规则说明：`visual-prompt-system.md:179-181`；无完整分层 prompt | `B` | 缺 `NOIS` 完整分层 prompt 和最终 prompt 快照 |

## 6. 人工抽检结论

对 25 张图做整套人工浏览后，可以看到明显的家族分组，不像“只换类型名”：

- control 家族：`CTRL / SCAN / GRID` 共享指挥台、风险标记、流程板和战术姿态
- delay 家族：`DRAG / FOGG / HUSH` 共享雾感、后撤、暂停和低刺激姿态
- audit 家族：`QCER / LIST / TICK` 共享验收、清单、勾选、交付板
- boundary 家族：`WALL / SOLO / EXIT` 共享边界、出口、隔离和自留空间
- sacrifice 家族：`HOLD / GIVE / SPNG` 共享负重、补位、照料、情绪承接
- projection 家族：`GLOW / FILM / NEST` 共享发光、想象、镜框、关系氛围
- foundation 家族：`BASE / LOAD / PLAN` 共享施工、承重、地基、结构与资源盘点
- disorder 家族：`SHAK / CLAS / FRAY` 共享多变量、打结、抖动、失序警报

因此，从成图结果看，它们并不是只按名字胡乱生成的。

## 7. 最终判断

如果把问题改写成两句判断：

- “这些图是不是运行时只拿类型名现编一张？”不是。
- “这些图的生成链是不是已经逐张留档到能复盘原始 prompt？”不是。

更准确的最终结论是：

1. 当前 25 张图的展示逻辑是“15 维匹配类型，再取固定图”，不是“拿类型名实时生图”。
2. 当前仓库能证明它们受家族语义和部分视觉 prompt 系统约束，但不能逐张证明最终 PNG 的原始 prompt。
3. 因此它们不是“纯按名字瞎编”，但属于“语义有约束、证据链不完整”的状态。

## 8. 建议的补档动作

若要把这套图片提升到真正可审计状态，至少应补 4 类文件：

1. `25` 张图各自的最终 prompt 快照
2. 每张图的来源模型、采样参数、生成日期和挑选说明
3. 每张图与 `familyId`、类型语义、锁脸约束的对应表
4. 当前 PNG 与其缩略图、备用图、源文件的映射表
