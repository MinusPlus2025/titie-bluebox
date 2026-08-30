// 体贴 — 所有文案与模拟数据（单一来源，便于保持规范文案不被改写）

// SCREEN 1 主页：身体当前状态 + 产品动作
export const bodyStates = [
  { key: 'shoulder', region: '肩背', status: '有点热', tone: 'warm' },
  { key: 'knee', region: '膝腿', status: '有点凉', tone: 'cool' },
]

// 左侧 6 部位菜单（沉浸主页）
export const regions = [
  { key: 'neck', icon: 'neck', name: '头颈', status: '刚刚好', tone: 'steady' },
  { key: 'shoulder', icon: 'shoulder', name: '肩背', status: '偏热', tone: 'cool' },
  { key: 'waist', icon: 'waist', name: '腰腹', status: '刚刚好', tone: 'steady' },
  { key: 'thigh', icon: 'thigh', name: '大腿', status: '刚刚好', tone: 'steady' },
  { key: 'knee', icon: 'knee', name: '膝腿', status: '偏凉', tone: 'warm' },
  { key: 'foot', icon: 'foot', name: '足部', status: '刚刚好', tone: 'steady' },
]

// 顶部环境
export const ambient = { time: '23:48', temp: '室温 24.1°C', humidity: '湿度 52%' }

// 产品动作：方向决定颜色（暖一点=暖杏 / 凉一点=蓝）
export const actions = [
  { key: 'knee', region: '膝腿', dir: '暖一点', to: 'to-warm', time: '约8分钟' },
  { key: 'shoulder', region: '肩背', dir: '凉一点', to: 'to-cool', time: '约5分钟' },
]

// SCREEN 2 详情（膝腿）
export const sheets = {
  neck: stableSheet('头颈'),
  knee: {
    region: '膝腿',
    dir: '暖一点',
    lead: [
      '最近这里在慢慢变凉。',
      '房间和其他位置没有明显变化。',
      '在和现在相似的状态下，你过去更常希望这里暖一点。',
    ],
    action: { text: '正在暖一点', time: '约8分钟' },
    hint: '5分钟后再看看。',
    evidence: [
      ['局部温度变化', '−0.6°C / 20分钟'],
      ['湿度变化', '基本稳定'],
      ['接触稳定性', '良好'],
      ['过去相似状态', '更常希望暖一点'],
    ],
  },
  shoulder: {
    region: '肩背',
    dir: '凉一点',
    lead: [
      '最近这里在慢慢变暖。',
      '房间和其他位置没有明显变化。',
      '在和现在相似的状态下，你过去更常希望这里凉一点。',
    ],
    action: { text: '正在凉一点', time: '约5分钟' },
    hint: '5分钟后再看看。',
    evidence: [
      ['局部温度变化', '+0.5°C / 20分钟'],
      ['湿度变化', '略升'],
      ['接触稳定性', '良好'],
      ['过去相似状态', '更常希望凉一点'],
    ],
  },
  waist: stableSheet('腰腹'),
  thigh: stableSheet('大腿'),
  foot: stableSheet('足部'),
}

function stableSheet(region) {
  return {
    region,
    dir: '刚刚好',
    lead: ['这里目前比较稳定。', '没有足够理由主动调整。'],
    action: { text: '保持刚刚好', time: '暂不调节' },
    hint: '5分钟后再看看。',
    evidence: [
      ['局部温度变化', '基本稳定'],
      ['湿度变化', '基本稳定'],
      ['接触稳定性', '良好'],
      ['过去相似状态', '暂无明显方向'],
    ],
  }
}

// SCREEN 3 好好睡：三条 Prototype Simulation 睡眠记录
export const sessions = [{
  date: '8月27日',
  range: '23:54 – 06:41',
  duration: '6小时47分',
  summary: '大部分时间都很稳定，夜里足部短暂需要暖一点。',
  caredZones: '足部 · 1次暖一点 · 其余时间未调整',
  feedback: '足部 · 刚刚好',
  timeline: [
    { time: '23:54', text: '入睡', tone: 'steady' },
    { time: '02:08', text: '足部暖一点', tone: 'warm' },
    { time: '02:16', text: '回到刚刚好', tone: 'steady' },
    { time: '06:41', text: '醒来', tone: 'steady' },
  ],
}, {
  date: '8月28日',
  range: '00:18 – 07:06',
  duration: '6小时48分',
  summary: '夜里肩背短暂需要凉一点；翻身后数据还不稳定，所以先观察。',
  caredZones: '肩背 · 1次凉一点 · 2次先观察',
  feedback: '肩背 · 凉一点',
  timeline: [
    { time: '00:18', text: '入睡', tone: 'steady' },
    { time: '02:46', text: '肩背凉一点', tone: 'cool' },
    { time: '02:52', text: '回到刚刚好', tone: 'steady' },
    { time: '04:31', text: '翻身后，先观察', tone: 'steady' },
    { time: '07:06', text: '醒来', tone: 'steady' },
  ],
}, {
  date: '8月29日',
  range: '00:42 – 07:18',
  duration: '6小时36分',
  summary: '大部分时间冷暖都很稳定，只做了两次局部调整。',
  caredZones: '膝腿、肩背 · 2次局部调整 · 其余时间未调整',
  feedback: '膝腿 · 暖一点',
  timeline: [
    { time: '00:42', text: '入睡', tone: 'steady' },
    { time: '01:26', text: '膝腿暖一点', tone: 'warm' },
    { time: '01:34', text: '回到刚刚好', tone: 'steady' },
    { time: '03:18', text: '肩背凉一点', tone: 'cool' },
    { time: '03:24', text: '回到刚刚好', tone: 'steady' },
    { time: '05:02', text: '翻身后，先观察', tone: 'steady' },
    { time: '05:09', text: '恢复判断', tone: 'steady' },
    { time: '07:18', text: '醒来', tone: 'steady' },
  ],
}]

export const session = sessions[2]

export const weekStats = {
  lead: '最近一周，大多数夜晚冷暖都很稳定。',
  rows: [
    ['最常需要调整', '膝腿'],
    ['最近更偏向', '暖一点'],
  ],
  foot: '大部分时间状态稳定，体贴没有主动调整。',
}

export const monthStats = {
  lead: '最近30天，大部分时间不需要主动调整。',
  rows: [
    ['最常需要调整', '膝腿'],
    ['主动调整 / 保持', '19% / 81%'],
    ['参考过的相似状态', '9次'],
    ['最近的变化', '膝腿最近更偏向暖一点'],
  ],
  foot: '以上为原型模拟数据，不代表真实人体或临床效果。',
}

// SCREEN 4 我的
export const mine = {
  sleep: [
    { icon: 'clock', t: '常用睡眠时段', v: '23:30 – 07:00' },
    { icon: 'bed', t: '午睡习惯', v: '偶尔' },
  ],
  bodyOptional: [
    { icon: 'refresh', t: '周期信息' },
    { icon: 'warm', t: '潮热情况' },
    { icon: 'body', t: '睡前运动' },
    { icon: 'people', t: '同睡情况' },
  ],
  system: [
    { icon: 'box', t: '我的蓝盒子' },
    { icon: 'lock', t: '数据与隐私' },
    { icon: 'info', t: '关于体贴' },
  ],
}

// SCREEN 5 反馈
export const feedback = {
  title: '睡醒了。',
  sub: '这晚的冷暖还合适吗？',
  region: '膝腿',
  question: '如果再遇到这样的情况，你希望这里？',
  choices: [
    { key: 'warm', t: '暖一点', tone: 'warm' },
    { key: 'steady', t: '刚刚好', tone: 'steady' },
    { key: 'cool', t: '凉一点', tone: 'cool' },
  ],
  confirmTitle: '记住了。',
  confirmSub: '下次遇到相似的情况，会参考你这次的选择。',
}

export const feedbackRegions = regions.map(({ key, name }) => ({ key, name }))

export const mePanels = {
  sleep_time: {
    title: '常用睡眠时段',
    options: ['22:30 – 06:30', '23:00 – 07:00', '23:30 – 07:00', '00:00 – 08:00'],
  },
  nap: { title: '午睡习惯', options: ['没有', '偶尔', '经常'] },
  cycle: {
    title: '周期信息（可选）', options: ['未提供', '已提供'],
    note: '仅作为理解不同状态的上下文，不会直接决定温控。',
  },
  hot_flash: {
    title: '潮热情况（可选）', options: ['未提供', '偶尔', '较明显'],
    note: '仅作为上下文，不会生成“潮热模式”。',
  },
  exercise: { title: '睡前运动（可选）', options: ['没有', '轻度', '明显'] },
  cosleep: { title: '同睡情况（可选）', options: ['独睡', '同睡'], note: '仅作为理解当晚状态的上下文。' },
  device: {
    title: '我的蓝盒子',
    lines: ['蓝盒子', '原型设备连接', '模拟连接', '当前原型以模拟方式展示温控执行。'],
  },
  privacy: {
    title: '数据与隐私',
    lines: ['当前体验使用原型模拟数据。', '身体状态信息为可选。', '你的冷暖反馈只用于参考相似情况。'],
  },
  about: {
    title: '关于体贴',
    lines: [
      '体贴',
      '知冷暖，好好睡。',
      '体贴是一套个体化睡眠冷暖决策系统。它结合不同身体区域的温湿度、接触状态和个人反馈，持续判断哪里需要暖一点、凉一点，或暂时保持不变，并把判断转化为分区温控指令。',
      '体贴不寻找一个适合所有人的“最佳温度”，而是关注同一个人在不同时间、不同身体区域不断变化的冷暖感受。',
      '当前版本用于验证“感知—判断—调节—反馈”的产品闭环。传感数据与温控执行部分采用原型模拟，尚未接入真实睡眠硬件。',
      '版本信息',
      'Hackathon Prototype · 2026',
    ],
  },
}
