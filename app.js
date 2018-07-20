const amazon = "";
const walmart = "http://api.walmartlabs.com/v1/search";
const youtube = "https://www.googleapis.com/youtube/v3/search";
const walmartKey = "5m7jtwd577wt8sfauytwcxeu";

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

function getDataFromWalmart(term,callback) {
  // retrieves data from Walmart API
  const query = {
    apiKey: `${walmartKey}`,
    query: `${term}`,
    start: "1",
    numItems: "25",
  }

  $.getJSON(walmart,query,callback);

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
    $('#query').val('');
    $('.js-results').html('');
    getDataFromWalmart(searchTerm,displayWalmartData);
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
