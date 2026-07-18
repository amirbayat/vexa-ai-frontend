# assetlinks.json

برای فعال شدن Android App Links (docs/PRD-user-push-notifications-and-mobile-app-flows.md بخش ۵.۵)
باید مقادیر `REPLACE_WITH_*` در `assetlinks.json` را با SHA256 fingerprint واقعی امضای اپ
(`android-app/`) جایگزین کنید:

```bash
# برای release keystore
keytool -list -v -keystore <path-to-release.keystore> -alias <alias> | grep SHA256

# برای debug keystore (معمولاً ~/.android/debug.keystore، پسورد پیش‌فرض android)
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android | grep SHA256
```

بعد از جایگزینی، با ابزار رسمی گوگل تست کنید که verify می‌شود:
https://developers.google.com/digital-asset-links/tools/generator
