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
    }

    init() {
        // Waking up the audio context (it was napping in a cardboard box)
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.1; // Keep it low, humans startle easily
            this.masterGain.connect(this.ctx.destination);
        }
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

    playCollect() {
        if (!this.ctx || !this.sfxEnabled) return;
        // A tasty treat!
        //      (\_/)
        //      ( ^.^ )
        //     c( " )o
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine'; // Pure joy
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
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

            } else {
                // SURFACE Theme (Original)
                // Channel 0: Bass (The heavy footsteps of the exterminator... or a fat rat)
                if (beat % 4 === 0) {
                    const note = bassLine[(beat / 4) % bassLine.length];
                    this.playTone(note, 0.2, 0);
                }

                // Channel 1: Lead (Random pentatonic scurrying)
                if (Math.random() > 0.4) {
                    const scale = [440, 523.25, 587.33, 659.25, 783.99, 880];
                    const note = scale[Math.floor(Math.random() * scale.length)];
                    this.playTone(note, 0.1, 1);
                }

                // Channel 2: Squeaks (High pitch gossip)
                if (Math.random() > 0.9) {
                     this.playTone(1500 + Math.random() * 500, 0.05, 2);
                }

                // Channel 3: Noise/Drums (Knocking over trash cans)
                if (beat % 8 === 4) {
                     this.playTone(100, 0.05, 3);
                }
            }

            beat++;
        }, 125);
    }
}
