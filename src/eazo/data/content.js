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
}

// SCREEN 3 好好睡：这一觉时间线
export const session = {
  date: '8月29日',
  range: '00:42 – 07:18',
  duration: '6小时36分',
  summary: '这一觉，大部分时间冷暖都很稳定。',
  timeline: [
    { time: '00:42', text: '开始睡', tone: 'steady' },
    { time: '01:26', text: '膝腿暖一点', tone: 'warm' },
    { time: '01:34', text: '回到刚刚好', tone: 'steady' },
    { time: '03:18', text: '肩背凉一点', tone: 'cool' },
    { time: '03:24', text: '回到刚刚好', tone: 'steady' },
    { time: '05:02', text: '翻身，先观察', tone: 'steady' },
    { time: '05:09', text: '重新判断', tone: 'steady' },
    { time: '07:18', text: '这一觉结束', tone: 'steady' },
  ],
}

export const weekStats = {
  lead: '5觉大部分时间冷暖都很稳定',
  rows: [
    ['最常需要照顾', '膝腿'],
    ['最近更常希望', '暖一点'],
  ],
  foot: '大部分时间，体贴选择保持不动。',
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
  title: '这一觉结束了。',
  sub: '冷暖还合适吗？',
  region: '膝腿',
  question: '如果再来一次，你希望这里？',
  choices: [
    { key: 'warm', t: '暖一点', tone: 'warm' },
    { key: 'steady', t: '刚刚好', tone: 'steady' },
    { key: 'cool', t: '凉一点', tone: 'cool' },
  ],
  confirmTitle: '记住了。',
  confirmSub: '下次遇到相似状态，会把这次选择考虑进去。',
}
