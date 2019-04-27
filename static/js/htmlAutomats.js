


function createWordList_OLD(dict){


    // empty tag
    //$('#t2-list').html('');

    // get keys
    let keys = Object.keys(dict);

    console.log(keys);
    let html = '';
    // loop over keys, for each key create div, after 12 divs
    keys.forEach((word, i) => {
        console.log('key',word);

        if(i===0){
            console.log(i, 'i === 0');
            html += `<div class="row" style="border-bottom: thin solid grey">` +
                `<div class="col-1 t2-list-col"><span class='t2-list-span'>` + word + `</span></div>`
        }
        else if(i%12 === 0){
            console.log(i, i%12, 'i%12 === 0');
            html += `</div><div class="row" style="border-bottom: thin solid grey">` +
                       `<div class="col-1 t2-list-col"><span 
class='t2-list-span'>` + word + `</span></div>`
        }
        else if(i%12 !== 11){
            console.log(i, i%12 !== 11, 'i%12 !== 11');
            html += `<div class="col-1 t2-list-col"><span class='t2-list-span'>` + word + `</span></div>`
        }
        else{
            console.log(i, 'else');
            html += `<div class="col-1" style="height: 25%;"><span class='t2-list-span'>` + word + `</span></div>`
        }
    });

    html += '</div>';



    console.log(html);
    //$('#t2-list').html(html);
    document.getElementById('t2-list').innerHTML += html

}


function createWordList_two(dict){


    console.log(dict);

    // get keys
    let keys = Object.keys(dict);

    console.log(keys);
    let html = '';
    // loop over keys, for each key create div, after 12 divs
    keys.forEach((word, i) => {
        html += `<div class="col-2 t2-list-col ` +  word + `"><span class='t2-list-span'>` + word + ` (` + dict[word] +
            `)</span></div>`;
        console.log(dict[word])
    });


    html = html + html + html + html;
    console.log(html);
    //$('#t2-list').html(html);
    document.getElementById('t2-list').innerHTML += html

}