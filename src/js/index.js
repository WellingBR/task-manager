if(!localStorage.getItem("tasks")) localStorage.setItem("tasks", "[]")

const taskFunctions = {
    array: function() {
        return JSON.parse(localStorage.getItem("tasks"));
    },
    get: function(id) {
        return this.array().find(task => task.id == id);
    },
    add: function (id, taskTitle) {
        const arrayTasks = this.array();

        arrayTasks.push({ id, title: taskTitle, completed: false });
        localStorage.setItem("tasks", JSON.stringify(arrayTasks));
    },
    remove: function(id) {
        const arrayTasks = this.array();
        const taskIndex = arrayTasks.findIndex(e => e.id == id);

        arrayTasks.splice(taskIndex, 1);
        localStorage.setItem("tasks", JSON.stringify(arrayTasks));
    },
    edit: function({ id, title, completed }) {
        let arrayTasks = this.array();
        let taskObject = this.get(id);
        const taskIndex = arrayTasks.findIndex(e => e.id == taskObject.id);

        if(title) taskObject.title = title;
        if(completed) taskObject.completed = completed;
        arrayTasks[taskIndex] = taskObject;

        localStorage.setItem("tasks", JSON.stringify(arrayTasks));
    }
};

function createTask(id, val, completed) {
    $("#tasks").append(
        `<div draggable=true task-id="${id}" class="container ${completed ? "bg-green-500" : "bg-violet-500"} p-3 flex rounded-sm mt-2">` +
        `    <div class="float-left w-11/12">` +
        `      <span class="task-title">${val}</span>` +
        `    </div>` +
        `    <div class="float-right flex justify-center items-center gap-5">` +
        `      ${!completed ? '<a task-action="concluido" class="cursor-pointer" title="Marcar como feito"><i style="color: #28a745" class="bi bi-check-circle-fill"></i></a>' : ""}` +
        `      ${!completed ? '<a task-action="editar" class="cursor-pointer" title="Editar tarefa" data-toggle="modal" data-target="#editTask"><i class="bi bi-pencil-fill"></i></a>' : ""}` +
        `      <a task-action="excluir" class="cursor-pointer" title="Excluir tarefa"><i style="color: #dc3545" class="bi bi-trash3-fill"></i></a>` +
        `    </div>` +
        `</div>`
        );
};

for(let i = 0; i < taskFunctions.array().length; i++) {
    const tasks = taskFunctions.array();
    const taskStorage = tasks[i];

    createTask(taskStorage.id, taskStorage.title, taskStorage.completed);
}

$("#newTask").keypress(function(event) {
    if (event.which == 13) $("#addTask").click();
});

$("#addTask").on("click", function() {
    const inputVal = $("#newTask").val();
    const id = Math.floor(Date.now() * Math.random()).toString(36);

    if(inputVal) {
        taskFunctions.add(id, inputVal);

        $("#newTask").removeClass("is-invalid");
        $("#newTask").val("");
        createTask(id, inputVal);
    } else {
        $("#newTask").addClass("is-invalid");
    }
});

$("#tasks").on("click", "a[task-action=concluido]", function() {
    const concluidoButton = $(this);
    const task = concluidoButton.parent().parent(); 
    const editarButton = task.find("div a[task-action='editar']");
    const excluirButton = task.find("div a[task-action='excluir'] i");
    taskFunctions.edit({ id: task.attr("task-id"), completed: true });

    concluidoButton.remove();
    editarButton.remove();

    excluirButton.removeClass("pl-4");
    task.removeClass("bg-violet-500");
    task.addClass("bg-green-500");
});

$("#tasks").on("click", "a[task-action=excluir]", function() {
    const task = $(this).parent().parent().first();
    taskFunctions.remove(task.attr("task-id"));

    $(task).animate({
        marginLeft: "-100%"
      }, {
      duration: 200,
      complete: function() {
         task.remove();
      }
    });
});

$("#editTask").on("show.bs.modal", function(event) {
    const task = $(event.relatedTarget).parent().parent();
    task.attr("id", "selectedTask");
    $(".modal-body input").val(task.find("div span").text());
});

$("#editTask").on("hide.bs.modal", function() {
    $("#selectedTask").removeAttr("id");
    $(".modal-body input").removeClass("is-invalid");
    $(".modal-body .invalid-feedback").css("display", "none");
});

$(".modal-body input").keypress(function(event) {
    if (event.which == 13) $(".modal-footer #save").click();
});

$(".modal-footer #save").on("click", function(event) {
    const newText = $(".modal-body input").val();

    if(newText) {
        const task = $("#selectedTask");
        taskFunctions.edit({ id: task.attr("task-id"), title: newText });
        task.find("div span").text(newText);

        $("#editTask").modal('hide');
    } else {
        $(".modal-body input").addClass("is-invalid");
        $(".modal-body .invalid-feedback").css("display", "block");
    }
});