from playwright.sync_api import sync_playwright

def verify_double_jump():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Go to the game
        page.goto("http://localhost:8000/rats-the-video-game/index.html")

        # Wait for the tutorial modal to appear
        page.wait_for_selector("#tutorial-modal", state="visible")

        # Verify the text update in the modal
        legend = page.locator(".control-legend")
        print(f"Legend text: {legend.inner_text()}")

        if "Double Jump" in legend.inner_text():
            print("SUCCESS: Help modal text updated correctly.")
        else:
            print("FAILURE: Help modal text NOT updated.")

        # Take a screenshot of the help modal
        page.screenshot(path="verification/help_modal_double_jump.png")

        # Close the modal to start the game
        page.click("#close-btn")

        # Wait for game to start (rat to be grounded)
        page.wait_for_timeout(1000)

        # Get initial Y position
        initial_y = page.evaluate("window.gameState.rat.y")
        print(f"Initial Y: {initial_y}")

        # Perform a single jump
        page.keyboard.press("Space")
        page.wait_for_timeout(100)
        y_after_jump = page.evaluate("window.gameState.rat.y")
        print(f"Y after 1st jump: {y_after_jump}")

        # Perform double jump while in air
        page.keyboard.press("Space")
        page.wait_for_timeout(100)
        y_after_double_jump = page.evaluate("window.gameState.rat.y")
        print(f"Y after 2nd jump: {y_after_double_jump}")

        # Check if double jump occurred (should be higher or maintained height compared to normal gravity decay)
        # Note: Exact physics verification is hard with timeouts, but we can check the flag
        can_double_jump = page.evaluate("window.gameState.rat.canDoubleJump")
        print(f"Can Double Jump: {can_double_jump}")

        if can_double_jump is False:
             print("SUCCESS: Double jump consumed.")
        else:
             print("FAILURE: Double jump NOT consumed.")

        browser.close()

if __name__ == "__main__":
    verify_double_jump()
