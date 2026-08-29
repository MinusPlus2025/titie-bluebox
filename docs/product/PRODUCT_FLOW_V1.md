# 体贴｜Product Flow V1

## 总目标

评委打开产品30秒内应该理解：同样环境不同人不同；同一个人不同身体区域也不同；系统不是找“一个最佳温度”；系统能解释为什么；系统会控制局部并知道什么时候不动；用户反馈真的会改变后续判断；系统有明确验证与边界。

## Screen 01｜今晚
标题：**今晚，先从你的状态开始**

信息：当前用户、房间温度/湿度、Demo Scenario、`Prototype Simulation`小标识。

CTA：**看看今晚的状态**

不要：睡眠分数、AI问候、复杂健康卡片。

## Screen 02｜身体（Hero Screen）
标题：**现在，哪里需要调整？**

人体轮廓为视觉中心。六区：头颈、肩背、腰腹、大腿、膝腿、足部。

示例：肩背**凉一点**；腰腹**刚刚好**；大腿**刚刚好**；膝腿**暖一点**；足部**刚刚好**。

注意：这里的“凉一点”意味着用户偏好/系统建议方向，不是“这个部位客观上热”。

## Screen 03｜为什么
选择膝腿。

标题：**这里可能需要暖一点**

主解释：
1. 最近15分钟，这里的温度持续下降。
2. 当前状态与你过去选择“暖一点”时比较接近。
3. 房间整体变化不大，所以先不调整整张床。

次级：**查看技术详情**

详情可显示sensor quality、local temp、slope、zone-to-body delta、top-K similar episodes、confidence、engine evidence。

DEGRADED时标题改为：**先不调整，继续观察**。

## Screen 04｜体贴正在做什么
标题：**只调整需要的地方**

Digital Twin：
- 膝腿：**轻轻暖一下 · 8分钟**
- 肩背：**稍微凉一点 · 5分钟**
- 足部：**保持刚刚好**

下方：**5分钟后重新判断**

工程详情：ThermalControlCommand、actuator capability、level、duration、reevaluateAfter、safety cap、simulation=true。

明确：**Prototype · Simulated actuator**

## Screen 05｜这一晚
标题：**不是一直调，而是在需要时才动**

时间线：
01:42 膝腿局部趋势开始下降
01:55 状态与个人历史模式接近
01:57 轻度暖一下
02:05 重新评估
02:05 **刚刚好 · 保持**
03:26 传感接触变差
03:26 **暂不调整**

## Screen 06｜早晨
标题：**昨晚哪里还需要调整？**

点膝腿：**如果再来一次，你希望这里？**
按钮：暖一点 / 刚刚好 / 凉一点。

提交后：**收到。下次遇到相似状态，会把你的选择算进去。**

按钮：**看看模型怎么变了**

## Screen 07｜反馈前后
同一个相似Scenario：
Before：暖一点0.55 / 刚刚好0.40 / 凉一点0.05
After：暖一点0.68 / 刚刚好0.28 / 凉一点0.04

不要追求夸张变化。

解释：**找到过去5个相似状态，其中4次选择暖一点。**

显示minimum samples、confidence cap、conflicting feedback handling。

## Screen 08｜为什么这样做更合理
标题：**不是更频繁地调，是更少地调错。**

比较：整床固定温控 / 固定分区阈值 / 体贴个体模型。

指标：Preference Match、Unnecessary Intervention、Whole-bed Overcorrection、Direction Reversal、Personalization Gain。

固定显示：**Prototype Simulation — not clinical/field validation**

说明：当前实验验证软件策略在透明合成场景中的行为，不代表真实人体睡眠效果。

## Demo捷径
现场90秒：Screen 01 → 02 → 03 → 04 → 06/07 → 08。Sensor degradation作为评委追问时的第二Demo。
