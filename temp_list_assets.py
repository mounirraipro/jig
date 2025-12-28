import UnityPy
from pathlib import Path
bundle_path = Path("com.gamincat.jigsolitaire/assets/aa/Android/defaultlocalgroup_assets_all_ca619d4f2e59f2119fbae48daab99ee9.bundle")
env = UnityPy.load(bundle_path.read_bytes())
for path, obj in env.container.items():
    data = obj.read()
    print(f"{path} -> {data.__class__.__name__}")
