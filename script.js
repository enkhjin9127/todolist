const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (inputBox.value === "") {
    alert("You must write something!");
  } else {
    // Create task element
    let li = document.createElement("li");
    li.setAttribute("draggable", "true");
    li.innerHTML = inputBox.value;

    // Add drag event listeners
    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragend", handleDragEnd);

    // Add priority class based on dropdown value
    if (priority.value === "1") {
      li.classList.add("high-priority");
    } else if (priority.value === "2") {
      li.classList.add("medium-priority");
    } else if (priority.value === "3") {
      li.classList.add("low-priority");
    }

    // Append task to the list
    listContainer.appendChild(li);

    // Add delete button
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
  }
  inputBox.value = "";
  saveData();
}

listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveData();
    } else if (e.target.tagName === "SPAN") {
      const timeTaken = prompt(
        "How long did it take to finish this task (in minutes)?"
      );
      if (timeTaken !== null && timeTaken.trim() !== "") {
        console.log(`Task completed in: ${timeTaken} minutes.`);
      }
      e.target.parentElement.remove();
      saveData();
    }
  },
  false
);

listContainer.addEventListener("dragover", (e) => {
  e.preventDefault(); // Allow the drop by preventing default behavior
  const afterElement = getDragAfterElement(e.clientY); // Find where to drop
  const dragging = document.querySelector(".dragging");
  if (afterElement == null) {
    listContainer.appendChild(dragging); // Append at the end if no element is after
  } else {
    listContainer.insertBefore(dragging, afterElement); // Insert before the found element
  }
});

function getDragAfterElement(y) {
  const draggableElements = [
    ...listContainer.querySelectorAll("li:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
  listContainer.innerHTML = localStorage.getItem("data");
}

function editTask(taskElement) {
  const currentText = taskElement.querySelector("span").innerText;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.onblur = () => {
    taskElement.querySelector("span").innerText = input.value;
    saveData();
  };
  taskElement.replaceChild(input, taskElement.querySelector("span"));
  input.focus();
}

function handleDragStart(e) {
  e.target.classList.add("dragging"); // Add a class to the dragged item
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging"); // Remove the class when dragging ends
}

listContainer.addEventListener("dragend", () => {
  saveData(); // Save the new order of tasks to localStorage
});

showTask();
