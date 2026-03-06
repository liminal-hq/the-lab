from playwright.sync_api import Page, expect, sync_playwright

def verify_a11y_buttons(page: Page):
    page.goto("http://localhost:8000/rats-the-video-game/index.html")

    # The tutorial modal is visible initially, so we dismiss it
    close_btn = page.locator("#close-btn")
    close_btn.click()

    # Now take a screenshot of the whole page to show the buttons top right
    page.screenshot(path="verification/buttons.png")
    print("Screenshot of main view saved to verification/buttons.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_a11y_buttons(page)
        finally:
            browser.close()
