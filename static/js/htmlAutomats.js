function createDistinctTileList_TabOne (data) {

    let html = '';
    data.forEach( obj => {
        html +=
            `<div class="col-4 t1-list-col ${obj.word}"
                onclick="lockColor('${obj.word}', 1)" 
                onmouseover="ColorToClass('${obj.word}'); highlightLineThroughTile('${obj.word}')"
                onmouseout="RemoveColorFromClass('${obj.word}'); DeHighlightLineThroughTile('${obj.word}')">
                    <span class='t1-list-span'>${obj.word} (${obj.value})</span>
            </div>`;
    });
    document.getElementById('t1-list').innerHTML = html;

    // manually solve the 'first' color assignment
    $(".Traum")
        .css("fill", '#fb8072')
        .css("background", '#fb8072');

    // add scrollbar:
    new SimpleBar(document.getElementById('t1-list').parentElement);
}

function createDistinctTileList_TabTwo(data){

    let html = '';
    data.forEach((obj, i) => {
        html += `<div class="col-2 t2-list-col ` +  obj.word + `" 
        onclick="lockColor('` + obj.word + `', 1)" 
        onmouseout="RemoveColorFromClass('` + obj.word + `')"
        onmouseover="ColorToClass('` + obj.word + `')">
        <span class='t2-list-span'>` + obj.word + ` (` + obj.value +
            `)</span></div>`;
    });

    document.getElementById('t2-list').innerHTML = html
}

