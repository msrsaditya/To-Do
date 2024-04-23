document.addEventListener("DOMContentLoaded", function() {
    var todaysDateElement = document.getElementById("todaysDate");
    var today = new Date();
    var options = { month: "short", day: "numeric", year: "numeric" };
    var formattedDate = today.toLocaleDateString("en-US", options);
    todaysDateElement.textContent = formattedDate;

    var taskInput = document.getElementById("taskInput");
    var addTaskButton = document.getElementById("addTaskButton");
    var taskList = document.getElementById("taskList");
    var hideCompletedButton = document.getElementById("hideCompletedButton");
    var removeAllButton = document.getElementById("removeAllButton");

    function addTask() {
        var taskText = taskInput.value.trim();
        if (taskText !== "") {
            taskText = toTitleCase(taskText);
            
            var listItem = document.createElement("li");
            listItem.setAttribute("draggable", "true");

            var input = document.createElement("input");
            input.type = "text";
            input.value = taskText;
            input.readOnly = true;
            listItem.appendChild(input);

            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("checkbox");
            var label = document.createElement("label");
            listItem.appendChild(label);
            listItem.appendChild(checkbox);

            var removeButton = document.createElement("button");
            removeButton.textContent = "x";
            removeButton.classList.add("remove-task");
            removeButton.onclick = function() {
                taskList.removeChild(listItem);
            };
            listItem.appendChild(removeButton);

            checkbox.addEventListener("change", function() {
                if (checkbox.checked) {
                    listItem.classList.add("completed");
                } else {
                    listItem.classList.remove("completed");
                }
            });

            listItem.addEventListener("click", function(event) {
                if (!event.target.matches(".checkbox")) {
                    listItem.classList.add("editing");
                    input.readOnly = false;
                    input.focus();
                }
            });

            input.addEventListener("blur", function() {
                listItem.classList.remove("editing");
                input.readOnly = true;
                input.value = input.value.trim();
            });

            input.addEventListener("keypress", function(event) {
                if (event.key === "Enter") {
                    listItem.classList.remove("editing");
                    input.readOnly = true;
                    input.value = input.value.trim();
                }
            });

            taskList.appendChild(listItem);
            taskInput.value = "";
        } else {
            alert("Please enter a task!");
        }
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    addTaskButton.addEventListener("click", addTask);

    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    taskList.addEventListener("dragstart", function(event) {
        event.dataTransfer.setData("text/plain", event.target.id);
        event.target.classList.add("dragging");
    });

    taskList.addEventListener("dragover", function(event) {
        event.preventDefault();
        const draggedElement = document.querySelector("[draggable=true].dragging");
        const targetElement = event.target.closest("li");
        if (targetElement && draggedElement !== targetElement) {
            taskList.insertBefore(draggedElement, targetElement);
        }
    });

    taskList.addEventListener("dragend", function(event) {
        event.preventDefault();
        const draggedElement = document.querySelector("[draggable=true].dragging");
        if (draggedElement) {
            draggedElement.classList.remove("dragging");
        }
    });

    taskList.addEventListener("dragenter", function(event) {
        const draggedElement = document.querySelector("[draggable=true].dragging");
        const targetElement = event.target.closest("li");
        if (targetElement && draggedElement !== targetElement) {
            targetElement.classList.add("drag-over");
        }
    });

    taskList.addEventListener("dragleave", function(event) {
        const targetElement = event.target.closest("li");
        if (targetElement) {
            targetElement.classList.remove("drag-over");
        }
    });

    hideCompletedButton.addEventListener("click", function() {
        var completedTasks = taskList.querySelectorAll(".completed");
        completedTasks.forEach(function(task) {
            task.style.display = task.style.display === "none" ? "block" : "none";
        });
    });

    removeAllButton.addEventListener("click", function() {
        taskList.innerHTML = "";
    });
});
