/**
 * Web Speech API and Web Audio synthesizer for pleasant educational feedback sounds and background music.
 * Completely self-contained: no external audio dependencies, fast, and works seamlessly in modern browsers.
 */

export type MusicTrack = 'off' | 'lofi' | 'focus' | 'ambient';

class AudioEffects {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;
  private musicVolume = 0.22;
  private sfxVolume = 0.28;

  // Background music state
  private currentTrack: MusicTrack = 'off';
  private bgmGainNode: GainNode | null = null;
  private bgmTimer: number | null = null;
  private bgmStep = 0;
  private bgmBaseFreq = 220; // A3

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled && this.currentTrack !== 'off') {
      this.stopMusic();
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmGainNode && this.ctx) {
      this.bgmGainNode.gain.setValueAtTime(this.musicVolume * 0.15, this.ctx.currentTime);
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public getCurrentTrack(): MusicTrack {
    return this.currentTrack;
  }

  /**
   * Play an uplifting, pleasant correct sound (major triad arpeggio)
   */
  public playSuccess() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        const startTime = now + idx * 0.06;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.5, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {
      // Audio playback silently caught
    }
  }

  /**
   * Play a celebratory chime for streaks (3+ in a row)
   */
  public playStreakFanfare() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Bright pentatonic flourish
      const notes = [587.33, 659.25, 880.0, 987.77, 1174.66]; // D5, E5, A5, B5, D6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        const startTime = now + idx * 0.07;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.55, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch {
      // Audio error caught
    }
  }

  /**
   * Play a soft, encouraging gentle error sound (no harsh buzzer)
   */
  public playError() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Gentle low double-blip
      const freqs = [329.63, 261.63]; // E4 -> C4
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        const startTime = now + idx * 0.12;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.45, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    } catch {
      // Audio error ignored
    }
  }

  /**
   * Play a subtle click/selection tone
   */
  public playClick() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);

      gain.gain.setValueAtTime(this.sfxVolume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio error ignored
    }
  }

  /**
   * Play a victory fanfare on quiz or sorting completion
   */
  public playCompletionFanfare() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // C major chord fanfare: C5, G5, C6 with final sustained chord
      const melody = [
        { f: 523.25, t: 0.0, d: 0.15 },
        { f: 659.25, t: 0.15, d: 0.15 },
        { f: 783.99, t: 0.3, d: 0.2 },
        { f: 1046.5, t: 0.5, d: 0.6 },
      ];

      melody.forEach(({ f, t, d }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        const startTime = now + t;
        osc.frequency.setValueAtTime(f, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.6, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + d);
      });
    } catch {
      // Audio error ignored
    }
  }

  /**
   * PROCEDURAL BACKGROUND MUSIC SYNTHESIZER
   * Uses lush soft synthesized chords and rhythmic ambient notes with warm low-pass filter
   */
  public startMusic(track: MusicTrack = 'lofi') {
    if (!this.soundEnabled) return;
    if (track === 'off') {
      this.stopMusic();
      return;
    }

    this.stopMusic();
    this.initCtx();
    if (!this.ctx) return;

    this.currentTrack = track;
    this.bgmGainNode = this.ctx.createGain();
    this.bgmGainNode.gain.setValueAtTime(this.musicVolume * 0.14, this.ctx.currentTime);
    this.bgmGainNode.connect(this.ctx.destination);

    this.bgmStep = 0;

    // Define harmonic chord progressions for learning focus (e.g. Cmaj7 - Am7 - Fmaj7 - G7)
    // track-dependent tempo and scales
    const intervalMs = track === 'lofi' ? 480 : track === 'focus' ? 360 : 700;

    const chordsLofi = [
      // Cmaj7 (C3, G3, B3, E4)
      [130.81, 196.0, 246.94, 329.63],
      // Am7 (A2, E3, G3, C4)
      [110.0, 164.81, 196.0, 261.63],
      // Fmaj7 (F2, C3, E3, A3)
      [87.31, 130.81, 164.81, 220.0],
      // G6 (G2, D3, B3, E4)
      [98.0, 146.83, 246.94, 329.63],
    ];

    const chordsFocus = [
      // Dm7 -> G9 -> Cmaj7 -> A7
      [146.83, 220.0, 261.63, 349.23],
      [98.0, 146.83, 246.94, 293.66],
      [130.81, 196.0, 246.94, 329.63],
      [110.0, 164.81, 220.0, 277.18],
    ];

    const chordsAmbient = [
      // Atmospheric floating pads: Emaj9 -> Amaj9
      [82.41, 164.81, 246.94, 311.13, 392.0],
      [110.0, 164.81, 220.0, 277.18, 329.63],
    ];

    const currentProgression =
      track === 'focus' ? chordsFocus : track === 'ambient' ? chordsAmbient : chordsLofi;

    const playStep = () => {
      if (!this.ctx || this.currentTrack === 'off' || !this.bgmGainNode) return;

      const chordIndex = Math.floor(this.bgmStep / 8) % currentProgression.length;
      const subStep = this.bgmStep % 8;
      const chord = currentProgression[chordIndex];

      const now = this.ctx.currentTime;

      // On step 0 of chord: trigger soft warm pad bass / harmony
      if (subStep === 0) {
        chord.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const filter = this.ctx!.createBiquadFilter();

          osc.type = idx === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, now);

          const dur = (intervalMs * 7.5) / 1000;
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.bgmGainNode!);

          osc.start(now);
          osc.stop(now + dur);
        });
      }

      // Arpeggiated melody note on certain beats for pleasant study rhythm
      if (subStep === 0 || subStep === 2 || subStep === 4 || subStep === 6) {
        const noteFreq = chord[(subStep / 2) % chord.length] * 2; // one octave higher
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, now);

        const dur = (intervalMs * 1.5) / 1000;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        osc.connect(gain);
        gain.connect(this.bgmGainNode);

        osc.start(now);
        osc.stop(now + dur);
      }

      this.bgmStep++;
    };

    // Play first step immediately
    playStep();
    this.bgmTimer = window.setInterval(playStep, intervalMs);
  }

  public stopMusic() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.bgmGainNode && this.ctx) {
      try {
        this.bgmGainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      } catch {
        // Ignored
      }
    }
    this.currentTrack = 'off';
    this.bgmStep = 0;
  }

  public toggleMusic(track: MusicTrack = 'lofi'): MusicTrack {
    if (this.currentTrack !== 'off') {
      this.stopMusic();
      return 'off';
    } else {
      this.startMusic(track);
      return track;
    }
  }

  public speak(text: string, lang = 'en-US') {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.92; // Slightly measured rate for A2 learners
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis error ignored
    }
  }
}

export const soundManager = new AudioEffects();

