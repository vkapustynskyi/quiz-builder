var INPUTS_ID = 0;
var TESTS_COUNTER = 0;
var TASK_COUNTER = 0;
var LESSON_NUMBER;
const POPUP = document.getElementById("notAllChecked");
const POPUPbg = document.getElementById("popup-background");
const POPUPok = document.querySelector(".pure-dialog-buttons input[type='button'][value='Ок']");

POPUPok.onclick = function (){
    hidePopUp();
}

function shuffle(baseOfTests) {

    let baseFromStorage = localStorage.getItem("base_from_storage");

    if (baseFromStorage == null) {
        baseOfTests.sort(() => Math.random() - 0.5);
        localStorage.setItem("base_from_storage", JSON.stringify(baseOfTests));
        return baseOfTests;
    } else {
        baseOfTests = JSON.parse(baseFromStorage);
        return baseOfTests;
    }
}

function buildTest(baseOfTests, htmlWrapperId) {
    TASK_COUNTER++;

    let isResultShown = showResultsIfStored(baseOfTests, htmlWrapperId);
    if (isResultShown === true) {
        return;
    }


    baseOfTests = shuffle(baseOfTests);

    let htmlWrapper = document.getElementById(htmlWrapperId);
    console.log("return?");

    baseOfTests.forEach((question, questionNumber) => {

        let options = [];
        let genereted_test_item = [];
        LESSON_NUMBER = document.getElementById("taskWrapper").getAttribute("lesson");

        for (option in question.options) {
            options.push(
                `<div class="pretty p-default p-round p-thick">
                    <input type="radio" id="${INPUTS_ID}" class="option" name=lesson${LESSON_NUMBER + htmlWrapperId}Question${questionNumber} value="${option}"/>
                    <div class="state p-danger">
                        <label><b>${option.toUpperCase()}) </b> ${question.options[option]}</label>
                    </div>
                </div>`
            );
            INPUTS_ID++;
        }
        genereted_test_item.push(
            `<li class="questionContainer" style='z-index: ${questionNumber - 2000}'>
                    <div class="question"> ${question.question} </div>
                    <div class="answers"> ${options.join('')} </div>
                </li>`
        );
        htmlWrapper.insertAdjacentHTML('beforeend', genereted_test_item);
        TESTS_COUNTER++;
    })
    htmlWrapper.insertAdjacentHTML('beforeend', `  <br><div class="score" id="${htmlWrapperId}-score"></div>
                          <button class="button" id="${htmlWrapperId}-submit" onclick="checkTest(this)">Перевірити</button>
                          <button class="button" id="${htmlWrapperId}-showErrors" style="display:none">Показати неправильні</button>`);

}

function showResultsIfStored(baseOfTests, htmlWrapperId){
    LESSON_NUMBER = document.getElementById("taskWrapper").getAttribute("lesson");
    let taskInnerHtml = localStorage.getItem("lesson" + LESSON_NUMBER + htmlWrapperId);

    console.log("lesson" + LESSON_NUMBER + htmlWrapperId);
    if (taskInnerHtml === null){
        return false;
    }
    document.getElementById(htmlWrapperId).innerHTML = taskInnerHtml;
    return true;
}

function setEventListenerOnRadio() {
    let taskWrapper = document.getElementById("taskWrapper");
    let radiosInTaskWrapper = taskWrapper.querySelectorAll("input[type=radio]")

    radiosInTaskWrapper.forEach(radio => {
        radio.addEventListener('change', () => updateRadioStateInLocalStorage(radio));
    })
}

function markRadioAsCheckedIfIsExistInLocalStorage(){
    let questionCounter =
        document.querySelectorAll(" div.task-wrapper ol.task-container li.questionContainer").length;

    for (let taskNumber = 1; taskNumber <= TASK_COUNTER; taskNumber ++) {
        for (let questionNumber = 0; questionNumber < questionCounter; questionNumber++) {
            let item = localStorage.getItem("radio:lesson" + LESSON_NUMBER + "task" + taskNumber + "Question" + questionNumber);

            if (item !== null){
                let radioById = document.getElementById(item.valueOf());
                radioById.checked = true;
            }
            else{
                break;
            }
        }

    }
}

function updateRadioStateInLocalStorage(radio) {
    localStorage.setItem("radio:" + radio.name, radio.id);
}

function checkTest(buttonFromTaskContainer){
    let calledButtonId = buttonFromTaskContainer.getAttribute("id");
    let seperatorIndex = calledButtonId.indexOf("-");

    let taskToCheckId = calledButtonId.substr(0, seperatorIndex);

    let taskToCheck = document.querySelector("div.task-wrapper #" + taskToCheckId);
    const USER_ANSWERS_INPUTS = taskToCheck.querySelectorAll("input:checked");

    if (USER_ANSWERS_INPUTS.length !== taskToCheck.querySelectorAll("li.questionContainer").length){
        showPopUpNotAllChecked(taskToCheck);
        return;
    }

    let allInputsParentsInTask = taskToCheck.querySelectorAll("div.pretty");

    for (let i = 0; i < allInputsParentsInTask.length; i++) {
        allInputsParentsInTask[i].classList.add("p-locked");
    }

    let baseOfTest = JSON.parse(localStorage.getItem("base_from_storage"));
    for (let i = 0; i < USER_ANSWERS_INPUTS.length; i++) {

        USER_ANSWERS_INPUTS[i].parentElement.style.border = "solid #5d16a2 2px";

        let imageLabel = USER_ANSWERS_INPUTS[i].parentNode.querySelector("label");

        if (baseOfTest[i].correctAnswer !== USER_ANSWERS_INPUTS[i].getAttribute("value")){

            imageLabel.style.fontWeight = "bold";
            imageLabel.innerHTML += " <img class=\"right-wrong-test-img\" src=\"https://bit.ly/2ApIim1\" alt='wrong'/>";


            let correct_answer_input = USER_ANSWERS_INPUTS[i]
                .parentNode.parentNode.querySelector("input[value='" + baseOfTest[i].correctAnswer + "']");
            let correctInputLabel = correct_answer_input.parentElement.querySelector("label");
            correctInputLabel.style.color = "#70b747";
            correctInputLabel.style.fontWeight = "bold";
            correctInputLabel.innerHTML += " <img class=\"right-wrong-test-img\" src=\"https://bit.ly/3hnnVpX\" alt='right'/>";

        } else {
            imageLabel.style.color = "#70b747";
            imageLabel.style.fontWeight = "bold";
            imageLabel.innerHTML += " <img class=\"right-wrong-test-img\" src=\"https://bit.ly/3hnnVpX\" alt='right'/>";
        }

    }

    localStorage.clear();

    localStorage.setItem("lesson" + LESSON_NUMBER + taskToCheckId, taskToCheck.innerHTML);

}

function showPopUpNotAllChecked(taskToCheck){
    POPUP.title = capitalizeFirstLetter(taskToCheck.id);
    POPUP.style.visibility = "visible";
    POPUP.style.opacity = 100;

    POPUPbg.style.visibility = "visible";
    POPUPbg.style.opacity = 100;

}

function hidePopUp(){
    POPUP.style.visibility = "hidden";
    POPUP.style.opacity = 0;

    POPUPbg.style.visibility = "hidden";
    POPUPbg.style.opacity = 0;
}

function capitalizeFirstLetter(str) {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
}

