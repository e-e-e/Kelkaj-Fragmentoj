(function (chaptersIn) {
	"use strict";
	
	var chapters = shuffle(chaptersIn);
	var WAIT = 100;
	var chapterIndex = -1;
	var currentChapter = getNextChapter();
	var index = 0;
	var textEndsIn = /(.)\s*(?:<\/em>)?$/;

	document.addEventListener('DOMContentLoaded', loop);

	function shuffle(array) {
		var m = array.length, t, i;
		while (m) {
			i = Math.floor(Math.random() * m--);
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}
		return array;
	}

	function getNextChapter() {
		chapterIndex++;
		if(chapterIndex===chapters.length || chapterIndex < 0) {
			chapters = shuffle(chapters);
			chapterIndex = 0;
			console.log('------');
		}
		console.log(chapterIndex, chapters[chapterIndex].title);
		return chapters[chapterIndex];
	}

	function loop() {
		if(index === currentChapter.script.length) {
			index = 0;
			currentChapter = getNextChapter();
			setSubtitle();
			setTimeout(loop, 2000);
			return;
		}
		var title = currentChapter.title;
		var fragment = currentChapter.script[index];
		index++;

		if(fragment) {
			var i = (fragment.index < 10) ? '0'+ fragment.index : fragment.index;
			if(Math.random() < 0.5) {
				setAudioAndSubtitle(fragment.en,'./voice/'+title+'/eo/'+title+'-'+i+'.mp3');
			} else {
				setAudioAndSubtitle(fragment.eo,'./voice/'+title+'/en/'+title+'-'+i+'.mp3');
			}
		} else {
			setSubtitle();
			setTimeout(loop,1000);
		}
	} 

	function setSubtitle(text) {
		var subtitle = document.getElementById('subtitle');
		if(!text) {
			subtitle.style.opacity = 0;
		} else {
			subtitle.style.opacity = 1.0;
			subtitle.innerHTML = text;
		}
		
	}

	function setAudioAndSubtitle(text,sound) {
		// determine delay
		setSubtitle(text);
		var pause = determinePauseTime(text);
		var audio = new Audio(sound);
		
		// audio.oncanplay = function() { console.timeEnd('load sound'); };
		audio.onended = function() { setTimeout(loop,pause); };
		audio.play();
	} 

	function determinePauseTime(text) {
		var ending = text.match(textEndsIn);
		if(text.match(textEndsIn)!==null) {
			var lastCharacter = ending[1];
			switch (lastCharacter) {
				case ',':
					return 1*WAIT;
				case '-':
				case '–':
				case '—':
				case ';':
					return 2*WAIT;
				case '.':
				case '!':
				case '?':
				case ':':
					return 3*WAIT;
			}
		}
		return 0;
	}
})(document.chapters);