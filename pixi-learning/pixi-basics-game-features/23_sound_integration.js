// Spin sound, win jingle, bonus music — ZVKY games mein Howler.js use hota hai!
// npm install howler
import { Howl, Howler } from 'howler';

class AudioManager {
  static #instance = null;
  #sounds = new Map();
  #musicVolume = 0.5;
  #sfxVolume = 1.0;
  #muted = false;
  #currentMusic = null;

  static getInstance() {
    if (!AudioManager.#instance) {
      AudioManager.#instance = new AudioManager();
    }
    return AudioManager.#instance;
  }

  load(key, src, options = {}) {
    const sound = new Howl({
      src: [src],
      volume: options.isMusic
        ? this.#musicVolume
        : this.#sfxVolume,
      loop: options.loop || false,
      sprite: options.sprite, // Multiple sounds in one file
    });
    this.#sounds.set(key, sound);
    return sound;
  }

  play(key, options = {}) {
    if (this.#muted) return;
    const sound = this.#sounds.get(key);
    if (!sound) return;
    return sound.play(options.sprite);
  }

  stopAll() {
    this.#sounds.forEach(s => s.stop());
  }

  playMusic(key) {
    if (this.#currentMusic) {
      this.#sounds.get(this.#currentMusic)?.stop();
    }
    this.#currentMusic = key;
    this.play(key);
  }

  setMusicVolume(v) {
    this.#musicVolume = v;
    // Update all music tracks
  }

  toggleMute() {
    this.#muted = !this.#muted;
    Howler.mute(this.#muted);
  }
}

// Use karo
const audio = AudioManager.getInstance();

audio.load('spin',    'audio/spin.mp3');
audio.load('win',     'audio/win.mp3');
audio.load('bigWin',  'audio/big_win.mp3');
audio.load('bonus',   'audio/bonus.mp3');
audio.load('bgMusic', 'audio/bg.mp3', {
  isMusic: true, loop: true
});

// Game events pe play karo
audio.playMusic('bgMusic');
spinBtn.on('click', () => audio.play('spin'));
onWin(() => audio.play('win'));
onBigWin(() => audio.play('bigWin'));
// ZVKY tip: Sprite audio use karo — ek file mein sare sounds = faster loading!