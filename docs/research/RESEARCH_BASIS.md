# RESEARCH_BASIS.md — 研究依据与边界

> 论文用于建立设计假设、变量选择与验证方法；不代表「体贴」已完成真实人体试验。所有模拟结果必须标注 Prototype Simulation。

## A. 局部热感觉不是全身平均值
睡眠研究显示，不同身体区域与整体睡眠热感觉的关系不同；背部、面部、大腿等区域较重要，胸、臂、腿、足部也不可忽略。

工程启发：
- 不把全身压缩成一个温度
- 允许多个区域同时不同
- Body Map是模型结构，不只是UI

参考：Song C. et al. Identification of local thermal conditions for sleeping comfort improvement in neutral to cold indoor thermal environments. PMID: 31999607.

## B. 局部加热的效果因部位、个体而异
局部加热研究显示，不同身体部位对整体热感觉/舒适的影响不同，也观察到男女反应差异。但不能据此推出“所有女性都该加热某一部位”。

工程启发：
- 不建立“女性统一敏感部位”
- 需要个人/区域校准
- 腰腹、膝腿、足部等都可作为测试区，但决策来自个体反馈

参考：Liu C. et al. Journal of Building Engineering, 2022. DOI: 10.1016/j.jobe.2022.104543.

## C. 混合个体热舒适模型
2025年研究提出基于腕部皮温、室温及其时间变化的混合个体热舒适模型，将数学先验与机器学习个体化结合。

工程启发：
- “通用先验 + 个人校准”适合MVP
- 温度趋势是重要特征
- 冷启动与长期个体学习分开

参考：Hybrid personalized thermal comfort model based on wrist skin temperature. Building and Environment 268 (2025), 112321. DOI: 10.1016/j.buildenv.2024.112321.

## D. 主观偏好不能被传感器完全取代
2026年受控实验显示，热预期可以改变热舒适评价，而皮肤温度和心率未同步变化。

工程启发：
- 传感器读数 ≠ 主观感受
- 用户反馈必须作为校准标签
- 使用概率语言，不把算法判断当成用户感受本身

参考：The effect of thermal expectation on occupants’ response to moderate temperature ramp up. Building and Environment 295 (2026), 114437. DOI: 10.1016/j.buildenv.2026.114437.

## E. Thermal Interoception
近期综述讨论thermal interoception（对身体温度相关信号的觉察与解释），并将其与自主调节、睡眠、情绪和行为联系起来。

工程启发：
- “感知身体”不等于只读物理温度
- 用户自身感受与选择是不可替代的信号
- 系统不能夺走用户对自己身体的解释权

参考：From feeling chilly to burning up... Neuroscience & Biobehavioral Reviews. PMID: 39793684.

## F. 三点偏好反馈适合个体化采集
个人热舒适研究使用 warmer / no change / cooler 等简化偏好标签，将环境、近体温度、皮温、心率与用户偏好配对。6个月纵向研究发现皮温、室温、近体温度、心率具有较高预测价值；个人模型需要持续反馈。

工程启发：
- 前台采用“暖一点 / 刚刚好 / 凉一点”
- 偏好标签比单纯“冷/热感觉”更直接对应控制动作
- 夜间不主动打扰，晨间修正模型

参考：Personal comfort models based on a 6-month experiment using environmental parameters and data from wearables. PMID: 36437680.

## G. 月经周期只作为context
综述显示，排卵后黄体期核心体温可较卵泡期高约0.3–0.7°C，并在睡眠/晨起时较明显。但体温变化不能直接推出用户希望更凉或更暖。

工程启发：
- cycleContext只作为可选上下文
- 禁止 `luteal => COOL` 或 `period => abdomen WARM`
- 个人反馈优先于群体先验

参考：Baker FC et al. Temperature regulation in women: Effects of the menstrual cycle. PMCID: PMC7575238; PMID: 33123618.

## H. 潮热预测属于Future Work
2025年研究探索利用生理信号预测潮热并进行just-in-time thermal intervention。

工程启发：
- 可描述未来“事件预测 + 提前局部干预”
- MVP不可声称已经准确预测潮热
- EDA等信号如出现，只能标明研究/模拟用途

参考：Naghavi N. et al. Psychophysiology 2025. DOI: 10.1111/psyp.70056.

## 研究边界
- 上述研究来自不同环境、年龄、样本量与实验条件。
- 建筑热舒适研究不能直接等同于睡眠床品的临床证据。
- 合成数据不能验证真实人体效果。
- 当前MVP验证的是软件模型逻辑、个体差异表达、分区控制策略和可解释闭环。
