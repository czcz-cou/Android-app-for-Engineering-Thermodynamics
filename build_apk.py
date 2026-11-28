import json
import os
import shutil
import subprocess
import zipfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

TOOLCHAIN = Path(r"C:\Users\czcz2\.gemini\antigravity\brain\4c66cb34-64a5-42de-9480-6fddd6434311\scratch\android_toolchain")
KATEX_DIST = Path(r"C:\Users\czcz2\.gemini\antigravity\brain\4c66cb34-64a5-42de-9480-6fddd6434311\scratch\katex_pkg\package\dist")
PROJECT_ROOT = Path(r"c:\Users\czcz2\Desktop\anti test\ThermoQuizApp")
ASSETS_SRC = PROJECT_ROOT / "assets_src"
ANDROID_DIR = PROJECT_ROOT / "android"
BUILD_DIR = PROJECT_ROOT / "build"
FINAL_APK = Path(r"c:\Users\czcz2\Desktop\anti test\工热刷题宝_v4.1.apk")

def find_single(base: Path, pattern: str) -> Path:
    hits = list(base.rglob(pattern))
    if not hits:
        raise FileNotFoundError(f"Could not find {pattern} under {base}")
    return hits[0]

def generate_app_icons(res_dir: Path):
    """Generates crisp Material-style app icons for mdpi..xxxhdpi."""
    sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
    }
    # Render master at 512x512 with supersampling
    M = 512
    im = Image.new("RGBA", (M, M), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # Apple iOS style clean pure blue gradient (#0A84FF -> #0058D0)
    for y in range(M):
        t = y / (M - 1)
        r = int(16 + (0 - 16) * t)
        g = int(142 + (94 - 142) * t)
        b = int(255 + (224 - 255) * t)
        draw.line([(0, y), (M, y)], fill=(r, g, b, 255))

    # Apply smooth squircle mask
    mask = Image.new("L", (M, M), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.rounded_rectangle((16, 16, M - 16, M - 16), radius=116, fill=255)
    out = Image.new("RGBA", (M, M), (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    d2 = ImageDraw.Draw(out)

    # Minimal clean T-s dome & cycle curves in pure white & translucent mist
    d2.line([(108, 392), (410, 392)], fill=(255, 255, 255, 165), width=10)
    d2.line([(108, 392), (108, 112)], fill=(255, 255, 255, 165), width=10)
    dome_pts = []
    for i in range(41):
        u = i / 40.0
        x = 132 + u * 240
        import math
        y = 374 - 208 * math.exp(-((u - 0.48) ** 2) / 0.095)
        dome_pts.append((x, y))
    d2.line(dome_pts, fill=(255, 255, 255, 130), width=10, joint="curve")

    # Crisp pure-white Rankine cycle line & nodes (zero orange!)
    cycle_pts = [(186, 336), (186, 236), (295, 236), (368, 136), (368, 336), (186, 336)]
    d2.line(cycle_pts, fill=(255, 255, 255, 255), width=14, joint="curve")
    for px, py in [(186, 236), (295, 236), (368, 136), (368, 336)]:
        d2.ellipse((px - 12, py - 12, px + 12, py + 12), fill=(255, 255, 255, 255))

    for folder, px in sizes.items():
        d = res_dir / folder
        d.mkdir(parents=True, exist_ok=True)
        resized = out.resize((px, px), Image.Resampling.LANCZOS)
        resized.save(d / "ic_launcher.png", optimize=True)

def prepare_web_assets(www_dir: Path):
    if www_dir.exists():
        shutil.rmtree(www_dir)
    www_dir.mkdir(parents=True, exist_ok=True)

    # 1. Build data_bundle.js from questions.json + formulas.json
    questions = json.loads((ASSETS_SRC / "questions.json").read_text(encoding="utf-8"))
    formulas = json.loads((ASSETS_SRC / "formulas.json").read_text(encoding="utf-8"))
    bundle_js = (
        "window.THERMO_QUESTIONS = " + json.dumps(questions, ensure_ascii=False) + ";\n"
        "window.THERMO_FORMULAS = " + json.dumps(formulas, ensure_ascii=False) + ";\n"
    )
    (www_dir / "data_bundle.js").write_text(bundle_js, encoding="utf-8")
    # Also save data_bundle.js into assets_src so standalone PC/browser preview works too!
    (ASSETS_SRC / "data_bundle.js").write_text(bundle_js, encoding="utf-8")

    # 2. Copy HTML, CSS, JS, and vendor open-source libs (Lucide icons + Panzoom)
    for fn in ["index.html", "styles.css", "app.js"]:
        shutil.copy2(ASSETS_SRC / fn, www_dir / fn)
    if (ASSETS_SRC / "vendor").exists():
        shutil.copytree(ASSETS_SRC / "vendor", www_dir / "vendor")

    # 3. Copy figures
    shutil.copytree(ASSETS_SRC / "figures", www_dir / "figures")

    # 4. Copy KaTeX (katex.min.js, katex.min.css, and ONLY .woff2 fonts to keep APK super compact!)
    katex_out = www_dir / "katex"
    (katex_out / "fonts").mkdir(parents=True, exist_ok=True)
    shutil.copy2(KATEX_DIST / "katex.min.js", katex_out / "katex.min.js")

    # Strip .ttf and .woff fallbacks from katex.min.css so Android WebView uses pure .woff2 (~600KB saved!)
    css = (KATEX_DIST / "katex.min.css").read_text(encoding="utf-8")
    import re
    css = re.sub(r',url\(fonts/[^)]+\.woff\) format\("woff"\),url\(fonts/[^)]+\.ttf\) format\("truetype"\)', "", css)
    (katex_out / "katex.min.css").write_text(css, encoding="utf-8")

    for woff2 in (KATEX_DIST / "fonts").glob("*.woff2"):
        shutil.copy2(woff2, katex_out / "fonts" / woff2.name)

    # Also copy katex into assets_src/katex so local preview works directly
    if (ASSETS_SRC / "katex").exists():
        shutil.rmtree(ASSETS_SRC / "katex")
    shutil.copytree(katex_out, ASSETS_SRC / "katex")

def run_cmd(cmd, env=None):
    print("EXEC:", " ".join(str(c) for c in cmd))
    res = subprocess.run([str(c) for c in cmd], capture_output=True, text=True, encoding="utf-8", errors="replace", env=env)
    if res.returncode != 0:
        print("STDOUT:", res.stdout)
        print("STDERR:", res.stderr)
        raise RuntimeError(f"Command failed with exit code {res.returncode}")
    return res.stdout

def main():
    javac = find_single(TOOLCHAIN / "jdk", "javac.exe")
    keytool = find_single(TOOLCHAIN / "jdk", "keytool.exe")
    java_home = javac.parent.parent

    aapt2 = find_single(TOOLCHAIN / "build-tools", "aapt2.exe")
    d8_bat = find_single(TOOLCHAIN / "build-tools", "d8.bat")
    zipalign = find_single(TOOLCHAIN / "build-tools", "zipalign.exe")
    apksigner_bat = find_single(TOOLCHAIN / "build-tools", "apksigner.bat")
    android_jar = find_single(TOOLCHAIN / "platforms", "android.jar")

    env = os.environ.copy()
    env["JAVA_HOME"] = str(java_home)
    env["PATH"] = str(java_home / "bin") + os.pathsep + env.get("PATH", "")

    if BUILD_DIR.exists():
        shutil.rmtree(BUILD_DIR)
    BUILD_DIR.mkdir(parents=True, exist_ok=True)

    res_dir = ANDROID_DIR / "res"
    assets_dir = ANDROID_DIR / "assets"
    generate_app_icons(res_dir)
    prepare_web_assets(assets_dir / "www")

    # Step 1: aapt2 compile resources
    compiled_res_zip = BUILD_DIR / "compiled_res.zip"
    run_cmd([aapt2, "compile", "--dir", res_dir, "-o", compiled_res_zip], env=env)

    # Step 2: aapt2 link resources + AndroidManifest.xml + assets -> base_unsigned.apk + R.java
    gen_java = BUILD_DIR / "gen"
    gen_java.mkdir(parents=True, exist_ok=True)
    unsigned_apk = BUILD_DIR / "unsigned.apk"
    run_cmd([
        aapt2, "link",
        "-I", android_jar,
        "--manifest", ANDROID_DIR / "AndroidManifest.xml",
        "-A", assets_dir,
        "-o", unsigned_apk,
        "--java", gen_java,
        "--auto-add-overlay",
        compiled_res_zip
    ], env=env)

    # Step 3: javac compile R.java + MainActivity.java (target Java 11 for d8)
    classes_dir = BUILD_DIR / "classes"
    classes_dir.mkdir(parents=True, exist_ok=True)
    java_sources = list(gen_java.rglob("*.java")) + list((ANDROID_DIR / "src").rglob("*.java"))
    run_cmd([
        javac,
        "-encoding", "UTF-8",
        "-source", "11",
        "-target", "11",
        "-classpath", android_jar,
        "-d", classes_dir,
        *java_sources
    ], env=env)

    # Step 4: d8 compile .class files -> classes.dex
    dex_dir = BUILD_DIR / "dex"
    dex_dir.mkdir(parents=True, exist_ok=True)
    class_files = list(classes_dir.rglob("*.class"))
    run_cmd([
        "cmd.exe", "/c", d8_bat,
        "--min-api", "24",
        "--lib", android_jar,
        "--output", dex_dir,
        *class_files
    ], env=env)

    # Step 5: Add classes.dex into unsigned.apk
    dex_file = dex_dir / "classes.dex"
    with zipfile.ZipFile(unsigned_apk, "a", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.write(dex_file, "classes.dex")

    # Step 6: zipalign -p -f 4
    aligned_apk = BUILD_DIR / "aligned.apk"
    run_cmd([zipalign, "-p", "-f", "4", unsigned_apk, aligned_apk], env=env)

    # Step 7: Create release keystore (if not exists) and sign APK (v1 + v2 + v3 signatures!)
    keystore = PROJECT_ROOT / "release.keystore"
    if not keystore.exists():
        run_cmd([
            keytool, "-genkeypair", "-v",
            "-keystore", keystore,
            "-alias", "thermo_key",
            "-keyalg", "RSA",
            "-keysize", "2048",
            "-validity", "10000",
            "-storepass", "thermo123456",
            "-keypass", "thermo123456",
            "-dname", "CN=ThermoQuiz, OU=Study, O=EngineeringThermodynamics, L=Beijing, ST=Beijing, C=CN"
        ], env=env)

    run_cmd([
        "cmd.exe", "/c", apksigner_bat, "sign",
        "--ks", keystore,
        "--ks-key-alias", "thermo_key",
        "--ks-pass", "pass:thermo123456",
        "--key-pass", "pass:thermo123456",
        "--v1-signing-enabled", "true",
        "--v2-signing-enabled", "true",
        "--v3-signing-enabled", "true",
        "--out", FINAL_APK,
        aligned_apk
    ], env=env)

    # Step 8: Verify signature!
    verify_out = run_cmd(["cmd.exe", "/c", apksigner_bat, "verify", "--verbose", FINAL_APK], env=env)
    print(verify_out)
    print(f"=== APK BUILT SUCCESSFULLY: {FINAL_APK} ({FINAL_APK.stat().st_size / (1024*1024):.2f} MB) ===")

if __name__ == "__main__":
    main()
