'use strict';

var Data = {
	searchHistory: [],

	findByName: function(name){
		var filteredElement = this.searchHistory.find(function(element){
			return element.searchTerm === name;
		});
		return filteredElement.results;
	}
};
var SpotifyApi = {};
var View = {};

SpotifyApi.pullArtistInfo = function(query)	{
	var request = {
		q: query,
		type: 'album',
		limit: '50'
	};
	var url = "http://api.spotify.com/v1/search";

	return $.getJSON(url, request);
};

View.combResults = function(results) {
	$.each(results, function(i, item)	{
		var albums = View.showResults(item);
		$('.results').append(albums);
	});
};

View.showResults = function(albums)	{
	// copy .results section
	var result = $('.template .albumData').clone();

	// set albumTitle
	var albumName = result.find('.albumTitle');
	albumName.html('<p>' + albums.name + '</p>');

	// set album img and link
	var albumImgAnch = result.find('.albumAnchor');
	albumImgAnch.html('<a href="' + albums.external_urls.spotify + '" target="_blank"><img src="' + albums.images[0].url + '" alt="img" height="100" width="100"></a>');

	// display type
	var albumType = result.find('.albumType');
	albumType.html('<p>' + albums.album_type + '</p>');

	return result;
};

View.clearDisplay = function()	{
	$('.results').html('');
};

View.fetchUserQuery = function(){
	return $('input#artist').val();
};

View.createHistoryHtml = function(data)	{
	var html = "";
	html += "<ul>";
	data.forEach(function(item)	{
		html += "<li id='" + item.searchTerm + "'><a href='#'>" + item.searchTerm + "</a></li>";
	});
	html += "</ul>";
	return html;
};

View.renderHistory = function(data) {
	var html = View.createHistoryHtml(data);
	$('.searchHistory').html(html);
};

//accept query
$(function()	{
	$('.entry').submit(function(e)	{
		e.preventDefault();
		View.clearDisplay();
		var query = View.fetchUserQuery();

		SpotifyApi
							.pullArtistInfo(query)
							.then(function(results)	{
								var validData = results.albums.items;

								Data.searchHistory.push({
									searchTerm: query,
									results: validData
								});

								View.combResults(validData);
								View.renderHistory(Data.searchHistory);
							});
	});

	$('.searchHistory').on('click', 'a', function(e)	{
		e.preventDefault();

		var query = $(this).parent('li').attr('id');
		var listOfAlbums = Data.findByName(query);

		View.clearDisplay();
		View.combResults(listOfAlbums);

	});
});
