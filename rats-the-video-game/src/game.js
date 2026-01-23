import { AudioEngine } from './audio.js';
import { GraphicsEngine } from './graphics.js';

// ~~~ The Great Rat Control Center ~~~
// Where all the squeaking happens.
const canvas = document.getElementById('gameCanvas');

const audio = new AudioEngine();
const graphics = new GraphicsEngine(canvas);

// Resize logic to keep the rat world fitting snugly
//      __             _
//   .-'  `.  _  __  .' `.
//   :      \/ \/  \/     :
//    \                   /
//     `-.._  _  _  _..-'
//          `' `' `'
function resize() {
    const overlay = document.getElementById('overlay');
    // Account for overlay height + margins (10 top + 10 bottom)
    const overlayHeight = overlay ? overlay.offsetHeight + 20 : 100;

    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerHeight - overlayHeight - 30; // Extra buffer

    if (canvas.height < 150) canvas.height = 150; // Minimum height for rat activities

    // Update graphics engine dimensions
    if (graphics) {
        graphics.width = canvas.width;
        graphics.height = canvas.height;
    }
}

window.addEventListener('resize', resize);
resize();

// Game State: The Brain of the Rat
//      (\,/)
//      (o.o)
//     ( > < )
const state = {
    rat: { x: 100, y: 0, vx: 0, vy: 0, grounded: true, facingRight: true }, // The protagonist
    buildings: [], // The concrete jungle
    obstacles: [], // The things in our way
    birds: [], // Sky vermin
    turds: [], // Aerial projectiles
    score: 0, // Chewed items count
    frameCount: 0, // Debug timer
    input: { left: false, right: false, jump: false, chew: false }, // The human commands
    level: 'SURFACE', // SURFACE or SUBWAY
    levelCompleted: false
};

// Procedural Generation: Building the Maze
// "The city is a maze, and we are the masters." - Rat Proverb
function generateLevel() {
    state.buildings = [];
    state.obstacles = [];
    state.birds = [];
    state.turds = [];
    state.rat.x = 100;
    state.rat.vx = 0;
    state.rat.vy = 0;
    state.levelCompleted = false;

    if (audio && audio.setLevel) {
        audio.setLevel(state.level);
    }

    if (state.level === 'SURFACE') {
        generateSurface();
    } else {
        generateSubway();
    }
}

function generateSurface() {
    let x = 0;
    // Generate a long city (plenty of hiding spots)
    // Decreased to 25 for a shorter level
    for (let i = 0; i < 25; i++) {
        const w = 100 + Math.random() * 200;
        const h = 100 + Math.random() * (canvas.height - 200);
        // Coloured like the gloom of night
        state.buildings.push({ x, w, h, color: `hsl(${Math.random() * 360}, 20%, 30%)` });

        // Decorations
        if (i === 2) {
            // Welcome sign early on
            state.obstacles.push({ x: x + 20, w: 10, h: 10, type: 'SIGN_CITY' });
        }
        if (i === 10) { // Moved closer
            // Barzini's somewhere
            state.obstacles.push({ x: x + 20, w: 10, h: 10, type: 'BARZINIS' });
        }

        // Random Obstacles in the alleys
        //      _  _
        //     ( \/ )  <-- "Watch your step!"
        //      \  /
        const gap = Math.random() * 50 + 50; // Ensure enough space
        if (Math.random() < 0.4) {
            const obsX = x + w + gap / 2 - 15; // Center in the gap
            const rand = Math.random();

            if (rand < 0.4) {
                // A Box to chew
                state.obstacles.push({ x: obsX, w: 30, h: 30, type: 'BOX' });
            } else if (rand < 0.7) {
                // A Trap to jump
                state.obstacles.push({ x: obsX, w: 40, h: 10, type: 'TRAP' });
            } else {
                // Prius!
                state.obstacles.push({ x: obsX - 25, w: 80, h: 40, type: 'PRIUS' });
            }
        }
        x += w + gap;
    }
    // Subway entrance at the end
    state.obstacles.push({ x: x + 100, w: 60, h: 80, type: 'SUBWAY_ENTRANCE' });

    // Initial birds
    for(let i=0; i<5; i++) {
        state.birds.push({
            x: Math.random() * 2000,
            y: Math.random() * (canvas.height/2),
            speed: 1 + Math.random() * 2
        });
    }
}

function generateSubway() {
    let x = 0;
    // Generate subway tunnel
    for (let i = 0; i < 200; i++) {
        const w = 300 + Math.random() * 200;
        // In subway, buildings are just walls/pillars in background
        state.buildings.push({ x, w, h: canvas.height, color: '#111', type: 'TUNNEL' });

        // Obstacles on tracks
        if (Math.random() < 0.6) {
             const obsX = x + w/2;
             if (Math.random() < 0.5) {
                 state.obstacles.push({ x: obsX, w: 40, h: 30, type: 'TRASH_PILE' });
             } else {
                 state.obstacles.push({ x: obsX, w: 120, h: 5, type: 'THIRD_RAIL' });
             }
        }
        x += w;
    }
}

generateLevel();

// Input: Translating human fingers to rat paws
window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') state.input.right = true; // Scurry right
    if (e.code === 'ArrowLeft') state.input.left = true;   // Scurry left
    if (e.code === 'Space') {
        state.input.jump = true; // LEAP!
        if (!audio.isPlaying) audio.startMusic(); // Cue the dramatic squeaks
    }
    if (e.code === 'Enter' || e.code === 'KeyC') state.input.chew = true; // GNAW!
    if (e.code === 'KeyS') audio.playHappySqueak(); // SQUEAK!
    if (e.key === '?') {
        if (window.game && window.game.toggleHelp) window.game.toggleHelp();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight') state.input.right = false;
    if (e.code === 'ArrowLeft') state.input.left = false;
    if (e.code === 'Space') state.input.jump = false;
    if (e.code === 'Enter' || e.code === 'KeyC') state.input.chew = false;
});

// Audio Toggles
window.game = window.game || {};
window.game.toggleMusic = (enabled) => {
    audio.musicEnabled = enabled;
    if (!enabled) audio.stopMusic();
    else if (!audio.isPlaying) audio.startMusic();
};
window.game.toggleSfx = (enabled) => {
    audio.sfxEnabled = enabled;
};

// Touch Input: For the modern rat on the go
let lastTouchDebug = { x: 0, count: 0 };
const activeSwipes = new Map(); // Track swipe start positions: identifier -> startY

function handleTouch(e) {
    // Ignore touches on UI elements (like the tutorial modal buttons)
    if (e.target.closest('#tutorial-modal') || e.target.closest('button')) {
        return;
    }

    e.preventDefault(); // Prevent scrolling/zooming

    lastTouchDebug.count = e.touches.length;

    let touchesOnLeft = 0;
    let touchesOnRight = 0;
    const width = window.innerWidth;

    // Track active touches to clean up activeSwipes
    const currentTouchIds = new Set();

    // Count touches in each zone & Handle Swipes
    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const x = touch.clientX;
        const y = touch.clientY;
        const id = touch.identifier;

        currentTouchIds.add(id);
        lastTouchDebug.x = x; // Track last touch for debug

        // Swipe Detection
        if (!activeSwipes.has(id)) {
            // New touch tracking for swipe
            activeSwipes.set(id, { startY: y, startTime: Date.now(), hasJumped: false });
        } else {
            const swipeData = activeSwipes.get(id);
            const deltaY = y - swipeData.startY;
            const timeDiff = Date.now() - swipeData.startTime;

            // Velocity Calculation (pixels per ms)
            // Negative velocity means moving UP
            const velocity = timeDiff > 0 ? deltaY / timeDiff : 0;

            // Jump Trigger Logic
            // 1. Distance Threshold: Moved up significantly (> 30px)
            // 2. Velocity Threshold: Fast flick (> 0.5px/ms) with minimal distance (> 15px)
            const isSwipeUp = (deltaY < -30) || (velocity < -0.5 && deltaY < -15);

            if (!swipeData.hasJumped && isSwipeUp) {
                // SWIPE UP DETECTED!
                state.input.jump = true;
                setTimeout(() => { state.input.jump = false; }, 100);

                swipeData.hasJumped = true;
            }

            // Reset jump flag if they move back down or stop moving up
            if (deltaY > -10) {
                swipeData.hasJumped = false;
                swipeData.startY = y; // Re-anchor
                swipeData.startTime = Date.now();
            }
        }

        if (x < width * 0.5) {
            touchesOnLeft++;
        } else {
            touchesOnRight++;
        }
    }

    // Cleanup ended touches
    for (const [id] of activeSwipes) {
        if (!currentTouchIds.has(id)) {
            activeSwipes.delete(id);
        }
    }

    // Input Logic with Hysteresis / Priority
    // This allows "Hold Left + Tap Right to Jump" without stopping movement
    if (touchesOnLeft > 0 && touchesOnRight === 0) {
        state.input.left = true;
        state.input.right = false;
    } else if (touchesOnRight > 0 && touchesOnLeft === 0) {
        state.input.left = false;
        state.input.right = true;
    } else if (touchesOnLeft > 0 && touchesOnRight > 0) {
        // Conflict detected (Touches on both sides)
        // Prioritize maintaining the current direction to allow for "Tap to Jump"
        // without interrupting movement.
        if (state.input.left) {
            // We were moving Left, keep moving Left
            state.input.right = false;
        } else if (state.input.right) {
            // We were moving Right, keep moving Right
            state.input.left = false;
        } else {
            // If strictly neutral before, default to Left (rare case)
            state.input.left = true;
            state.input.right = false;
        }
    } else {
        // No touches
        state.input.left = false;
        state.input.right = false;
    }

    // Start music on first interaction
    if (e.touches.length > 0 && !audio.isPlaying) {
        audio.startMusic();
    }
}

// Handle Jump separately on touchstart (Tap anywhere)
function handleJumpTap(e) {
    if (e.target.closest('#tutorial-modal') || e.target.closest('button')) return;

    // Trigger jump
    state.input.jump = true;

    // Reset jump input after a short delay to prevent "flying" if logic requires toggle
    // But game loop checks `state.input.jump` every frame.
    // We need to ensure it's true for at least one update.
    setTimeout(() => {
        state.input.jump = false;
    }, 100);
}

window.addEventListener('touchstart', (e) => {
    handleTouch(e);
    handleJumpTap(e);
}, { passive: false });

window.addEventListener('touchmove', handleTouch, { passive: false });

window.addEventListener('touchend', (e) => {
    handleTouch(e);
    // Ensure movement cleared if no touches
    if (e.touches.length === 0) {
        state.input.left = false;
        state.input.right = false;
        // Jump is auto-cleared by timeout
    }
}, { passive: false });

// Physics Constants (Rat Physics 101)
const GRAVITY = 0.8;      // What goes up, must come down (unless it climbs)
const SPEED = 5;          // Maximum scurrying velocity
const JUMP_FORCE = 15;    // The power of the hind legs

function update() {
    state.frameCount++;

    // Movement Logic
    if (state.input.right) {
        state.rat.vx = SPEED;
        state.rat.facingRight = true;
    } else if (state.input.left) {
        state.rat.vx = -SPEED;
        state.rat.facingRight = false;
    } else if (state.rat.grounded) {
        // Friction / Decaying momentum (Only when grounded to preserve jump arc)
        state.rat.vx *= 0.8;
        if (Math.abs(state.rat.vx) < 0.5) state.rat.vx = 0; // Resting whiskers
    }

    // Jump Logic
    if (state.input.jump && state.rat.grounded) {
        state.rat.vy = JUMP_FORCE;
        state.rat.grounded = false;
        audio.playTone(660, 0.1, 15); // *Squeak!* (Jump sound)
    }

    // Gravity: The invisible paw pushing us down
    state.rat.vy -= GRAVITY;
    state.rat.x += state.rat.vx;
    state.rat.y += state.rat.vy;

    // Obstacle Collision
    const ratL = state.rat.x - 15; // Body width approx
    const ratR = state.rat.x + 15;
    const ratB = state.rat.y;
    const ratT = state.rat.y + 20;

    for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        const obsL = obs.x;
        const obsR = obs.x + obs.w;
        const obsT = obs.h;

        // Visual only objects (don't collide)
        if (obs.type === 'SIGN_CITY' || obs.type === 'BARZINIS') continue;

        // Simple AABB overlap check
        if (ratR > obsL && ratL < obsR && ratB < obsT) {
             if (obs.type === 'BOX' || obs.type === 'PRIUS' || obs.type === 'TRASH_PILE') {
                 if (state.input.chew) {
                     // Nom nom nom
                     state.obstacles.splice(i, 1);
                     state.score++; // Delicious
                     audio.playChew();
                     if (obs.type === 'PRIUS') audio.playHonk(); // Angry driver?
                 } else {
                     // Solid wall logic
                     // We check overlap on the X axis specifically to push out
                     const overlapXLeft = ratR - obsL; // How far right we are inside left edge
                     const overlapXRight = obsR - ratL; // How far left we are inside right edge
                     const overlapY = obsT - ratB;     // How far down we are inside the top edge

                     // Landing Logic:
                     // If we are falling (or flat) and the vertical overlap is small (we just hit the top)
                     // AND vertical overlap is "shallower" than horizontal penetration (meaning we hit the top, not the side)
                     if (state.rat.vy <= 0 && overlapY > 0 && overlapY < 20 && overlapY < Math.min(overlapXLeft, overlapXRight)) {
                         state.rat.y = obsT;
                         state.rat.vy = 0;
                         state.rat.grounded = true;
                     } else {
                         // Wall Logic: Push to closest side
                         if (overlapXLeft < overlapXRight) {
                             // Closer to left side -> push left
                             if (state.rat.vx > 0) state.rat.vx = 0;
                             state.rat.x = obsL - 15;
                         } else {
                             // Closer to right side -> push right
                             if (state.rat.vx < 0) state.rat.vx = 0;
                             state.rat.x = obsR + 15;
                         }
                     }
                 }
             } else if (obs.type === 'TRAP' || obs.type === 'THIRD_RAIL') {
                 // SNAP! or ZAP!
                 //      \ | /
                 //     - X -  <-- Pain
                 //      / | \
                 if (obs.type === 'THIRD_RAIL') audio.playSpark();
                 else audio.playSnap();

                 // Bounce back
                 state.rat.vy = 10;
                 state.rat.vx = state.rat.facingRight ? -10 : 10;
                 state.rat.grounded = false;
             } else if (obs.type === 'SUBWAY_ENTRANCE') {
                 if (!state.levelCompleted) {
                     state.levelCompleted = true;
                     state.level = 'SUBWAY';
                     generateLevel(); // Transition!
                     return; // Skip rest of update frame
                 }
             }
        }
    }

    // Floor collision (The streets)
    if (state.rat.y <= 0) {
        state.rat.y = 0;
        state.rat.vy = 0;
        state.rat.grounded = true;
    }

    // Update Birds
    state.birds.forEach(bird => {
        bird.x -= bird.speed;
        if (bird.x < state.rat.x - 500) {
            bird.x = state.rat.x + 500 + Math.random() * 500;
            bird.y = Math.random() * (canvas.height / 2);
        }

        // Drop Turd Logic (Aerial Attacks)
        // Only drop if bird is roughly on screen (close to rat)
        if (Math.abs(bird.x - state.rat.x) < 500 && Math.random() < 0.005) {
             state.turds.push({ x: bird.x, y: bird.y, vy: 0 });
        }
    });

    // Update Turds (Physics & Collision)
    for (let i = state.turds.length - 1; i >= 0; i--) {
        const turd = state.turds[i];
        turd.vy -= GRAVITY * 0.2; // Gravity pulls down (negative Y)
        turd.y += turd.vy;

        // Ground collision (splat)
        if (turd.y < 0) {
            state.turds.splice(i, 1);
            continue;
        }

        // Rat Collision
        // Simple circle/box check
        if (state.rat.x < turd.x + 5 && state.rat.x + 30 > turd.x &&
            state.rat.y < turd.y + 5 && state.rat.y + 20 > turd.y) {

             // HIT!
             state.score = Math.max(0, state.score - 5); // Penalty
             audio.playSnap(); // Ouch sound (reuse snap for now)
             state.turds.splice(i, 1);
        }
    }

    // Camera follow (keep our hero in the spotlight)
    // <( )_
    //  (   )
    graphics.cameraX = state.rat.x - canvas.width / 2;
    // Store level info in graphics for rendering context
    graphics.level = state.level;

    // Sunset Logic (Approaching the subway)
    const subway = state.obstacles.find(o => o.type === 'SUBWAY_ENTRANCE');
    if (state.level === 'SURFACE' && subway) {
        const progress = Math.min(Math.max(state.rat.x / subway.x, 0), 1);
        graphics.levelProgress = progress;
    } else {
        graphics.levelProgress = 0;
    }
}

// The Game Loop: The Heartbeat of the City
function loop() {
    update();
    graphics.clear();
    graphics.drawCity(state.buildings, state.birds); // Birds fly in the city
    graphics.drawTurds(state.turds); // Danger from above
    graphics.drawObstacles(state.obstacles);
    graphics.drawRat(state.rat.x, state.rat.y, state.rat.facingRight);
    graphics.drawUI(state.score); // Draw score

    // Debug Overlay
    if (window.DEBUG_MODE) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 300, 100);
        ctx.fillStyle = 'lime';
        ctx.font = '12px monospace';
        ctx.fillText(`Viewport: ${window.innerWidth}x${window.innerHeight}`, 20, 30);
        ctx.fillText(`Touches: ${lastTouchDebug.count} | Last X: ${Math.round(lastTouchDebug.x)}`, 20, 50);
        ctx.fillText(`Input: L:${state.input.left} R:${state.input.right} J:${state.input.jump}`, 20, 70);
        ctx.fillText(`Rat: ${Math.round(state.rat.x)}, ${Math.round(state.rat.y)}`, 20, 90);
        ctx.fillText(`Frames: ${state.frameCount}`, 20, 110);

        // Draw Split Line
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(window.innerWidth / 2, 0);
        ctx.lineTo(window.innerWidth / 2, window.innerHeight);
        ctx.stroke();
    }

    requestAnimationFrame(loop);
}

// Start the chaos
loop();
