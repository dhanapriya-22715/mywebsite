const screens = document.querySelectorAll(".screen");
const navItems = document.querySelectorAll(".nav-item");
const themeToggle = document.querySelector("#theme-toggle");
const micButton = document.querySelector("#mic-button");
const voiceTitle = document.querySelector("#voice-title");
const voiceSubtitle = document.querySelector("#voice-subtitle");
const farmSize = document.querySelector("#farm-size");
const cropSelect = document.querySelector("#crop-select");
const rainfall = document.querySelector("#rainfall");
const yieldOutput = document.querySelector("#yield-output");
const incomeOutput = document.querySelector("#income-output");

const cropData = {
  paddy: { yield: 8118, price: 22 },
  cotton: { yield: 1450, price: 70 },
  tomato: { yield: 9800, price: 34 },
  maize: { yield: 3600, price: 19 },
};

function showScreen(name) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === name);
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.tab === name);
  });
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Math.round(value));
}

function updateYield() {
  const acres = Number(farmSize.value || 1);
  const crop = cropData[cropSelect.value];
  const rainFactor = Number(rainfall.value) / 60;
  const predictedYield = crop.yield * acres * Math.min(1.2, Math.max(0.65, rainFactor));
  const income = predictedYield * crop.price;

  yieldOutput.textContent = `${formatNumber(predictedYield)} kg`;
  incomeOutput.textContent = `₹${formatNumber(income)}`;
}

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.tab));
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.jump));
});

document.querySelectorAll("[data-open-tool]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.openTool;
    showScreen(target === "market" ? "market" : "tools");
  });
});

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", themeToggle.checked);
});

micButton.addEventListener("click", () => {
  const active = micButton.classList.toggle("active");
  voiceTitle.textContent = active ? "AI is preparing advice" : "Listening... speak now";
  voiceSubtitle.textContent = active
    ? "For paddy: apply vermicompost before rainfall and avoid excess watering."
    : "Tap microphone to simulate a voice query.";
});

[farmSize, cropSelect, rainfall].forEach((control) => {
  control.addEventListener("input", updateYield);
});

updateYield();
