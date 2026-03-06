from playwright.sync_api import Page, expect, sync_playwright

def verify_a11y_improvements(page: Page):
    # Go to the local game page
    page.goto("http://localhost:8000/rats-the-video-game/index.html")

    # Wait for the tutorial modal to be visible
    tutorial_modal = page.locator("#tutorial-modal")
    expect(tutorial_modal).to_be_visible()

    # Take a screenshot of the tutorial modal
    page.screenshot(path="verification/tutorial_modal.png")
    print("Screenshot of tutorial modal saved to verification/tutorial_modal.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_a11y_improvements(page)
        finally:
            browser.close()