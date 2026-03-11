with open('rats-the-video-game/index.html', 'r') as f:
    lines = f.readlines()

out = []
for i, line in enumerate(lines):
    if "closeModal(modal);" in line and "{" in lines[i-1]:
        # Just safely close it using the method
        out.append("                            closeOptionsBtn.click(); // Close the options modal via button logic to be safe\n")
    else:
        out.append(line)

with open('rats-the-video-game/index.html', 'w') as f:
    f.writelines(out)
