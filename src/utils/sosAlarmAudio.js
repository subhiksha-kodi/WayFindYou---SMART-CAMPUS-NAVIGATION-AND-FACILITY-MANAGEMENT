// src/utils/sosAlarmAudio.js
// Web Audio API emergency siren alarm generator for browser alerts

let audioCtx = null;
let isPlaying = false;
let intervalId = null;

export function startEmergencySirenSound() {
  if (isPlaying) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioCtx = new AudioContext();
    isPlaying = true;

    let highPitch = true;

    const playTone = () => {
      if (!isPlaying || !audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      // Alternating high & low emergency siren pitch (880Hz & 550Hz)
      osc.frequency.setValueAtTime(highPitch ? 880 : 550, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);

      highPitch = !highPitch;
    };

    playTone();
    intervalId = setInterval(playTone, 400);
  } catch (err) {
    console.warn('Unable to initialize emergency siren sound context:', err);
  }
}

export function stopEmergencySirenSound() {
  isPlaying = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (audioCtx) {
    try {
      audioCtx.close();
    } catch (e) {
      // ignore
    }
    audioCtx = null;
  }
}
