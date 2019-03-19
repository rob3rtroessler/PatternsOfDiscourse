function toggleSidebar(side) {
    if (side !== "left" && side !== "right") {
        return false;
    }

    let left = $("#sidebar-left"),
        right = $("#sidebar-right"),
        center = $("#center"),
        openSidebarsCount = 0,
        centerDivClass = "";

    // toggle sidebar
    if (side === "left") {
        left.toggleClass("collapsed");
    } else if (side === "right") {
        right.toggleClass("collapsed");
    }

    // determine number of open sidebars
    if (!left.hasClass("collapsed")) {
        openSidebarsCount += 1;
    }

    if (!right.hasClass("collapsed")) {
        openSidebarsCount += 1;
    }

    // determine appropriate ForceGraphDiv class
    if (openSidebarsCount === 0) {
        centerDivClass = "col-md-12";
    } else if (openSidebarsCount === 1) {
        centerDivClass = "col-md-9";
    } else {
        centerDivClass = "col-md-6";
    }

    // apply class to ForceGraphDiv
    center.removeClass("col-md-12 col-md-9 col-md-6")
        .addClass(centerDivClass);
}


/*
    NODE FUNCTIONALITY
*/

function NodeClicked(authorID) {

    // look up and store authorName
    let authorName = authors._data[authorID].label;
    let authorInfoImgSrc = authors._data[authorID].image;
    let authorInfoText = authors._data[authorID].description;

    // update photo
    $('#authorInfoImg').html(`<img class="authorInfoImg" src="` + authorInfoImgSrc + `">`);

    // update heading
    $('#authorInfoHeader').html(authorName);

    // update heading
    $('#authorInfoText').html(authorInfoText);

    // after all calculations are done, show sidebar
    if($("#sidebar-left").attr('class')=== 'col-md-3 sidebar collapsed'){
        //$(".toggle-sidebar-right").click();
        toggleSidebar('left')
    }
}


/*
    EDGE FUNCTIONALITY
*/

// update ScatterBarChart and SentimentLineChart as edge gets selected
function EdgeClicked(sender, recipient) {

    console.log('updating right side, ie. ScatterBarCharts & LineChart');

    // calling updateScatterBarChart(data,range,sender,recipient)
    updateScatterBarChart(scatterBarSenderSVG, AllLettersFilteredBySelectedTime, selectedRange, selectedSenderID, selectedRecipientID);
    updateScatterBarChart(scatterBarRecipientSVG, AllLettersFilteredBySelectedTime, selectedRange, selectedRecipientID, selectedSenderID);

    // calling updateLineChart
    updateLineChart(lineChartSVG, AllLettersFilteredBySelectedTime, selectedRange, selectedSenderID, selectedRecipientID);

    // updating picture of sender
    $('#senderPicture').html(`<img src="` + authors._data[sender].image + `" class="authorIMG">`);
    $('#senderHeading').html(`Letters by ` + authors._data[sender].label);

    // updating picture and heading of recipient
    $('#recipientPicture').html(`<img src="` + authors._data[recipient].image + `" class="authorIMG">`);
    $('#recipientHeading').html(`Letters by ` + authors._data[recipient].label);

    // relationshipPic
    $('#relationshipPic').html(
        `<img src="` + authors._data[sender].image + `" class="relationshipImgleft">`
    + `<img src="` + authors._data[recipient].image + `" class="relationshipImgRight">`);

    // after all calculations are done, show sidebar
    if($("#sidebar-right").attr('class')=== 'col-md-3 sidebar collapsed'){
        toggleSidebar('right')
    }
}

