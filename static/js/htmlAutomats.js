
// declare function that creats list with prominent tiles
function createDistinctTileList_TabOne (data) {
    // console.log(data);
    data.forEach( (d,i) => {
        // console.log(d,i);
        if (0 <= i && i < 10){
            document.getElementById('top10').innerHTML += `<div class="row listItem ` + d + `" onclick="lockColor('` + d + `', 1)" onmouseout="RemoveColorFromClass('` + d + `')" 
onmouseover="ColorToClass('` + d + `')">` + d + `</div>`
        }
        else if (10 <= i && i < 20){
            document.getElementById('top20').innerHTML += `<div class="row listItem ` + d + `" onclick="lockColor('` + d + `', 1)" onmouseout="RemoveColorFromClass('` + d + `')" 
onmouseover="ColorToClass('` + d + `')">` + d + `</div>`
        }
        else if (20 <= i && i < 30){
            document.getElementById('top30').innerHTML += `<div class="row listItem ` + d + `" onclick="lockColor('` + d + `', 1)" onmouseout="RemoveColorFromClass('` + d + `')" 
onmouseover="ColorToClass('` + d + `')">` + d + `</div>`
        }
    })

}

function createDistinctTileList_TabTwo(dict){


    //console.log(dict);

    // get keys
    let keys = Object.keys(dict);

    //console.log(keys);
    let html = '';
    // loop over keys, for each key create div, after 12 divs
    keys.forEach((word, i) => {
        html += `<div class="col-2 t2-list-col ` +  word + `"><span class='t2-list-span'>` + word + ` (` + dict[word] +
            `)</span></div>`;
        //console.log(dict[word])
    });


    html = html + html + html + html;
    // console.log(html);
    //$('#t2-list').html(html);
    document.getElementById('t2-list').innerHTML += html

}