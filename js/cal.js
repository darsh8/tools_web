// calculator.js - 计算器逻辑

// DOM 元素
const expressionElement = document.getElementById('expression');
const resultElement = document.getElementById('result');

// 状态变量
let expression = '0';
let result = '0';

// 更新显示
function updateDisplay() {
    expressionElement.textContent = expression === '0' ? '0' : expression;
    resultElement.textContent = result;
}

// 检查是否为操作符
function isOperator(value) {
    return ['+', '-', '*', '/', '%', '^'].includes(value);
}

// 追加到表达式
function appendToExpression(value) {
    if (expression === '0' && !isOperator(value) && value !== '.') {
        expression = value;
    } else {
        expression += value;
    }
    updateDisplay();
}

// 清除所有
function clearAll() {
    expression = '0';
    result = '0';
    updateDisplay();
}

// 清除最后一项
function clearEntry() {
    if (expression.length > 1) {
        expression = expression.slice(0, -1);
        // 如果删除后为空，设为0
        if (expression === '') {
            expression = '0';
        }
    } else {
        expression = '0';
    }
    updateDisplay();
}

// 安全计算函数
function safeEval(expr) {
    try {
        // 替换符号为JavaScript可识别的
        const sanitizedExpr = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**')
            .replace(/--/g, '+'); // 处理双负号
        
        // 使用 Function 构造函数进行安全计算
        const calculation = new Function('return ' + sanitizedExpr);
        const evalResult = calculation();
        
        // 处理无穷大和非数字
        if (!isFinite(evalResult)) {
            return '错误';
        }
        
        // 格式化结果：如果是整数，不显示小数位
        if (Number.isInteger(evalResult)) {
            return evalResult.toString();
        } else {
            // 限制小数位数
            return parseFloat(evalResult.toFixed(10)).toString();
        }
    } catch (error) {
        console.error('计算错误:', error);
        return '错误';
    }
}

// 计算结果
function calculate() {
    const calcResult = safeEval(expression);
    
    if (calcResult === '错误') {
        result = '错误';
        updateDisplay();
        
        // 2秒后重置
        setTimeout(() => {
            result = '0';
            expression = '0';
            updateDisplay();
        }, 2000);
    } else {
        result = calcResult;
        expression = result;
        updateDisplay();
    }
}

// 处理按钮点击
function handleButtonClick(event) {
    const button = event.target;
    const value = button.getAttribute('data-value');
    const action = button.getAttribute('data-action');
    
    if (value) {
        appendToExpression(value);
    } else if (action === 'calculate') {
        calculate();
    } else if (action === 'clear-all') {
        clearAll();
    } else if (action === 'clear-entry') {
        clearEntry();
    }
}

// 键盘支持
function handleKeyDown(event) {
    const key = event.key;
    
    // 阻止默认行为，避免某些键的特殊功能
    if (['Enter', '=', '+', '-', '*', '/', '%', '^', '.', '(', ')'].includes(key)) {
        event.preventDefault();
    }
    
    if (key >= '0' && key <= '9') {
        appendToExpression(key);
    } else if (['+', '-', '*', '/', '%', '^', '.', '(', ')'].includes(key)) {
        appendToExpression(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'Delete') {
        clearAll();
    } else if (key === 'Backspace') {
        clearEntry();
    }
}

// 初始化
function init() {
    // 为所有按钮添加事件监听器
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
        // 为触摸设备添加触摸反馈
        button.addEventListener('touchstart', function() {
            this.classList.add('active');
        });
        button.addEventListener('touchend', function() {
            this.classList.remove('active');
        });
    });
    
    // 添加键盘事件监听
    document.addEventListener('keydown', handleKeyDown);
    
    // 初始显示
    updateDisplay();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
