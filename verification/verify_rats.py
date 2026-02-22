from playwright.sync_api import sync_playwright

def verify_rats_ux():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Go to the page
        page.goto("http://localhost:8000/rats-the-video-game/index.html")

        print("Page loaded.")

        # 1. Verify aria-labelledby
        modals = [
            ("#tutorial-modal", "tutorial-title"),
            ("#options-modal", "options-title"),
            ("#credits-modal", "credits-title")
        ]

        for modal_id, title_id in modals:
            modal = page.locator(modal_id)
            aria_labelled_by = modal.get_attribute("aria-labelledby")
            print(f"Checking {modal_id}: aria-labelledby='{aria_labelled_by}'")

            if aria_labelled_by != title_id:
                print(f"ERROR: {modal_id} has wrong aria-labelledby. Expected {title_id}, got {aria_labelled_by}")

            # Verify the title element exists and has the ID
            title_el = page.locator(f"#{title_id}")
            if title_el.count() == 0:
                print(f"ERROR: Element with ID {title_id} not found.")
            else:
                print(f"SUCCESS: Element with ID {title_id} found.")

        # 2. Verify Focus Style
        # Focus on the Help Button (?)
        help_btn = page.locator("#help-btn")
        help_btn.focus()

        # Take a screenshot of the focused button area
        # We can take a screenshot of the whole page, but let's make sure the button is visible
        print("Taking screenshot of focused Help button...")
        page.screenshot(path="verification/focus_ring_check.png")

        # Also try to check the computed style if possible, though screenshot is better for visual
        # Playwright doesn't easily get pseudo-elements styles directly via standard API without eval
        # But we can check if the outline style is applied to the button itself in the computed style
        # Wait, :focus-visible might not trigger strictly with .focus() in some browsers/playwright versions depending on input source
        # We can force it by sending a tab key.

        page.reload() # Reset focus
        page.keyboard.press("Tab") # Should focus the first element (Options button usually or Help button)
        page.keyboard.press("Tab") # Focus next

        # Let's take another screenshot after tabbing
        print("Taking screenshot after tabbing...")
        page.screenshot(path="verification/focus_ring_tab_check.png")

        browser.close()

if __name__ == "__main__":
    verify_rats_ux()
