import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import './App.css';

// 数据
const metalData = [
  { name: '铜', value: 2.97, unit: '万吨' },
  { name: '铅', value: 0, unit: '万吨' },
  { name: '锌', value: 0, unit: '万吨' },
  { name: '镍', value: 0, unit: '万吨' },
  { name: '钼', value: 0, unit: '万吨' },
  { name: '金', value: 0, unit: '吨' },
  { name: '银', value: 0, unit: '吨' },
  { name: '五氧化二钒', value: 0, unit: '吨' },
  { name: '铁', value: 23.93, unit: '万吨' },
];

const lakeData = [
  { name: '柯柯(NaCl)', value: 0.00, unit: '万吨' },
  { name: '茶卡(NaCl)', value: 0.00, unit: '万吨' },
  { name: '镁业(MgCl₂)', value: 0.00, unit: '万吨' },
  { name: '东台(Li)', value: 0, unit: '万吨' },
];

const tableData = [
  { unit: '大梁矿业', type: '铅锌',开拓: 2.83, 采准: 0.89, 备采: 9.84, 平衡: '否' },
  { unit: '鸿丰伟业', type: '合计',开拓: 3.23, 采准: 1.06, 备采: 8.28, 平衡: '否' },
  { unit: '哈密博伦', type: '合计',开拓: 2.17, 采准: 1.36, 备采: 9.24, 平衡: '否' },
  { unit: '玉龙铜业', type: '氧化矿',开拓: 6.43, 采准: 0, 备采: 27.6, 平衡: '否' },
  { unit: '玉龙铜业', type: '硫化矿+铜硫矿',开拓: 2.54, 采准: 0, 备采: 4.8, 平衡: '否' },
  { unit: '锡铁山分公司-主矿区', type: '铅锌',开拓: 3.79, 采准: 0.69, 备采: 4.2, 平衡: '是' },
  { unit: '锡铁山分公司-中间沟', type: '铅锌',开拓: 2.17, 采准: 0.48, 备采: 4.8, 平衡: '否' },
  { unit: '西部铜业', type: '铜',开拓: 4.22, 采准: 1.02, 备采: 6.24, 平衡: '否' },
  { unit: '西部铜业', type: '铅锌',开拓: 8.25, 采准: 0.99, 备采: 6, 平衡: '否' },
  { unit: '鑫源矿业-砷村', type: '铅锌',开拓: 5.29, 采准: 1.11, 备采: 6.72, 平衡: '否' },
  { unit: '肃北博伦', type: '钒',开拓: 8.9, 采准: 8.3, 备采: 12.48, 平衡: '否' },
];

// 矿权列表数据
const miningRightsData = [
  { company: '锡铁山分公司', licenseType: '采矿权', expiryDate: '2028-12-31', area: '12.5 km²', depth: '500-1200m' },
  { company: '西部铜业', licenseType: '采矿权', expiryDate: '2027-06-30', area: '8.3 km²', depth: '300-800m' },
  { company: '玉龙铜业', licenseType: '采矿权', expiryDate: '2029-03-15', area: '15.7 km²', depth: '400-1500m' },
  { company: '鑫源矿业', licenseType: '采矿权', expiryDate: '2026-11-20', area: '6.2 km²', depth: '200-600m' },
  { company: '新疆瑞伦', licenseType: '采矿权', expiryDate: '2027-09-10', area: '9.8 km²', depth: '350-900m' },
  { company: '哈密博伦', licenseType: '采矿权', expiryDate: '2028-05-25', area: '11.4 km²', depth: '450-1100m' },
  { company: '肃北博伦', licenseType: '采矿权', expiryDate: '2027-12-18', area: '7.6 km²', depth: '280-750m' },
  { company: '双利矿业', licenseType: '采矿权', expiryDate: '2026-08-30', area: '5.9 km²', depth: '250-650m' },
  { company: '大梁矿业', licenseType: '采矿权', expiryDate: '2028-01-15', area: '10.2 km²', depth: '380-950m' },
  { company: '鸿丰伟业', licenseType: '采矿权', expiryDate: '2027-04-22', area: '8.7 km²', depth: '320-820m' },
  { company: '锡铁山分公司', licenseType: '探矿权', expiryDate: '2026-10-10', area: '3.5 km²', depth: '100-400m' },
  { company: '西部铜业', licenseType: '探矿权', expiryDate: '2027-07-15', area: '4.2 km²', depth: '150-500m' },
  { company: '玉龙铜业', licenseType: '探矿权', expiryDate: '2026-12-25', area: '2.8 km²', depth: '120-350m' },
  { company: '鑫源矿业', licenseType: '探矿权', expiryDate: '2027-02-28', area: '3.1 km²', depth: '130-380m' },
];

// 生成最近5个月的月份标签
const generateMonths = () => {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months.reverse(); // 从最早到最新
};

const monthLabels = generateMonths();

// 模拟各月份的勘探进度数据
const explorationDataByMonth: Record<string, any> = {
  [monthLabels[0]]: { completion: [1800.50, 680.30, 11500.20, 52.40], plan: [35000, 2800, 85000, 900] },
  [monthLabels[1]]: { completion: [1950.80, 720.50, 12200.80, 55.60], plan: [36500, 2950, 88000, 950] },
  [monthLabels[2]]: { completion: [2050.20, 750.80, 12800.50, 58.20], plan: [37800, 3050, 91000, 970] },
  [monthLabels[3]]: { completion: [2122.75, 796.19, 13127.56, 60.92], plan: [39292, 3117, 94689, 994] },
  [monthLabels[4]]: { completion: [2200.30, 820.40, 13500.80, 63.50], plan: [40500, 3200, 97000, 1020] },
};

// 模拟各月份的采矿作业数据
const miningDataByMonth: Record<string, any> = {
  [monthLabels[0]]: { completion: [820.50, 880.20, 1000.50], plan: [580.30, 590.80, 2200.40] },
  [monthLabels[1]]: { completion: [850.80, 910.50, 1050.80], plan: [600.50, 610.20, 2300.60] },
  [monthLabels[2]]: { completion: [880.30, 940.80, 1080.20], plan: [615.80, 625.50, 2380.50] },
  [monthLabels[3]]: { completion: [917.19, 974, 1118.38], plan: [628.89, 639.28, 2425.75] },
  [monthLabels[4]]: { completion: [950.50, 1010.30, 1160.50], plan: [645.20, 655.80, 2500.30] },
};

// 集团出矿量各月份数据
const outputDataByMonth: Record<string, number[]> = {
  [monthLabels[0]]: [296.57, 220.65, 337.63, 275.52, 292.33, 71.43, 0],
  [monthLabels[1]]: [310.20, 245.80, 352.10, 288.90, 305.60, 85.20, 12.50],
  [monthLabels[2]]: [325.40, 260.30, 368.50, 298.70, 318.90, 95.80, 28.60],
  [monthLabels[3]]: [340.80, 275.50, 382.20, 310.40, 332.50, 108.30, 42.80],
  [monthLabels[4]]: [355.60, 290.20, 395.80, 322.60, 345.80, 118.50, 55.30],
};

export default function App() {
  const pieRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const miningRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const miningRightsScrollRef = useRef<HTMLDivElement>(null);

  // 动态时钟
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  const weekStr = '星期' + '日一二三四五六'[now.getDay()];

  // 柱状图月份轮播状态
  const [currentBarMonthIndex, setCurrentBarMonthIndex] = useState(4); // 默认显示最新月份
  const [isBarHovering, setIsBarHovering] = useState(false);

  // 折线图月份轮播状态（与柱状图同步）
  const [isLineHovering, setIsLineHovering] = useState(false);

  // 保有金属量资源量分类 - 矿山单位切换与随机数据
  const mineUnits = ['锡铁山分公司', '西部铜业', '玉龙铜业', '鑫源矿业', '新疆瑞伦', '哈密博伦', '肃北博伦', '双利矿业', '大梁矿业', '鸿丰伟业'];
  const [currentMineIndex, setCurrentMineIndex] = useState(0);
  const [isPieHovering, setIsPieHovering] = useState(false);
  const [showMineDropdown, setShowMineDropdown] = useState(false);
  const pieCardRef = useRef<HTMLDivElement>(null);

  // 时间筛选框数据（年份+季度）
  const timeOptions = [
    '26年一季度', '26年二季度', '26年三季度', '26年四季度',
    '25年一季度', '25年二季度', '25年三季度', '25年四季度',
    '24年一季度', '24年二季度', '24年三季度', '24年四季度',
  ];
  const [selectedTime, setSelectedTime] = useState('26年一季度');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  // 三级矿量 - 年+季度下拉框
  const quarterOptions = [
    '26年一季度', '26年二季度', '26年三季度', '26年四季度',
    '25年一季度', '25年二季度', '25年三季度', '25年四季度',
  ];
  const [selectedQuarter, setSelectedQuarter] = useState('26年二季度');
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);

  // 年度勘探进度 - 年份下拉框
  const yearOptions = ['2026', '2025'];
  const [selectedYear, setSelectedYear] = useState('2026');
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // 生成模拟数据 - 每个单位可能有多个矿种
  const generateMineralData = (unit: string) => {
    // 定义各单位可能的矿种
    const unitMinerals: Record<string, string[]> = {
      '锡铁山分公司': ['铅锌'],
      '西部铜业': ['铜', '铅锌', '铁'],
      '玉龙铜业': ['铜钼'],
      '鑫源矿业': ['铅锌'],
      '新疆瑞伦': ['镍'],
      '哈密博伦': ['铁'],
      '肃北博伦': ['钒', '铁'],
      '双利矿业': ['铁'],
      '大梁矿业': ['铅锌'],
      '鸿丰伟业': ['铁'],
    };
    
    const minerals = unitMinerals[unit] || ['未知'];
    
    return minerals.map(mineral => ({
      mineral,
      control: Number((Math.random() * 2 + 0.5).toFixed(2)),
      infer: Number((Math.random() * 2 + 0.3).toFixed(2)),
      prove: Number((Math.random() * 2 + 0.2).toFixed(2)),
    }));
  };

  const [mineralDataList, setMineralDataList] = useState(generateMineralData(mineUnits[0]));

  // 矿山详细信息自动轮播索引
  const [currentMineDetailIndex, setCurrentMineDetailIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMineDetailIndex(prev => (prev + 1) % mineUnits.length);
    }, 4000); // 每4秒切换一家单位
    return () => clearInterval(timer);
  }, []);

  // 矿山详细信息（根据图片整理，包含矿种和金属量）
  const mineDetails: Record<string, { mineral: string; elements: { name: string; amount: number }[] }[]> = {
    '锡铁山分公司': [
      { mineral: '硫化矿', elements: [{ name: 'Pb', amount: 45.2 }, { name: 'Zn', amount: 38.6 }, { name: 'S', amount: 120.5 }, { name: 'Au', amount: 2.3 }, { name: 'Ag', amount: 156.8 }] },
      { mineral: '硫化矿', elements: [{ name: 'Cu', amount: 12.5 }, { name: 'Pb', amount: 28.3 }, { name: 'Zn', amount: 35.7 }, { name: 'Ag', amount: 98.2 }] },
    ],
    '西部铜业': [
      { mineral: '硫化矿', elements: [{ name: 'Cu', amount: 85.6 }, { name: 'Ag', amount: 45.3 }] },
      { mineral: '铁矿石', elements: [{ name: 'TFe', amount: 156.8 }, { name: 'mFe', amount: 128.5 }] },
    ],
    '玉龙铜业': [
      { mineral: '铜钼矿', elements: [{ name: 'Cu', amount: 125.3 }, { name: 'Mo', amount: 8.6 }] },
      { mineral: '铁矿石', elements: [{ name: 'TFe', amount: 185.2 }, { name: 'mFe', amount: 152.8 }] },
    ],
    '鑫源矿业': [
      { mineral: '硫化矿', elements: [{ name: 'Cu', amount: 18.5 }, { name: 'Pb', amount: 32.6 }, { name: 'Zn', amount: 42.8 }, { name: 'Ag', amount: 68.5 }] },
    ],
    '新疆瑞伦': [
      { mineral: '铜镍矿', elements: [{ name: 'Cu', amount: 100.0 }, { name: 'Ni', amount: 28.3 }, { name: 'Co', amount: 5.6 }] },
    ],
    '哈密博伦': [
      { mineral: '钒矿石', elements: [{ name: 'V2O5', amount: 35.8 }] },
      { mineral: '铁矿石', elements: [{ name: 'TFe', amount: 245.6 }, { name: 'mFe', amount: 198.3 }] },
    ],
    '肃北博伦': [
      { mineral: '铁矿石', elements: [{ name: 'TFe', amount: 185.3 }, { name: 'mFe', amount: 152.6 }] },
    ],
    '双利矿业': [
      { mineral: '铁矿石', elements: [{ name: 'TFe', amount: 168.5 }, { name: 'mFe', amount: 138.2 }, { name: 'Cu', amount: 8.5 }, { name: 'Pb', amount: 12.3 }, { name: 'Zn', amount: 15.6 }] },
    ],
    '大梁矿业': [
      { mineral: '硫化矿', elements: [{ name: 'Pb', amount: 52.8 }, { name: 'Zn', amount: 45.6 }, { name: 'Ag', amount: 85.3 }] },
    ],
    '鸿丰伟业': [
      { mineral: '铁矿石', elements: [{ name: 'TFe', amount: 142.5 }, { name: 'mFe', amount: 118.6 }, { name: 'Cu', amount: 6.8 }, { name: 'Zn', amount: 12.5 }] },
    ],
  };

  // 矿山坐标数据（组件级别，供地图和弹窗使用）
  const minePoints = [
    { name: '哈密博伦', value: [93.5, 42.8] },
    { name: '肃北博伦', value: [94.8, 39.5] },
    { name: '新疆瑞伦', value: [87.6, 43.9] },
    { name: '西部铜业', value: [105.0, 37.8] },
    { name: '双利矿业', value: [106.8, 39.5] },
    { name: '锡铁山分公司', value: [95.05, 37.28] },
    { name: '鸿丰伟业', value: [96.0, 36.3] },
    { name: '玉龙铜业', value: [97.2, 31.2] },
    { name: '鑫源矿业', value: [98.5, 25.8] },
    { name: '大梁矿业', value: [106.5, 26.5] },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPieHovering) {
        setCurrentMineIndex(prev => {
          const next = (prev + 1) % mineUnits.length;
          setMineralDataList(generateMineralData(mineUnits[next]));
          return next;
        });
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isPieHovering]);

  const handleSelectMine = (idx: number) => {
    setCurrentMineIndex(idx);
    setMineralDataList(generateMineralData(mineUnits[idx]));
    setShowMineDropdown(false);
  };

  // 环形图独立管理（支持多矿种动态更新）
  useEffect(() => {
    if (!pieRef.current) return;
    const chart = echarts.init(pieRef.current);
    
    // 根据矿种数量计算布局
    const mineralCount = mineralDataList.length;
    
    let pieSize: string;
    let innerRadius: string;
    let centers: string[][];
    
    if (mineralCount === 1) {
      // 单个矿种：大环形图
      pieSize = '65%';
      innerRadius = '38%';
      centers = [['50%', '50%']];
    } else if (mineralCount === 2) {
      // 两个矿种：中等大小，左右分布
      pieSize = '45%';
      innerRadius = '28%';
      centers = [['25%', '50%'], ['75%', '50%']];
    } else {
      // 三个矿种：小尺寸，均匀分布
      pieSize = '30%';
      innerRadius = '18%';
      centers = [['17%', '50%'], ['50%', '50%'], ['83%', '50%']];
    }

    const series: any[] = mineralDataList.map((data, idx) => {
      return {
        type: 'pie',
        radius: [innerRadius, pieSize],
        center: centers[idx],
        label: {
          show: true,
          formatter: '{b}\n{c}万吨\n{d}%',
          color: '#7dd3fc',
          fontSize: mineralCount === 1 ? 9 : 7
        },
        labelLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.3)' } },
        data: [
          { value: data.control, name: '控制', itemStyle: { color: '#06b6d4' } },
          { value: data.infer, name: '推断', itemStyle: { color: '#00d4ff' } },
          { value: data.prove, name: '探明', itemStyle: { color: '#fbbf24' } },
        ],
      };
    });

    // 添加中央文字
    const graphics: any[] = mineralDataList.map((data, idx) => {
      const total = data.control + data.infer + data.prove;
      const fontSize = mineralCount === 1 ? 12 : (mineralCount === 2 ? 9 : 7);
      return {
        type: 'text',
        left: centers[idx][0],
        top: centers[idx][1],
        style: {
          text: `${data.mineral}\n${total.toFixed(2)}万吨`,
          fill: '#06b6d4',
          fontSize: fontSize,
          fontWeight: 'bold',
          textAlign: 'center',
          textVerticalAlign: 'middle'
        }
      };
    });

    const option: echarts.EChartsOption = {
      animation: false,
      tooltip: { trigger: 'item' },
      legend: { show: false },
      series: series,
      graphic: graphics
    };
    
    chart.setOption(option, true);
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(pieRef.current);
    return () => { ro.disconnect(); chart.dispose(); };
  }, [mineralDataList]);

  // 柱状图月份轮播定时器
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isBarHovering && !isLineHovering) {
        setCurrentBarMonthIndex(prev => (prev + 1) % monthLabels.length);
      }
    }, 4000); // 每4秒切换一次
    return () => clearInterval(timer);
  }, [isBarHovering, isLineHovering]);

  // 年度勘探进度年份自动切换
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isBarHovering) {
        setSelectedYear(prev => {
          const idx = yearOptions.indexOf(prev);
          return yearOptions[(idx + 1) % yearOptions.length];
        });
      }
    }, 6000); // 每6秒切换一次年份
    return () => clearInterval(timer);
  }, [isBarHovering]);

  // 三级矿量表格自动滚动
  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;
    let scrollTop = 0;
    const step = 0.25; // 滚动速度（像素/帧）
    let rafId: number;
    const animate = () => {
      scrollTop += step;
      if (scrollTop >= el.scrollHeight - el.clientHeight) {
        scrollTop = 0;
      }
      el.scrollTop = scrollTop;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // 矿权列表自动滚动
  useEffect(() => {
    const el = miningRightsScrollRef.current;
    if (!el) return;
    let scrollTop = 0;
    const step = 0.2; // 滚动速度（像素/帧）
    let rafId: number;
    const animate = () => {
      scrollTop += step;
      if (scrollTop >= el.scrollHeight - el.clientHeight) {
        scrollTop = 0;
      }
      el.scrollTop = scrollTop;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // 年度勘探进度柱状图 - 使用独立useEffect避免闪烁
  useEffect(() => {
    if (!barRef.current) return;
    const chart = echarts.init(barRef.current);

    const updateChart = () => {
      const data = explorationDataByMonth[monthLabels[currentBarMonthIndex]];
      chart.setOption({
        animation: true,
        animationDuration: 800,
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['完成量', '计划量'], textStyle: { color: '#7dd3fc', fontSize: 10 }, right: 0, top: 0, itemWidth: 10, itemHeight: 6 },
        grid: { left: 2, right: 8, top: 28, bottom: 2, containLabel: true },
        xAxis: { type: 'value', axisLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.3)' } }, axisLabel: { color: '#7dd3fc', fontSize: 10 }, splitLine: { show: false } },
        yAxis: { type: 'category', data: ['地质勘查钻探', '地质勘查坑探', '生产探矿钻探', '生产探矿坑探'], axisLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.3)' } }, axisLabel: { color: '#7dd3fc', fontSize: 10 } },
        series: [
          {
            name: '完成量',
            type: 'bar',
            data: data.completion,
            itemStyle: {
              color: new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#06b6d4' },
                { offset: 1, color: '#00d4ff' }
              ])
            },
            barWidth: 14
          },
          {
            name: '计划量',
            type: 'bar',
            data: data.plan,
            itemStyle: {
              color: new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#00d4ff' },
                { offset: 1, color: '#fbbf24' }
              ])
            },
            barWidth: 14
          },
        ]
      });
    };

    updateChart();
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(barRef.current);
    return () => { ro.disconnect(); chart.dispose(); };
  }, [barRef, currentBarMonthIndex]);

  // 采矿作业柱状图 - 独立管理避免闪烁
  useEffect(() => {
    if (!miningRef.current) return;
    const chart = echarts.init(miningRef.current);

    const updateChart = () => {
      const data = miningDataByMonth[monthLabels[currentBarMonthIndex]];
      chart.setOption({
        animation: true,
        animationDuration: 800,
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['完成量', '计划量'], textStyle: { color: '#7dd3fc', fontSize: 10 }, right: 0, top: 0, itemWidth: 10, itemHeight: 6 },
        grid: { left: 2, right: 16, top: 28, bottom: 2, containLabel: true },
        xAxis: { type: 'value', axisLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.3)' } }, axisLabel: { color: '#7dd3fc', fontSize: 10 }, splitLine: { show: false } },
        yAxis: { type: 'category', data: ['采矿量', '出矿量', '采掘(剥)总量'], axisLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.3)' } }, axisLabel: { color: '#7dd3fc', fontSize: 10 } },
        series: [
          {
            name: '完成量',
            type: 'bar',
            data: data.completion,
            itemStyle: {
              color: new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#06b6d4' },
                { offset: 1, color: '#00d4ff' }
              ])
            },
            barWidth: 14,
            label: { show: true, position: 'right', color: '#fff', fontSize: 10, formatter: '{c}' }
          },
          {
            name: '计划量',
            type: 'bar',
            data: data.plan,
            itemStyle: {
              color: new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#00d4ff' },
                { offset: 1, color: '#fbbf24' }
              ])
            },
            barWidth: 14,
            label: { show: true, position: 'right', color: '#fff', fontSize: 10, formatter: '{c}' }
          },
        ]
      });
    };

    updateChart();
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(miningRef.current);
    return () => { ro.disconnect(); chart.dispose(); };
  }, [miningRef, currentBarMonthIndex]);

  // 集团出矿量折线图 - 使用独立useEffect避免闪烁
  useEffect(() => {
    if (!lineRef.current) return;
    const chart = echarts.init(lineRef.current);
    const currentData = outputDataByMonth[monthLabels[currentBarMonthIndex]];
    
    const option: echarts.EChartsOption = {
      animation: false,
      tooltip: { trigger: 'axis' },
      legend: { show: false },
      grid: { left: 2, right: 12, top: 28, bottom: 2, containLabel: true },
      xAxis: { type: 'category', data: ['2025-10', '2025-11', '2025-12', '2026-1', '2026-2', '2026-3', '2026-4'], axisLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.3)' } }, axisLabel: { color: '#7dd3fc', fontSize: 10, rotate: 30 } },
      yAxis: { type: 'value', axisLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.3)' } }, axisLabel: { color: '#7dd3fc', fontSize: 10 }, splitLine: { show: false } },
      series: [{
        type: 'line',
        smooth: true,
        data: currentData,
        areaStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(6, 182, 212, 0.6)' },
            { offset: 0.5, color: 'rgba(0, 212, 255, 0.3)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0.05)' }
          ])
        },
        lineStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#06b6d4' },
            { offset: 1, color: '#00d4ff' }
          ]),
          width: 3
        },
        itemStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#fbbf24' },
            { offset: 1, color: '#00d4ff' }
          ])
        },
        label: { show: true, color: '#fff', fontSize: 9, position: 'top' },
        symbol: 'circle',
        symbolSize: 6,
      }]
    };
    
    chart.setOption(option);
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(lineRef.current);
    return () => { ro.disconnect(); chart.dispose(); };
  }, [lineRef, currentBarMonthIndex]);

  // 地图
  useEffect(() => {
    if (!mapRef.current) return;
    const chart = echarts.init(mapRef.current);

    const xining = [101.78, 36.62];
    const leftMines = minePoints.filter(p => p.value[0] <= 100);
    const rightMines = minePoints.filter(p => p.value[0] > 100);

    const geoOption: echarts.EChartsOption = {
      geo: [
        {
          map: 'china',
          roam: false,
          zoom: 1.8,
          center: [104, 36],
          layoutSize: '135%',
          zlevel: 1,
          itemStyle: {
            areaColor: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#0f3460' },
                { offset: 0.5, color: '#0a2540' },
                { offset: 1, color: '#061830' }
              ]
            },
            borderColor: '#00d4ff',
            borderWidth: 1.2,
            shadowColor: 'rgba(0, 212, 255, 0.4)',
            shadowBlur: 30,
            shadowOffsetY: 10,
          },
          emphasis: {
            itemStyle: {
              areaColor: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#1a5a9a' },
                  { offset: 1, color: '#0f3a6a' }
                ]
              },
              shadowBlur: 40,
              shadowColor: 'rgba(0, 212, 255, 0.8)',
            },
            label: { show: false }
          },
          silent: true,
        },
        {
          map: 'china',
          roam: false,
          zoom: 1.1,
          center: [104, 38],
          itemStyle: {
            areaColor: '#050d18',
            borderColor: 'transparent',
            borderWidth: 0,
            opacity: 0.7,
            shadowColor: 'rgba(0, 0, 0, 0.8)',
            shadowBlur: 40,
            shadowOffsetY: 20,
          },
          emphasis: { disabled: true },
          silent: true,
        }
      ],
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: Array.from({ length: 60 }, () => [
            75 + Math.random() * 50,
            18 + Math.random() * 32
          ]),
          symbolSize: () => Math.random() * 3 + 1,
          itemStyle: {
            color: () => {
              const colors = ['#00d4ff', '#06b6d4', '#fbbf24', '#fff'];
              return colors[Math.floor(Math.random() * colors.length)];
            },
            opacity: 0.4,
          },
          silent: true,
          animation: false,
        },
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: [{ name: '西宁', value: xining }],
          symbolSize: 18,
          showEffectOn: 'render',
          rippleEffect: { brushType: 'stroke', scale: 4, period: 3 },
          itemStyle: { color: '#ffd700' },
          label: {
            show: true,
            formatter: '{b}',
            position: 'bottom',
            color: '#ffd700',
            fontSize: 11,
            fontWeight: 'bold',
            backgroundColor: 'rgba(5, 13, 24, 0.7)',
            padding: [3, 6],
            borderRadius: 3,
            borderColor: 'rgba(255, 215, 0, 0.4)',
            borderWidth: 1,
          },
          zlevel: 4,
        },
        {
          type: 'lines',
          coordinateSystem: 'geo',
          zlevel: 2,
          data: [{
            coords: [minePoints.find(p => p.name === mineUnits[currentMineDetailIndex])?.value || [100, 35], xining],
          }],
          effect: {
            show: true,
            period: 2,
            trailLength: 0.3,
            symbol: 'arrow',
            symbolSize: 6,
            color: '#f472b6',
          },
          lineStyle: {
            color: '#f472b6',
            width: 2,
            opacity: 0.6,
            curveness: 0.1,
            type: 'dashed',
          },
        },
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: leftMines.map(p => ({ 
            name: p.name, 
            value: p.value,
            itemStyle: { 
              color: p.name === mineUnits[currentMineDetailIndex] ? '#fbbf24' : '#f472b6',
              borderColor: p.name === mineUnits[currentMineDetailIndex] ? '#fff' : 'transparent',
              borderWidth: p.name === mineUnits[currentMineDetailIndex] ? 2 : 0
            }
          })),
          symbolSize: p => p.name === mineUnits[currentMineDetailIndex] ? 14 : 10,
          showEffectOn: 'render',
          rippleEffect: { brushType: 'stroke', scale: 3, period: 4 },
          label: {
            show: true,
            formatter: '{b}',
            position: 'right',
            color: '#fff',
            fontSize: 10,
            backgroundColor: 'rgba(26, 10, 46, 0.7)',
            padding: [3, 6],
            borderRadius: 3,
            borderColor: 'rgba(232, 121, 249, 0.3)',
            borderWidth: 1,
          },
          zlevel: 3,
        },
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: rightMines.map(p => ({ 
            name: p.name, 
            value: p.value,
            itemStyle: { 
              color: p.name === mineUnits[currentMineDetailIndex] ? '#fbbf24' : '#f472b6',
              borderColor: p.name === mineUnits[currentMineDetailIndex] ? '#fff' : 'transparent',
              borderWidth: p.name === mineUnits[currentMineDetailIndex] ? 2 : 0
            }
          })),
          symbolSize: p => p.name === mineUnits[currentMineDetailIndex] ? 14 : 10,
          showEffectOn: 'render',
          rippleEffect: { brushType: 'stroke', scale: 3, period: 4 },
          label: {
            show: true,
            formatter: '{b}',
            position: 'left',
            color: '#fff',
            fontSize: 10,
            backgroundColor: 'rgba(26, 10, 46, 0.7)',
            padding: [3, 6],
            borderRadius: 3,
            borderColor: 'rgba(232, 121, 249, 0.3)',
            borderWidth: 1,
          },
          zlevel: 3,
        },
      ]
    };

    const fallbackOption: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      xAxis: { show: false, min: 78, max: 128 },
      yAxis: { show: false, min: 18, max: 50 },
      series: [
        {
          type: 'scatter',
          data: minePoints.map(p => ({
            name: p.name,
            value: p.value,
            symbol: 'pin',
            symbolSize: p.name === mineUnits[currentMineDetailIndex] ? 24 : 20,
            itemStyle: { 
              color: p.name === mineUnits[currentMineDetailIndex] ? '#fbbf24' : '#f472b6' 
            },
            label: {
              show: true,
              formatter: '{b}',
              position: p.value[0] > 100 ? 'right' : 'left',
              color: '#fff',
              fontSize: 10,
              backgroundColor: 'rgba(5, 13, 24, 0.7)',
              padding: [3, 6],
              borderRadius: 3,
            }
          })),
        }
      ]
    };

    const updateChart = () => {
      const currentMinePoint = minePoints.find(p => p.name === mineUnits[currentMineDetailIndex]);
      chart.setOption({
        series: [{
          type: 'lines',
          coordinateSystem: 'geo',
          data: [{
            coords: [currentMinePoint?.value || [100, 35], xining],
          }]
        }]
      }, { merge: true });
    };

    fetch('./china.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load map');
        return res.json();
      })
      .then(geoJson => {
        echarts.registerMap('china', geoJson);
        chart.setOption(geoOption);
        const timer = setInterval(updateChart, 4000);
        return () => clearInterval(timer);
      })
      .catch(() => {
        chart.setOption(fallbackOption);
      });

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(mapRef.current);
    return () => { ro.disconnect(); chart.dispose(); };
  }, [currentMineDetailIndex]);

  return (
    <div className="dashboard">
      {/* 四角装饰 */}
      <div className="corner-deco tl" />
      <div className="corner-deco tr" />
      <div className="corner-deco bl" />
      <div className="corner-deco br" />

      <header className="dashboard-header">
        <div className="header-deco-left" />
        <div className="header-deco-right" />
        <div className="header-glow" />
        <div className="dashboard-clock">
          <div className="clock-time">{timeStr}</div>
          <div className="clock-date">{dateStr} {weekStr}</div>
        </div>
        <div className="dashboard-title">
          <span className="shine" />
          西部矿业矿山资源管理系统
        </div>
        {/* 右上角按钮组 */}
        <div className="header-actions">
          <button className="header-btn" onClick={() => window.location.href = '/'} title="进系统">
            <span className="header-btn-text">进系统</span>
          </button>
          <button className="header-btn" onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }} title="全屏切换">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 3 21 3 21 9"/>
              <polyline points="9 21 3 21 3 15"/>
              <line x1="21" y1="3" x2="14" y2="10"/>
              <line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          </button>
        </div>
      </header>

      <div className="dashboard-body">
        {/* 左侧 */}
        <div className="dashboard-col col-left">
          <div className="module-card" style={{ flex: 0.9, minHeight: 160 }}>
            <div className="module-title">矿业权证</div>
            {/* 汇总信息 - 单行纯文字 */}
            <div className="cert-summary-row">
              <span className="cert-summary-item">采矿权：<strong style={{ color: '#409eff' }}>16</strong> 张</span>
              <span className="cert-summary-item">探矿权：<strong style={{ color: '#9254de' }}>4</strong> 张</span>
            </div>
            {/* 矿权列表 */}
            <div className="mining-rights-list-header">
              <div className="mining-rights-col col-company">公司</div>
              <div className="mining-rights-col col-type">证照类型</div>
              <div className="mining-rights-col col-area">面积</div>
              <div className="mining-rights-col col-depth">开采深度</div>
              <div className="mining-rights-col col-expiry">有效期限</div>
            </div>
            <div ref={miningRightsScrollRef} className="mining-rights-scroll-body">
              {miningRightsData.map((item, idx) => (
                <div className="mining-rights-row" key={idx}>
                  <div className="mining-rights-col col-company">{item.company}</div>
                  <div className="mining-rights-col col-type">
                    <span className={`license-badge ${item.licenseType === '采矿权' ? 'badge-mining' : 'badge-exploration'}`}>
                      {item.licenseType}
                    </span>
                  </div>
                  <div className="mining-rights-col col-area">{item.area}</div>
                  <div className="mining-rights-col col-depth">{item.depth}</div>
                  <div className="mining-rights-col col-expiry">{item.expiryDate}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="module-card"
            style={{ flex: 1.6, minHeight: 280, position: 'relative' }}
            ref={pieCardRef}
            onMouseEnter={() => setIsPieHovering(true)}
            onMouseLeave={() => {
              setIsPieHovering(false);
              setShowMineDropdown(false);
              setShowTimeDropdown(false);
            }}
          >
            <div className="module-title">
              <span>保有金属量资源量分类</span>
              <div className="filter-tags">
                {/* 时间筛选框 */}
                <span
                  className="filter-tag time-filter-tag"
                  onClick={(e) => { e.stopPropagation(); setShowTimeDropdown(prev => !prev); }}
                  style={{ cursor: 'pointer' }}
                >
                  {selectedTime} ▼
                </span>
                {/* 矿山单位筛选框 */}
                <span
                  className="filter-tag mine-select-tag"
                  onClick={(e) => { e.stopPropagation(); setShowMineDropdown(prev => !prev); }}
                  style={{ cursor: 'pointer' }}
                >
                  {mineUnits[currentMineIndex]} ▼
                </span>
              </div>
            </div>
            {/* 时间下拉框 */}
            {showTimeDropdown && (
              <div className="mine-dropdown time-dropdown">
                {timeOptions.map((time) => (
                  <div
                    key={time}
                    className={`mine-dropdown-item ${time === selectedTime ? 'active' : ''}`}
                    onClick={() => { setSelectedTime(time); setShowTimeDropdown(false); }}
                  >
                    {time}
                  </div>
                ))}
              </div>
            )}
            {/* 矿山单位下拉框 */}
            {showMineDropdown && (
              <div className="mine-dropdown">
                {mineUnits.map((name, idx) => (
                  <div
                    key={name}
                    className={`mine-dropdown-item ${idx === currentMineIndex ? 'active' : ''}`}
                    onClick={() => handleSelectMine(idx)}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
            <div className="chart-box" ref={pieRef} style={{ minHeight: 200 }} />
          </div>

          <div className="module-card" style={{ flex: 1.3, minHeight: 240 }}
            onMouseEnter={() => setIsBarHovering(true)}
            onMouseLeave={() => {
              setIsBarHovering(false);
              setShowYearDropdown(false);
            }}
          >
            <div className="module-title">
              年度勘探进度
              <span
                className="filter-tag mine-select-tag"
                onClick={(e) => { e.stopPropagation(); setShowYearDropdown(prev => !prev); }}
                style={{ cursor: 'pointer', marginLeft: 'auto' }}
              >
                {selectedYear}年 ▼
              </span>
            </div>
            {showYearDropdown && (
              <div className="mine-dropdown">
                {yearOptions.map((year) => (
                  <div
                    key={year}
                    className={`mine-dropdown-item ${year === selectedYear ? 'active' : ''}`}
                    onClick={() => { setSelectedYear(year); setShowYearDropdown(false); }}
                  >
                    {year}年
                  </div>
                ))}
              </div>
            )}
            <div className="chart-box" ref={barRef} style={{ minHeight: 180 }} />
          </div>
        </div>

        {/* 中间 */}
        <div className="dashboard-col col-center">
          {/* 保有金属资源量 */}
          <div className="resource-section">
            <div className="resource-section-title">矿山保有金属资源量</div>
            <div className="resource-row">
              {metalData.map(item => (
                <div className="resource-card" key={item.name}>
                  <div className="resource-card-name">{item.name}</div>
                  <div className="resource-card-value">{item.value}</div>
                  <div className="resource-card-unit">{item.unit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 盐湖保有资源量 */}
          <div className="resource-section">
            <div className="resource-section-title">盐湖保有资源量</div>
            <div className="resource-row lake-row">
              {lakeData.map(item => (
                <div className="resource-card lake-card" key={item.name}>
                  <div className="resource-card-name">{item.name}</div>
                  <div className="resource-card-value">{item.value.toFixed(2)}</div>
                  <div className="resource-card-unit">{item.unit}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="module-card map-container" style={{ flex: 1.2, minHeight: 0, padding: 0, position: 'relative' }}>
            <div className="map-box" ref={mapRef} />
            {/* 矿山详细信息弹窗 */}
            {(() => {
              const currentMineName = mineUnits[currentMineDetailIndex];
              const currentMine = minePoints.find(p => p.name === currentMineName);
              const details = mineDetails[currentMineName];
              if (!currentMine || !details) return null;
              
              const isLeftSide = currentMine.value[0] <= 100;
              const popupStyle = {
                left: isLeftSide ? '60%' : 'auto',
                right: isLeftSide ? 'auto' : '5%',
                top: '15%',
              };
              
              return (
                <div className="mine-detail-popup" style={popupStyle}>
                  <div className="mine-popup-title">{currentMine.name}</div>
                  <div className="mine-popup-divider" />
                  {details.map((item, idx) => (
                    <div className="mine-popup-section" key={idx}>
                      <div className="mine-popup-mineral">矿种：{item.mineral}</div>
                      <div className="mine-popup-elements-list">
                        {item.elements.map((el, i) => (
                          <div key={i} className="mine-popup-element-item">
                            <span className="mine-popup-element-name">{el.name}</span>
                            <span className="mine-popup-element-amount">{el.amount}wt</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* 右侧 */}
        <div className="dashboard-col col-right">
          <div className="module-card" style={{ flex: 1.3, minHeight: 240 }}
            onMouseEnter={() => setIsBarHovering(true)}
            onMouseLeave={() => setIsBarHovering(false)}
          >
            <div className="module-title">
              采矿作业年总量（万吨）
              <span className="date-tag">{monthLabels[currentBarMonthIndex]}</span>
            </div>
            <div className="chart-box" ref={miningRef} style={{ minHeight: 180 }} />
          </div>

          <div className="module-card" style={{ flex: 1, minHeight: 200 }}
            onMouseEnter={() => setIsLineHovering(true)}
            onMouseLeave={() => setIsLineHovering(false)}
          >
            <div className="module-title">
              集团出矿量（万吨）
              <span className="date-tag">{monthLabels[currentBarMonthIndex]}</span>
            </div>
            <div className="chart-box" ref={lineRef} style={{ minHeight: 140 }} />
          </div>

          <div className="module-card" style={{ flex: 1.3, overflow: 'hidden', minHeight: 240 }}>
            <div className="module-title">
              三级矿量
              <span
                className="filter-tag mine-select-tag"
                onClick={(e) => { e.stopPropagation(); setShowQuarterDropdown(prev => !prev); }}
                style={{ cursor: 'pointer', marginLeft: 'auto' }}
              >
                {selectedQuarter} ▼
              </span>
            </div>
            {showQuarterDropdown && (
              <div className="mine-dropdown">
                {quarterOptions.map((quarter) => (
                  <div
                    key={quarter}
                    className={`mine-dropdown-item ${quarter === selectedQuarter ? 'active' : ''}`}
                    onClick={() => { setSelectedQuarter(quarter); setShowQuarterDropdown(false); }}
                  >
                    {quarter}
                  </div>
                ))}
              </div>
            )}
            <table className="data-table data-table-fixed-header">
              <thead>
                <tr>
                  <th>矿山单位</th>
                  <th>矿种/类型</th>
                  <th>开拓保有(年)</th>
                  <th>采准保有(年)</th>
                  <th>备采保有(月)</th>
                  <th>是否平衡</th>
                </tr>
              </thead>
            </table>
            <div ref={tableScrollRef} className="table-scroll-body">
              <table className="data-table">
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.unit}</td>
                      <td>{row.type}</td>
                      <td>{row.开拓}</td>
                      <td>{row.采准}</td>
                      <td>{row.备采}</td>
                      <td style={{ color: row.平衡 === '是' ? '#67c23a' : '#f56c6c' }}>{row.平衡}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
