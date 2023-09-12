const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');

// Song titles
const songs = ['i-m-yours', 'lobachevsky', 'poisoning-pigeons', 'fly-me-to-the-moon'];

const volumeSlider = document.getElementById('volume-slider');

// Set the initial volume
audio.volume = volumeSlider.value;

// Update the volume when the slider is changed
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});


// Keep track of song
let songIndex = 2;
let isShuffleMode = false;
let shuffledSongs = [...songs];

// Function to shuffle the songs and update the UI
function shuffleSongs() {
  for (let i = shuffledSongs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
  }
  songIndex = 0;
  loadSong(shuffledSongs[songIndex]);
}

// Initially load song details into DOM
loadSong(songs[songIndex]);

// Update song details
function loadSong(song) {
  title.innerText = song;
  audio.src = `songs/${song}.mp3`;
  cover.src = `Assets/${song}.jpg`;
}

// Play song
function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');

  audio.play();
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');

  audio.pause();
}

// Previous song
function prevSong() {
  if (isShuffleMode) {
    songIndex = (songIndex - 1 + shuffledSongs.length) % shuffledSongs.length;
    loadSong(shuffledSongs[songIndex]);
  } else {
    songIndex--;
    if (songIndex < 0) {
      songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
  }

  playSong();
}

// Next song
function nextSong() {
  if (isShuffleMode) {
    songIndex = (songIndex + 1) % shuffledSongs.length;
    loadSong(shuffledSongs[songIndex]);
  } else {
    songIndex++;
    if (songIndex > songs.length - 1) {
      songIndex = 0;
    }
    loadSong(songs[songIndex]);
  }

  playSong();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

//get duration & currentTime for Time of song
function DurTime(e) {
  const { duration, currentTime } = e.srcElement;
  var sec;
  var sec_d;

  // define minutes currentTime
  let min = (currentTime == null) ? 0 :
    Math.floor(currentTime / 60);
  min = min < 10 ? '0' + min : min;

  // define seconds currentTime
  function get_sec(x) {
    if (Math.floor(x) >= 60) {

      for (var i = 1; i <= 60; i++) {
        if (Math.floor(x) >= (60 * i) && Math.floor(x) < (60 * (i + 1))) {
          sec = Math.floor(x) - (60 * i);
          sec = sec < 10 ? '0' + sec : sec;
        }
      }
    } else {
      sec = Math.floor(x);
      sec = sec < 10 ? '0' + sec : sec;
    }
  }

  get_sec(currentTime, sec);

  // change currentTime DOM
  currTime.innerHTML = min + ':' + sec;

  // define minutes duration
  let min_d = (isNaN(duration) === true) ? '0' :
    Math.floor(duration / 60);
  min_d = min_d < 10 ? '0' + min_d : min_d;

  function get_sec_d(x) {
    if (Math.floor(x) >= 60) {

      for (var i = 1; i <= 60; i++) {
        if (Math.floor(x) >= (60 * i) && Math.floor(x) < (60 * (i + 1))) {
          sec_d = Math.floor(x) - (60 * i);
          sec_d = sec_d < 10 ? '0' + sec_d : sec_d;
        }
      }
    } else {
      sec_d = (isNaN(duration) === true) ? '0' :
        Math.floor(x);
      sec_d = sec_d < 10 ? '0' + sec_d : sec_d;
    }
  }

  // define seconds duration
  get_sec_d(duration);

  // change duration DOM
  durTime.innerHTML = min_d + ':' + sec_d;
};

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);

// Time of song
audio.addEventListener('timeupdate', DurTime);

// Volume Slider
volumeSlider.addEventListener('change', function (e) {
  const volume = e.target.value;
  audio.volume = volume;
});

// volume btn
const volumeBtn = document.getElementById('volume');
volumeBtn.addEventListener('click', function (e) {
  if (audio.muted) {
    audio.muted = false;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else {
    audio.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
});

// repeat button
const repeatBtn = document.getElementById('repeat-btn');
repeatBtn.addEventListener('click', function (e) {
  if (audio.loop) {
    audio.loop = false;
    repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
  } else {
    audio.loop = true;
    repeatBtn.innerHTML = '<i class="fas fa-redo-alt fa-rotate-90"></i>';
  }
});

// Shuffle button
const shuffleBtn = document.getElementById('shuffle-btn');
shuffleBtn.addEventListener('click', function (e) {
  toggleShuffleMode();
  if (isShuffleMode) {
    shuffleSongs();
  }
});

// Update the shuffle button UI
function updateShuffleButtonUI() {
  if (isShuffleMode) {
    shuffleBtn.classList.add('active');
  } else {
    shuffleBtn.classList.remove('active');
  }
}

// Function to toggle shuffle mode
function toggleShuffleMode() {
  isShuffleMode = !isShuffleMode;
  updateShuffleButtonUI();
}
