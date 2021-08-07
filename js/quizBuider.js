var INPUTS_ID = 0;
var TESTS_COUNTER = 0;
var TASK_COUNTER = 0;

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
    
    baseOfTests = shuffle(baseOfTests);

    let htmlWrapper = document.getElementById(htmlWrapperId);


    baseOfTests.forEach((question, questionNumber) => {
        let options = [];
        let genereted_test_item = [];

        for (option in question.options) {
            options.push(
                `<div class="pretty p-default p-round p-thick">
                    <input type="radio" id="${INPUTS_ID}" class="option" name=${htmlWrapperId}Question${questionNumber} value="${option}"/>
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
                          <button class="button" id="${htmlWrapperId}-submit">Перевірити</button>
                          <button class="button" id="${htmlWrapperId}-showErrors" style="display:none">Показати неправильні</button>`);


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
            let item = localStorage.getItem("radio:task" + taskNumber + "Question" + questionNumber);
            console.log("radio:task" + taskNumber + "Question" + questionNumber, item);
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
