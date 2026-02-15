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
struct ChannelData {
    freq: f32,
    amp: f32,
}

#[derive(Serialize)]
struct FrameData {
    time: f32,
    channels: Vec<ChannelData>,
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
    if sample_rate == 0 {
        return "[]".to_string();
    }
    let chunk_size = (sample_rate as f32 * window_size_ms) as usize;
    if chunk_size < 2 {
        return "[]".to_string();
    }

    let mut planner = FftPlanner::new();
    let fft = planner.plan_fft_forward(chunk_size);

    let mut result_frames = Vec::new();
    let num_chunks = samples.len() / chunk_size;
    let channel_limit = num_channels.clamp(1, 16) as usize;
    let min_freq = 20.0;
    let max_freq = 20_000.0;

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
            .filter_map(|(idx, c)| {
                if idx == 0 {
                    return None;
                }
                let freq = idx as f32 * sample_rate as f32 / chunk_size as f32;
                if freq < min_freq || freq > max_freq {
                    return None;
                }
                Some((idx, c.norm()))
            })
            .collect();

        // Sort by magnitude descending to find peaks
        magnitudes.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));
        let max_mag = magnitudes
            .iter()
            .map(|(_, mag)| *mag)
            .fold(0.0, f32::max);

        // Extract top N frequencies
        let mut top_freqs: Vec<ChannelData> = magnitudes.iter()
            .take(channel_limit)
            .map(|(idx, mag)| {
                let freq = *idx as f32 * sample_rate as f32 / chunk_size as f32;
                let amp = if max_mag > 0.0 {
                    (mag / max_mag).sqrt().min(1.0)
                } else {
                    0.0
                };
                ChannelData { freq, amp }
            })
            .collect();

        // Sort frequencies ascending for cleaner output (low to high pitch)
        top_freqs.sort_by(|a, b| a.freq.partial_cmp(&b.freq).unwrap_or(std::cmp::Ordering::Equal));

        result_frames.push(FrameData {
            time: (i as f32 * window_size_ms),
            channels: top_freqs,
        });
    }

    serde_json::to_string(&result_frames).unwrap_or("[]".to_string())
}
