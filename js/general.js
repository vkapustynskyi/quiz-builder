const BlockOfTask1 = [
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

window.onload = function (){
    buildTest(BlockOfTask1, "task1");
    buildTest(BlockOfTask1, "task2");
    setEventListenerOnRadio();
    markRadioAsCheckedIfIsExistInLocalStorage();
}