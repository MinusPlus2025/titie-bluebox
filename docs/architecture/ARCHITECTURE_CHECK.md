# 第一阶段技术架构检查

## 结论

蓝盒子命题需要的“感知 → 判断 → 调节”链路，当前最适合用单仓库、纯 TypeScript 域核心实现。第一阶段不需要数据库、微服务、LLM 或真实硬件适配层。这一选择把变化较快的传感器/执行器接入与稳定的温感决策契约分开，也使核心逻辑可重复测试。

## 命题适配检查

| 要求 | 架构对应 | 第一阶段状态 |
|---|---|---|
| 主动感知 | `sensorSimulator` 输出标准区域时间窗口 | 模拟完成 |
| 人体温感判断 | 特征提取 + 通用证据 + 个人校准 | 完成 |
| 分区调节 | 六区独立 `ZoneDecision` | 软件指令完成，硬件未接入 |
| 个体差异 | 用户/区域基线 + 三点反馈校准 | 完成 |
| 少打扰 | `HOLD` + 置信门 + 滞回 + 最小间隔 | 完成 |
| 安全与可解释 | 强度/时长上限 + `reasons[]` + 再评估 | 完成 |
| 工程验证 | 单元测试 + 五个固定场景 | 完成 |

## 边界与依赖方向

`domain` 不依赖任何执行环境；`simulator` 只产生域数据；`engine` 只依赖域契约；`scenarios` 是组装层。未来真实传感器和 Digital Twin 只需分别适配 `ZoneSensorWindow` 和 `ZoneDecision`，不应修改决策核心。

## 已识别风险

1. 当前权重和阈值是原型工程假设，只验证逻辑行为，不代表人体舒适性证据。
2. 个人校准当前按区域聚合反馈，尚未使用“相似特征窗口”做距离加权。
3. 当前只处理完整且时间有序的窗口；真实设备需要缺失、异常值、脱落和时钟偏差策略。
4. 安全上限是软件指令上限，不能取代未来硬件的物理限温、故障检测和独立保护。

## Phase 2 架构变更

```text
ZoneSensorWindow
  → Sensor Quality Gate
  → Feature Extraction
  → General Evidence + Similar Episode Top-K
  → Thermal Preference Engine
  → Hysteresis / Confidence Policy
  → Actuator Capability Adapter
  → ThermalControlCommand

Shared Synthetic Dataset
  ├─ Fixed Whole-Bed Strategy
  ├─ Fixed Zone Threshold Strategy
  └─ TITIE Personalized Strategy
       → transparent metric counts and rates
```

- Sensor Quality Gate 拥有数据可用性判断，Engine 不自行猜测失效信号。
- Similar Episode 只消费反馈时保存的特征向量，不再把同区所有历史视为等价。
- Actuator Capability 是决策与硬件之间的单向适配边界；不支持的能力不会反向篡改用户偏好，只会产生安全 HOLD 指令。
- Validation Runner 依赖策略窄接口，ground truth 存放在数据集中，不对策略开放作为输入。

## Phase 2 新增风险

1. `phase-2-synthetic-v1` 只有 5 个观测和 30 个区域标签，用于行为覆盖，不能用于估计泛化性能。
2. 相似距离的特征尺度与权重仍是可解释的原型假设，需要真实纵向反馈数据校准。
3. 传感突变和过期阈值是软件安全默认值，需按真实设备采样率和误差包线调整。
4. Body View 当前只是 React 语义组件，未接入页面路由、交互状态或真实时间线。
