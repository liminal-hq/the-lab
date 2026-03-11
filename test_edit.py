with open("rats-the-video-game/index.html", "r") as f:
    content = f.read()

import re

# Add modal button styles
content = content.replace(
    "#close-btn:hover { background: #27ae60; }",
    """#close-btn:hover { background: #27ae60; }

        .modal-btn {
            color: white; border: none; padding: 12px 24px; cursor: pointer; border-radius: 5px; font-size: 1rem;
        }
        .modal-btn.primary { background: #e74c3c; }
        .modal-btn.primary:hover { background: #c0392b; }
        .modal-btn.secondary { background: #444; border: 1px solid #777; }
        .modal-btn.secondary:hover { background: #666; }"""
)

# Fix checkbox sizes
content = content.replace(
    """.control-row input {
            cursor: pointer;
        }""",
    """.control-row input {
            cursor: pointer;
            width: 24px;
            height: 24px;
        }"""
)

# Fix debug toggle size and layout
content = content.replace(
    """<div id="debug-container">
                <label>
                    <input type="checkbox" id="debug-toggle"> Enable Debug Info
                </label>
            </div>""",
    """<div id="debug-container">
                <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                    <input type="checkbox" id="debug-toggle" style="width: 20px; height: 20px; cursor: pointer;"> Enable Debug Info
                </label>
            </div>"""
)

# Fix inline styles for modal buttons
content = content.replace(
    """<button id="credits-btn" style="background: #444; border: 1px solid #777; color: white; padding: 10px;">Credits</button>
            <br><br>
            <button id="close-options-btn" style="background: #e74c3c; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px;">Close</button>""",
    """<button id="credits-btn" class="modal-btn secondary">Credits</button>
            <br><br>
            <button id="close-options-btn" class="modal-btn primary">Close</button>"""
)

content = content.replace(
    """<button id="close-credits-btn" style="background: #e74c3c; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px;">Back</button>""",
    """<button id="close-credits-btn" class="modal-btn primary">Back</button>"""
)

# Add overlay click handler
content = content.replace(
    "// Escape Key Handler",
    """// Overlay Click to Close Modals
            document.querySelectorAll('.modal').forEach(modal => {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        if (modal.id === 'tutorial-modal') closeTutorial();
                        else if (modal.id === 'credits-modal') closeCreditsBtn.click();
                        else closeModal(modal);
                    }
                });
            });

            // Escape Key Handler"""
)

with open("rats-the-video-game/index.html", "w") as f:
    f.write(content)
