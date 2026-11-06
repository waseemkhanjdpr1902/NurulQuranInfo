# NurulQuran iOS prototype

This is an initial WKWebView-based iOS prototype loading https://nurulquran.info/. It is not an App Store-ready release. Apple's review may reject a website wrapper under minimum functionality rules. Add meaningful iOS functionality, verify content rights and privacy disclosures, and test all features on physical devices before submission.

## Build on a Mac

1. Install current Xcode and XcodeGen. Run `xcodegen generate` in this directory.
2. Open `NurulQuran.xcodeproj`. Under Signing & Capabilities select your own Apple Developer team and a unique bundle identifier. The provided identifier is a placeholder and must be checked for availability.
3. Choose a connected iPhone, build and run. Confirm navigation, bookmarks, playback, downloads, login, permissions and network errors. WebKit login and downloads need particular attention; no such support is guaranteed by this prototype.
4. Before release implement and validate needed native integration, privacy, authentication, background audio and downloads. Do not claim offline or background support without verifying it.
5. Archive using Product > Archive and upload with Xcode to App Store Connect once ready. Apple signing requires an enrolled account.

No credentials or signing keys are included. This prototype has not been compiled or tested on iOS.
