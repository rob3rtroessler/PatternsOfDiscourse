let corpus = [
    {id: 0, author: "Johann Friedrich Herbart", title: "Psychologie als Wissenschaft (1824)"},
    {id: 1, author: "Johann Friedrich Herbart", title: "Lehrbuch zur Psychologie (1834)"},
    {id: 2, author: "Ernst von Feuchtersleben ", title: "Zur Dietätik der Seele (1838)"},
    {id: 3, author: "Rudolf Hermann Lotze", title: "Medicinische Psychologie oder Physiologie der Seele (1852)"},
    {id: 4, author: "Gustav Theodor Fechner", title: "Elemente der Psychophysik (1860)"},
    {id: 5, author: "Wilhelm Wundt", title: "Grundzüge der physiologischen Psychologie (1871)"},
    {id: 6, author: "Gustav Adolf Lindner", title: "Lehrbuch der empirischen Psychologie als inductiver Wissenschaft" +
        " (1872)"},
    {id: 7, author: "Franz Brentano", title: "Psychologie vom empirischen Standpunkt (1874)"},
    {id: 8, author: "Ernst Mach", title: "Die Analyse der Empfindungen und das Verhältnis des Physischen zum" +
        " Psychischen (1886)"},
    {id: 9, author: "Sigmund Freud", title: "Die Traumdeutung (1900)"}
];

let htmlArray = [];
corpus.forEach( d => {
    htmlArray += `<label class="container">` + d.author + `<br> <span style="font-style: italic">` + d.title+ `</span>
                                    <input type="checkbox" id='` + d.id + `'>
                                    <span class="checkmark"></span>
                                </label>`
    ;
});
document.getElementById("corpusList").innerHTML = htmlArray;