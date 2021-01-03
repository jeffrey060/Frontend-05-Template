<script>
    /**
     * 标准化组织
     * 
     * khronos
     *  WebGL
     * ECMA
     *  ECMAScript
     * WHATWG
     *  HTML
     * W3C
     *  webaudio
     *  CG/WG
     */
    let names = Object.getOwnPropertyNames(window);

    function filterOut(names, props) {
        let set = new Set();
        props.forEach(o => set.add(o));
        return names.filter(e => !set.has(e));
    }

    // JavaScript 标准规定的属性
    {
        let js = new Set();
        let objects = ["globalThis", "BigInt", "BigInt64Array", "BigUint64Array", "Infinity", "NaN", "undefined", "eval", "isFinite",
            "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent",
            "Array", "Date", "RegExp", "Promise", "Proxy", "Map", "WeakMap", "Set", "WeakSet", "Function",
            "Boolean", "String", "Number", "Symbol", "Object", "Error", "EvalError", "RangeError", "ReferenceError",
            "SyntaxError", "TypeError", "URIError", "ArrayBuffer", "SharedArrayBuffer", "DataView", "Float32Array",
            "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint16Array", "Uint32Array",
            "Uint8ClampedArray", "Atomics", "JSON", "Math", "Reflect", "escape", "unescape"
        ];
        objects.forEach(o => js.add(o));
        // let names = Object.getOwnPropertyNames(window)
        names = names.filter(e => !js.has(e));
        // console.log('ECMA:', names);
    }

    // DOM 中的元素构造器
    names = names.filter(e => {
        try {
            return !(window[e].prototype instanceof Node)
        } catch (err) {
            return true;
        }
    }).filter(e => e != "Node")

    // Window 对象上的属性
    // window,self,document,name,location,history,customElements,locationbar,menubar, personalbar,scrollbars,statusbar,toolbar,status,close,closed,stop,focus, blur,frames,length,top,opener,parent,frameElement,open,navigator,applicationCache,alert,confirm,prompt,print,postMessage
    {
        // let names = Object.getOwnPropertyNames(window)
        let js = new Set();
        let objects = ["BigInt", "BigInt64Array", "BigUint64Array", "Infinity", "NaN", "undefined", "eval", "isFinite",
            "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent",
            "Array", "Date", "RegExp", "Promise", "Proxy", "Map", "WeakMap", "Set", "WeakSet", "Function",
            "Boolean", "String", "Number", "Symbol", "Object", "Error", "EvalError", "RangeError", "ReferenceError",
            "SyntaxError", "TypeError", "URIError", "ArrayBuffer", "SharedArrayBuffer", "DataView", "Float32Array",
            "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint16Array", "Uint32Array",
            "Uint8ClampedArray", "Atomics", "JSON", "Math", "Reflect", "escape", "unescape"
        ];
        objects.forEach(o => js.add(o));
        names = names.filter(e => !js.has(e));

        names = names.filter(e => {
            try {
                return !(window[e].prototype instanceof Node)
            } catch (err) {
                return true;
            }
        }).filter(e => e != "Node")

        let windowprops = new Set();
        objects = ["window", "self", "document", "name", "location", "history", "customElements", "locationbar",
            "menubar", " personalbar", "scrollbars", "statusbar", "toolbar", "status", "close", "closed", "stop",
            "focus", " blur", "frames", "length", "top", "opener", "parent", "frameElement", "open", "navigator",
            "applicationCache", "alert", "confirm", "prompt", "print", "postMessage", "console"
        ];
        objects.forEach(o => windowprops.add(o));
        names = names.filter(e => !windowprops.has(e));
        // console.log('Window:', names);
    }

    // 过滤掉所有的事件，也就是 on 开头的属性
    names = names.filter(e => !e.match(/^on/));

    // webkit 前缀的私有属性
    names = names.filter(e => !e.match(/^(webkit|WebKit)/));

    // HTML 标准中还能找到所有的接口
    let interfaces = new Set();
    objects = ["ApplicationCache", "AudioTrack", "AudioTrackList", "BarProp", "BeforeUnloadEvent", "BroadcastChannel",
        "CanvasGradient", "CanvasPattern", "CanvasRenderingContext2D", "CloseEvent", "CustomElementRegistry",
        "DOMStringList", "DOMStringMap", "DataTransfer", "DataTransferItem", "DataTransferItemList",
        "DedicatedWorkerGlobalScope", "Document", "DragEvent", "ErrorEvent", "EventSource", "External",
        "FormDataEvent", "HTMLAllCollection", "HashChangeEvent", "History", "ImageBitmap",
        "ImageBitmapRenderingContext", "ImageData", "Location", "MediaError", "MessageChannel", "MessageEvent",
        "MessagePort", "MimeType", "MimeTypeArray", "Navigator", "OffscreenCanvas",
        "OffscreenCanvasRenderingContext2D", "PageTransitionEvent", "Path2D", "Plugin", "PluginArray",
        "PopStateEvent", "PromiseRejectionEvent", "RadioNodeList", "SharedWorker", "SharedWorkerGlobalScope",
        "Storage", "StorageEvent", "TextMetrics", "TextTrack", "TextTrackCue", "TextTrackCueList", "TextTrackList",
        "TimeRanges", "TrackEvent", "ValidityState", "VideoTrack", "VideoTrackList", "WebSocket", "Window",
        "Worker", "WorkerGlobalScope", "WorkerLocation", "WorkerNavigator"
    ];
    objects.forEach(o => interfaces.add(o));

    names = names.filter(e => !interfaces.has(e));

    // ECMAScript 2018 Internationalization API
    names = names.filter(e => e != "Intl");

    // Streams 标准
    names = filterOut(names, ["ReadableStream", "ReadableStreamDefaultReader", "ReadableStreamBYOBReader", "ReadableStreamDefaultController", "ReadableByteStreamController", "ReadableStreamBYOBRequest", "WritableStream", "WritableStreamDefaultWriter", "WritableStreamDefaultController", "TransformStream", "TransformStreamDefaultController", "ByteLengthQueuingStrategy", "CountQueuingStrategy"]);

    // WebGL
    names = filterOut(names, ["WebGLContextEvent","WebGLObject", "WebGLBuffer", "WebGLFramebuffer", "WebGLProgram", "WebGLRenderbuffer", "WebGLShader", "WebGLTexture", "WebGLUniformLocation", "WebGLActiveInfo", "WebGLShaderPrecisionFormat", "WebGLRenderingContext"]);

    // WebGL2.0
    // https://www.khronos.org/registry/webgl/specs/latest/2.0/#3.6
    names = filterOut(names, ["WebGLQuery", "WebGLSampler", "WebGLSync", "WebGLTransformFeedback", "WebGLVertexArrayObject", "WebGL2RenderingContext"]);

    // Web Audio API
    names = filterOut(names, ["AudioContext", "AudioNode", "AnalyserNode", "AudioBuffer", "AudioBufferSourceNode", "AudioDestinationNode", "AudioParam", "AudioListener", "AudioWorklet", "AudioWorkletGlobalScope", "AudioWorkletNode", "AudioWorkletProcessor", "BiquadFilterNode", "ChannelMergerNode", "ChannelSplitterNode", "ConstantSourceNode", "ConvolverNode", "DelayNode", "DynamicsCompressorNode", "GainNode", "IIRFilterNode", "MediaElementAudioSourceNode", "MediaStreamAudioSourceNode", "MediaStreamTrackAudioSourceNode", "MediaStreamAudioDestinationNode", "PannerNode", "PeriodicWave", "OscillatorNode", "StereoPannerNode", "WaveShaperNode", "ScriptProcessorNode", "AudioProcessingEvent"]);

    // Encoding 标准
    names = filterOut(names, ["TextDecoder", "TextEncoder", "TextDecoderStream", "TextEncoderStream"]);

    // Web Background Synchronization
    names = filterOut(names, ["SyncManager"]);

    // Web Cryptography API
    names = filterOut(names, ["CryptoKey", "SubtleCrypto", "Crypto", "crypto"]);

    // Media Source Extensions
    names = filterOut(names, ["MediaSource", "SourceBuffer", "SourceBufferList"]);

    // The Screen Orientation API
    names = filterOut(names, ["ScreenOrientation"]);

    //  WebRTC API
    names = filterOut(names, ["RTCTrackEvent", "RTCStatsReport", "RTCSessionDescription", "RTCRtpTransceiver", "RTCRtpSender", "RTCRtpReceiver", "RTCPeerConnectionIceEvent", "RTCPeerConnectionIceErrorEvent", "RTCPeerConnection", "RTCIceCandidate", "RTCErrorEvent", "RTCError", "RTCDataChannelEvent", "RTCDataChannel", "RTCDTMFToneChangeEvent", "RTCDTMFSender", "RTCCertificate"]);
    
    // WebIDL
    // https://developer.mozilla.org/zh-CN/docs/Mozilla/WebIDL_bindings

    // IDL Index
    names = filterOut(names, ["PhotoCapabilities"]);

    // Error Handling
    names = filterOut(names, ["OverconstrainedError"]);

    // The Audio API
    names = filterOut(names, ["OfflineAudioContext", "OfflineAudioCompletionEvent"]);

    // NavigatorNetworkInformation interface
    names = filterOut(names, ["NetworkInformation"]);

    // MediaStream API
    names = filterOut(names, ["MediaStreamTrackEvent", "MediaStreamTrack", "MediaStreamEvent", "MediaStream", "MediaSettingsRange", "MediaRecorder", "MediaEncryptedEvent", "MediaCapabilities", "InputDeviceInfo", "ImageCapture"]);

    //  IndexedDB API
    names = filterOut(names, ["IDBVersionChangeEvent", "IDBTransaction", "IDBRequest", "IDBOpenDBRequest", "IDBObjectStore", "IDBKeyRange", "IDBIndex", "IDBFactory", "IDBDatabase", "IDBCursorWithValue", "IDBCursor"]);

    // Geolocation API
    names = filterOut(names, ["GeolocationPositionError", "GeolocationPosition", "GeolocationCoordinates", "Geolocation", "GamepadHapticActuator", "GamepadEvent", "Gamepad", "GamepadButton"]);

    // Web API interfaces list
    // https://developer.mozilla.org/en-US/docs/Web/API
    names = filterOut(names, ["DOMError", "CanvasCaptureMediaStreamTrack", "BlobEvent", "BeforeInstallPromptEvent", "BatteryManager", "BaseAudioContext", "AudioScheduledSourceNode", "AudioParamMap", "XPathResult", "XPathExpression", "XPathEvaluator", "XMLSerializer", "XMLHttpRequestUpload", "XMLHttpRequestEventTarget", "XMLHttpRequest", "WheelEvent", "VisualViewport", "VTTCue", "URLSearchParams", "URL", "UIEvent", "TreeWalker", "TransitionEvent", "TouchList", "TouchEvent", "Touch", "TextEvent", "TaskAttributionTiming", "StyleSheetList", "StyleSheet", "StylePropertyMapReadOnly", "StylePropertyMap", "StaticRange", "Selection", "SecurityPolicyViolationEvent", "Screen", "SVGUnitTypes", "SVGTransformList", "SVGTransform", "SVGStringList", "SVGRect", "SVGPreserveAspectRatio", "SVGPointList", "SVGPoint", "SVGNumberList", "SVGNumber", "SVGMatrix", "SVGLengthList", "SVGLength", "SVGAnimatedTransformList", "SVGAnimatedString", "SVGAnimatedRect", "SVGAnimatedPreserveAspectRatio", "SVGAnimatedNumberList", "SVGAnimatedNumber", "SVGAnimatedLengthList", "SVGAnimatedLength", "SVGAnimatedInteger", "SVGAnimatedEnumeration", "SVGAnimatedBoolean", "SVGAnimatedAngle", "SVGAngle", "Response", "ResizeObserverEntry", "ResizeObserver", "Request", "ReportingObserver", "Range", "ProgressEvent", "PointerEvent", "PerformanceTiming", "PerformanceServerTiming", "PerformanceResourceTiming", "PerformancePaintTiming", "PerformanceObserverEntryList", "PerformanceObserver", "PerformanceNavigationTiming", "PerformanceNavigation", "PerformanceMeasure", "PerformanceMark", "PerformanceLongTaskTiming", "PerformanceEventTiming", "PerformanceEntry", "PerformanceElementTiming", "Performance", "NodeList", "NodeIterator", "NodeFilter", "NamedNodeMap", "MutationRecord", "MutationObserver", "MutationEvent", "MouseEvent", "MediaQueryListEvent", "MediaQueryList", "MediaList", "LayoutShift", "LargestContentfulPaint", "KeyframeEffect", "KeyboardEvent", "IntersectionObserverEntry", "IntersectionObserver", "InputEvent", "InputDeviceCapabilities", "IdleDeadline", "Headers", "HTMLOptionsCollection", "HTMLFormControlsCollection", "HTMLCollection", "FormData", "FontFaceSetLoadEvent", "FontFace", "FocusEvent", "FileReader", "FileList", "File", "EventTarget", "Event", "DOMTokenList", "DOMRectReadOnly", "DOMRectList", "DOMRect", "DOMQuad", "DOMPointReadOnly", "DOMPoint", "DOMParser", "DOMMatrixReadOnly", "DOMMatrix", "DOMImplementation", "DOMException", "CustomEvent", "CompositionEvent", "ClipboardEvent", "CSSVariableReferenceValue", "CSSUnparsedValue", "CSSUnitValue", "CSSTranslate", "CSSTransformValue", "CSSTransformComponent", "CSSSupportsRule", "CSSStyleValue", "CSSStyleSheet", "CSSStyleRule", "CSSStyleDeclaration", "CSSSkewY", "CSSSkewX", "CSSSkew", "CSSScale", "CSSRuleList", "CSSRule", "CSSRotate", "CSSPositionValue", "CSSPerspective", "CSSPageRule", "CSSNumericValue", "CSSNumericArray", "CSSNamespaceRule", "CSSMediaRule", "CSSMatrixComponent", "CSSMathValue", "CSSMathSum", "CSSMathProduct", "CSSMathNegate", "CSSMathMin", "CSSMathMax", "CSSMathInvert", "CSSKeywordValue", "CSSKeyframesRule", "CSSKeyframeRule", "CSSImportRule", "CSSImageValue", "CSSGroupingRule", "CSSFontFaceRule", "CSS", "CSSConditionRule", "Blob", "AnimationEvent", "AnimationEffect", "Animation", "AbortSignal", "AbortController"]);

    // h5
    names = filterOut(names, ["personalbar", "origin", "external", "screen", "innerWidth", "innerHeight", "scrollX", "pageXOffset", "scrollY", "pageYOffset", "visualViewport", "screenX", "screenY", "outerWidth", "outerHeight", "devicePixelRatio", "clientInformation", "event", "offscreenBuffering", "screenLeft", "screenTop", "defaultStatus", "defaultstatus", "styleMedia", "isSecureContext", "performance", "queueMicrotask", "requestAnimationFrame", "cancelAnimationFrame", "captureEvents", "releaseEvents", "requestIdleCallback", "cancelIdleCallback", "getComputedStyle", "matchMedia", "moveTo", "moveBy", "resizeTo", "resizeBy", "scroll", "scrollTo", "scrollBy", "getSelection", "find", "fetch", "btoa", "atob", "setTimeout", "clearTimeout", "setInterval", "clearInterval", "createImageBitmap", "blur", "indexedDB", "sessionStorage", "localStorage"]);

    console.log(names);
</script>
