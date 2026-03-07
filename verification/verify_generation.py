from playwright.sync_api import sync_playwright

def test_generation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('http://localhost:8000/rats-the-video-game/index.html')

        # Start game by clicking the play button
        page.locator('#tutorial-modal button').click()

        # Advance through the cycles to reach the Construction district (cycle 13+)
        # Cycles are roughly checkpointed. We need to move the rat right.
        page.keyboard.press('ArrowRight')
        page.wait_for_timeout(100)

        # Evaluate state to jump ahead
        page.evaluate('window.gameState.rat.x = 4000') # Move far ahead
        page.evaluate('window.gameState.currentCycle = 13')
        page.wait_for_timeout(500)

        # Take a screenshot
        page.screenshot(path="verification/construction_district.png")

        browser.close()

if __name__ == "__main__":
    test_generation()
