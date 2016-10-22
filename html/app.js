
"use strict";

document.addEventListener('DOMContentLoaded', loop);

var stories = [
	fabelo
];

var WAIT = 100;
var currentStory = getRandomStory();
var index = 0;
var textEndsIn = /(.)\s*(?:<\/em>)?$/;

function getRandomStory() {
	return stories[Math.floor((Math.random()*stories.length))];
}

function loop() {
	if(index === currentStory.script.length) {
		index = 0;
		currentStory = getRandomStory();
		setSubtitle();
		setTimeout(loop, 2000);
		return;
	}
	var title = currentStory.title;
	var fragment = currentStory.script[index];
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
