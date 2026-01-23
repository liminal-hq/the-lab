export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.channels = [];
        this.numChannels = 16;
        this.isPlaying = false;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.1;
            this.masterGain.connect(this.ctx.destination);
        }
    }

    playTone(frequency, duration, channelIdx = 0) {
        if (!this.ctx) return;
        // In this simple implementation, we create a new oscillator for each note.
        // The channelIdx argument mimics the limited channels concept but we don't strictly reuse oscillators here to avoid clicking/management complexity in this demo.

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.value = frequency;

        osc.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    }

    startMusic() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.init();

        // Rats theme: chaotic, minor key, urgent
        const bassLine = [110, 110, 146.83, 146.83, 98, 98, 130.81, 130.81]; // A2...
        let beat = 0;

        setInterval(() => {
            if (!this.isPlaying) return;

            // Channel 0: Bass
            if (beat % 4 === 0) {
                const note = bassLine[(beat / 4) % bassLine.length];
                this.playTone(note, 0.2, 0);
            }

            // Channel 1: Lead (Random pentatonic)
            if (Math.random() > 0.4) {
                const scale = [440, 523.25, 587.33, 659.25, 783.99, 880];
                const note = scale[Math.floor(Math.random() * scale.length)];
                this.playTone(note, 0.1, 1);
            }

            // Channel 2: Squeaks (High pitch)
            if (Math.random() > 0.9) {
                 this.playTone(1500 + Math.random() * 500, 0.05, 2);
            }

            // Channel 3: Noise/Drums
            if (beat % 8 === 4) {
                 this.playTone(100, 0.05, 3);
            }

            beat++;
        }, 125);
    }
}
