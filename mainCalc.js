const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input = "";


for (let key of keys) {
	const value = key.dataset.key;

	key.addEventListener('click', () => {
		if (value == "clear") {
			input = "";
			display_input.innerHTML = "";
			display_output.innerHTML = "";
		} else if (value == "backspace") {
			input = input.slice(0, -1);
			display_input.innerHTML = CleanInput(input);
		} else if (value == "=") { 
			let result = eval(PerpareInput(input));
            display_output.innerHTML = CleanOutput(result);
            if (isDivisionByZero(input)) {
                display_output.innerHTML = "undefined";
            } else {
                try {
                    let preparedInput = PerpareInput(input);
                    let result = eval(preparedInput);
                    
                    // Check if result is Infinity which indicates division by 0
                    if (!isFinite(result)) {
                        throw new Error('Division by zero');
                    }
    
                    display_output.innerHTML = CleanOutput(result);
                } catch (error) {
                    display_output.innerHTML = "undefined";
                }
            }

		} else if (value == "brackets") {
			if (
				input.indexOf("(") == -1 || 
				input.indexOf("(") != -1 && 
				input.indexOf(")") != -1 && 
				input.lastIndexOf("(") < input.lastIndexOf(")")
			) {
				input += "(";
			} else if (
				input.indexOf("(") != -1 && 
				input.indexOf(")") == -1 || 
				input.indexOf("(") != -1 &&
				input.indexOf(")") != -1 &&
				input.lastIndexOf("(") > input.lastIndexOf(")")
			) {
				input += ")";
			}

			display_input.innerHTML = CleanInput(input);
		} else {
			if (ValidateInput(value)) {
				input += value;
				display_input.innerHTML = CleanInput(input);
			}
		}
	})
}

function CleanInput(input) {
	let input_array = input.split("");
	let input_array_length = input_array.length;

	for (let i = 0; i < input_array_length; i++) {
		if (input_array[i] == "*") {
			input_array[i] = ` <span class="operator">x</span> `;
		} else if (input_array[i] == "/") {
			input_array[i] = ` <span class="operator">÷</span> `;
		} else if (input_array[i] == "+") {
			input_array[i] = ` <span class="operator">+</span> `;
		} else if (input_array[i] == "-") {
			input_array[i] = ` <span class="operator">-</span> `;
		} else if (input_array[i] == "(") {
			input_array[i] = `<span class="brackets">(</span>`;
		} else if (input_array[i] == ")") {
			input_array[i] = `<span class="brackets">)</span>`;
		} else if (input_array[i] == "%") {
			input_array[i] = `<span class="percent">%</span>`;
		}
	}

	return input_array.join("");
}

function CleanOutput(output) {
    let outputString = output.toString();

    // Check if the output is in scientific notation
    if (outputString.includes("e")) {
        return formatScientificNotation(outputString);
    }

    let decimalIndex = outputString.indexOf(".");
    let integerPart = decimalIndex > -1 ? outputString.substring(0, decimalIndex) : outputString;
    let decimalPart = decimalIndex > -1 ? outputString.substring(decimalIndex + 1) : "";

    // Format and break integer and decimal parts into lines of up to 10 digits
    let formattedIntegerPart = formatAndBreakIntoLines(integerPart);
    let formattedDecimalPart = decimalPart ? "." + formatAndBreakIntoLines(decimalPart) : "";

    return formattedIntegerPart + formattedDecimalPart;
}

function formatAndBreakIntoLines(part) {
    let formattedPart = "";
    for (let i = 0; i < part.length; i += 10) {
        if (i > 0) formattedPart += "<br>"; // Add a line break after every 10 digits
        formattedPart += part.substring(i, Math.min(i + 10, part.length));
    }
    return formattedPart;
}

function formatScientificNotation(outputString) {
    // Split the output into the base and exponent parts
    let [base, exponent] = outputString.split("e");
    let formattedBase = formatAndBreakIntoLines(base.replace(".", "")); // Remove decimal point for formatting
    return `${formattedBase}e${exponent}`;
}





function ValidateInput (value) {
	let last_input = input.slice(-1);
	let operators = ["+", "-", "*", "/"];

	if (value == "." && last_input == ".") {
		return false;
	}

	if (operators.includes(value)) {
		if (operators.includes(last_input)) {
			return false;
		} else {
			return true;
		}
	}

	return true;
}

function PerpareInput (input) {
	let input_array = input.split("");

	for (let i = 0; i < input_array.length; i++) {
		if (input_array[i] == "%") {
			input_array[i] = "/100";
		}
	}

	return input_array.join("");
}
document.addEventListener('keydown', (e) => {
    const keyMap = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '+': '+', '-': '-', '*': '*', '/': '/',
        'Enter': '=', 'Backspace': 'backspace', 'Escape': 'clear',
        '.': '.', '(': '(', ')': ')'
    };

    const key = keyMap[e.key];

    if (key) {
        e.preventDefault(); // Prevent the default action to avoid interference with the calculator logic
        document.querySelector(`[data-key="${key}"]`).click();
    }
    if (e.key === "ArrowRight") {
        if (outputPosition < fullOutput.length - 10) {
            outputPosition++; // Move the "view window" to the right
            display_output.innerHTML = fullOutput.substring(outputPosition, outputPosition + 10);
        }
        e.preventDefault(); // Prevent default right-arrow behavior
    }
});


function isDivisionByZero(input) {
    // Simple check for "/0" which might not cover all cases (e.g., "5/(2-2)")
    return input.includes("/0");
}

