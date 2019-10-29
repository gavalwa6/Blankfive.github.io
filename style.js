$(function() {
	function curPage(page) {
		if (page != null) {
			if (page != '') {
				sessionStorage.setItem('current-page', page);
			}
			
			page = sessionStorage.getItem('current-page');
			
			$('#current-nav').css('left', $('#' + page).position().left);
			$('#current-nav').css('height', $('#' + page).outerHeight());
			$('#current-nav').css('width', $('#' + page).outerWidth());
			
			$('#content').load(page + '.html');
		}
		return sessionStorage.getItem('current-page');
	}
	
	if (curPage() == null) {
		curPage('home');
	} else {
		curPage('');
	}
	
	$('.nav').click(function() {
		curPage($(this).attr('id'));
	});
	
	$('.images-img-button').hover(function() {
		$(this).children('.images-img-box').css('background', '#BBBBDD');
	}, function() {
		$(this).children('.images-img-box').css('background', '#CCCCEE');
	});
});
