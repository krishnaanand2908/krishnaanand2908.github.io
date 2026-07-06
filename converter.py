# converter.py
import sys, re, json, unicodedata

# Make sure prints use UTF-8 (Python 3.7+)
try:
    sys.stdout.reconfigure(encoding="utf-8") # type: ignore
except Exception:
    pass

# 1) Read as UTF-8 (try utf-8-sig in case there is a BOM)
def read_text(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except UnicodeDecodeError:
        with open(path, "r", encoding="utf-8-sig") as f:
            return f.read()

text = read_text("poem.txt")

# 2) Normalize + clean typical troublemakers
#    - NFC normalization keeps Devanagari matras combined
text = unicodedata.normalize("NFC", text)

#    - Replace non-breaking spaces with normal spaces
text = text.replace("\u00A0", " ")

#    - Remove zero-width chars (ZWSP/ZWNJ/ZWJ) and stray BOM
text = re.sub(r"[\u200B-\u200D\uFEFF]", "", text)

#    - Remove soft hyphen (often causes odd breaks)
text = text.replace("\u00AD", "")

#    - Normalize newlines to \n
text = text.replace("\r\n", "\n").replace("\r", "\n")

# 3) If your text looks like mojibake (à¤…), repair it
if "à¤" in text or "à¥" in text:
    # It was likely decoded as cp1252/latin-1 by mistake; repair it
    try:
        text = text.encode("latin1", "ignore").decode("utf-8", "ignore")
        text = unicodedata.normalize("NFC", text)
    except Exception:
        pass

# 4) Print clean Hindi to console 
print(text)

# 5) Also write as a single JSON string (with \n escapes)
#    keep Hindi readable in the JSON (no \u0928 escapes)
json_string = json.dumps(text, ensure_ascii=False)
with open("saved_poem.json", "w", encoding="utf-8") as f:
    f.write(json_string)
