'use strict';
// json object
var pullArtistInfo = function(query) {
	var request = {
		q: query,
		type: 'album',
		limit: '50'
	};
	var url = "http://api.spotify.com/v1/search";

	$.getJSON(url, request, function(results) {
		// console.log(results.albums.items);
		// send 'results' to be displayed
		combResults(results.albums.items);
		});
}
// iterate through and display results
var combResults = function(results) {
	$.each(results, function(i, item) {
		var albums = showResults(item);
		$('.results').append(albums);
	});
}
// pull data from each iteration of comb results.
var showResults = function(albums)	{

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
}

// accept query
$(function()	{
	$('.entry').submit(function(e) {
		e.preventDefault();
		$('.results').html('');
		var queryArtist = $('input#artist').val();
		pullArtistInfo(queryArtist);
	});
});
