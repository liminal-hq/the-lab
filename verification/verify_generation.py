from playwright.sync_api import sync_playwright

def test_generation(page):
    page.goto("http://localhost:8000/rats-the-video-game/index.html")
    page.wait_for_timeout(1000)

    # Close tutorial modal
    page.locator("#close-btn").click()

    # Fast forward to construction district (cycle 13)
    page.evaluate("""
        window.gameState.currentCycle = 13;
        window.gameState.rat.x = window.gameState.cycleCheckpoints[13];
    """)
    page.wait_for_timeout(100)

    # Take screenshot of construction district
    page.screenshot(path="verification/construction_district.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_generation(page)
        finally:
            browser.close()
