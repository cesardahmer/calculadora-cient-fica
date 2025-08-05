class Calculator {
    constructor(previousOperandText, currentOperandText) {
        this.previousOperandText = previousOperandText;
        this.currentOperandText = currentOperandText;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        // Operações unárias (que usam apenas o número atual)
        if (['sin', 'cos', 'tan', 'log', 'sqrt'].includes(operation)) {
            this.computeScientific(operation);
            return;
        }

        // Operações binárias (que precisam de dois números)
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert("Não é possível dividir por zero!");
                    this.clear();
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    // Novo método para operações científicas (unárias)
    computeScientific(operation) {
        let computation;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        switch (operation) {
            case 'sin':
                // Math.sin usa radianos, então convertemos o valor para radianos
                computation = Math.sin(current * (Math.PI / 180));
                break;
            case 'cos':
                computation = Math.cos(current * (Math.PI / 180));
                break;
            case 'tan':
                computation = Math.tan(current * (Math.PI / 180));
                break;
            case 'log':
                if (current <= 0) {
                    alert("O logaritmo de um número não positivo não é um número real!");
                    this.clear();
                    this.updateDisplay();
                    return;
                }
                computation = Math.log10(current);
                break;
            case 'sqrt':
                if (current < 0) {
                    alert("A raiz quadrada de um número negativo não é um número real!");
                    this.clear();
                    this.updateDisplay();
                    return;
                }
                computation = Math.sqrt(current);
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    updateDisplay() {
        this.currentOperandText.innerText = this.currentOperand;
        this.previousOperandText.innerText = this.previousOperand + (this.operation ? ' ' + this.operation : '');
    }
}

// Seleciona os elementos da interface
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-operation="equals"]');
const deleteButton = document.querySelector('[data-operation="delete"]');
const clearButton = document.querySelector('[data-operation="clear"]');
const previousOperandText = document.querySelector('.previous-operand');
const currentOperandText = document.querySelector('.current-operand');

const calculator = new Calculator(previousOperandText, currentOperandText);

// Adiciona event listeners para os botões
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const operation = button.getAttribute('data-operation');
        if (operation === 'equals') {
            calculator.compute();
        } else if (operation === 'delete') {
            calculator.delete();
        } else if (operation === 'clear') {
            calculator.clear();
        } else {
            calculator.chooseOperation(button.innerText);
        }
        calculator.updateDisplay();
    });
});
