


let ServerData = [];
//let ServerData = DarwinData;
// let ServerData = {};

console.log('data.js starts running');
console.log('data comes in from server:', ServerData);







// parse all letters - change d.date to timestamp
function parseAndPrepareLetters(data) {
    console.log('parsing data:', data);
    parsedLetters = [];
    data.forEach(letter => {

        let parseTime = d3.timeParse("%d-%b-%Y");

        // only parse if necessary
        if (parseTime(letter.date) === null){
            letter.date = letter.date
        }
        else {
            letter.date = parseTime(letter.date)
        }

        letter.id = +letter.id;
        letter.letterLength = +letter.letterLength;
        letter.senderID = +letter.senderID;
        letter.recipientID = +letter.recipientID;
        letter.sentiment = +letter.sentiment;
        parsedLetters.push(letter)
    });
}

//parseAndPrepareLetters(ServerData.letters);


// wrangle data
function wrangleServerData(data, range){

    console.log('wrangling', data);

    // emptying old tmp arrays
    CorrespondenceArray = [];
    AllLettersFilteredBySelectedTime = [];

    // initialize as dict
    let LetterSumsDictByAuthor = {};

    // summing sentiment & length for all letters
    console.log('    filtering letters by range:', range);
    data.forEach(d=>{

        // storing current year
        let tmpYear = d.date.getFullYear();

        // filtering data by comparing year of current letter to selected range of years
        if (range[0] <= tmpYear && tmpYear <= range[1]){

            // add letter to FilteredLetters array
            AllLettersFilteredBySelectedTime.push(d);

            // preparing correspondence array for network graph now:

            // create key based on sender and recipient
            let tmpCorrespondenceKey = d.senderID + 'to' + d.recipientID;
            let tmpCorrespondenceKeyRevert = d.recipientID + 'to' + d.senderID;

            // INCLUDE ALGORITHM HERE TODO
            let tmpValue = d.sentiment; // + d.length

            // check if revert key exist:
            if ((tmpCorrespondenceKeyRevert in LetterSumsDictByAuthor)){
                //console.log('key exists reverted', d, tmpCorrespondenceKey);
                LetterSumsDictByAuthor[tmpCorrespondenceKeyRevert] += tmpValue
            }
            // check if key exist:
            else if ((tmpCorrespondenceKey in LetterSumsDictByAuthor)){
                //console.log('key exists', d, tmpCorrespondenceKey);
                LetterSumsDictByAuthor[tmpCorrespondenceKey] += tmpValue
            }
            // otherwise just enter new key in dic
            else{
                //console.log('new key:', d, tmpCorrespondenceKey);
                LetterSumsDictByAuthor[tmpCorrespondenceKey] = tmpValue;
            }
        }
    });
    console.log('    letters have been filtered:', AllLettersFilteredBySelectedTime);
    console.log('    sum for each correspondence:',LetterSumsDictByAuthor);


    // preparing correnspondences array for vis.js
    console.log('    preparing correnspondences array for vis.js');

    CorrespondenceArray = [];
    for (correspondants in LetterSumsDictByAuthor){

        // creating appropriate object using split() to get 'from' and 'to'
        let tmpObj = {
            from: correspondants.split('to')[0],
            to: correspondants.split('to')[1],
            value: Math.pow((LetterSumsDictByAuthor[correspondants]),2),
            //length: 1/Math.pow((LetterSumsDictByAuthor[correspondants] + 0.01),2)*30
            length: 1/(LetterSumsDictByAuthor[correspondants] + 0.01)*50
        };

        //
        CorrespondenceArray.push(tmpObj);
    }
    console.log('    data preparation for network vis (array) is finished:', CorrespondenceArray);

    console.log('    (re)calculating network vis');

    // updating both ScatterBarCharts only if a sender was selected
    if(selectedSenderID !== ''){
        console.log('    updating scatters since an edge has been selected earlier');
        updateScatterBarChart(scatterBarSenderSVG, AllLettersFilteredBySelectedTime, selectedRange, selectedSenderID, selectedRecipientID);
        updateScatterBarChart(scatterBarRecipientSVG, AllLettersFilteredBySelectedTime, selectedRange, selectedRecipientID, selectedSenderID);

        // update LineChart as well
        updateLineChart(lineChartSVG, AllLettersFilteredBySelectedTime, selectedRange, selectedRecipientID, selectedSenderID);
    }
}



//console.log('wrangleServerData() is preparing data...');
//wrangleServerData(parsedLetters, selectedRange);




