var INPUTS_ID = 0;
var TASK_COUNTER = 0;
var LESSON_NUMBER;
const POPUP = document.getElementById("notAllChecked");
const POPUPbg = document.getElementById("popup-background");
const POPUPok = document.querySelector(".pure-dialog-buttons input[type='button'][value='Ок']");

POPUPok.onclick = function () {
    hidePopUp();
}

// Test
function buildTest(baseOfTests, taskId) {
    TASK_COUNTER++;
    LESSON_NUMBER = document.getElementById("taskWrapper").getAttribute("lesson");

    let isResultShown = showResultsIfStored(taskId);
    if (isResultShown === true) {
        INPUTS_ID = document.querySelectorAll("#" + taskId + " input").length;
        return;
    }

    baseOfTests = shuffle(baseOfTests, taskId);

    let taskWrapper = document.getElementById(taskId);

    baseOfTests.forEach((question, questionNumber) => {

        let options = [];
        let genereted_test_item = [];

        for (option in question.options) {
            options.push(
                `<div class="pretty p-default p-round p-thick">
                    <input type="radio" id="${INPUTS_ID}" class="option" name=lesson${LESSON_NUMBER + taskId}Question${questionNumber} value="${option}"/>
                    <div class="state p-danger">
                        <label><b>${option.toUpperCase()}) </b> ${question.options[option]}</label>
                    </div>
                </div>`
            );
            INPUTS_ID++;
        }
        if (IMG_BASE[question.imgIndex]) {
            genereted_test_item.push(
                `<li class="questionContainer" style='z-index: ${questionNumber - 2000}'>
                        ${IMG_BASE[question.imgIndex]}
                        <div class="question"> ${question.question} </div>
                        <div class="answers"> ${options.join('')} </div>
                    </li>`
            );
        } else {
            genereted_test_item.push(
                `<li class="questionContainer" style='z-index: ${questionNumber - 2000}'>
                        <div class="question"> ${question.question} </div>
                        <div class="answers"> ${options.join('')} </div>
                    </li>`
            );
        }

        taskWrapper.insertAdjacentHTML('beforeend', genereted_test_item);
    })
    taskWrapper.insertAdjacentHTML('beforeend', `<br><div class="score" id="${taskId}-score"></div>
                          <button class="button" id="${taskId}-submit" onclick="checkTest(this)">Перевірити</button>`);

    setEventListenerOnRadio();
    markRadioAsCheckedIfIsExistInLocalStorage();

}

function setEventListenerOnRadio() {
    let taskWrapper = document.getElementById("taskWrapper");
    let radiosInTaskWrapper = taskWrapper.querySelectorAll("input[type=radio]")

    radiosInTaskWrapper.forEach(radio => {
        radio.addEventListener('change', () => updateRadioStateInLocalStorage(radio));
    })
}

function updateRadioStateInLocalStorage(radio) {
    localStorage.setItem("radio:" + radio.name, radio.id);
}

function markRadioAsCheckedIfIsExistInLocalStorage() {
    let taskWrapper = document.getElementById("taskWrapper");
    let questionCounter =
        taskWrapper.querySelectorAll(" div.task-wrapper ol.task-container li.questionContainer").length;

    for (let taskNumber = 1; taskNumber <= TASK_COUNTER; taskNumber++) {
        for (let questionNumber = 0; questionNumber < questionCounter; questionNumber++) {
            let item = localStorage.getItem("radio:lesson" + LESSON_NUMBER + "task" + taskNumber + "Question" + questionNumber);

            if (item !== null) {
                let radioById = document.getElementById(item.valueOf());
                radioById.checked = true;
            }
        }

    }
}

function checkTest(buttonFromTaskContainer) {

    let calledButtonId = buttonFromTaskContainer.getAttribute("id");
    let separatorIndex = calledButtonId.indexOf("-");

    let taskToCheckId = calledButtonId.substr(0, separatorIndex);

    let taskToCheck = document.querySelector("div.task-wrapper #" + taskToCheckId);
    const USER_ANSWERS_INPUTS = taskToCheck.querySelectorAll("input:checked");
    let GRADE = 0;
    let GRADE_DISPLAY = taskToCheck.querySelector("div.score");

    if (USER_ANSWERS_INPUTS.length !== taskToCheck.querySelectorAll("li.questionContainer").length) {
        showPopUpNotAllChecked(taskToCheckId);
        return;
    }

    buttonFromTaskContainer.remove();

    let allInputsParentsInTask = taskToCheck.querySelectorAll("div.pretty");

    for (let i = 0; i < allInputsParentsInTask.length; i++) {
        allInputsParentsInTask[i].classList.add("p-locked");
    }

    let baseOfTest = JSON.parse(localStorage.getItem("base_lesson" + LESSON_NUMBER + taskToCheckId));
    for (let i = 0; i < USER_ANSWERS_INPUTS.length; i++) {

        USER_ANSWERS_INPUTS[i].parentElement.style.border = "solid #5d16a2 2px";

        let imageLabel = USER_ANSWERS_INPUTS[i].parentNode.querySelector("label");
        if (baseOfTest[i].correctAnswer !== USER_ANSWERS_INPUTS[i].getAttribute("value")) {

            imageLabel.style.fontWeight = "bold";
            imageLabel.innerHTML += " <img class=\"right-wrong-test-img\" src=\"https://bit.ly/2ApIim1\" alt='wrong'/>";


            let correct_answer_input = USER_ANSWERS_INPUTS[i]
                .parentNode.parentNode.querySelector("input[value='" + baseOfTest[i].correctAnswer + "']");
            let correctInputLabel = correct_answer_input.parentElement.querySelector("label");
            correctInputLabel.style.color = "#70b747";
            correctInputLabel.style.fontWeight = "bold";
            correctInputLabel.innerHTML += " <img class=\"right-wrong-test-img\" src=\"https://bit.ly/3hnnVpX\" alt='right'/>";

        } else {
            GRADE++;
            imageLabel.style.color = "#70b747";
            imageLabel.style.fontWeight = "bold";
            imageLabel.innerHTML += " <img class=\"right-wrong-test-img\" src=\"https://bit.ly/3hnnVpX\" alt='right'/>";
        }

    }

    GRADE_DISPLAY.innerHTML += "Результат: " + GRADE + "/" + USER_ANSWERS_INPUTS.length;
    GRADE_DISPLAY.style.visibility = "visible";
    GRADE_DISPLAY.style.opacity = 100;


    clearLocalStorageButSaveBasesAndResults(taskToCheck);

    // let saveBasesOfTests = [];
    // let saveResults = [];
    //
    // for (let i = 1; i <= TASK_COUNTER; i++) {
    //     let baseExist = localStorage.getItem("base_lesson" + LESSON_NUMBER + "task" + i)
    //     let resultsExist = localStorage.getItem("lesson" + LESSON_NUMBER + "task" + i)
    //     if (baseExist) {
    //         saveBasesOfTests[i] = baseExist;
    //     }
    //     if (resultsExist) {
    //         saveResults[i] = resultsExist;
    //     }
    // }
    //
    // localStorage.clear();
    // localStorage.setItem("lesson" + LESSON_NUMBER + taskToCheckId, taskToCheck.innerHTML);
    //
    // for (let i = 1; i <= TASK_COUNTER; i++) {
    //     if (saveBasesOfTests[i]) {
    //         localStorage.setItem("base_lesson" + LESSON_NUMBER + "task" + i, saveBasesOfTests[i]);
    //     }
    //     if (saveResults[i]) {
    //         localStorage.setItem("lesson" + LESSON_NUMBER + "task" + i, saveResults[i]);
    //     }
    // }

}


// Select
function buildSelect(baseOfSelectTests, taskId) {
    TASK_COUNTER++;
    LESSON_NUMBER = document.getElementById("taskWrapper").getAttribute("lesson");

    let isResultShown = showResultsIfStored(taskId);
    if (isResultShown === true) {
        return;
    }

    let taskInnerHtml = baseOfSelectTests[0].taskText;
    let onlyOptions = baseOfSelectTests.slice(1);
    let generatedSelect = [];

    onlyOptions.forEach((select, selectNumber) => {
        let options = [];

        for (option in select.options) {
            // TODO: options shuffling
            options.push(
                `<option value="${option}">${select.options[option]}</option>`
            );
        }

        generatedSelect.push(
            `<div class="select" name="lesson${LESSON_NUMBER + taskId}Question${selectNumber}">
                <select>
                    <option selected hidden value="0">Select answer:</option>
                    ${options.join('')}
                </select>
            </div>`
        );
    });

    for (let i = 0; i < generatedSelect.length; i++) {
        taskInnerHtml = taskInnerHtml.replace("__${select#option}__", generatedSelect[i]);
    }

    let taskElement = document.getElementById(taskId);
    taskElement.insertAdjacentHTML("beforeend",
        `<h2 style="text-align: center;">${taskElement.getAttribute("title")}</h2>`);

    taskElement.insertAdjacentHTML("beforeend", taskInnerHtml);

    taskElement.insertAdjacentHTML('beforeend', `<br><div class="score" id="${taskId}-score"></div>
                          <button class="button" id="${taskId}-submit" onclick="checkSelect(this)">Перевірити</button>`);

    setEventListenerOnOption();
    markSelectAsCheckedIfIsExistInLocalStorage();

}

function setEventListenerOnOption() {
    let taskWrapper = document.getElementById("taskWrapper");
    let selectInTaskWrapper = taskWrapper.querySelectorAll("select");

    selectInTaskWrapper.forEach(select => {
        select.addEventListener('change', () => updateSelectStateInLocalStorage(select));
    })
}

function updateSelectStateInLocalStorage(select) {
    localStorage.setItem("select:" + select.parentNode.getAttribute("name"), select.value);
}

function markSelectAsCheckedIfIsExistInLocalStorage() {
    let taskWrapper = document.getElementById("taskWrapper");
    let allSelectsParents = taskWrapper.querySelectorAll("ol.task-container div.select");

    for (let i = 0; i < allSelectsParents.length; i++) {
        let item = localStorage.getItem("select:" + allSelectsParents[i].getAttribute("name"));

        if (item !== null) {
            let checkedOption = allSelectsParents[i].querySelector("select option[value=" + item.valueOf() + "]");
            checkedOption.selected = true;
        }
    }

}

function checkSelect(buttonFromTaskContainer) {
    let calledButtonId = buttonFromTaskContainer.getAttribute("id");
    let separatorIndex = calledButtonId.indexOf("-");
    let baseOfTask = BASE_OF_Task_Select.slice(1);
    let taskToCheckId = calledButtonId.substr(0, separatorIndex);
    let taskToCheck = document.querySelector("div.task-wrapper #" + taskToCheckId);
    let checkedOptions = taskToCheck.querySelectorAll("option:checked");
    let USER_ANSWERS_INPUTS = [];
    let GRADE = 0;
    let GRADE_DISPLAY = taskToCheck.querySelector("div.score");


    for (let i = 0; i < checkedOptions.length; i++) {
        if (checkedOptions[i].value !== "0") {
            USER_ANSWERS_INPUTS.push(checkedOptions[i]);
        }
    }

    let allSelectsInTask = taskToCheck.querySelectorAll("select");

    if (USER_ANSWERS_INPUTS.length !== allSelectsInTask.length) {
        showPopUpNotAllChecked(taskToCheckId);
        return;
    }

    buttonFromTaskContainer.remove();

    for (let i = 0; i < checkedOptions.length; i++) {
        let parentElement = checkedOptions[i].parentElement;
        parentElement.disabled = true;

        if (checkedOptions[i].value === baseOfTask[i].correctAnswer) {
            parentElement.style.backgroundColor = "green";
            parentElement.parentElement.insertAdjacentHTML("beforeend",
                '<img class="right-wrong-select-img" src="https://bit.ly/3hnnVpX" alt="right">');
            GRADE++;
        } else {
            parentElement.style.backgroundColor = "red";
            parentElement.parentElement.insertAdjacentHTML("beforeend",
                '<img class="right-wrong-select-img" src="https://bit.ly/2ApIim1" alt="right">');
        }

    }

    GRADE_DISPLAY.innerHTML += "Результат: " + GRADE + "/" + USER_ANSWERS_INPUTS.length;
    GRADE_DISPLAY.style.visibility = "visible";
    GRADE_DISPLAY.style.opacity = 100;

    clearLocalStorageButSaveBasesAndResults(taskToCheck);

}


// Option
function buildInput(baseOfInputTests, taskId) {
}

// Other

function showResultsIfStored(taskId) {
    LESSON_NUMBER = document.getElementById("taskWrapper").getAttribute("lesson");
    let taskInnerHtml = localStorage.getItem("lesson" + LESSON_NUMBER + taskId);

    if (taskInnerHtml === null) {
        return false;
    }
    document.getElementById(taskId).innerHTML = taskInnerHtml;
    return true;
}

function shuffle(baseOfTests, taskId) {

    let baseFromStorage = localStorage.getItem("base_lesson" + LESSON_NUMBER + taskId);

    if (baseFromStorage == null) {
        baseOfTests.sort(() => Math.random() - 0.5);

        localStorage.setItem("base_lesson" + LESSON_NUMBER + taskId, JSON.stringify(baseOfTests));
        return baseOfTests;
    } else {
        baseOfTests = JSON.parse(baseFromStorage);
        return baseOfTests;
    }
}

function showPopUpNotAllChecked(taskToCheckId) {

    POPUP.title = capitalizeFirstLetter(taskToCheckId);
    POPUP.style.visibility = "visible";
    POPUP.style.opacity = 100;

    POPUPbg.style.visibility = "visible";
    POPUPbg.style.opacity = 100;

}

function hidePopUp() {

    POPUP.style.visibility = "hidden";
    POPUP.style.opacity = 0;

    POPUPbg.style.visibility = "hidden";
    POPUPbg.style.opacity = 0;
}

function capitalizeFirstLetter(str) {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
}

function clearLocalStorageButSaveBasesAndResults(taskToCheck) {
    let taskToCheckId = taskToCheck.id;
    let saveBasesOfTests = [];
    let saveResults = [];

    for (let i = 1; i <= TASK_COUNTER; i++) {
        let baseExist = localStorage.getItem("base_lesson" + LESSON_NUMBER + "task" + i)
        let resultsExist = localStorage.getItem("lesson" + LESSON_NUMBER + "task" + i)
        if (baseExist) {
            saveBasesOfTests[i] = baseExist;
        }
        if (resultsExist) {
            saveResults[i] = resultsExist;
        }
    }

    localStorage.clear();
    localStorage.setItem("lesson" + LESSON_NUMBER + taskToCheckId, taskToCheck.innerHTML);

    for (let i = 1; i <= TASK_COUNTER; i++) {
        if (saveBasesOfTests[i]) {
            localStorage.setItem("base_lesson" + LESSON_NUMBER + "task" + i, saveBasesOfTests[i]);
        }
        if (saveResults[i]) {
            localStorage.setItem("lesson" + LESSON_NUMBER + "task" + i, saveResults[i]);
        }
    }
}

$("select").on("change", function () {
    $('option:selected', this).hide().siblings().show();
});