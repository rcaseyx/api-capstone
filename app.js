const youtube = "https://www.googleapis.com/youtube/v3/search";
let type = "";

function handleSearch() {
  $('.js-search').submit(function(e) {
    e.preventDefault();
    $('.purchase').html('');
    $('.scoop').html('');
    $('.trailer').html('');
    $('.back-button').html('');
    $('.recommend').html('');
    $('.page').prop('hidden',true);
    let searchTerm = $('#query').val();
    type = $('input[type=radio]:checked').attr('value');
    $('#query').val('');
    $('.js-results').html('');
    $('.js-results').prop('hidden',false);
    $('.js-results').css('display','flex');
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
  if(data.results.length === 0) {
    const result = `<p>No results. Please try another search.</p>`
    $('.js-results').html(result);
  }
  else if(data.results.length > 0 && data.results.length < 8) {
    const result = data.results.map((item,index) => renderInitialResult(item));
    $('.js-results').html(result);
  }
  else {
    let sliceData = data.results.slice(0,8);
    const result = sliceData.map((item,index) => renderInitialResult(item));
    $('.js-results').html(result);
  }
}

function renderInitialResult(result) {
  //console.log(result);
  return `<div id=${result.id} class="searchResult">
            <img src="${placeholderPoster(result)}" alt="${movieOrTvTitle(result)} poster" name="${result.release_date}">
            <p>${movieOrTvTitle(result)}</p>
            <button id="get-scoop">Get the Scoop!</button>
          </div>`
}

function handleGetTheScoop() {
  $('.js-results').on('click','#get-scoop',function() {
    $('.js-results').prop('hidden',true);
    $('.js-results').hide();
    $('.back-button').prop('hidden',false);
    $('.page').prop('hidden',false);
    $('.back-button').html('<button class="back">Back to Results</button>');
    //let type = $('input[type=radio]:checked').attr('value');
    let id = $(this).closest('div').attr('id');
    let title = $(this).closest('div').find('p').html();
    let year = $(this).closest('div').find('img').attr('name').slice(0,4);
    getDataFromBestBuy(title,year,displayBestBuyData);
    getRecsFromTmdb(id,type,displayRecs);
    getSingleData(id,type,renderSelectionDetails);
    $('html, body').animate({scrollTop : 0},800);
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
            <span class="ytSearch">Not the right trailer? <a href="https://www.youtube.com/" target="_blank">Search YouTube.</a></span>
            <button class="closeVideo">Close</button>
          </div>`
}

function renderSelectionDetails(result) {
  console.log(result);
  let html = `<div class="currentSelection">
                <h3>${movieOrTvTitle(result)}</h3>
                <img src="${placeholderPoster(result)}" alt="${movieOrTvTitle(result)} poster" name="${result.release_date}">
                <button class="viewTrailer">View Trailer</button>
                <p><em>${result.overview}</em></p>
                <p>Genre: <span class="genres">${cycleGenreNames(result.genres)}</span></p>
                <p>Runtime: <span class="runtime">${movieOrTvRuntime(result)} minutes</span></p>
                <p>IMDb Rating: <span class="rating">${result.vote_average} / 10</span></p>
              </div>`;

  $('.scoop').html(html);
}

function placeholderPoster(result) {
  if(!result.poster_path) {
    return 'https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png';
  }
  else {
    return `https://image.tmdb.org/t/p/w500${result.poster_path}`;
  }
}

function movieOrTvTitle(result) {
  if(type == "tv") {
    return `${result.name}`;
  }
  else {
    return `${result.title}`;
  }
}

function movieOrTvRuntime(result) {
  if(type == "tv") {
    return `${result.episode_run_time[0]}`;
  }
  else {
    return `${result.runtime}`;
  }
}

function cycleGenreNames(genres) {
  let names = genres.map(a => a.name);
  let genreList = names.join(', ');
  return genreList;
}

function handleYtClick() {
  $('.scoop').on('click','.viewTrailer',function() {
    let title = $(this).closest('div').find('h3').html();
    console.log(title);
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
  let titleFirstReplace = title.replace(/[#,+()$~%.'":*?<>{}]/g, '');
  let titleReplace = titleFirstReplace.replace(/&/g, 'and');
  let titleLastReplace = titleReplace.replace(/-/g, ' ');
  let titleArr = titleLastReplace.split(' ');
  let search = "";
  if(type == "movie") {
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
  }
  else {
    for(i = 0; i < titleArr.length; i++) {
      let word = titleArr[i];
       if(titleArr.length == 1) {
         search += `((search=${word}&search=blu&search=ray))`;
       }
       else if(i == 0) {
         search += `((search=${word}`;
       }
       else if(i == titleArr.length - 1) {
         search += `&search=${word}&search=blu&search=ray))`;
       }
       else {
         search += `&search=${word}`
       }
    }
  }
  let bestbuy = `https://api.bestbuy.com/v1/products${search}?apiKey=vA4dhUHYoqxQPPdAthqHLESp&format=json`;
  $.getJSON(bestbuy,callback).fail(showBestBuyError);
}

function displayBestBuyData(data) {
  const result = renderBestBuy(data.products[0]);
  $('.purchase').html(result);
}

function renderBestBuy(item) {
  if(!item) {
    showBestBuyError();
  }
  else {
    let html = `<h3>Purchase Online</h3>
                <div class="bestBuy">
                  <img src=${item.image} alt="Buy on Blu Ray">
                  <p>${item.name}</p>
                  <a href="${item.url}" target="_blank"><p>Purchase at BestBuy.com</p></a>
                </div>`;
    $('.purchase').html(html);
  }
}

function showBestBuyError() {
  let html = `<h3>Purchase Online</h3>
              <div>
                <p>Item not found at Best Buy. Try searching on <a href="https://www.amazon.com/" target="_blank">Amazon.com.</a></p>
              </div>`;
  $('.purchase').html(html);
}

function getRecsFromTmdb(id,type,callback) {
  const tmdb = `https://api.themoviedb.org/3/${type}/${id}/recommendations`;
  const query = {
    api_key: `0ac47474c87a54ead692cf6cce79a4ed`,
  }

  $.getJSON(tmdb,query,callback);
}

function displayRecs(data) {
  if(data.results.length === 0) {
    recError();
  }
  else{
    //const result = data.results.map((item,index) => renderRecs(item));
    let result = "";
    for(i = 0;i < data.results.length;i++){
      result += renderRecs(data.results[i]);
    }
    $('.recommend').html(`<h3>Recommendations Based On This Title</h3>`);
    $('.recommend').append('<div class="recScroll">' + result + '</div>');
  }
}

function renderRecs(result) {
  return `<div id=${result.id} class="recs">
            <p>${movieOrTvTitle(result)}</p>
            <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${movieOrTvTitle(result)} poster" name="${result.release_date}" class="smallPoster">
            <button class="viewRec">View</button>
          </div>`
}

function recError() {
  let html = `<h3>Recommendations Based On This Title</h3>
              <p>No recommendations found at this time.</p>`
  $('.recommend').html(html);
}

function handleViewRec() {
  $('.recommend').on('click','.viewRec',function() {
    $('.js-results').prop('hidden',true);
    $('.back-button').prop('hidden',false);
    $('.back-button').html('<button class="back">Back to Results</button>');
    let id = $(this).closest('div').attr('id');
    let title = $(this).closest('div').find('p').html();
    let year = $(this).closest('div').find('img').attr('name').slice(0,4);
    getDataFromBestBuy(title,year,displayBestBuyData);
    getRecsFromTmdb(id,type,displayRecs);
    getSingleData(id,type,renderSelectionDetails);
    $('html, body').animate({scrollTop : 0},800);
  });
}

function handleBack() {
  $('.back-button').on('click','.back',function() {
    $('.back-button').html('');
    $('.purchase').html('');
    $('.scoop').html('');
    $('.trailer').html('');
    $('.recommend').html('');
    $('.back-button').prop('hidden',true);
    $('.page').prop('hidden',true);
    $('.js-results').prop('hidden',false);
    $('.js-results').css('display','flex');
  })
}

function handleScoop() {
  handleSearch();
  handleYtClick();
  handleGetTheScoop();
  handleYtClick();
  handleCloseVid();
  handleViewRec();
  handleBack();
}

$(handleScoop);
