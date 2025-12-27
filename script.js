const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitBody = document.getElementById("habitBody");

const canvas = document.getElementById("progressChart");
const ctx = canvas.getContext("2d");
const percentageText = document.getElementById("percentageText");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

function saveData() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

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

function drawGraph(percent) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background bar
  ctx.fillStyle = "#ddd";
  ctx.fillRect(20, 60, 260, 20);

  // progress bar
  ctx.fillStyle = "#007bff";
  ctx.fillRect(20, 60, (percent / 100) * 260, 20);

  percentageText.textContent = percent + "%";
}

function renderHabits() {
  habitBody.innerHTML = "";

  habits.forEach((habit, hIndex) => {
    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = habit.name;
    tr.appendChild(nameTd);

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

    const delTd = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.textContent = "X";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => {
      habits.splice(hIndex, 1);
      saveData();
      renderHabits();
      drawGraph(calculatePercentage());
    };

    delTd.appendChild(delBtn);
    tr.appendChild(delTd);

    habitBody.appendChild(tr);
  });

  drawGraph(calculatePercentage());
}

addHabitBtn.addEventListener("click", () => {
  if (habitInput.value.trim() === "") return;

  habits.push({
    name: habitInput.value,
    days: Array(31).fill(false)
  });

  habitInput.value = "";
  saveData();
  renderHabits();
});

renderHabits();
