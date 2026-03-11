from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('http://localhost:8000/rats-the-video-game/index.html')
    page.wait_for_timeout(1000)
    page.screenshot(path='ui_screenshot_2.png')

    # Open options modal
    page.locator('#options-btn').click()
    page.wait_for_timeout(1000)
    page.screenshot(path='ui_screenshot_3.png')
    browser.close()
