import init, { convert_audio } from './pkg/rats_music_converter.js';

let audioContext;
let audioBuffer;
let convertedData = null;
let isPlaying = false;
let oscillators = [];
let nextNoteTime = 0;
let playbackInterval;
let playbackStartTime = 0;

const fileInput = document.getElementById('audio-file');
const channelSelect = document.getElementById('channel-count');
const convertBtn = document.getElementById('convert-btn');
const progressBar = document.getElementById('progress-bar');
const statusText = document.getElementById('status-text');
const playBtn = document.getElementById('play-btn');
const stopBtn = document.getElementById('stop-btn');
const downloadBtn = document.getElementById('download-btn');
const resultSection = document.getElementById('result-section');
const statusSection = document.getElementById('status-section');
const visualizerCanvas = document.getElementById('visualizer');
const canvasCtx = visualizerCanvas.getContext('2d');
const durationDisplay = document.getElementById('duration-display');
const framesDisplay = document.getElementById('frames-display');

async function initialize() {
    try {
        await init();
        console.log("WASM Initialized");
    } catch (err) {
        console.error("Failed to initialize WASM:", err);
        statusText.innerText = "Error initializing WASM module.";
        statusSection.classList.remove('hidden');
    }
}

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        convertBtn.disabled = false;
        statusText.innerText = "Ready to convert.";
        statusSection.classList.remove('hidden');
    }
});

convertBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    convertBtn.disabled = true;
    progressBar.value = 10;
    statusText.innerText = "Reading file...";

    try {
        const arrayBuffer = await file.arrayBuffer();
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        statusText.innerText = "Decoding audio...";
        progressBar.value = 30;

        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        statusText.innerText = "Processing FFT in Rust...";
        progressBar.value = 60;

        // Get mono channel data
        const rawData = audioBuffer.getChannelData(0);
        const channels = parseInt(channelSelect.value);
        const sampleRate = audioBuffer.sampleRate;

        // Give UI a moment to update
        setTimeout(() => {
            const jsonResult = convert_audio(rawData, sampleRate, channels);
            convertedData = JSON.parse(jsonResult);

            progressBar.value = 100;
            statusText.innerText = "Conversion Complete!";

            displayResults();
            convertBtn.disabled = false;
        }, 50);

    } catch (err) {
        console.error(err);
        statusText.innerText = "Error during conversion: " + err.message;
        convertBtn.disabled = false;
    }
});

function displayResults() {
    resultSection.classList.remove('hidden');

    // Calculate duration
    const duration = audioBuffer.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
    durationDisplay.innerText = `${minutes}:${seconds}`;

    framesDisplay.innerText = convertedData.length;

    drawVisualizer();
}

function drawVisualizer() {
    // Simple visualizer: Draw a heatmap-like representation of the data
    const width = visualizerCanvas.width = visualizerCanvas.clientWidth;
    const height = visualizerCanvas.height = visualizerCanvas.clientHeight;

    canvasCtx.fillStyle = 'black';
    canvasCtx.fillRect(0, 0, width, height);

    if (!convertedData || convertedData.length === 0) return;

    const frameWidth = width / convertedData.length;

    convertedData.forEach((frame, i) => {
        const x = i * frameWidth;
        frame.channels.forEach(freq => {
            if (freq < 20) return; // Skip sub-bass/DC offset

            // Map freq (approx 20Hz - 20000Hz) to Y position
            // Using log scale for frequency is better visually
            const minFreq = 20;
            const maxFreq = 20000;
            const normalizedFreq = (Math.log(freq) - Math.log(minFreq)) / (Math.log(maxFreq) - Math.log(minFreq));

            const y = height - (normalizedFreq * height);

            canvasCtx.fillStyle = '#33ff00';
            canvasCtx.fillRect(x, y, Math.max(1, frameWidth), 2);
        });
    });
}

playBtn.addEventListener('click', () => {
    if (isPlaying) return;
    if (!convertedData) return;

    startPlayback();
});

stopBtn.addEventListener('click', () => {
    if (!isPlaying) return;
    stopPlayback();
});

function startPlayback() {
    isPlaying = true;
    playBtn.disabled = true;
    stopBtn.disabled = false;

    const frameDuration = 0.125; // 125ms
    const startTime = audioContext.currentTime + 0.1;
    playbackStartTime = startTime;

    // Schedule all oscillators
    // Note: For long files, scheduling everything at once might be heavy.
    // Ideally we'd lookahead schedule. But for this MVP, let's try scheduling chunks or just all if short.
    // Let's do a simple lookahead scheduler.

    nextNoteTime = startTime;
    let currentFrame = 0;

    playbackInterval = setInterval(() => {
        while (nextNoteTime < audioContext.currentTime + 0.5) {
            if (currentFrame >= convertedData.length) {
                stopPlayback();
                return;
            }

            playFrame(convertedData[currentFrame], nextNoteTime, frameDuration);
            nextNoteTime += frameDuration;
            currentFrame++;

            // Update visual marker (rough approximation)
            drawVisualizer();
            const width = visualizerCanvas.width;
            const x = (currentFrame / convertedData.length) * width;
            canvasCtx.fillStyle = 'white';
            canvasCtx.fillRect(x, 0, 2, visualizerCanvas.height);
        }
    }, 100);
}

function playFrame(frame, time, duration) {
    frame.channels.forEach(freq => {
        if (freq < 20 || freq > 20000) return;

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'square'; // NES/Rat-bit style
        osc.frequency.value = freq;

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(time);
        osc.stop(time + duration - 0.01); // slight gap for articulation

        // Envelope to avoid clicks
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration - 0.01);
    });
}

function stopPlayback() {
    isPlaying = false;
    playBtn.disabled = false;
    stopBtn.disabled = true;
    clearInterval(playbackInterval);
    // Oscillators stop themselves based on scheduled stop time,
    // but in a real engine we'd cancel scheduled events.
    // For this MVP, we just let the buffer drain or reload page if stuck.
    // To properly stop, we'd need to track all scheduled nodes.
    // Simple way: suspend context
    audioContext.suspend().then(() => audioContext.resume());

    drawVisualizer(); // Clear playhead
}

downloadBtn.addEventListener('click', () => {
    if (!convertedData) return;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(convertedData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "rats_audio.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

initialize();
