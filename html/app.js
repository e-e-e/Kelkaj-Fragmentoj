(function (chaptersIn) {
	"use strict";
	
	var WAIT = 100;
	var PAUSE = 1000;
	var CHAPTER_PAUSE = 5000;
	var chapters = shuffle(chaptersIn);
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
			setTimeout(loop, CHAPTER_PAUSE);
			return;
		}
		var title = currentChapter.title;
		var fragment = currentChapter.script[index];
		index++;

		if(fragment) {
			var i = (fragment.index < 10) ? '0'+ fragment.index : fragment.index;
			(Math.random() < 0.5)
				? setAudioAndSubtitle(fragment.en,'./voice/eo/'+title+'-'+i+'.mp3') // jshint ignore:line
				: setAudioAndSubtitle(fragment.eo,'./voice/en/'+title+'-'+i+'.mp3'); // jshint ignore:line
		} else {
			setSubtitle();
			setTimeout(loop,PAUSE);
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
		setSubtitle(text);
		var pause = determinePauseTime(text);
		var audio = new Audio(sound);
		audio.onended = function() { setTimeout(loop,pause); };
		audio.play();
	} 

	function determinePauseTime(text) {
		var ending = text.match(textEndsIn);
		if(text.match(textEndsIn)!==null) {
			var lastCharacter = ending[1];
			switch (lastCharacter) {
				case ',':
					return 0.5*WAIT;
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