# Scoring Spec

更新时间：2026-06-28

## 1. 总体原则

- 内部评分追求模式分化，不追求临床解释
- 前台不展示精确分数
- 结果来自与类型原型库的距离匹配

## 2. 原始分

- 每题 1-5 分
- 每维 2 题
- 每维汇总方式：两题平均值，范围 1.0-5.0

## 3. 用户向量

用户完成 30 题后，生成：

- `decision.factCheck`
- `decision.delay`
- `decision.controlCompensation`
- `body.intrusionSensitivity`
- `body.riskSimulation`
- `body.recoveryCatastrophizing`
- `identity.selfContinuity`
- `identity.motherhoodProjection`
- `identity.rhythmDefense`
- `relationship.confirmationNeed`
- `relationship.attachmentNeed`
- `relationship.commitmentVerification`
- `reality.orderAnxiety`
- `reality.freedomLossSensitivity`
- `reality.careLoadEstimation`

## 4. 类型原型库

- 标准类型数：24
- 每个类型对应一个 15 维目标向量
- 每个维度目标值取 1.0-5.0 之间的配置值

## 5. 匹配方式

### 5.1 主匹配

- 使用标准化后的 15 维向量
- 对 24 个标准类型逐个计算距离
- 取最近类型为主结果

### 5.2 距离

首版使用加权曼哈顿距离：

- 每维默认权重为 1
- 若后续测试发现某些维度区分力太弱，可单独调权

## 6. 轻量指纹

对外展示时，每维压缩为：

- 低
- 中
- 高

建议阈值：

- 1.0-2.4 -> 低
- 2.5-3.5 -> 中
- 3.6-5.0 -> 高

## 7. 第 25 型触发

### 7.1 名称

- 代号：`NOIS`
- 中文名：噪点综合体

### 7.2 触发条件

同时满足：

- 与最接近标准类型的距离仍偏大
- 多个关键维度出现明显反向拉扯

首版先保留为可调参数：

- `fallbackDistanceThreshold`
- `contradictionThreshold`
- `contradictionPairs`

### 7.3 说明

`NOIS` 是正式结果型，但本质上是“当前模式过于混杂”的幽默化表达。

它不是：

- 病理标签
- 故障报错
- 真正的第 25 种稳定人格
