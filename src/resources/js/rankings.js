$(document).ready(() => {
	// background

	const backgroundCookie = (document.cookie.split(';').find(cookie => cookie.trim().startsWith('background')) || '').trim();
	const background = backgroundCookie.substr(backgroundCookie.indexOf('=') + 1);

	if (background === 'rotate' || !background) {
		// falsy check for if no selection has been made, and thus is on standard
		$('body').css('background-image', `url(/images/${['bg1.jpg', 'bg2.jpg', 'bg3.jpg'][Math.round(Math.random() * 2)]})`);
	}
	else {
		$('body').css('background-image', `url(/images/${background}.jpg)`);
	}

	$('#bg-select').val(background || 'rotate');

	$('#bg-select').change(function() {
		/* eslint-disable no-invalid-this */
		if (this.value !== 'rotate') $('body').css('background-image', `url(/images/${this.value}.jpg)`);
		return document.cookie = `background=${this.value}`;
		/* eslint-enable no-invalid-this */
	});

	// actual functionality

	const formatNumber = number => number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');

	const updateRanking = rankings => {
		$('#rankings').children('li').detach();

		for (const rank of rankings) {
			if (rank.filename === 'realname') continue;

			$('#rankings').append(`<li id=${rank.filename}>${rank.displayName}: ${formatNumber(rank.count)} clicks</li>`);
		}

		if ($('#loading')) $('#loading').remove();
	};

	$.get('/conInfo').done(con => {
		const domainOrIP = document.URL.split('/')[2].split(':')[0];
		const host = con.ssl ? `https://${domainOrIP}` : `http://${domainOrIP}:${con.port}`;

		const socket = io.connect(host);
		socket.on('update', data => data.rankings ? updateRanking(data.rankings) : null);
	});

	$.get('/counter?rankings').done(rankings => updateRanking(rankings));
});