// ===============================
// DOM ELEMENTS
// ===============================
const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitBody = document.getElementById("habitBody");

const canvas = document.getElementById("progressChart");
const ctx = canvas.getContext("2d");
const percentageText = document.getElementById("percentageText");

// ===============================
// DATA
// ===============================
let habits = JSON.parse(localStorage.getItem("habits")) || [];

// ===============================
// SAVE TO STORAGE
// ===============================
function saveData() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// ===============================
// CALCULATE OVERALL PERCENTAGE
// ===============================
function calculatePercentage() {
  let total = 0;
  let done = 0;

  habits.forEach(habit => {
    habit.days.forEach(day => {
      total++;
      if (day) done++;
    });
  });

  return total === 0 ? 0 : Math.round((done / total) * 100);
}

// ===============================
// DRAW PROGRESS GRAPH
// ===============================
function drawGraph(percent) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background bar
  ctx.fillStyle = "#d1d5db";
  ctx.fillRect(20, 60, 260, 18);

  // progress bar
  ctx.fillStyle = "#4f46e5";
  ctx.fillRect(20, 60, (percent / 100) * 260, 18);

  percentageText.textContent = percent + "%";
}

// ===============================
// RENDER HABITS
// ===============================
function renderHabits() {
  habitBody.innerHTML = "";

  habits.forEach((habit, hIndex) => {
    const tr = document.createElement("tr");

    // Habit name
    const nameTd = document.createElement("td");
    nameTd.textContent = habit.name;
    tr.appendChild(nameTd);

    // 31 days checkboxes
    habit.days.forEach((checked, dIndex) => {
      const td = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = checked;

      checkbox.addEventListener("change", () => {
        habits[hIndex].days[dIndex] = checkbox.checked;
        saveData();
        drawGraph(calculatePercentage());
      });

      td.appendChild(checkbox);
      tr.appendChild(td);
    });

    // Delete button
    const delTd = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.textContent = "X";
    delBtn.className = "delete-btn";

    delBtn.addEventListener("click", () => {
      habits.splice(hIndex, 1);
      saveData();
      renderHabits();
    });

    delTd.appendChild(delBtn);
    tr.appendChild(delTd);

    habitBody.appendChild(tr);
  });

  drawGraph(calculatePercentage());
}

// ===============================
// ADD HABIT
// ===============================
function addHabit() {
  const value = habitInput.value.trim();
  if (!value) return;

  habits.push({
    name: value,
    days: Array(31).fill(false)
  });

  habitInput.value = "";
  saveData();
  renderHabits();
}

// Button click
addHabitBtn.addEventListener("click", addHabit);

// Enter key support
habitInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addHabit();
  }
});

// ===============================
// INITIAL LOAD
// ===============================
renderHabits();
