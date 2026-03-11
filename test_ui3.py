from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('http://localhost:8000/rats-the-video-game/index.html')
    page.wait_for_timeout(1000)

    # Close tutorial modal first
    page.locator('#close-btn').click()
    page.wait_for_timeout(1000)

    # Open options modal
    page.locator('#options-btn').click()
    page.wait_for_timeout(1000)
    page.screenshot(path='ui_screenshot_options.png')
    browser.close()
