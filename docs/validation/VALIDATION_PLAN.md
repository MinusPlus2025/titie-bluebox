# VALIDATION_PLAN.md — 验证计划

## 当前验证分层
1. 软件正确性验证
2. 合成场景行为验证
3. 策略对比验证
4. 未来真实人体验证方案

所有当前实验页面标记：**Prototype Simulation — not clinical/field validation**。

## Baseline A — 整床固定温控
输入：环境/床面平均温度  
输出：整床HEAT / HOLD / COOL

## Baseline B — 固定分区阈值
输入：每区温度  
规则：低于固定阈值加热，高于阈值降温

## Model C — 体贴
输入：区域温湿度、趋势、相对个人基线、全身状态、睡眠/时间上下文、历史偏好  
输出：WARM/HOLD/COOL + intensity + duration + confidence + reasons

## 指标
- Preference Match
- Unnecessary Intervention Rate
- Whole-bed Overcorrection
- Direction Reversal / Oscillation
- Manual Interaction Burden（模拟指标）
- Personalization Gain

## 必须通过的行为测试
- Same temp, different users -> different decisions
- Same user, same moment -> different zones may produce opposite actions
- Feedback changes future personalized decision
- Low confidence -> HOLD
- Recent intervention -> hysteresis/min interval prevents reversal
- Safety cap limits intensity/duration

## 不允许
- 用合成数据声称“准确率97%”
- 把规则生成的Ground Truth包装成真实用户研究
- 写“女性实验验证”除非确实进行了并保留数据
