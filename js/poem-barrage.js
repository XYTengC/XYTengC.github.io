// 文件：poem-barrage.js
// 诗词数据（仅诗词部分，无装备名）
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
    speed: 0.4,          // 默认下落速度，适当降低以便更多弹幕同时显示
    fontSize: 24,        // 字体大小，适当减小以便更多弹幕同时显示
    interval: 10000,       // 弹幕生成间隔(毫秒)，缩短间隔以便更多弹幕同时显示
    fontFamily: "'STKaiti', 'SimSun', 'Microsoft YaHei', serif",
    // 调整颜色，确保在暗色背景下有良好的可读性
    colors: ['#FFD700', '#98FB98', '#87CEEB', '#FFB6C1', '#DDA0DD', '#FFA07A'],
    leftMargin: 30,      // 左侧距离
    rightMargin: 30,     // 右侧距离
    maxWidth: 120,       // 弹幕最大宽度（支持换行），扩大空间
    opacity: 1,        // 透明度，适当提高以便在暗色背景下更清晰
    lineHeight: 1,       // 行高，适当减小以便更多行同时显示
    enableControl: true, // 是否启用控制面板
    maxSimultaneous: 8,  // 每侧最大同时显示弹幕数
    columns: 3,          // 每侧显示的列数
    columnCooldown: 30000 // 同一列弹幕的冷却时间（毫秒），弹幕结束后需要等待的时间
};

// 全局变量
let container;
let barrageInterval;
// 跟踪左侧和右侧当前屏幕上的弹幕位置，按列组织
let leftColumns = [];
let rightColumns = [];
// 跟踪每列的冷却状态，存储每列的最后一条弹幕结束时间
let leftColumnCooldowns = [];
let rightColumnCooldowns = [];
// 跟踪页面可见性状态
let isPageVisible = true;
// 跟踪上次生成弹幕的时间
let lastBarrageTime = 0;
// 存储正在动画的弹幕
let activeBarrages = [];

function processPoemText(text, align) {
    // 根据标点符号和长度适当换行
    const maxChars = 1; // 每行最大字符数，优化换行逻辑，允许更长的行
    const punctuation = ['。', '，', '；', '！', '？', '、', '.', ',', ';'];
    
    let result = '';
    let line = '';
    let charCount = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        line += char;
        charCount++;
        
        // 如果遇到标点或达到最大字符数，换行
        if (punctuation.includes(char) || charCount >= maxChars) {
            result += line + '<br>';
            line = '';
            charCount = 0;
        }
    }
    
    // 添加剩余部分
    if (line) {
        result += line;
    }
    
    return result;
}

// 初始化列数组
function initColumns() {
    // 初始化左侧列数组和冷却时间
    leftColumns = [];
    leftColumnCooldowns = [];
    for (let i = 0; i < barrageConfig.columns; i++) {
        leftColumns[i] = [];
        leftColumnCooldowns[i] = 0; // 初始冷却时间为0，可立即使用
    }
    
    // 初始化右侧列数组和冷却时间
    rightColumns = [];
    rightColumnCooldowns = [];
    for (let i = 0; i < barrageConfig.columns; i++) {
        rightColumns[i] = [];
        rightColumnCooldowns[i] = 0; // 初始冷却时间为0，可立即使用
    }
}

// 检查列是否可用（不在冷却中）
function isColumnAvailable(columnIndex, isLeft) {
    const cooldowns = isLeft ? leftColumnCooldowns : rightColumnCooldowns;
    const lastEndTime = cooldowns[columnIndex];
    const currentTime = Date.now();
    
    return currentTime >= lastEndTime;
}

// 计算新弹幕的起始位置，确保不与已有弹幕重叠，按列计算
function calculateStartPosition(columnIndex, isLeft, height) {
    const columns = isLeft ? leftColumns : rightColumns;
    const positions = columns[columnIndex] || [];
    const minSpacing = height * 1.2; // 最小间距为弹幕高度的1.2倍
    
    // 如果列中没有弹幕，从顶部开始
    if (positions.length === 0) {
        return -height - 20;
    }
    
    // 找到该列最底部的弹幕位置
    const bottomMost = Math.max(...positions);
    
    // 计算新弹幕的起始位置，确保与底部弹幕有足够的间距
    let startPos = bottomMost + minSpacing;
    
    // 如果起始位置已经在屏幕内，调整到屏幕外
    if (startPos > 0) {
        startPos = -height - 20;
    }
    
    return startPos;
}

// 选择最佳列，只选择可用的（不在冷却中的）列
function selectBestColumn(isLeft) {
    const columns = isLeft ? leftColumns : rightColumns;
    const cooldowns = isLeft ? leftColumnCooldowns : rightColumnCooldowns;
    let bestColumnIndex = -1;
    let highestPosition = Number.MAX_SAFE_INTEGER;
    
    // 首先检查是否有可用的列
    const availableColumns = [];
    for (let i = 0; i < columns.length; i++) {
        if (isColumnAvailable(i, isLeft)) {
            availableColumns.push(i);
        }
    }
    
    // 如果没有可用列，返回-1表示当前没有可用列
    if (availableColumns.length === 0) {
        return -1;
    }
    
    // 遍历所有可用列，找到位置最高的列
    for (let i = 0; i < availableColumns.length; i++) {
        const columnIndex = availableColumns[i];
        const positions = columns[columnIndex] || [];
        
        if (positions.length === 0) {
            // 如果该列没有弹幕，直接选择
            return columnIndex;
        }
        
        const currentHighest = Math.max(...positions);
        if (currentHighest < highestPosition) {
            highestPosition = currentHighest;
            bestColumnIndex = columnIndex;
        }
    }
    
    // 如果没有找到最佳列，返回第一个可用列
    return bestColumnIndex !== -1 ? bestColumnIndex : availableColumns[0];
}

// 创建单个弹幕
function createBarrage() {
    // 检查页面是否可见，如果不可见则不创建弹幕
    if (!isPageVisible) return;
    
    // 检查是否已经超过了弹幕生成间隔
    const currentTime = Date.now();
    if (currentTime - lastBarrageTime < barrageConfig.interval) {
        return;
    }
    
    if (!container) return;
    
    const poem = poems[Math.floor(Math.random() * poems.length)];
    const color = barrageConfig.colors[Math.floor(Math.random() * barrageConfig.colors.length)];
    
    // 随机选择左侧或右侧（50%概率）
    const isLeft = Math.random() > 0.5;
    
    // 选择最佳列
    const columnIndex = selectBestColumn(isLeft);
    
    // 如果没有可用列，直接返回，不创建弹幕
    if (columnIndex === -1) {
        return;
    }
    
    // 更新上次生成弹幕的时间
    lastBarrageTime = currentTime;
    
    // 创建弹幕元素
    const barrage = document.createElement('div');
    
    // 计算列宽，根据列数分配空间
    const columnWidth = barrageConfig.maxWidth;
    
    // 设置不同列的水平位置
    let left, right, textAlign, marginSide, offsetX;
    if (isLeft) {
        // 左侧多列布局
        offsetX = columnIndex * (columnWidth + 10) + barrageConfig.leftMargin;
        left = `${offsetX}px`;
        right = 'auto';
        textAlign = 'right';
        marginSide = 'margin-right: 5px;';
    } else {
        // 右侧多列布局
        offsetX = columnIndex * (columnWidth + 10) + barrageConfig.rightMargin;
        left = 'auto';
        right = `${offsetX}px`;
        textAlign = 'left';
        marginSide = 'margin-left: 5px;';
    }
    
    // 设置初始透明度为0，避免闪烁
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
        ${marginSide}
        text-shadow: 
            0 0 8px rgba(255, 255, 255, 0.5),
            1px 1px 3px rgba(0, 0, 0, 0.6),
            -1px 1px 3px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        transition: opacity 1s ease-in-out;
    `;
    
    // 设置处理后的文本（带换行）
    barrage.innerHTML = processPoemText(poem);
    
    // 添加到容器
    container.appendChild(barrage);
    
    // 计算弹幕实际高度
    setTimeout(() => {
        const height = barrage.offsetHeight;
        const startPos = calculateStartPosition(columnIndex, isLeft, height);
        let pos = startPos;
        const speed = barrageConfig.speed * (0.8 + Math.random() * 0.4); // 速度有随机浮动
        
        // 计算弹幕从开始到结束所需的时间，用于设置冷却时间
        const totalDistance = window.innerHeight + 20 - startPos;
        const totalTime = totalDistance / speed;
        
        // 将新弹幕后位置添加到对应列的跟踪数组
        const columns = isLeft ? leftColumns : rightColumns;
        const positions = columns[columnIndex];
        positions.push(pos);
        
        // 存储当前弹幕的状态信息
        const barrageId = Date.now() + Math.random();
        const barrageState = {
            id: barrageId,
            element: barrage,
            startPos: startPos,
            columnIndex: columnIndex,
            isLeft: isLeft,
            totalTime: totalTime,
            speed: speed,
            pos: pos,
            active: true
        };
        
        // 添加到活跃弹幕列表
        activeBarrages.push(barrageState);
        
        // 延迟一点时间后设置透明度，避免闪烁
        setTimeout(() => {
            barrage.style.opacity = barrageConfig.opacity;
        }, 100);
        
        // 动画函数
        function move() {
            // 检查页面是否可见，如果不可见则暂停动画
            if (!isPageVisible) {
                return;
            }
            
            pos += speed;
            barrage.style.bottom = `${pos}px`;
            barrageState.pos = pos;
            
            // 更新弹幕在跟踪数组中的位置
            const positions = barrageState.isLeft ? leftColumns[barrageState.columnIndex] : rightColumns[barrageState.columnIndex];
            const index = positions.indexOf(barrageState.startPos);
            if (index !== -1) {
                positions[index] = pos;
            }
            
            // 如果弹幕完全进入视野，稍微降低透明度避免干扰
            if (pos > 50 && pos < window.innerHeight + 100) {
                barrage.style.opacity = Math.max(0.4, barrageConfig.opacity - 0.1);
            } else {
                barrage.style.opacity = barrageConfig.opacity;
            }
            
            // 如果超出屏幕底部，移除弹幕
            if (pos > window.innerHeight + 20) {
                if (barrage.parentNode === container) {
                    container.removeChild(barrage);
                }
                // 从对应列的跟踪数组中移除
                const columns = barrageState.isLeft ? leftColumns : rightColumns;
                const positions = columns[barrageState.columnIndex];
                const removeIndex = positions.indexOf(pos);
                if (removeIndex !== -1) {
                    positions.splice(removeIndex, 1);
                }
                
                // 设置该列的冷却时间
                const currentTime = Date.now();
                const cooldowns = barrageState.isLeft ? leftColumnCooldowns : rightColumnCooldowns;
                // 冷却时间 = 当前时间 + 弹幕从开始到结束的时间 + 额外的冷却时间
                cooldowns[barrageState.columnIndex] = currentTime + barrageState.totalTime * 1000 + barrageConfig.columnCooldown;
                
                // 从活跃弹幕列表中移除
                const activeIndex = activeBarrages.findIndex(b => b.id === barrageId);
                if (activeIndex !== -1) {
                    activeBarrages.splice(activeIndex, 1);
                }
                
                barrageState.active = false;
            } else {
                requestAnimationFrame(move);
            }
        }
        
        move();
    }, 10);
}
// 初始化弹幕系统
function initBarrageSystem() {
    // 创建弹幕容器
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
        background: ${barrageConfig.background}; // 添加暗色背景
    `;
    document.body.appendChild(container);
    
    // 初始化列数组
    initColumns();
    
    // 开始生成弹幕
    barrageInterval = setInterval(createBarrage, barrageConfig.interval);
    
    // 初始生成适当数量的弹幕，根据列数和间隔调整
    const initialBarrages = barrageConfig.columns;
    for (let i = 0; i < initialBarrages; i++) {
        setTimeout(createBarrage, i * 500);
    }
    
    // 响应窗口大小变化
    window.addEventListener('resize', handleResize);
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

// 处理页面可见性变化
function handleVisibilityChange() {
    if (document.hidden) {
        // 页面隐藏时
        isPageVisible = false;
        // 清除弹幕生成间隔
        if (barrageInterval) {
            clearInterval(barrageInterval);
            barrageInterval = null;
        }
        // 暂停所有活跃弹幕的动画
        activeBarrages.forEach(barrage => {
            barrage.active = false;
        });
    } else {
        // 页面可见时
        isPageVisible = true;
        // 重新设置弹幕生成间隔
        if (!barrageInterval) {
            barrageInterval = setInterval(createBarrage, barrageConfig.interval);
        }
        // 重新启动所有活跃弹幕的动画
        activeBarrages.forEach(barrage => {
            if (barrage.active === false && barrage.element) {
                barrage.active = true;
                // 重新启动动画
                function resumeMove() {
                    if (!isPageVisible) return;
                    
                    barrage.pos += barrage.speed;
                    barrage.element.style.bottom = `${barrage.pos}px`;
                    
                    // 更新弹幕在跟踪数组中的位置
                    const positions = barrage.isLeft ? leftColumns[barrage.columnIndex] : rightColumns[barrage.columnIndex];
                    const index = positions.indexOf(barrage.startPos);
                    if (index !== -1) {
                        positions[index] = barrage.pos;
                    }
                    
                    // 如果弹幕完全进入视野，稍微降低透明度避免干扰
                    if (barrage.pos > 50 && barrage.pos < window.innerHeight + 100) {
                        barrage.element.style.opacity = Math.max(0.4, barrageConfig.opacity - 0.1);
                    } else {
                        barrage.element.style.opacity = barrageConfig.opacity;
                    }
                    
                    // 如果超出屏幕底部，移除弹幕
                    if (barrage.pos > window.innerHeight + 20) {
                        if (barrage.element.parentNode === container) {
                            container.removeChild(barrage.element);
                        }
                        // 从对应列的跟踪数组中移除
                        const columns = barrage.isLeft ? leftColumns : rightColumns;
                        const positions = columns[barrage.columnIndex];
                        const removeIndex = positions.indexOf(barrage.pos);
                        if (removeIndex !== -1) {
                            positions.splice(removeIndex, 1);
                        }
                        
                        // 设置该列的冷却时间
                        const currentTime = Date.now();
                        const cooldowns = barrage.isLeft ? leftColumnCooldowns : rightColumnCooldowns;
                        cooldowns[barrage.columnIndex] = currentTime + barrage.totalTime * 1000 + barrageConfig.columnCooldown;
                        
                        // 从活跃弹幕列表中移除
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
        
        // 重置上次生成弹幕的时间，避免页面恢复时生成过多弹幕
        lastBarrageTime = Date.now();
    }
}

// 处理窗口大小变化
function handleResize() {
    // 可以在这里添加响应式调整
    // 例如根据窗口宽度调整边距
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

// 公共API（可选）
window.poemBarrage = {
    // 添加自定义诗词
    addPoem: function(poem) {
        if (typeof poem === 'string' && poem.trim()) {
            poems.push(poem.trim());
        }
    },
    
    // 更新配置
    updateConfig: function(newConfig) {
        Object.assign(barrageConfig, newConfig);
        
        // 如果更新了间隔，重启定时器
        if (newConfig.interval) {
            clearInterval(barrageInterval);
            barrageInterval = setInterval(createBarrage, barrageConfig.interval);
        }
    },
    
    // 暂停弹幕
    pause: function() {
        clearInterval(barrageInterval);
        const pauseBtn = document.getElementById('pauseBtn');
        const resumeBtn = document.getElementById('resumeBtn');
        if (pauseBtn && resumeBtn) {
            pauseBtn.style.display = 'none';
            resumeBtn.style.display = 'block';
        }
    },
    
    // 继续弹幕
    resume: function() {
        barrageInterval = setInterval(createBarrage, barrageConfig.interval);
        const pauseBtn = document.getElementById('pauseBtn');
        const resumeBtn = document.getElementById('resumeBtn');
        if (pauseBtn && resumeBtn) {
            pauseBtn.style.display = 'block';
            resumeBtn.style.display = 'none';
        }
    },
    
    // 清空弹幕
    clear: function() {
        const barrages = container.querySelectorAll('div');
        barrages.forEach(barrage => {
            if (!barrage.id && barrage.parentNode === container) {
                container.removeChild(barrage);
            }
        });
    },
    
    // 获取当前配置
    getConfig: function() {
        return { ...barrageConfig };
    },
    
    // 获取诗词列表
    getPoems: function() {
        return [...poems];
    }
};

// 页面加载完成后启动
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBarrageSystem);
} else {
    initBarrageSystem();
}