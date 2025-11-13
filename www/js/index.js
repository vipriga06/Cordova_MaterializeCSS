(function(){
	function $id(id){ return document.getElementById(id); }

	function qs(selector){ return document.querySelector(selector); }

	function clearResults(){
		$id('results').innerHTML = '';
	}

	function showMessage(msg, cls){
		clearResults();
		var li = document.createElement('li');
		li.className = 'collection-item';
		li.textContent = msg;
		if(cls) li.classList.add(cls);
		$id('results').appendChild(li);
	}

	function formatDuration(ms){
		if(!ms) return '';
		var s = Math.floor(ms/1000);
		var m = Math.floor(s/60);
		var sec = s % 60;
		return m + ':' + (sec<10? '0' + sec : sec);
	}

	var lastResults = null;
	var lastType = null;

	function getSizeCategory(){
		var w = window.innerWidth;
		if(w <= 600) return 'small';
		if(w <= 1024) return 'medium';
		return 'large';
	}

	function getMaxItems(){
		var cat = getSizeCategory();
		if(cat === 'small') return 5;
		if(cat === 'medium') return 10;
		return 25;
	}

	function updateSizeBadge(){
		var cat = getSizeCategory();
		var badge = $id('viewportBadge');
		if(!badge){
			badge = document.createElement('div');
			badge.id = 'viewportBadge';
			badge.className = 'viewport-badge';
			document.body.appendChild(badge);
		}
		var text = (cat === 'small') ? 'Pequeña' : (cat === 'medium') ? 'Mediana' : 'Grande';
		badge.textContent = 'Tamaño: ' + text;
		document.body.classList.remove('size-small','size-medium','size-large');
		document.body.classList.add('size-' + cat);
	}

	function renderArtists(artists){
		clearResults();
		if(!artists || artists.length === 0){
			showMessage('No s\'han trobat artistes.');
			return;
		}
		var max = getMaxItems();
		var items = artists.slice(0, max);
		items.forEach(function(a){
			var li = document.createElement('li');
			li.className = 'collection-item avatar';

			var content = document.createElement('div');
			content.className = 'ci-content';

			var title = document.createElement('span');
			title.className = 'title';
			title.textContent = a.name + (a.disambiguation ? ' — ' + a.disambiguation : '');

			var p = document.createElement('span');
			p.className = 'meta';
			var meta = [];
			if(a.country) meta.push('País: ' + a.country);
			if(a['life-span'] && a['life-span'].begin) meta.push('Inici: ' + a['life-span'].begin);
			p.textContent = meta.join(' · ');

			content.appendChild(title);
			content.appendChild(p);

			var aLink = document.createElement('a');
			aLink.href = 'https://musicbrainz.org/artist/' + a.id;
			aLink.target = '_blank';
			aLink.className = 'secondary-content';
			aLink.textContent = 'Veure';

			li.appendChild(content);
			li.appendChild(aLink);
			$id('results').appendChild(li);
		});
	}

	function renderRecordings(recs){
		clearResults();
		if(!recs || recs.length === 0){
			showMessage('No s\'han trobat cançons.');
			return;
		}
		var max = getMaxItems();
		var items = recs.slice(0, max);
		items.forEach(function(r){
			var li = document.createElement('li');
			li.className = 'collection-item';

			var content = document.createElement('div');
			content.className = 'ci-content';

			var title = document.createElement('strong');
			title.className = 'title';
			title.textContent = r.title;

			var credit = (r['artist-credit'] || []).map(function(ac){ return ac.name; }).join(', ');
			var details = document.createElement('span');
			details.className = 'meta';
			details.textContent = (credit ? credit + ' · ' : '') + formatDuration(r.length);

			content.appendChild(title);
			content.appendChild(details);

			var aLink = document.createElement('a');
			aLink.href = 'https://musicbrainz.org/recording/' + r.id;
			aLink.target = '_blank';
			aLink.className = 'secondary-content';
			aLink.textContent = 'Veure';

			li.appendChild(content);
			li.appendChild(aLink);
			$id('results').appendChild(li);
		});
	}

	function searchMusicBrainz(type, q){
		if(!q) return Promise.reject(new Error('Query buida'));
		var base = 'https://musicbrainz.org/ws/2/';
		var url = '';
		if(type === 'artist'){
			url = base + 'artist?query=' + encodeURIComponent(q) + '&fmt=json&limit=25';
		} else {
			url = base + 'recording?query=' + encodeURIComponent(q) + '&fmt=json&limit=25';
		}

		// Note: MusicBrainz recomana enviar User-Agent; en curl ho fem.
		return fetch(url, {
			headers: {
				'Accept': 'application/json'
			}
		}).then(function(res){
			if(!res.ok){
				throw new Error('Resposta HTTP ' + res.status);
			}
			return res.json();
		});
	}

	function reRenderLast(){
		if(!lastResults || !lastType) return;
		if(lastType === 'artist') renderArtists(lastResults);
		else renderRecordings(lastResults);
	}

	function doSearch(){
		var q = $id('query').value.trim();
		var type = (qs('input[name="type"]:checked') || {}).value || 'artist';
		if(!q){
			showMessage('Introdueix un terme per cercar.');
			return;
		}
		showMessage('Cercant...');
		searchMusicBrainz(type, q).then(function(json){
			if(type === 'artist'){
				lastResults = json.artists || [];
				lastType = 'artist';
				renderArtists(lastResults);
			} else {
				lastResults = json.recordings || [];
				lastType = 'recording';
				renderRecordings(lastResults);
			}
		}).catch(function(err){
			console.error(err);
			showMessage('Error: ' + (err.message || err));
			var note = document.createElement('li');
			note.className = 'collection-item grey-text';
			note.textContent = 'Si veus errors de CORS prova amb curl o desplega a Cordova.';
			$id('results').appendChild(note);
		});
	}

	document.addEventListener('DOMContentLoaded', function(){
		$id('btnSearch').addEventListener('click', doSearch);
		$id('btnClear').addEventListener('click', function(){ $id('query').value = ''; clearResults(); });
		$id('query').addEventListener('keydown', function(e){ if(e.key === 'Enter') doSearch(); });
		updateSizeBadge();
		// Recalculate on resize and re-render with new limits (debounced)
		var resizeTimer = null;
		window.addEventListener('resize', function(){
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function(){
				var prev = document.body.className.match(/size-(small|medium|large)/);
				var prevCat = prev ? prev[0].split('-')[1] : null;
				updateSizeBadge();
				var newCat = getSizeCategory();
				if(newCat !== prevCat){
					reRenderLast();
				}
			}, 150);
		});

		showMessage('Introdueix una cerca i prem "Cercar".');
	});

})();

