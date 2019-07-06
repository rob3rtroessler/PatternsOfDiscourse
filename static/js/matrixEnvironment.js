// corpus is stored in global variable

// initiate matrixEnvironment after keyword selection

// checked when selected - if in array
let matrixCorpusArray = [];
corpus.forEach( d => {
    console.log('corpusinfo:', d);
    matrixCorpusArray += `<div class="row" style="border-bottom: thin solid grey; height: 10%">
                                        <div class="col-2">
                                            <div class="centeredCheckbox">
                                                <input type="checkbox" id="${d.id}-D1" class="cbx-d1" style="display:none"/>
                                                <label for="${d.id}-D1" class="toggle"><span></span></label>
                                            </div>
                                        </div>
                                        <div class="col-8" style="font-size: 1.3vh;"> ${d.author}<br><span style="font-style: italic">
${d.title}</span></div>
                                        <div class="col-2">
                                            <div class="centeredCheckbox">
                                                <input type="checkbox" id="${d.id}-D2" class="cbx-d2" style="display:none"/>
                                                <label for="${d.id}-D2" class="toggle"><span></span></label>
                                            </div>
                                        </div>
                                    </div>`;
});
document.getElementById("matrixCorpusList").innerHTML = matrixCorpusArray;



