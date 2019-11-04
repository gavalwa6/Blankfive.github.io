/* Prompt (credit to Andrew Dodson) */
;(function() {
	var ignorelist = [];
	try { ignorelist = JSON.parse(localStorage.getItem('prompt.bugme')) || []; } catch(e) {}
	if (!ignorelist instanceof Array) {
		ignorelist = [];
	}

	$.fn.popup = function(message, callback, bugme) {
		if (typeof(callback) === 'boolean') {
			bugme = callback;
		}
		
		if (typeof(message) === 'function') {
			callback = message;
			message = null;
		}
		
		if (typeof(message) === 'string') {
			message = $('<p>' + message + '</p>').get(0);
		}
		
		message = message || this;
		
		if ($('.jquery_prompt').length) { return $(); }

		callback = callback || function(p) { return !!p; };
		
		var hash = $(message).text();
		if (bugme && 'indexOf' in ignorelist && ignorelist.indexOf(hash) > -1) {
			callback(bugme);
			return $();
		}

		var bind = function(e) {
			if (e.which === 27) {
				$popup.find('form').trigger('reset');
			} else if (e.which === 13) {
				$popup.find('form').trigger('submit');
			}
		};
		
		$(document).bind('keydown', bind);
		
		var $popup = $("<iframe class='jquery_prompt' allowtransparency=true frameborder='0' scrolling='auto' marginheight='0' marginwidth='0'></iframe>"
		+ "<div class='jquery_prompt plugin'>"
			+ "<form>"
				+ "<div class='footer'>"
					+ "<input type='text' name='text' value='' style='display: none;' placeholder='' autocomplete='off'>"
					+ "<button type='reset' style='display: none;'>Cancel</button>"
					+ "<button type='submit' name='submit' value='1'>Confirm</button>"
					+ "<br>"
					+ "<input name='bugme' id='bugme' type='checkbox' value='1' checked='checked' style='display: none;'>"
					+ "<label for='bugme' style='display:none;'>keep asking me</label>"
				+ '</div>'
			+ '</form>'
		+ '</div>')
		.prependTo('body')
		.find('form')
		.prepend(message)
		.on('submit', function(e) {
			e.response = $('button[name=submit]', this).val() == 1 ? $('input[name=text]:visible', this).val() || true : false;

			try {
				callback.call(this, e);
			} catch(e) {
				e.preventDefault();
				throw e;
			}

			if (!e.isDefaultPrevented()) {
				$(document).unbind('keydown', bind);

				e.preventDefault();
				if(!$('input[name=bugme]', this).is(':checked')){
					ignorelist.push(hash);
					try { localStorage.setItem('prompt.bugme', JSON.stringify(ignorelist)); } catch(e) {}
				}
				$(this).parent().add($(this).parent().siblings('.jquery_prompt')).remove();
			} else {
				$('button[name=submit]', this).val('1');
			}
		})
		.on('reset', function() {
			$('button[name=submit]', this).val(0);
			$(this).submit();
		})
		.find('button[type=submit]')
		.trigger('focus')
		.end()
		.end();
		
		if (bugme) {
			$popup.find('input[name=bugme], input[name=bugme] + label').show();
		}
		
		return $popup;
	};

	$.fn.prompt = function(message, callback, bugme, placeholder) {
		var popup = $(this).popup(message, callback, bugme);
		popup.find('input[name=text], button').show();
		popup.find('input[name=text]').attr('placeholder', placeholder);
		popup.find('input[name=text]').focus();
		return popup;
	};

	$.fn.alert = function(message, callback, bugme) {
		var popup = $(this).popup(message, callback, bugme);
		popup.find('button[type=submit]').text('Ok');
		return popup;
	};

	$.fn.confirm = function(message, callback, bugme) {
		var popup = $(this).popup(message, callback, bugme);
		popup.find('button').show();
		return popup;
	};
})(jQuery);

/* Navigation */
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
