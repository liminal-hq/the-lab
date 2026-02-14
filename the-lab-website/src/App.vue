<script setup>
</script>

<template>
  <div class="lab-container">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <header>
      <h1>🧪 The Lab</h1>
      <p>Experimental Projects & Weird Science</p>
    </header>

    <main id="main-content">
      <div class="experiments-grid">
        <a href="./rats-the-video-game/" class="experiment-card">
          <div class="icon">🐀</div>
          <h2>Rats: The Video Game</h2>
          <p>An open-world survival game. Escape the lab. Rule the city.</p>
          <span class="tag">Play Now</span>
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
      <p><a href="https://github.com/liminal-hq/the-lab" target="_blank" rel="noopener noreferrer">View Source on GitHub <span aria-hidden="true">🐀</span></a></p>
    </footer>
  </div>
</template>

<style scoped>
/*
   (\_/)
   (o.o)
   (> <)
*/
.skip-link {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  background: #33ff00;
  color: #000;
  padding: 1rem;
  z-index: 1000;
  font-weight: bold;
  text-decoration: none;
  transition: top 0.3s ease;
  border-radius: 0 0 10px 10px;
}

.skip-link:focus {
  top: 0;
}

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

.experiment-card:hover,
.experiment-card:focus-visible {
  background: rgba(0, 100, 0, 0.5);
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(51, 255, 0, 0.4);
  outline: none; /* Custom focus style handles visibility */
}

.experiment-card:focus-visible {
  border-color: #fff;
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
  opacity: 0.8;
  font-size: 0.8rem;
}

footer a {
  color: #33ff00;
  text-decoration: none;
  border-bottom: 1px dotted #33ff00;
  transition: all 0.3s ease;
}

footer a:hover,
footer a:focus-visible {
  background: rgba(51, 255, 0, 0.2);
  outline: none; /* Custom focus style handles visibility */
}

footer a:focus-visible {
  border-bottom-style: solid;
  font-weight: bold;
}

@media (prefers-reduced-motion: reduce) {
  .experiment-card,
  .experiment-card:hover,
  .experiment-card:focus-visible,
  footer a,
  footer a:hover,
  footer a:focus-visible {
    transition: none;
    transform: none;
  }

  .skip-link {
    transition: none;
  }
}
</style>
