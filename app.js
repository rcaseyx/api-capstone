const youtube = "https://www.googleapis.com/youtube/v3/search";

function handleSearch() {
  $('.js-search').submit(function(e) {
    e.preventDefault();
    $('.purchase').html('');
    $('.scoop').html('');
    $('.trailer').html('');
    let searchTerm = $('#query').val();
    let type = $('input[type=radio]:checked').attr('value');
    $('#query').val('');
    $('.js-results').html('');
    $('.js-results').prop('hidden',false);
    getListFromTmdb(searchTerm,type,displayTmdbData);
  });
}

function getListFromTmdb(term,type,callback) {
  const tmdb = `https://api.themoviedb.org/3/search/${type}`;
  const query = {
    api_key: `0ac47474c87a54ead692cf6cce79a4ed`,
    query: `${term}`,
  }

  $.getJSON(tmdb,query,callback);
}

function displayTmdbData(data) {
  const result = data.results.map((item,index) => renderInitialResult(item));
  $('.js-results').html(result);
}

function renderInitialResult(result) {
  //console.log(result);
  return `<div id=${result.id}>
            <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${movieOrTv(result)}" name="${result.release_date}">
            <p>${movieOrTv(result)}</p>
            <button id="get-scoop">Get the Scoop!</button>
          </div>`
}

function handleGetTheScoop() {
  $('.js-results').on('click','#get-scoop',function() {
    $('.js-results').prop('hidden',true);
    let type = $('input[type=radio]:checked').attr('value');
    let id = $(this).closest('div').attr('id');
    let title = $(this).closest('div').find('img').attr('alt');
    let year = $(this).closest('div').find('img').attr('name').slice(0,4);
    getDataFromBestBuy(title,year,displayBestBuyData);
    getSingleData(id,type,renderSelectionDetails);
  });
}

function getDataFromYt(term,type,year,callback) {
  // retrieves JSON data from YouTube
  const query = {
    part: "snippet",
    type: "video",
    q: `${term} ${year} ${type} trailer`,
    maxResults: "1",
    key: "AIzaSyDxLrPbRwFR8exidCjH1KBLdMNRZXA9QnQ"
  }

  $.getJSON(youtube,query,callback);
}

function displayYtData(data) {
  const result = data.items.map((item,index) => renderTrailer(item));
  $('.trailer').html(result);
}

function getSingleData(id,type,callback) {
  const tmdbSingle = `https://api.themoviedb.org/3/${type}/${id}`;
  const query = {
    api_key: `0ac47474c87a54ead692cf6cce79a4ed`,
  }

  $.getJSON(tmdbSingle,query,callback);
}

function renderTrailer(result) {
  return `<div class="videoBox" aria-live="assertive">
            <iframe title="Selected Video" src="https://www.youtube.com/embed/${result.id.videoId}">
            </iframe>
            <button class="closeVideo">Close</button>
          </div>`
}

function renderSelectionDetails(result) {
  let html = `<div>
                <button class="back">Back to Results</button>
                <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${movieOrTv(result)}" name="${result.release_date}">
                <p>${movieOrTv(result)}</p>
                <p><em>${result.overview}</em></p>
                <p>${cycleGenreNames(result.genres)}</p>
                <button class="viewTrailer">View Trailer</button>
              </div>`;

  $('.scoop').html(html);
}

function movieOrTv(result) {
  if(!result.title) {
    return `${result.name}`;
  }
  else {
    return `${result.title}`;
  }
}

function cycleGenreNames(genres) {
  let names = genres.map(a => a.name);
  let genreList = names.join(', ');
  return genreList;
}

function handleYtClick() {
  $('.scoop').on('click','.viewTrailer',function() {
    let title = $(this).closest('div').find('img').attr('alt');
    let year = $(this).closest('div').find('img').attr('name').slice(0,4);
    let type = $('input[type=radio]:checked').attr('value');
    getDataFromYt(title,type,year,displayYtData);
    openVideo();
  });
}

function openVideo() {
  $('.backdrop').animate({'opacity':'.50'},300,'linear');
  $('.trailer').animate({'opacity':'1.0'},300,'linear');
  $('.trailer, .backdrop').css('display','block');
  $('main').attr('aria-hidden',true);
}

function handleCloseVid() {
  $('.trailer').on('click','.closeVideo',function() {
    closeVideo();
  });
  $('.backdrop').click(function() {
    closeVideo();
  });
}

function closeVideo() {
  $('main').attr('aria-hidden',false);
  $('.trailer, .backdrop').animate({'opacity':'0'},300,'linear',function(){
    $('.trailer, .backdrop').css('display','none');
  });
  $('.trailer').html('');
}

function getDataFromBestBuy(title,year,callback) {
  let titleReplace = title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  let titleArr = titleReplace.split(' ');
  let search = "";
  for(i = 0; i < titleArr.length; i++) {
    let word = titleArr[i];
     if(titleArr.length == 1) {
       search += `((search=${word}&search=${year}&search=blu&search=ray))`;
     }
     else if(i == 0) {
       search += `((search=${word}`;
     }
     else if(i == titleArr.length - 1) {
       search += `&search=${word}&search=${year}&search=blu&search=ray))`;
     }
     else {
       search += `&search=${word}`
     }
  }
  let bestbuy = `https://api.bestbuy.com/v1/products${search}?apiKey=vA4dhUHYoqxQPPdAthqHLESp&format=json`;
  $.getJSON(bestbuy,callback);
}

function displayBestBuyData(data) {
  const result = renderBestBuy(data.products[0]);
  $('.purchase').html(result);
}

function renderBestBuy(item) {
  console.log(item);
  let html = `<div>
                <img src=${item.image} alt="Buy on Blu Ray">
                <p>${item.name}</p>
                <a href="${item.url}" target="_blank"><p>Purchase at BestBuy.com</p></a>
              </div>`;
  $('.purchase').html(html);
}

function handleBack() {
  $('.scoop').on('click','.back',function() {
    $('.purchase').html('');
    $('.scoop').html('');
    $('.trailer').html('');
    $('.js-results').prop('hidden',false);
  })
}

function handleScoop() {
  handleSearch();
  handleYtClick();
  handleGetTheScoop();
  handleYtClick();
  handleCloseVid();
  handleBack();
}

$(handleScoop);
