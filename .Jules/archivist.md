- Double Jump and Swipe Down are controls verified in code, mechanics.md omitted them but they are now in sync.

* When updating mechanics documentation, explicitly check that all relevant control options (keyboard vs. mobile touch/swipe) are listed alongside the primary action description to maintain complete documentation parity, instead of isolating mobile controls at the bottom of the document.
* Before proposing specific edits using tools like `replace_with_git_merge_diff` for markdown files, always ensure that commands like `grep -n -C 5` or `sed` successfully output the exact boundaries of the target text to avoid assuming text that may have been missed due to output truncation.
