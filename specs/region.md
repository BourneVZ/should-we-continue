# Hangzhou Binjiang Region Configuration

更新时间：2026-06-26  
配置版本：`REGION-HZ-BJ-v1`  
适用区域：浙江省杭州市滨江区；MVP 不提供地区切换。

本文档定义地区事实卡片的唯一静态配置来源。它不构成医保、劳动、补贴、价格或资格建议；所有卡片只用于用户的资料核对和预算/行动清单，**不得**进入 `supportScore`、红旗、确定性、角色、深入模块排序或路径条件。

## 1. 字段合同与发布限制

每个地区字段必须具有：`fieldId`、`cardId`、`valueType`、`value`、`sourceId`、官方 `sourceUrl`、`lastVerifiedAt`、`applicability`、`uncertainty` 和 `scoringUse=forbidden`。缺任一字段时不得进入 MVP 静态配置或报告事实卡片。

本文件的 `lastVerifiedAt=2026-06-26` 表示本次仅对 `research.md` 中已登记链接和陈述做文档规范化，未联网重新核验网页内容。报告必须将该日期和“请以最新官方政策及本人单位/经办口径为准”同时展示；若产品上线前未完成网页人工复核，则不得将相应事实卡片发布到正式环境。

MVP 不包含未有可追溯来源的地区医院、社区机构、热线、法律援助、托育机构、排队信息、价格区间或服务可用性。成本只接受用户主动输入的预算，不提供静态市场价格。

## 2. 已登记静态字段

| fieldId / cardId | valueType / 静态值 | sourceId / 官方 sourceUrl | applicability | uncertainty |
| --- | --- | --- | --- | --- |
| `leave.zj.birth.first` / `REGION-CARD-ZJ-LEAVE` | `days`; 浙江一孩产假总计 158 天 | `SRC-ZJ-POPULATION-LAW-FTU` / https://www.zjftu.org/page/zj_zgh/zj_fwdt/zgh_fwdt_zclj/2022-04-26/38096773135051971.html | 浙江适用；需按劳动关系、单位制度和最新法规确认 | 不对个人资格、薪资或实际休假天数作承诺 |
| `leave.zj.birth.second_or_third` / `REGION-CARD-ZJ-LEAVE` | `days`; 浙江二孩、三孩产假总计 188 天 | `SRC-ZJ-POPULATION-LAW-FTU` / https://www.zjftu.org/page/zj_zgh/zj_fwdt/zgh_fwdt_zclj/2022-04-26/38096773135051971.html | 浙江适用；需核对具体生育情形与单位口径 | 不对个人资格、薪资或实际休假天数作承诺 |
| `leave.zj.partner_care` / `REGION-CARD-ZJ-LEAVE` | `days`; 男方护理假 15 天 | `SRC-ZJ-POPULATION-LAW-FTU` / https://www.zjftu.org/page/zj_zgh/zj_fwdt/zgh_fwdt_zclj/2022-04-26/38096773135051971.html | 浙江适用；需核对劳动关系与单位制度 | 不对实际获批作承诺 |
| `leave.zj.childcare_each_parent` / `REGION-CARD-ZJ-LEAVE` | `days_per_year`; 子女 3 周岁内，夫妻双方每年各 10 天育儿假 | `SRC-ZJ-POPULATION-LAW-FTU` / https://www.zjftu.org/page/zj_zgh/zj_fwdt/zgh_fwdt_zclj/2022-04-26/38096773135051971.html | 子女年龄、父母身份和单位制度须另行确认 | 不对个人资格或可拆分方式作承诺 |
| `leave.cn.miscarriage_under_4_months` / `REGION-CARD-CN-LEAVE` | `days`; 怀孕未满 4 个月流产，15 天产假 | `SRC-MOJ-WOMEN-LABOR` / https://xzfg.moj.gov.cn/law/download?LawID=343&type=pdf | 中国法规背景；需由单位/专业人员核实适用情况 | 不解释孕周、医疗情形或实际休假资格 |
| `leave.cn.miscarriage_4_months_or_more` / `REGION-CARD-CN-LEAVE` | `days`; 怀孕满 4 个月流产，42 天产假 | `SRC-MOJ-WOMEN-LABOR` / https://xzfg.moj.gov.cn/law/download?LawID=343&type=pdf | 中国法规背景；需由单位/专业人员核实适用情况 | 不解释孕周、医疗情形或实际休假资格 |
| `benefit.hz.allowance_direct_payment` / `REGION-CARD-HZ-ALLOWANCE` | `policy_notice`; 已登记 2025 年杭州生育津贴直发个人改革信息 | `SRC-NHSA-HZ-ALLOWANCE-2025` / https://www.nhsa.gov.cn/art/2025/5/14/art_52_16510.html | 杭州参保与待遇相关人员；个人资格、金额、申领与到账均须向医保/单位确认 | 只提示核对渠道，不展示金额或资格结论 |
| `benefit.hz.birth_service_package` / `REGION-CARD-HZ-SERVICE-PACK` | `policy_notice`; 已登记 2026 年杭州“生育服务包”信息 | `SRC-NHSA-HZ-SERVICE-PACK-2026` / https://www.nhsa.gov.cn/art/2026/2/12/art_14_19662.html | 杭州相关参保和服务情形；必须另核对范围、医院、结算与资格 | 不把服务包覆盖内容作为事实摘要或路径条件 |
| `benefit.hz.second_child_one_time` / `REGION-CARD-HZ-CHILD-BENEFIT` | `currency_cny`; 二孩一次性补助 2000 元 | `SRC-HZ-BIRTH-ALLOWANCE` / https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml | 二孩、申请时点、建册/户籍/出生等条件均须逐项确认 | 不对当前用户、资格或可领取金额作承诺 |
| `benefit.hz.third_child_one_time` / `REGION-CARD-HZ-CHILD-BENEFIT` | `currency_cny`; 三孩一次性补助 5000 元 | `SRC-HZ-BIRTH-ALLOWANCE` / https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml | 三孩、申请时点、建册/户籍/出生等条件均须逐项确认 | 不对当前用户、资格或可领取金额作承诺 |
| `benefit.hz.under3_annual` / `REGION-CARD-HZ-CHILD-BENEFIT` | `currency_cny_per_year`; 3 周岁以下婴幼儿育儿补贴每孩每年 3600 元 | `SRC-HZ-BIRTH-ALLOWANCE` / https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml | 年龄、户籍、申请时点及其它条件须核对 | 不对当前用户、资格、累计金额或发放周期作承诺 |

所有上表字段的统一元数据为：`lastVerifiedAt=2026-06-26`，`scoringUse=forbidden`，`reportUse=reference_only`，`cacheTtlDays=7`。同一卡片中字段的来源、日期和限制必须逐字段保留，不得合并成无来源的“福利总览”。

## 3. 官方白名单与用户主动刷新

仅当用户主动点击“检查最新地区信息”时，服务端才可访问下列 HTTPS URL；客户端不得传入 URL、主机名或重定向目标。白名单只用于提取与上表 `fieldId` 完全一致的候选字段，不能用来发现新机构、热线、价格或泛化网页内容。

| allowlistId | 允许 URL | 可更新 fieldId |
| --- | --- | --- |
| `WL-ZJ-LEAVE` | https://www.zjftu.org/page/zj_zgh/zj_fwdt/zgh_fwdt_zclj/2022-04-26/38096773135051971.html | `leave.zj.*` |
| `WL-CN-WOMEN-LABOR` | https://xzfg.moj.gov.cn/law/download?LawID=343&type=pdf | `leave.cn.*` |
| `WL-HZ-ALLOWANCE` | https://www.nhsa.gov.cn/art/2025/5/14/art_52_16510.html | `benefit.hz.allowance_direct_payment` |
| `WL-HZ-SERVICE-PACK` | https://www.nhsa.gov.cn/art/2026/2/12/art_14_19662.html | `benefit.hz.birth_service_package` |
| `WL-HZ-CHILD-BENEFIT` | https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml | `benefit.hz.second_child_one_time`, `benefit.hz.third_child_one_time`, `benefit.hz.under3_annual` |

候选字段必须通过固定 schema：`fieldId`、`valueType`、`value`、`sourceUrl`、`lastVerifiedAt`、`applicability`、`uncertainty`、`evidenceExcerptHash`。`sourceUrl` 必须与同一 `allowlistId` 完全相等；不允许 HTTP、URL 参数替换、跨域重定向、非文本/过大响应或缺少任一必填证据。模型如参与，只能从抓取后的受限文本提出候选；不能自行认定事实。

## 4. 缓存、冲突与失败

- 成功且 schema 通过的候选字段仅缓存到当前浏览器，`expiresAt = verifiedAt + 7 天`；不上传到数据库。
- 未过期缓存可作为“已核对”卡片显示。超过 7 天未主动刷新时可继续显示，但必须标记 `freshnessState=possibly_stale`、显示来源 URL 和最后核对日期。
- 两个白名单来源对同一 `fieldId` 给出不同值时，缓存记录 `conflict`，报告只并列显示各自值、URL 和日期，使用 `RPT-REGION-CARD` 的冲突模式；不自动选择、不覆盖静态值、不进入评分、确定性、推荐或路径条件。
- 抓取、超时、响应限制、解析、模型候选或 schema 校验任一失败时，不写入/覆盖缓存，不记录原始响应，不显示失败候选。保留已有静态卡片（若有）并显示 `RPT-REGION-UNAVAILABLE`；没有静态卡片时只显示通用核对清单。
- 用户未主动触发刷新时不得联网。地区卡片、缓存状态和刷新结果永远是参考信息，`scoringUse=forbidden` 不得被绕过。

## 5. 测试清单

后续测试必须验证：每个静态字段均含来源、日期、适用条件和不确定性；无来源机构/热线/价格不存在；客户端 URL 被拒绝；非白名单、HTTP、重定向、超大和非文本响应被拒绝；字段证据不全不展示；7 天缓存标记；冲突并列；失败不覆盖；以及地区字段不进入九维、红旗、角色、推荐或路径条件。
