# 体贴·温感决策核心

本仓库实现蓝盒子命题的可运行原型：用确定性仿真传感数据，对六个身体区域产生可解释的 `WARM / HOLD / COOL` 温度偏好判断，并通过浏览器演示完整的判断、调节、复评、反馈学习与策略验证闭环。它不预测“标准温度”，也不使用 LLM 判断冷热。

## 架构

```text
SimulationScenario
  → sensorSimulator
  → ZoneSensorWindow
  → featureExtractor
  → general evidence + personalCalibration
  → thermalPreferenceEngine
  → controlPolicy
  → ZoneDecision (WARM / HOLD / COOL)
```

- `src/domain/thermal.ts`：六区数据契约、个人基线、反馈、干预历史与决策输出。
- `src/simulator/sensor-simulator.ts`：纯函数、可复现的传感器时间窗口生成器。
- `src/engine/feature-extractor.ts`：从时间窗口提取当前值、趋势和区域相对身体温差。
- `src/engine/personal-calibration.ts`：把用户自己的三点反馈转为有上限的区域方向偏置。
- `src/engine/thermal-preference-engine.ts`：聚合通用证据与个人校准，生成置信度和原因。
- `src/engine/control-policy.ts`：执行置信阈值、滞回、最小干预间隔、强度/时长上限和再评估约束。
- `src/sensors/sensor-quality.ts`：识别 GOOD / DEGRADED / INVALID，并对缺失、突变、过期与接触丢失执行保守降级。
- `src/control/control-command-generator.ts`：把温感偏好映射为受 `ActuatorCapability` 限制的 Digital Twin 指令。
- `src/validation/`：让整床固定、分区阈值和体贴个体模型运行在同一合成数据集上。
- `src/scenarios/demo-scenarios.ts`：对应 `docs/demo/DEMO_SCENARIOS.md` 的五个固定场景。
- `src/app/demo-experience.ts`：把冻结的领域核心组合为七屏 Demo 所需的单一体验状态。
- `src/app/`：浏览器产品体验，仅负责呈现与交互，不复制温感或控制规则。

项目资料分类见 `docs/README.md`。
- `src/ui/body-view.tsx`：Phase 2 Body View 语义骨架，作为早期接口留存。

## 浏览器 Demo

```bash
npm install
npm run dev
```

打开终端输出的本地地址（默认 `http://localhost:5173/`）。Demo 依次包含：今晚、身体、这里为什么、体贴正在做什么、这一晚、早晨反馈、反馈前后、策略验证。

生产部署同时提供以下路径：

- `/`：今晚体验
- `/validation`：技术验证
- `GET /api/health`：服务健康状态
- `POST /api/evaluate`：调用冻结的温感偏好引擎
- `POST /api/feedback`：记录一次三点反馈并重新评估相似状态
- `GET /api/validate`：运行版本化合成验证数据集

API 输出中的传感器、反馈和验证数据均保持 `Prototype Simulation` 标记。

## Phase 2 合成验证快照

`phase-2-synthetic-v1` 包含 5 个观测、30 个区域偏好标签。该数据集专用于检查软件行为，不是性能基准或真人准确率。

| 策略 | Preference Match | Unnecessary Intervention | Whole-bed Overcorrection | Direction Reversal | Personalization Gain |
|---|---:|---:|---:|---:|---:|
| Fixed Whole-Bed | 0.6000 | 0.3000 | 0.3000 | 0.2500 | 0 |
| Fixed Zone Threshold | 0.9667 | 0 | 0 | 0 | 0 |
| TITIE Personalized | 1.0000 | 0 | 0 | 0 | 0.0333 |

上表只说明这五个人工定义场景的逻辑结果，不得对外表述为模型对真实人群的准确率。

## 验证

```bash
npm install
npm test
npm run typecheck
npm run build
```

最终发布验证基线：61 tests passed，typecheck/build passed。浏览器构建输出到 `dist/web/`。

## 真实与模拟边界

**Prototype Simulation — not clinical/field validation.**

当前真实实现的是软件数据契约、特征处理、相似片段检索、规则/个人校准、传感质量降级、执行器能力约束、合成验证和自动测试。传感器数据、用户反馈、执行器效果、ground truth 和当前验证结果全部是合成的；未完成真实人体试验、临床/实地验证或真实硬件联调。
