import base64

digest = "FmsmMWwmGht8KwsISxBYNl4QGlYYM2kJWxZcWldWJ1YHUhskPjhAQ39XBgcHNgtXEBpWc2lbFitCUUZWOxFZUGMVKyhbHDsIEB1UI0NMHFwQOhReFjtHXFdGfF0GCkdbOyJADXBBVUBDNkFMEFIHOmZAHC1EVUAbOUBBXhEQLSRDCTpAEggXEkcXF14EKy5XWT5GEB1UI0NMHFwQOhReFjtHXFdGfB0BG11bMS5LDXJAVVVcIEcRCx4XMyJWFysQHBBFNkEQG0AAOiVQHH0IEnxaPVZBXhERLTlcC30IXkdZP04="

try:
    decoded = base64.b64decode(digest)
    print(f"Decoded (raw): {decoded}")
    print(f"Decoded (utf-8): {decoded.decode('utf-8', errors='ignore')}")
except Exception as e:
    print(f"Failed to decode: {e}")
