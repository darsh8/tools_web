// 常用颜色调色板
const colorPalette = [
    { name: "红色", hex: "#e74c3c", rgb: "rgb(231, 76, 60)" },
    { name: "绿色", hex: "#2ecc71", rgb: "rgb(46, 204, 113)" },
    { name: "蓝色", hex: "#3498db", rgb: "rgb(52, 152, 219)" },
    { name: "黄色", hex: "#f1c40f", rgb: "rgb(241, 196, 15)" },
    { name: "橙色", hex: "#e67e22", rgb: "rgb(230, 126, 34)" },
    { name: "紫色", hex: "#9b59b6", rgb: "rgb(155, 89, 182)" },
    { name: "黑色", hex: "#2c3e50", rgb: "rgb(44, 62, 80)" },
    { name: "白色", hex: "#ecf0f1", rgb: "rgb(236, 240, 241)" },
    { name: "灰色", hex: "#95a5a6", rgb: "rgb(149, 165, 166)" },
    { name: "粉色", hex: "#fd79a8", rgb: "rgb(253, 121, 168)" },
    { name: "青色", hex: "#00cec9", rgb: "rgb(0, 206, 201)" },
    { name: "棕色", hex: "#a55b41", rgb: "rgb(165, 91, 65)" }
];

// 初始化颜色
let currentColor = {
    hex: "#3498db",
    rgb: { r: 52, g: 152, b: 219 },
    hsl: { h: 204, s: 70, l: 53 }
};

function updateColorFromPicker() {
    const hexColor = document.getElementById('color-picker').value;
    updateColorFromHex(hexColor);
}

function updateColorFromHex(hexColor) {
    // 将HEX转换为RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);

    // 更新RGB滑块
    document.getElementById('red').value = r;
    document.getElementById('green').value = g;
    document.getElementById('blue').value = b;

    // 更新显示值
    document.getElementById('red-value').textContent = r;
    document.getElementById('green-value').textContent = g;
    document.getElementById('blue-value').textContent = b;

    // 更新颜色对象
    currentColor.hex = hexColor;
    currentColor.rgb = { r, g, b };
    currentColor.hsl = rgbToHsl(r, g, b);

    // 更新UI
    updateUI();
}

function updateColorFromRGB() {
    const r = parseInt(document.getElementById('red').value);
    const g = parseInt(document.getElementById('green').value);
    const b = parseInt(document.getElementById('blue').value);

    // 更新显示值
    document.getElementById('red-value').textContent = r;
    document.getElementById('green-value').textContent = g;
    document.getElementById('blue-value').textContent = b;

    // 将RGB转换为HEX
    const hexColor = rgbToHex(r, g, b);

    // 更新颜色选择器
    document.getElementById('color-picker').value = hexColor;

    // 更新颜色对象
    currentColor.hex = hexColor;
    currentColor.rgb = { r, g, b };
    currentColor.hsl = rgbToHsl(r, g, b);

    // 更新UI
    updateUI();
}

function updateUI() {
    // 更新颜色显示
    document.getElementById('color-display').style.backgroundColor = currentColor.hex;
    document.getElementById('color-hex').textContent = currentColor.hex;

    // 更新格式显示
    document.getElementById('format-hex').textContent = currentColor.hex;
    document.getElementById('format-rgb').textContent =
        `rgb(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})`;
    document.getElementById('format-hsl').textContent =
        `hsl(${currentColor.hsl.h}, ${currentColor.hsl.s}%, ${currentColor.hsl.l}%)`;
}

function rgbToHex(r, g, b) {
    return "#" +
        r.toString(16).padStart(2, '0') +
        g.toString(16).padStart(2, '0') +
        b.toString(16).padStart(2, '0');
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // 灰色
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function copyFormat(format) {
    let textToCopy = '';

    switch(format) {
        case 'hex':
            textToCopy = document.getElementById('format-hex').textContent;
            break;
        case 'rgb':
            textToCopy = document.getElementById('format-rgb').textContent;
            break;
        case 'hsl':
            textToCopy = document.getElementById('format-hsl').textContent;
            break;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
        // 显示复制成功的提示
        const originalText = event.target.textContent;
        event.target.textContent = '已复制!';
        event.target.style.backgroundColor = '#2ecc71';

        setTimeout(() => {
            event.target.textContent = originalText;
            event.target.style.backgroundColor = '#3498db';
        }, 1500);
    }).catch(err => {
        console.error('复制失败: ', err);
        alert('复制失败，请手动选择并复制颜色值');
    });
}

function generateRandomColor() {
    // 生成随机RGB值
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // 转换为HEX
    const hexColor = rgbToHex(r, g, b);

    // 更新颜色选择器
    document.getElementById('color-picker').value = hexColor;

    // 更新RGB滑块
    document.getElementById('red').value = r;
    document.getElementById('green').value = g;
    document.getElementById('blue').value = b;

    // 更新颜色
    updateColorFromRGB();
}

function resetColor() {
    // 重置为默认颜色
    updateColorFromHex("#3498db");
}

function populateColorPalette() {
    const paletteGrid = document.getElementById('palette-grid');
    paletteGrid.innerHTML = '';

    colorPalette.forEach(color => {
        const colorItem = document.createElement('div');
        colorItem.className = 'palette-item';

        const colorBlock = document.createElement('div');
        colorBlock.className = 'palette-color';
        colorBlock.style.backgroundColor = color.hex;
        colorBlock.title = `${color.name}: ${color.hex}`;
        colorBlock.onclick = function() {
            updateColorFromHex(color.hex);
        };

        const colorName = document.createElement('div');
        colorName.className = 'color-name';
        colorName.textContent = color.name;

        colorItem.appendChild(colorBlock);
        colorItem.appendChild(colorName);
        paletteGrid.appendChild(colorItem);
    });
}

// 初始化页面
window.onload = function() {
    // 初始更新UI
    updateColorFromHex("#3498db");

    // 填充颜色调色板
    populateColorPalette();

    // 为颜色值添加点击复制功能
    document.querySelectorAll('.format-value').forEach(element => {
        element.style.cursor = 'pointer';
        element.onclick = function() {
            const format = this.parentElement.querySelector('.copy-btn').getAttribute('onclick').match(/'(\w+)'/)[1];
            copyFormat(format);
        };
    });
};