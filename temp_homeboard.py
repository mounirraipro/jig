import UnityPy
from pathlib import Path
bundle_path = Path("com.gamincat.jigsolitaire/assets/aa/Android/defaultlocalgroup_assets_all_ca619d4f2e59f2119fbae48daab99ee9.bundle")
env = UnityPy.load(bundle_path.read_bytes())
for path, obj in env.container.items():
    if 'HomeBoardList' in path:
        data = obj.read()
        print(dir(data))
        print('text len', len(getattr(data, 'text', '')))
        print('script len', len(getattr(data, 'script', b'')))
        print(getattr(data, 'text', '')[:400])
        print(getattr(data, 'script', b'')[:200])
