use wasm_bindgen::prelude::*;
use rustfft::{FftPlanner, num_complex::Complex};
use serde::Serialize;
use std::f32::consts::PI;

// Enable Canadian spelling for the console if needed, eh?
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[derive(Serialize)]
struct FrameData {
    time: f32,
    channels: Vec<f32>,
}

/// Converts audio samples into a sequence of dominant frequencies.
///
/// # Arguments
/// * `samples` - The audio samples (mono).
/// * `sample_rate` - The sample rate of the audio (e.g., 44100).
/// * `num_channels` - The number of dominant frequencies to extract per frame (1, 4, 8, or 16).
///
/// # Returns
/// A JSON string representing the analysis result.
#[wasm_bindgen]
pub fn convert_audio(samples: &[f32], sample_rate: u32, num_channels: u8) -> String {
    // 125ms per beat/frame
    let window_size_ms = 0.125;
    let chunk_size = (sample_rate as f32 * window_size_ms) as usize;

    let mut planner = FftPlanner::new();
    let fft = planner.plan_fft_forward(chunk_size);

    let mut result_frames = Vec::new();
    let num_chunks = samples.len() / chunk_size;

    for i in 0..num_chunks {
        let start = i * chunk_size;
        let end = start + chunk_size;
        let chunk = &samples[start..end];

        // Prepare input buffer with Hamming window applied to reduce spectral leakage
        let mut buffer: Vec<Complex<f32>> = chunk.iter()
            .enumerate()
            .map(|(n, &sample)| {
                // Hamming window: w[n] = 0.54 - 0.46 * cos(2*pi*n / (N-1))
                let w = 0.54 - 0.46 * ((2.0 * PI * n as f32) / ((chunk_size - 1) as f32)).cos();
                Complex::new(sample * w, 0.0)
            })
            .collect();

        // Process FFT
        fft.process(&mut buffer);

        // Analyze output (only first half needed due to symmetry of real input FFT)
        let half_size = chunk_size / 2;
        let mut magnitudes: Vec<(usize, f32)> = buffer.iter()
            .take(half_size)
            .enumerate()
            .map(|(idx, c)| (idx, c.norm()))
            .collect();

        // Sort by magnitude descending to find peaks
        magnitudes.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));

        // Extract top N frequencies
        let mut top_freqs: Vec<f32> = magnitudes.iter()
            .take(num_channels as usize)
            .map(|(idx, _)| {
                let freq = *idx as f32 * sample_rate as f32 / chunk_size as f32;
                freq
            })
            .collect();

        // Sort frequencies ascending for cleaner output (low to high pitch)
        top_freqs.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));

        result_frames.push(FrameData {
            time: (i as f32 * window_size_ms),
            channels: top_freqs,
        });
    }

    serde_json::to_string(&result_frames).unwrap_or("[]".to_string())
}
