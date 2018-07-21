const omdb = "http://www.omdbapi.com/?";
const youtube = "https://www.googleapis.com/youtube/v3/search";

function getDataFromYt(term,type,callback) {
  // retrieves JSON data from YouTube
  const query = {
    part: "snippet",
    type: "video",
    q: `${term} ${type}`,
    maxResults: "5",
    key: "AIzaSyDxLrPbRwFR8exidCjH1KBLdMNRZXA9QnQ"
  }

  $.getJSON(youtube,query,callback);
}

function getDataFromBestBuy(x,y) {
  // retrieves data from Amazon Products API

}

function renderInitialResult(result) {
  return `<div>
            <img src="${result.Poster}" alt="${result.Title} poster">
            <p>${result.Title}</p>
            <button>Get the Scoop!</button>
          </div>`
}

function getDataFromOmdb(term,type,callback) {
  const query = {
    apikey: `fe50249c`,
    s: `${term}`,
    type: `${type}`,
  }

  $.getJSON(omdb,query,callback);
}

function displayBestBuyData(data) {

}

function displayYtData(data) {

}

function displayOmdbData(data) {
  const result = data.Search.map((item,index) => renderInitialResult(item));
  $('.js-results').html(result);
}

function handleSearch() {
  $('.js-search').submit(function(e) {
    e.preventDefault();
    let searchTerm = $('#query').val();
    let type = $('input[type=radio]:checked').attr('value');
    $('#query').val('');
    $('.js-results').html('');
    getDataFromOmdb(searchTerm,type,displayOmdbData);
  });
}

function handleYtClick() {

}

function handleScoop() {
  handleSearch();
  handleYtClick();
}

$(handleScoop);
