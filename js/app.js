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

SpotifyApi.pullArtistInfo = function(query, singleType)	{
	var request = {
		q: query,
		type: singleType,
		limit: '50'
	};
	console.log(singleType);
	var url = "http://api.spotify.com/v1/search";

	return $.getJSON(url, request);
};

View.combResults = function(results) {
	$.each(results, function(i, item)	{
		var info = View.showResults(item);
		$('.results').append(info);
	});
};

View.showResults = function(data)	{
	// copy .results section
	var result = $('.template .data').clone();

	// set albumTitle
	var nameTitle = result.find('.name');
	nameTitle.html('<p>' + data.name + '</p>');

	// set album img and link
	var imgAnch = result.find('.anchor');
	imgAnch.html('<a href="' + data.external_urls.spotify + '" target="_blank"><img src="' + data.images[0].url + '" alt="img" height="100" width="100"></a>');

	// display type
	var type = result.find('.type');
	type.html('<p>' + data.type + '</p>');

	return result;
};

View.clearDisplay = function()	{
	$('.results').html('');
};

View.fetchUserQuery = function(){
	return $('input#artist').val();
};

View.fetchUserType = function(){
	return $('select#type').val();
};

View.createHistoryHtml = function(data)	{
	var html = "";
	html += "<ul>";
	data.forEach(function(item)	{
		html += "<li id='" + item.searchTerm + "'><a href='#'>" + item.searchTerm + "</a> - " + item.searchType + "</li>";
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
		var singleType = View.fetchUserType();

		SpotifyApi
							.pullArtistInfo(query, singleType)
							.then(function(results)	{
								console.log(results);
								if (results.albums) {
									var validData = results.albums.items;
								} else if (results.artists) {
									var validData = results.artists.items;
								} else {
									var validData = results.playlists.items;
								};
								Data.searchHistory.push({
									searchTerm: query,
									searchType: singleType,
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
