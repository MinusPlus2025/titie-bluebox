# Body View UI

Phase 3 的正式浏览器 Body View 位于 `src/app/body-map.tsx` 与 `src/app/screens.tsx`。它展示六个可同时表达不同偏好的身体区域，主界面只使用“暖一点 / 刚刚好 / 凉一点”；选择区域后，为什么页面读取真实 Engine reason，控制页面读取真实 `ThermalControlCommand`。

`src/ui/body-view.tsx` 是 Phase 2 语义骨架，保留用于兼容与测试，不是第二套业务逻辑。

当前不包含实时传感器接入、真实执行器联调或 Digital Twin 动画。人体轮廓用于温感偏好导航，不是医学热力图。
