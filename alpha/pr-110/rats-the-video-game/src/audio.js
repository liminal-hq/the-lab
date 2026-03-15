// --------------------------------------------------------------------------
//  THE AUDIO ENGINE (or "The Squeak Synthesizer")
// --------------------------------------------------------------------------
//  Generates the sounds of the city. The beautiful, chaotic noise.
//
//      ~~(  )
//     ( o.o)  <-- "Turn it up!"
//      >  <
// --------------------------------------------------------------------------

export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.channels = []; // Channels of communication (like sewer pipes)
        this.numChannels = 16; // 16 channels of pure 8-bit bliss
        this.isPlaying = false;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.musicInterval = null;
        this.level = 'SURFACE';
        // Saved for the third level after the subway unlocks.
        // The motifs are staged here, but the level branch stays disabled until the route exists.
        this.futureThirdLevelMotifs = Object.freeze({
            construction: {
                lead: [392, 440, 523.25, 587.33, 698.46],
                bass: [98, 123.47, 146.83, 196],
                drumBeat: 8
            },
            industrial: {
                lead: [220, 261.63, 311.13, 329.63, 392],
                bass: [55, 73.42, 82.41, 98],
                drumBeat: 4
            }
        });
        this.cycle = 0;
    }

    init() {
        // Waking up the audio context (it was napping in a cardboard box)
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.1; // Keep it low, humans startle easily

            // Compressor to prevent loud squeaks from causing distortion
            if (this.ctx.createDynamicsCompressor) {
                this.compressor = this.ctx.createDynamicsCompressor();
                this.compressor.threshold.setValueAtTime(-20, this.ctx.currentTime);
                this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
                this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
                this.compressor.attack.setValueAtTime(0, this.ctx.currentTime);
                this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

                this.masterGain.connect(this.compressor);
                this.compressor.connect(this.ctx.destination);
            } else {
                this.masterGain.connect(this.ctx.destination);
            }
        }
    }

    setCycle(cycle) {
        this.cycle = cycle;
    }

    playTone(frequency, duration, channelIdx = 0) {
        if (!this.ctx || !this.musicEnabled) return; // No ears to hear? No sound to make.

        // Creating a temporary oscillator (a brief squeak in the void)
        // We don't strictly reuse oscillators here because... well, rats are messy.
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square'; // Square waves are the crunchiest. Like stale bread.
        osc.frequency.value = frequency;

        osc.connect(gain);
        gain.connect(this.masterGain);

        // Envelope: Attack -> Decay (Quick in, quick out, like stealing a crumb)
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    }

    playHappySqueak() {
        if (!this.ctx || !this.sfxEnabled) return;
        // A happy little squeak!
        //      (\_/)
        //      ( ^.^ )
        const now = this.ctx.currentTime;
        // Arpeggio
        [880, 1108, 1318].forEach((freq, i) => { // A5, C#6, E6
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.value = freq;

            osc.connect(gain);
            gain.connect(this.masterGain);

            gain.gain.setValueAtTime(0.1, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.1);

            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.1);
        });
    }

    playChew() {
        if (!this.ctx || !this.sfxEnabled) return;
        // The sound of cardboard destruction
        //      (\_/)
        //      ( 'x')
        //      c(" ")(" ")
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth'; // Gritty, like the fibre in our diet
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playTrashChew() {
        if (!this.ctx || !this.sfxEnabled) return;
        // The sound of delicious garbage
        //      (\_/)
        //      ($.$)
        //      (> <)

        // Two oscillators create a rougher "crinkle" texture than cardboard.
        [100, 140].forEach((startFreq) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(startFreq * 0.5, this.ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(this.masterGain);

            gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.15);
        });
    }

    playSnap() {
        if (!this.ctx || !this.sfxEnabled) return;
        // The sound of danger!
        //      / \
        //     / ! \
        //    /_____\
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle'; // Sharp, like a trap's behaviour
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.2);
    }

    playSpark() {
        if (!this.ctx || !this.sfxEnabled) return;
        // ZZZZT! The sound of electricity finding a path through a small rodent
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        // Rapid frequency modulation for that zapping sound
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1000, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playHonk() {
        if (!this.ctx || !this.sfxEnabled) return;
        // BEEP! Get out of the road!
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square'; // Harsh city sound
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.2);
    }

    playCollect() {
        if (!this.ctx || !this.sfxEnabled) return;
        // The sound of pure joy (Pizza!)
        //      (\_/)
        //      ( ^.^ )
        //      c(")_(")
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine'; // Smooth and tasty
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    playSlurp() {
        if (!this.ctx || !this.sfxEnabled) return;
        // The sound of caffeine hitting the bloodstream
        //      (o_o) -> (O_O)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.2);
    }

    playBoing() {
        if (!this.ctx || !this.sfxEnabled) return;
        // BOING! The sound of a rat defying gravity
        //      o
        //     /|\
        //     / \
        //    ~~~~
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        // A quick sweep up then wobble
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(400, now + 0.1);
        osc.frequency.linearRampToValueAtTime(300, now + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    playDoubleJump() {
        if (!this.ctx || !this.sfxEnabled) return;
        // A lighter, quicker squeak for the air jump.
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.1);
    }

    setLevel(level) {
        this.level = level;
    }

    stopMusic() {
        this.isPlaying = false;
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
    }

    startMusic() {
        if (this.isPlaying || !this.musicEnabled) return;

        // Ensure we don't have lingering intervals
        this.stopMusic();

        this.isPlaying = true;
        this.init();

        // Rats theme: chaotic, minor key, urgent.
        // The song of our people.
        //      __
        //  ___( o)>  *Singing*
        //  \ <_. )
        //   `---'
        const bassLine = [110, 110, 146.83, 146.83, 98, 98, 130.81, 130.81]; // A2... Deep rumblings
        let beat = 0;

        this.musicInterval = setInterval(() => {
            if (!this.isPlaying) return;

            if (this.level === 'SUBWAY') {
                // Subway Theme: Darker, slower feel (Half time feel on bass)
                if (beat % 8 === 0) {
                     // Lower bass
                     const note = bassLine[(beat / 8) % bassLine.length] / 2;
                     this.playTone(note, 0.4, 0);
                }

                // Echoey lead
                if (Math.random() > 0.6) {
                    const scale = [220, 261.63, 311.13, 329.63, 392]; // Am / C pentatonic ish
                    const note = scale[Math.floor(Math.random() * scale.length)];
                    this.playTone(note, 0.2, 1);
                }

                // Train clatter?
                if (beat % 16 === 12) {
                     this.playTone(80, 0.1, 3);
                     setTimeout(() => this.playTone(70, 0.1, 3), 100);
                }

            } else if (this.level === 'THIRD_LEVEL') {
                // Saved for the future third level after the subway.
                // We are parking the motif work from the cleanup queue here until the route is enabled.
                const motif = beat < 64
                    ? this.futureThirdLevelMotifs.construction
                    : this.futureThirdLevelMotifs.industrial;

                if (beat % motif.drumBeat === 0) {
                    const bass = motif.bass[(beat / motif.drumBeat) % motif.bass.length];
                    this.playTone(bass, 0.2, 0);
                }

                if (Math.random() > 0.35) {
                    const lead = motif.lead[Math.floor(Math.random() * motif.lead.length)];
                    this.playTone(lead, 0.12, 1);
                }

                if (beat % motif.drumBeat === motif.drumBeat / 2) {
                    this.playTone(90, 0.05, 3);
                }
            } else {
                // SURFACE Theme with District Variations

                let currentScale = [440, 523.25, 587.33, 659.25, 783.99, 880]; // Am pentatonic (Burbs)
                let bassNoteMod = 1;
                let squeakFreqMod = 0;
                let beatDrums = false;

                if (this.cycle >= 17) {
                    // Industrial (Red, harder): Dissonant, faster bass, heavy drums
                    currentScale = [440, 466.16, 554.37, 622.25, 739.99, 880]; // Phrygian dominant feel
                    bassNoteMod = 0.5; // lower pitch bass
                    squeakFreqMod = 1000; // more high pitched chaos
                    beatDrums = beat % 4 === 2; // faster drums
                } else if (this.cycle >= 9) {
                    // Downtown (Blue, moderate): More minor, busy
                    currentScale = [440, 493.88, 523.25, 587.33, 659.25, 783.99, 880]; // Aeolian
                    squeakFreqMod = 500;
                    beatDrums = beat % 8 === 4;
                } else {
                    // Burbs (Green, safer) - default
                    beatDrums = beat % 8 === 4;
                }

                // Channel 0: Bass
                if (beat % 4 === 0) {
                    const note = bassLine[(beat / 4) % bassLine.length] * bassNoteMod;
                    this.playTone(note, 0.2, 0);
                }

                // Channel 1: Lead
                if (Math.random() > 0.4) {
                    const note = currentScale[Math.floor(Math.random() * currentScale.length)];
                    this.playTone(note, 0.1, 1);
                }

                // Channel 2: Squeaks
                if (Math.random() > 0.9) {
                     this.playTone(1500 + squeakFreqMod + Math.random() * 500, 0.05, 2);
                }

                // Channel 3: Noise/Drums
                if (beatDrums) {
                     this.playTone(100, 0.05, 3);
                }
            }

            beat++;
        }, 125);
    }
}
