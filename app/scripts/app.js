
(function (document) {
  'use strict';

  var home = null;

  /**
   * Helper function to show the search query.
   * @param {String} query - The search query.
   */
  function addSearchHeader(query) {
    home.innerHTML = '<h2 class="page-title">query: ' + query + '</h2>';
  }

  /**
   * Helper function to create a planet thumbnail.
   * @param  {Object} data - The raw data describing the planet.
   */
  function createPlanetThumb(data) {
    var pT = document.createElement('planet-thumb');
    for (var d in data) {
      pT[d] = data[d];
    }
    home.appendChild(pT);
  }

  /**
   * XHR wrapped in a promise.
   * @param  {String} url - The URL to fetch.
   * @return {Promise}    - A Promise that resolves when the XHR succeeds and fails otherwise.
   */
  function get(url) {
    return fetch(url, {
      method: 'get'
    });
  }

  /**
   * Performs an XHR for a JSON and returns a parsed JSON response.
   * @param  {String} url - The JSON URL to fetch.
   * @return {Promise}    - A promise that passes the parsed JSON response.
   */
  function getJSON(url) {
    return get(url).then(function (response) {
      return response.json();
    });
  }

  window.addEventListener('WebComponentsReady', function () {
    home = document.querySelector('section[data-route="home"]');

    getJSON('../data/earth-like-results.json')
      .then(function (response) {
        addSearchHeader(response.query);
        var x = response.results.map(url => {
         return getJSON(url)
        });
        Promise.all(x).then(function (values) {
          values.forEach(data => createPlanetThumb(data));
        });
      })
      .catch(function () {
        throw Error('Search Request Error');
      })

  });
})(document);