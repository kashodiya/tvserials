var rp = require('request-promise');
var cheerio = require('cheerio');

//var dayUrl = "http://www.desirulez.me/threads/1066620-Sa-Re-Ga-Ma-Pa-Lil-Champs-Season-6-30th-July-2017-Watch-Online";
var dayUrl = process.argv[2];

var options = {
	uri: dayUrl,
	transform: function (body) {
		return cheerio.load(body);
	}
};

rp(options).then(function ($) {
	var title = $("b>font:contains('Speedwatch')");
	var link = title.parent().next().next().next();
  while(link[0].name == "a"){
		var href = link.attr('href');
    console.log(href);
		openVid(href, $);
    link = link.next().next();
  }
}).catch(function (err) {
	console.log(err);
});

function openVid(url){
	var options = {
		uri: url,
		transform: function (body) {
			return cheerio.load(body);
		}
	};
	
	rp(options).then(function ($) {
    var frame = $('iframe[src*="speedwatch.us"]');
//		console.log('iFrames found', frame.length);
		console.log(frame.attr('src'));
		getFinal(frame.attr('src'));
	}).catch(function (err) {
		console.log(err);
	});
}

function getFinal(url){
	var options = {
		uri: url
	};
	
	rp(options).then(function (fdata) {

		var p1 = fdata.indexOf('sources:');
		var p2 = fdata.indexOf('image:');
		var txt = fdata.substring(p1 + 9, p2 - 11);
		//console.log(p1, p2, txt);
		var list = eval(txt);
		//console.log(list);
		list.forEach(function(row) {
			console.log(row);
		});

	}).catch(function (err) {
		console.log(err);
	});

}