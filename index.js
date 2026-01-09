"use strict";
// Calculator Logic
document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const historyDisplay = document.getElementById("history");

  let currentInput = "";
  let lastResult = null;
  let justCalculated = false;

  function updateDisplay(val) {
    display.textContent = val || "0";
    display.scrollLeft = display.scrollWidth;
  }

  function updateHistory(entry) {
    const historyEntry = document.createElement("div");
    historyEntry.textContent = entry;
    historyDisplay.prepend(historyEntry);
  }

  // Factorial function
  function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) {
      res *= i;
    }
    return res;
  }

  //To Evaluate input string
  function evaluateInput(input) {
    let evalStr = input;

    evalStr = evalStr.replace(/(\d)(\(|π|√|e)/g, "$1*$2");
    evalStr = evalStr
      .replace(/π/g, "Math.PI")
      .replace(/\be\b/g, "Math.E")
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/\^/g, "**")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/(\d+)\^(\d+)/g, "Math.pow($1,$2)")
      .replace(/--/g, "+")
      .replace(/(\d+)!/g, "factorial($1)")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/log\(/g, "Math.log10(");
    return eval(evalStr);
  }
  // Button event listeners
  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.value) {
        if (justCalculated) {
          currentInput = "";
          justCalculated = false;
        }
        currentInput += btn.dataset.value;
        updateDisplay(currentInput);
      }
      if (btn.dataset.operator) {
        if (justCalculated) {
          justCalculated = false;
        }
        currentInput += btn.dataset.operator;
        updateDisplay(currentInput);
      }
      if (btn.dataset.fn) {
        if (justCalculated) {
          currentInput = "";
          justCalculated = false;
        }
        if (btn.dataset.fn === "sqrt") {
          currentInput += "√(";
        } else if (btn.dataset.fn === "exp") {
          currentInput += "e";
        } else if (btn.dataset.fn === "factorial") {
          currentInput += "!";
        } else currentInput += `${btn.dataset.fn}(`;
        updateDisplay(currentInput);
      }
      if (btn.dataset.action === "clear-all") {
        currentInput = "";
        updateDisplay("0");
        justCalculated = false;
      }
      if (btn.dataset.action === "clear-entry") {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput);
      }
      if (btn.dataset.action === "equals") {
        try {
          const result = evaluateInput(currentInput);
          updateHistory(`${currentInput} = ${result}`);
          currentInput = result.toString();
          updateDisplay(currentInput);
          lastResult = result;
          justCalculated = true;
        } catch (e) {
          updateDisplay("Error");
          currentInput = "";
          justCalculated = true;
        }
      }

      if (btn.dataset.action === "ans") {
        if (lastResult !== null) {
          if (justCalculated) {
            currentInput = "";
            justCalculated = false;
          }
          currentInput += lastResult.toString();
          updateDisplay(currentInput);
        }
      }
    });
  });

  //Keyboard support
  document.addEventListener("keydown", (e) => {
    const key = e.key;
    if (!isNaN(key)) {
      document.querySelector(`[data-value="${key}"]`)?.click();
    }
    if (["+", "-", "*", "/", "^"].includes(key)) {
      let operator = key;
      if (key === "*") operator = "×";
      if (key === "/") operator = "÷";
      document.querySelector(`[data-operator="${operator}"]`)?.click();
    }
    if (key === "Enter" || key === "=") {
      e.preventDefault();
      document.querySelector(`[data-action="equals"]`)?.click();
    }
    if (key === "Backspace") {
      document.querySelector(`[data-action="clear-entry"]`)?.click();
    }
    if (key === "Escape") {
      document.querySelector(`[data-action="clear-all"]`)?.click();
    }
    if (key === ".") {
      document.querySelector(`[data-value="."]`)?.click();
    }
  });
});
