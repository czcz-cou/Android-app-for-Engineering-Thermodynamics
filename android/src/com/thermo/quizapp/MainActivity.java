package com.thermo.quizapp;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ClipData;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import android.view.HapticFeedbackConstants;
import android.view.View;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.ScrollView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {
    private WebView webView;
    private static final String STATE_FILE = "thermo_study_state.json";
    private static final String NOTE_IMAGES_DIR = "note_images";
    private static final int REQ_PICK_NOTE_IMAGE = 1001;
    private static final int REQ_WEB_FILE_CHOOSER = 1002;

    private String pendingNoteQid = null;
    private ValueCallback<Uri[]> webFilePathCallback = null;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        updateSystemBars("#FFFFFF", true);

        try {
            webView = new WebView(this);
            webView.setBackgroundColor(Color.parseColor("#FFFFFF"));
            setContentView(webView);
            configureWebView(webView);
            webView.loadUrl("file:///android_asset/www/index.html");
        } catch (Throwable t) {
            showFallbackError("WebView 初始化失败，请检查系统 Android System WebView 组件是否正常。\n\n详情：" + t.getMessage());
        }
    }

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @SuppressWarnings("deprecation")
    private void configureWebView(WebView wv) {
        WebSettings settings = wv.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        wv.addJavascriptInterface(new AppBridge(), "AppBridge");

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            wv.setWebViewClient(new Api26WebViewClient());
        } else {
            wv.setWebViewClient(new WebViewClient());
        }

        wv.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onJsAlert(WebView view, String url, String message, final JsResult result) {
                new AlertDialog.Builder(MainActivity.this)
                        .setTitle("提示")
                        .setMessage(message)
                        .setPositiveButton("确定", (d, w) -> result.confirm())
                        .setOnCancelListener(d -> result.cancel())
                        .show();
                return true;
            }

            @Override
            public boolean onJsConfirm(WebView view, String url, String message, final JsResult result) {
                new AlertDialog.Builder(MainActivity.this)
                        .setTitle("确认操作")
                        .setMessage(message)
                        .setPositiveButton("确定", (d, w) -> result.confirm())
                        .setNegativeButton("取消", (d, w) -> result.cancel())
                        .setOnCancelListener(d -> result.cancel())
                        .show();
                return true;
            }

            @Override
            public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, final JsPromptResult result) {
                final EditText input = new EditText(MainActivity.this);
                if (defaultValue != null) input.setText(defaultValue);
                new AlertDialog.Builder(MainActivity.this)
                        .setTitle(message)
                        .setView(input)
                        .setPositiveButton("确定", (d, w) -> result.confirm(input.getText().toString()))
                        .setNegativeButton("取消", (d, w) -> result.cancel())
                        .setOnCancelListener(d -> result.cancel())
                        .show();
                return true;
            }

            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (webFilePathCallback != null) {
                    webFilePathCallback.onReceiveValue(null);
                }
                webFilePathCallback = filePathCallback;
                try {
                    Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("image/*");
                    intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                    startActivityForResult(Intent.createChooser(intent, "选择笔记图片"), REQ_WEB_FILE_CHOOSER);
                    return true;
                } catch (Exception e) {
                    webFilePathCallback = null;
                    return false;
                }
            }
        });
    }

    // Isolated class for API 26+ render crash recovery so API 24/25 never fails class verification
    private class Api26WebViewClient extends WebViewClient {
        @Override
        public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
            runOnUiThread(() -> {
                try {
                    if (webView != null) {
                        webView.destroy();
                    }
                    webView = new WebView(MainActivity.this);
                    setContentView(webView);
                    configureWebView(webView);
                    webView.loadUrl("file:///android_asset/www/index.html");
                } catch (Throwable t) {
                    showFallbackError("页面渲染进程异常，重新加载失败：" + t.getMessage());
                }
            });
            return true;
        }
    }

    private void showFallbackError(String msg) {
        ScrollView sv = new ScrollView(this);
        TextView tv = new TextView(this);
        tv.setText(msg);
        tv.setTextSize(15f);
        tv.setPadding(48, 72, 48, 72);
        tv.setTextColor(Color.parseColor("#1E293B"));
        sv.addView(tv);
        setContentView(sv);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (webView == null) {
            finish();
            return;
        }
        webView.evaluateJavascript("window.handleAndroidBack && window.handleAndroidBack()", value -> {
            if (value != null && value.contains("exit")) {
                finish();
            }
        });
    }

    @Override
    @SuppressWarnings("deprecation")
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQ_WEB_FILE_CHOOSER) {
            if (webFilePathCallback == null) return;
            Uri[] results = null;
            if (resultCode == RESULT_OK && data != null) {
                ClipData clip = data.getClipData();
                if (clip != null && clip.getItemCount() > 0) {
                    results = new Uri[clip.getItemCount()];
                    for (int i = 0; i < clip.getItemCount(); i++) {
                        results[i] = clip.getItemAt(i).getUri();
                    }
                } else if (data.getData() != null) {
                    results = new Uri[]{data.getData()};
                }
            }
            webFilePathCallback.onReceiveValue(results);
            webFilePathCallback = null;
            return;
        }

        if (requestCode == REQ_PICK_NOTE_IMAGE) {
            final String qid = pendingNoteQid;
            pendingNoteQid = null;
            if (resultCode != RESULT_OK || data == null || qid == null) return;

            final List<Uri> uris = new ArrayList<>();
            ClipData clip = data.getClipData();
            if (clip != null && clip.getItemCount() > 0) {
                for (int i = 0; i < clip.getItemCount(); i++) {
                    Uri u = clip.getItemAt(i).getUri();
                    if (u != null) uris.add(u);
                }
            } else if (data.getData() != null) {
                uris.add(data.getData());
            }
            if (uris.isEmpty()) return;

            new Thread(() -> {
                JSONArray savedNames = new JSONArray();
                File dir = getNoteImagesDir();
                long baseTs = System.currentTimeMillis();
                for (int i = 0; i < uris.size(); i++) {
                    String fname = saveCompressedImage(uris.get(i), dir, "note_" + baseTs + "_" + i + ".jpg");
                    if (fname != null) {
                        savedNames.put(fname);
                    }
                }
                final String jsCall = "window.onNativeNoteImagesAdded && window.onNativeNoteImagesAdded("
                        + JSONObject.quote(qid) + ", " + savedNames.toString() + ")";
                runOnUiThread(() -> {
                    if (webView != null) {
                        webView.evaluateJavascript(jsCall, null);
                    }
                });
            }).start();
        }
    }

    private File getNoteImagesDir() {
        File dir = new File(getFilesDir(), NOTE_IMAGES_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        return dir;
    }

    private boolean isSafeImageFilename(String filename) {
        if (filename == null || filename.isEmpty()) return false;
        if (filename.contains("/") || filename.contains("\\") || filename.contains("..")) return false;
        return filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".png") || filename.endsWith(".webp");
    }

    private String saveCompressedImage(Uri uri, File dir, String targetName) {
        try {
            // Pass 1: read dimensions only
            BitmapFactory.Options opts = new BitmapFactory.Options();
            opts.inJustDecodeBounds = true;
            try (InputStream is1 = getContentResolver().openInputStream(uri)) {
                if (is1 == null) return null;
                BitmapFactory.decodeStream(is1, null, opts);
            }

            int maxDim = 1280;
            int w = opts.outWidth;
            int h = opts.outHeight;
            int inSample = 1;
            if (w > maxDim || h > maxDim) {
                int halfW = w / 2;
                int halfH = h / 2;
                while ((halfW / inSample) >= maxDim || (halfH / inSample) >= maxDim) {
                    inSample *= 2;
                }
            }

            // Pass 2: decode downsampled bitmap
            BitmapFactory.Options decOpts = new BitmapFactory.Options();
            decOpts.inSampleSize = inSample;
            Bitmap bmp;
            try (InputStream is2 = getContentResolver().openInputStream(uri)) {
                if (is2 == null) return null;
                bmp = BitmapFactory.decodeStream(is2, null, decOpts);
            }
            if (bmp == null) return null;

            int bw = bmp.getWidth();
            int bh = bmp.getHeight();
            if (bw > maxDim || bh > maxDim) {
                float scale = Math.min((float) maxDim / bw, (float) maxDim / bh);
                int nw = Math.max(1, Math.round(bw * scale));
                int nh = Math.max(1, Math.round(bh * scale));
                Bitmap scaled = Bitmap.createScaledBitmap(bmp, nw, nh, true);
                if (scaled != bmp) bmp.recycle();
                bmp = scaled;
            }

            File outFile = new File(dir, targetName);
            try (FileOutputStream fos = new FileOutputStream(outFile)) {
                bmp.compress(Bitmap.CompressFormat.JPEG, 82, fos);
                fos.flush();
            }
            bmp.recycle();
            return targetName;
        } catch (Throwable t) {
            return null;
        }
    }

    @SuppressWarnings("deprecation")
    private void updateSystemBars(final String hexColor, final boolean lightBarIcons) {
        runOnUiThread(() -> {
            try {
                Window window = getWindow();
                int barColor = Color.parseColor(hexColor);
                window.setStatusBarColor(barColor);
                window.setNavigationBarColor(barColor);
                View decor = window.getDecorView();
                int flags = decor.getSystemUiVisibility();
                if (lightBarIcons) {
                    flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        flags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                    }
                } else {
                    flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                    }
                }
                decor.setSystemUiVisibility(flags);
            } catch (Throwable ignored) {}
        });
    }

    public class AppBridge {
        @JavascriptInterface
        public String loadState() {
            try {
                File f = new File(getFilesDir(), STATE_FILE);
                if (!f.exists()) return "";
                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                byte[] buf = new byte[4096];
                try (FileInputStream fis = new FileInputStream(f)) {
                    int n;
                    while ((n = fis.read(buf)) != -1) {
                        bos.write(buf, 0, n);
                    }
                }
                return new String(bos.toByteArray(), StandardCharsets.UTF_8);
            } catch (Exception e) {
                return "";
            }
        }

        @JavascriptInterface
        public boolean saveState(String json) {
            if (json == null) return false;
            try {
                File tmp = new File(getFilesDir(), STATE_FILE + ".tmp");
                File dst = new File(getFilesDir(), STATE_FILE);
                try (FileOutputStream fos = new FileOutputStream(tmp)) {
                    fos.write(json.getBytes(StandardCharsets.UTF_8));
                    fos.flush();
                }
                return tmp.renameTo(dst) || copyFallback(tmp, dst);
            } catch (Exception e) {
                return false;
            }
        }

        private boolean copyFallback(File src, File dst) {
            try (FileInputStream in = new FileInputStream(src);
                 FileOutputStream out = new FileOutputStream(dst)) {
                byte[] b = new byte[4096];
                int n;
                while ((n = in.read(b)) != -1) out.write(b, 0, n);
                src.delete();
                return true;
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public void pickNoteImage(String qid) {
            runOnUiThread(() -> {
                try {
                    pendingNoteQid = qid;
                    Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("image/*");
                    intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                    startActivityForResult(Intent.createChooser(intent, "选择笔记图片"), REQ_PICK_NOTE_IMAGE);
                } catch (Exception e) {
                    pendingNoteQid = null;
                }
            });
        }

        @JavascriptInterface
        public String getNoteImageDataUrl(String filename) {
            if (!isSafeImageFilename(filename)) return "";
            try {
                File f = new File(getNoteImagesDir(), filename);
                if (!f.exists()) return "";
                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                byte[] buf = new byte[8192];
                try (FileInputStream fis = new FileInputStream(f)) {
                    int n;
                    while ((n = fis.read(buf)) != -1) {
                        bos.write(buf, 0, n);
                    }
                }
                String b64 = Base64.encodeToString(bos.toByteArray(), Base64.NO_WRAP);
                return "data:image/jpeg;base64," + b64;
            } catch (Exception e) {
                return "";
            }
        }

        @JavascriptInterface
        public boolean deleteNoteImage(String filename) {
            if (!isSafeImageFilename(filename)) return false;
            try {
                File f = new File(getNoteImagesDir(), filename);
                return !f.exists() || f.delete();
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public String getStorageStats() {
            try {
                File dir = getNoteImagesDir();
                File[] files = dir.listFiles();
                int count = 0;
                long bytes = 0;
                if (files != null) {
                    for (File f : files) {
                        if (f.isFile()) {
                            count++;
                            bytes += f.length();
                        }
                    }
                }
                JSONObject obj = new JSONObject();
                obj.put("imageCount", count);
                obj.put("imageBytes", bytes);
                return obj.toString();
            } catch (Exception e) {
                return "{\"imageCount\":0,\"imageBytes\":0}";
            }
        }

        @JavascriptInterface
        public void vibrate(int ms) {
            runOnUiThread(() -> {
                if (webView != null) {
                    webView.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP);
                }
            });
        }

        @JavascriptInterface
        public void setThemeBar(String hexColor, boolean lightIcons) {
            updateSystemBars(hexColor, lightIcons);
        }

        @JavascriptInterface
        public void shareText(String title, String content) {
            runOnUiThread(() -> {
                Intent sendIntent = new Intent(Intent.ACTION_SEND);
                sendIntent.setType("text/plain");
                sendIntent.putExtra(Intent.EXTRA_SUBJECT, title);
                sendIntent.putExtra(Intent.EXTRA_TEXT, content);
                startActivity(Intent.createChooser(sendIntent, "分享或备份"));
            });
        }
    }
}
