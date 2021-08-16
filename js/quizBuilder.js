var INPUTS_ID = 0;
var TASK_COUNTER = 0;
var LESSON_NUMBER;
var MODULE_NUMBER;
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
    MODULE_NUMBER = document.getElementById("taskWrapper").getAttribute("module");

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
                    <input type="radio" id="${INPUTS_ID}" class="option" name=module${MODULE_NUMBER}lesson${LESSON_NUMBER + taskId}Question${questionNumber} value="${option}"/>
                    <div class="state p-danger">
                        <label><b>${option.toUpperCase()}) </b> ${question.options[option]}</label>
                    </div>
                </div>`
            );
            INPUTS_ID++;
        }
        if (question.imgIndex !== undefined) {
            genereted_test_item.push(
                `<li class="questionContainer"'>
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
    let taskWrapper = document.getElementsByClassName("task-wrapper");
    for (let i = 0; i < taskWrapper.length; i++) {
        let radiosInTaskWrapper = taskWrapper[i].querySelectorAll("input[type=radio]")

        radiosInTaskWrapper.forEach(radio => {
            radio.addEventListener('change', () => updateRadioStateInLocalStorage(radio));
        })
    }
}

function updateRadioStateInLocalStorage(radio) {
    localStorage.setItem("radio:" + radio.name, radio.id);
}

function markRadioAsCheckedIfIsExistInLocalStorage() {
    let taskWrappers = document.getElementsByClassName("task-wrapper");

    for (let i = 0; i < taskWrappers.length; i++) {

        let questionCounter =
            taskWrappers[i].querySelectorAll(" div.task-wrapper ol.task-container li.questionContainer").length;

        for (let taskNumber = 1; taskNumber <= TASK_COUNTER; taskNumber++) {
            for (let questionNumber = 0; questionNumber < questionCounter; questionNumber++) {
                let item = localStorage.getItem("radio:module" + MODULE_NUMBER + "lesson" + LESSON_NUMBER + "task" + taskNumber + "Question" + questionNumber);

                if (item !== null) {
                    let radioById = document.getElementById(item.valueOf());
                    radioById.checked = true;
                }
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

    let baseOfTest = JSON.parse(localStorage.getItem("base_module" + MODULE_NUMBER + "lesson" + LESSON_NUMBER + taskToCheckId));
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

}


// Select
function buildSelect(baseOfSelectTests, taskId) {
    TASK_COUNTER++;
    LESSON_NUMBER = document.getElementById("taskWrapper").getAttribute("lesson");
    MODULE_NUMBER = document.getElementById("taskWrapper").getAttribute("module");

    let isResultShown = showResultsIfStored(taskId);
    if (isResultShown === true) {
        return;
    }

    let taskInnerHtml = baseOfSelectTests[0].taskText;
    let onlyOptions = baseOfSelectTests.slice(1);
    localStorage.setItem("base_module" + MODULE_NUMBER + "lesson" + LESSON_NUMBER + taskId, JSON.stringify(onlyOptions));
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
            `<div class="select" name="module${MODULE_NUMBER}lesson${LESSON_NUMBER + taskId}Question${selectNumber}">
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

    let taskTitle = taskElement.getAttribute("title");
    if (taskTitle) {
        taskElement.insertAdjacentHTML("beforeend",
            `<h2 style="text-align: center;">${taskTitle}</h2>`);
    }

    taskElement.insertAdjacentHTML("beforeend", taskInnerHtml);

    taskElement.insertAdjacentHTML('beforeend', `<br><div class="score" id="${taskId}-score"></div>
                          <button class="button" id="${taskId}-submit" onclick="checkSelect(this)">Перевірити</button>`);

    setEventListenerOnSelect();
    markSelectAsCheckedIfIsExistInLocalStorage();

}

$("select").on("change", function () {
    $('option:selected', this).hide().siblings().show();
});

function setEventListenerOnSelect() {
    let taskWrapper = document.getElementsByClassName("task-wrapper");
    for (let i = 0; i < taskWrapper.length; i++) {
        let selectInTaskWrapper = taskWrapper[i].querySelectorAll("select");
        selectInTaskWrapper.forEach(select => {
            select.addEventListener('change', () => updateSelectStateInLocalStorage(select));
        })
    }
}

function updateSelectStateInLocalStorage(select) {
    localStorage.setItem("select:" + select.parentNode.getAttribute("name"), select.value);
}

function markSelectAsCheckedIfIsExistInLocalStorage() {
    let taskWrappers = document.getElementsByClassName("task-wrapper");

    for (let i = 0; i < taskWrappers.length; i++) {
        let allSelectsParents = taskWrappers[i].querySelectorAll("ol.task-container div.select");

        for (let i = 0; i < allSelectsParents.length; i++) {
            let item = localStorage.getItem("select:" + allSelectsParents[i].getAttribute("name"));

            if (item !== null) {
                let checkedOption = allSelectsParents[i].querySelector("select option[value=" + item.valueOf() + "]");
                checkedOption.selected = true;
            }
        }
    }

}

function checkSelect(buttonFromTaskContainer) {
    let calledButtonId = buttonFromTaskContainer.getAttribute("id");
    let separatorIndex = calledButtonId.indexOf("-");
    let taskToCheckId = calledButtonId.substr(0, separatorIndex);
    let taskToCheck = document.querySelector("div.task-wrapper #" + taskToCheckId);
    let baseOfTask = JSON.parse(localStorage.getItem("base_module" + MODULE_NUMBER + "lesson" + LESSON_NUMBER + taskToCheckId));
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



// TextInput
function buildInput(baseOfInputTests, taskId) {
    TASK_COUNTER++;
    LESSON_NUMBER = document.getElementById("taskWrapper").getAttribute("lesson");
    MODULE_NUMBER = document.getElementById("taskWrapper").getAttribute("module");

    let isResultShown = showResultsIfStored(taskId);
    if (isResultShown === true) {
        markTextInputAsCheckedIfIsExistInLocalStorage();
        return;
    }

    let taskElement = document.getElementById(taskId);
    localStorage.setItem("base_module" + MODULE_NUMBER + "lesson" + LESSON_NUMBER + taskId, JSON.stringify(baseOfInputTests));
    baseOfInputTests.forEach((question, questionNumber) => {
        let questionHtmlString = question.question;
        let inputsInQuestion = question.correctAnswers;

        for (let inputInQuestion in inputsInQuestion) {
            let inputHtml = `<span><input id="module${MODULE_NUMBER}lesson${LESSON_NUMBER + taskId}Question${questionNumber}Input${inputInQuestion}" type="text" /></span>`

            questionHtmlString = questionHtmlString.replace("__${input#text}__", inputHtml);
        }

        taskElement.insertAdjacentHTML('beforeend',
            `<li class="questionContainer">
                        <div>${questionHtmlString}</div>
                    </li>`);

    })

    taskElement.insertAdjacentHTML('beforeend', `<br><div class="score" id="${taskId}-score"></div>
                          <button class="button" id="${taskId}-submit" onclick="checkTextInput(this)">Перевірити</button>`);

    setEventListenerOnTextInput();
    markTextInputAsCheckedIfIsExistInLocalStorage();
}

function markTextInputAsCheckedIfIsExistInLocalStorage() {
    let taskWrappers = document.getElementsByClassName("task-wrapper");

    for (let i = 0; i < taskWrappers.length; i++) {
        let allTextInputs = taskWrappers[i].querySelectorAll("input[type='text']");
        for (let i = 0; i < allTextInputs.length; i++) {
            let item = localStorage.getItem("input:" + allTextInputs[i].id);
            if (item !== null) {
                allTextInputs[i].value = item;
            } else {
                let dataValue = allTextInputs[i].getAttribute("data-value");
                if (dataValue !== null){
                    allTextInputs[i].value = dataValue;
                }
            }
        }
    }

}

function setEventListenerOnTextInput() {
    let taskWrapper = document.getElementsByClassName("task-wrapper");
    for (let i = 0; i < taskWrapper.length; i++) {
        let textInputsInTaskWrapper = taskWrapper[i].querySelectorAll("input[type='text']");
        textInputsInTaskWrapper.forEach(inputText => {
            inputText.addEventListener('input', updateTextInputStateInLocalStorage);
        })
    }
}

function updateTextInputStateInLocalStorage(e) {
    e.target.setAttribute("data-value", e.target.value);
    localStorage.setItem("input:" + e.target.id, e.target.value);
}

function checkTextInput(buttonFromTaskContainer){
    let calledButtonId = buttonFromTaskContainer.getAttribute("id");
    let separatorIndex = calledButtonId.indexOf("-");
    let taskToCheckId = calledButtonId.substr(0, separatorIndex);
    let taskToCheck = document.querySelector("div.task-wrapper #" + taskToCheckId);
    let baseOfTask = JSON.parse(localStorage.getItem("base_module" + MODULE_NUMBER + "lesson" + LESSON_NUMBER + taskToCheckId));
    let allInputs = taskToCheck.querySelectorAll("input[type='text']");
    let allQuestionsInTask = taskToCheck.querySelectorAll("li.questionContainer");
    let USER_ANSWERS_INPUTS = 0;

    let GRADE = 0;
    let GRADE_DISPLAY = taskToCheck.querySelector("div.score");


    for (let i = 0; i < allInputs.length; i++) {
        let trimmedValue = allInputs[i].value.trim();
        if (trimmedValue.length !== 0) {
            USER_ANSWERS_INPUTS++;
        }
    }


    if (USER_ANSWERS_INPUTS !== allInputs.length){
        showPopUpNotAllChecked(taskToCheckId);
        return;
    }

    buttonFromTaskContainer.remove();

    baseOfTask.forEach((question, questionNumber) => {
        let correctAnswers = Object.entries(question.correctAnswers);
        let inputsInQuestion = allQuestionsInTask[questionNumber].querySelectorAll("input[type='text']");
        for (let i = 0; i < inputsInQuestion.length; i++) {
            let correctAnswerForInput = correctAnswers[i][1];
            let UserAnswer = inputsInQuestion[i].value.trim().toLowerCase();
            inputsInQuestion[i].disabled = true;
            for (let j = 0; j < correctAnswerForInput.length; j++) {
                if (UserAnswer === correctAnswerForInput[j]){
                    inputsInQuestion[i].style.backgroundColor = "limegreen";
                    inputsInQuestion[i].parentElement.insertAdjacentHTML("beforeend",
                        '<img class="right-wrong-input-img" src="https://bit.ly/3hnnVpX" alt="right">');
                    GRADE++;
                    break;
                } else if (j + 1 === correctAnswerForInput.length){
                    inputsInQuestion[i].style.backgroundColor = "#ff837a";
                    inputsInQuestion[i].style.color = "#fff";
                    inputsInQuestion[i].parentElement.insertAdjacentHTML("beforeend",
                        '<img class="right-wrong-input-img" src="https://bit.ly/2ApIim1" alt="right">');
                }
            }
        }
    });

    GRADE_DISPLAY.innerHTML += "Результат: " + GRADE + "/" + allInputs.length;
    GRADE_DISPLAY.style.visibility = "visible";
    GRADE_DISPLAY.style.opacity = 100;

    clearLocalStorageButSaveBasesAndResults(taskToCheck);

}




// Other
function showResultsIfStored(taskId) {
    LESSON_NUMBER = document.getElementById("taskWrapper").getAttribute("lesson");
    MODULE_NUMBER = document.getElementById("taskWrapper").getAttribute("module");

    let taskInnerHtml = localStorage.getItem("module" + MODULE_NUMBER + "lesson" + LESSON_NUMBER + taskId);

    if (taskInnerHtml === null) {
        return false;
    }
    document.getElementById(taskId).innerHTML = taskInnerHtml;
    return true;
}

function shuffle(baseOfTests, taskId) {

    let baseFromStorage = localStorage.getItem("base_module" + MODULE_NUMBER + "lesson" + LESSON_NUMBER + taskId);

    if (baseFromStorage == null) {
        baseOfTests.sort(() => Math.random() - 0.5);

        localStorage.setItem("base_module" + MODULE_NUMBER + "lesson" + LESSON_NUMBER + taskId, JSON.stringify(baseOfTests));
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
        let baseExist = localStorage.getItem("base_module" + MODULE_NUMBER + "lesson" + LESSON_NUMBER + "task" + i)
        let resultsExist = localStorage.getItem("module" + MODULE_NUMBER + "lesson" + LESSON_NUMBER + "task" + i)
        if (baseExist) {
            saveBasesOfTests[i] = baseExist;
        }
        if (resultsExist) {
            saveResults[i] = resultsExist;
        }
    }

    localStorage.clear();
    localStorage.setItem("module" + MODULE_NUMBER + "lesson" + LESSON_NUMBER + taskToCheckId, taskToCheck.innerHTML);

    for (let i = 1; i <= TASK_COUNTER; i++) {
        if (saveBasesOfTests[i]) {
            localStorage.setItem("base_module" + MODULE_NUMBER + "lesson" + LESSON_NUMBER + "task" + i, saveBasesOfTests[i]);
        }
        if (saveResults[i]) {
            localStorage.setItem("module" + MODULE_NUMBER + "lesson" + LESSON_NUMBER + "task" + i, saveResults[i]);
        }
    }
}

