import SwiftUI
import WebKit
import UIKit

@main
struct NurulQuranApp: App {
    var body: some Scene {
        WindowGroup { ContentView() }
    }
}

struct ContentView: View {
    @StateObject private var browser = BrowserModel()
    var body: some View {
        NavigationStack {
            WebPage(browser: browser)
                .ignoresSafeArea(edges: .bottom)
                .overlay {
                    if browser.failed {
                        VStack(spacing: 16) {
                            Image(systemName: "wifi.exclamationmark").font(.largeTitle)
                            Text("Unable to open NurulQuran").font(.headline)
                            Text("Check your internet connection and try again.").multilineTextAlignment(.center)
                            Button("Try again") { browser.reload() }
                        }.padding().background(.regularMaterial).cornerRadius(16)
                    }
                }
                .toolbar {
                    ToolbarItem(placement: .navigationBarLeading) {
                        Button { browser.webView.goBack() } label: { Image(systemName: "chevron.left") }
                            .disabled(!browser.canGoBack)
                            .accessibilityLabel("Back")
                    }
                    ToolbarItem(placement: .principal) { Text("NurulQuran").font(.headline) }
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button { browser.reload() } label: { Image(systemName: "arrow.clockwise") }
                            .accessibilityLabel("Reload")
                    }
                }
        }
    }
}

final class BrowserModel: NSObject, ObservableObject, WKNavigationDelegate, WKUIDelegate {
    let webView: WKWebView
    @Published var failed = false
    @Published var canGoBack = false
    private let home = URL(string: "https://nurulquran.info/")!
    override init() {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        webView = WKWebView(frame: .zero, configuration: config)
        super.init()
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.load(URLRequest(url: home))
    }
    func reload() {
        failed = false
        if webView.url == nil { webView.load(URLRequest(url: home)) } else { webView.reload() }
    }
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        failed = false
        canGoBack = webView.canGoBack
    }
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        if (error as NSError).code != NSURLErrorCancelled { failed = true }
    }
    func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = action.request.url, let scheme = url.scheme?.lowercased() else { decisionHandler(.cancel); return }
        if scheme == "https" || scheme == "http" {
            if action.targetFrame == nil { webView.load(action.request); decisionHandler(.cancel); return }
            decisionHandler(.allow)
        } else {
            if ["mailto", "tel"].contains(scheme) { UIApplication.shared.open(url) }
            decisionHandler(.cancel)
        }
    }
}

struct WebPage: UIViewRepresentable {
    @ObservedObject var browser: BrowserModel
    func makeUIView(context: Context) -> WKWebView { browser.webView }
    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
