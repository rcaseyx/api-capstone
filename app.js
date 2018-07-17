const amazon = "";
const walmart = "";
const youtube = "https://www.googleapis.com/youtube/v3/search";

function getDataFromYt(term,callback) {
  // retrieves JSON data from YouTube
  const query = {
    part: "snippet",
    type: "video",
    q: `${term}`,
    maxResults: "5",
    key: "AIzaSyDxLrPbRwFR8exidCjH1KBLdMNRZXA9QnQ"
  }

  $.getJSON(youtube,query,callback);
}

function getDataFromAmz(x,y) {
  // retrieves data from Amazon Products API

}

function getDataFromWalmart(x,y) {
  // retrieves data from Walmart API

}

function displayAmzData(data) {
  // displays data from AMZ in the DOM

}

function displayYtData(data) {
  // displays data from YouTube in the DOM

}

function displayWalmartData(data) {

}

function handleSearch() {
  $('.js-search').submit(function(e) {
    e.preventDefault();
    let searchTerm = $('#query').val();
    $('#query').val('');
    $('.js-results').html('');
    getDataFromAmz(searchTerm,displayAmzData);
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
