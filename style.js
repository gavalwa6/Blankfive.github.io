$(function() {
	function navTo(element, duration) {
		if (duration == null) { duration = ''; } else { duration = duration + 's'; }
		$('#current-nav').css('transition', duration);
		$('#current-nav').css('left', $(element).position().left + 3);
		$('#current-nav').css('height', $(element).outerHeight());
		$('#current-nav').css('width', $(element).outerWidth());
	}
	
	function curPage(page) {
		if (page != null) {
			if (page != '') {
				sessionStorage.setItem('current-page', page);
			}
			
			page = sessionStorage.getItem('current-page');
			
			navTo('#' + page, 0.3);
			
			$('#content').load(page + '.html');
		}
		return sessionStorage.getItem('current-page');
	}
	
	$(window).resize(function() {
		navTo('#' + curPage());
	});
	
	if (curPage() == null) {
		curPage('home');
	} else {
		curPage('');
	}
	
	$('.nav').click(function() {
		curPage($(this).attr('id'));
	});
});
