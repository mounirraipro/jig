from pathlib import Path

data = Path("com.gamincat.jigsolitaire/assets/bin/Data/Managed/Metadata/global-metadata.dat").read_bytes()
strings = [s.decode('utf-8', 'ignore') for s in data.split(b'\x00')]
results = sorted({s for s in strings if 'PieceGroup' in s})
for s in results[:200]:
    print(s)
