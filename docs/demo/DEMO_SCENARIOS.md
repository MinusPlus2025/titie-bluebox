# DEMO_SCENARIOS.md — 固定Demo场景

## Scenario 1 — 同温不同人
环境：24°C，相近湿度。
- 用户A：膝腿趋势稳定；过去相似状态多选择“刚刚好” -> KNEE_LEG = HOLD
- 用户B：膝腿温度持续下降；相对个人基线偏低；过去相似状态多选择“暖一点” -> KNEE_LEG = WARM

证明：房间几度不能直接代表一个人的需求。

## Scenario 2 — 同一个人，同时不同
某一时刻：
- 肩背微环境偏暖、湿度上升、历史偏好“凉一点” -> COOL
- 腰腹略低于个人舒适基线 -> WARM或HOLD（由置信度决定）
- 膝腿持续下降且历史匹配“暖一点” -> WARM
- 足部稳定 -> HOLD

证明：同一个人不需要被压缩成一个“冷/热”状态。

## Scenario 3 — 同一个人，不同夜晚
Night A：环境与局部趋势稳定 -> mostly HOLD  
Night B：环境相近，但腰腹趋势下降、Context不同、历史相似场景偏好“暖一点” -> WAIST_ABDOMEN = WARM

证明：舒适不是永久设定。

## Scenario 4 — 低置信度，不打扰
信号轻微变化且相互矛盾、历史不足 -> HOLD + low-confidence explanation。

证明：不动作也是智能。

## Scenario 5 — 防振荡
刚对膝腿执行WARM，随后单点读数轻微反向 -> 因hysteresis + minimum interval保持当前策略。

证明：不会因噪声在夜里反复冷热切换。
