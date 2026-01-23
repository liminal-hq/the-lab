<script setup>
</script>

<template>
  <div class="lab-container">
    <header>
      <h1>🧪 The Lab</h1>
      <p>Experimental Projects & Weird Science</p>
    </header>

    <main>
      <div class="experiments-grid">
        <a href="./rats-the-video-game/" class="experiment-card">
          <div class="icon">🐀</div>
          <h2>Rats: The Video Game</h2>
          <p>An open-world survival game. Escape the lab. Rule the city.</p>
          <span class="tag">Play Now</span>
        </a>

        <a href="./rats-music-converter/" class="experiment-card">
          <div class="icon">🎵</div>
          <h2>Rats Music Converter</h2>
          <p>Turn high-fidelity audio into 16-channel Rat-Bit masterpieces.</p>
          <span class="tag">Convert Now</span>
        </a>

        <div class="experiment-card placeholder">
          <div class="icon">🚧</div>
          <h2>More Coming Soon</h2>
          <p>The scientists are hard at work.</p>
        </div>
      </div>
    </main>

    <footer>
      <p>© The Lab - Canadian Spelling Enforced</p>
    </footer>
  </div>
</template>

<style scoped>
.lab-container {
  font-family: 'Courier New', Courier, monospace;
  color: #33ff00;
  background-color: #000;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

header h1 {
  font-size: 4rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px #33ff00;
}

header p {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0.8;
}

.experiments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.experiment-card {
  border: 2px solid #33ff00;
  padding: 2rem;
  border-radius: 10px;
  background: rgba(0, 50, 0, 0.3);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.experiment-card:hover {
  background: rgba(0, 100, 0, 0.5);
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(51, 255, 0, 0.4);
}

.icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.tag {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #33ff00;
  color: #000;
  font-weight: bold;
  border-radius: 5px;
}

.placeholder {
  opacity: 0.5;
  border-style: dashed;
}

footer {
  margin-top: 4rem;
  opacity: 0.5;
  font-size: 0.8rem;
}
</style>
