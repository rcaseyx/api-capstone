const omdb = "http://www.omdbapi.com/?";
const youtube = "https://www.googleapis.com/youtube/v3/search";

function getDataFromYt(term,callback) {
  // retrieves JSON data from YouTube
  const query = {
    part: "snippet",
    type: "video",
    q: `${term} review`,
    maxResults: "5",
    key: "AIzaSyDxLrPbRwFR8exidCjH1KBLdMNRZXA9QnQ"
  }

  $.getJSON(youtube,query,callback);
}

function getDataFromBestBuy(x,y) {
  // retrieves data from Amazon Products API

}

function renderInitialResult(result) {
  console.log(result);
  console.log("renderResultRan");
}

function getDataFromWalmart(term,type,callback) {
  // retrieves data from Walmart API
  const query = {
    apikey: `fe50249c`,
    s: `${term}`,
    type: `${type}`,
  }

  $.getJSON(omdb,query,callback);
}

function displayBestBuyData(data) {
  // displays data from AMZ in the DOM

}

function displayYtData(data) {
  // displays data from YouTube in the DOM

}

function displayWalmartData(data) {
  const result = data.items.map((item,index) => renderInitialResult(item));
}

function handleSearch() {
  $('.js-search').submit(function(e) {
    e.preventDefault();
    let searchTerm = $('#query').val();
    let type = $('input[type=radio]:checked').attr('value');
    $('#query').val('');
    $('.js-results').html('');
    console.log(type);
    getDataFromWalmart(searchTerm,type,displayWalmartData);
  });
}

function handleYtClick() {

}

function handlePriceCheckClick() {

}

function handleScoop() {
  handleSearch();
  handleYtClick();
  handlePriceCheckClick();
}

$(handleScoop);
