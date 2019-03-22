

// initializing global variables for data wrangling
let selectedAuthorID = '';
let selectedSenderID = '';
let selectedRecipientID = '';

let myLetters = [];

// initializing range for time filter
// let TimeOfEarliestLetterInSet = 1890;
// let TimeOfLatestLetterInSet = 1900;

// initializing global variables for sliders
let selectedRange = [];
let selectedNumberOfLettersSliderValue = 100;
let selectedLengthOfLettersSliderValue = 33;
let selectedSentimentOfLettersSliderValue = 33;

let TimeSlider = {};
let network = {};

// initializing global variables for network graph
let authors = {};
let correspondences = {};


// initializing variables for filtering algorithm
let averageLetterLength = 200;
let averageResponseTime = 14; //Math.abs((new Date("2000/03/02"))-(new Date("2000/03/01")))/86400000;
let averageLettersInCorrespondence = 5;

// initializing temporary arrays
let parsedLetters = [];
let AllLettersFilteredBySelectedTime = [];
let CorrespondenceArray = [];

// scatterBarChart variables for d3 that need to be defined outside of the init & update functions
let scatterBarSenderSVG = {};
let scatterBarRecipientSVG = {};
let scatterBarHeight = 0;
let scatterBarWidth = 0;
let scatterBarSenderScaleX = {};

// lineChart variables for d3 that need to be defined outside of the init & update functions
let lineChartSVG = {};
let lineChartWidth = 0;
let lineChartHeight = 0;