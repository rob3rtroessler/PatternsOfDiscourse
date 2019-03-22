
/*
    TIME FILTER FUNCTIONALITY
 */

function initSliders (range) {

    // passing along this info to global variable
    selectedRange = range;

    // computing range for time filter
    let startRange = range;
    let LengthOfTimeFilterRange = range[1] - range[0];
    let TimeFilterRange = {
        'min': range[0],
        'max': range[1]
    };

    // computing pips
    for (i = 0; i < LengthOfTimeFilterRange; i++){
        TimeFilterRange[100/LengthOfTimeFilterRange*(i+1)] = range[0] + i + 1
    }

    // log
    // console.log('range for time filter:', TimeFilterRange);

    // create time slider for letters
    TimeSlider = noUiSlider.create(document.getElementById('pips-range'), {
        start: startRange,
        snap: true,
        connect: true,
        range: TimeFilterRange,
        pips: {
            mode: 'range',
            density: 5
        }
    });


    /*
        ALGORITHM SLIDERS
     */

    // define range for sliders with percentage scale
    let percentageRange = {
        'min': 0,
        '25%': 25,
        '50%': 50,
        '75%': 75,
        'max': 100};

    // NumberOfLetterSlider
    noUiSlider.create(document.getElementById('numberOfLetters-sliderDiv'), {
        range: percentageRange,
        start: 100,
        orientation: 'vertical',
        direction: 'rtl',
        pips: {
            mode: 'range',
            density: 5
        }
    });

    // LengthOfLetterSlider
    noUiSlider.create(document.getElementById('lengthOfLetters-sliderDiv'), {
        range: percentageRange,
        start: 33,
        orientation: 'vertical',
        direction: 'rtl',
        pips: {
            mode: 'range',
            density: 10
        }
    });

    noUiSlider.create(document.getElementById('sentimentOfLetters-sliderDiv'), {
        range: percentageRange,
        start: 33,
        orientation: 'vertical',
        direction: 'rtl',
        pips: {
            mode: 'range',
            density: 5
        }
    });

    console.log('sliders loaded');
}


function initSliderEvents(){

    // adding event listener to time slider events
    document.getElementById('pips-range').noUiSlider.on('change', function(d){

        // create array with currently selected years
        selectedRange = [parseInt(this.get()[0]), parseInt(this.get()[1])];
        //console.log(selectedRange);

        // filter data according to selected Range
        console.log('time was filtered. calling wrangleData() to update vis');

        // wrangling the data
        wrangleServerData(parsedLetters, selectedRange);

        // updating network chart connections - CorrenspondenceArray has changed through wrangleServerData() call
        correspondences = new vis.DataSet(CorrespondenceArray);

        // redrawing
        network.setData({nodes: authors, edges: correspondences});
    });

    // adding event listener to slider events
    document.getElementById('numberOfLetters-sliderDiv').noUiSlider.on('change', function(d) {

        // passing along this info to global variable
        selectedNumberOfLettersSliderValue = d;

        // wrangling the data
        wrangleServerData(parsedLetters, selectedRange);
    });

    // adding event listener to slider events
    document.getElementById('lengthOfLetters-sliderDiv').noUiSlider.on('change', function(d) {

        // passing along this info to global variable
        selectedLengthOfLettersSliderValue = d;

        // wrangling the data
        wrangleServerData(parsedLetters, selectedRange);
    });

    // adding event listener to slider events
    document.getElementById('sentimentOfLetters-sliderDiv').noUiSlider.on('change', function(d) {

        // passing along this info to global variable
        selectedSentimentOfLettersSliderValue = d;

        // wrangling the data
        wrangleServerData(parsedLetters, selectedRange);
    });

    console.log('sliders functionality loaded');
}


// updateSlider functionality
function updateTimeSlider(slider, range) {

    document.getElementById('pips-range').noUiSlider.destroy();
    //document.getElementById('pips-range').innerHTML = 'huhu';
    // passing along this info to global variable
    selectedRange = range;

    // computing range for time filter
    let startRange = range;
    let LengthOfTimeFilterRange = range[1] - range[0];
    let TimeFilterRange = {
        'min': range[0],
        'max': range[1]
    };

    // computing pips
    for (i = 0; i < LengthOfTimeFilterRange; i++){
        TimeFilterRange[100/LengthOfTimeFilterRange*(i+1)] = range[0] + i + 1
    }

    // log
    // console.log('range for time filter:', TimeFilterRange);

    // create time slider for letters
    TimeSlider = noUiSlider.create(document.getElementById('pips-range'), {
        start: startRange,
        snap: true,
        connect: true,
        range: TimeFilterRange,
        pips: {
            mode: 'range',
            density: 5
        }
    });

}














