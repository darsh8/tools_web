let passwordHistory = [];
const maxHistory = 5;

function updateLengthValue() {
    const length = document.getElementById('length-slider').value;
    document.getElementById('length-value').textContent = length;
}

function generatePassword() {
    const length = parseInt(document.getElementById('length-slider').value);
    const hasUppercase = document.getElementById('uppercase').checked;
    const hasLowercase = document.getElementById('lowercase').checked;
    const hasNumbers = document.getElementById('numbers').checked;
    const hasSymbols = document.getElementById('symbols').checked;
    const excludeSimilar = document.getElementById('exclude-similar').checked;

    // 字符集
    let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowercase = 'abcdefghijklmnopqrstuvwxyz';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // 排除相似字符
    if (excludeSimilar) {
        uppercase = uppercase.replace(/[ILO]/g, '');
        lowercase = lowercase.replace(/[ilo]/g, '');
        numbers = numbers.replace(/[01]/g, '');
    }

    let charset = '';
    if (hasLowercase) charset += lowercase;
    if (hasUppercase) charset += uppercase;
    if (hasNumbers) charset += numbers;
    if (hasSymbols) charset += symbols;

    // 确保至少选择一种字符类型
    if (charset === '') {
        showNotification('请至少选择一种字符类型！', 'error');
        return;
    }

    // 生成密码
    let password = '';
    const charsetLength = charset.length;

    // 使用更安全的随机数生成方法
    if (window.crypto && window.crypto.getRandomValues) {
        // 使用Web Crypto API生成更安全的随机数
        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {
            const randomIndex = randomValues[i] % charsetLength;
            password += charset[randomIndex];
        }
    } else {
        // 回退到Math.random（不够安全，但作为备选）
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charsetLength);
            password += charset[randomIndex];
        }
    }

    // 更新显示
    document.getElementById('password').textContent = password;

    // 更新密码强度
    updatePasswordStrength(password);

    // 添加到历史记录
    addToHistory(password);
}

function updatePasswordStrength(password) {
    let strength = 0;
    const length = password.length;

    // 长度评分
    if (length >= 8) strength += 1;
    if (length >= 12) strength += 1;
    if (length >= 16) strength += 1;

    // 字符类型评分
    if (/[a-z]/.test(password)) strength += 1; // 小写字母
    if (/[A-Z]/.test(password)) strength += 1; // 大写字母
    if (/[0-9]/.test(password)) strength += 1; // 数字
    if (/[^a-zA-Z0-9]/.test(password)) strength += 2; // 特殊字符

    // 计算百分比和显示
    let percentage = 0;
    let strengthText = '';
    let strengthColor = '';

    if (strength <= 3) {
        percentage = 25;
        strengthText = '弱';
        strengthColor = '#e74c3c';
    } else if (strength <= 5) {
        percentage = 50;
        strengthText = '中等';
        strengthColor = '#f39c12';
    } else if (strength <= 7) {
        percentage = 75;
        strengthText = '强';
        strengthColor = '#3498db';
    } else {
        percentage = 100;
        strengthText = '非常强';
        strengthColor = '#2ecc71';
    }

    // 更新UI
    const strengthFill = document.getElementById('strength-fill');
    const strengthTextElement = document.getElementById('strength-text');

    strengthFill.style.width = `${percentage}%`;
    strengthFill.style.backgroundColor = strengthColor;
    strengthTextElement.textContent = strengthText;
    strengthTextElement.style.color = strengthColor;
}

function addToHistory(password) {
    // 添加到历史记录数组开头
    passwordHistory.unshift(password);

    // 限制历史记录数量
    if (passwordHistory.length > maxHistory) {
        passwordHistory.pop();
    }

    // 更新历史记录显示
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    if (passwordHistory.length === 0) {
        historyList.innerHTML = '<div style="text-align: center; color: #7f8c8d; padding: 20px;">暂无历史记录</div>';
        return;
    }

    passwordHistory.forEach((password, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        const passwordText = document.createElement('span');
        passwordText.textContent = password;
        passwordText.style.fontFamily = "'Courier New', monospace";
        passwordText.style.letterSpacing = '1px';

        const copyButton = document.createElement('button');
        copyButton.className = 'history-copy';
        copyButton.textContent = '复制';
        // 使用闭包来传递密码和按钮元素
        copyButton.onclick = function() {
            copyToClipboard(password, this);
        };

        historyItem.appendChild(passwordText);
        historyItem.appendChild(copyButton);
        historyList.appendChild(historyItem);
    });
}

function copyPassword() {
    const password = document.getElementById('password').textContent;
    const copyButton = document.querySelector('.copy-btn');

    if (password && password !== '点击"生成密码"按钮') {
        copyToClipboard(password, copyButton);
    } else {
        showNotification('请先生成密码！', 'error');
    }
}

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        // 显示复制成功的提示
        const originalText = button.textContent;
        button.textContent = '已复制!';
        button.style.backgroundColor = '#2ecc71';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '#3498db';
        }, 1500);

        showNotification('密码已复制到剪贴板！', 'success');
    }).catch(err => {
        console.error('复制失败: ', err);
        // 备选方案：使用document.execCommand
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showNotification('密码已复制到剪贴板！', 'success');

                // 更新按钮状态
                const originalText = button.textContent;
                button.textContent = '已复制!';
                button.style.backgroundColor = '#2ecc71';

                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '#3498db';
                }, 1500);
            } else {
                showNotification('复制失败，请手动选择并复制密码', 'error');
            }
        } catch (err) {
            showNotification('复制失败，请手动选择并复制密码', 'error');
        }

        document.body.removeChild(textArea);
    });
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;

    // 根据类型设置颜色
    if (type === 'success') {
        notification.style.backgroundColor = '#2ecc71';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
    } else {
        notification.style.backgroundColor = '#3498db';
    }

    // 显示通知
    notification.style.display = 'block';

    // 3秒后隐藏通知
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.style.animation = '';
        }, 300);
    }, 3000);
}

// 页面加载时生成初始密码
window.onload = function() {
    updateLengthValue();
    generatePassword();
};

// 键盘快捷键支持
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || (event.key === ' ' && event.target.tagName !== 'INPUT')) {
        event.preventDefault();
        generatePassword();
    } else if ((event.key === 'c' || event.key === 'C') && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        copyPassword();
    }
});