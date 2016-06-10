'use strict';
// json object
var pullArtistInfo = function(query) {
	var request = {
		q: query,
		type: 'album'
	};
	var url = "http://api.spotify.com/v1/search";

	$.getJSON(url, request, function(results) {
		console.log(results.albums.items);
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
	console.log(albums);
	var albumName = albums.name;
	var albumType = albums.type;
	var albumImg	= albums.images[0].url;
	var results = albumName + '<br>' + albumType + '<br>' + '<img src="' + albumImg + '" height="100" width="100"> <br>';
	return results;
}
// accept query
$(function()	{
	$('.entry').on('click', '#submit', function(e) {
		e.preventDefault();
		var queryArtist = $('input#artist').val();
		pullArtistInfo(queryArtist);
	});
});
