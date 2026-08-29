# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TypeScript domain core with a React + Vite browser shell. The UI composes the existing Engine, control, sensor-quality, personalization, and validation modules through `src/app/demo-experience.ts`; it does not duplicate domain rules.

## Users

People whose local thermal preferences can vary by person, body zone, night, and context, and who want sleep-time adjustment with minimal interruption.

## Product Purpose

「体贴」是个体化身体温感与分区调节系统。它结合局部变化、床内微环境与用户反馈，判断每个区域此刻更接近“暖一点 / 刚刚好 / 凉一点”中的哪一种偏好。

## Positioning

不寻找统一的“最佳温度”，而是使用六区状态、个人基线与反馈学习生成可解释、有安全约束的局部偏好决策。

## Capabilities and Constraints

- 后台决策仅使用 `WARM / HOLD / COOL`；状态界面使用“想暖一点 / 刚刚好 / 想凉一点”，反馈按钮使用“暖一点 / 刚刚好 / 凉一点”。
- `HOLD` 是第一类智能动作。
- 不使用 LLM 决定冷热，不做医疗诊断，不用周期或生命阶段做确定性温控规则。
- 所有当前数据、执行器与验证结果都是 `Prototype Simulation`。

## Brand Commitments

产品名为「体贴」，Slogan为“知冷暖，好好睡。”；品牌价值观是“看见 · 回应 · 不打扰”。视觉基于蓝盒子品牌蓝延展，语气安静、身体感、柔和、精确、克制、可信；不把用户医学化，不声称系统“知道你冷”。

## Evidence on Hand

当前只有软件正确性和合成场景行为证据；没有真人、临床、实地或真实硬件验证。

## Product Principles

1. 个人反馈高于群体预设。
2. 身体区域状态不被压缩成单一整体温度。
3. 低置信度或传感数据失效时优先保持或安全停止。
4. 每次自动决策都必须可解释、可测试、可纠正。

## Accessibility & Inclusion

状态不能只靠颜色表达；六区、决策、置信度、原因和模拟边界必须能被辅助技术读取。
