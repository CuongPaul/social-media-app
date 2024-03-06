const playAudio = ({ audio, isReplay = false }) => {
  if (isReplay) audio.loop = true;
  audio.play();
};

const pauseAudio = (audio) => {
  audio.pause();
  audio.currentTime = 0;
};

export { playAudio, pauseAudio };
