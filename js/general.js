const BASE_OF_Task1 = [
    {
        question: "I bought a beautiful dress at the mall. «Beautiful» is a(an) _______",
        options: {
            a: "noun",
            b: "adverb",
            c: "preposition",
            d: "adjective"
        },
        correctAnswer: "d"
    },
    {
        question: "What did she ask you to do? «She» is a(an) _______",
        options: {
            a: "noun",
            b: "pronoun",
            c: "adjective",
            d: "adverb"
        },
        correctAnswer: "b"
    },
    {
        question: "I left my shoes under the kitchen table. «Under» is a(an) _______",
        options: {
            a: "preposition",
            b: "adjective",
            c: "pronoun",
            d: "noun"
        },
        correctAnswer: "a"
    },
    {
        question: "She leads an _______ life",
        options: {
            a: "act",
            b: "active",
            c: "activity",
            d: "acting"
        },
        correctAnswer: "a"
    }

];
const BASE_OF_Task_With_Images = [
    {
        question: "I bought a beautiful dress at the mall. «Beautiful» is a(an) _______",
        options: {
            a: "noun",
            b: "adverb",
            c: "preposition",
            d: "adjective"
        },
        imgIndex: 0,
        correctAnswer: "d"
    },
    {
        question: "What did she ask you to do? «She» is a(an) _______",
        options: {
            a: "noun",
            b: "pronoun",
            c: "adjective",
            d: "adverb"
        },
        imgIndex: 1,
        correctAnswer: "b"
    },
    {
        question: "I left my shoes under the kitchen table. «Under» is a(an) _______",
        options: {
            a: "preposition",
            b: "adjective",
            c: "pronoun",
            d: "noun"
        },
        imgIndex: 2,
        correctAnswer: "a"
    },
    {
        question: "She leads an _______ life",
        options: {
            a: "act",
            b: "active",
            c: "activity",
            d: "acting"
        },
        imgIndex: 3,
        correctAnswer: "a"
    }

];
const IMG_BASE = [  '<img class="questionImg" src="src/1.jpg">',
                    '<img class="questionImg" src="src/2.jpg">'];

function build(testBase, taskId) {
    let elementById = document.getElementById(taskId);
    let type = elementById.getAttribute("data-type");
    if (type === "test"){
        buildTest(testBase, taskId);
    }
    if (type === "select-test"){
        buildSelect();
    }
    if (type === "input-test"){
        buildInput();
    }
}

window.onload = function (){
    build(BASE_OF_Task1, "task1");
    build(BASE_OF_Task_With_Images, "task2");

    setEventListenerOnRadio();
    markRadioAsCheckedIfIsExistInLocalStorage();
}