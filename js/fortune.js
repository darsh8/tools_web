// ==================== 通用工具 ====================
function setCookie(name, value, days = 365) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}
function deleteCookie(name) {
    // 删除时需要指定相同的 path，否则无法删除
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
    // 同时也尝试不带 path 的删除（兼容性）
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

// ==================== 每日运势部分 ====================
const zodiacList = [
    { name: "白羊座", symbol: "♈" }, { name: "金牛座", symbol: "♉" }, { name: "双子座", symbol: "♊" },
    { name: "巨蟹座", symbol: "♋" }, { name: "狮子座", symbol: "♌" }, { name: "处女座", symbol: "♍" },
    { name: "天秤座", symbol: "♎" }, { name: "天蝎座", symbol: "♏" }, { name: "射手座", symbol: "♐" },
    { name: "摩羯座", symbol: "♑" }, { name: "水瓶座", symbol: "♒" }, { name: "双鱼座", symbol: "♓" }
];

// 主运势库 (50条)
const predictionPool = [
    "今天星辰为你加持，充满创造力和灵感，不妨把脑中想法付诸行动。",
    "月亮带来温柔的能量，人际关系升温，适合约会或与老友叙旧。",
    "水星点亮思维，工作学习效率倍增，但要避免钻牛角尖。",
    "今日容易收获意外惊喜，可能是来自远方的好消息。",
    "保持耐心，有些事情需要沉淀，下午运势逐渐走高。",
    "乐观是你今天的法宝，遇到小困难也能轻松化解。",
    "金星闪耀，魅力提升，单身者有望邂逅心动对象。",
    "适当放松心情，别给自己太大压力，好运自然来。",
    "团队合作如鱼得水，分享想法会得到重要支持。",
    "财运在线，但切忌冲动消费，理智会带来小确幸。",
    "灵感迸发，适合艺术创作或决策重要事务。",
    "今天适合独处思考，内心平静将带来新的方向。",
    "行动力旺盛，适合推进搁置已久的计划。",
    "沟通运上升，误会容易化解，适合谈判签约。",
    "健康能量饱满，适合运动或户外活动。",
    "学习运佳，新知识吸收快，考试易有出色表现。",
    "家庭关系和睦，适合陪伴家人或布置家居。",
    "偏财运不错，可能有红包、礼物或意外收入。",
    "事业上易得前辈指点，虚心请教可获益。",
    "感情上适合主动表达，小惊喜能增进亲密。",
    "避免与人争执，退一步海阔天空。",
    "适合整理旧物、清理思绪，轻装上阵。",
    "出行运佳，短途旅行或散步能带来好运。",
    "消费欲望强，注意理性购物。",
    "适合学习新技能或开启副业。",
    "旧友联系可能带来新机会。",
    "工作中易获认可，但别骄傲。",
    "投资需谨慎，勿轻信小道消息。",
    "睡眠质量提升，精神状态饱满。",
    "适合做公益或帮助他人，积累善缘。",
    "灵感如泉涌，创意工作者效率高。",
    "合作运佳，找到志同道合的伙伴。",
    "面试运上升，展现自信容易成功。",
    "注意小细节，避免因疏忽犯错。",
    "感情中多些包容，少些计较。",
    "适合断舍离，扔掉不必要的东西。",
    "运势平顺，宜按部就班完成目标。",
    "挑战带来成长，别害怕困难。",
    "人脉拓展，结识有趣的新朋友。",
    "适合制定长期计划，着眼未来。",
    "心情愉悦，容易感染身边人。",
    "决策力强，适合做重要选择。",
    "文艺气息浓厚，适合看展、听音乐。",
    "工作中有贵人提携，感恩之心。",
    "适合表白或增进感情。",
    "财运稳定，正财为主。",
    "注意交通安全，出门多留意。",
    "适合阅读或学习哲学、心理学。",
    "小确幸不断，生活充满惊喜。",
    "坚持就是胜利，别轻易放弃。"
];

// 额外风味库 (40条)
const extraFlavor = [
    "✨ 星星建议你多留意身边小确幸，微笑会引来贵人。",
    "🌙 夜晚灵感最盛，适合总结规划明日目标。",
    "💪 挑战即是机遇，勇敢向前会赢得尊重。",
    "🌸 善待自己，买一束花或吃顿美食，提升幸福感。",
    "⚡ 注意沟通方式，温和表达将事半功倍。",
    "🍃 多接触自然，吸收清新能量，运气更佳。",
    "🎯 今日关键词：专注。集中精力做好一件事。",
    "🎁 可能会收到意想不到的小礼物。",
    "💬 多听少说，能从他人言语中获得启发。",
    "💤 保证充足睡眠，明日精力更充沛。",
    "🤝 主动帮助别人，未来会得到回报。",
    "📈 事业上别怕展示自己，光芒会被看见。",
    "💖 爱情里真诚最重要，套路反而减分。",
    "🍀 幸运可能藏在不起眼的角落，细心发现。",
    "🧘 冥想或深呼吸，能平复焦虑。",
    "📝 写日记记录想法，有助于理清思路。",
    "🎨 发挥创造力，即使小事也能做出新意。",
    "🍎 注意饮食健康，身体是革命的本钱。",
    "📚 阅读一本好书，开阔视野。",
    "🎵 听喜欢的音乐，提升情绪能量。",
    "💼 工作分清主次，先解决核心问题。",
    "👫 与家人多联系，亲情是后盾。",
    "🏆 相信自己，你有能力解决任何问题。",
    "🌞 早起迎接阳光，一整天都充满活力。",
    "🎭 偶尔换个造型或穿搭，心情也会变好。",
    "🔑 机会总是留给有准备的人，今天多学一点。",
    "💎 珍惜当下，感恩拥有的一切。",
    "🌊 顺其自然，有些事情急不来。",
    "🔥 热情会传染，带动团队氛围。",
    "🧹 整理房间或办公桌，清爽环境带来好运。",
    "☕ 给自己一杯咖啡的时间，放松思考。",
    "🎈 保持好奇心，探索未知领域。",
    "🧩 解决一个难题后，奖励自己。",
    "💌 写封信或发条问候，温暖他人。",
    "🌱 种下希望的种子，耐心等待开花。",
    "🎇 今晚可能有流星，许愿易实现。",
    "🕯️ 点燃香薰或蜡烛，营造温馨氛围。",
    "🎬 看一部励志电影，汲取力量。",
    "🍰 甜食能带来快乐，但别过量。",
    "🎁 分享你的快乐，快乐会加倍。"
];

// 日期修饰词库
const dailyModifiers = [
    "今日", "今天", "此时", "当下", "星曜指引", "宇宙能量", "命运之轮",
    "星辰低语", "月光祝福", "日光洗礼", "风带来消息", "水流指引"
];

let currentZodiacIndex = 0;
// 存储当天的随机种子（每次刷新使用新的随机数，而非递增）
let currentDailySeed = null;

// 获取当天的日期标识
function getTodayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

// 真正的随机函数（不使用种子，每次完全随机）
function trueRandom(min, max) {
    return min + Math.random() * (max - min);
}

// 从数组中随机取一项（完全随机）
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 随机生成运势（完全随机，每天第一次打开和每次刷新都不同）
function generateRandomFortune(zodiacIdx) {
    // 综合运势分数 40-99
    const totalScore = Math.floor(trueRandom(40, 100));
    let starCount = totalScore >= 90 ? 5 : totalScore >= 75 ? 4 : totalScore >= 60 ? 3 : totalScore >= 45 ? 2 : 1;
    const starStr = "★".repeat(starCount) + "☆".repeat(5 - starCount);

    // 各项指数 30-99
    function getRandomStar() {
        const val = Math.floor(trueRandom(30, 100));
        let cnt = val >= 85 ? 5 : val >= 68 ? 4 : val >= 50 ? 3 : val >= 35 ? 2 : 1;
        return "★".repeat(cnt) + "☆".repeat(5 - cnt);
    }
    const loveStars = getRandomStar();
    const careerStars = getRandomStar();
    const wealthStars = getRandomStar();

    // 从库中随机选取
    const modifier = randomFromArray(dailyModifiers);
    const mainPred = randomFromArray(predictionPool);
    const extraText = randomFromArray(extraFlavor);
    const finalPrediction = `${modifier}，${mainPred} ${extraText}`;

    // 幸运色和数字
    const colorPool = ["金色","银色","珊瑚橙","静谧蓝","薰衣草紫","抹茶绿","暖阳黄","玫瑰粉","珍珠白","深空灰","赤陶红","琥珀橙"];
    const luckyColor = randomFromArray(colorPool);
    const luckyNumber = Math.floor(trueRandom(1, 31));

    return {
        total: totalScore,
        starStr: starStr,
        love: loveStars,
        career: careerStars,
        wealth: wealthStars,
        prediction: finalPrediction,
        luckyColor: luckyColor,
        luckyNumber: luckyNumber
    };
}

// 更新每日运势UI（完全随机，每次调用都不同）
function updateDailyUI() {
    const z = zodiacList[currentZodiacIndex];
    document.getElementById('zodiacSymbol').innerText = z.symbol;
    document.getElementById('zodiacName').innerText = z.name;
    const f = generateRandomFortune(currentZodiacIndex);
    document.getElementById('starRating').innerHTML = f.starStr;
    document.getElementById('luckScore').innerHTML = `✨ 综合运势：${f.total}分`;
    document.getElementById('predictionText').innerHTML = f.prediction;
    document.getElementById('loveLuck').innerHTML = f.love;
    document.getElementById('careerLuck').innerHTML = f.career;
    document.getElementById('wealthLuck').innerHTML = f.wealth;
    document.getElementById('luckyColor').innerHTML = f.luckyColor;
    document.getElementById('luckyNumber').innerHTML = f.luckyNumber;
}

function refreshFortune() { 
    updateDailyUI(); 
}
function selectZodiac(idx) { 
    currentZodiacIndex = idx; 
    updateDailyUI(); 
    renderZodiacButtons(); 
}
function renderZodiacButtons() {
    const container = document.getElementById('zodiacButtons');
    if(!container) return;
    container.innerHTML = '';
    zodiacList.forEach((z,idx)=>{
        const btn = document.createElement('button');
        btn.className = 'zodiac-btn'+(idx===currentZodiacIndex?' active':'');
        btn.innerHTML = `${z.symbol} ${z.name}`;
        btn.onclick = ()=>selectZodiac(idx);
        container.appendChild(btn);
    });
}

// ==================== 八字核心算法 ====================
const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const GAN_WX = { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水' };
const ZHI_WX = { '寅':'木','卯':'木','巳':'火','午':'火','申':'金','酉':'金','亥':'水','子':'水','辰':'土','戌':'土','丑':'土','未':'土' };
const ZHI_CANG = { '子':['癸'],'丑':['己','癸','辛'],'寅':['甲','丙','戊'],'卯':['乙'],'辰':['戊','乙','癸'],'巳':['丙','庚','戊'],'午':['丁','己'],'未':['己','丁','乙'],'申':['庚','壬','戊'],'酉':['辛'],'戌':['戊','辛','丁'],'亥':['壬','甲'] };
function getShiShen(day, other) {
    const order = { '甲':0,'乙':1,'丙':2,'丁':3,'戊':4,'己':5,'庚':6,'辛':7,'壬':8,'癸':9 };
    const diff = (order[other]-order[day]+10)%10;
    const map = {0:'比肩',1:'劫财',2:'食神',3:'伤官',4:'偏财',5:'正财',6:'正官',7:'七杀',8:'偏印',9:'正印'};
    return map[diff];
}
function getYearPillar(year,month,day) {
    let target = (month<2 || (month===2 && day<4)) ? year-1 : year;
    const offset = (target-4)%60;
    return { gan: GAN[offset%10], zhi: ZHI[offset%12] };
}
function getDayPillar(year,month,day) {
    let y=year, m=month, d=day;
    if(m===1||m===2) { y--; m+=12; }
    const A = Math.floor(y/100), B = Math.floor(A/4), C = 2-A+B;
    const E = Math.floor(365.25*(y+4716)), F = Math.floor(30.6001*(m+1));
    let JD = C+d+E+F-1524.5;
    const idx = (Math.floor(JD)-11)%60;
    return { gan: GAN[idx%10], zhi: ZHI[idx%12] };
}
function getMonthPillar(yearGan, month, day) {
    const mz = [{m:1,d:5,z:'寅'},{m:2,d:4,z:'卯'},{m:3,d:6,z:'辰'},{m:4,d:5,z:'巳'},{m:5,d:6,z:'午'},{m:6,d:7,z:'未'},{m:7,d:7,z:'申'},{m:8,d:8,z:'酉'},{m:9,d:8,z:'戌'},{m:10,d:8,z:'亥'},{m:11,d:7,z:'子'},{m:12,d:7,z:'丑'}];
    let zhi = '寅';
    for(let item of mz) if(month>item.m || (month===item.m && day>=item.d)) zhi=item.z;
    const startMap = { '甲':2,'乙':4,'丙':6,'丁':8,'戊':0,'己':2,'庚':4,'辛':6,'壬':8,'癸':0 };
    const start = startMap[yearGan];
    const zhiIdx = { '寅':0,'卯':1,'辰':2,'巳':3,'午':4,'未':5,'申':6,'酉':7,'戌':8,'亥':9,'子':10,'丑':11 };
    const ganIdx = (start + zhiIdx[zhi])%10;
    return { gan: GAN[ganIdx], zhi: zhi };
}
function getHourPillar(dayGan, hour) {
    const zhiMap = [[23,1,'子'],[1,3,'丑'],[3,5,'寅'],[5,7,'卯'],[7,9,'辰'],[9,11,'巳'],[11,13,'午'],[13,15,'未'],[15,17,'申'],[17,19,'酉'],[19,21,'戌'],[21,23,'亥']];
    let zhi = '子';
    for(let [s,e,z] of zhiMap) if(hour>=s && hour<e) { zhi=z; break; }
    const startMap = { '甲':0,'乙':2,'丙':4,'丁':6,'戊':8,'己':0,'庚':2,'辛':4,'壬':6,'癸':8 };
    const start = startMap[dayGan];
    const zhiIdx = { '子':0,'丑':1,'寅':2,'卯':3,'辰':4,'巳':5,'午':6,'未':7,'申':8,'酉':9,'戌':10,'亥':11 };
    const ganIdx = (start + zhiIdx[zhi])%10;
    return { gan: GAN[ganIdx], zhi: zhi };
}
function generateBaziChart(birthDate, hour, gender) {
    const year=birthDate.getFullYear(), month=birthDate.getMonth()+1, day=birthDate.getDate();
    const yP = getYearPillar(year,month,day);
    const dP = getDayPillar(year,month,day);
    const mP = getMonthPillar(yP.gan, month, day);
    const hP = getHourPillar(dP.gan, hour);
    const pillars = { year:yP, month:mP, day:dP, hour:hP };
    const dayMaster = dP.gan;
    const tenGods = { year:getShiShen(dayMaster,yP.gan), month:getShiShen(dayMaster,mP.gan), day:'日元', hour:getShiShen(dayMaster,hP.gan) };
    let wx = { 木:0,火:0,土:0,金:0,水:0 };
    [yP.gan,mP.gan,dP.gan,hP.gan].forEach(g=>wx[GAN_WX[g]]++);
    [yP.zhi,mP.zhi,dP.zhi,hP.zhi].forEach(z=>wx[ZHI_WX[z]]++);
    const selfElem = GAN_WX[dayMaster];
    const strength = wx[selfElem]>=4 ? '身旺' : (wx[selfElem]<=2 ? '身弱' : '中和');
    let patterns = [];
    if(tenGods.year==='正官'||tenGods.month==='正官') patterns.push('正官格');
    if(tenGods.year==='正财'||tenGods.month==='正财') patterns.push('正财格');
    if(patterns.length===0) patterns.push('杂气格');
    return { pillars, tenGods, wuXing:wx, analysis:{ dayMaster, element:selfElem, strength, patterns, gender }, cangGan:{ year:ZHI_CANG[yP.zhi], month:ZHI_CANG[mP.zhi], day:ZHI_CANG[dP.zhi], hour:ZHI_CANG[hP.zhi] } };
}
function predictYearFlow(chart, year) {
    const yP = getYearPillar(year,1,1);
    const dayMaster = chart.analysis.dayMaster;
    const yearTen = getShiShen(dayMaster, yP.gan);
    const selfElem = chart.analysis.element;
    const yearElem = GAN_WX[yP.gan];
    let type='平', advice='';
    if((selfElem==='木'&&yearElem==='水')||(selfElem==='火'&&yearElem==='木')||(selfElem==='土'&&yearElem==='火')||(selfElem==='金'&&yearElem==='土')||(selfElem==='水'&&yearElem==='金')) { type='吉'; advice='流年生助日主，贵人运强。'; }
    else if((selfElem==='木'&&yearElem==='金')||(selfElem==='火'&&yearElem==='水')||(selfElem==='土'&&yearElem==='木')||(selfElem==='金'&&yearElem==='火')||(selfElem==='水'&&yearElem==='土')) { type='凶'; advice='流年克制日主，谨防口舌。'; }
    else advice='流年平和，稳中求进。';
    const luckyColor = { '木':'绿','火':'红','土':'黄','金':'白','水':'黑' }[selfElem];
    return { year, yearPillar:`${yP.gan}${yP.zhi}`, yearTenGod:yearTen, fortuneType:type, advice, luckyColor, luckyNumber:(year%9)+1 };
}

// ==================== 易经六十四卦完整库 ====================
const HEXAGRAMS = {
    '111111': { name: '乾为天', desc: '刚健中正，自强不息', judgment: '元亨利贞' },
    '000000': { name: '坤为地', desc: '柔顺包容，厚德载物', judgment: '元亨，利牝马之贞' },
    '010001': { name: '屯卦', desc: '万事开头难', judgment: '元亨利贞' },
    '100010': { name: '蒙卦', desc: '启蒙开智', judgment: '亨' },
    '111010': { name: '需卦', desc: '等待时机', judgment: '有孚，光亨' },
    '010111': { name: '讼卦', desc: '谨防争执', judgment: '有孚窒惕，中吉' },
    '000010': { name: '师卦', desc: '师出有名', judgment: '贞，丈人吉' },
    '010000': { name: '比卦', desc: '亲附团结', judgment: '吉' },
    '111011': { name: '小畜卦', desc: '小有积蓄', judgment: '亨' },
    '110111': { name: '履卦', desc: '如履薄冰', judgment: '履虎尾，不咥人' },
    '111110': { name: '泰卦', desc: '万事顺遂', judgment: '小往大来，吉亨' },
    '011111': { name: '否卦', desc: '闭塞不通', judgment: '否之匪人' },
    '101111': { name: '同人卦', desc: '团结同心', judgment: '亨' },
    '111101': { name: '大有卦', desc: '丰收富足', judgment: '元亨' },
    '001000': { name: '谦卦', desc: '谦虚受益', judgment: '亨，君子有终' },
    '000100': { name: '豫卦', desc: '愉悦安乐', judgment: '利建侯行师' },
    '100110': { name: '随卦', desc: '随从时势', judgment: '元亨利贞' },
    '011001': { name: '蛊卦', desc: '整治腐败', judgment: '元亨' },
    '110001': { name: '临卦', desc: '亲临督导', judgment: '元亨利贞' },
    '100011': { name: '观卦', desc: '观察入微', judgment: '盥而不荐' },
    '101001': { name: '噬嗑卦', desc: '咬合阻碍', judgment: '亨' },
    '100101': { name: '贲卦', desc: '修饰文采', judgment: '亨' },
    '000111': { name: '剥卦', desc: '剥落衰败', judgment: '不利有攸往' },
    '111000': { name: '复卦', desc: '一阳来复', judgment: '亨' },
    '100001': { name: '无妄卦', desc: '不妄为', judgment: '元亨利贞' },
    '100111': { name: '大畜卦', desc: '积蓄力量', judgment: '利贞' },
    '100001': { name: '颐卦', desc: '颐养天年', judgment: '贞吉' },
    '011110': { name: '大过卦', desc: '过度危机', judgment: '栋桡' },
    '010010': { name: '坎为水', desc: '险阻重重', judgment: '习坎' },
    '101101': { name: '离为火', desc: '光明依附', judgment: '利贞' },
    '011001': { name: '咸卦', desc: '感应相通', judgment: '亨，利贞' },
    '001101': { name: '恒卦', desc: '持之以恒', judgment: '亨，无咎' },
    '110100': { name: '遁卦', desc: '急流勇退', judgment: '亨，小利贞' },
    '001110': { name: '大壮卦', desc: '强盛壮大', judgment: '利贞' },
    '000101': { name: '晋卦', desc: '晋升发展', judgment: '康侯用锡马' },
    '101000': { name: '明夷卦', desc: '韬光养晦', judgment: '利艰贞' },
    '100101': { name: '家人卦', desc: '家庭和睦', judgment: '利女贞' },
    '101100': { name: '睽卦', desc: '求同存异', judgment: '小事吉' },
    '001010': { name: '蹇卦', desc: '艰难险阻', judgment: '利西南' },
    '010100': { name: '解卦', desc: '解脱困境', judgment: '利西南' },
    '100010': { name: '损卦', desc: '减损增益', judgment: '有孚，元吉' },
    '010001': { name: '益卦', desc: '增益受益', judgment: '利有攸往' },
    '111110': { name: '夬卦', desc: '决断果断', judgment: '扬于王庭' },
    '011111': { name: '姤卦', desc: '不期而遇', judgment: '女壮' },
    '000110': { name: '萃卦', desc: '聚集精英', judgment: '亨' },
    '011000': { name: '升卦', desc: '上升进步', judgment: '元亨' },
    '011010': { name: '困卦', desc: '陷入困境', judgment: '亨' },
    '010110': { name: '井卦', desc: '养育万物', judgment: '改邑不改井' },
    '101110': { name: '革卦', desc: '变革创新', judgment: '己日乃孚' },
    '011101': { name: '鼎卦', desc: '鼎立新局', judgment: '元吉' },
    '100100': { name: '震为雷', desc: '震惊百里', judgment: '亨' },
    '001001': { name: '艮为山', desc: '静止安止', judgment: '艮其背' },
    '001011': { name: '渐卦', desc: '循序渐进', judgment: '女归吉' },
    '110100': { name: '归妹卦', desc: '婚嫁之象', judgment: '征凶' },
    '101010': { name: '丰卦', desc: '丰盛盛大', judgment: '亨' },
    '010101': { name: '旅卦', desc: '漂泊旅行', judgment: '小亨' },
    '011011': { name: '巽为风', desc: '顺从谦逊', judgment: '小亨' },
    '110110': { name: '兑为泽', desc: '喜悦快乐', judgment: '亨' },
    '110010': { name: '涣卦', desc: '涣散离散', judgment: '亨' },
    '010011': { name: '节卦', desc: '节制适度', judgment: '亨' },
    '110011': { name: '中孚卦', desc: '诚信待人', judgment: '豚鱼吉' },
    '101100': { name: '小过卦', desc: '小有过失', judgment: '亨' },
    '101010': { name: '既济卦', desc: '事已成', judgment: '亨小' },
    '010101': { name: '未济卦', desc: '事未成', judgment: '亨' }
};

function getHexagram(binary) {
    return HEXAGRAMS[binary] || { name: '未济卦', desc: '事未成，需继续努力', judgment: '亨' };
}

// 八卦名称
const BAGUA_NAMES = ['坤', '乾', '兑', '离', '震', '巽', '坎', '艮'];
// 八卦转二进制
const BAGUA_BINARY = ['000', '111', '110', '101', '100', '011', '010', '001'];

function numberDivination(n1, n2, n3, question) {
    let upperIdx = n1 % 8;
    let lowerIdx = n2 % 8;
    let movingIdx = n3 % 6;

    const shangGua = BAGUA_NAMES[upperIdx];
    const xiaGua = BAGUA_NAMES[lowerIdx];
    const binary = BAGUA_BINARY[upperIdx] + BAGUA_BINARY[lowerIdx];
    const gua = getHexagram(binary);
    const movingYao = movingIdx === 0 ? 6 : movingIdx;

    let bianBinary = binary.split('');
    const position = 6 - movingYao;
    bianBinary[position] = bianBinary[position] === '1' ? '0' : '1';
    const bianGua = getHexagram(bianBinary.join(''));

    return {
        question: question || '未提供问题',
        numbers: [n1, n2, n3],
        shangGua: shangGua,
        xiaGua: xiaGua,
        movingYao: movingYao,
        benGua: { name: gua.name, desc: gua.desc, judgment: gua.judgment },
        bianGua: { name: bianGua.name, desc: bianGua.desc, judgment: bianGua.judgment },
        interpretation: `数字${n1}、${n2}、${n3}起卦，上卦${shangGua}，下卦${xiaGua}，动爻第${movingYao}爻，得本卦「${gua.name}」，${gua.desc}。变卦为「${bianGua.name}」。`
    };
}

// ==================== Cookie 记忆 & 初始化 ====================
let currentBaziChart = null;
function saveBirthdayToCookie(date, hour, gender) { setCookie('user_birthday', JSON.stringify({ birthDate:date, birthHour:hour, gender }), 365); }
function loadBirthdayFromCookie() {
    const c = getCookie('user_birthday');
    if(c) try{ return JSON.parse(c); }catch(e){ return null; }
    return null;
}
function clearMemory() { deleteCookie('user_birthday'); alert('已清除记忆'); location.reload(); }

function handleBaziCalc() {
    const dateStr = document.getElementById('birthDate').value;
    const hour = parseInt(document.getElementById('birthHour').value);
    const gender = document.getElementById('gender').value;
    if(!dateStr || isNaN(hour)) { alert('请填写完整'); return; }
    saveBirthdayToCookie(dateStr, hour, gender);
    const date = new Date(dateStr);
    currentBaziChart = generateBaziChart(date, hour, gender);
    const { pillars, tenGods, wuXing, analysis, cangGan } = currentBaziChart;
    const html = `
        <div class="pillars">
            <div class="pillar"><strong>年柱</strong><br>${pillars.year.gan}${pillars.year.zhi}<br><small>${tenGods.year}</small></div>
            <div class="pillar"><strong>月柱</strong><br>${pillars.month.gan}${pillars.month.zhi}<br><small>${tenGods.month}</small></div>
            <div class="pillar"><strong>日柱</strong><br>${pillars.day.gan}${pillars.day.zhi}<br><small>${tenGods.day}</small></div>
            <div class="pillar"><strong>时柱</strong><br>${pillars.hour.gan}${pillars.hour.zhi}<br><small>${tenGods.hour}</small></div>
        </div>
        <p><strong>日主：</strong>${analysis.dayMaster} (${analysis.element}命) · ${analysis.gender} · ${analysis.strength}</p>
        <p><strong>格局：</strong>${analysis.patterns.join('、')}</p>
        <p><strong>五行：</strong>木${wuXing.木} 火${wuXing.火} 土${wuXing.土} 金${wuXing.金} 水${wuXing.水}</p>
        <p><strong>藏干：</strong>年${cangGan.year.join(',')} 月${cangGan.month.join(',')} 日${cangGan.day.join(',')} 时${cangGan.hour.join(',')}</p>
        <p><strong>简评：</strong>${analysis.dayMaster}日主${analysis.strength}，${analysis.strength==='身旺'?'喜克泄，宜金水':'喜生扶，宜木火'}</p>
    `;
    document.getElementById('baziResult').innerHTML = html;
}
function handleForecast() {
    if(!currentBaziChart) { alert('请先进行八字排盘'); return; }
    const year = parseInt(document.getElementById('forecastYear').value);
    const fc = predictYearFlow(currentBaziChart, year);
    const fortuneClass = fc.fortuneType==='吉'?'good':(fc.fortuneType==='凶'?'bad':'normal');
    document.getElementById('forecastResult').innerHTML = `
        <h3 style="color:#bf7c3c;">🌟 ${year}年运势预测</h3>
        <p><strong>流年：</strong>${fc.yearPillar} · ${fc.yearTenGod}</p>
        <p><strong>运势：</strong><span class="${fortuneClass}">${fc.fortuneType}</span></p>
        <p><strong>建议：</strong>${fc.advice}</p>
        <p><strong>幸运色：</strong>${fc.luckyColor} &nbsp;|&nbsp; <strong>幸运数字：</strong>${fc.luckyNumber}</p>
    `;
}
function handleNumberGua() {
    const n1 = parseInt(document.getElementById('num1').value);
    const n2 = parseInt(document.getElementById('num2').value);
    const n3 = parseInt(document.getElementById('num3').value);
    const q = document.getElementById('questionInput').value;
    if(isNaN(n1) || isNaN(n2) || isNaN(n3)) { alert('请输入三个有效数字'); return; }
    const res = numberDivination(n1, n2, n3, q || undefined);
    document.getElementById('yijingResult').innerHTML = `
        <h3 style="color:#bf7c3c;">🔢 数字卦结果</h3>
        ${res.question ? `<p><strong>所问：</strong>${res.question}</p>` : ''}
        <p><strong>数字：</strong>${res.numbers.join('、')}</p>
        <p><strong>本卦：</strong>${res.benGua.name} · ${res.benGua.desc}</p>
        <p><strong>变卦：</strong>${res.bianGua.name} · ${res.bianGua.desc}</p>
        <p><strong>动爻：</strong>第${res.movingYao}爻</p>
        <p>💬 ${res.interpretation}</p>
    `;
}

// Tab 切换
function initTabs() {
    const btns = document.querySelectorAll('.tab-btn');
    const panes = {
        daily: document.getElementById('dailyPane'),
        bazi: document.getElementById('baziPane'),
        yijing: document.getElementById('yijingPane')
    };
    btns.forEach(btn=>{
        btn.addEventListener('click',()=>{
            const tab = btn.dataset.tab;
            btns.forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            Object.values(panes).forEach(p=>p.classList.remove('active'));
            if(tab==='daily') panes.daily.classList.add('active');
            if(tab==='bazi') panes.bazi.classList.add('active');
            if(tab==='yijing') panes.yijing.classList.add('active');
        });
    });
}

// 页面加载
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('currentDate').innerHTML = `📅 ${new Date().toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'})}`;
    renderZodiacButtons();
    document.getElementById('refreshBtn')?.addEventListener('click', refreshFortune);
    updateDailyUI();
    initTabs();
    document.getElementById('baziCalcBtn')?.addEventListener('click', handleBaziCalc);
    document.getElementById('forecastBtn')?.addEventListener('click', handleForecast);
    document.getElementById('clearMemoryBtn')?.addEventListener('click', clearMemory);
    document.getElementById('numberGuaBtn')?.addEventListener('click', handleNumberGua);
    const saved = loadBirthdayFromCookie();
    if(saved && saved.birthDate){
        document.getElementById('birthDate').value = saved.birthDate;
        document.getElementById('birthHour').value = saved.birthHour;
        document.getElementById('gender').value = saved.gender;
        handleBaziCalc();
    } else {
        document.getElementById('baziResult').innerHTML = '<p style="text-align:center; color:#b97f4b;">✨ 输入生日后点击排盘，我们会记住您的信息 ✨</p>';
    }
});
