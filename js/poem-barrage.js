// 文件：poem-barrage.js
// 诗词数据
const poems = [
    "求不得，放不下，梧桐化成杖，孤走枯苍道。",
    "诸法因缘生，我说是因缘；因缘尽故灭，我作如是说。",
    "街喧闹，人过往，且记曾相识，不为少年留。",
    "一落红，一枯叶，落红离弦去，从此两难聚。",
    "若人造重罪，作已深自责；忏悔更不造，能拔根本业。",
    "一切有为法，如梦幻泡影，如露亦如电，应作如是观。",
    "落黄昏，三更雨，临行密密缝，离愁丝丝苦。",
    "我本因地，以念佛心，入无生忍，今于此界，摄念佛人，归于净土。",
    "人离合，月圆缺，花开又花谢，不愿再相逢。",
    "花映红，春风笑，佳人佩美坠，不知与谁同。",
    "风过处，百花残，心有意，爱无伤。",
    "损愁眉，哭断肠，待到佳期如梦。",
    "凝霜夜，幽香梦，枕边人赴烽火，吹起一帘牵挂。",
    "当舍于懈怠，远离诸愦闹；寂静常知足，是人当解脱。",
    "倾盆雨，惊天雷，众里寻他而去。",
    "碧天阔，白云散，百万里无硝烟，大雁向南飞去。",
    "汝修三昧，本出尘劳。淫心不除，尘不可出。",
    "龙吟恨，且回首，却在灯火阑珊。",
    "菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。",
    "马行处，雪无痕，相见难，别亦难。",
    "珠有泪，玉生烟，稀白头不胜簪，只是当时惘然。",
    "魔非魔，念人间，怎知情愁滋味。",
    "人间道，路远茫，相逢终有期。",
    "人间如梦，红尘万丈，劈不断相思情。",
    "挽金弓，如满月，望人间，凝伫久。",
    "一种相思，两处闲愁，火焰化红莲，此情自消衍。",
    "恨悠悠，几时休。爱轻轻，随风行。",
    "殿可毁，人可亡，恨犹在，何时还。",
    "英雄泪，只为江山。万里山河，千里孤城，破国恨，永难忘。",
    "心若顽石，不生多情，多情空于恨，此恨无绝期。",
    "风卷云残，俱消往昔，既然无缘，何立誓言。",
    "彼岸花，有花无叶，生生世世，永不相见；幻七彩，无生无死，无苦无悲，无欲无求。"
];

// 弹幕配置
const barrageConfig = {
    speed: 0.4,
    fontSize: 24,
    interval: 1000,
    fontFamily: "'STKaiti', 'SimSun', 'Microsoft YaHei', serif",
    colors: ['#FFD700', '#98FB98', '#87CEEB', '#FFB6C1', '#DDA0DD', '#FFA07A'],
    leftMargin: 30,
    rightMargin: 30,
    maxWidth: 120,
    opacity: 1,
    lineHeight: 1,
    columns: 3,
    columnCooldown: 3000
};

// 全局变量
let container;
let barrageInterval;
let leftColumns = [];
let rightColumns = [];
let leftColumnCooldowns = [];
let rightColumnCooldowns = [];
let isPageVisible = true;
let lastBarrageTime = 0;
let activeBarrages = [];

// 处理诗词文本，添加换行
function processPoemText(text) {
    const punctuation = ['。', '，', '；', '！', '？', '、', '.', ',', ';'];
    let result = '';
    let line = '';
    let charCount = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        line += char;
        charCount++;
        
        if (punctuation.includes(char) || charCount >= 6) {
            result += line + '<br>';
            line = '';
            charCount = 0;
        }
    }
    
    if (line) {
        result += line;
    }
    
    return result;
}

// 初始化列数组
function initColumns() {
    leftColumns = [];
    leftColumnCooldowns = [];
    rightColumns = [];
    rightColumnCooldowns = [];
    
    for (let i = 0; i < barrageConfig.columns; i++) {
        leftColumns[i] = [];
        leftColumnCooldowns[i] = 0;
        rightColumns[i] = [];
        rightColumnCooldowns[i] = 0;
    }
}

// 检查列是否可用
function isColumnAvailable(columnIndex, isLeft) {
    const cooldowns = isLeft ? leftColumnCooldowns : rightColumnCooldowns;
    return Date.now() >= cooldowns[columnIndex];
}

// 选择最佳列
function selectBestColumn(isLeft) {
    const columns = isLeft ? leftColumns : rightColumns;
    const availableColumns = [];
    
    for (let i = 0; i < columns.length; i++) {
        if (isColumnAvailable(i, isLeft)) {
            availableColumns.push(i);
        }
    }
    
    if (availableColumns.length === 0) {
        return -1;
    }
    
    let bestColumnIndex = availableColumns[0];
    let highestPosition = Number.MAX_SAFE_INTEGER;
    
    for (let i = 0; i < availableColumns.length; i++) {
        const columnIndex = availableColumns[i];
        const positions = columns[columnIndex];
        
        if (positions.length === 0) {
            return columnIndex;
        }
        
        const currentHighest = Math.max(...positions);
        if (currentHighest < highestPosition) {
            highestPosition = currentHighest;
            bestColumnIndex = columnIndex;
        }
    }
    
    return bestColumnIndex;
}

// 计算新弹幕的起始位置
function calculateStartPosition(columnIndex, isLeft, height) {
    const columns = isLeft ? leftColumns : rightColumns;
    const positions = columns[columnIndex] || [];
    
    if (positions.length === 0) {
        return -height - 20;
    }
    
    const bottomMost = Math.max(...positions);
    let startPos = bottomMost + height * 1.2;
    
    if (startPos > 0) {
        startPos = -height - 20;
    }
    
    return startPos;
}

// 创建单个弹幕
function createBarrage() {
    if (!isPageVisible || !container) return;
    
    const currentTime = Date.now();
    if (currentTime - lastBarrageTime < barrageConfig.interval) {
        return;
    }
    
    const poem = poems[Math.floor(Math.random() * poems.length)];
    const color = barrageConfig.colors[Math.floor(Math.random() * barrageConfig.colors.length)];
    const isLeft = Math.random() > 0.5;
    
    const columnIndex = selectBestColumn(isLeft);
    if (columnIndex === -1) {
        return;
    }
    
    lastBarrageTime = currentTime;
    
    const barrage = document.createElement('div');
    const columnWidth = barrageConfig.maxWidth;
    
    let left, right, textAlign;
    if (isLeft) {
        const offsetX = columnIndex * (columnWidth + 10) + barrageConfig.leftMargin;
        left = `${offsetX}px`;
        right = 'auto';
        textAlign = 'right';
    } else {
        const offsetX = columnIndex * (columnWidth + 10) + barrageConfig.rightMargin;
        left = 'auto';
        right = `${offsetX}px`;
        textAlign = 'left';
    }
    
    barrage.style.cssText = `
        position: absolute;
        max-width: ${barrageConfig.maxWidth}px;
        width: ${barrageConfig.maxWidth}px;
        font-size: ${barrageConfig.fontSize}px;
        color: ${color};
        opacity: 0;
        left: ${left};
        right: ${right};
        bottom: -100px;
        text-align: ${textAlign};
        font-family: ${barrageConfig.fontFamily};
        font-weight: normal;
        pointer-events: none;
        user-select: none;
        line-height: ${barrageConfig.lineHeight};
        word-wrap: break-word;
        word-break: break-all;
        white-space: normal;
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.5), 1px 1px 3px rgba(0, 0, 0, 0.6), -1px 1px 3px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        transition: opacity 1s ease-in-out;
    `;
    
    barrage.innerHTML = processPoemText(poem);
    container.appendChild(barrage);
    
    setTimeout(() => {
        const height = barrage.offsetHeight;
        const startPos = calculateStartPosition(columnIndex, isLeft, height);
        let pos = startPos;
        const speed = barrageConfig.speed * (0.8 + Math.random() * 0.4);
        
        const totalDistance = window.innerHeight + 20 - startPos;
        const totalTime = totalDistance / speed;
        
        const columns = isLeft ? leftColumns : rightColumns;
        columns[columnIndex].push(pos);
        
        const barrageId = Date.now() + Math.random();
        const barrageState = {
            id: barrageId,
            element: barrage,
            pos: pos,
            columnIndex: columnIndex,
            isLeft: isLeft,
            totalTime: totalTime,
            speed: speed,
            active: true
        };
        
        activeBarrages.push(barrageState);
        
        setTimeout(() => {
            barrage.style.opacity = barrageConfig.opacity;
        }, 100);
        
        function move() {
            if (!isPageVisible || !barrageState.active) return;
            
            pos += speed;
            barrage.style.bottom = `${pos}px`;
            barrageState.pos = pos;
            
            if (pos > 50 && pos < window.innerHeight + 100) {
                barrage.style.opacity = Math.max(0.4, barrageConfig.opacity - 0.1);
            } else {
                barrage.style.opacity = barrageConfig.opacity;
            }
            
            if (pos > window.innerHeight + 20) {
                if (barrage.parentNode === container) {
                    container.removeChild(barrage);
                }
                
                const columns = isLeft ? leftColumns : rightColumns;
                const positions = columns[columnIndex];
                const removeIndex = positions.indexOf(pos);
                if (removeIndex !== -1) {
                    positions.splice(removeIndex, 1);
                }
                
                const cooldowns = isLeft ? leftColumnCooldowns : rightColumnCooldowns;
                cooldowns[columnIndex] = Date.now() + totalTime * 1000 + barrageConfig.columnCooldown;
                
                const activeIndex = activeBarrages.findIndex(b => b.id === barrageId);
                if (activeIndex !== -1) {
                    activeBarrages.splice(activeIndex, 1);
                }
                
                barrageState.active = false;
            } else {
                requestAnimationFrame(move);
            }
        }
        
        requestAnimationFrame(move);
    }, 10);
}

// 初始化弹幕系统
function initBarrageSystem() {
    container = document.createElement('div');
    container.id = 'poem-barrage';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
        overflow: hidden;
    `;
    document.body.appendChild(container);
    
    initColumns();
    barrageInterval = setInterval(createBarrage, barrageConfig.interval);
    
    for (let i = 0; i < barrageConfig.columns; i++) {
        setTimeout(createBarrage, i * 500);
    }
    
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

// 处理页面可见性变化
function handleVisibilityChange() {
    if (document.hidden) {
        isPageVisible = false;
        if (barrageInterval) {
            clearInterval(barrageInterval);
            barrageInterval = null;
        }
        activeBarrages.forEach(barrage => {
            barrage.active = false;
        });
    } else {
        isPageVisible = true;
        if (!barrageInterval) {
            barrageInterval = setInterval(createBarrage, barrageConfig.interval);
        }
        
        activeBarrages.forEach(barrage => {
            if (barrage.active === false && barrage.element) {
                barrage.active = true;
                function resumeMove() {
                    if (!isPageVisible || !barrage.active) return;
                    
                    barrage.pos += barrage.speed;
                    barrage.element.style.bottom = `${barrage.pos}px`;
                    
                    if (barrage.pos > window.innerHeight + 20) {
                        if (barrage.element.parentNode === container) {
                            container.removeChild(barrage.element);
                        }
                        
                        const columns = barrage.isLeft ? leftColumns : rightColumns;
                        const positions = columns[barrage.columnIndex];
                        const removeIndex = positions.indexOf(barrage.pos);
                        if (removeIndex !== -1) {
                            positions.splice(removeIndex, 1);
                        }
                        
                        const cooldowns = barrage.isLeft ? leftColumnCooldowns : rightColumnCooldowns;
                        cooldowns[barrage.columnIndex] = Date.now() + barrage.totalTime * 1000 + barrageConfig.columnCooldown;
                        
                        const activeIndex = activeBarrages.findIndex(b => b.id === barrage.id);
                        if (activeIndex !== -1) {
                            activeBarrages.splice(activeIndex, 1);
                        }
                        
                        barrage.active = false;
                    } else {
                        requestAnimationFrame(resumeMove);
                    }
                }
                requestAnimationFrame(resumeMove);
            }
        });
        
        lastBarrageTime = Date.now();
    }
}

// 处理窗口大小变化
function handleResize() {
    if (window.innerWidth < 768) {
        barrageConfig.leftMargin = 15;
        barrageConfig.rightMargin = 15;
        barrageConfig.maxWidth = 120;
        barrageConfig.fontSize = 22;
    } else {
        barrageConfig.leftMargin = 25;
        barrageConfig.rightMargin = 25;
        barrageConfig.maxWidth = 150;
        barrageConfig.fontSize = 20;
    }
}

// 公共API
window.poemBarrage = {
    addPoem: function(poem) {
        if (typeof poem === 'string' && poem.trim()) {
            poems.push(poem.trim());
        }
    },
    
    updateConfig: function(newConfig) {
        Object.assign(barrageConfig, newConfig);
        
        if (newConfig.interval && barrageInterval) {
            clearInterval(barrageInterval);
            barrageInterval = setInterval(createBarrage, barrageConfig.interval);
        }
    },
    
    pause: function() {
        if (barrageInterval) {
            clearInterval(barrageInterval);
            barrageInterval = null;
        }
    },
    
    resume: function() {
        if (!barrageInterval) {
            barrageInterval = setInterval(createBarrage, barrageConfig.interval);
        }
    },
    
    clear: function() {
        if (container) {
            const barrages = container.querySelectorAll('div');
            barrages.forEach(barrage => {
                if (barrage.parentNode === container) {
                    container.removeChild(barrage);
                }
            });
        }
    }
};

// 页面加载完成后启动
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBarrageSystem);
} else {
    initBarrageSystem();
}
