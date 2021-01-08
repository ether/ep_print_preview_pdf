/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* jshint globalstrict: false */
/* globals PDFJS */

// Initializing PDFJS global object (if still undefined)
if (typeof PDFJS === 'undefined') {
  (typeof window !== 'undefined' ? window : this).PDFJS = {};
}

PDFJS.version = '1.3.26';
PDFJS.build = '4b243cd';

(function pdfjsWrapper() {
  // Use strict in our context only - users might not want it
  'use strict';


  const globalScope = (typeof window === 'undefined') ? this : window;

  const isWorker = (typeof window === 'undefined');

  const FONT_IDENTITY_MATRIX = [0.001, 0, 0, 0.001, 0, 0];

  const TextRenderingMode = {
    FILL: 0,
    STROKE: 1,
    FILL_STROKE: 2,
    INVISIBLE: 3,
    FILL_ADD_TO_PATH: 4,
    STROKE_ADD_TO_PATH: 5,
    FILL_STROKE_ADD_TO_PATH: 6,
    ADD_TO_PATH: 7,
    FILL_STROKE_MASK: 3,
    ADD_TO_PATH_FLAG: 4,
  };

  const ImageKind = {
    GRAYSCALE_1BPP: 1,
    RGB_24BPP: 2,
    RGBA_32BPP: 3,
  };

  const AnnotationType = {
    WIDGET: 1,
    TEXT: 2,
    LINK: 3,
  };

  const AnnotationFlag = {
    INVISIBLE: 0x01,
    HIDDEN: 0x02,
    PRINT: 0x04,
    NOZOOM: 0x08,
    NOROTATE: 0x10,
    NOVIEW: 0x20,
    READONLY: 0x40,
    LOCKED: 0x80,
    TOGGLENOVIEW: 0x100,
    LOCKEDCONTENTS: 0x200,
  };

  const AnnotationBorderStyleType = {
    SOLID: 1,
    DASHED: 2,
    BEVELED: 3,
    INSET: 4,
    UNDERLINE: 5,
  };

  const StreamType = {
    UNKNOWN: 0,
    FLATE: 1,
    LZW: 2,
    DCT: 3,
    JPX: 4,
    JBIG: 5,
    A85: 6,
    AHX: 7,
    CCF: 8,
    RL: 9,
  };

  const FontType = {
    UNKNOWN: 0,
    TYPE1: 1,
    TYPE1C: 2,
    CIDFONTTYPE0: 3,
    CIDFONTTYPE0C: 4,
    TRUETYPE: 5,
    CIDFONTTYPE2: 6,
    TYPE3: 7,
    OPENTYPE: 8,
    TYPE0: 9,
    MMTYPE1: 10,
  };

  // The global PDFJS object exposes the API
  // In production, it will be declared outside a global wrapper
  // In development, it will be declared here
  if (!globalScope.PDFJS) {
    globalScope.PDFJS = {};
  }

  globalScope.PDFJS.pdfBug = false;

  PDFJS.VERBOSITY_LEVELS = {
    errors: 0,
    warnings: 1,
    infos: 5,
  };

  // All the possible operations for an operator list.
  const OPS = PDFJS.OPS = {
  // Intentionally start from 1 so it is easy to spot bad operators that will be
  // 0's.
    dependency: 1,
    setLineWidth: 2,
    setLineCap: 3,
    setLineJoin: 4,
    setMiterLimit: 5,
    setDash: 6,
    setRenderingIntent: 7,
    setFlatness: 8,
    setGState: 9,
    save: 10,
    restore: 11,
    transform: 12,
    moveTo: 13,
    lineTo: 14,
    curveTo: 15,
    curveTo2: 16,
    curveTo3: 17,
    closePath: 18,
    rectangle: 19,
    stroke: 20,
    closeStroke: 21,
    fill: 22,
    eoFill: 23,
    fillStroke: 24,
    eoFillStroke: 25,
    closeFillStroke: 26,
    closeEOFillStroke: 27,
    endPath: 28,
    clip: 29,
    eoClip: 30,
    beginText: 31,
    endText: 32,
    setCharSpacing: 33,
    setWordSpacing: 34,
    setHScale: 35,
    setLeading: 36,
    setFont: 37,
    setTextRenderingMode: 38,
    setTextRise: 39,
    moveText: 40,
    setLeadingMoveText: 41,
    setTextMatrix: 42,
    nextLine: 43,
    showText: 44,
    showSpacedText: 45,
    nextLineShowText: 46,
    nextLineSetSpacingShowText: 47,
    setCharWidth: 48,
    setCharWidthAndBounds: 49,
    setStrokeColorSpace: 50,
    setFillColorSpace: 51,
    setStrokeColor: 52,
    setStrokeColorN: 53,
    setFillColor: 54,
    setFillColorN: 55,
    setStrokeGray: 56,
    setFillGray: 57,
    setStrokeRGBColor: 58,
    setFillRGBColor: 59,
    setStrokeCMYKColor: 60,
    setFillCMYKColor: 61,
    shadingFill: 62,
    beginInlineImage: 63,
    beginImageData: 64,
    endInlineImage: 65,
    paintXObject: 66,
    markPoint: 67,
    markPointProps: 68,
    beginMarkedContent: 69,
    beginMarkedContentProps: 70,
    endMarkedContent: 71,
    beginCompat: 72,
    endCompat: 73,
    paintFormXObjectBegin: 74,
    paintFormXObjectEnd: 75,
    beginGroup: 76,
    endGroup: 77,
    beginAnnotations: 78,
    endAnnotations: 79,
    beginAnnotation: 80,
    endAnnotation: 81,
    paintJpegXObject: 82,
    paintImageMaskXObject: 83,
    paintImageMaskXObjectGroup: 84,
    paintImageXObject: 85,
    paintInlineImageXObject: 86,
    paintInlineImageXObjectGroup: 87,
    paintImageXObjectRepeat: 88,
    paintImageMaskXObjectRepeat: 89,
    paintSolidColorImageMask: 90,
    constructPath: 91,
  };

  // A notice for devs. These are good for things that are helpful to devs, such
  // as warning that Workers were disabled, which is important to devs but not
  // end users.
  function info(msg) {
    if (PDFJS.verbosity >= PDFJS.VERBOSITY_LEVELS.infos) {
      console.log(`Info: ${msg}`);
    }
  }

  // Non-fatal warnings.
  function warn(msg) {
    if (PDFJS.verbosity >= PDFJS.VERBOSITY_LEVELS.warnings) {
      console.log(`Warning: ${msg}`);
    }
  }

  // Deprecated API function -- treated as warnings.
  function deprecated(details) {
    warn(`Deprecated API usage: ${details}`);
  }

  // Fatal errors that should trigger the fallback UI and halt execution by
  // throwing an exception.
  function error(msg) {
    if (PDFJS.verbosity >= PDFJS.VERBOSITY_LEVELS.errors) {
      console.log(`Error: ${msg}`);
      console.log(backtrace());
    }
    UnsupportedManager.notify(UNSUPPORTED_FEATURES.unknown);
    throw new Error(msg);
  }

  function backtrace() {
    try {
      throw new Error();
    } catch (e) {
      return e.stack ? e.stack.split('\n').slice(2).join('\n') : '';
    }
  }

  function assert(cond, msg) {
    if (!cond) {
      error(msg);
    }
  }

  var UNSUPPORTED_FEATURES = PDFJS.UNSUPPORTED_FEATURES = {
    unknown: 'unknown',
    forms: 'forms',
    javaScript: 'javaScript',
    smask: 'smask',
    shadingPattern: 'shadingPattern',
    font: 'font',
  };

  var UnsupportedManager = PDFJS.UnsupportedManager =
  (function UnsupportedManagerClosure() {
    const listeners = [];
    return {
      listen(cb) {
        listeners.push(cb);
      },
      notify(featureId) {
        warn(`Unsupported feature "${featureId}"`);
        for (let i = 0, ii = listeners.length; i < ii; i++) {
          listeners[i](featureId);
        }
      },
    };
  })();

  // Combines two URLs. The baseUrl shall be absolute URL. If the url is an
  // absolute URL, it will be returned as is.
  function combineUrl(baseUrl, url) {
    if (!url) {
      return baseUrl;
    }
    if (/^[a-z][a-z0-9+\-.]*:/i.test(url)) {
      return url;
    }
    let i;
    if (url.charAt(0) === '/') {
    // absolute path
      i = baseUrl.indexOf('://');
      if (url.charAt(1) === '/') {
        ++i;
      } else {
        i = baseUrl.indexOf('/', i + 3);
      }
      return baseUrl.substring(0, i) + url;
    } else {
    // relative path
      let pathLength = baseUrl.length;
      i = baseUrl.lastIndexOf('#');
      pathLength = i >= 0 ? i : pathLength;
      i = baseUrl.lastIndexOf('?', pathLength);
      pathLength = i >= 0 ? i : pathLength;
      const prefixLength = baseUrl.lastIndexOf('/', pathLength);
      return baseUrl.substring(0, prefixLength + 1) + url;
    }
  }

  // Validates if URL is safe and allowed, e.g. to avoid XSS.
  function isValidUrl(url, allowRelative) {
    if (!url) {
      return false;
    }
    // RFC 3986 (http://tools.ietf.org/html/rfc3986#section-3.1)
    // scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
    let protocol = /^[a-z][a-z0-9+\-.]*(?=:)/i.exec(url);
    if (!protocol) {
      return allowRelative;
    }
    protocol = protocol[0].toLowerCase();
    switch (protocol) {
      case 'http':
      case 'https':
      case 'ftp':
      case 'mailto':
      case 'tel':
        return true;
      default:
        return false;
    }
  }
  PDFJS.isValidUrl = isValidUrl;

  function shadow(obj, prop, value) {
    Object.defineProperty(obj, prop, {value,
      enumerable: true,
      configurable: true,
      writable: false});
    return value;
  }
  PDFJS.shadow = shadow;

  const LinkTarget = PDFJS.LinkTarget = {
    NONE: 0, // Default value.
    SELF: 1,
    BLANK: 2,
    PARENT: 3,
    TOP: 4,
  };
  const LinkTargetStringMap = [
    '',
    '_self',
    '_blank',
    '_parent',
    '_top',
  ];

  function isExternalLinkTargetSet() {
    if (PDFJS.openExternalLinksInNewWindow) {
      warn('PDFJS.openExternalLinksInNewWindow is deprecated, ' +
         'use PDFJS.externalLinkTarget instead.');
      if (PDFJS.externalLinkTarget === LinkTarget.NONE) {
        PDFJS.externalLinkTarget = LinkTarget.BLANK;
      }
      // Reset the deprecated parameter, to suppress further warnings.
      PDFJS.openExternalLinksInNewWindow = false;
    }
    switch (PDFJS.externalLinkTarget) {
      case LinkTarget.NONE:
        return false;
      case LinkTarget.SELF:
      case LinkTarget.BLANK:
      case LinkTarget.PARENT:
      case LinkTarget.TOP:
        return true;
    }
    warn(`PDFJS.externalLinkTarget is invalid: ${PDFJS.externalLinkTarget}`);
    // Reset the external link target, to suppress further warnings.
    PDFJS.externalLinkTarget = LinkTarget.NONE;
    return false;
  }
  PDFJS.isExternalLinkTargetSet = isExternalLinkTargetSet;

  const PasswordResponses = PDFJS.PasswordResponses = {
    NEED_PASSWORD: 1,
    INCORRECT_PASSWORD: 2,
  };

  const PasswordException = (function PasswordExceptionClosure() {
    function PasswordException(msg, code) {
      this.name = 'PasswordException';
      this.message = msg;
      this.code = code;
    }

    PasswordException.prototype = new Error();
    PasswordException.constructor = PasswordException;

    return PasswordException;
  })();
  PDFJS.PasswordException = PasswordException;

  const UnknownErrorException = (function UnknownErrorExceptionClosure() {
    function UnknownErrorException(msg, details) {
      this.name = 'UnknownErrorException';
      this.message = msg;
      this.details = details;
    }

    UnknownErrorException.prototype = new Error();
    UnknownErrorException.constructor = UnknownErrorException;

    return UnknownErrorException;
  })();
  PDFJS.UnknownErrorException = UnknownErrorException;

  const InvalidPDFException = (function InvalidPDFExceptionClosure() {
    function InvalidPDFException(msg) {
      this.name = 'InvalidPDFException';
      this.message = msg;
    }

    InvalidPDFException.prototype = new Error();
    InvalidPDFException.constructor = InvalidPDFException;

    return InvalidPDFException;
  })();
  PDFJS.InvalidPDFException = InvalidPDFException;

  const MissingPDFException = (function MissingPDFExceptionClosure() {
    function MissingPDFException(msg) {
      this.name = 'MissingPDFException';
      this.message = msg;
    }

    MissingPDFException.prototype = new Error();
    MissingPDFException.constructor = MissingPDFException;

    return MissingPDFException;
  })();
  PDFJS.MissingPDFException = MissingPDFException;

  const UnexpectedResponseException =
    (function UnexpectedResponseExceptionClosure() {
      function UnexpectedResponseException(msg, status) {
        this.name = 'UnexpectedResponseException';
        this.message = msg;
        this.status = status;
      }

      UnexpectedResponseException.prototype = new Error();
      UnexpectedResponseException.constructor = UnexpectedResponseException;

      return UnexpectedResponseException;
    })();
  PDFJS.UnexpectedResponseException = UnexpectedResponseException;

  const NotImplementedException = (function NotImplementedExceptionClosure() {
    function NotImplementedException(msg) {
      this.message = msg;
    }

    NotImplementedException.prototype = new Error();
    NotImplementedException.prototype.name = 'NotImplementedException';
    NotImplementedException.constructor = NotImplementedException;

    return NotImplementedException;
  })();

  const MissingDataException = (function MissingDataExceptionClosure() {
    function MissingDataException(begin, end) {
      this.begin = begin;
      this.end = end;
      this.message = `Missing data [${begin}, ${end})`;
    }

    MissingDataException.prototype = new Error();
    MissingDataException.prototype.name = 'MissingDataException';
    MissingDataException.constructor = MissingDataException;

    return MissingDataException;
  })();

  const XRefParseException = (function XRefParseExceptionClosure() {
    function XRefParseException(msg) {
      this.message = msg;
    }

    XRefParseException.prototype = new Error();
    XRefParseException.prototype.name = 'XRefParseException';
    XRefParseException.constructor = XRefParseException;

    return XRefParseException;
  })();


  function bytesToString(bytes) {
    assert(bytes !== null && typeof bytes === 'object' &&
         bytes.length !== undefined, 'Invalid argument for bytesToString');
    const length = bytes.length;
    const MAX_ARGUMENT_COUNT = 8192;
    if (length < MAX_ARGUMENT_COUNT) {
      return String.fromCharCode.apply(null, bytes);
    }
    const strBuf = [];
    for (let i = 0; i < length; i += MAX_ARGUMENT_COUNT) {
      const chunkEnd = Math.min(i + MAX_ARGUMENT_COUNT, length);
      const chunk = bytes.subarray(i, chunkEnd);
      strBuf.push(String.fromCharCode.apply(null, chunk));
    }
    return strBuf.join('');
  }

  function stringToBytes(str) {
    assert(typeof str === 'string', 'Invalid argument for stringToBytes');
    const length = str.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; ++i) {
      bytes[i] = str.charCodeAt(i) & 0xFF;
    }
    return bytes;
  }

  function string32(value) {
    return String.fromCharCode((value >> 24) & 0xff, (value >> 16) & 0xff,
        (value >> 8) & 0xff, value & 0xff);
  }

  function log2(x) {
    let n = 1; let
      i = 0;
    while (x > n) {
      n <<= 1;
      i++;
    }
    return i;
  }

  function readInt8(data, start) {
    return (data[start] << 24) >> 24;
  }

  function readUint16(data, offset) {
    return (data[offset] << 8) | data[offset + 1];
  }

  function readUint32(data, offset) {
    return ((data[offset] << 24) | (data[offset + 1] << 16) |
         (data[offset + 2] << 8) | data[offset + 3]) >>> 0;
  }

  // Lazy test the endianness of the platform
  // NOTE: This will be 'true' for simulated TypedArrays
  function isLittleEndian() {
    const buffer8 = new Uint8Array(2);
    buffer8[0] = 1;
    const buffer16 = new Uint16Array(buffer8.buffer);
    return (buffer16[0] === 1);
  }

  Object.defineProperty(PDFJS, 'isLittleEndian', {
    configurable: true,
    get: function PDFJS_isLittleEndian() {
      return shadow(PDFJS, 'isLittleEndian', isLittleEndian());
    },
  });

  // Lazy test if the userAgent support CanvasTypedArrays
  function hasCanvasTypedArrays() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(1, 1);
    return (typeof imageData.data.buffer !== 'undefined');
  }

  Object.defineProperty(PDFJS, 'hasCanvasTypedArrays', {
    configurable: true,
    get: function PDFJS_hasCanvasTypedArrays() {
      return shadow(PDFJS, 'hasCanvasTypedArrays', hasCanvasTypedArrays());
    },
  });

  const Uint32ArrayView = (function Uint32ArrayViewClosure() {
    function Uint32ArrayView(buffer, length) {
      this.buffer = buffer;
      this.byteLength = buffer.length;
      this.length = length === undefined ? (this.byteLength >> 2) : length;
      ensureUint32ArrayViewProps(this.length);
    }
    Uint32ArrayView.prototype = Object.create(null);

    let uint32ArrayViewSetters = 0;
    function createUint32ArrayProp(index) {
      return {
        get() {
          const buffer = this.buffer; const
            offset = index << 2;
          return (buffer[offset] | (buffer[offset + 1] << 8) |
          (buffer[offset + 2] << 16) | (buffer[offset + 3] << 24)) >>> 0;
        },
        set(value) {
          const buffer = this.buffer; const
            offset = index << 2;
          buffer[offset] = value & 255;
          buffer[offset + 1] = (value >> 8) & 255;
          buffer[offset + 2] = (value >> 16) & 255;
          buffer[offset + 3] = (value >>> 24) & 255;
        },
      };
    }

    function ensureUint32ArrayViewProps(length) {
      while (uint32ArrayViewSetters < length) {
        Object.defineProperty(Uint32ArrayView.prototype,
            uint32ArrayViewSetters,
            createUint32ArrayProp(uint32ArrayViewSetters));
        uint32ArrayViewSetters++;
      }
    }

    return Uint32ArrayView;
  })();

  const IDENTITY_MATRIX = [1, 0, 0, 1, 0, 0];

  const Util = PDFJS.Util = (function UtilClosure() {
    function Util() {}

    const rgbBuf = ['rgb(', 0, ',', 0, ',', 0, ')'];

    // makeCssRgb() can be called thousands of times. Using |rgbBuf| avoids
    // creating many intermediate strings.
    Util.makeCssRgb = function Util_makeCssRgb(r, g, b) {
      rgbBuf[1] = r;
      rgbBuf[3] = g;
      rgbBuf[5] = b;
      return rgbBuf.join('');
    };

    // Concatenates two transformation matrices together and returns the result.
    Util.transform = function Util_transform(m1, m2) {
      return [
        m1[0] * m2[0] + m1[2] * m2[1],
        m1[1] * m2[0] + m1[3] * m2[1],
        m1[0] * m2[2] + m1[2] * m2[3],
        m1[1] * m2[2] + m1[3] * m2[3],
        m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
        m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
      ];
    };

    // For 2d affine transforms
    Util.applyTransform = function Util_applyTransform(p, m) {
      const xt = p[0] * m[0] + p[1] * m[2] + m[4];
      const yt = p[0] * m[1] + p[1] * m[3] + m[5];
      return [xt, yt];
    };

    Util.applyInverseTransform = function Util_applyInverseTransform(p, m) {
      const d = m[0] * m[3] - m[1] * m[2];
      const xt = (p[0] * m[3] - p[1] * m[2] + m[2] * m[5] - m[4] * m[3]) / d;
      const yt = (-p[0] * m[1] + p[1] * m[0] + m[4] * m[1] - m[5] * m[0]) / d;
      return [xt, yt];
    };

    // Applies the transform to the rectangle and finds the minimum axially
    // aligned bounding box.
    Util.getAxialAlignedBoundingBox =
    function Util_getAxialAlignedBoundingBox(r, m) {
      const p1 = Util.applyTransform(r, m);
      const p2 = Util.applyTransform(r.slice(2, 4), m);
      const p3 = Util.applyTransform([r[0], r[3]], m);
      const p4 = Util.applyTransform([r[2], r[1]], m);
      return [
        Math.min(p1[0], p2[0], p3[0], p4[0]),
        Math.min(p1[1], p2[1], p3[1], p4[1]),
        Math.max(p1[0], p2[0], p3[0], p4[0]),
        Math.max(p1[1], p2[1], p3[1], p4[1]),
      ];
    };

    Util.inverseTransform = function Util_inverseTransform(m) {
      const d = m[0] * m[3] - m[1] * m[2];
      return [m[3] / d,
        -m[1] / d,
        -m[2] / d,
        m[0] / d,
        (m[2] * m[5] - m[4] * m[3]) / d,
        (m[4] * m[1] - m[5] * m[0]) / d];
    };

    // Apply a generic 3d matrix M on a 3-vector v:
    //   | a b c |   | X |
    //   | d e f | x | Y |
    //   | g h i |   | Z |
    // M is assumed to be serialized as [a,b,c,d,e,f,g,h,i],
    // with v as [X,Y,Z]
    Util.apply3dTransform = function Util_apply3dTransform(m, v) {
      return [
        m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
        m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
        m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
      ];
    };

    // This calculation uses Singular Value Decomposition.
    // The SVD can be represented with formula A = USV. We are interested in the
    // matrix S here because it represents the scale values.
    Util.singularValueDecompose2dScale =
    function Util_singularValueDecompose2dScale(m) {
      const transpose = [m[0], m[2], m[1], m[3]];

      // Multiply matrix m with its transpose.
      const a = m[0] * transpose[0] + m[1] * transpose[2];
      const b = m[0] * transpose[1] + m[1] * transpose[3];
      const c = m[2] * transpose[0] + m[3] * transpose[2];
      const d = m[2] * transpose[1] + m[3] * transpose[3];

      // Solve the second degree polynomial to get roots.
      const first = (a + d) / 2;
      const second = Math.sqrt((a + d) * (a + d) - 4 * (a * d - c * b)) / 2;
      const sx = first + second || 1;
      const sy = first - second || 1;

      // Scale values are the square roots of the eigenvalues.
      return [Math.sqrt(sx), Math.sqrt(sy)];
    };

    // Normalize rectangle rect=[x1, y1, x2, y2] so that (x1,y1) < (x2,y2)
    // For coordinate systems whose origin lies in the bottom-left, this
    // means normalization to (BL,TR) ordering. For systems with origin in the
    // top-left, this means (TL,BR) ordering.
    Util.normalizeRect = function Util_normalizeRect(rect) {
      const r = rect.slice(0); // clone rect
      if (rect[0] > rect[2]) {
        r[0] = rect[2];
        r[2] = rect[0];
      }
      if (rect[1] > rect[3]) {
        r[1] = rect[3];
        r[3] = rect[1];
      }
      return r;
    };

    // Returns a rectangle [x1, y1, x2, y2] corresponding to the
    // intersection of rect1 and rect2. If no intersection, returns 'false'
    // The rectangle coordinates of rect1, rect2 should be [x1, y1, x2, y2]
    Util.intersect = function Util_intersect(rect1, rect2) {
      function compare(a, b) {
        return a - b;
      }

      // Order points along the axes
      const orderedX = [rect1[0], rect1[2], rect2[0], rect2[2]].sort(compare);
      const orderedY = [rect1[1], rect1[3], rect2[1], rect2[3]].sort(compare);
      const result = [];

      rect1 = Util.normalizeRect(rect1);
      rect2 = Util.normalizeRect(rect2);

      // X: first and second points belong to different rectangles?
      if ((orderedX[0] === rect1[0] && orderedX[1] === rect2[0]) ||
        (orderedX[0] === rect2[0] && orderedX[1] === rect1[0])) {
      // Intersection must be between second and third points
        result[0] = orderedX[1];
        result[2] = orderedX[2];
      } else {
        return false;
      }

      // Y: first and second points belong to different rectangles?
      if ((orderedY[0] === rect1[1] && orderedY[1] === rect2[1]) ||
        (orderedY[0] === rect2[1] && orderedY[1] === rect1[1])) {
      // Intersection must be between second and third points
        result[1] = orderedY[1];
        result[3] = orderedY[2];
      } else {
        return false;
      }

      return result;
    };

    Util.sign = function Util_sign(num) {
      return num < 0 ? -1 : 1;
    };

    Util.appendToArray = function Util_appendToArray(arr1, arr2) {
      Array.prototype.push.apply(arr1, arr2);
    };

    Util.prependToArray = function Util_prependToArray(arr1, arr2) {
      Array.prototype.unshift.apply(arr1, arr2);
    };

    Util.extendObj = function extendObj(obj1, obj2) {
      for (const key in obj2) {
        obj1[key] = obj2[key];
      }
    };

    Util.getInheritableProperty = function Util_getInheritableProperty(dict,
        name) {
      while (dict && !dict.has(name)) {
        dict = dict.get('Parent');
      }
      if (!dict) {
        return null;
      }
      return dict.get(name);
    };

    Util.inherit = function Util_inherit(sub, base, prototype) {
      sub.prototype = Object.create(base.prototype);
      sub.prototype.constructor = sub;
      for (const prop in prototype) {
        sub.prototype[prop] = prototype[prop];
      }
    };

    Util.loadScript = function Util_loadScript(src, callback) {
      const script = document.createElement('script');
      let loaded = false;
      script.setAttribute('src', src);
      if (callback) {
        script.onload = function () {
          if (!loaded) {
            callback();
          }
          loaded = true;
        };
      }
      document.getElementsByTagName('head')[0].appendChild(script);
    };

    return Util;
  })();

  /**
 * PDF page viewport created based on scale, rotation and offset.
 * @class
 * @alias PDFJS.PageViewport
 */
  const PageViewport = PDFJS.PageViewport = (function PageViewportClosure() {
  /**
   * @constructor
   * @private
   * @param viewBox {Array} xMin, yMin, xMax and yMax coordinates.
   * @param scale {number} scale of the viewport.
   * @param rotation {number} rotations of the viewport in degrees.
   * @param offsetX {number} offset X
   * @param offsetY {number} offset Y
   * @param dontFlip {boolean} if true, axis Y will not be flipped.
   */
    function PageViewport(viewBox, scale, rotation, offsetX, offsetY, dontFlip) {
      this.viewBox = viewBox;
      this.scale = scale;
      this.rotation = rotation;
      this.offsetX = offsetX;
      this.offsetY = offsetY;

      // creating transform to convert pdf coordinate system to the normal
      // canvas like coordinates taking in account scale and rotation
      const centerX = (viewBox[2] + viewBox[0]) / 2;
      const centerY = (viewBox[3] + viewBox[1]) / 2;
      let rotateA, rotateB, rotateC, rotateD;
      rotation %= 360;
      rotation = rotation < 0 ? rotation + 360 : rotation;
      switch (rotation) {
        case 180:
          rotateA = -1; rotateB = 0; rotateC = 0; rotateD = 1;
          break;
        case 90:
          rotateA = 0; rotateB = 1; rotateC = 1; rotateD = 0;
          break;
        case 270:
          rotateA = 0; rotateB = -1; rotateC = -1; rotateD = 0;
          break;
          // case 0:
        default:
          rotateA = 1; rotateB = 0; rotateC = 0; rotateD = -1;
          break;
      }

      if (dontFlip) {
        rotateC = -rotateC; rotateD = -rotateD;
      }

      let offsetCanvasX, offsetCanvasY;
      let width, height;
      if (rotateA === 0) {
        offsetCanvasX = Math.abs(centerY - viewBox[1]) * scale + offsetX;
        offsetCanvasY = Math.abs(centerX - viewBox[0]) * scale + offsetY;
        width = Math.abs(viewBox[3] - viewBox[1]) * scale;
        height = Math.abs(viewBox[2] - viewBox[0]) * scale;
      } else {
        offsetCanvasX = Math.abs(centerX - viewBox[0]) * scale + offsetX;
        offsetCanvasY = Math.abs(centerY - viewBox[1]) * scale + offsetY;
        width = Math.abs(viewBox[2] - viewBox[0]) * scale;
        height = Math.abs(viewBox[3] - viewBox[1]) * scale;
      }
      // creating transform for the following operations:
      // translate(-centerX, -centerY), rotate and flip vertically,
      // scale, and translate(offsetCanvasX, offsetCanvasY)
      this.transform = [
        rotateA * scale,
        rotateB * scale,
        rotateC * scale,
        rotateD * scale,
        offsetCanvasX - rotateA * scale * centerX - rotateC * scale * centerY,
        offsetCanvasY - rotateB * scale * centerX - rotateD * scale * centerY,
      ];

      this.width = width;
      this.height = height;
      this.fontScale = scale;
    }
    PageViewport.prototype = /** @lends PDFJS.PageViewport.prototype */ {
    /**
     * Clones viewport with additional properties.
     * @param args {Object} (optional) If specified, may contain the 'scale' or
     * 'rotation' properties to override the corresponding properties in
     * the cloned viewport.
     * @returns {PDFJS.PageViewport} Cloned viewport.
     */
      clone: function PageViewPort_clone(args) {
        args = args || {};
        const scale = 'scale' in args ? args.scale : this.scale;
        const rotation = 'rotation' in args ? args.rotation : this.rotation;
        return new PageViewport(this.viewBox.slice(), scale, rotation,
            this.offsetX, this.offsetY, args.dontFlip);
      },
      /**
     * Converts PDF point to the viewport coordinates. For examples, useful for
     * converting PDF location into canvas pixel coordinates.
     * @param x {number} X coordinate.
     * @param y {number} Y coordinate.
     * @returns {Object} Object that contains 'x' and 'y' properties of the
     * point in the viewport coordinate space.
     * @see {@link convertToPdfPoint}
     * @see {@link convertToViewportRectangle}
     */
      convertToViewportPoint: function PageViewport_convertToViewportPoint(x, y) {
        return Util.applyTransform([x, y], this.transform);
      },
      /**
     * Converts PDF rectangle to the viewport coordinates.
     * @param rect {Array} xMin, yMin, xMax and yMax coordinates.
     * @returns {Array} Contains corresponding coordinates of the rectangle
     * in the viewport coordinate space.
     * @see {@link convertToViewportPoint}
     */
      convertToViewportRectangle:
      function PageViewport_convertToViewportRectangle(rect) {
        const tl = Util.applyTransform([rect[0], rect[1]], this.transform);
        const br = Util.applyTransform([rect[2], rect[3]], this.transform);
        return [tl[0], tl[1], br[0], br[1]];
      },
      /**
     * Converts viewport coordinates to the PDF location. For examples, useful
     * for converting canvas pixel location into PDF one.
     * @param x {number} X coordinate.
     * @param y {number} Y coordinate.
     * @returns {Object} Object that contains 'x' and 'y' properties of the
     * point in the PDF coordinate space.
     * @see {@link convertToViewportPoint}
     */
      convertToPdfPoint: function PageViewport_convertToPdfPoint(x, y) {
        return Util.applyInverseTransform([x, y], this.transform);
      },
    };
    return PageViewport;
  })();

  const PDFStringTranslateTable = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0x2D8,
    0x2C7,
    0x2C6,
    0x2D9,
    0x2DD,
    0x2DB,
    0x2DA,
    0x2DC,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0x2022,
    0x2020,
    0x2021,
    0x2026,
    0x2014,
    0x2013,
    0x192,
    0x2044,
    0x2039,
    0x203A,
    0x2212,
    0x2030,
    0x201E,
    0x201C,
    0x201D,
    0x2018,
    0x2019,
    0x201A,
    0x2122,
    0xFB01,
    0xFB02,
    0x141,
    0x152,
    0x160,
    0x178,
    0x17D,
    0x131,
    0x142,
    0x153,
    0x161,
    0x17E,
    0,
    0x20AC,
  ];

  function stringToPDFString(str) {
    let i; const n = str.length; const
      strBuf = [];
    if (str[0] === '\xFE' && str[1] === '\xFF') {
    // UTF16BE BOM
      for (i = 2; i < n; i += 2) {
        strBuf.push(String.fromCharCode(
            (str.charCodeAt(i) << 8) | str.charCodeAt(i + 1)));
      }
    } else {
      for (i = 0; i < n; ++i) {
        const code = PDFStringTranslateTable[str.charCodeAt(i)];
        strBuf.push(code ? String.fromCharCode(code) : str.charAt(i));
      }
    }
    return strBuf.join('');
  }

  function stringToUTF8String(str) {
    return decodeURIComponent(escape(str));
  }

  function utf8StringToString(str) {
    return unescape(encodeURIComponent(str));
  }

  function isEmptyObj(obj) {
    for (const key in obj) {
      return false;
    }
    return true;
  }

  function isBool(v) {
    return typeof v === 'boolean';
  }

  function isInt(v) {
    return typeof v === 'number' && ((v | 0) === v);
  }

  function isNum(v) {
    return typeof v === 'number';
  }

  function isString(v) {
    return typeof v === 'string';
  }

  function isName(v) {
    return v instanceof Name;
  }

  function isCmd(v, cmd) {
    return v instanceof Cmd && (cmd === undefined || v.cmd === cmd);
  }

  function isDict(v, type) {
    if (!(v instanceof Dict)) {
      return false;
    }
    if (!type) {
      return true;
    }
    const dictType = v.get('Type');
    return isName(dictType) && dictType.name === type;
  }

  function isArray(v) {
    return v instanceof Array;
  }

  function isStream(v) {
    return typeof v === 'object' && v !== null && v.getBytes !== undefined;
  }

  function isArrayBuffer(v) {
    return typeof v === 'object' && v !== null && v.byteLength !== undefined;
  }

  function isRef(v) {
    return v instanceof Ref;
  }

  /**
 * Promise Capability object.
 *
 * @typedef {Object} PromiseCapability
 * @property {Promise} promise - A promise object.
 * @property {function} resolve - Fullfills the promise.
 * @property {function} reject - Rejects the promise.
 */

  /**
 * Creates a promise capability object.
 * @alias PDFJS.createPromiseCapability
 *
 * @return {PromiseCapability} A capability object contains:
 * - a Promise, resolve and reject methods.
 */
  function createPromiseCapability() {
    const capability = {};
    capability.promise = new Promise((resolve, reject) => {
      capability.resolve = resolve;
      capability.reject = reject;
    });
    return capability;
  }

  PDFJS.createPromiseCapability = createPromiseCapability;

  /**
 * Polyfill for Promises:
 * The following promise implementation tries to generally implement the
 * Promise/A+ spec. Some notable differences from other promise libaries are:
 * - There currently isn't a seperate deferred and promise object.
 * - Unhandled rejections eventually show an error if they aren't handled.
 *
 * Based off of the work in:
 * https://bugzilla.mozilla.org/show_bug.cgi?id=810490
 */
  (function PromiseClosure() {
    if (globalScope.Promise) {
    // Promises existing in the DOM/Worker, checking presence of all/resolve
      if (typeof globalScope.Promise.all !== 'function') {
        globalScope.Promise.all = function (iterable) {
          let count = 0; const results = []; let resolve; let reject;
          const promise = new globalScope.Promise((resolve_, reject_) => {
            resolve = resolve_;
            reject = reject_;
          });
          iterable.forEach((p, i) => {
            count++;
            p.then((result) => {
              results[i] = result;
              count--;
              if (count === 0) {
                resolve(results);
              }
            }, reject);
          });
          if (count === 0) {
            resolve(results);
          }
          return promise;
        };
      }
      if (typeof globalScope.Promise.resolve !== 'function') {
        globalScope.Promise.resolve = function (value) {
          return new globalScope.Promise((resolve) => { resolve(value); });
        };
      }
      if (typeof globalScope.Promise.reject !== 'function') {
        globalScope.Promise.reject = function (reason) {
          return new globalScope.Promise((resolve, reject) => {
            reject(reason);
          });
        };
      }
      if (typeof globalScope.Promise.prototype.catch !== 'function') {
        globalScope.Promise.prototype.catch = function (onReject) {
          return globalScope.Promise.prototype.then(undefined, onReject);
        };
      }
      return;
    }
    const STATUS_PENDING = 0;
    const STATUS_RESOLVED = 1;
    const STATUS_REJECTED = 2;

    // In an attempt to avoid silent exceptions, unhandled rejections are
    // tracked and if they aren't handled in a certain amount of time an
    // error is logged.
    const REJECTION_TIMEOUT = 500;

    const HandlerManager = {
      handlers: [],
      running: false,
      unhandledRejections: [],
      pendingRejectionCheck: false,

      scheduleHandlers: function scheduleHandlers(promise) {
        if (promise._status === STATUS_PENDING) {
          return;
        }

        this.handlers = this.handlers.concat(promise._handlers);
        promise._handlers = [];

        if (this.running) {
          return;
        }
        this.running = true;

        setTimeout(this.runHandlers.bind(this), 0);
      },

      runHandlers: function runHandlers() {
        const RUN_TIMEOUT = 1; // ms
        const timeoutAt = Date.now() + RUN_TIMEOUT;
        while (this.handlers.length > 0) {
          const handler = this.handlers.shift();

          let nextStatus = handler.thisPromise._status;
          let nextValue = handler.thisPromise._value;

          try {
            if (nextStatus === STATUS_RESOLVED) {
              if (typeof handler.onResolve === 'function') {
                nextValue = handler.onResolve(nextValue);
              }
            } else if (typeof handler.onReject === 'function') {
              nextValue = handler.onReject(nextValue);
              nextStatus = STATUS_RESOLVED;

              if (handler.thisPromise._unhandledRejection) {
                this.removeUnhandeledRejection(handler.thisPromise);
              }
            }
          } catch (ex) {
            nextStatus = STATUS_REJECTED;
            nextValue = ex;
          }

          handler.nextPromise._updateStatus(nextStatus, nextValue);
          if (Date.now() >= timeoutAt) {
            break;
          }
        }

        if (this.handlers.length > 0) {
          setTimeout(this.runHandlers.bind(this), 0);
          return;
        }

        this.running = false;
      },

      addUnhandledRejection: function addUnhandledRejection(promise) {
        this.unhandledRejections.push({
          promise,
          time: Date.now(),
        });
        this.scheduleRejectionCheck();
      },

      removeUnhandeledRejection: function removeUnhandeledRejection(promise) {
        promise._unhandledRejection = false;
        for (let i = 0; i < this.unhandledRejections.length; i++) {
          if (this.unhandledRejections[i].promise === promise) {
            this.unhandledRejections.splice(i);
            i--;
          }
        }
      },

      scheduleRejectionCheck: function scheduleRejectionCheck() {
        if (this.pendingRejectionCheck) {
          return;
        }
        this.pendingRejectionCheck = true;
        setTimeout(() => {
          this.pendingRejectionCheck = false;
          const now = Date.now();
          for (let i = 0; i < this.unhandledRejections.length; i++) {
            if (now - this.unhandledRejections[i].time > REJECTION_TIMEOUT) {
              const unhandled = this.unhandledRejections[i].promise._value;
              let msg = `Unhandled rejection: ${unhandled}`;
              if (unhandled.stack) {
                msg += `\n${unhandled.stack}`;
              }
              warn(msg);
              this.unhandledRejections.splice(i);
              i--;
            }
          }
          if (this.unhandledRejections.length) {
            this.scheduleRejectionCheck();
          }
        }, REJECTION_TIMEOUT);
      },
    };

    function Promise(resolver) {
      this._status = STATUS_PENDING;
      this._handlers = [];
      try {
        resolver.call(this, this._resolve.bind(this), this._reject.bind(this));
      } catch (e) {
        this._reject(e);
      }
    }
    /**
   * Builds a promise that is resolved when all the passed in promises are
   * resolved.
   * @param {array} array of data and/or promises to wait for.
   * @return {Promise} New dependant promise.
   */
    Promise.all = function Promise_all(promises) {
      let resolveAll, rejectAll;
      const deferred = new Promise((resolve, reject) => {
        resolveAll = resolve;
        rejectAll = reject;
      });
      let unresolved = promises.length;
      let results = [];
      if (unresolved === 0) {
        resolveAll(results);
        return deferred;
      }
      function reject(reason) {
        if (deferred._status === STATUS_REJECTED) {
          return;
        }
        results = [];
        rejectAll(reason);
      }
      for (let i = 0, ii = promises.length; i < ii; ++i) {
        const promise = promises[i];
        const resolve = (function (i) {
          return function (value) {
            if (deferred._status === STATUS_REJECTED) {
              return;
            }
            results[i] = value;
            unresolved--;
            if (unresolved === 0) {
              resolveAll(results);
            }
          };
        })(i);
        if (Promise.isPromise(promise)) {
          promise.then(resolve, reject);
        } else {
          resolve(promise);
        }
      }
      return deferred;
    };

    /**
   * Checks if the value is likely a promise (has a 'then' function).
   * @return {boolean} true if value is thenable
   */
    Promise.isPromise = function Promise_isPromise(value) {
      return value && typeof value.then === 'function';
    };

    /**
   * Creates resolved promise
   * @param value resolve value
   * @returns {Promise}
   */
    Promise.resolve = function Promise_resolve(value) {
      return new Promise((resolve) => { resolve(value); });
    };

    /**
   * Creates rejected promise
   * @param reason rejection value
   * @returns {Promise}
   */
    Promise.reject = function Promise_reject(reason) {
      return new Promise((resolve, reject) => { reject(reason); });
    };

    Promise.prototype = {
      _status: null,
      _value: null,
      _handlers: null,
      _unhandledRejection: null,

      _updateStatus: function Promise__updateStatus(status, value) {
        if (this._status === STATUS_RESOLVED ||
          this._status === STATUS_REJECTED) {
          return;
        }

        if (status === STATUS_RESOLVED &&
          Promise.isPromise(value)) {
          value.then(this._updateStatus.bind(this, STATUS_RESOLVED),
              this._updateStatus.bind(this, STATUS_REJECTED));
          return;
        }

        this._status = status;
        this._value = value;

        if (status === STATUS_REJECTED && this._handlers.length === 0) {
          this._unhandledRejection = true;
          HandlerManager.addUnhandledRejection(this);
        }

        HandlerManager.scheduleHandlers(this);
      },

      _resolve: function Promise_resolve(value) {
        this._updateStatus(STATUS_RESOLVED, value);
      },

      _reject: function Promise_reject(reason) {
        this._updateStatus(STATUS_REJECTED, reason);
      },

      then: function Promise_then(onResolve, onReject) {
        const nextPromise = new Promise(function (resolve, reject) {
          this.resolve = resolve;
          this.reject = reject;
        });
        this._handlers.push({
          thisPromise: this,
          onResolve,
          onReject,
          nextPromise,
        });
        HandlerManager.scheduleHandlers(this);
        return nextPromise;
      },

      catch: function Promise_catch(onReject) {
        return this.then(undefined, onReject);
      },
    };

    globalScope.Promise = Promise;
  })();

  const StatTimer = (function StatTimerClosure() {
    function rpad(str, pad, length) {
      while (str.length < length) {
        str += pad;
      }
      return str;
    }
    function StatTimer() {
      this.started = {};
      this.times = [];
      this.enabled = true;
    }
    StatTimer.prototype = {
      time: function StatTimer_time(name) {
        if (!this.enabled) {
          return;
        }
        if (name in this.started) {
          warn(`Timer is already running for ${name}`);
        }
        this.started[name] = Date.now();
      },
      timeEnd: function StatTimer_timeEnd(name) {
        if (!this.enabled) {
          return;
        }
        if (!(name in this.started)) {
          warn(`Timer has not been started for ${name}`);
        }
        this.times.push({
          name,
          start: this.started[name],
          end: Date.now(),
        });
        // Remove timer from started so it can be called again.
        delete this.started[name];
      },
      toString: function StatTimer_toString() {
        let i, ii;
        const times = this.times;
        let out = '';
        // Find the longest name for padding purposes.
        let longest = 0;
        for (i = 0, ii = times.length; i < ii; ++i) {
          const name = times[i].name;
          if (name.length > longest) {
            longest = name.length;
          }
        }
        for (i = 0, ii = times.length; i < ii; ++i) {
          const span = times[i];
          const duration = span.end - span.start;
          out += `${rpad(span.name, ' ', longest)} ${duration}ms\n`;
        }
        return out;
      },
    };
    return StatTimer;
  })();

  PDFJS.createBlob = function createBlob(data, contentType) {
    if (typeof Blob !== 'undefined') {
      return new Blob([data], {type: contentType});
    }
    // Blob builder is deprecated in FF14 and removed in FF18.
    const bb = new MozBlobBuilder();
    bb.append(data);
    return bb.getBlob(contentType);
  };

  PDFJS.createObjectURL = (function createObjectURLClosure() {
  // Blob/createObjectURL is not available, falling back to data schema.
    const digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return function createObjectURL(data, contentType) {
      if (!PDFJS.disableCreateObjectURL &&
        typeof URL !== 'undefined' && URL.createObjectURL) {
        const blob = PDFJS.createBlob(data, contentType);
        return URL.createObjectURL(blob);
      }

      let buffer = `data:${contentType};base64,`;
      for (let i = 0, ii = data.length; i < ii; i += 3) {
        const b1 = data[i] & 0xFF;
        const b2 = data[i + 1] & 0xFF;
        const b3 = data[i + 2] & 0xFF;
        const d1 = b1 >> 2; const
          d2 = ((b1 & 3) << 4) | (b2 >> 4);
        const d3 = i + 1 < ii ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
        const d4 = i + 2 < ii ? (b3 & 0x3F) : 64;
        buffer += digits[d1] + digits[d2] + digits[d3] + digits[d4];
      }
      return buffer;
    };
  })();

  function MessageHandler(name, comObj) {
    this.name = name;
    this.comObj = comObj;
    this.callbackIndex = 1;
    this.postMessageTransfers = true;
    const callbacksCapabilities = this.callbacksCapabilities = {};
    const ah = this.actionHandler = {};

    ah.console_log = [function ahConsoleLog(data) {
      console.log.apply(console, data);
    }];
    ah.console_error = [function ahConsoleError(data) {
      console.error.apply(console, data);
    }];
    ah._unsupported_feature = [function ah_unsupportedFeature(data) {
      UnsupportedManager.notify(data);
    }];

    comObj.onmessage = function messageHandlerComObjOnMessage(event) {
      const data = event.data;
      if (data.isReply) {
        const callbackId = data.callbackId;
        if (data.callbackId in callbacksCapabilities) {
          const callback = callbacksCapabilities[callbackId];
          delete callbacksCapabilities[callbackId];
          if ('error' in data) {
            callback.reject(data.error);
          } else {
            callback.resolve(data.data);
          }
        } else {
          error(`Cannot resolve callback ${callbackId}`);
        }
      } else if (data.action in ah) {
        const action = ah[data.action];
        if (data.callbackId) {
          Promise.resolve().then(() => action[0].call(action[1], data.data)).then((result) => {
            comObj.postMessage({
              isReply: true,
              callbackId: data.callbackId,
              data: result,
            });
          }, (reason) => {
            if (reason instanceof Error) {
            // Serialize error to avoid "DataCloneError"
              reason = `${reason}`;
            }
            comObj.postMessage({
              isReply: true,
              callbackId: data.callbackId,
              error: reason,
            });
          });
        } else {
          action[0].call(action[1], data.data);
        }
      } else {
        error(`Unknown action from worker: ${data.action}`);
      }
    };
  }

  MessageHandler.prototype = {
    on: function messageHandlerOn(actionName, handler, scope) {
      const ah = this.actionHandler;
      if (ah[actionName]) {
        error(`There is already an actionName called "${actionName}"`);
      }
      ah[actionName] = [handler, scope];
    },
    /**
   * Sends a message to the comObj to invoke the action with the supplied data.
   * @param {String} actionName Action to call.
   * @param {JSON} data JSON data to send.
   * @param {Array} [transfers] Optional list of transfers/ArrayBuffers
   */
    send: function messageHandlerSend(actionName, data, transfers) {
      const message = {
        action: actionName,
        data,
      };
      this.postMessage(message, transfers);
    },
    /**
   * Sends a message to the comObj to invoke the action with the supplied data.
   * Expects that other side will callback with the response.
   * @param {String} actionName Action to call.
   * @param {JSON} data JSON data to send.
   * @param {Array} [transfers] Optional list of transfers/ArrayBuffers.
   * @returns {Promise} Promise to be resolved with response data.
   */
    sendWithPromise:
    function messageHandlerSendWithPromise(actionName, data, transfers) {
      const callbackId = this.callbackIndex++;
      const message = {
        action: actionName,
        data,
        callbackId,
      };
      const capability = createPromiseCapability();
      this.callbacksCapabilities[callbackId] = capability;
      try {
        this.postMessage(message, transfers);
      } catch (e) {
        capability.reject(e);
      }
      return capability.promise;
    },
    /**
   * Sends raw message to the comObj.
   * @private
   * @param message {Object} Raw message.
   * @param transfers List of transfers/ArrayBuffers, or undefined.
   */
    postMessage(message, transfers) {
      if (transfers && this.postMessageTransfers) {
        this.comObj.postMessage(message, transfers);
      } else {
        this.comObj.postMessage(message);
      }
    },
  };

  function loadJpegStream(id, imageUrl, objs) {
    const img = new Image();
    img.onload = (function loadJpegStream_onloadClosure() {
      objs.resolve(id, img);
    });
    img.onerror = (function loadJpegStream_onerrorClosure() {
      objs.resolve(id, null);
      warn('Error during JPEG image loading');
    });
    img.src = imageUrl;
  }


  const DEFAULT_RANGE_CHUNK_SIZE = 65536; // 2^16 = 65536

  /**
 * The maximum allowed image size in total pixels e.g. width * height. Images
 * above this value will not be drawn. Use -1 for no limit.
 * @var {number}
 */
  PDFJS.maxImageSize = (PDFJS.maxImageSize === undefined
    ? -1 : PDFJS.maxImageSize);

  /**
 * The url of where the predefined Adobe CMaps are located. Include trailing
 * slash.
 * @var {string}
 */
  PDFJS.cMapUrl = (PDFJS.cMapUrl === undefined ? null : PDFJS.cMapUrl);

  /**
 * Specifies if CMaps are binary packed.
 * @var {boolean}
 */
  PDFJS.cMapPacked = PDFJS.cMapPacked === undefined ? false : PDFJS.cMapPacked;

  /**
 * By default fonts are converted to OpenType fonts and loaded via font face
 * rules. If disabled, the font will be rendered using a built in font renderer
 * that constructs the glyphs with primitive path commands.
 * @var {boolean}
 */
  PDFJS.disableFontFace = (PDFJS.disableFontFace === undefined
    ? false : PDFJS.disableFontFace);

  /**
 * Path for image resources, mainly for annotation icons. Include trailing
 * slash.
 * @var {string}
 */
  PDFJS.imageResourcesPath = (PDFJS.imageResourcesPath === undefined
    ? '' : PDFJS.imageResourcesPath);

  /**
 * Disable the web worker and run all code on the main thread. This will happen
 * automatically if the browser doesn't support workers or sending typed arrays
 * to workers.
 * @var {boolean}
 */
  PDFJS.disableWorker = (PDFJS.disableWorker === undefined
    ? false : PDFJS.disableWorker);

  /**
 * Path and filename of the worker file. Required when the worker is enabled in
 * development mode. If unspecified in the production build, the worker will be
 * loaded based on the location of the pdf.js file. It is recommended that
 * the workerSrc is set in a custom application to prevent issues caused by
 * third-party frameworks and libraries.
 * @var {string}
 */
  PDFJS.workerSrc = (PDFJS.workerSrc === undefined ? null : PDFJS.workerSrc);

  /**
 * Disable range request loading of PDF files. When enabled and if the server
 * supports partial content requests then the PDF will be fetched in chunks.
 * Enabled (false) by default.
 * @var {boolean}
 */
  PDFJS.disableRange = (PDFJS.disableRange === undefined
    ? false : PDFJS.disableRange);

  /**
 * Disable streaming of PDF file data. By default PDF.js attempts to load PDF
 * in chunks. This default behavior can be disabled.
 * @var {boolean}
 */
  PDFJS.disableStream = (PDFJS.disableStream === undefined
    ? false : PDFJS.disableStream);

  /**
 * Disable pre-fetching of PDF file data. When range requests are enabled PDF.js
 * will automatically keep fetching more data even if it isn't needed to display
 * the current page. This default behavior can be disabled.
 *
 * NOTE: It is also necessary to disable streaming, see above,
 *       in order for disabling of pre-fetching to work correctly.
 * @var {boolean}
 */
  PDFJS.disableAutoFetch = (PDFJS.disableAutoFetch === undefined
    ? false : PDFJS.disableAutoFetch);

  /**
 * Enables special hooks for debugging PDF.js.
 * @var {boolean}
 */
  PDFJS.pdfBug = (PDFJS.pdfBug === undefined ? false : PDFJS.pdfBug);

  /**
 * Enables transfer usage in postMessage for ArrayBuffers.
 * @var {boolean}
 */
  PDFJS.postMessageTransfers = (PDFJS.postMessageTransfers === undefined
    ? true : PDFJS.postMessageTransfers);

  /**
 * Disables URL.createObjectURL usage.
 * @var {boolean}
 */
  PDFJS.disableCreateObjectURL = (PDFJS.disableCreateObjectURL === undefined
    ? false : PDFJS.disableCreateObjectURL);

  /**
 * Disables WebGL usage.
 * @var {boolean}
 */
  PDFJS.disableWebGL = (PDFJS.disableWebGL === undefined
    ? true : PDFJS.disableWebGL);

  /**
 * Disables fullscreen support, and by extension Presentation Mode,
 * in browsers which support the fullscreen API.
 * @var {boolean}
 */
  PDFJS.disableFullscreen = (PDFJS.disableFullscreen === undefined
    ? false : PDFJS.disableFullscreen);

  /**
 * Enables CSS only zooming.
 * @var {boolean}
 */
  PDFJS.useOnlyCssZoom = (PDFJS.useOnlyCssZoom === undefined
    ? false : PDFJS.useOnlyCssZoom);

  /**
 * Controls the logging level.
 * The constants from PDFJS.VERBOSITY_LEVELS should be used:
 * - errors
 * - warnings [default]
 * - infos
 * @var {number}
 */
  PDFJS.verbosity = (PDFJS.verbosity === undefined
    ? PDFJS.VERBOSITY_LEVELS.warnings : PDFJS.verbosity);

  /**
 * The maximum supported canvas size in total pixels e.g. width * height.
 * The default value is 4096 * 4096. Use -1 for no limit.
 * @var {number}
 */
  PDFJS.maxCanvasPixels = (PDFJS.maxCanvasPixels === undefined
    ? 16777216 : PDFJS.maxCanvasPixels);

  /**
 * (Deprecated) Opens external links in a new window if enabled.
 * The default behavior opens external links in the PDF.js window.
 * @var {boolean}
 */
  PDFJS.openExternalLinksInNewWindow = (
    PDFJS.openExternalLinksInNewWindow === undefined
      ? false : PDFJS.openExternalLinksInNewWindow);

  /**
 * Specifies the |target| attribute for external links.
 * The constants from PDFJS.LinkTarget should be used:
 *  - NONE [default]
 *  - SELF
 *  - BLANK
 *  - PARENT
 *  - TOP
 * @var {number}
 */
  PDFJS.externalLinkTarget = (PDFJS.externalLinkTarget === undefined
    ? PDFJS.LinkTarget.NONE : PDFJS.externalLinkTarget);

  /**
  * Determines if we can eval strings as JS. Primarily used to improve
  * performance for font rendering.
  * @var {boolean}
  */
  PDFJS.isEvalSupported = (PDFJS.isEvalSupported === undefined
    ? true : PDFJS.isEvalSupported);

  /**
 * Document initialization / loading parameters object.
 *
 * @typedef {Object} DocumentInitParameters
 * @property {string}     url   - The URL of the PDF.
 * @property {TypedArray|Array|string} data - Binary PDF data. Use typed arrays
 *   (Uint8Array) to improve the memory usage. If PDF data is BASE64-encoded,
 *   use atob() to convert it to a binary string first.
 * @property {Object}     httpHeaders - Basic authentication headers.
 * @property {boolean}    withCredentials - Indicates whether or not cross-site
 *   Access-Control requests should be made using credentials such as cookies
 *   or authorization headers. The default is false.
 * @property {string}     password - For decrypting password-protected PDFs.
 * @property {TypedArray} initialData - A typed array with the first portion or
 *   all of the pdf data. Used by the extension since some data is already
 *   loaded before the switch to range requests.
 * @property {number}     length - The PDF file length. It's used for progress
 *   reports and range requests operations.
 * @property {PDFDataRangeTransport} range
 * @property {number}     rangeChunkSize - Optional parameter to specify
 *   maximum number of bytes fetched per range request. The default value is
 *   2^16 = 65536.
 */

  /**
 * @typedef {Object} PDFDocumentStats
 * @property {Array} streamTypes - Used stream types in the document (an item
 *   is set to true if specific stream ID was used in the document).
 * @property {Array} fontTypes - Used font type in the document (an item is set
 *   to true if specific font ID was used in the document).
 */

  /**
 * This is the main entry point for loading a PDF and interacting with it.
 * NOTE: If a URL is used to fetch the PDF data a standard XMLHttpRequest(XHR)
 * is used, which means it must follow the same origin rules that any XHR does
 * e.g. No cross domain requests without CORS.
 *
 * @param {string|TypedArray|DocumentInitParameters|PDFDataRangeTransport} src
 * Can be a url to where a PDF is located, a typed array (Uint8Array)
 * already populated with data or parameter object.
 *
 * @param {PDFDataRangeTransport} pdfDataRangeTransport (deprecated) It is used
 * if you want to manually serve range requests for data in the PDF.
 *
 * @param {function} passwordCallback (deprecated) It is used to request a
 * password if wrong or no password was provided. The callback receives two
 * parameters: function that needs to be called with new password and reason
 * (see {PasswordResponses}).
 *
 * @param {function} progressCallback (deprecated) It is used to be able to
 * monitor the loading progress of the PDF file (necessary to implement e.g.
 * a loading bar). The callback receives an {Object} with the properties:
 * {number} loaded and {number} total.
 *
 * @return {PDFDocumentLoadingTask}
 */
  PDFJS.getDocument = function getDocument(src,
      pdfDataRangeTransport,
      passwordCallback,
      progressCallback) {
    const task = new PDFDocumentLoadingTask();

    // Support of the obsolete arguments (for compatibility with API v1.0)
    if (arguments.length > 1) {
      deprecated('getDocument is called with pdfDataRangeTransport, ' +
               'passwordCallback or progressCallback argument');
    }
    if (pdfDataRangeTransport) {
      if (!(pdfDataRangeTransport instanceof PDFDataRangeTransport)) {
      // Not a PDFDataRangeTransport instance, trying to add missing properties.
        pdfDataRangeTransport = Object.create(pdfDataRangeTransport);
        pdfDataRangeTransport.length = src.length;
        pdfDataRangeTransport.initialData = src.initialData;
        if (!pdfDataRangeTransport.abort) {
          pdfDataRangeTransport.abort = function () {};
        }
      }
      src = Object.create(src);
      src.range = pdfDataRangeTransport;
    }
    task.onPassword = passwordCallback || null;
    task.onProgress = progressCallback || null;

    let workerInitializedCapability, transport;
    let source;
    if (typeof src === 'string') {
      source = {url: src};
    } else if (isArrayBuffer(src)) {
      source = {data: src};
    } else if (src instanceof PDFDataRangeTransport) {
      source = {range: src};
    } else {
      if (typeof src !== 'object') {
        error('Invalid parameter in getDocument, need either Uint8Array, ' +
        'string or a parameter object');
      }
      if (!src.url && !src.data && !src.range) {
        error('Invalid parameter object: need either .data, .range or .url');
      }

      source = src;
    }

    const params = {};
    for (const key in source) {
      if (key === 'url' && typeof window !== 'undefined') {
      // The full path is required in the 'url' field.
        params[key] = combineUrl(window.location.href, source[key]);
        continue;
      } else if (key === 'range') {
        continue;
      } else if (key === 'data' && !(source[key] instanceof Uint8Array)) {
      // Converting string or array-like data to Uint8Array.
        const pdfBytes = source[key];
        if (typeof pdfBytes === 'string') {
          params[key] = stringToBytes(pdfBytes);
        } else if (typeof pdfBytes === 'object' && pdfBytes !== null &&
                 !isNaN(pdfBytes.length)) {
          params[key] = new Uint8Array(pdfBytes);
        } else if (isArrayBuffer(pdfBytes)) {
          params[key] = new Uint8Array(pdfBytes);
        } else {
          error('Invalid PDF binary data: either typed array, string or ' +
              'array-like object is expected in the data property.');
        }
        continue;
      }
      params[key] = source[key];
    }

    params.rangeChunkSize = source.rangeChunkSize || DEFAULT_RANGE_CHUNK_SIZE;

    workerInitializedCapability = createPromiseCapability();
    transport = new WorkerTransport(workerInitializedCapability, source.range);
    workerInitializedCapability.promise.then(() => {
      transport.fetchDocument(task, params);
    });
    task._transport = transport;

    return task;
  };

  /**
 * PDF document loading operation.
 * @class
 * @alias PDFDocumentLoadingTask
 */
  var PDFDocumentLoadingTask = (function PDFDocumentLoadingTaskClosure() {
    function PDFDocumentLoadingTask() {
      this._capability = createPromiseCapability();
      this._transport = null;

      /**
     * Callback to request a password if wrong or no password was provided.
     * The callback receives two parameters: function that needs to be called
     * with new password and reason (see {PasswordResponses}).
     */
      this.onPassword = null;

      /**
     * Callback to be able to monitor the loading progress of the PDF file
     * (necessary to implement e.g. a loading bar). The callback receives
     * an {Object} with the properties: {number} loaded and {number} total.
     */
      this.onProgress = null;
    }

    PDFDocumentLoadingTask.prototype =
      /** @lends PDFDocumentLoadingTask.prototype */ {
        /**
     * @return {Promise}
     */
        get promise() {
          return this._capability.promise;
        },

        /**
     * Aborts all network requests and destroys worker.
     * @return {Promise} A promise that is resolved after destruction activity
     *                   is completed.
     */
        destroy() {
          return this._transport.destroy();
        },

        /**
     * Registers callbacks to indicate the document loading completion.
     *
     * @param {function} onFulfilled The callback for the loading completion.
     * @param {function} onRejected The callback for the loading failure.
     * @return {Promise} A promise that is resolved after the onFulfilled or
     *                   onRejected callback.
     */
        then: function PDFDocumentLoadingTask_then(onFulfilled, onRejected) {
          return this.promise.then.apply(this.promise, arguments);
        },
      };

    return PDFDocumentLoadingTask;
  })();

  /**
 * Abstract class to support range requests file loading.
 * @class
 * @alias PDFJS.PDFDataRangeTransport
 * @param {number} length
 * @param {Uint8Array} initialData
 */
  var PDFDataRangeTransport = (function pdfDataRangeTransportClosure() {
    function PDFDataRangeTransport(length, initialData) {
      this.length = length;
      this.initialData = initialData;

      this._rangeListeners = [];
      this._progressListeners = [];
      this._progressiveReadListeners = [];
      this._readyCapability = createPromiseCapability();
    }
    PDFDataRangeTransport.prototype =
      /** @lends PDFDataRangeTransport.prototype */ {
        addRangeListener:
        function PDFDataRangeTransport_addRangeListener(listener) {
          this._rangeListeners.push(listener);
        },

        addProgressListener:
        function PDFDataRangeTransport_addProgressListener(listener) {
          this._progressListeners.push(listener);
        },

        addProgressiveReadListener:
        function PDFDataRangeTransport_addProgressiveReadListener(listener) {
          this._progressiveReadListeners.push(listener);
        },

        onDataRange: function PDFDataRangeTransport_onDataRange(begin, chunk) {
          const listeners = this._rangeListeners;
          for (let i = 0, n = listeners.length; i < n; ++i) {
            listeners[i](begin, chunk);
          }
        },

        onDataProgress: function PDFDataRangeTransport_onDataProgress(loaded) {
          this._readyCapability.promise.then(() => {
            const listeners = this._progressListeners;
            for (let i = 0, n = listeners.length; i < n; ++i) {
              listeners[i](loaded);
            }
          });
        },

        onDataProgressiveRead:
        function PDFDataRangeTransport_onDataProgress(chunk) {
          this._readyCapability.promise.then(() => {
            const listeners = this._progressiveReadListeners;
            for (let i = 0, n = listeners.length; i < n; ++i) {
              listeners[i](chunk);
            }
          });
        },

        transportReady: function PDFDataRangeTransport_transportReady() {
          this._readyCapability.resolve();
        },

        requestDataRange:
        function PDFDataRangeTransport_requestDataRange(begin, end) {
          throw new Error('Abstract method PDFDataRangeTransport.requestDataRange');
        },

        abort: function PDFDataRangeTransport_abort() {
        },
      };
    return PDFDataRangeTransport;
  })();

  PDFJS.PDFDataRangeTransport = PDFDataRangeTransport;

  /**
 * Proxy to a PDFDocument in the worker thread. Also, contains commonly used
 * properties that can be read synchronously.
 * @class
 * @alias PDFDocumentProxy
 */
  const PDFDocumentProxy = (function PDFDocumentProxyClosure() {
    function PDFDocumentProxy(pdfInfo, transport, loadingTask) {
      this.pdfInfo = pdfInfo;
      this.transport = transport;
      this.loadingTask = loadingTask;
    }
    PDFDocumentProxy.prototype = /** @lends PDFDocumentProxy.prototype */ {
    /**
     * @return {number} Total number of pages the PDF contains.
     */
      get numPages() {
        return this.pdfInfo.numPages;
      },
      /**
     * @return {string} A unique ID to identify a PDF. Not guaranteed to be
     * unique.
     */
      get fingerprint() {
        return this.pdfInfo.fingerprint;
      },
      /**
     * @param {number} pageNumber The page number to get. The first page is 1.
     * @return {Promise} A promise that is resolved with a {@link PDFPageProxy}
     * object.
     */
      getPage: function PDFDocumentProxy_getPage(pageNumber) {
        return this.transport.getPage(pageNumber);
      },
      /**
     * @param {{num: number, gen: number}} ref The page reference. Must have
     *   the 'num' and 'gen' properties.
     * @return {Promise} A promise that is resolved with the page index that is
     * associated with the reference.
     */
      getPageIndex: function PDFDocumentProxy_getPageIndex(ref) {
        return this.transport.getPageIndex(ref);
      },
      /**
     * @return {Promise} A promise that is resolved with a lookup table for
     * mapping named destinations to reference numbers.
     *
     * This can be slow for large documents: use getDestination instead
     */
      getDestinations: function PDFDocumentProxy_getDestinations() {
        return this.transport.getDestinations();
      },
      /**
     * @param {string} id The named destination to get.
     * @return {Promise} A promise that is resolved with all information
     * of the given named destination.
     */
      getDestination: function PDFDocumentProxy_getDestination(id) {
        return this.transport.getDestination(id);
      },
      /**
     * @return {Promise} A promise that is resolved with a lookup table for
     * mapping named attachments to their content.
     */
      getAttachments: function PDFDocumentProxy_getAttachments() {
        return this.transport.getAttachments();
      },
      /**
     * @return {Promise} A promise that is resolved with an array of all the
     * JavaScript strings in the name tree.
     */
      getJavaScript: function PDFDocumentProxy_getJavaScript() {
        return this.transport.getJavaScript();
      },
      /**
     * @return {Promise} A promise that is resolved with an {Array} that is a
     * tree outline (if it has one) of the PDF. The tree is in the format of:
     * [
     *  {
     *   title: string,
     *   bold: boolean,
     *   italic: boolean,
     *   color: rgb array,
     *   dest: dest obj,
     *   items: array of more items like this
     *  },
     *  ...
     * ].
     */
      getOutline: function PDFDocumentProxy_getOutline() {
        return this.transport.getOutline();
      },
      /**
     * @return {Promise} A promise that is resolved with an {Object} that has
     * info and metadata properties.  Info is an {Object} filled with anything
     * available in the information dictionary and similarly metadata is a
     * {Metadata} object with information from the metadata section of the PDF.
     */
      getMetadata: function PDFDocumentProxy_getMetadata() {
        return this.transport.getMetadata();
      },
      /**
     * @return {Promise} A promise that is resolved with a TypedArray that has
     * the raw data from the PDF.
     */
      getData: function PDFDocumentProxy_getData() {
        return this.transport.getData();
      },
      /**
     * @return {Promise} A promise that is resolved when the document's data
     * is loaded. It is resolved with an {Object} that contains the length
     * property that indicates size of the PDF data in bytes.
     */
      getDownloadInfo: function PDFDocumentProxy_getDownloadInfo() {
        return this.transport.downloadInfoCapability.promise;
      },
      /**
     * @return {Promise} A promise this is resolved with current stats about
     * document structures (see {@link PDFDocumentStats}).
     */
      getStats: function PDFDocumentProxy_getStats() {
        return this.transport.getStats();
      },
      /**
     * Cleans up resources allocated by the document, e.g. created @font-face.
     */
      cleanup: function PDFDocumentProxy_cleanup() {
        this.transport.startCleanup();
      },
      /**
     * Destroys current document instance and terminates worker.
     */
      destroy: function PDFDocumentProxy_destroy() {
        return this.transport.destroy();
      },
    };
    return PDFDocumentProxy;
  })();

  /**
 * Page text content.
 *
 * @typedef {Object} TextContent
 * @property {array} items - array of {@link TextItem}
 * @property {Object} styles - {@link TextStyles} objects, indexed by font
 *                    name.
 */

  /**
 * Page text content part.
 *
 * @typedef {Object} TextItem
 * @property {string} str - text content.
 * @property {string} dir - text direction: 'ttb', 'ltr' or 'rtl'.
 * @property {array} transform - transformation matrix.
 * @property {number} width - width in device space.
 * @property {number} height - height in device space.
 * @property {string} fontName - font name used by pdf.js for converted font.
 */

  /**
 * Text style.
 *
 * @typedef {Object} TextStyle
 * @property {number} ascent - font ascent.
 * @property {number} descent - font descent.
 * @property {boolean} vertical - text is in vertical mode.
 * @property {string} fontFamily - possible font family
 */

  /**
 * Page annotation parameters.
 *
 * @typedef {Object} GetAnnotationsParameters
 * @param {string} intent - Determines the annotations that will be fetched,
 *                 can be either 'display' (viewable annotations) or 'print'
 *                 (printable annotations).
 *                 If the parameter is omitted, all annotations are fetched.
 */

  /**
 * Page render parameters.
 *
 * @typedef {Object} RenderParameters
 * @property {Object} canvasContext - A 2D context of a DOM Canvas object.
 * @property {PDFJS.PageViewport} viewport - Rendering viewport obtained by
 *                                calling of PDFPage.getViewport method.
 * @property {string} intent - Rendering intent, can be 'display' or 'print'
 *                    (default value is 'display').
 * @property {Array}  transform - (optional) Additional transform, applied
 *                    just before viewport transform.
 * @property {Object} imageLayer - (optional) An object that has beginLayout,
 *                    endLayout and appendImage functions.
 * @property {function} continueCallback - (deprecated) A function that will be
 *                      called each time the rendering is paused.  To continue
 *                      rendering call the function that is the first argument
 *                      to the callback.
 */

  /**
 * PDF page operator list.
 *
 * @typedef {Object} PDFOperatorList
 * @property {Array} fnArray - Array containing the operator functions.
 * @property {Array} argsArray - Array containing the arguments of the
 *                               functions.
 */

  /**
 * Proxy to a PDFPage in the worker thread.
 * @class
 * @alias PDFPageProxy
 */
  const PDFPageProxy = (function PDFPageProxyClosure() {
    function PDFPageProxy(pageIndex, pageInfo, transport) {
      this.pageIndex = pageIndex;
      this.pageInfo = pageInfo;
      this.transport = transport;
      this.stats = new StatTimer();
      this.stats.enabled = !!globalScope.PDFJS.enableStats;
      this.commonObjs = transport.commonObjs;
      this.objs = new PDFObjects();
      this.cleanupAfterRender = false;
      this.pendingCleanup = false;
      this.intentStates = {};
      this.destroyed = false;
    }
    PDFPageProxy.prototype = /** @lends PDFPageProxy.prototype */ {
    /**
     * @return {number} Page number of the page. First page is 1.
     */
      get pageNumber() {
        return this.pageIndex + 1;
      },
      /**
     * @return {number} The number of degrees the page is rotated clockwise.
     */
      get rotate() {
        return this.pageInfo.rotate;
      },
      /**
     * @return {Object} The reference that points to this page. It has 'num' and
     * 'gen' properties.
     */
      get ref() {
        return this.pageInfo.ref;
      },
      /**
     * @return {Array} An array of the visible portion of the PDF page in the
     * user space units - [x1, y1, x2, y2].
     */
      get view() {
        return this.pageInfo.view;
      },
      /**
     * @param {number} scale The desired scale of the viewport.
     * @param {number} rotate Degrees to rotate the viewport. If omitted this
     * defaults to the page rotation.
     * @return {PDFJS.PageViewport} Contains 'width' and 'height' properties
     * along with transforms required for rendering.
     */
      getViewport: function PDFPageProxy_getViewport(scale, rotate) {
        if (arguments.length < 2) {
          rotate = this.rotate;
        }
        return new PDFJS.PageViewport(this.view, scale, rotate, 0, 0);
      },
      /**
     * @param {GetAnnotationsParameters} params - Annotation parameters.
     * @return {Promise} A promise that is resolved with an {Array} of the
     * annotation objects.
     */
      getAnnotations: function PDFPageProxy_getAnnotations(params) {
        const intent = (params && params.intent) || null;

        if (!this.annotationsPromise || this.annotationsIntent !== intent) {
          this.annotationsPromise = this.transport.getAnnotations(this.pageIndex,
              intent);
          this.annotationsIntent = intent;
        }
        return this.annotationsPromise;
      },
      /**
     * Begins the process of rendering a page to the desired context.
     * @param {RenderParameters} params Page render parameters.
     * @return {RenderTask} An object that contains the promise, which
     *                      is resolved when the page finishes rendering.
     */
      render: function PDFPageProxy_render(params) {
        const stats = this.stats;
        stats.time('Overall');

        // If there was a pending destroy cancel it so no cleanup happens during
        // this call to render.
        this.pendingCleanup = false;

        const renderingIntent = (params.intent === 'print' ? 'print' : 'display');

        if (!this.intentStates[renderingIntent]) {
          this.intentStates[renderingIntent] = {};
        }
        const intentState = this.intentStates[renderingIntent];

        // If there's no displayReadyCapability yet, then the operatorList
        // was never requested before. Make the request and create the promise.
        if (!intentState.displayReadyCapability) {
          intentState.receivingOperatorList = true;
          intentState.displayReadyCapability = createPromiseCapability();
          intentState.operatorList = {
            fnArray: [],
            argsArray: [],
            lastChunk: false,
          };

          this.stats.time('Page Request');
          this.transport.messageHandler.send('RenderPageRequest', {
            pageIndex: this.pageNumber - 1,
            intent: renderingIntent,
          });
        }

        const internalRenderTask = new InternalRenderTask(complete, params,
            this.objs,
            this.commonObjs,
            intentState.operatorList,
            this.pageNumber);
        internalRenderTask.useRequestAnimationFrame = renderingIntent !== 'print';
        if (!intentState.renderTasks) {
          intentState.renderTasks = [];
        }
        intentState.renderTasks.push(internalRenderTask);
        const renderTask = internalRenderTask.task;

        // Obsolete parameter support
        if (params.continueCallback) {
          deprecated('render is used with continueCallback parameter');
          renderTask.onContinue = params.continueCallback;
        }

        const self = this;
        intentState.displayReadyCapability.promise.then(
            (transparency) => {
              if (self.pendingCleanup) {
                complete();
                return;
              }
              stats.time('Rendering');
              internalRenderTask.initalizeGraphics(transparency);
              internalRenderTask.operatorListChanged();
            },
            (reason) => {
              complete(reason);
            }
        );

        function complete(error) {
          const i = intentState.renderTasks.indexOf(internalRenderTask);
          if (i >= 0) {
            intentState.renderTasks.splice(i, 1);
          }

          if (self.cleanupAfterRender) {
            self.pendingCleanup = true;
          }
          self._tryCleanup();

          if (error) {
            internalRenderTask.capability.reject(error);
          } else {
            internalRenderTask.capability.resolve();
          }
          stats.timeEnd('Rendering');
          stats.timeEnd('Overall');
        }

        return renderTask;
      },

      /**
     * @return {Promise} A promise resolved with an {@link PDFOperatorList}
     * object that represents page's operator list.
     */
      getOperatorList: function PDFPageProxy_getOperatorList() {
        function operatorListChanged() {
          if (intentState.operatorList.lastChunk) {
            intentState.opListReadCapability.resolve(intentState.operatorList);
          }
        }

        const renderingIntent = 'oplist';
        if (!this.intentStates[renderingIntent]) {
          this.intentStates[renderingIntent] = {};
        }
        var intentState = this.intentStates[renderingIntent];

        if (!intentState.opListReadCapability) {
          const opListTask = {};
          opListTask.operatorListChanged = operatorListChanged;
          intentState.receivingOperatorList = true;
          intentState.opListReadCapability = createPromiseCapability();
          intentState.renderTasks = [];
          intentState.renderTasks.push(opListTask);
          intentState.operatorList = {
            fnArray: [],
            argsArray: [],
            lastChunk: false,
          };

          this.transport.messageHandler.send('RenderPageRequest', {
            pageIndex: this.pageIndex,
            intent: renderingIntent,
          });
        }
        return intentState.opListReadCapability.promise;
      },

      /**
     * @return {Promise} That is resolved a {@link TextContent}
     * object that represent the page text content.
     */
      getTextContent: function PDFPageProxy_getTextContent() {
        return this.transport.messageHandler.sendWithPromise('GetTextContent', {
          pageIndex: this.pageNumber - 1,
        });
      },

      /**
     * Destroys page object.
     */
      _destroy: function PDFPageProxy_destroy() {
        this.destroyed = true;
        this.transport.pageCache[this.pageIndex] = null;

        const waitOn = [];
        Object.keys(this.intentStates).forEach(function (intent) {
          const intentState = this.intentStates[intent];
          intentState.renderTasks.forEach((renderTask) => {
            const renderCompleted = renderTask.capability.promise
                .catch(() => {}); // ignoring failures
            waitOn.push(renderCompleted);
            renderTask.cancel();
          });
        }, this);
        this.objs.clear();
        this.annotationsPromise = null;
        this.pendingCleanup = false;
        return Promise.all(waitOn);
      },

      /**
     * Cleans up resources allocated by the page. (deprecated)
     */
      destroy() {
        deprecated('page destroy method, use cleanup() instead');
        this.cleanup();
      },

      /**
     * Cleans up resources allocated by the page.
     */
      cleanup: function PDFPageProxy_cleanup() {
        this.pendingCleanup = true;
        this._tryCleanup();
      },
      /**
     * For internal use only. Attempts to clean up if rendering is in a state
     * where that's possible.
     * @ignore
     */
      _tryCleanup: function PDFPageProxy_tryCleanup() {
        if (!this.pendingCleanup ||
          Object.keys(this.intentStates).some(function (intent) {
            const intentState = this.intentStates[intent];
            return (intentState.renderTasks.length !== 0 ||
                    intentState.receivingOperatorList);
          }, this)) {
          return;
        }

        Object.keys(this.intentStates).forEach(function (intent) {
          delete this.intentStates[intent];
        }, this);
        this.objs.clear();
        this.annotationsPromise = null;
        this.pendingCleanup = false;
      },
      /**
     * For internal use only.
     * @ignore
     */
      _startRenderPage: function PDFPageProxy_startRenderPage(transparency,
          intent) {
        const intentState = this.intentStates[intent];
        // TODO Refactor RenderPageRequest to separate rendering
        // and operator list logic
        if (intentState.displayReadyCapability) {
          intentState.displayReadyCapability.resolve(transparency);
        }
      },
      /**
     * For internal use only.
     * @ignore
     */
      _renderPageChunk: function PDFPageProxy_renderPageChunk(operatorListChunk,
          intent) {
        const intentState = this.intentStates[intent];
        let i, ii;
        // Add the new chunk to the current operator list.
        for (i = 0, ii = operatorListChunk.length; i < ii; i++) {
          intentState.operatorList.fnArray.push(operatorListChunk.fnArray[i]);
          intentState.operatorList.argsArray.push(
              operatorListChunk.argsArray[i]);
        }
        intentState.operatorList.lastChunk = operatorListChunk.lastChunk;

        // Notify all the rendering tasks there are more operators to be consumed.
        for (i = 0; i < intentState.renderTasks.length; i++) {
          intentState.renderTasks[i].operatorListChanged();
        }

        if (operatorListChunk.lastChunk) {
          intentState.receivingOperatorList = false;
          this._tryCleanup();
        }
      },
    };
    return PDFPageProxy;
  })();

  /**
 * For internal use only.
 * @ignore
 */
  var WorkerTransport = (function WorkerTransportClosure() {
    function WorkerTransport(workerInitializedCapability, pdfDataRangeTransport) {
      this.pdfDataRangeTransport = pdfDataRangeTransport;
      this.workerInitializedCapability = workerInitializedCapability;
      this.commonObjs = new PDFObjects();

      this.loadingTask = null;
      this.destroyed = false;
      this.destroyCapability = null;

      this.pageCache = [];
      this.pagePromises = [];
      this.downloadInfoCapability = createPromiseCapability();

      // If worker support isn't disabled explicit and the browser has worker
      // support, create a new web worker and test if it/the browser fullfills
      // all requirements to run parts of pdf.js in a web worker.
      // Right now, the requirement is, that an Uint8Array is still an Uint8Array
      // as it arrives on the worker. Chrome added this with version 15.
      if (!globalScope.PDFJS.disableWorker && typeof Worker !== 'undefined') {
        const workerSrc = PDFJS.workerSrc;
        if (!workerSrc) {
          error('No PDFJS.workerSrc specified');
        }

        try {
        // Some versions of FF can't create a worker on localhost, see:
        // https://bugzilla.mozilla.org/show_bug.cgi?id=683280
          const worker = new Worker(workerSrc);
          const messageHandler = new MessageHandler('main', worker);
          this.messageHandler = messageHandler;

          messageHandler.on('test', (data) => {
            const supportTypedArray = data && data.supportTypedArray;
            if (supportTypedArray) {
              this.worker = worker;
              if (!data.supportTransfers) {
                PDFJS.postMessageTransfers = false;
              }
              this.setupMessageHandler(messageHandler);
              workerInitializedCapability.resolve();
            } else {
              this.setupFakeWorker();
            }
          });

          const testObj = new Uint8Array([PDFJS.postMessageTransfers ? 255 : 0]);
          // Some versions of Opera throw a DATA_CLONE_ERR on serializing the
          // typed array. Also, checking if we can use transfers.
          try {
            messageHandler.send('test', testObj, [testObj.buffer]);
          } catch (ex) {
            info('Cannot use postMessage transfers');
            testObj[0] = 0;
            messageHandler.send('test', testObj);
          }
          return;
        } catch (e) {
          info('The worker has been disabled.');
        }
      }
      // Either workers are disabled, not supported or have thrown an exception.
      // Thus, we fallback to a faked worker.
      this.setupFakeWorker();
    }
    WorkerTransport.prototype = {
      destroy: function WorkerTransport_destroy() {
        if (this.destroyCapability) {
          return this.destroyCapability.promise;
        }

        this.destroyed = true;
        this.destroyCapability = createPromiseCapability();

        const waitOn = [];
        // We need to wait for all renderings to be completed, e.g.
        // timeout/rAF can take a long time.
        this.pageCache.forEach((page) => {
          if (page) {
            waitOn.push(page._destroy());
          }
        });
        this.pageCache = [];
        this.pagePromises = [];
        const self = this;
        // We also need to wait for the worker to finish its long running tasks.
        const terminated = this.messageHandler.sendWithPromise('Terminate', null);
        waitOn.push(terminated);
        Promise.all(waitOn).then(() => {
          FontLoader.clear();
          if (self.worker) {
            self.worker.terminate();
          }
          if (self.pdfDataRangeTransport) {
            self.pdfDataRangeTransport.abort();
            self.pdfDataRangeTransport = null;
          }
          self.messageHandler = null;
          self.destroyCapability.resolve();
        }, this.destroyCapability.reject);
        return this.destroyCapability.promise;
      },

      setupFakeWorker: function WorkerTransport_setupFakeWorker() {
        globalScope.PDFJS.disableWorker = true;

        if (!PDFJS.fakeWorkerFilesLoadedCapability) {
          PDFJS.fakeWorkerFilesLoadedCapability = createPromiseCapability();
          // In the developer build load worker_loader which in turn loads all the
          // other files and resolves the promise. In production only the
          // pdf.worker.js file is needed.
          Util.loadScript(PDFJS.workerSrc, () => {
            PDFJS.fakeWorkerFilesLoadedCapability.resolve();
          });
        }
        PDFJS.fakeWorkerFilesLoadedCapability.promise.then(() => {
          warn('Setting up fake worker.');
          // If we don't use a worker, just post/sendMessage to the main thread.
          var fakeWorker = {
            postMessage: function WorkerTransport_postMessage(obj) {
              fakeWorker.onmessage({data: obj});
            },
            terminate: function WorkerTransport_terminate() {},
          };

          const messageHandler = new MessageHandler('main', fakeWorker);
          this.setupMessageHandler(messageHandler);

          // If the main thread is our worker, setup the handling for the messages
          // the main thread sends to it self.
          PDFJS.WorkerMessageHandler.setup(messageHandler);

          this.workerInitializedCapability.resolve();
        });
      },

      setupMessageHandler:
      function WorkerTransport_setupMessageHandler(messageHandler) {
        this.messageHandler = messageHandler;

        function updatePassword(password) {
          messageHandler.send('UpdatePassword', password);
        }

        const pdfDataRangeTransport = this.pdfDataRangeTransport;
        if (pdfDataRangeTransport) {
          pdfDataRangeTransport.addRangeListener((begin, chunk) => {
            messageHandler.send('OnDataRange', {
              begin,
              chunk,
            });
          });

          pdfDataRangeTransport.addProgressListener((loaded) => {
            messageHandler.send('OnDataProgress', {
              loaded,
            });
          });

          pdfDataRangeTransport.addProgressiveReadListener((chunk) => {
            messageHandler.send('OnDataRange', {
              chunk,
            });
          });

          messageHandler.on('RequestDataRange',
              (data) => {
                pdfDataRangeTransport.requestDataRange(data.begin, data.end);
              }, this);
        }

        messageHandler.on('GetDoc', function transportDoc(data) {
          const pdfInfo = data.pdfInfo;
          this.numPages = data.pdfInfo.numPages;
          const loadingTask = this.loadingTask;
          const pdfDocument = new PDFDocumentProxy(pdfInfo, this, loadingTask);
          this.pdfDocument = pdfDocument;
          loadingTask._capability.resolve(pdfDocument);
        }, this);

        messageHandler.on('NeedPassword',
            function transportNeedPassword(exception) {
              const loadingTask = this.loadingTask;
              if (loadingTask.onPassword) {
                return loadingTask.onPassword(updatePassword,
                    PasswordResponses.NEED_PASSWORD);
              }
              loadingTask._capability.reject(
                  new PasswordException(exception.message, exception.code));
            }, this);

        messageHandler.on('IncorrectPassword',
            function transportIncorrectPassword(exception) {
              const loadingTask = this.loadingTask;
              if (loadingTask.onPassword) {
                return loadingTask.onPassword(updatePassword,
                    PasswordResponses.INCORRECT_PASSWORD);
              }
              loadingTask._capability.reject(
                  new PasswordException(exception.message, exception.code));
            }, this);

        messageHandler.on('InvalidPDF', function transportInvalidPDF(exception) {
          this.loadingTask._capability.reject(
              new InvalidPDFException(exception.message));
        }, this);

        messageHandler.on('MissingPDF', function transportMissingPDF(exception) {
          this.loadingTask._capability.reject(
              new MissingPDFException(exception.message));
        }, this);

        messageHandler.on('UnexpectedResponse',
            function transportUnexpectedResponse(exception) {
              this.loadingTask._capability.reject(
                  new UnexpectedResponseException(exception.message, exception.status));
            }, this);

        messageHandler.on('UnknownError',
            function transportUnknownError(exception) {
              this.loadingTask._capability.reject(
                  new UnknownErrorException(exception.message, exception.details));
            }, this);

        messageHandler.on('DataLoaded', function transportPage(data) {
          this.downloadInfoCapability.resolve(data);
        }, this);

        messageHandler.on('PDFManagerReady', function transportPage(data) {
          if (this.pdfDataRangeTransport) {
            this.pdfDataRangeTransport.transportReady();
          }
        }, this);

        messageHandler.on('StartRenderPage', function transportRender(data) {
          if (this.destroyed) {
            return; // Ignore any pending requests if the worker was terminated.
          }
          const page = this.pageCache[data.pageIndex];

          page.stats.timeEnd('Page Request');
          page._startRenderPage(data.transparency, data.intent);
        }, this);

        messageHandler.on('RenderPageChunk', function transportRender(data) {
          if (this.destroyed) {
            return; // Ignore any pending requests if the worker was terminated.
          }
          const page = this.pageCache[data.pageIndex];

          page._renderPageChunk(data.operatorList, data.intent);
        }, this);

        messageHandler.on('commonobj', function transportObj(data) {
          if (this.destroyed) {
            return; // Ignore any pending requests if the worker was terminated.
          }

          const id = data[0];
          const type = data[1];
          if (this.commonObjs.hasData(id)) {
            return;
          }

          switch (type) {
            case 'Font':
              var exportedData = data[2];

              var font;
              if ('error' in exportedData) {
                var error = exportedData.error;
                warn(`Error during font loading: ${error}`);
                this.commonObjs.resolve(id, error);
                break;
              } else {
                font = new FontFaceObject(exportedData);
              }

              FontLoader.bind(
                  [font],
                  (fontObjs) => {
                    this.commonObjs.resolve(id, font);
                  }
              );
              break;
            case 'FontPath':
              this.commonObjs.resolve(id, data[2]);
              break;
            default:
              error(`Got unknown common object type ${type}`);
          }
        }, this);

        messageHandler.on('obj', function transportObj(data) {
          if (this.destroyed) {
            return; // Ignore any pending requests if the worker was terminated.
          }

          const id = data[0];
          const pageIndex = data[1];
          const type = data[2];
          const pageProxy = this.pageCache[pageIndex];
          let imageData;
          if (pageProxy.objs.hasData(id)) {
            return;
          }

          switch (type) {
            case 'JpegStream':
              imageData = data[3];
              loadJpegStream(id, imageData, pageProxy.objs);
              break;
            case 'Image':
              imageData = data[3];
              pageProxy.objs.resolve(id, imageData);

              // heuristics that will allow not to store large data
              var MAX_IMAGE_SIZE_TO_STORE = 8000000;
              if (imageData && 'data' in imageData &&
                imageData.data.length > MAX_IMAGE_SIZE_TO_STORE) {
                pageProxy.cleanupAfterRender = true;
              }
              break;
            default:
              error(`Got unknown object type ${type}`);
          }
        }, this);

        messageHandler.on('DocProgress', function transportDocProgress(data) {
          if (this.destroyed) {
            return; // Ignore any pending requests if the worker was terminated.
          }

          const loadingTask = this.loadingTask;
          if (loadingTask.onProgress) {
            loadingTask.onProgress({
              loaded: data.loaded,
              total: data.total,
            });
          }
        }, this);

        messageHandler.on('PageError', function transportError(data) {
          if (this.destroyed) {
            return; // Ignore any pending requests if the worker was terminated.
          }

          const page = this.pageCache[data.pageNum - 1];
          const intentState = page.intentStates[data.intent];
          if (intentState.displayReadyCapability) {
            intentState.displayReadyCapability.reject(data.error);
          } else {
            error(data.error);
          }
        }, this);

        messageHandler.on('JpegDecode', function (data) {
          if (this.destroyed) {
            return Promise.reject('Worker was terminated');
          }

          const imageUrl = data[0];
          const components = data[1];
          if (components !== 3 && components !== 1) {
            return Promise.reject(
                new Error('Only 3 components or 1 component can be returned'));
          }

          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function () {
              const width = img.width;
              const height = img.height;
              const size = width * height;
              const rgbaLength = size * 4;
              const buf = new Uint8Array(size * components);
              const tmpCanvas = createScratchCanvas(width, height);
              const tmpCtx = tmpCanvas.getContext('2d');
              tmpCtx.drawImage(img, 0, 0);
              const data = tmpCtx.getImageData(0, 0, width, height).data;
              let i, j;

              if (components === 3) {
                for (i = 0, j = 0; i < rgbaLength; i += 4, j += 3) {
                  buf[j] = data[i];
                  buf[j + 1] = data[i + 1];
                  buf[j + 2] = data[i + 2];
                }
              } else if (components === 1) {
                for (i = 0, j = 0; i < rgbaLength; i += 4, j++) {
                  buf[j] = data[i];
                }
              }
              resolve({data: buf, width, height});
            };
            img.onerror = function () {
              reject(new Error('JpegDecode failed to load image'));
            };
            img.src = imageUrl;
          });
        }, this);
      },

      fetchDocument: function WorkerTransport_fetchDocument(loadingTask, source) {
        if (this.destroyed) {
          loadingTask._capability.reject(new Error('Loading aborted'));
          this.destroyCapability.resolve();
          return;
        }

        this.loadingTask = loadingTask;

        source.disableAutoFetch = PDFJS.disableAutoFetch;
        source.disableStream = PDFJS.disableStream;
        source.chunkedViewerLoading = !!this.pdfDataRangeTransport;
        if (this.pdfDataRangeTransport) {
          source.length = this.pdfDataRangeTransport.length;
          source.initialData = this.pdfDataRangeTransport.initialData;
        }
        this.messageHandler.send('GetDocRequest', {
          source,
          disableRange: PDFJS.disableRange,
          maxImageSize: PDFJS.maxImageSize,
          cMapUrl: PDFJS.cMapUrl,
          cMapPacked: PDFJS.cMapPacked,
          disableFontFace: PDFJS.disableFontFace,
          disableCreateObjectURL: PDFJS.disableCreateObjectURL,
          verbosity: PDFJS.verbosity,
        });
      },

      getData: function WorkerTransport_getData() {
        return this.messageHandler.sendWithPromise('GetData', null);
      },

      getPage: function WorkerTransport_getPage(pageNumber, capability) {
        if (pageNumber <= 0 || pageNumber > this.numPages ||
          (pageNumber | 0) !== pageNumber) {
          return Promise.reject(new Error('Invalid page request'));
        }

        const pageIndex = pageNumber - 1;
        if (pageIndex in this.pagePromises) {
          return this.pagePromises[pageIndex];
        }
        const promise = this.messageHandler.sendWithPromise('GetPage', {
          pageIndex,
        }).then((pageInfo) => {
          if (this.destroyed) {
            throw new Error('Transport destroyed');
          }
          const page = new PDFPageProxy(pageIndex, pageInfo, this);
          this.pageCache[pageIndex] = page;
          return page;
        });
        this.pagePromises[pageIndex] = promise;
        return promise;
      },

      getPageIndex: function WorkerTransport_getPageIndexByRef(ref) {
        return this.messageHandler.sendWithPromise('GetPageIndex', {ref});
      },

      getAnnotations: function WorkerTransport_getAnnotations(pageIndex, intent) {
        return this.messageHandler.sendWithPromise('GetAnnotations', {
          pageIndex,
          intent,
        });
      },

      getDestinations: function WorkerTransport_getDestinations() {
        return this.messageHandler.sendWithPromise('GetDestinations', null);
      },

      getDestination: function WorkerTransport_getDestination(id) {
        return this.messageHandler.sendWithPromise('GetDestination', {id});
      },

      getAttachments: function WorkerTransport_getAttachments() {
        return this.messageHandler.sendWithPromise('GetAttachments', null);
      },

      getJavaScript: function WorkerTransport_getJavaScript() {
        return this.messageHandler.sendWithPromise('GetJavaScript', null);
      },

      getOutline: function WorkerTransport_getOutline() {
        return this.messageHandler.sendWithPromise('GetOutline', null);
      },

      getMetadata: function WorkerTransport_getMetadata() {
        return this.messageHandler.sendWithPromise('GetMetadata', null)
            .then((results) => ({
              info: results[0],
              metadata: (results[1] ? new PDFJS.Metadata(results[1]) : null),
            }));
      },

      getStats: function WorkerTransport_getStats() {
        return this.messageHandler.sendWithPromise('GetStats', null);
      },

      startCleanup: function WorkerTransport_startCleanup() {
        this.messageHandler.sendWithPromise('Cleanup', null)
            .then(() => {
              for (let i = 0, ii = this.pageCache.length; i < ii; i++) {
                const page = this.pageCache[i];
                if (page) {
                  page.cleanup();
                }
              }
              this.commonObjs.clear();
              FontLoader.clear();
            });
      },
    };
    return WorkerTransport;
  })();

  /**
 * A PDF document and page is built of many objects. E.g. there are objects
 * for fonts, images, rendering code and such. These objects might get processed
 * inside of a worker. The `PDFObjects` implements some basic functions to
 * manage these objects.
 * @ignore
 */
  var PDFObjects = (function PDFObjectsClosure() {
    function PDFObjects() {
      this.objs = {};
    }

    PDFObjects.prototype = {
    /**
     * Internal function.
     * Ensures there is an object defined for `objId`.
     */
      ensureObj: function PDFObjects_ensureObj(objId) {
        if (this.objs[objId]) {
          return this.objs[objId];
        }

        const obj = {
          capability: createPromiseCapability(),
          data: null,
          resolved: false,
        };
        this.objs[objId] = obj;

        return obj;
      },

      /**
     * If called *without* callback, this returns the data of `objId` but the
     * object needs to be resolved. If it isn't, this function throws.
     *
     * If called *with* a callback, the callback is called with the data of the
     * object once the object is resolved. That means, if you call this
     * function and the object is already resolved, the callback gets called
     * right away.
     */
      get: function PDFObjects_get(objId, callback) {
      // If there is a callback, then the get can be async and the object is
      // not required to be resolved right now
        if (callback) {
          this.ensureObj(objId).capability.promise.then(callback);
          return null;
        }

        // If there isn't a callback, the user expects to get the resolved data
        // directly.
        const obj = this.objs[objId];

        // If there isn't an object yet or the object isn't resolved, then the
        // data isn't ready yet!
        if (!obj || !obj.resolved) {
          error(`Requesting object that isn't resolved yet ${objId}`);
        }

        return obj.data;
      },

      /**
     * Resolves the object `objId` with optional `data`.
     */
      resolve: function PDFObjects_resolve(objId, data) {
        const obj = this.ensureObj(objId);

        obj.resolved = true;
        obj.data = data;
        obj.capability.resolve(data);
      },

      isResolved: function PDFObjects_isResolved(objId) {
        const objs = this.objs;

        if (!objs[objId]) {
          return false;
        } else {
          return objs[objId].resolved;
        }
      },

      hasData: function PDFObjects_hasData(objId) {
        return this.isResolved(objId);
      },

      /**
     * Returns the data of `objId` if object exists, null otherwise.
     */
      getData: function PDFObjects_getData(objId) {
        const objs = this.objs;
        if (!objs[objId] || !objs[objId].resolved) {
          return null;
        } else {
          return objs[objId].data;
        }
      },

      clear: function PDFObjects_clear() {
        this.objs = {};
      },
    };
    return PDFObjects;
  })();

  /**
 * Allows controlling of the rendering tasks.
 * @class
 * @alias RenderTask
 */
  const RenderTask = (function RenderTaskClosure() {
    function RenderTask(internalRenderTask) {
      this._internalRenderTask = internalRenderTask;

      /**
     * Callback for incremental rendering -- a function that will be called
     * each time the rendering is paused.  To continue rendering call the
     * function that is the first argument to the callback.
     * @type {function}
     */
      this.onContinue = null;
    }

    RenderTask.prototype = /** @lends RenderTask.prototype */ {
    /**
     * Promise for rendering task completion.
     * @return {Promise}
     */
      get promise() {
        return this._internalRenderTask.capability.promise;
      },

      /**
     * Cancels the rendering task. If the task is currently rendering it will
     * not be cancelled until graphics pauses with a timeout. The promise that
     * this object extends will resolved when cancelled.
     */
      cancel: function RenderTask_cancel() {
        this._internalRenderTask.cancel();
      },

      /**
     * Registers callbacks to indicate the rendering task completion.
     *
     * @param {function} onFulfilled The callback for the rendering completion.
     * @param {function} onRejected The callback for the rendering failure.
     * @return {Promise} A promise that is resolved after the onFulfilled or
     *                   onRejected callback.
     */
      then: function RenderTask_then(onFulfilled, onRejected) {
        return this.promise.then.apply(this.promise, arguments);
      },
    };

    return RenderTask;
  })();

  /**
 * For internal use only.
 * @ignore
 */
  var InternalRenderTask = (function InternalRenderTaskClosure() {
    function InternalRenderTask(callback, params, objs, commonObjs, operatorList,
        pageNumber) {
      this.callback = callback;
      this.params = params;
      this.objs = objs;
      this.commonObjs = commonObjs;
      this.operatorListIdx = null;
      this.operatorList = operatorList;
      this.pageNumber = pageNumber;
      this.running = false;
      this.graphicsReadyCallback = null;
      this.graphicsReady = false;
      this.useRequestAnimationFrame = false;
      this.cancelled = false;
      this.capability = createPromiseCapability();
      this.task = new RenderTask(this);
      // caching this-bound methods
      this._continueBound = this._continue.bind(this);
      this._scheduleNextBound = this._scheduleNext.bind(this);
      this._nextBound = this._next.bind(this);
    }

    InternalRenderTask.prototype = {

      initalizeGraphics:
        function InternalRenderTask_initalizeGraphics(transparency) {
          if (this.cancelled) {
            return;
          }
          if (PDFJS.pdfBug && 'StepperManager' in globalScope &&
          globalScope.StepperManager.enabled) {
            this.stepper = globalScope.StepperManager.create(this.pageNumber - 1);
            this.stepper.init(this.operatorList);
            this.stepper.nextBreakPoint = this.stepper.getNextBreakPoint();
          }

          const params = this.params;
          this.gfx = new CanvasGraphics(params.canvasContext, this.commonObjs,
              this.objs, params.imageLayer);

          this.gfx.beginDrawing(params.transform, params.viewport, transparency);
          this.operatorListIdx = 0;
          this.graphicsReady = true;
          if (this.graphicsReadyCallback) {
            this.graphicsReadyCallback();
          }
        },

      cancel: function InternalRenderTask_cancel() {
        this.running = false;
        this.cancelled = true;
        this.callback('cancelled');
      },

      operatorListChanged: function InternalRenderTask_operatorListChanged() {
        if (!this.graphicsReady) {
          if (!this.graphicsReadyCallback) {
            this.graphicsReadyCallback = this._continueBound;
          }
          return;
        }

        if (this.stepper) {
          this.stepper.updateOperatorList(this.operatorList);
        }

        if (this.running) {
          return;
        }
        this._continue();
      },

      _continue: function InternalRenderTask__continue() {
        this.running = true;
        if (this.cancelled) {
          return;
        }
        if (this.task.onContinue) {
          this.task.onContinue.call(this.task, this._scheduleNextBound);
        } else {
          this._scheduleNext();
        }
      },

      _scheduleNext: function InternalRenderTask__scheduleNext() {
        if (this.useRequestAnimationFrame) {
          window.requestAnimationFrame(this._nextBound);
        } else {
          Promise.resolve(undefined).then(this._nextBound);
        }
      },

      _next: function InternalRenderTask__next() {
        if (this.cancelled) {
          return;
        }
        this.operatorListIdx = this.gfx.executeOperatorList(this.operatorList,
            this.operatorListIdx,
            this._continueBound,
            this.stepper);
        if (this.operatorListIdx === this.operatorList.argsArray.length) {
          this.running = false;
          if (this.operatorList.lastChunk) {
            this.gfx.endDrawing();
            this.callback();
          }
        }
      },

    };

    return InternalRenderTask;
  })();


  const Metadata = PDFJS.Metadata = (function MetadataClosure() {
    function fixMetadata(meta) {
      return meta.replace(/>\\376\\377([^<]+)/g, (all, codes) => {
        const bytes = codes.replace(/\\([0-3])([0-7])([0-7])/g,
            (code, d1, d2, d3) => String.fromCharCode(d1 * 64 + d2 * 8 + d3 * 1));
        let chars = '';
        for (let i = 0; i < bytes.length; i += 2) {
          const code = bytes.charCodeAt(i) * 256 + bytes.charCodeAt(i + 1);
          chars += code >= 32 && code < 127 && code !== 60 && code !== 62 &&
          code !== 38 && false ? String.fromCharCode(code)
            : `&#x${(0x10000 + code).toString(16).substring(1)};`;
        }
        return `>${chars}`;
      });
    }

    function Metadata(meta) {
      if (typeof meta === 'string') {
      // Ghostscript produces invalid metadata
        meta = fixMetadata(meta);

        const parser = new DOMParser();
        meta = parser.parseFromString(meta, 'application/xml');
      } else if (!(meta instanceof Document)) {
        error('Metadata: Invalid metadata object');
      }

      this.metaDocument = meta;
      this.metadata = {};
      this.parse();
    }

    Metadata.prototype = {
      parse: function Metadata_parse() {
        const doc = this.metaDocument;
        let rdf = doc.documentElement;

        if (rdf.nodeName.toLowerCase() !== 'rdf:rdf') { // Wrapped in <xmpmeta>
          rdf = rdf.firstChild;
          while (rdf && rdf.nodeName.toLowerCase() !== 'rdf:rdf') {
            rdf = rdf.nextSibling;
          }
        }

        const nodeName = (rdf) ? rdf.nodeName.toLowerCase() : null;
        if (!rdf || nodeName !== 'rdf:rdf' || !rdf.hasChildNodes()) {
          return;
        }

        const children = rdf.childNodes; let desc; let entry; let name; let i; let ii; let length; let iLength;
        for (i = 0, length = children.length; i < length; i++) {
          desc = children[i];
          if (desc.nodeName.toLowerCase() !== 'rdf:description') {
            continue;
          }

          for (ii = 0, iLength = desc.childNodes.length; ii < iLength; ii++) {
            if (desc.childNodes[ii].nodeName.toLowerCase() !== '#text') {
              entry = desc.childNodes[ii];
              name = entry.nodeName.toLowerCase();
              this.metadata[name] = entry.textContent.trim();
            }
          }
        }
      },

      get: function Metadata_get(name) {
        return this.metadata[name] || null;
      },

      has: function Metadata_has(name) {
        return typeof this.metadata[name] !== 'undefined';
      },
    };

    return Metadata;
  })();


  // <canvas> contexts store most of the state we need natively.
  // However, PDF needs a bit more state, which we store here.

  // Minimal font size that would be used during canvas fillText operations.
  const MIN_FONT_SIZE = 16;
  // Maximum font size that would be used during canvas fillText operations.
  const MAX_FONT_SIZE = 100;
  const MAX_GROUP_SIZE = 4096;

  // Heuristic value used when enforcing minimum line widths.
  const MIN_WIDTH_FACTOR = 0.65;

  const COMPILE_TYPE3_GLYPHS = true;
  const MAX_SIZE_TO_COMPILE = 1000;

  const FULL_CHUNK_HEIGHT = 16;

  function createScratchCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function addContextCurrentTransform(ctx) {
  // If the context doesn't expose a `mozCurrentTransform`, add a JS based one.
    if (!ctx.mozCurrentTransform) {
      ctx._originalSave = ctx.save;
      ctx._originalRestore = ctx.restore;
      ctx._originalRotate = ctx.rotate;
      ctx._originalScale = ctx.scale;
      ctx._originalTranslate = ctx.translate;
      ctx._originalTransform = ctx.transform;
      ctx._originalSetTransform = ctx.setTransform;

      ctx._transformMatrix = ctx._transformMatrix || [1, 0, 0, 1, 0, 0];
      ctx._transformStack = [];

      Object.defineProperty(ctx, 'mozCurrentTransform', {
        get: function getCurrentTransform() {
          return this._transformMatrix;
        },
      });

      Object.defineProperty(ctx, 'mozCurrentTransformInverse', {
        get: function getCurrentTransformInverse() {
        // Calculation done using WolframAlpha:
        // http://www.wolframalpha.com/input/?
        //   i=Inverse+{{a%2C+c%2C+e}%2C+{b%2C+d%2C+f}%2C+{0%2C+0%2C+1}}

          const m = this._transformMatrix;
          const a = m[0]; const b = m[1]; const c = m[2]; const d = m[3]; const e = m[4]; const
            f = m[5];

          const ad_bc = a * d - b * c;
          const bc_ad = b * c - a * d;

          return [
            d / ad_bc,
            b / bc_ad,
            c / bc_ad,
            a / ad_bc,
            (d * e - c * f) / bc_ad,
            (b * e - a * f) / ad_bc,
          ];
        },
      });

      ctx.save = function ctxSave() {
        const old = this._transformMatrix;
        this._transformStack.push(old);
        this._transformMatrix = old.slice(0, 6);

        this._originalSave();
      };

      ctx.restore = function ctxRestore() {
        const prev = this._transformStack.pop();
        if (prev) {
          this._transformMatrix = prev;
          this._originalRestore();
        }
      };

      ctx.translate = function ctxTranslate(x, y) {
        const m = this._transformMatrix;
        m[4] = m[0] * x + m[2] * y + m[4];
        m[5] = m[1] * x + m[3] * y + m[5];

        this._originalTranslate(x, y);
      };

      ctx.scale = function ctxScale(x, y) {
        const m = this._transformMatrix;
        m[0] *= x;
        m[1] *= x;
        m[2] *= y;
        m[3] *= y;

        this._originalScale(x, y);
      };

      ctx.transform = function ctxTransform(a, b, c, d, e, f) {
        const m = this._transformMatrix;
        this._transformMatrix = [
          m[0] * a + m[2] * b,
          m[1] * a + m[3] * b,
          m[0] * c + m[2] * d,
          m[1] * c + m[3] * d,
          m[0] * e + m[2] * f + m[4],
          m[1] * e + m[3] * f + m[5],
        ];

        ctx._originalTransform(a, b, c, d, e, f);
      };

      ctx.setTransform = function ctxSetTransform(a, b, c, d, e, f) {
        this._transformMatrix = [a, b, c, d, e, f];

        ctx._originalSetTransform(a, b, c, d, e, f);
      };

      ctx.rotate = function ctxRotate(angle) {
        const cosValue = Math.cos(angle);
        const sinValue = Math.sin(angle);

        const m = this._transformMatrix;
        this._transformMatrix = [
          m[0] * cosValue + m[2] * sinValue,
          m[1] * cosValue + m[3] * sinValue,
          m[0] * (-sinValue) + m[2] * cosValue,
          m[1] * (-sinValue) + m[3] * cosValue,
          m[4],
          m[5],
        ];

        this._originalRotate(angle);
      };
    }
  }

  const CachedCanvases = (function CachedCanvasesClosure() {
    function CachedCanvases() {
      this.cache = Object.create(null);
    }
    CachedCanvases.prototype = {
      getCanvas: function CachedCanvases_getCanvas(id, width, height,
          trackTransform) {
        let canvasEntry;
        if (this.cache[id] !== undefined) {
          canvasEntry = this.cache[id];
          canvasEntry.canvas.width = width;
          canvasEntry.canvas.height = height;
          // reset canvas transform for emulated mozCurrentTransform, if needed
          canvasEntry.context.setTransform(1, 0, 0, 1, 0, 0);
        } else {
          const canvas = createScratchCanvas(width, height);
          const ctx = canvas.getContext('2d');
          if (trackTransform) {
            addContextCurrentTransform(ctx);
          }
          this.cache[id] = canvasEntry = {canvas, context: ctx};
        }
        return canvasEntry;
      },
      clear() {
        for (const id in this.cache) {
          const canvasEntry = this.cache[id];
          // Zeroing the width and height causes Firefox to release graphics
          // resources immediately, which can greatly reduce memory consumption.
          canvasEntry.canvas.width = 0;
          canvasEntry.canvas.height = 0;
          delete this.cache[id];
        }
      },
    };
    return CachedCanvases;
  })();

  function compileType3Glyph(imgData) {
    const POINT_TO_PROCESS_LIMIT = 1000;

    const width = imgData.width; const
      height = imgData.height;
    let i; let j; let j0; const
      width1 = width + 1;
    const points = new Uint8Array(width1 * (height + 1));
    const POINT_TYPES =
      new Uint8Array([0, 2, 4, 0, 1, 0, 5, 4, 8, 10, 0, 8, 0, 2, 1, 0]);

    // decodes bit-packed mask data
    const lineSize = (width + 7) & ~7; const
      data0 = imgData.data;
    const data = new Uint8Array(lineSize * height); let pos = 0; let
      ii;
    for (i = 0, ii = data0.length; i < ii; i++) {
      let mask = 128; const
        elem = data0[i];
      while (mask > 0) {
        data[pos++] = (elem & mask) ? 0 : 255;
        mask >>= 1;
      }
    }

    // finding iteresting points: every point is located between mask pixels,
    // so there will be points of the (width + 1)x(height + 1) grid. Every point
    // will have flags assigned based on neighboring mask pixels:
    //   4 | 8
    //   --P--
    //   2 | 1
    // We are interested only in points with the flags:
    //   - outside corners: 1, 2, 4, 8;
    //   - inside corners: 7, 11, 13, 14;
    //   - and, intersections: 5, 10.
    let count = 0;
    pos = 0;
    if (data[pos] !== 0) {
      points[0] = 1;
      ++count;
    }
    for (j = 1; j < width; j++) {
      if (data[pos] !== data[pos + 1]) {
        points[j] = data[pos] ? 2 : 1;
        ++count;
      }
      pos++;
    }
    if (data[pos] !== 0) {
      points[j] = 2;
      ++count;
    }
    for (i = 1; i < height; i++) {
      pos = i * lineSize;
      j0 = i * width1;
      if (data[pos - lineSize] !== data[pos]) {
        points[j0] = data[pos] ? 1 : 8;
        ++count;
      }
      // 'sum' is the position of the current pixel configuration in the 'TYPES'
      // array (in order 8-1-2-4, so we can use '>>2' to shift the column).
      let sum = (data[pos] ? 4 : 0) + (data[pos - lineSize] ? 8 : 0);
      for (j = 1; j < width; j++) {
        sum = (sum >> 2) + (data[pos + 1] ? 4 : 0) +
            (data[pos - lineSize + 1] ? 8 : 0);
        if (POINT_TYPES[sum]) {
          points[j0 + j] = POINT_TYPES[sum];
          ++count;
        }
        pos++;
      }
      if (data[pos - lineSize] !== data[pos]) {
        points[j0 + j] = data[pos] ? 2 : 4;
        ++count;
      }

      if (count > POINT_TO_PROCESS_LIMIT) {
        return null;
      }
    }

    pos = lineSize * (height - 1);
    j0 = i * width1;
    if (data[pos] !== 0) {
      points[j0] = 8;
      ++count;
    }
    for (j = 1; j < width; j++) {
      if (data[pos] !== data[pos + 1]) {
        points[j0 + j] = data[pos] ? 4 : 8;
        ++count;
      }
      pos++;
    }
    if (data[pos] !== 0) {
      points[j0 + j] = 4;
      ++count;
    }
    if (count > POINT_TO_PROCESS_LIMIT) {
      return null;
    }

    // building outlines
    const steps = new Int32Array([0, width1, -1, 0, -width1, 0, 0, 0, 1]);
    const outlines = [];
    for (i = 0; count && i <= height; i++) {
      let p = i * width1;
      const end = p + width;
      while (p < end && !points[p]) {
        p++;
      }
      if (p === end) {
        continue;
      }
      const coords = [p % width1, i];

      let type = points[p]; const p0 = p; var
        pp;
      do {
        const step = steps[type];
        do {
          p += step;
        } while (!points[p]);

        pp = points[p];
        if (pp !== 5 && pp !== 10) {
        // set new direction
          type = pp;
          // delete mark
          points[p] = 0;
        } else { // type is 5 or 10, ie, a crossing
        // set new direction
          type = pp & ((0x33 * type) >> 4);
          // set new type for "future hit"
          points[p] &= (type >> 2 | type << 2);
        }

        coords.push(p % width1);
        coords.push((p / width1) | 0);
        --count;
      } while (p0 !== p);
      outlines.push(coords);
      --i;
    }

    const drawOutline = function (c) {
      c.save();
      // the path shall be painted in [0..1]x[0..1] space
      c.scale(1 / width, -1 / height);
      c.translate(0, -height);
      c.beginPath();
      for (let i = 0, ii = outlines.length; i < ii; i++) {
        const o = outlines[i];
        c.moveTo(o[0], o[1]);
        for (let j = 2, jj = o.length; j < jj; j += 2) {
          c.lineTo(o[j], o[j + 1]);
        }
      }
      c.fill();
      c.beginPath();
      c.restore();
    };

    return drawOutline;
  }

  const CanvasExtraState = (function CanvasExtraStateClosure() {
    function CanvasExtraState(old) {
    // Are soft masks and alpha values shapes or opacities?
      this.alphaIsShape = false;
      this.fontSize = 0;
      this.fontSizeScale = 1;
      this.textMatrix = IDENTITY_MATRIX;
      this.textMatrixScale = 1;
      this.fontMatrix = FONT_IDENTITY_MATRIX;
      this.leading = 0;
      // Current point (in user coordinates)
      this.x = 0;
      this.y = 0;
      // Start of text line (in text coordinates)
      this.lineX = 0;
      this.lineY = 0;
      // Character and word spacing
      this.charSpacing = 0;
      this.wordSpacing = 0;
      this.textHScale = 1;
      this.textRenderingMode = TextRenderingMode.FILL;
      this.textRise = 0;
      // Default fore and background colors
      this.fillColor = '#000000';
      this.strokeColor = '#000000';
      this.patternFill = false;
      // Note: fill alpha applies to all non-stroking operations
      this.fillAlpha = 1;
      this.strokeAlpha = 1;
      this.lineWidth = 1;
      this.activeSMask = null; // nonclonable field (see the save method below)

      this.old = old;
    }

    CanvasExtraState.prototype = {
      clone: function CanvasExtraState_clone() {
        return Object.create(this);
      },
      setCurrentPoint: function CanvasExtraState_setCurrentPoint(x, y) {
        this.x = x;
        this.y = y;
      },
    };
    return CanvasExtraState;
  })();

  var CanvasGraphics = (function CanvasGraphicsClosure() {
  // Defines the time the executeOperatorList is going to be executing
  // before it stops and shedules a continue of execution.
    const EXECUTION_TIME = 15;
    // Defines the number of steps before checking the execution time
    const EXECUTION_STEPS = 10;

    function CanvasGraphics(canvasCtx, commonObjs, objs, imageLayer) {
      this.ctx = canvasCtx;
      this.current = new CanvasExtraState();
      this.stateStack = [];
      this.pendingClip = null;
      this.pendingEOFill = false;
      this.res = null;
      this.xobjs = null;
      this.commonObjs = commonObjs;
      this.objs = objs;
      this.imageLayer = imageLayer;
      this.groupStack = [];
      this.processingType3 = null;
      // Patterns are painted relative to the initial page/form transform, see pdf
      // spec 8.7.2 NOTE 1.
      this.baseTransform = null;
      this.baseTransformStack = [];
      this.groupLevel = 0;
      this.smaskStack = [];
      this.smaskCounter = 0;
      this.tempSMask = null;
      this.cachedCanvases = new CachedCanvases();
      if (canvasCtx) {
      // NOTE: if mozCurrentTransform is polyfilled, then the current state of
      // the transformation must already be set in canvasCtx._transformMatrix.
        addContextCurrentTransform(canvasCtx);
      }
      this.cachedGetSinglePixelWidth = null;
    }

    function putBinaryImageData(ctx, imgData) {
      if (typeof ImageData !== 'undefined' && imgData instanceof ImageData) {
        ctx.putImageData(imgData, 0, 0);
        return;
      }

      // Put the image data to the canvas in chunks, rather than putting the
      // whole image at once.  This saves JS memory, because the ImageData object
      // is smaller. It also possibly saves C++ memory within the implementation
      // of putImageData(). (E.g. in Firefox we make two short-lived copies of
      // the data passed to putImageData()). |n| shouldn't be too small, however,
      // because too many putImageData() calls will slow things down.
      //
      // Note: as written, if the last chunk is partial, the putImageData() call
      // will (conceptually) put pixels past the bounds of the canvas.  But
      // that's ok; any such pixels are ignored.

      const height = imgData.height; const
        width = imgData.width;
      const partialChunkHeight = height % FULL_CHUNK_HEIGHT;
      const fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
      const totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;

      const chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
      let srcPos = 0; let
        destPos;
      const src = imgData.data;
      const dest = chunkImgData.data;
      let i, j, thisChunkHeight, elemsInThisChunk;

      // There are multiple forms in which the pixel data can be passed, and
      // imgData.kind tells us which one this is.
      if (imgData.kind === ImageKind.GRAYSCALE_1BPP) {
      // Grayscale, 1 bit per pixel (i.e. black-and-white).
        const srcLength = src.byteLength;
        const dest32 = PDFJS.hasCanvasTypedArrays ? new Uint32Array(dest.buffer)
          : new Uint32ArrayView(dest);
        const dest32DataLength = dest32.length;
        const fullSrcDiff = (width + 7) >> 3;
        const white = 0xFFFFFFFF;
        const black = (PDFJS.isLittleEndian || !PDFJS.hasCanvasTypedArrays)
          ? 0xFF000000 : 0x000000FF;
        for (i = 0; i < totalChunks; i++) {
          thisChunkHeight =
          (i < fullChunks) ? FULL_CHUNK_HEIGHT : partialChunkHeight;
          destPos = 0;
          for (j = 0; j < thisChunkHeight; j++) {
            const srcDiff = srcLength - srcPos;
            let k = 0;
            const kEnd = (srcDiff > fullSrcDiff) ? width : srcDiff * 8 - 7;
            const kEndUnrolled = kEnd & ~7;
            let mask = 0;
            let srcByte = 0;
            for (; k < kEndUnrolled; k += 8) {
              srcByte = src[srcPos++];
              dest32[destPos++] = (srcByte & 128) ? white : black;
              dest32[destPos++] = (srcByte & 64) ? white : black;
              dest32[destPos++] = (srcByte & 32) ? white : black;
              dest32[destPos++] = (srcByte & 16) ? white : black;
              dest32[destPos++] = (srcByte & 8) ? white : black;
              dest32[destPos++] = (srcByte & 4) ? white : black;
              dest32[destPos++] = (srcByte & 2) ? white : black;
              dest32[destPos++] = (srcByte & 1) ? white : black;
            }
            for (; k < kEnd; k++) {
              if (mask === 0) {
                srcByte = src[srcPos++];
                mask = 128;
              }

              dest32[destPos++] = (srcByte & mask) ? white : black;
              mask >>= 1;
            }
          }
          // We ran out of input. Make all remaining pixels transparent.
          while (destPos < dest32DataLength) {
            dest32[destPos++] = 0;
          }

          ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
        }
      } else if (imgData.kind === ImageKind.RGBA_32BPP) {
      // RGBA, 32-bits per pixel.

        j = 0;
        elemsInThisChunk = width * FULL_CHUNK_HEIGHT * 4;
        for (i = 0; i < fullChunks; i++) {
          dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
          srcPos += elemsInThisChunk;

          ctx.putImageData(chunkImgData, 0, j);
          j += FULL_CHUNK_HEIGHT;
        }
        if (i < totalChunks) {
          elemsInThisChunk = width * partialChunkHeight * 4;
          dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
          ctx.putImageData(chunkImgData, 0, j);
        }
      } else if (imgData.kind === ImageKind.RGB_24BPP) {
      // RGB, 24-bits per pixel.
        thisChunkHeight = FULL_CHUNK_HEIGHT;
        elemsInThisChunk = width * thisChunkHeight;
        for (i = 0; i < totalChunks; i++) {
          if (i >= fullChunks) {
            thisChunkHeight = partialChunkHeight;
            elemsInThisChunk = width * thisChunkHeight;
          }

          destPos = 0;
          for (j = elemsInThisChunk; j--;) {
            dest[destPos++] = src[srcPos++];
            dest[destPos++] = src[srcPos++];
            dest[destPos++] = src[srcPos++];
            dest[destPos++] = 255;
          }
          ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
        }
      } else {
        error(`bad image kind: ${imgData.kind}`);
      }
    }

    function putBinaryImageMask(ctx, imgData) {
      const height = imgData.height; const
        width = imgData.width;
      const partialChunkHeight = height % FULL_CHUNK_HEIGHT;
      const fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
      const totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;

      const chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
      let srcPos = 0;
      const src = imgData.data;
      const dest = chunkImgData.data;

      for (let i = 0; i < totalChunks; i++) {
        const thisChunkHeight =
        (i < fullChunks) ? FULL_CHUNK_HEIGHT : partialChunkHeight;

        // Expand the mask so it can be used by the canvas.  Any required
        // inversion has already been handled.
        let destPos = 3; // alpha component offset
        for (let j = 0; j < thisChunkHeight; j++) {
          let mask = 0;
          for (let k = 0; k < width; k++) {
            if (!mask) {
              var elem = src[srcPos++];
              mask = 128;
            }
            dest[destPos] = (elem & mask) ? 0 : 255;
            destPos += 4;
            mask >>= 1;
          }
        }
        ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
      }
    }

    function copyCtxState(sourceCtx, destCtx) {
      const properties = ['strokeStyle',
        'fillStyle',
        'fillRule',
        'globalAlpha',
        'lineWidth',
        'lineCap',
        'lineJoin',
        'miterLimit',
        'globalCompositeOperation',
        'font'];
      for (let i = 0, ii = properties.length; i < ii; i++) {
        const property = properties[i];
        if (sourceCtx[property] !== undefined) {
          destCtx[property] = sourceCtx[property];
        }
      }
      if (sourceCtx.setLineDash !== undefined) {
        destCtx.setLineDash(sourceCtx.getLineDash());
        destCtx.lineDashOffset = sourceCtx.lineDashOffset;
      } else if (sourceCtx.mozDashOffset !== undefined) {
        destCtx.mozDash = sourceCtx.mozDash;
        destCtx.mozDashOffset = sourceCtx.mozDashOffset;
      }
    }

    function composeSMaskBackdrop(bytes, r0, g0, b0) {
      const length = bytes.length;
      for (let i = 3; i < length; i += 4) {
        const alpha = bytes[i];
        if (alpha === 0) {
          bytes[i - 3] = r0;
          bytes[i - 2] = g0;
          bytes[i - 1] = b0;
        } else if (alpha < 255) {
          const alpha_ = 255 - alpha;
          bytes[i - 3] = (bytes[i - 3] * alpha + r0 * alpha_) >> 8;
          bytes[i - 2] = (bytes[i - 2] * alpha + g0 * alpha_) >> 8;
          bytes[i - 1] = (bytes[i - 1] * alpha + b0 * alpha_) >> 8;
        }
      }
    }

    function composeSMaskAlpha(maskData, layerData) {
      const length = maskData.length;
      const scale = 1 / 255;
      for (let i = 3; i < length; i += 4) {
        const alpha = maskData[i];
        layerData[i] = (layerData[i] * alpha * scale) | 0;
      }
    }

    function composeSMaskLuminosity(maskData, layerData) {
      const length = maskData.length;
      for (let i = 3; i < length; i += 4) {
        const y = (maskData[i - 3] * 77) + // * 0.3 / 255 * 0x10000
              (maskData[i - 2] * 152) + // * 0.59 ....
              (maskData[i - 1] * 28); // * 0.11 ....
        layerData[i] = (layerData[i] * y) >> 16;
      }
    }

    function genericComposeSMask(maskCtx, layerCtx, width, height,
        subtype, backdrop) {
      const hasBackdrop = !!backdrop;
      const r0 = hasBackdrop ? backdrop[0] : 0;
      const g0 = hasBackdrop ? backdrop[1] : 0;
      const b0 = hasBackdrop ? backdrop[2] : 0;

      let composeFn;
      if (subtype === 'Luminosity') {
        composeFn = composeSMaskLuminosity;
      } else {
        composeFn = composeSMaskAlpha;
      }

      // processing image in chunks to save memory
      const PIXELS_TO_PROCESS = 1048576;
      const chunkSize = Math.min(height, Math.ceil(PIXELS_TO_PROCESS / width));
      for (let row = 0; row < height; row += chunkSize) {
        const chunkHeight = Math.min(chunkSize, height - row);
        const maskData = maskCtx.getImageData(0, row, width, chunkHeight);
        const layerData = layerCtx.getImageData(0, row, width, chunkHeight);

        if (hasBackdrop) {
          composeSMaskBackdrop(maskData.data, r0, g0, b0);
        }
        composeFn(maskData.data, layerData.data);

        maskCtx.putImageData(layerData, 0, row);
      }
    }

    function composeSMask(ctx, smask, layerCtx) {
      const mask = smask.canvas;
      const maskCtx = smask.context;

      ctx.setTransform(smask.scaleX, 0, 0, smask.scaleY,
          smask.offsetX, smask.offsetY);

      const backdrop = smask.backdrop || null;
      if (WebGLUtils.isEnabled) {
        const composed = WebGLUtils.composeSMask(layerCtx.canvas, mask,
            {subtype: smask.subtype, backdrop});
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(composed, smask.offsetX, smask.offsetY);
        return;
      }
      genericComposeSMask(maskCtx, layerCtx, mask.width, mask.height,
          smask.subtype, backdrop);
      ctx.drawImage(mask, 0, 0);
    }

    const LINE_CAP_STYLES = ['butt', 'round', 'square'];
    const LINE_JOIN_STYLES = ['miter', 'round', 'bevel'];
    const NORMAL_CLIP = {};
    const EO_CLIP = {};

    CanvasGraphics.prototype = {

      beginDrawing: function CanvasGraphics_beginDrawing(transform, viewport,
          transparency) {
      // For pdfs that use blend modes we have to clear the canvas else certain
      // blend modes can look wrong since we'd be blending with a white
      // backdrop. The problem with a transparent backdrop though is we then
      // don't get sub pixel anti aliasing on text, creating temporary
      // transparent canvas when we have blend modes.
        const width = this.ctx.canvas.width;
        const height = this.ctx.canvas.height;

        this.ctx.save();
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.fillRect(0, 0, width, height);
        this.ctx.restore();

        if (transparency) {
          const transparentCanvas = this.cachedCanvases.getCanvas(
              'transparent', width, height, true);
          this.compositeCtx = this.ctx;
          this.transparentCanvas = transparentCanvas.canvas;
          this.ctx = transparentCanvas.context;
          this.ctx.save();
          // The transform can be applied before rendering, transferring it to
          // the new canvas.
          this.ctx.transform.apply(this.ctx,
              this.compositeCtx.mozCurrentTransform);
        }

        this.ctx.save();
        if (transform) {
          this.ctx.transform.apply(this.ctx, transform);
        }
        this.ctx.transform.apply(this.ctx, viewport.transform);

        this.baseTransform = this.ctx.mozCurrentTransform.slice();

        if (this.imageLayer) {
          this.imageLayer.beginLayout();
        }
      },

      executeOperatorList: function CanvasGraphics_executeOperatorList(
          operatorList,
          executionStartIdx, continueCallback,
          stepper) {
        const argsArray = operatorList.argsArray;
        const fnArray = operatorList.fnArray;
        let i = executionStartIdx || 0;
        const argsArrayLen = argsArray.length;

        // Sometimes the OperatorList to execute is empty.
        if (argsArrayLen === i) {
          return i;
        }

        const chunkOperations = (argsArrayLen - i > EXECUTION_STEPS &&
                             typeof continueCallback === 'function');
        const endTime = chunkOperations ? Date.now() + EXECUTION_TIME : 0;
        let steps = 0;

        const commonObjs = this.commonObjs;
        const objs = this.objs;
        let fnId;

        while (true) {
          if (stepper !== undefined && i === stepper.nextBreakPoint) {
            stepper.breakIt(i, continueCallback);
            return i;
          }

          fnId = fnArray[i];

          if (fnId !== OPS.dependency) {
            this[fnId].apply(this, argsArray[i]);
          } else {
            const deps = argsArray[i];
            for (let n = 0, nn = deps.length; n < nn; n++) {
              const depObjId = deps[n];
              const common = depObjId[0] === 'g' && depObjId[1] === '_';
              const objsPool = common ? commonObjs : objs;

              // If the promise isn't resolved yet, add the continueCallback
              // to the promise and bail out.
              if (!objsPool.isResolved(depObjId)) {
                objsPool.get(depObjId, continueCallback);
                return i;
              }
            }
          }

          i++;

          // If the entire operatorList was executed, stop as were done.
          if (i === argsArrayLen) {
            return i;
          }

          // If the execution took longer then a certain amount of time and
          // `continueCallback` is specified, interrupt the execution.
          if (chunkOperations && ++steps > EXECUTION_STEPS) {
            if (Date.now() > endTime) {
              continueCallback();
              return i;
            }
            steps = 0;
          }

        // If the operatorList isn't executed completely yet OR the execution
        // time was short enough, do another execution round.
        }
      },

      endDrawing: function CanvasGraphics_endDrawing() {
        this.ctx.restore();

        if (this.transparentCanvas) {
          this.ctx = this.compositeCtx;
          this.ctx.drawImage(this.transparentCanvas, 0, 0);
          this.transparentCanvas = null;
        }

        this.cachedCanvases.clear();
        WebGLUtils.clear();

        if (this.imageLayer) {
          this.imageLayer.endLayout();
        }
      },

      // Graphics state
      setLineWidth: function CanvasGraphics_setLineWidth(width) {
        this.current.lineWidth = width;
        this.ctx.lineWidth = width;
      },
      setLineCap: function CanvasGraphics_setLineCap(style) {
        this.ctx.lineCap = LINE_CAP_STYLES[style];
      },
      setLineJoin: function CanvasGraphics_setLineJoin(style) {
        this.ctx.lineJoin = LINE_JOIN_STYLES[style];
      },
      setMiterLimit: function CanvasGraphics_setMiterLimit(limit) {
        this.ctx.miterLimit = limit;
      },
      setDash: function CanvasGraphics_setDash(dashArray, dashPhase) {
        const ctx = this.ctx;
        if (ctx.setLineDash !== undefined) {
          ctx.setLineDash(dashArray);
          ctx.lineDashOffset = dashPhase;
        } else {
          ctx.mozDash = dashArray;
          ctx.mozDashOffset = dashPhase;
        }
      },
      setRenderingIntent: function CanvasGraphics_setRenderingIntent(intent) {
      // Maybe if we one day fully support color spaces this will be important
      // for now we can ignore.
      // TODO set rendering intent?
      },
      setFlatness: function CanvasGraphics_setFlatness(flatness) {
      // There's no way to control this with canvas, but we can safely ignore.
      // TODO set flatness?
      },
      setGState: function CanvasGraphics_setGState(states) {
        for (let i = 0, ii = states.length; i < ii; i++) {
          const state = states[i];
          const key = state[0];
          const value = state[1];

          switch (key) {
            case 'LW':
              this.setLineWidth(value);
              break;
            case 'LC':
              this.setLineCap(value);
              break;
            case 'LJ':
              this.setLineJoin(value);
              break;
            case 'ML':
              this.setMiterLimit(value);
              break;
            case 'D':
              this.setDash(value[0], value[1]);
              break;
            case 'RI':
              this.setRenderingIntent(value);
              break;
            case 'FL':
              this.setFlatness(value);
              break;
            case 'Font':
              this.setFont(value[0], value[1]);
              break;
            case 'CA':
              this.current.strokeAlpha = state[1];
              break;
            case 'ca':
              this.current.fillAlpha = state[1];
              this.ctx.globalAlpha = state[1];
              break;
            case 'BM':
              if (value && value.name && (value.name !== 'Normal')) {
                const mode = value.name.replace(/([A-Z])/g,
                    (c) => `-${c.toLowerCase()}`
                ).substring(1);
                this.ctx.globalCompositeOperation = mode;
                if (this.ctx.globalCompositeOperation !== mode) {
                  warn(`globalCompositeOperation "${mode
                  }" is not supported`);
                }
              } else {
                this.ctx.globalCompositeOperation = 'source-over';
              }
              break;
            case 'SMask':
              if (this.current.activeSMask) {
                this.endSMaskGroup();
              }
              this.current.activeSMask = value ? this.tempSMask : null;
              if (this.current.activeSMask) {
                this.beginSMaskGroup();
              }
              this.tempSMask = null;
              break;
          }
        }
      },
      beginSMaskGroup: function CanvasGraphics_beginSMaskGroup() {
        const activeSMask = this.current.activeSMask;
        const drawnWidth = activeSMask.canvas.width;
        const drawnHeight = activeSMask.canvas.height;
        const cacheId = `smaskGroupAt${this.groupLevel}`;
        const scratchCanvas = this.cachedCanvases.getCanvas(
            cacheId, drawnWidth, drawnHeight, true);

        const currentCtx = this.ctx;
        const currentTransform = currentCtx.mozCurrentTransform;
        this.ctx.save();

        const groupCtx = scratchCanvas.context;
        groupCtx.scale(1 / activeSMask.scaleX, 1 / activeSMask.scaleY);
        groupCtx.translate(-activeSMask.offsetX, -activeSMask.offsetY);
        groupCtx.transform.apply(groupCtx, currentTransform);

        copyCtxState(currentCtx, groupCtx);
        this.ctx = groupCtx;
        this.setGState([
          ['BM', 'Normal'],
          ['ca', 1],
          ['CA', 1],
        ]);
        this.groupStack.push(currentCtx);
        this.groupLevel++;
      },
      endSMaskGroup: function CanvasGraphics_endSMaskGroup() {
        const groupCtx = this.ctx;
        this.groupLevel--;
        this.ctx = this.groupStack.pop();

        composeSMask(this.ctx, this.current.activeSMask, groupCtx);
        this.ctx.restore();
      },
      save: function CanvasGraphics_save() {
        this.ctx.save();
        const old = this.current;
        this.stateStack.push(old);
        this.current = old.clone();
        this.current.activeSMask = null;
      },
      restore: function CanvasGraphics_restore() {
        if (this.stateStack.length !== 0) {
          if (this.current.activeSMask !== null) {
            this.endSMaskGroup();
          }

          this.current = this.stateStack.pop();
          this.ctx.restore();

          // Ensure that the clipping path is reset (fixes issue6413.pdf).
          this.pendingClip = null;

          this.cachedGetSinglePixelWidth = null;
        }
      },
      transform: function CanvasGraphics_transform(a, b, c, d, e, f) {
        this.ctx.transform(a, b, c, d, e, f);

        this.cachedGetSinglePixelWidth = null;
      },

      // Path
      constructPath: function CanvasGraphics_constructPath(ops, args) {
        const ctx = this.ctx;
        const current = this.current;
        let x = current.x; let
          y = current.y;
        for (let i = 0, j = 0, ii = ops.length; i < ii; i++) {
          switch (ops[i] | 0) {
            case OPS.rectangle:
              x = args[j++];
              y = args[j++];
              var width = args[j++];
              var height = args[j++];
              if (width === 0) {
                width = this.getSinglePixelWidth();
              }
              if (height === 0) {
                height = this.getSinglePixelWidth();
              }
              var xw = x + width;
              var yh = y + height;
              this.ctx.moveTo(x, y);
              this.ctx.lineTo(xw, y);
              this.ctx.lineTo(xw, yh);
              this.ctx.lineTo(x, yh);
              this.ctx.lineTo(x, y);
              this.ctx.closePath();
              break;
            case OPS.moveTo:
              x = args[j++];
              y = args[j++];
              ctx.moveTo(x, y);
              break;
            case OPS.lineTo:
              x = args[j++];
              y = args[j++];
              ctx.lineTo(x, y);
              break;
            case OPS.curveTo:
              x = args[j + 4];
              y = args[j + 5];
              ctx.bezierCurveTo(args[j], args[j + 1], args[j + 2], args[j + 3],
                  x, y);
              j += 6;
              break;
            case OPS.curveTo2:
              ctx.bezierCurveTo(x, y, args[j], args[j + 1],
                  args[j + 2], args[j + 3]);
              x = args[j + 2];
              y = args[j + 3];
              j += 4;
              break;
            case OPS.curveTo3:
              x = args[j + 2];
              y = args[j + 3];
              ctx.bezierCurveTo(args[j], args[j + 1], x, y, x, y);
              j += 4;
              break;
            case OPS.closePath:
              ctx.closePath();
              break;
          }
        }
        current.setCurrentPoint(x, y);
      },
      closePath: function CanvasGraphics_closePath() {
        this.ctx.closePath();
      },
      stroke: function CanvasGraphics_stroke(consumePath) {
        consumePath = typeof consumePath !== 'undefined' ? consumePath : true;
        const ctx = this.ctx;
        const strokeColor = this.current.strokeColor;
        // Prevent drawing too thin lines by enforcing a minimum line width.
        ctx.lineWidth = Math.max(this.getSinglePixelWidth() * MIN_WIDTH_FACTOR,
            this.current.lineWidth);
        // For stroke we want to temporarily change the global alpha to the
        // stroking alpha.
        ctx.globalAlpha = this.current.strokeAlpha;
        if (strokeColor && strokeColor.hasOwnProperty('type') &&
          strokeColor.type === 'Pattern') {
        // for patterns, we transform to pattern space, calculate
        // the pattern, call stroke, and restore to user space
          ctx.save();
          ctx.strokeStyle = strokeColor.getPattern(ctx, this);
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.stroke();
        }
        if (consumePath) {
          this.consumePath();
        }
        // Restore the global alpha to the fill alpha
        ctx.globalAlpha = this.current.fillAlpha;
      },
      closeStroke: function CanvasGraphics_closeStroke() {
        this.closePath();
        this.stroke();
      },
      fill: function CanvasGraphics_fill(consumePath) {
        consumePath = typeof consumePath !== 'undefined' ? consumePath : true;
        const ctx = this.ctx;
        const fillColor = this.current.fillColor;
        const isPatternFill = this.current.patternFill;
        let needRestore = false;

        if (isPatternFill) {
          ctx.save();
          ctx.fillStyle = fillColor.getPattern(ctx, this);
          needRestore = true;
        }

        if (this.pendingEOFill) {
          if (ctx.mozFillRule !== undefined) {
            ctx.mozFillRule = 'evenodd';
            ctx.fill();
            ctx.mozFillRule = 'nonzero';
          } else {
            ctx.fill('evenodd');
          }
          this.pendingEOFill = false;
        } else {
          ctx.fill();
        }

        if (needRestore) {
          ctx.restore();
        }
        if (consumePath) {
          this.consumePath();
        }
      },
      eoFill: function CanvasGraphics_eoFill() {
        this.pendingEOFill = true;
        this.fill();
      },
      fillStroke: function CanvasGraphics_fillStroke() {
        this.fill(false);
        this.stroke(false);

        this.consumePath();
      },
      eoFillStroke: function CanvasGraphics_eoFillStroke() {
        this.pendingEOFill = true;
        this.fillStroke();
      },
      closeFillStroke: function CanvasGraphics_closeFillStroke() {
        this.closePath();
        this.fillStroke();
      },
      closeEOFillStroke: function CanvasGraphics_closeEOFillStroke() {
        this.pendingEOFill = true;
        this.closePath();
        this.fillStroke();
      },
      endPath: function CanvasGraphics_endPath() {
        this.consumePath();
      },

      // Clipping
      clip: function CanvasGraphics_clip() {
        this.pendingClip = NORMAL_CLIP;
      },
      eoClip: function CanvasGraphics_eoClip() {
        this.pendingClip = EO_CLIP;
      },

      // Text
      beginText: function CanvasGraphics_beginText() {
        this.current.textMatrix = IDENTITY_MATRIX;
        this.current.textMatrixScale = 1;
        this.current.x = this.current.lineX = 0;
        this.current.y = this.current.lineY = 0;
      },
      endText: function CanvasGraphics_endText() {
        const paths = this.pendingTextPaths;
        const ctx = this.ctx;
        if (paths === undefined) {
          ctx.beginPath();
          return;
        }

        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          ctx.setTransform.apply(ctx, path.transform);
          ctx.translate(path.x, path.y);
          path.addToPath(ctx, path.fontSize);
        }
        ctx.restore();
        ctx.clip();
        ctx.beginPath();
        delete this.pendingTextPaths;
      },
      setCharSpacing: function CanvasGraphics_setCharSpacing(spacing) {
        this.current.charSpacing = spacing;
      },
      setWordSpacing: function CanvasGraphics_setWordSpacing(spacing) {
        this.current.wordSpacing = spacing;
      },
      setHScale: function CanvasGraphics_setHScale(scale) {
        this.current.textHScale = scale / 100;
      },
      setLeading: function CanvasGraphics_setLeading(leading) {
        this.current.leading = -leading;
      },
      setFont: function CanvasGraphics_setFont(fontRefName, size) {
        const fontObj = this.commonObjs.get(fontRefName);
        const current = this.current;

        if (!fontObj) {
          error(`Can't find font for ${fontRefName}`);
        }

        current.fontMatrix = (fontObj.fontMatrix
          ? fontObj.fontMatrix : FONT_IDENTITY_MATRIX);

        // A valid matrix needs all main diagonal elements to be non-zero
        // This also ensures we bypass FF bugzilla bug #719844.
        if (current.fontMatrix[0] === 0 ||
          current.fontMatrix[3] === 0) {
          warn(`Invalid font matrix for font ${fontRefName}`);
        }

        // The spec for Tf (setFont) says that 'size' specifies the font 'scale',
        // and in some docs this can be negative (inverted x-y axes).
        if (size < 0) {
          size = -size;
          current.fontDirection = -1;
        } else {
          current.fontDirection = 1;
        }

        this.current.font = fontObj;
        this.current.fontSize = size;

        if (fontObj.isType3Font) {
          return; // we don't need ctx.font for Type3 fonts
        }

        const name = fontObj.loadedName || 'sans-serif';
        const bold = fontObj.black ? (fontObj.bold ? '900' : 'bold')
          : (fontObj.bold ? 'bold' : 'normal');

        const italic = fontObj.italic ? 'italic' : 'normal';
        const typeface = `"${name}", ${fontObj.fallbackName}`;

        // Some font backends cannot handle fonts below certain size.
        // Keeping the font at minimal size and using the fontSizeScale to change
        // the current transformation matrix before the fillText/strokeText.
        // See https://bugzilla.mozilla.org/show_bug.cgi?id=726227
        const browserFontSize = size < MIN_FONT_SIZE ? MIN_FONT_SIZE
          : size > MAX_FONT_SIZE ? MAX_FONT_SIZE : size;
        this.current.fontSizeScale = size / browserFontSize;

        const rule = `${italic} ${bold} ${browserFontSize}px ${typeface}`;
        this.ctx.font = rule;
      },
      setTextRenderingMode: function CanvasGraphics_setTextRenderingMode(mode) {
        this.current.textRenderingMode = mode;
      },
      setTextRise: function CanvasGraphics_setTextRise(rise) {
        this.current.textRise = rise;
      },
      moveText: function CanvasGraphics_moveText(x, y) {
        this.current.x = this.current.lineX += x;
        this.current.y = this.current.lineY += y;
      },
      setLeadingMoveText: function CanvasGraphics_setLeadingMoveText(x, y) {
        this.setLeading(-y);
        this.moveText(x, y);
      },
      setTextMatrix: function CanvasGraphics_setTextMatrix(a, b, c, d, e, f) {
        this.current.textMatrix = [a, b, c, d, e, f];
        this.current.textMatrixScale = Math.sqrt(a * a + b * b);

        this.current.x = this.current.lineX = 0;
        this.current.y = this.current.lineY = 0;
      },
      nextLine: function CanvasGraphics_nextLine() {
        this.moveText(0, this.current.leading);
      },

      paintChar: function CanvasGraphics_paintChar(character, x, y) {
        const ctx = this.ctx;
        const current = this.current;
        const font = current.font;
        const textRenderingMode = current.textRenderingMode;
        const fontSize = current.fontSize / current.fontSizeScale;
        const fillStrokeMode = textRenderingMode &
        TextRenderingMode.FILL_STROKE_MASK;
        const isAddToPathSet = !!(textRenderingMode &
        TextRenderingMode.ADD_TO_PATH_FLAG);

        let addToPath;
        if (font.disableFontFace || isAddToPathSet) {
          addToPath = font.getPathGenerator(this.commonObjs, character);
        }

        if (font.disableFontFace) {
          ctx.save();
          ctx.translate(x, y);
          ctx.beginPath();
          addToPath(ctx, fontSize);
          if (fillStrokeMode === TextRenderingMode.FILL ||
            fillStrokeMode === TextRenderingMode.FILL_STROKE) {
            ctx.fill();
          }
          if (fillStrokeMode === TextRenderingMode.STROKE ||
            fillStrokeMode === TextRenderingMode.FILL_STROKE) {
            ctx.stroke();
          }
          ctx.restore();
        } else {
          if (fillStrokeMode === TextRenderingMode.FILL ||
            fillStrokeMode === TextRenderingMode.FILL_STROKE) {
            ctx.fillText(character, x, y);
          }
          if (fillStrokeMode === TextRenderingMode.STROKE ||
            fillStrokeMode === TextRenderingMode.FILL_STROKE) {
            ctx.strokeText(character, x, y);
          }
        }

        if (isAddToPathSet) {
          const paths = this.pendingTextPaths || (this.pendingTextPaths = []);
          paths.push({
            transform: ctx.mozCurrentTransform,
            x,
            y,
            fontSize,
            addToPath,
          });
        }
      },

      get isFontSubpixelAAEnabled() {
      // Checks if anti-aliasing is enabled when scaled text is painted.
      // On Windows GDI scaled fonts looks bad.
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.scale(1.5, 1);
        ctx.fillText('I', 0, 10);
        const data = ctx.getImageData(0, 0, 10, 10).data;
        let enabled = false;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] > 0 && data[i] < 255) {
            enabled = true;
            break;
          }
        }
        return shadow(this, 'isFontSubpixelAAEnabled', enabled);
      },

      showText: function CanvasGraphics_showText(glyphs) {
        const current = this.current;
        const font = current.font;
        if (font.isType3Font) {
          return this.showType3Text(glyphs);
        }

        const fontSize = current.fontSize;
        if (fontSize === 0) {
          return;
        }

        const ctx = this.ctx;
        const fontSizeScale = current.fontSizeScale;
        const charSpacing = current.charSpacing;
        const wordSpacing = current.wordSpacing;
        const fontDirection = current.fontDirection;
        const textHScale = current.textHScale * fontDirection;
        const glyphsLength = glyphs.length;
        const vertical = font.vertical;
        const spacingDir = vertical ? 1 : -1;
        const defaultVMetrics = font.defaultVMetrics;
        const widthAdvanceScale = fontSize * current.fontMatrix[0];

        const simpleFillText =
        current.textRenderingMode === TextRenderingMode.FILL &&
        !font.disableFontFace;

        ctx.save();
        ctx.transform.apply(ctx, current.textMatrix);
        ctx.translate(current.x, current.y + current.textRise);

        if (fontDirection > 0) {
          ctx.scale(textHScale, -1);
        } else {
          ctx.scale(textHScale, 1);
        }

        let lineWidth = current.lineWidth;
        const scale = current.textMatrixScale;
        if (scale === 0 || lineWidth === 0) {
          const fillStrokeMode = current.textRenderingMode &
          TextRenderingMode.FILL_STROKE_MASK;
          if (fillStrokeMode === TextRenderingMode.STROKE ||
            fillStrokeMode === TextRenderingMode.FILL_STROKE) {
            this.cachedGetSinglePixelWidth = null;
            lineWidth = this.getSinglePixelWidth() * MIN_WIDTH_FACTOR;
          }
        } else {
          lineWidth /= scale;
        }

        if (fontSizeScale !== 1.0) {
          ctx.scale(fontSizeScale, fontSizeScale);
          lineWidth /= fontSizeScale;
        }

        ctx.lineWidth = lineWidth;

        let x = 0; let
          i;
        for (i = 0; i < glyphsLength; ++i) {
          const glyph = glyphs[i];
          if (isNum(glyph)) {
            x += spacingDir * glyph * fontSize / 1000;
            continue;
          }

          let restoreNeeded = false;
          const spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
          const character = glyph.fontChar;
          const accent = glyph.accent;
          var scaledX, scaledY, scaledAccentX, scaledAccentY;
          let width = glyph.width;
          if (vertical) {
            var vmetric, vx, vy;
            vmetric = glyph.vmetric || defaultVMetrics;
            vx = glyph.vmetric ? vmetric[1] : width * 0.5;
            vx = -vx * widthAdvanceScale;
            vy = vmetric[2] * widthAdvanceScale;

            width = vmetric ? -vmetric[0] : width;
            scaledX = vx / fontSizeScale;
            scaledY = (x + vy) / fontSizeScale;
          } else {
            scaledX = x / fontSizeScale;
            scaledY = 0;
          }

          if (font.remeasure && width > 0 && this.isFontSubpixelAAEnabled) {
          // some standard fonts may not have the exact width, trying to
          // rescale per character
            const measuredWidth = ctx.measureText(character).width * 1000 /
            fontSize * fontSizeScale;
            const characterScaleX = width / measuredWidth;
            restoreNeeded = true;
            ctx.save();
            ctx.scale(characterScaleX, 1);
            scaledX /= characterScaleX;
          }

          if (simpleFillText && !accent) {
          // common case
            ctx.fillText(character, scaledX, scaledY);
          } else {
            this.paintChar(character, scaledX, scaledY);
            if (accent) {
              scaledAccentX = scaledX + accent.offset.x / fontSizeScale;
              scaledAccentY = scaledY - accent.offset.y / fontSizeScale;
              this.paintChar(accent.fontChar, scaledAccentX, scaledAccentY);
            }
          }

          const charWidth = width * widthAdvanceScale + spacing * fontDirection;
          x += charWidth;

          if (restoreNeeded) {
            ctx.restore();
          }
        }
        if (vertical) {
          current.y -= x * textHScale;
        } else {
          current.x += x * textHScale;
        }
        ctx.restore();
      },

      showType3Text: function CanvasGraphics_showType3Text(glyphs) {
      // Type3 fonts - each glyph is a "mini-PDF"
        const ctx = this.ctx;
        const current = this.current;
        const font = current.font;
        const fontSize = current.fontSize;
        const fontDirection = current.fontDirection;
        const spacingDir = font.vertical ? 1 : -1;
        const charSpacing = current.charSpacing;
        const wordSpacing = current.wordSpacing;
        const textHScale = current.textHScale * fontDirection;
        const fontMatrix = current.fontMatrix || FONT_IDENTITY_MATRIX;
        const glyphsLength = glyphs.length;
        const isTextInvisible =
        current.textRenderingMode === TextRenderingMode.INVISIBLE;
        let i, glyph, width, spacingLength;

        if (isTextInvisible || fontSize === 0) {
          return;
        }
        this.cachedGetSinglePixelWidth = null;

        ctx.save();
        ctx.transform.apply(ctx, current.textMatrix);
        ctx.translate(current.x, current.y);

        ctx.scale(textHScale, fontDirection);

        for (i = 0; i < glyphsLength; ++i) {
          glyph = glyphs[i];
          if (isNum(glyph)) {
            spacingLength = spacingDir * glyph * fontSize / 1000;
            this.ctx.translate(spacingLength, 0);
            current.x += spacingLength * textHScale;
            continue;
          }

          const spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
          const operatorList = font.charProcOperatorList[glyph.operatorListId];
          if (!operatorList) {
            warn(`Type3 character \"${glyph.operatorListId
            }\" is not available`);
            continue;
          }
          this.processingType3 = glyph;
          this.save();
          ctx.scale(fontSize, fontSize);
          ctx.transform.apply(ctx, fontMatrix);
          this.executeOperatorList(operatorList);
          this.restore();

          const transformed = Util.applyTransform([glyph.width, 0], fontMatrix);
          width = transformed[0] * fontSize + spacing;

          ctx.translate(width, 0);
          current.x += width * textHScale;
        }
        ctx.restore();
        this.processingType3 = null;
      },

      // Type3 fonts
      setCharWidth: function CanvasGraphics_setCharWidth(xWidth, yWidth) {
      // We can safely ignore this since the width should be the same
      // as the width in the Widths array.
      },
      setCharWidthAndBounds: function CanvasGraphics_setCharWidthAndBounds(xWidth,
          yWidth,
          llx,
          lly,
          urx,
          ury) {
      // TODO According to the spec we're also suppose to ignore any operators
      // that set color or include images while processing this type3 font.
        this.ctx.rect(llx, lly, urx - llx, ury - lly);
        this.clip();
        this.endPath();
      },

      // Color
      getColorN_Pattern: function CanvasGraphics_getColorN_Pattern(IR) {
        let pattern;
        if (IR[0] === 'TilingPattern') {
          const color = IR[1];
          const baseTransform = this.baseTransform ||
                            this.ctx.mozCurrentTransform.slice();
          pattern = new TilingPattern(IR, color, this.ctx, this.objs,
              this.commonObjs, baseTransform);
        } else {
          pattern = getShadingPatternFromIR(IR);
        }
        return pattern;
      },
      setStrokeColorN: function CanvasGraphics_setStrokeColorN(/* ...*/) {
        this.current.strokeColor = this.getColorN_Pattern(arguments);
      },
      setFillColorN: function CanvasGraphics_setFillColorN(/* ...*/) {
        this.current.fillColor = this.getColorN_Pattern(arguments);
        this.current.patternFill = true;
      },
      setStrokeRGBColor: function CanvasGraphics_setStrokeRGBColor(r, g, b) {
        const color = Util.makeCssRgb(r, g, b);
        this.ctx.strokeStyle = color;
        this.current.strokeColor = color;
      },
      setFillRGBColor: function CanvasGraphics_setFillRGBColor(r, g, b) {
        const color = Util.makeCssRgb(r, g, b);
        this.ctx.fillStyle = color;
        this.current.fillColor = color;
        this.current.patternFill = false;
      },

      shadingFill: function CanvasGraphics_shadingFill(patternIR) {
        const ctx = this.ctx;

        this.save();
        const pattern = getShadingPatternFromIR(patternIR);
        ctx.fillStyle = pattern.getPattern(ctx, this, true);

        const inv = ctx.mozCurrentTransformInverse;
        if (inv) {
          const canvas = ctx.canvas;
          const width = canvas.width;
          const height = canvas.height;

          const bl = Util.applyTransform([0, 0], inv);
          const br = Util.applyTransform([0, height], inv);
          const ul = Util.applyTransform([width, 0], inv);
          const ur = Util.applyTransform([width, height], inv);

          const x0 = Math.min(bl[0], br[0], ul[0], ur[0]);
          const y0 = Math.min(bl[1], br[1], ul[1], ur[1]);
          const x1 = Math.max(bl[0], br[0], ul[0], ur[0]);
          const y1 = Math.max(bl[1], br[1], ul[1], ur[1]);

          this.ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        } else {
        // HACK to draw the gradient onto an infinite rectangle.
        // PDF gradients are drawn across the entire image while
        // Canvas only allows gradients to be drawn in a rectangle
        // The following bug should allow us to remove this.
        // https://bugzilla.mozilla.org/show_bug.cgi?id=664884

          this.ctx.fillRect(-1e10, -1e10, 2e10, 2e10);
        }

        this.restore();
      },

      // Images
      beginInlineImage: function CanvasGraphics_beginInlineImage() {
        error('Should not call beginInlineImage');
      },
      beginImageData: function CanvasGraphics_beginImageData() {
        error('Should not call beginImageData');
      },

      paintFormXObjectBegin: function CanvasGraphics_paintFormXObjectBegin(matrix,
          bbox) {
        this.save();
        this.baseTransformStack.push(this.baseTransform);

        if (isArray(matrix) && 6 === matrix.length) {
          this.transform.apply(this, matrix);
        }

        this.baseTransform = this.ctx.mozCurrentTransform;

        if (isArray(bbox) && 4 === bbox.length) {
          const width = bbox[2] - bbox[0];
          const height = bbox[3] - bbox[1];
          this.ctx.rect(bbox[0], bbox[1], width, height);
          this.clip();
          this.endPath();
        }
      },

      paintFormXObjectEnd: function CanvasGraphics_paintFormXObjectEnd() {
        this.restore();
        this.baseTransform = this.baseTransformStack.pop();
      },

      beginGroup: function CanvasGraphics_beginGroup(group) {
        this.save();
        const currentCtx = this.ctx;
        // TODO non-isolated groups - according to Rik at adobe non-isolated
        // group results aren't usually that different and they even have tools
        // that ignore this setting. Notes from Rik on implmenting:
        // - When you encounter an transparency group, create a new canvas with
        // the dimensions of the bbox
        // - copy the content from the previous canvas to the new canvas
        // - draw as usual
        // - remove the backdrop alpha:
        // alphaNew = 1 - (1 - alpha)/(1 - alphaBackdrop) with 'alpha' the alpha
        // value of your transparency group and 'alphaBackdrop' the alpha of the
        // backdrop
        // - remove background color:
        // colorNew = color - alphaNew *colorBackdrop /(1 - alphaNew)
        if (!group.isolated) {
          info('TODO: Support non-isolated groups.');
        }

        // TODO knockout - supposedly possible with the clever use of compositing
        // modes.
        if (group.knockout) {
          warn('Knockout groups not supported.');
        }

        const currentTransform = currentCtx.mozCurrentTransform;
        if (group.matrix) {
          currentCtx.transform.apply(currentCtx, group.matrix);
        }
        assert(group.bbox, 'Bounding box is required.');

        // Based on the current transform figure out how big the bounding box
        // will actually be.
        let bounds = Util.getAxialAlignedBoundingBox(
            group.bbox,
            currentCtx.mozCurrentTransform);
        // Clip the bounding box to the current canvas.
        const canvasBounds = [0,
          0,
          currentCtx.canvas.width,
          currentCtx.canvas.height];
        bounds = Util.intersect(bounds, canvasBounds) || [0, 0, 0, 0];
        // Use ceil in case we're between sizes so we don't create canvas that is
        // too small and make the canvas at least 1x1 pixels.
        const offsetX = Math.floor(bounds[0]);
        const offsetY = Math.floor(bounds[1]);
        let drawnWidth = Math.max(Math.ceil(bounds[2]) - offsetX, 1);
        let drawnHeight = Math.max(Math.ceil(bounds[3]) - offsetY, 1);
        let scaleX = 1; let
          scaleY = 1;
        if (drawnWidth > MAX_GROUP_SIZE) {
          scaleX = drawnWidth / MAX_GROUP_SIZE;
          drawnWidth = MAX_GROUP_SIZE;
        }
        if (drawnHeight > MAX_GROUP_SIZE) {
          scaleY = drawnHeight / MAX_GROUP_SIZE;
          drawnHeight = MAX_GROUP_SIZE;
        }

        let cacheId = `groupAt${this.groupLevel}`;
        if (group.smask) {
        // Using two cache entries is case if masks are used one after another.
          cacheId += `_smask_${(this.smaskCounter++) % 2}`;
        }
        const scratchCanvas = this.cachedCanvases.getCanvas(
            cacheId, drawnWidth, drawnHeight, true);
        const groupCtx = scratchCanvas.context;

        // Since we created a new canvas that is just the size of the bounding box
        // we have to translate the group ctx.
        groupCtx.scale(1 / scaleX, 1 / scaleY);
        groupCtx.translate(-offsetX, -offsetY);
        groupCtx.transform.apply(groupCtx, currentTransform);

        if (group.smask) {
        // Saving state and cached mask to be used in setGState.
          this.smaskStack.push({
            canvas: scratchCanvas.canvas,
            context: groupCtx,
            offsetX,
            offsetY,
            scaleX,
            scaleY,
            subtype: group.smask.subtype,
            backdrop: group.smask.backdrop,
          });
        } else {
        // Setup the current ctx so when the group is popped we draw it at the
        // right location.
          currentCtx.setTransform(1, 0, 0, 1, 0, 0);
          currentCtx.translate(offsetX, offsetY);
          currentCtx.scale(scaleX, scaleY);
        }
        // The transparency group inherits all off the current graphics state
        // except the blend mode, soft mask, and alpha constants.
        copyCtxState(currentCtx, groupCtx);
        this.ctx = groupCtx;
        this.setGState([
          ['BM', 'Normal'],
          ['ca', 1],
          ['CA', 1],
        ]);
        this.groupStack.push(currentCtx);
        this.groupLevel++;
      },

      endGroup: function CanvasGraphics_endGroup(group) {
        this.groupLevel--;
        const groupCtx = this.ctx;
        this.ctx = this.groupStack.pop();
        // Turn off image smoothing to avoid sub pixel interpolation which can
        // look kind of blurry for some pdfs.
        if (this.ctx.imageSmoothingEnabled !== undefined) {
          this.ctx.imageSmoothingEnabled = false;
        } else {
          this.ctx.mozImageSmoothingEnabled = false;
        }
        if (group.smask) {
          this.tempSMask = this.smaskStack.pop();
        } else {
          this.ctx.drawImage(groupCtx.canvas, 0, 0);
        }
        this.restore();
      },

      beginAnnotations: function CanvasGraphics_beginAnnotations() {
        this.save();
        this.current = new CanvasExtraState();
      },

      endAnnotations: function CanvasGraphics_endAnnotations() {
        this.restore();
      },

      beginAnnotation: function CanvasGraphics_beginAnnotation(rect, transform,
          matrix) {
        this.save();

        if (isArray(rect) && 4 === rect.length) {
          const width = rect[2] - rect[0];
          const height = rect[3] - rect[1];
          this.ctx.rect(rect[0], rect[1], width, height);
          this.clip();
          this.endPath();
        }

        this.transform.apply(this, transform);
        this.transform.apply(this, matrix);
      },

      endAnnotation: function CanvasGraphics_endAnnotation() {
        this.restore();
      },

      paintJpegXObject: function CanvasGraphics_paintJpegXObject(objId, w, h) {
        const domImage = this.objs.get(objId);
        if (!domImage) {
          warn('Dependent image isn\'t ready yet');
          return;
        }

        this.save();

        const ctx = this.ctx;
        // scale the image to the unit square
        ctx.scale(1 / w, -1 / h);

        ctx.drawImage(domImage, 0, 0, domImage.width, domImage.height,
            0, -h, w, h);
        if (this.imageLayer) {
          const currentTransform = ctx.mozCurrentTransformInverse;
          const position = this.getCanvasPosition(0, 0);
          this.imageLayer.appendImage({
            objId,
            left: position[0],
            top: position[1],
            width: w / currentTransform[0],
            height: h / currentTransform[3],
          });
        }
        this.restore();
      },

      paintImageMaskXObject: function CanvasGraphics_paintImageMaskXObject(img) {
        const ctx = this.ctx;
        const width = img.width; const
          height = img.height;
        const fillColor = this.current.fillColor;
        const isPatternFill = this.current.patternFill;

        const glyph = this.processingType3;

        if (COMPILE_TYPE3_GLYPHS && glyph && glyph.compiled === undefined) {
          if (width <= MAX_SIZE_TO_COMPILE && height <= MAX_SIZE_TO_COMPILE) {
            glyph.compiled =
            compileType3Glyph({data: img.data, width, height});
          } else {
            glyph.compiled = null;
          }
        }

        if (glyph && glyph.compiled) {
          glyph.compiled(ctx);
          return;
        }

        const maskCanvas = this.cachedCanvases.getCanvas('maskCanvas',
            width, height);
        const maskCtx = maskCanvas.context;
        maskCtx.save();

        putBinaryImageMask(maskCtx, img);

        maskCtx.globalCompositeOperation = 'source-in';

        maskCtx.fillStyle = isPatternFill
          ? fillColor.getPattern(maskCtx, this) : fillColor;
        maskCtx.fillRect(0, 0, width, height);

        maskCtx.restore();

        this.paintInlineImageXObject(maskCanvas.canvas);
      },

      paintImageMaskXObjectRepeat:
      function CanvasGraphics_paintImageMaskXObjectRepeat(imgData, scaleX,
          scaleY, positions) {
        const width = imgData.width;
        const height = imgData.height;
        const fillColor = this.current.fillColor;
        const isPatternFill = this.current.patternFill;

        const maskCanvas = this.cachedCanvases.getCanvas('maskCanvas',
            width, height);
        const maskCtx = maskCanvas.context;
        maskCtx.save();

        putBinaryImageMask(maskCtx, imgData);

        maskCtx.globalCompositeOperation = 'source-in';

        maskCtx.fillStyle = isPatternFill
          ? fillColor.getPattern(maskCtx, this) : fillColor;
        maskCtx.fillRect(0, 0, width, height);

        maskCtx.restore();

        const ctx = this.ctx;
        for (let i = 0, ii = positions.length; i < ii; i += 2) {
          ctx.save();
          ctx.transform(scaleX, 0, 0, scaleY, positions[i], positions[i + 1]);
          ctx.scale(1, -1);
          ctx.drawImage(maskCanvas.canvas, 0, 0, width, height,
              0, -1, 1, 1);
          ctx.restore();
        }
      },

      paintImageMaskXObjectGroup:
      function CanvasGraphics_paintImageMaskXObjectGroup(images) {
        const ctx = this.ctx;

        const fillColor = this.current.fillColor;
        const isPatternFill = this.current.patternFill;
        for (let i = 0, ii = images.length; i < ii; i++) {
          const image = images[i];
          const width = image.width; const
            height = image.height;

          const maskCanvas = this.cachedCanvases.getCanvas('maskCanvas',
              width, height);
          const maskCtx = maskCanvas.context;
          maskCtx.save();

          putBinaryImageMask(maskCtx, image);

          maskCtx.globalCompositeOperation = 'source-in';

          maskCtx.fillStyle = isPatternFill
            ? fillColor.getPattern(maskCtx, this) : fillColor;
          maskCtx.fillRect(0, 0, width, height);

          maskCtx.restore();

          ctx.save();
          ctx.transform.apply(ctx, image.transform);
          ctx.scale(1, -1);
          ctx.drawImage(maskCanvas.canvas, 0, 0, width, height,
              0, -1, 1, 1);
          ctx.restore();
        }
      },

      paintImageXObject: function CanvasGraphics_paintImageXObject(objId) {
        const imgData = this.objs.get(objId);
        if (!imgData) {
          warn('Dependent image isn\'t ready yet');
          return;
        }

        this.paintInlineImageXObject(imgData);
      },

      paintImageXObjectRepeat:
      function CanvasGraphics_paintImageXObjectRepeat(objId, scaleX, scaleY,
          positions) {
        const imgData = this.objs.get(objId);
        if (!imgData) {
          warn('Dependent image isn\'t ready yet');
          return;
        }

        const width = imgData.width;
        const height = imgData.height;
        const map = [];
        for (let i = 0, ii = positions.length; i < ii; i += 2) {
          map.push({transform: [scaleX,
            0,
            0,
            scaleY,
            positions[i],
            positions[i + 1]], x: 0, y: 0, w: width, h: height});
        }
        this.paintInlineImageXObjectGroup(imgData, map);
      },

      paintInlineImageXObject:
      function CanvasGraphics_paintInlineImageXObject(imgData) {
        const width = imgData.width;
        const height = imgData.height;
        const ctx = this.ctx;

        this.save();
        // scale the image to the unit square
        ctx.scale(1 / width, -1 / height);

        const currentTransform = ctx.mozCurrentTransformInverse;
        const a = currentTransform[0]; const
          b = currentTransform[1];
        let widthScale = Math.max(Math.sqrt(a * a + b * b), 1);
        const c = currentTransform[2]; const
          d = currentTransform[3];
        let heightScale = Math.max(Math.sqrt(c * c + d * d), 1);

        let imgToPaint, tmpCanvas;
        // instanceof HTMLElement does not work in jsdom node.js module
        if (imgData instanceof HTMLElement || !imgData.data) {
          imgToPaint = imgData;
        } else {
          tmpCanvas = this.cachedCanvases.getCanvas('inlineImage',
              width, height);
          var tmpCtx = tmpCanvas.context;
          putBinaryImageData(tmpCtx, imgData);
          imgToPaint = tmpCanvas.canvas;
        }

        let paintWidth = width; let
          paintHeight = height;
        let tmpCanvasId = 'prescale1';
        // Vertial or horizontal scaling shall not be more than 2 to not loose the
        // pixels during drawImage operation, painting on the temporary canvas(es)
        // that are twice smaller in size
        while ((widthScale > 2 && paintWidth > 1) ||
             (heightScale > 2 && paintHeight > 1)) {
          let newWidth = paintWidth; let
            newHeight = paintHeight;
          if (widthScale > 2 && paintWidth > 1) {
            newWidth = Math.ceil(paintWidth / 2);
            widthScale /= paintWidth / newWidth;
          }
          if (heightScale > 2 && paintHeight > 1) {
            newHeight = Math.ceil(paintHeight / 2);
            heightScale /= paintHeight / newHeight;
          }
          tmpCanvas = this.cachedCanvases.getCanvas(tmpCanvasId,
              newWidth, newHeight);
          tmpCtx = tmpCanvas.context;
          tmpCtx.clearRect(0, 0, newWidth, newHeight);
          tmpCtx.drawImage(imgToPaint, 0, 0, paintWidth, paintHeight,
              0, 0, newWidth, newHeight);
          imgToPaint = tmpCanvas.canvas;
          paintWidth = newWidth;
          paintHeight = newHeight;
          tmpCanvasId = tmpCanvasId === 'prescale1' ? 'prescale2' : 'prescale1';
        }
        ctx.drawImage(imgToPaint, 0, 0, paintWidth, paintHeight,
            0, -height, width, height);

        if (this.imageLayer) {
          const position = this.getCanvasPosition(0, -height);
          this.imageLayer.appendImage({
            imgData,
            left: position[0],
            top: position[1],
            width: width / currentTransform[0],
            height: height / currentTransform[3],
          });
        }
        this.restore();
      },

      paintInlineImageXObjectGroup:
      function CanvasGraphics_paintInlineImageXObjectGroup(imgData, map) {
        const ctx = this.ctx;
        const w = imgData.width;
        const h = imgData.height;

        const tmpCanvas = this.cachedCanvases.getCanvas('inlineImage', w, h);
        const tmpCtx = tmpCanvas.context;
        putBinaryImageData(tmpCtx, imgData);

        for (let i = 0, ii = map.length; i < ii; i++) {
          const entry = map[i];
          ctx.save();
          ctx.transform.apply(ctx, entry.transform);
          ctx.scale(1, -1);
          ctx.drawImage(tmpCanvas.canvas, entry.x, entry.y, entry.w, entry.h,
              0, -1, 1, 1);
          if (this.imageLayer) {
            const position = this.getCanvasPosition(entry.x, entry.y);
            this.imageLayer.appendImage({
              imgData,
              left: position[0],
              top: position[1],
              width: w,
              height: h,
            });
          }
          ctx.restore();
        }
      },

      paintSolidColorImageMask:
      function CanvasGraphics_paintSolidColorImageMask() {
        this.ctx.fillRect(0, 0, 1, 1);
      },

      paintXObject: function CanvasGraphics_paintXObject() {
        UnsupportedManager.notify(UNSUPPORTED_FEATURES.unknown);
        warn('Unsupported \'paintXObject\' command.');
      },

      // Marked content

      markPoint: function CanvasGraphics_markPoint(tag) {
      // TODO Marked content.
      },
      markPointProps: function CanvasGraphics_markPointProps(tag, properties) {
      // TODO Marked content.
      },
      beginMarkedContent: function CanvasGraphics_beginMarkedContent(tag) {
      // TODO Marked content.
      },
      beginMarkedContentProps: function CanvasGraphics_beginMarkedContentProps(
          tag, properties) {
      // TODO Marked content.
      },
      endMarkedContent: function CanvasGraphics_endMarkedContent() {
      // TODO Marked content.
      },

      // Compatibility

      beginCompat: function CanvasGraphics_beginCompat() {
      // TODO ignore undefined operators (should we do that anyway?)
      },
      endCompat: function CanvasGraphics_endCompat() {
      // TODO stop ignoring undefined operators
      },

      // Helper functions

      consumePath: function CanvasGraphics_consumePath() {
        const ctx = this.ctx;
        if (this.pendingClip) {
          if (this.pendingClip === EO_CLIP) {
            if (ctx.mozFillRule !== undefined) {
              ctx.mozFillRule = 'evenodd';
              ctx.clip();
              ctx.mozFillRule = 'nonzero';
            } else {
              ctx.clip('evenodd');
            }
          } else {
            ctx.clip();
          }
          this.pendingClip = null;
        }
        ctx.beginPath();
      },
      getSinglePixelWidth: function CanvasGraphics_getSinglePixelWidth(scale) {
        if (this.cachedGetSinglePixelWidth === null) {
          const inverse = this.ctx.mozCurrentTransformInverse;
          // max of the current horizontal and vertical scale
          this.cachedGetSinglePixelWidth = Math.sqrt(Math.max(
              (inverse[0] * inverse[0] + inverse[1] * inverse[1]),
              (inverse[2] * inverse[2] + inverse[3] * inverse[3])));
        }
        return this.cachedGetSinglePixelWidth;
      },
      getCanvasPosition: function CanvasGraphics_getCanvasPosition(x, y) {
        const transform = this.ctx.mozCurrentTransform;
        return [
          transform[0] * x + transform[2] * y + transform[4],
          transform[1] * x + transform[3] * y + transform[5],
        ];
      },
    };

    for (const op in OPS) {
      CanvasGraphics.prototype[OPS[op]] = CanvasGraphics.prototype[op];
    }

    return CanvasGraphics;
  })();


  var WebGLUtils = (function WebGLUtilsClosure() {
    function loadShader(gl, code, shaderType) {
      const shader = gl.createShader(shaderType);
      gl.shaderSource(shader, code);
      gl.compileShader(shader);
      const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (!compiled) {
        const errorMsg = gl.getShaderInfoLog(shader);
        throw new Error(`Error during shader compilation: ${errorMsg}`);
      }
      return shader;
    }
    function createVertexShader(gl, code) {
      return loadShader(gl, code, gl.VERTEX_SHADER);
    }
    function createFragmentShader(gl, code) {
      return loadShader(gl, code, gl.FRAGMENT_SHADER);
    }
    function createProgram(gl, shaders) {
      const program = gl.createProgram();
      for (let i = 0, ii = shaders.length; i < ii; ++i) {
        gl.attachShader(program, shaders[i]);
      }
      gl.linkProgram(program);
      const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (!linked) {
        const errorMsg = gl.getProgramInfoLog(program);
        throw new Error(`Error during program linking: ${errorMsg}`);
      }
      return program;
    }
    function createTexture(gl, image, textureId) {
      gl.activeTexture(textureId);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      // Upload the image into the texture.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      return texture;
    }

    let currentGL, currentCanvas;
    function generateGL() {
      if (currentGL) {
        return;
      }
      currentCanvas = document.createElement('canvas');
      currentGL = currentCanvas.getContext('webgl',
          {premultipliedalpha: false});
    }

    const smaskVertexShaderCode = '\
  attribute vec2 a_position;                                    \
  attribute vec2 a_texCoord;                                    \
                                                                \
  uniform vec2 u_resolution;                                    \
                                                                \
  varying vec2 v_texCoord;                                      \
                                                                \
  void main() {                                                 \
    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;   \
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);          \
                                                                \
    v_texCoord = a_texCoord;                                    \
  }                                                             ';

    const smaskFragmentShaderCode = '\
  precision mediump float;                                      \
                                                                \
  uniform vec4 u_backdrop;                                      \
  uniform int u_subtype;                                        \
  uniform sampler2D u_image;                                    \
  uniform sampler2D u_mask;                                     \
                                                                \
  varying vec2 v_texCoord;                                      \
                                                                \
  void main() {                                                 \
    vec4 imageColor = texture2D(u_image, v_texCoord);           \
    vec4 maskColor = texture2D(u_mask, v_texCoord);             \
    if (u_backdrop.a > 0.0) {                                   \
      maskColor.rgb = maskColor.rgb * maskColor.a +             \
                      u_backdrop.rgb * (1.0 - maskColor.a);     \
    }                                                           \
    float lum;                                                  \
    if (u_subtype == 0) {                                       \
      lum = maskColor.a;                                        \
    } else {                                                    \
      lum = maskColor.r * 0.3 + maskColor.g * 0.59 +            \
            maskColor.b * 0.11;                                 \
    }                                                           \
    imageColor.a *= lum;                                        \
    imageColor.rgb *= imageColor.a;                             \
    gl_FragColor = imageColor;                                  \
  }                                                             ';

    let smaskCache = null;

    function initSmaskGL() {
      let canvas, gl;

      generateGL();
      canvas = currentCanvas;
      currentCanvas = null;
      gl = currentGL;
      currentGL = null;

      // setup a GLSL program
      const vertexShader = createVertexShader(gl, smaskVertexShaderCode);
      const fragmentShader = createFragmentShader(gl, smaskFragmentShaderCode);
      const program = createProgram(gl, [vertexShader, fragmentShader]);
      gl.useProgram(program);

      const cache = {};
      cache.gl = gl;
      cache.canvas = canvas;
      cache.resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
      cache.positionLocation = gl.getAttribLocation(program, 'a_position');
      cache.backdropLocation = gl.getUniformLocation(program, 'u_backdrop');
      cache.subtypeLocation = gl.getUniformLocation(program, 'u_subtype');

      const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
      const texLayerLocation = gl.getUniformLocation(program, 'u_image');
      const texMaskLocation = gl.getUniformLocation(program, 'u_mask');

      // provide texture coordinates for the rectangle.
      const texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0,
        1.0,
      ]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(texCoordLocation);
      gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1i(texLayerLocation, 0);
      gl.uniform1i(texMaskLocation, 1);

      smaskCache = cache;
    }

    function composeSMask(layer, mask, properties) {
      const width = layer.width; const
        height = layer.height;

      if (!smaskCache) {
        initSmaskGL();
      }
      const cache = smaskCache; const canvas = cache.canvas; const
        gl = cache.gl;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(cache.resolutionLocation, width, height);

      if (properties.backdrop) {
        gl.uniform4f(cache.resolutionLocation, properties.backdrop[0],
            properties.backdrop[1], properties.backdrop[2], 1);
      } else {
        gl.uniform4f(cache.resolutionLocation, 0, 0, 0, 0);
      }
      gl.uniform1i(cache.subtypeLocation,
          properties.subtype === 'Luminosity' ? 1 : 0);

      // Create a textures
      const texture = createTexture(gl, layer, gl.TEXTURE0);
      const maskTexture = createTexture(gl, mask, gl.TEXTURE1);


      // Create a buffer and put a single clipspace rectangle in
      // it (2 triangles)
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0,
        0,
        width,
        0,
        0,
        height,
        0,
        height,
        width,
        0,
        width,
        height,
      ]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(cache.positionLocation);
      gl.vertexAttribPointer(cache.positionLocation, 2, gl.FLOAT, false, 0, 0);

      // draw
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      gl.flush();

      gl.deleteTexture(texture);
      gl.deleteTexture(maskTexture);
      gl.deleteBuffer(buffer);

      return canvas;
    }

    const figuresVertexShaderCode = '\
  attribute vec2 a_position;                                    \
  attribute vec3 a_color;                                       \
                                                                \
  uniform vec2 u_resolution;                                    \
  uniform vec2 u_scale;                                         \
  uniform vec2 u_offset;                                        \
                                                                \
  varying vec4 v_color;                                         \
                                                                \
  void main() {                                                 \
    vec2 position = (a_position + u_offset) * u_scale;          \
    vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;     \
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);          \
                                                                \
    v_color = vec4(a_color / 255.0, 1.0);                       \
  }                                                             ';

    const figuresFragmentShaderCode = '\
  precision mediump float;                                      \
                                                                \
  varying vec4 v_color;                                         \
                                                                \
  void main() {                                                 \
    gl_FragColor = v_color;                                     \
  }                                                             ';

    let figuresCache = null;

    function initFiguresGL() {
      let canvas, gl;

      generateGL();
      canvas = currentCanvas;
      currentCanvas = null;
      gl = currentGL;
      currentGL = null;

      // setup a GLSL program
      const vertexShader = createVertexShader(gl, figuresVertexShaderCode);
      const fragmentShader = createFragmentShader(gl, figuresFragmentShaderCode);
      const program = createProgram(gl, [vertexShader, fragmentShader]);
      gl.useProgram(program);

      const cache = {};
      cache.gl = gl;
      cache.canvas = canvas;
      cache.resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
      cache.scaleLocation = gl.getUniformLocation(program, 'u_scale');
      cache.offsetLocation = gl.getUniformLocation(program, 'u_offset');
      cache.positionLocation = gl.getAttribLocation(program, 'a_position');
      cache.colorLocation = gl.getAttribLocation(program, 'a_color');

      figuresCache = cache;
    }

    function drawFigures(width, height, backgroundColor, figures, context) {
      if (!figuresCache) {
        initFiguresGL();
      }
      const cache = figuresCache; const canvas = cache.canvas; const
        gl = cache.gl;

      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(cache.resolutionLocation, width, height);

      // count triangle points
      let count = 0;
      let i, ii, rows;
      for (i = 0, ii = figures.length; i < ii; i++) {
        switch (figures[i].type) {
          case 'lattice':
            rows = (figures[i].coords.length / figures[i].verticesPerRow) | 0;
            count += (rows - 1) * (figures[i].verticesPerRow - 1) * 6;
            break;
          case 'triangles':
            count += figures[i].coords.length;
            break;
        }
      }
      // transfer data
      const coords = new Float32Array(count * 2);
      const colors = new Uint8Array(count * 3);
      const coordsMap = context.coords; const
        colorsMap = context.colors;
      let pIndex = 0; let
        cIndex = 0;
      for (i = 0, ii = figures.length; i < ii; i++) {
        const figure = figures[i]; const ps = figure.coords; const
          cs = figure.colors;
        switch (figure.type) {
          case 'lattice':
            var cols = figure.verticesPerRow;
            rows = (ps.length / cols) | 0;
            for (let row = 1; row < rows; row++) {
              let offset = row * cols + 1;
              for (let col = 1; col < cols; col++, offset++) {
                coords[pIndex] = coordsMap[ps[offset - cols - 1]];
                coords[pIndex + 1] = coordsMap[ps[offset - cols - 1] + 1];
                coords[pIndex + 2] = coordsMap[ps[offset - cols]];
                coords[pIndex + 3] = coordsMap[ps[offset - cols] + 1];
                coords[pIndex + 4] = coordsMap[ps[offset - 1]];
                coords[pIndex + 5] = coordsMap[ps[offset - 1] + 1];
                colors[cIndex] = colorsMap[cs[offset - cols - 1]];
                colors[cIndex + 1] = colorsMap[cs[offset - cols - 1] + 1];
                colors[cIndex + 2] = colorsMap[cs[offset - cols - 1] + 2];
                colors[cIndex + 3] = colorsMap[cs[offset - cols]];
                colors[cIndex + 4] = colorsMap[cs[offset - cols] + 1];
                colors[cIndex + 5] = colorsMap[cs[offset - cols] + 2];
                colors[cIndex + 6] = colorsMap[cs[offset - 1]];
                colors[cIndex + 7] = colorsMap[cs[offset - 1] + 1];
                colors[cIndex + 8] = colorsMap[cs[offset - 1] + 2];

                coords[pIndex + 6] = coords[pIndex + 2];
                coords[pIndex + 7] = coords[pIndex + 3];
                coords[pIndex + 8] = coords[pIndex + 4];
                coords[pIndex + 9] = coords[pIndex + 5];
                coords[pIndex + 10] = coordsMap[ps[offset]];
                coords[pIndex + 11] = coordsMap[ps[offset] + 1];
                colors[cIndex + 9] = colors[cIndex + 3];
                colors[cIndex + 10] = colors[cIndex + 4];
                colors[cIndex + 11] = colors[cIndex + 5];
                colors[cIndex + 12] = colors[cIndex + 6];
                colors[cIndex + 13] = colors[cIndex + 7];
                colors[cIndex + 14] = colors[cIndex + 8];
                colors[cIndex + 15] = colorsMap[cs[offset]];
                colors[cIndex + 16] = colorsMap[cs[offset] + 1];
                colors[cIndex + 17] = colorsMap[cs[offset] + 2];
                pIndex += 12;
                cIndex += 18;
              }
            }
            break;
          case 'triangles':
            for (let j = 0, jj = ps.length; j < jj; j++) {
              coords[pIndex] = coordsMap[ps[j]];
              coords[pIndex + 1] = coordsMap[ps[j] + 1];
              colors[cIndex] = colorsMap[cs[j]];
              colors[cIndex + 1] = colorsMap[cs[j] + 1];
              colors[cIndex + 2] = colorsMap[cs[j] + 2];
              pIndex += 2;
              cIndex += 3;
            }
            break;
        }
      }

      // draw
      if (backgroundColor) {
        gl.clearColor(backgroundColor[0] / 255, backgroundColor[1] / 255,
            backgroundColor[2] / 255, 1.0);
      } else {
        gl.clearColor(0, 0, 0, 0);
      }
      gl.clear(gl.COLOR_BUFFER_BIT);

      const coordsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, coordsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(cache.positionLocation);
      gl.vertexAttribPointer(cache.positionLocation, 2, gl.FLOAT, false, 0, 0);

      const colorsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(cache.colorLocation);
      gl.vertexAttribPointer(cache.colorLocation, 3, gl.UNSIGNED_BYTE, false,
          0, 0);

      gl.uniform2f(cache.scaleLocation, context.scaleX, context.scaleY);
      gl.uniform2f(cache.offsetLocation, context.offsetX, context.offsetY);

      gl.drawArrays(gl.TRIANGLES, 0, count);

      gl.flush();

      gl.deleteBuffer(coordsBuffer);
      gl.deleteBuffer(colorsBuffer);

      return canvas;
    }

    function cleanup() {
      if (smaskCache && smaskCache.canvas) {
        smaskCache.canvas.width = 0;
        smaskCache.canvas.height = 0;
      }
      if (figuresCache && figuresCache.canvas) {
        figuresCache.canvas.width = 0;
        figuresCache.canvas.height = 0;
      }
      smaskCache = null;
      figuresCache = null;
    }

    return {
      get isEnabled() {
        if (PDFJS.disableWebGL) {
          return false;
        }
        let enabled = false;
        try {
          generateGL();
          enabled = !!currentGL;
        } catch (e) { }
        return shadow(this, 'isEnabled', enabled);
      },
      composeSMask,
      drawFigures,
      clear: cleanup,
    };
  })();


  const ShadingIRs = {};

  ShadingIRs.RadialAxial = {
    fromIR: function RadialAxial_fromIR(raw) {
      const type = raw[1];
      const colorStops = raw[2];
      const p0 = raw[3];
      const p1 = raw[4];
      const r0 = raw[5];
      const r1 = raw[6];
      return {
        type: 'Pattern',
        getPattern: function RadialAxial_getPattern(ctx) {
          let grad;
          if (type === 'axial') {
            grad = ctx.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
          } else if (type === 'radial') {
            grad = ctx.createRadialGradient(p0[0], p0[1], r0, p1[0], p1[1], r1);
          }

          for (let i = 0, ii = colorStops.length; i < ii; ++i) {
            const c = colorStops[i];
            grad.addColorStop(c[0], c[1]);
          }
          return grad;
        },
      };
    },
  };

  const createMeshCanvas = (function createMeshCanvasClosure() {
    function drawTriangle(data, context, p1, p2, p3, c1, c2, c3) {
    // Very basic Gouraud-shaded triangle rasterization algorithm.
      const coords = context.coords; const
        colors = context.colors;
      const bytes = data.data; const
        rowSize = data.width * 4;
      let tmp;
      if (coords[p1 + 1] > coords[p2 + 1]) {
        tmp = p1; p1 = p2; p2 = tmp; tmp = c1; c1 = c2; c2 = tmp;
      }
      if (coords[p2 + 1] > coords[p3 + 1]) {
        tmp = p2; p2 = p3; p3 = tmp; tmp = c2; c2 = c3; c3 = tmp;
      }
      if (coords[p1 + 1] > coords[p2 + 1]) {
        tmp = p1; p1 = p2; p2 = tmp; tmp = c1; c1 = c2; c2 = tmp;
      }
      const x1 = (coords[p1] + context.offsetX) * context.scaleX;
      const y1 = (coords[p1 + 1] + context.offsetY) * context.scaleY;
      const x2 = (coords[p2] + context.offsetX) * context.scaleX;
      const y2 = (coords[p2 + 1] + context.offsetY) * context.scaleY;
      const x3 = (coords[p3] + context.offsetX) * context.scaleX;
      const y3 = (coords[p3 + 1] + context.offsetY) * context.scaleY;
      if (y1 >= y3) {
        return;
      }
      const c1r = colors[c1]; const c1g = colors[c1 + 1]; const
        c1b = colors[c1 + 2];
      const c2r = colors[c2]; const c2g = colors[c2 + 1]; const
        c2b = colors[c2 + 2];
      const c3r = colors[c3]; const c3g = colors[c3 + 1]; const
        c3b = colors[c3 + 2];

      const minY = Math.round(y1); const
        maxY = Math.round(y3);
      let xa, car, cag, cab;
      let xb, cbr, cbg, cbb;
      let k;
      for (let y = minY; y <= maxY; y++) {
        if (y < y2) {
          k = y < y1 ? 0 : y1 === y2 ? 1 : (y1 - y) / (y1 - y2);
          xa = x1 - (x1 - x2) * k;
          car = c1r - (c1r - c2r) * k;
          cag = c1g - (c1g - c2g) * k;
          cab = c1b - (c1b - c2b) * k;
        } else {
          k = y > y3 ? 1 : y2 === y3 ? 0 : (y2 - y) / (y2 - y3);
          xa = x2 - (x2 - x3) * k;
          car = c2r - (c2r - c3r) * k;
          cag = c2g - (c2g - c3g) * k;
          cab = c2b - (c2b - c3b) * k;
        }
        k = y < y1 ? 0 : y > y3 ? 1 : (y1 - y) / (y1 - y3);
        xb = x1 - (x1 - x3) * k;
        cbr = c1r - (c1r - c3r) * k;
        cbg = c1g - (c1g - c3g) * k;
        cbb = c1b - (c1b - c3b) * k;
        const x1_ = Math.round(Math.min(xa, xb));
        const x2_ = Math.round(Math.max(xa, xb));
        let j = rowSize * y + x1_ * 4;
        for (let x = x1_; x <= x2_; x++) {
          k = (xa - x) / (xa - xb);
          k = k < 0 ? 0 : k > 1 ? 1 : k;
          bytes[j++] = (car - (car - cbr) * k) | 0;
          bytes[j++] = (cag - (cag - cbg) * k) | 0;
          bytes[j++] = (cab - (cab - cbb) * k) | 0;
          bytes[j++] = 255;
        }
      }
    }

    function drawFigure(data, figure, context) {
      const ps = figure.coords;
      const cs = figure.colors;
      let i, ii;
      switch (figure.type) {
        case 'lattice':
          var verticesPerRow = figure.verticesPerRow;
          var rows = Math.floor(ps.length / verticesPerRow) - 1;
          var cols = verticesPerRow - 1;
          for (i = 0; i < rows; i++) {
            let q = i * verticesPerRow;
            for (let j = 0; j < cols; j++, q++) {
              drawTriangle(data, context,
                  ps[q], ps[q + 1], ps[q + verticesPerRow],
                  cs[q], cs[q + 1], cs[q + verticesPerRow]);
              drawTriangle(data, context,
                  ps[q + verticesPerRow + 1], ps[q + 1], ps[q + verticesPerRow],
                  cs[q + verticesPerRow + 1], cs[q + 1], cs[q + verticesPerRow]);
            }
          }
          break;
        case 'triangles':
          for (i = 0, ii = ps.length; i < ii; i += 3) {
            drawTriangle(data, context,
                ps[i], ps[i + 1], ps[i + 2],
                cs[i], cs[i + 1], cs[i + 2]);
          }
          break;
        default:
          error('illigal figure');
          break;
      }
    }

    function createMeshCanvas(bounds, combinesScale, coords, colors, figures,
        backgroundColor, cachedCanvases) {
    // we will increase scale on some weird factor to let antialiasing take
    // care of "rough" edges
      const EXPECTED_SCALE = 1.1;
      // MAX_PATTERN_SIZE is used to avoid OOM situation.
      const MAX_PATTERN_SIZE = 3000; // 10in @ 300dpi shall be enough

      const offsetX = Math.floor(bounds[0]);
      const offsetY = Math.floor(bounds[1]);
      const boundsWidth = Math.ceil(bounds[2]) - offsetX;
      const boundsHeight = Math.ceil(bounds[3]) - offsetY;

      const width = Math.min(Math.ceil(Math.abs(boundsWidth * combinesScale[0] *
      EXPECTED_SCALE)), MAX_PATTERN_SIZE);
      const height = Math.min(Math.ceil(Math.abs(boundsHeight * combinesScale[1] *
      EXPECTED_SCALE)), MAX_PATTERN_SIZE);
      const scaleX = boundsWidth / width;
      const scaleY = boundsHeight / height;

      const context = {
        coords,
        colors,
        offsetX: -offsetX,
        offsetY: -offsetY,
        scaleX: 1 / scaleX,
        scaleY: 1 / scaleY,
      };

      let canvas, tmpCanvas, i, ii;
      if (WebGLUtils.isEnabled) {
        canvas = WebGLUtils.drawFigures(width, height, backgroundColor,
            figures, context);

        // https://bugzilla.mozilla.org/show_bug.cgi?id=972126
        tmpCanvas = cachedCanvases.getCanvas('mesh', width, height, false);
        tmpCanvas.context.drawImage(canvas, 0, 0);
        canvas = tmpCanvas.canvas;
      } else {
        tmpCanvas = cachedCanvases.getCanvas('mesh', width, height, false);
        const tmpCtx = tmpCanvas.context;

        const data = tmpCtx.createImageData(width, height);
        if (backgroundColor) {
          const bytes = data.data;
          for (i = 0, ii = bytes.length; i < ii; i += 4) {
            bytes[i] = backgroundColor[0];
            bytes[i + 1] = backgroundColor[1];
            bytes[i + 2] = backgroundColor[2];
            bytes[i + 3] = 255;
          }
        }
        for (i = 0; i < figures.length; i++) {
          drawFigure(data, figures[i], context);
        }
        tmpCtx.putImageData(data, 0, 0);
        canvas = tmpCanvas.canvas;
      }

      return {canvas, offsetX, offsetY,
        scaleX, scaleY};
    }
    return createMeshCanvas;
  })();

  ShadingIRs.Mesh = {
    fromIR: function Mesh_fromIR(raw) {
    // var type = raw[1];
      const coords = raw[2];
      const colors = raw[3];
      const figures = raw[4];
      const bounds = raw[5];
      const matrix = raw[6];
      // var bbox = raw[7];
      const background = raw[8];
      return {
        type: 'Pattern',
        getPattern: function Mesh_getPattern(ctx, owner, shadingFill) {
          let scale;
          if (shadingFill) {
            scale = Util.singularValueDecompose2dScale(ctx.mozCurrentTransform);
          } else {
          // Obtain scale from matrix and current transformation matrix.
            scale = Util.singularValueDecompose2dScale(owner.baseTransform);
            if (matrix) {
              const matrixScale = Util.singularValueDecompose2dScale(matrix);
              scale = [scale[0] * matrixScale[0],
                scale[1] * matrixScale[1]];
            }
          }


          // Rasterizing on the main thread since sending/queue large canvases
          // might cause OOM.
          const temporaryPatternCanvas = createMeshCanvas(bounds, scale, coords,
              colors, figures, shadingFill ? null : background,
              owner.cachedCanvases);

          if (!shadingFill) {
            ctx.setTransform.apply(ctx, owner.baseTransform);
            if (matrix) {
              ctx.transform.apply(ctx, matrix);
            }
          }

          ctx.translate(temporaryPatternCanvas.offsetX,
              temporaryPatternCanvas.offsetY);
          ctx.scale(temporaryPatternCanvas.scaleX,
              temporaryPatternCanvas.scaleY);

          return ctx.createPattern(temporaryPatternCanvas.canvas, 'no-repeat');
        },
      };
    },
  };

  ShadingIRs.Dummy = {
    fromIR: function Dummy_fromIR() {
      return {
        type: 'Pattern',
        getPattern: function Dummy_fromIR_getPattern() {
          return 'hotpink';
        },
      };
    },
  };

  function getShadingPatternFromIR(raw) {
    const shadingIR = ShadingIRs[raw[0]];
    if (!shadingIR) {
      error(`Unknown IR type: ${raw[0]}`);
    }
    return shadingIR.fromIR(raw);
  }

  var TilingPattern = (function TilingPatternClosure() {
    const PaintType = {
      COLORED: 1,
      UNCOLORED: 2,
    };

    const MAX_PATTERN_SIZE = 3000; // 10in @ 300dpi shall be enough

    function TilingPattern(IR, color, ctx, objs, commonObjs, baseTransform) {
      this.operatorList = IR[2];
      this.matrix = IR[3] || [1, 0, 0, 1, 0, 0];
      this.bbox = IR[4];
      this.xstep = IR[5];
      this.ystep = IR[6];
      this.paintType = IR[7];
      this.tilingType = IR[8];
      this.color = color;
      this.objs = objs;
      this.commonObjs = commonObjs;
      this.baseTransform = baseTransform;
      this.type = 'Pattern';
      this.ctx = ctx;
    }

    TilingPattern.prototype = {
      createPatternCanvas: function TilinPattern_createPatternCanvas(owner) {
        const operatorList = this.operatorList;
        const bbox = this.bbox;
        const xstep = this.xstep;
        const ystep = this.ystep;
        const paintType = this.paintType;
        const tilingType = this.tilingType;
        const color = this.color;
        const objs = this.objs;
        const commonObjs = this.commonObjs;

        info(`TilingType: ${tilingType}`);

        const x0 = bbox[0]; const y0 = bbox[1]; const x1 = bbox[2]; const
          y1 = bbox[3];

        const topLeft = [x0, y0];
        // we want the canvas to be as large as the step size
        const botRight = [x0 + xstep, y0 + ystep];

        let width = botRight[0] - topLeft[0];
        let height = botRight[1] - topLeft[1];

        // Obtain scale from matrix and current transformation matrix.
        const matrixScale = Util.singularValueDecompose2dScale(this.matrix);
        const curMatrixScale = Util.singularValueDecompose2dScale(
            this.baseTransform);
        const combinedScale = [matrixScale[0] * curMatrixScale[0],
          matrixScale[1] * curMatrixScale[1]];

        // MAX_PATTERN_SIZE is used to avoid OOM situation.
        // Use width and height values that are as close as possible to the end
        // result when the pattern is used. Too low value makes the pattern look
        // blurry. Too large value makes it look too crispy.
        width = Math.min(Math.ceil(Math.abs(width * combinedScale[0])),
            MAX_PATTERN_SIZE);

        height = Math.min(Math.ceil(Math.abs(height * combinedScale[1])),
            MAX_PATTERN_SIZE);

        const tmpCanvas = owner.cachedCanvases.getCanvas('pattern',
            width, height, true);
        const tmpCtx = tmpCanvas.context;
        const graphics = new CanvasGraphics(tmpCtx, commonObjs, objs);
        graphics.groupLevel = owner.groupLevel;

        this.setFillAndStrokeStyleToContext(tmpCtx, paintType, color);

        this.setScale(width, height, xstep, ystep);
        this.transformToScale(graphics);

        // transform coordinates to pattern space
        const tmpTranslate = [1, 0, 0, 1, -topLeft[0], -topLeft[1]];
        graphics.transform.apply(graphics, tmpTranslate);

        this.clipBbox(graphics, bbox, x0, y0, x1, y1);

        graphics.executeOperatorList(operatorList);
        return tmpCanvas.canvas;
      },

      setScale: function TilingPattern_setScale(width, height, xstep, ystep) {
        this.scale = [width / xstep, height / ystep];
      },

      transformToScale: function TilingPattern_transformToScale(graphics) {
        const scale = this.scale;
        const tmpScale = [scale[0], 0, 0, scale[1], 0, 0];
        graphics.transform.apply(graphics, tmpScale);
      },

      scaleToContext: function TilingPattern_scaleToContext() {
        const scale = this.scale;
        this.ctx.scale(1 / scale[0], 1 / scale[1]);
      },

      clipBbox: function clipBbox(graphics, bbox, x0, y0, x1, y1) {
        if (bbox && isArray(bbox) && bbox.length === 4) {
          const bboxWidth = x1 - x0;
          const bboxHeight = y1 - y0;
          graphics.ctx.rect(x0, y0, bboxWidth, bboxHeight);
          graphics.clip();
          graphics.endPath();
        }
      },

      setFillAndStrokeStyleToContext:
      function setFillAndStrokeStyleToContext(context, paintType, color) {
        switch (paintType) {
          case PaintType.COLORED:
            var ctx = this.ctx;
            context.fillStyle = ctx.fillStyle;
            context.strokeStyle = ctx.strokeStyle;
            break;
          case PaintType.UNCOLORED:
            var cssColor = Util.makeCssRgb(color[0], color[1], color[2]);
            context.fillStyle = cssColor;
            context.strokeStyle = cssColor;
            break;
          default:
            error(`Unsupported paint type: ${paintType}`);
        }
      },

      getPattern: function TilingPattern_getPattern(ctx, owner) {
        const temporaryPatternCanvas = this.createPatternCanvas(owner);

        ctx = this.ctx;
        ctx.setTransform.apply(ctx, this.baseTransform);
        ctx.transform.apply(ctx, this.matrix);
        this.scaleToContext();

        return ctx.createPattern(temporaryPatternCanvas, 'repeat');
      },
    };

    return TilingPattern;
  })();


  PDFJS.disableFontFace = false;

  var FontLoader = {
    insertRule: function fontLoaderInsertRule(rule) {
      let styleElement = document.getElementById('PDFJS_FONT_STYLE_TAG');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'PDFJS_FONT_STYLE_TAG';
        document.documentElement.getElementsByTagName('head')[0].appendChild(
            styleElement);
      }

      const styleSheet = styleElement.sheet;
      styleSheet.insertRule(rule, styleSheet.cssRules.length);
    },

    clear: function fontLoaderClear() {
      const styleElement = document.getElementById('PDFJS_FONT_STYLE_TAG');
      if (styleElement) {
        styleElement.parentNode.removeChild(styleElement);
      }
      this.nativeFontFaces.forEach((nativeFontFace) => {
        document.fonts.delete(nativeFontFace);
      });
      this.nativeFontFaces.length = 0;
    },
    get loadTestFont() {
    // This is a CFF font with 1 glyph for '.' that fills its entire width and
    // height.
      return shadow(this, 'loadTestFont', atob(
          'T1RUTwALAIAAAwAwQ0ZGIDHtZg4AAAOYAAAAgUZGVE1lkzZwAAAEHAAAABxHREVGABQAFQ' +
      'AABDgAAAAeT1MvMlYNYwkAAAEgAAAAYGNtYXABDQLUAAACNAAAAUJoZWFk/xVFDQAAALwA' +
      'AAA2aGhlYQdkA+oAAAD0AAAAJGhtdHgD6AAAAAAEWAAAAAZtYXhwAAJQAAAAARgAAAAGbm' +
      'FtZVjmdH4AAAGAAAAAsXBvc3T/hgAzAAADeAAAACAAAQAAAAEAALZRFsRfDzz1AAsD6AAA' +
      'AADOBOTLAAAAAM4KHDwAAAAAA+gDIQAAAAgAAgAAAAAAAAABAAADIQAAAFoD6AAAAAAD6A' +
      'ABAAAAAAAAAAAAAAAAAAAAAQAAUAAAAgAAAAQD6AH0AAUAAAKKArwAAACMAooCvAAAAeAA' +
      'MQECAAACAAYJAAAAAAAAAAAAAQAAAAAAAAAAAAAAAFBmRWQAwAAuAC4DIP84AFoDIQAAAA' +
      'AAAQAAAAAAAAAAACAAIAABAAAADgCuAAEAAAAAAAAAAQAAAAEAAAAAAAEAAQAAAAEAAAAA' +
      'AAIAAQAAAAEAAAAAAAMAAQAAAAEAAAAAAAQAAQAAAAEAAAAAAAUAAQAAAAEAAAAAAAYAAQ' +
      'AAAAMAAQQJAAAAAgABAAMAAQQJAAEAAgABAAMAAQQJAAIAAgABAAMAAQQJAAMAAgABAAMA' +
      'AQQJAAQAAgABAAMAAQQJAAUAAgABAAMAAQQJAAYAAgABWABYAAAAAAAAAwAAAAMAAAAcAA' +
      'EAAAAAADwAAwABAAAAHAAEACAAAAAEAAQAAQAAAC7//wAAAC7////TAAEAAAAAAAABBgAA' +
      'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAA' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAA' +
      'AAAAD/gwAyAAAAAQAAAAAAAAAAAAAAAAAAAAABAAQEAAEBAQJYAAEBASH4DwD4GwHEAvgc' +
      'A/gXBIwMAYuL+nz5tQXkD5j3CBLnEQACAQEBIVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWF' +
      'hYWFhYWFhYAAABAQAADwACAQEEE/t3Dov6fAH6fAT+fPp8+nwHDosMCvm1Cvm1DAz6fBQA' +
      'AAAAAAABAAAAAMmJbzEAAAAAzgTjFQAAAADOBOQpAAEAAAAAAAAADAAUAAQAAAABAAAAAg' +
      'ABAAAAAAAAAAAD6AAAAAAAAA=='
      ));
    },

    get isEvalSupported() {
      let evalSupport = false;
      if (PDFJS.isEvalSupported) {
        try {
        /* jshint evil: true */
          new Function('');
          evalSupport = true;
        } catch (e) {}
      }
      return shadow(this, 'isEvalSupported', evalSupport);
    },

    loadTestFontId: 0,

    loadingContext: {
      requests: [],
      nextRequestId: 0,
    },

    isSyncFontLoadingSupported: (function detectSyncFontLoadingSupport() {
      if (isWorker) {
        return false;
      }

      // User agent string sniffing is bad, but there is no reliable way to tell
      // if font is fully loaded and ready to be used with canvas.
      const userAgent = window.navigator.userAgent;
      const m = /Mozilla\/5.0.*?rv:(\d+).*? Gecko/.exec(userAgent);
      if (m && m[1] >= 14) {
        return true;
      }
      // TODO other browsers
      if (userAgent === 'node') {
        return true;
      }
      return false;
    })(),

    nativeFontFaces: [],

    isFontLoadingAPISupported: (!isWorker && typeof document !== 'undefined' &&
                              !!document.fonts),

    addNativeFontFace: function fontLoader_addNativeFontFace(nativeFontFace) {
      this.nativeFontFaces.push(nativeFontFace);
      document.fonts.add(nativeFontFace);
    },

    bind: function fontLoaderBind(fonts, callback) {
      assert(!isWorker, 'bind() shall be called from main thread');

      const rules = [];
      const fontsToLoad = [];
      const fontLoadPromises = [];
      const getNativeFontPromise = function (nativeFontFace) {
      // Return a promise that is always fulfilled, even when the font fails to
      // load.
        return nativeFontFace.loaded.catch((e) => {
          warn(`Failed to load font "${nativeFontFace.family}": ${e}`);
        });
      };
      for (let i = 0, ii = fonts.length; i < ii; i++) {
        const font = fonts[i];

        // Add the font to the DOM only once or skip if the font
        // is already loaded.
        if (font.attached || font.loading === false) {
          continue;
        }
        font.attached = true;

        if (this.isFontLoadingAPISupported) {
          const nativeFontFace = font.createNativeFontFace();
          if (nativeFontFace) {
            fontLoadPromises.push(getNativeFontPromise(nativeFontFace));
          }
        } else {
          const rule = font.bindDOM();
          if (rule) {
            rules.push(rule);
            fontsToLoad.push(font);
          }
        }
      }

      const request = FontLoader.queueLoadingCallback(callback);
      if (this.isFontLoadingAPISupported) {
        Promise.all(fontLoadPromises).then(() => {
          request.complete();
        });
      } else if (rules.length > 0 && !this.isSyncFontLoadingSupported) {
        FontLoader.prepareFontLoadEvent(rules, fontsToLoad, request);
      } else {
        request.complete();
      }
    },

    queueLoadingCallback: function FontLoader_queueLoadingCallback(callback) {
      function LoadLoader_completeRequest() {
        assert(!request.end, 'completeRequest() cannot be called twice');
        request.end = Date.now();

        // sending all completed requests in order how they were queued
        while (context.requests.length > 0 && context.requests[0].end) {
          const otherRequest = context.requests.shift();
          setTimeout(otherRequest.callback, 0);
        }
      }

      var context = FontLoader.loadingContext;
      const requestId = `pdfjs-font-loading-${context.nextRequestId++}`;
      var request = {
        id: requestId,
        complete: LoadLoader_completeRequest,
        callback,
        started: Date.now(),
      };
      context.requests.push(request);
      return request;
    },

    prepareFontLoadEvent: function fontLoaderPrepareFontLoadEvent(rules,
        fonts,
        request) {
      /** Hack begin */
      // There's currently no event when a font has finished downloading so the
      // following code is a dirty hack to 'guess' when a font is
      // ready. It's assumed fonts are loaded in order, so add a known test
      // font after the desired fonts and then test for the loading of that
      // test font.

      function int32(data, offset) {
        return (data.charCodeAt(offset) << 24) |
               (data.charCodeAt(offset + 1) << 16) |
               (data.charCodeAt(offset + 2) << 8) |
               (data.charCodeAt(offset + 3) & 0xff);
      }

      function spliceString(s, offset, remove, insert) {
        const chunk1 = s.substr(0, offset);
        const chunk2 = s.substr(offset + remove);
        return chunk1 + insert + chunk2;
      }

      let i, ii;

      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');

      let called = 0;
      function isFontReady(name, callback) {
        called++;
        // With setTimeout clamping this gives the font ~100ms to load.
        if (called > 30) {
          warn('Load test font never loaded.');
          callback();
          return;
        }
        ctx.font = `30px ${name}`;
        ctx.fillText('.', 0, 20);
        const imageData = ctx.getImageData(0, 0, 1, 1);
        if (imageData.data[3] > 0) {
          callback();
          return;
        }
        setTimeout(isFontReady.bind(null, name, callback));
      }

      const loadTestFontId = `lt${Date.now()}${this.loadTestFontId++}`;
      // Chromium seems to cache fonts based on a hash of the actual font data,
      // so the font must be modified for each load test else it will appear to
      // be loaded already.
      // TODO: This could maybe be made faster by avoiding the btoa of the full
      // font by splitting it in chunks before hand and padding the font id.
      let data = this.loadTestFont;
      const COMMENT_OFFSET = 976; // has to be on 4 byte boundary (for checksum)
      data = spliceString(data, COMMENT_OFFSET, loadTestFontId.length,
          loadTestFontId);
      // CFF checksum is important for IE, adjusting it
      const CFF_CHECKSUM_OFFSET = 16;
      const XXXX_VALUE = 0x58585858; // the "comment" filled with 'X'
      let checksum = int32(data, CFF_CHECKSUM_OFFSET);
      for (i = 0, ii = loadTestFontId.length - 3; i < ii; i += 4) {
        checksum = (checksum - XXXX_VALUE + int32(loadTestFontId, i)) | 0;
      }
      if (i < loadTestFontId.length) { // align to 4 bytes boundary
        checksum = (checksum - XXXX_VALUE +
                    int32(`${loadTestFontId}XXX`, i)) | 0;
      }
      data = spliceString(data, CFF_CHECKSUM_OFFSET, 4, string32(checksum));

      const url = `url(data:font/opentype;base64,${btoa(data)});`;
      const rule = `@font-face { font-family:"${loadTestFontId}";src:${
        url}}`;
      FontLoader.insertRule(rule);

      const names = [];
      for (i = 0, ii = fonts.length; i < ii; i++) {
        names.push(fonts[i].loadedName);
      }
      names.push(loadTestFontId);

      const div = document.createElement('div');
      div.setAttribute('style',
          'visibility: hidden;' +
                       'width: 10px; height: 10px;' +
                       'position: absolute; top: 0px; left: 0px;');
      for (i = 0, ii = names.length; i < ii; ++i) {
        const span = document.createElement('span');
        span.textContent = 'Hi';
        span.style.fontFamily = names[i];
        div.appendChild(span);
      }
      document.body.appendChild(div);

      isFontReady(loadTestFontId, () => {
        document.body.removeChild(div);
        request.complete();
      });
      /** Hack end */
    },
  };

  var FontFaceObject = (function FontFaceObjectClosure() {
    function FontFaceObject(name, file, properties) {
      this.compiledGlyphs = {};
      if (arguments.length === 1) {
      // importing translated data
        const data = arguments[0];
        for (const i in data) {
          this[i] = data[i];
        }
        return;
      }
    }
    FontFaceObject.prototype = {
      createNativeFontFace: function FontFaceObject_createNativeFontFace() {
        if (!this.data) {
          return null;
        }

        if (PDFJS.disableFontFace) {
          this.disableFontFace = true;
          return null;
        }

        const nativeFontFace = new FontFace(this.loadedName, this.data, {});

        FontLoader.addNativeFontFace(nativeFontFace);

        if (PDFJS.pdfBug && 'FontInspector' in globalScope &&
          globalScope.FontInspector.enabled) {
          globalScope.FontInspector.fontAdded(this);
        }
        return nativeFontFace;
      },

      bindDOM: function FontFaceObject_bindDOM() {
        if (!this.data) {
          return null;
        }

        if (PDFJS.disableFontFace) {
          this.disableFontFace = true;
          return null;
        }

        const data = bytesToString(new Uint8Array(this.data));
        const fontName = this.loadedName;

        // Add the font-face rule to the document
        const url = (`url(data:${this.mimetype};base64,${
          window.btoa(data)});`);
        const rule = `@font-face { font-family:"${fontName}";src:${url}}`;
        FontLoader.insertRule(rule);

        if (PDFJS.pdfBug && 'FontInspector' in globalScope &&
          globalScope.FontInspector.enabled) {
          globalScope.FontInspector.fontAdded(this, url);
        }

        return rule;
      },

      getPathGenerator: function FontLoader_getPathGenerator(objs, character) {
        if (!(character in this.compiledGlyphs)) {
          const cmds = objs.get(`${this.loadedName}_path_${character}`);
          let current, i, len;

          // If we can, compile cmds into JS for MAXIMUM SPEED
          if (FontLoader.isEvalSupported) {
            let args; let
              js = '';
            for (i = 0, len = cmds.length; i < len; i++) {
              current = cmds[i];

              if (current.args !== undefined) {
                args = current.args.join(',');
              } else {
                args = '';
              }

              js += `c.${current.cmd}(${args});\n`;
            }
            /* jshint -W054 */
            this.compiledGlyphs[character] = new Function('c', 'size', js);
          } else {
          // But fall back on using Function.prototype.apply() if we're
          // blocked from using eval() for whatever reason (like CSP policies)
            this.compiledGlyphs[character] = function (c, size) {
              for (i = 0, len = cmds.length; i < len; i++) {
                current = cmds[i];

                if (current.cmd === 'scale') {
                  current.args = [size, -size];
                }

                c[current.cmd].apply(c, current.args);
              }
            };
          }
        }
        return this.compiledGlyphs[character];
      },
    };
    return FontFaceObject;
  })();


  /**
 * Optimised CSS custom property getter/setter.
 * @class
 */
  const CustomStyle = (function CustomStyleClosure() {
  // As noted on: http://www.zachstronaut.com/posts/2009/02/17/
    //              animate-css-transforms-firefox-webkit.html
    // in some versions of IE9 it is critical that ms appear in this list
    // before Moz
    const prefixes = ['ms', 'Moz', 'Webkit', 'O'];
    const _cache = {};

    function CustomStyle() {}

    CustomStyle.getProp = function get(propName, element) {
    // check cache only when no element is given
      if (arguments.length === 1 && typeof _cache[propName] === 'string') {
        return _cache[propName];
      }

      element = element || document.documentElement;
      const style = element.style; let prefixed; let uPropName;

      // test standard property first
      if (typeof style[propName] === 'string') {
        return (_cache[propName] = propName);
      }

      // capitalize
      uPropName = propName.charAt(0).toUpperCase() + propName.slice(1);

      // test vendor specific properties
      for (let i = 0, l = prefixes.length; i < l; i++) {
        prefixed = prefixes[i] + uPropName;
        if (typeof style[prefixed] === 'string') {
          return (_cache[propName] = prefixed);
        }
      }

      // if all fails then set to undefined
      return (_cache[propName] = 'undefined');
    };

    CustomStyle.setProp = function set(propName, element, str) {
      const prop = this.getProp(propName);
      if (prop !== 'undefined') {
        element.style[prop] = str;
      }
    };

    return CustomStyle;
  })();

  PDFJS.CustomStyle = CustomStyle;


  const ANNOT_MIN_SIZE = 10; // px

  const AnnotationUtils = (function AnnotationUtilsClosure() {
  // TODO(mack): This dupes some of the logic in CanvasGraphics.setFont()
    function setTextStyles(element, item, fontObj) {
      const style = element.style;
      style.fontSize = `${item.fontSize}px`;
      style.direction = item.fontDirection < 0 ? 'rtl' : 'ltr';

      if (!fontObj) {
        return;
      }

      style.fontWeight = fontObj.black
        ? (fontObj.bold ? 'bolder' : 'bold')
        : (fontObj.bold ? 'bold' : 'normal');
      style.fontStyle = fontObj.italic ? 'italic' : 'normal';

      const fontName = fontObj.loadedName;
      const fontFamily = fontName ? `"${fontName}", ` : '';
      // Use a reasonable default font if the font doesn't specify a fallback
      const fallbackName = fontObj.fallbackName || 'Helvetica, sans-serif';
      style.fontFamily = fontFamily + fallbackName;
    }

    function initContainer(item) {
      const container = document.createElement('section');
      const cstyle = container.style;
      let width = item.rect[2] - item.rect[0];
      let height = item.rect[3] - item.rect[1];

      // Border
      if (item.borderStyle.width > 0) {
      // Border width
        container.style.borderWidth = `${item.borderStyle.width}px`;
        if (item.borderStyle.style !== AnnotationBorderStyleType.UNDERLINE) {
        // Underline styles only have a bottom border, so we do not need
        // to adjust for all borders. This yields a similar result as
        // Adobe Acrobat/Reader.
          width -= 2 * item.borderStyle.width;
          height -= 2 * item.borderStyle.width;
        }

        // Horizontal and vertical border radius
        const horizontalRadius = item.borderStyle.horizontalCornerRadius;
        const verticalRadius = item.borderStyle.verticalCornerRadius;
        if (horizontalRadius > 0 || verticalRadius > 0) {
          const radius = `${horizontalRadius}px / ${verticalRadius}px`;
          CustomStyle.setProp('borderRadius', container, radius);
        }

        // Border style
        switch (item.borderStyle.style) {
          case AnnotationBorderStyleType.SOLID:
            container.style.borderStyle = 'solid';
            break;

          case AnnotationBorderStyleType.DASHED:
            container.style.borderStyle = 'dashed';
            break;

          case AnnotationBorderStyleType.BEVELED:
            warn('Unimplemented border style: beveled');
            break;

          case AnnotationBorderStyleType.INSET:
            warn('Unimplemented border style: inset');
            break;

          case AnnotationBorderStyleType.UNDERLINE:
            container.style.borderBottomStyle = 'solid';
            break;

          default:
            break;
        }

        // Border color
        if (item.color) {
          container.style.borderColor =
          Util.makeCssRgb(item.color[0] | 0,
              item.color[1] | 0,
              item.color[2] | 0);
        } else {
        // Transparent (invisible) border, so do not draw it at all.
          container.style.borderWidth = 0;
        }
      }

      cstyle.width = `${width}px`;
      cstyle.height = `${height}px`;
      return container;
    }

    function getHtmlElementForTextWidgetAnnotation(item, commonObjs) {
      const element = document.createElement('div');
      const width = item.rect[2] - item.rect[0];
      const height = item.rect[3] - item.rect[1];
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      element.style.display = 'table';

      const content = document.createElement('div');
      content.textContent = item.fieldValue;
      const textAlignment = item.textAlignment;
      content.style.textAlign = ['left', 'center', 'right'][textAlignment];
      content.style.verticalAlign = 'middle';
      content.style.display = 'table-cell';

      const fontObj = item.fontRefName
        ? commonObjs.getData(item.fontRefName) : null;
      setTextStyles(content, item, fontObj);

      element.appendChild(content);

      return element;
    }

    function getHtmlElementForTextAnnotation(item) {
      const rect = item.rect;

      // sanity check because of OOo-generated PDFs
      if ((rect[3] - rect[1]) < ANNOT_MIN_SIZE) {
        rect[3] = rect[1] + ANNOT_MIN_SIZE;
      }
      if ((rect[2] - rect[0]) < ANNOT_MIN_SIZE) {
        rect[2] = rect[0] + (rect[3] - rect[1]); // make it square
      }

      const container = initContainer(item);
      container.className = 'annotText';

      const image = document.createElement('img');
      image.style.height = container.style.height;
      image.style.width = container.style.width;
      const iconName = item.name;
      image.src = `${PDFJS.imageResourcesPath}annotation-${
        iconName.toLowerCase()}.svg`;
      image.alt = '[{{type}} Annotation]';
      image.dataset.l10nId = 'text_annotation_type';
      image.dataset.l10nArgs = JSON.stringify({type: iconName});

      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'annotTextContentWrapper';
      contentWrapper.style.left = `${Math.floor(rect[2] - rect[0] + 5)}px`;
      contentWrapper.style.top = '-10px';

      const content = document.createElement('div');
      content.className = 'annotTextContent';
      content.setAttribute('hidden', true);

      let i, ii;
      if (item.hasBgColor && item.color) {
        const color = item.color;

        // Enlighten the color (70%)
        const BACKGROUND_ENLIGHT = 0.7;
        const r = BACKGROUND_ENLIGHT * (255 - color[0]) + color[0];
        const g = BACKGROUND_ENLIGHT * (255 - color[1]) + color[1];
        const b = BACKGROUND_ENLIGHT * (255 - color[2]) + color[2];
        content.style.backgroundColor = Util.makeCssRgb(r | 0, g | 0, b | 0);
      }

      const title = document.createElement('h1');
      const text = document.createElement('p');
      title.textContent = item.title;

      if (!item.content && !item.title) {
        content.setAttribute('hidden', true);
      } else {
        const e = document.createElement('span');
        const lines = item.content.split(/(?:\r\n?|\n)/);
        for (i = 0, ii = lines.length; i < ii; ++i) {
          const line = lines[i];
          e.appendChild(document.createTextNode(line));
          if (i < (ii - 1)) {
            e.appendChild(document.createElement('br'));
          }
        }
        text.appendChild(e);

        let pinned = false;

        const showAnnotation = function showAnnotation(pin) {
          if (pin) {
            pinned = true;
          }
          if (content.hasAttribute('hidden')) {
            container.style.zIndex += 1;
            content.removeAttribute('hidden');
          }
        };

        const hideAnnotation = function hideAnnotation(unpin) {
          if (unpin) {
            pinned = false;
          }
          if (!content.hasAttribute('hidden') && !pinned) {
            container.style.zIndex -= 1;
            content.setAttribute('hidden', true);
          }
        };

        const toggleAnnotation = function toggleAnnotation() {
          if (pinned) {
            hideAnnotation(true);
          } else {
            showAnnotation(true);
          }
        };

        image.addEventListener('click', () => {
          toggleAnnotation();
        }, false);
        image.addEventListener('mouseover', () => {
          showAnnotation();
        }, false);
        image.addEventListener('mouseout', () => {
          hideAnnotation();
        }, false);

        content.addEventListener('click', () => {
          hideAnnotation(true);
        }, false);
      }

      content.appendChild(title);
      content.appendChild(text);
      contentWrapper.appendChild(content);
      container.appendChild(image);
      container.appendChild(contentWrapper);

      return container;
    }

    function getHtmlElementForLinkAnnotation(item) {
      const container = initContainer(item);
      container.className = 'annotLink';

      const link = document.createElement('a');
      link.href = link.title = item.url || '';

      if (item.url && isExternalLinkTargetSet()) {
        link.target = LinkTargetStringMap[PDFJS.externalLinkTarget];
      }

      container.appendChild(link);

      return container;
    }

    function getHtmlElement(data, objs) {
      switch (data.annotationType) {
        case AnnotationType.WIDGET:
          return getHtmlElementForTextWidgetAnnotation(data, objs);
        case AnnotationType.TEXT:
          return getHtmlElementForTextAnnotation(data);
        case AnnotationType.LINK:
          return getHtmlElementForLinkAnnotation(data);
        default:
          throw new Error(`Unsupported annotationType: ${data.annotationType}`);
      }
    }

    return {
      getHtmlElement,
    };
  })();
  PDFJS.AnnotationUtils = AnnotationUtils;


  /**
 * Text layer render parameters.
 *
 * @typedef {Object} TextLayerRenderParameters
 * @property {TextContent} textContent - Text content to render (the object is
 *   returned by the page's getTextContent() method).
 * @property {HTMLElement} container - HTML element that will contain text runs.
 * @property {PDFJS.PageViewport} viewport - The target viewport to properly
 *   layout the text runs.
 * @property {Array} textDivs - (optional) HTML elements that are correspond
 *   the text items of the textContent input. This is output and shall be
 *   initially be set to empty array.
 * @property {number} timeout - (optional) Delay in milliseconds before
 *   rendering of the text  runs occurs.
 */
  const renderTextLayer = (function renderTextLayerClosure() {
    const MAX_TEXT_DIVS_TO_RENDER = 100000;

    const NonWhitespaceRegexp = /\S/;

    function isAllWhitespace(str) {
      return !NonWhitespaceRegexp.test(str);
    }

    function appendText(textDivs, viewport, geom, styles) {
      const style = styles[geom.fontName];
      const textDiv = document.createElement('div');
      textDivs.push(textDiv);
      if (isAllWhitespace(geom.str)) {
        textDiv.dataset.isWhitespace = true;
        return;
      }
      const tx = PDFJS.Util.transform(viewport.transform, geom.transform);
      let angle = Math.atan2(tx[1], tx[0]);
      if (style.vertical) {
        angle += Math.PI / 2;
      }
      const fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
      let fontAscent = fontHeight;
      if (style.ascent) {
        fontAscent = style.ascent * fontAscent;
      } else if (style.descent) {
        fontAscent = (1 + style.descent) * fontAscent;
      }

      let left;
      let top;
      if (angle === 0) {
        left = tx[4];
        top = tx[5] - fontAscent;
      } else {
        left = tx[4] + (fontAscent * Math.sin(angle));
        top = tx[5] - (fontAscent * Math.cos(angle));
      }
      textDiv.style.left = `${left}px`;
      textDiv.style.top = `${top}px`;
      textDiv.style.fontSize = `${fontHeight}px`;
      textDiv.style.fontFamily = style.fontFamily;

      textDiv.textContent = geom.str;
      // |fontName| is only used by the Font Inspector. This test will succeed
      // when e.g. the Font Inspector is off but the Stepper is on, but it's
      // not worth the effort to do a more accurate test.
      if (PDFJS.pdfBug) {
        textDiv.dataset.fontName = geom.fontName;
      }
      // Storing into dataset will convert number into string.
      if (angle !== 0) {
        textDiv.dataset.angle = angle * (180 / Math.PI);
      }
      // We don't bother scaling single-char text divs, because it has very
      // little effect on text highlighting. This makes scrolling on docs with
      // lots of such divs a lot faster.
      if (geom.str.length > 1) {
        if (style.vertical) {
          textDiv.dataset.canvasWidth = geom.height * viewport.scale;
        } else {
          textDiv.dataset.canvasWidth = geom.width * viewport.scale;
        }
      }
    }

    function render(task) {
      if (task._canceled) {
        return;
      }
      const textLayerFrag = task._container;
      const textDivs = task._textDivs;
      const capability = task._capability;
      const textDivsLength = textDivs.length;

      // No point in rendering many divs as it would make the browser
      // unusable even after the divs are rendered.
      if (textDivsLength > MAX_TEXT_DIVS_TO_RENDER) {
        capability.resolve();
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.mozOpaque = true;
      const ctx = canvas.getContext('2d', {alpha: false});

      let lastFontSize;
      let lastFontFamily;
      for (let i = 0; i < textDivsLength; i++) {
        const textDiv = textDivs[i];
        if (textDiv.dataset.isWhitespace !== undefined) {
          continue;
        }

        const fontSize = textDiv.style.fontSize;
        const fontFamily = textDiv.style.fontFamily;

        // Only build font string and set to context if different from last.
        if (fontSize !== lastFontSize || fontFamily !== lastFontFamily) {
          ctx.font = `${fontSize} ${fontFamily}`;
          lastFontSize = fontSize;
          lastFontFamily = fontFamily;
        }

        const width = ctx.measureText(textDiv.textContent).width;
        if (width > 0) {
          textLayerFrag.appendChild(textDiv);
          var transform;
          if (textDiv.dataset.canvasWidth !== undefined) {
          // Dataset values come of type string.
            const textScale = textDiv.dataset.canvasWidth / width;
            transform = `scaleX(${textScale})`;
          } else {
            transform = '';
          }
          const rotation = textDiv.dataset.angle;
          if (rotation) {
            transform = `rotate(${rotation}deg) ${transform}`;
          }
          if (transform) {
            PDFJS.CustomStyle.setProp('transform', textDiv, transform);
          }
        }
      }
      capability.resolve();
    }

    /**
   * Text layer rendering task.
   *
   * @param {TextContent} textContent
   * @param {HTMLElement} container
   * @param {PDFJS.PageViewport} viewport
   * @param {Array} textDivs
   * @private
   */
    function TextLayerRenderTask(textContent, container, viewport, textDivs) {
      this._textContent = textContent;
      this._container = container;
      this._viewport = viewport;
      textDivs = textDivs || [];
      this._textDivs = textDivs;
      this._canceled = false;
      this._capability = createPromiseCapability();
      this._renderTimer = null;
    }
    TextLayerRenderTask.prototype = {
      get promise() {
        return this._capability.promise;
      },

      cancel: function TextLayer_cancel() {
        this._canceled = true;
        if (this._renderTimer !== null) {
          clearTimeout(this._renderTimer);
          this._renderTimer = null;
        }
        this._capability.reject('canceled');
      },

      _render: function TextLayer_render(timeout) {
        const textItems = this._textContent.items;
        const styles = this._textContent.styles;
        const textDivs = this._textDivs;
        const viewport = this._viewport;
        for (let i = 0, len = textItems.length; i < len; i++) {
          appendText(textDivs, viewport, textItems[i], styles);
        }

        if (!timeout) { // Render right away
          render(this);
        } else { // Schedule
          const self = this;
          this._renderTimer = setTimeout(() => {
            render(self);
            self._renderTimer = null;
          }, timeout);
        }
      },
    };


    /**
   * Starts rendering of the text layer.
   *
   * @param {TextLayerRenderParameters} renderParameters
   * @returns {TextLayerRenderTask}
   */
    function renderTextLayer(renderParameters) {
      const task = new TextLayerRenderTask(renderParameters.textContent,
          renderParameters.container,
          renderParameters.viewport,
          renderParameters.textDivs);
      task._render(renderParameters.timeout);
      return task;
    }

    return renderTextLayer;
  })();

  PDFJS.renderTextLayer = renderTextLayer;


  const SVG_DEFAULTS = {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fillColor: '#000000',
  };

  const convertImgDataToPng = (function convertImgDataToPngClosure() {
    const PNG_HEADER =
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

    const CHUNK_WRAPPER_SIZE = 12;

    const crcTable = new Int32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let h = 0; h < 8; h++) {
        if (c & 1) {
          c = 0xedB88320 ^ ((c >> 1) & 0x7fffffff);
        } else {
          c = (c >> 1) & 0x7fffffff;
        }
      }
      crcTable[i] = c;
    }

    function crc32(data, start, end) {
      let crc = -1;
      for (let i = start; i < end; i++) {
        const a = (crc ^ data[i]) & 0xff;
        const b = crcTable[a];
        crc = (crc >>> 8) ^ b;
      }
      return crc ^ -1;
    }

    function writePngChunk(type, body, data, offset) {
      let p = offset;
      const len = body.length;

      data[p] = len >> 24 & 0xff;
      data[p + 1] = len >> 16 & 0xff;
      data[p + 2] = len >> 8 & 0xff;
      data[p + 3] = len & 0xff;
      p += 4;

      data[p] = type.charCodeAt(0) & 0xff;
      data[p + 1] = type.charCodeAt(1) & 0xff;
      data[p + 2] = type.charCodeAt(2) & 0xff;
      data[p + 3] = type.charCodeAt(3) & 0xff;
      p += 4;

      data.set(body, p);
      p += body.length;

      const crc = crc32(data, offset + 4, p);

      data[p] = crc >> 24 & 0xff;
      data[p + 1] = crc >> 16 & 0xff;
      data[p + 2] = crc >> 8 & 0xff;
      data[p + 3] = crc & 0xff;
    }

    function adler32(data, start, end) {
      let a = 1;
      let b = 0;
      for (let i = start; i < end; ++i) {
        a = (a + (data[i] & 0xff)) % 65521;
        b = (b + a) % 65521;
      }
      return (b << 16) | a;
    }

    function encode(imgData, kind) {
      const width = imgData.width;
      const height = imgData.height;
      let bitDepth, colorType, lineSize;
      const bytes = imgData.data;

      switch (kind) {
        case ImageKind.GRAYSCALE_1BPP:
          colorType = 0;
          bitDepth = 1;
          lineSize = (width + 7) >> 3;
          break;
        case ImageKind.RGB_24BPP:
          colorType = 2;
          bitDepth = 8;
          lineSize = width * 3;
          break;
        case ImageKind.RGBA_32BPP:
          colorType = 6;
          bitDepth = 8;
          lineSize = width * 4;
          break;
        default:
          throw new Error('invalid format');
      }

      // prefix every row with predictor 0
      const literals = new Uint8Array((1 + lineSize) * height);
      let offsetLiterals = 0; let
        offsetBytes = 0;
      let y, i;
      for (y = 0; y < height; ++y) {
        literals[offsetLiterals++] = 0; // no prediction
        literals.set(bytes.subarray(offsetBytes, offsetBytes + lineSize),
            offsetLiterals);
        offsetBytes += lineSize;
        offsetLiterals += lineSize;
      }

      if (kind === ImageKind.GRAYSCALE_1BPP) {
      // inverting for B/W
        offsetLiterals = 0;
        for (y = 0; y < height; y++) {
          offsetLiterals++; // skipping predictor
          for (i = 0; i < lineSize; i++) {
            literals[offsetLiterals++] ^= 0xFF;
          }
        }
      }

      const ihdr = new Uint8Array([
        width >> 24 & 0xff,
        width >> 16 & 0xff,
        width >> 8 & 0xff,
        width & 0xff,
        height >> 24 & 0xff,
        height >> 16 & 0xff,
        height >> 8 & 0xff,
        height & 0xff,
        bitDepth, // bit depth
        colorType, // color type
        0x00, // compression method
        0x00, // filter method
        0x00, // interlace method
      ]);

      let len = literals.length;
      const maxBlockLength = 0xFFFF;

      const deflateBlocks = Math.ceil(len / maxBlockLength);
      const idat = new Uint8Array(2 + len + deflateBlocks * 5 + 4);
      let pi = 0;
      idat[pi++] = 0x78; // compression method and flags
      idat[pi++] = 0x9c; // flags

      let pos = 0;
      while (len > maxBlockLength) {
      // writing non-final DEFLATE blocks type 0 and length of 65535
        idat[pi++] = 0x00;
        idat[pi++] = 0xff;
        idat[pi++] = 0xff;
        idat[pi++] = 0x00;
        idat[pi++] = 0x00;
        idat.set(literals.subarray(pos, pos + maxBlockLength), pi);
        pi += maxBlockLength;
        pos += maxBlockLength;
        len -= maxBlockLength;
      }

      // writing non-final DEFLATE blocks type 0
      idat[pi++] = 0x01;
      idat[pi++] = len & 0xff;
      idat[pi++] = len >> 8 & 0xff;
      idat[pi++] = (~len & 0xffff) & 0xff;
      idat[pi++] = (~len & 0xffff) >> 8 & 0xff;
      idat.set(literals.subarray(pos), pi);
      pi += literals.length - pos;

      const adler = adler32(literals, 0, literals.length); // checksum
      idat[pi++] = adler >> 24 & 0xff;
      idat[pi++] = adler >> 16 & 0xff;
      idat[pi++] = adler >> 8 & 0xff;
      idat[pi++] = adler & 0xff;

      // PNG will consists: header, IHDR+data, IDAT+data, and IEND.
      const pngLength = PNG_HEADER.length + (CHUNK_WRAPPER_SIZE * 3) +
                    ihdr.length + idat.length;
      const data = new Uint8Array(pngLength);
      let offset = 0;
      data.set(PNG_HEADER, offset);
      offset += PNG_HEADER.length;
      writePngChunk('IHDR', ihdr, data, offset);
      offset += CHUNK_WRAPPER_SIZE + ihdr.length;
      writePngChunk('IDATA', idat, data, offset);
      offset += CHUNK_WRAPPER_SIZE + idat.length;
      writePngChunk('IEND', new Uint8Array(0), data, offset);

      return PDFJS.createObjectURL(data, 'image/png');
    }

    return function convertImgDataToPng(imgData) {
      const kind = (imgData.kind === undefined
        ? ImageKind.GRAYSCALE_1BPP : imgData.kind);
      return encode(imgData, kind);
    };
  })();

  const SVGExtraState = (function SVGExtraStateClosure() {
    function SVGExtraState() {
      this.fontSizeScale = 1;
      this.fontWeight = SVG_DEFAULTS.fontWeight;
      this.fontSize = 0;

      this.textMatrix = IDENTITY_MATRIX;
      this.fontMatrix = FONT_IDENTITY_MATRIX;
      this.leading = 0;

      // Current point (in user coordinates)
      this.x = 0;
      this.y = 0;

      // Start of text line (in text coordinates)
      this.lineX = 0;
      this.lineY = 0;

      // Character and word spacing
      this.charSpacing = 0;
      this.wordSpacing = 0;
      this.textHScale = 1;
      this.textRise = 0;

      // Default foreground and background colors
      this.fillColor = SVG_DEFAULTS.fillColor;
      this.strokeColor = '#000000';

      this.fillAlpha = 1;
      this.strokeAlpha = 1;
      this.lineWidth = 1;
      this.lineJoin = '';
      this.lineCap = '';
      this.miterLimit = 0;

      this.dashArray = [];
      this.dashPhase = 0;

      this.dependencies = [];

      // Clipping
      this.clipId = '';
      this.pendingClip = false;

      this.maskId = '';
    }

    SVGExtraState.prototype = {
      clone: function SVGExtraState_clone() {
        return Object.create(this);
      },
      setCurrentPoint: function SVGExtraState_setCurrentPoint(x, y) {
        this.x = x;
        this.y = y;
      },
    };
    return SVGExtraState;
  })();

  const SVGGraphics = (function SVGGraphicsClosure() {
    function createScratchSVG(width, height) {
      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg:svg');
      svg.setAttributeNS(null, 'version', '1.1');
      svg.setAttributeNS(null, 'width', `${width}px`);
      svg.setAttributeNS(null, 'height', `${height}px`);
      svg.setAttributeNS(null, 'viewBox', `0 0 ${width} ${height}`);
      return svg;
    }

    function opListToTree(opList) {
      let opTree = [];
      const tmp = [];
      const opListLen = opList.length;

      for (let x = 0; x < opListLen; x++) {
        if (opList[x].fn === 'save') {
          opTree.push({fnId: 92, fn: 'group', items: []});
          tmp.push(opTree);
          opTree = opTree[opTree.length - 1].items;
          continue;
        }

        if (opList[x].fn === 'restore') {
          opTree = tmp.pop();
        } else {
          opTree.push(opList[x]);
        }
      }
      return opTree;
    }

    /**
   * Formats float number.
   * @param value {number} number to format.
   * @returns {string}
   */
    function pf(value) {
      if (value === (value | 0)) { // integer number
        return value.toString();
      }
      const s = value.toFixed(10);
      let i = s.length - 1;
      if (s[i] !== '0') {
        return s;
      }
      // removing trailing zeros
      do {
        i--;
      } while (s[i] === '0');
      return s.substr(0, s[i] === '.' ? i : i + 1);
    }

    /**
   * Formats transform matrix. The standard rotation, scale and translate
   * matrices are replaced by their shorter forms, and for identity matrix
   * returns empty string to save the memory.
   * @param m {Array} matrix to format.
   * @returns {string}
   */
    function pm(m) {
      if (m[4] === 0 && m[5] === 0) {
        if (m[1] === 0 && m[2] === 0) {
          if (m[0] === 1 && m[3] === 1) {
            return '';
          }
          return `scale(${pf(m[0])} ${pf(m[3])})`;
        }
        if (m[0] === m[3] && m[1] === -m[2]) {
          const a = Math.acos(m[0]) * 180 / Math.PI;
          return `rotate(${pf(a)})`;
        }
      } else if (m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1) {
        return `translate(${pf(m[4])} ${pf(m[5])})`;
      }
      return `matrix(${pf(m[0])} ${pf(m[1])} ${pf(m[2])} ${
        pf(m[3])} ${pf(m[4])} ${pf(m[5])})`;
    }

    function SVGGraphics(commonObjs, objs) {
      this.current = new SVGExtraState();
      this.transformMatrix = IDENTITY_MATRIX; // Graphics state matrix
      this.transformStack = [];
      this.extraStack = [];
      this.commonObjs = commonObjs;
      this.objs = objs;
      this.pendingEOFill = false;

      this.embedFonts = false;
      this.embeddedFonts = {};
      this.cssStyle = null;
    }

    const NS = 'http://www.w3.org/2000/svg';
    const XML_NS = 'http://www.w3.org/XML/1998/namespace';
    const XLINK_NS = 'http://www.w3.org/1999/xlink';
    const LINE_CAP_STYLES = ['butt', 'round', 'square'];
    const LINE_JOIN_STYLES = ['miter', 'round', 'bevel'];
    let clipCount = 0;
    let maskCount = 0;

    SVGGraphics.prototype = {
      save: function SVGGraphics_save() {
        this.transformStack.push(this.transformMatrix);
        const old = this.current;
        this.extraStack.push(old);
        this.current = old.clone();
      },

      restore: function SVGGraphics_restore() {
        this.transformMatrix = this.transformStack.pop();
        this.current = this.extraStack.pop();

        this.tgrp = document.createElementNS(NS, 'svg:g');
        this.tgrp.setAttributeNS(null, 'transform', pm(this.transformMatrix));
        this.pgrp.appendChild(this.tgrp);
      },

      group: function SVGGraphics_group(items) {
        this.save();
        this.executeOpTree(items);
        this.restore();
      },

      loadDependencies: function SVGGraphics_loadDependencies(operatorList) {
        const fnArray = operatorList.fnArray;
        const fnArrayLen = fnArray.length;
        const argsArray = operatorList.argsArray;

        const self = this;
        for (let i = 0; i < fnArrayLen; i++) {
          if (OPS.dependency === fnArray[i]) {
            const deps = argsArray[i];
            for (let n = 0, nn = deps.length; n < nn; n++) {
              var obj = deps[n];
              const common = obj.substring(0, 2) === 'g_';
              var promise;
              if (common) {
                promise = new Promise((resolve) => {
                  self.commonObjs.get(obj, resolve);
                });
              } else {
                promise = new Promise((resolve) => {
                  self.objs.get(obj, resolve);
                });
              }
              this.current.dependencies.push(promise);
            }
          }
        }
        return Promise.all(this.current.dependencies);
      },

      transform: function SVGGraphics_transform(a, b, c, d, e, f) {
        const transformMatrix = [a, b, c, d, e, f];
        this.transformMatrix = PDFJS.Util.transform(this.transformMatrix,
            transformMatrix);

        this.tgrp = document.createElementNS(NS, 'svg:g');
        this.tgrp.setAttributeNS(null, 'transform', pm(this.transformMatrix));
      },

      getSVG: function SVGGraphics_getSVG(operatorList, viewport) {
        this.svg = createScratchSVG(viewport.width, viewport.height);
        this.viewport = viewport;

        return this.loadDependencies(operatorList).then(() => {
          this.transformMatrix = IDENTITY_MATRIX;
          this.pgrp = document.createElementNS(NS, 'svg:g'); // Parent group
          this.pgrp.setAttributeNS(null, 'transform', pm(viewport.transform));
          this.tgrp = document.createElementNS(NS, 'svg:g'); // Transform group
          this.tgrp.setAttributeNS(null, 'transform', pm(this.transformMatrix));
          this.defs = document.createElementNS(NS, 'svg:defs');
          this.pgrp.appendChild(this.defs);
          this.pgrp.appendChild(this.tgrp);
          this.svg.appendChild(this.pgrp);
          const opTree = this.convertOpList(operatorList);
          this.executeOpTree(opTree);
          return this.svg;
        });
      },

      convertOpList: function SVGGraphics_convertOpList(operatorList) {
        const argsArray = operatorList.argsArray;
        const fnArray = operatorList.fnArray;
        const fnArrayLen = fnArray.length;
        const REVOPS = [];
        const opList = [];

        for (const op in OPS) {
          REVOPS[OPS[op]] = op;
        }

        for (let x = 0; x < fnArrayLen; x++) {
          const fnId = fnArray[x];
          opList.push({fnId, fn: REVOPS[fnId], args: argsArray[x]});
        }
        return opListToTree(opList);
      },

      executeOpTree: function SVGGraphics_executeOpTree(opTree) {
        const opTreeLen = opTree.length;
        for (let x = 0; x < opTreeLen; x++) {
          const fn = opTree[x].fn;
          const fnId = opTree[x].fnId;
          const args = opTree[x].args;

          switch (fnId | 0) {
            case OPS.beginText:
              this.beginText();
              break;
            case OPS.setLeading:
              this.setLeading(args);
              break;
            case OPS.setLeadingMoveText:
              this.setLeadingMoveText(args[0], args[1]);
              break;
            case OPS.setFont:
              this.setFont(args);
              break;
            case OPS.showText:
              this.showText(args[0]);
              break;
            case OPS.showSpacedText:
              this.showText(args[0]);
              break;
            case OPS.endText:
              this.endText();
              break;
            case OPS.moveText:
              this.moveText(args[0], args[1]);
              break;
            case OPS.setCharSpacing:
              this.setCharSpacing(args[0]);
              break;
            case OPS.setWordSpacing:
              this.setWordSpacing(args[0]);
              break;
            case OPS.setHScale:
              this.setHScale(args[0]);
              break;
            case OPS.setTextMatrix:
              this.setTextMatrix(args[0], args[1], args[2],
                  args[3], args[4], args[5]);
              break;
            case OPS.setLineWidth:
              this.setLineWidth(args[0]);
              break;
            case OPS.setLineJoin:
              this.setLineJoin(args[0]);
              break;
            case OPS.setLineCap:
              this.setLineCap(args[0]);
              break;
            case OPS.setMiterLimit:
              this.setMiterLimit(args[0]);
              break;
            case OPS.setFillRGBColor:
              this.setFillRGBColor(args[0], args[1], args[2]);
              break;
            case OPS.setStrokeRGBColor:
              this.setStrokeRGBColor(args[0], args[1], args[2]);
              break;
            case OPS.setDash:
              this.setDash(args[0], args[1]);
              break;
            case OPS.setGState:
              this.setGState(args[0]);
              break;
            case OPS.fill:
              this.fill();
              break;
            case OPS.eoFill:
              this.eoFill();
              break;
            case OPS.stroke:
              this.stroke();
              break;
            case OPS.fillStroke:
              this.fillStroke();
              break;
            case OPS.eoFillStroke:
              this.eoFillStroke();
              break;
            case OPS.clip:
              this.clip('nonzero');
              break;
            case OPS.eoClip:
              this.clip('evenodd');
              break;
            case OPS.paintSolidColorImageMask:
              this.paintSolidColorImageMask();
              break;
            case OPS.paintJpegXObject:
              this.paintJpegXObject(args[0], args[1], args[2]);
              break;
            case OPS.paintImageXObject:
              this.paintImageXObject(args[0]);
              break;
            case OPS.paintInlineImageXObject:
              this.paintInlineImageXObject(args[0]);
              break;
            case OPS.paintImageMaskXObject:
              this.paintImageMaskXObject(args[0]);
              break;
            case OPS.paintFormXObjectBegin:
              this.paintFormXObjectBegin(args[0], args[1]);
              break;
            case OPS.paintFormXObjectEnd:
              this.paintFormXObjectEnd();
              break;
            case OPS.closePath:
              this.closePath();
              break;
            case OPS.closeStroke:
              this.closeStroke();
              break;
            case OPS.closeFillStroke:
              this.closeFillStroke();
              break;
            case OPS.nextLine:
              this.nextLine();
              break;
            case OPS.transform:
              this.transform(args[0], args[1], args[2], args[3],
                  args[4], args[5]);
              break;
            case OPS.constructPath:
              this.constructPath(args[0], args[1]);
              break;
            case OPS.endPath:
              this.endPath();
              break;
            case 92:
              this.group(opTree[x].items);
              break;
            default:
              warn(`Unimplemented method ${fn}`);
              break;
          }
        }
      },

      setWordSpacing: function SVGGraphics_setWordSpacing(wordSpacing) {
        this.current.wordSpacing = wordSpacing;
      },

      setCharSpacing: function SVGGraphics_setCharSpacing(charSpacing) {
        this.current.charSpacing = charSpacing;
      },

      nextLine: function SVGGraphics_nextLine() {
        this.moveText(0, this.current.leading);
      },

      setTextMatrix: function SVGGraphics_setTextMatrix(a, b, c, d, e, f) {
        const current = this.current;
        this.current.textMatrix = this.current.lineMatrix = [a, b, c, d, e, f];

        this.current.x = this.current.lineX = 0;
        this.current.y = this.current.lineY = 0;

        current.xcoords = [];
        current.tspan = document.createElementNS(NS, 'svg:tspan');
        current.tspan.setAttributeNS(null, 'font-family', current.fontFamily);
        current.tspan.setAttributeNS(null, 'font-size',
            `${pf(current.fontSize)}px`);
        current.tspan.setAttributeNS(null, 'y', pf(-current.y));

        current.txtElement = document.createElementNS(NS, 'svg:text');
        current.txtElement.appendChild(current.tspan);
      },

      beginText: function SVGGraphics_beginText() {
        this.current.x = this.current.lineX = 0;
        this.current.y = this.current.lineY = 0;
        this.current.textMatrix = IDENTITY_MATRIX;
        this.current.lineMatrix = IDENTITY_MATRIX;
        this.current.tspan = document.createElementNS(NS, 'svg:tspan');
        this.current.txtElement = document.createElementNS(NS, 'svg:text');
        this.current.txtgrp = document.createElementNS(NS, 'svg:g');
        this.current.xcoords = [];
      },

      moveText: function SVGGraphics_moveText(x, y) {
        const current = this.current;
        this.current.x = this.current.lineX += x;
        this.current.y = this.current.lineY += y;

        current.xcoords = [];
        current.tspan = document.createElementNS(NS, 'svg:tspan');
        current.tspan.setAttributeNS(null, 'font-family', current.fontFamily);
        current.tspan.setAttributeNS(null, 'font-size',
            `${pf(current.fontSize)}px`);
        current.tspan.setAttributeNS(null, 'y', pf(-current.y));
      },

      showText: function SVGGraphics_showText(glyphs) {
        const current = this.current;
        const font = current.font;
        const fontSize = current.fontSize;

        if (fontSize === 0) {
          return;
        }

        const charSpacing = current.charSpacing;
        const wordSpacing = current.wordSpacing;
        const fontDirection = current.fontDirection;
        const textHScale = current.textHScale * fontDirection;
        const glyphsLength = glyphs.length;
        const vertical = font.vertical;
        const widthAdvanceScale = fontSize * current.fontMatrix[0];

        let x = 0; let
          i;
        for (i = 0; i < glyphsLength; ++i) {
          const glyph = glyphs[i];
          if (glyph === null) {
          // word break
            x += fontDirection * wordSpacing;
            continue;
          } else if (isNum(glyph)) {
            x += -glyph * fontSize * 0.001;
            continue;
          }
          current.xcoords.push(current.x + x * textHScale);

          const width = glyph.width;
          const character = glyph.fontChar;
          const charWidth = width * widthAdvanceScale + charSpacing * fontDirection;
          x += charWidth;

          current.tspan.textContent += character;
        }
        if (vertical) {
          current.y -= x * textHScale;
        } else {
          current.x += x * textHScale;
        }

        current.tspan.setAttributeNS(null, 'x',
            current.xcoords.map(pf).join(' '));
        current.tspan.setAttributeNS(null, 'y', pf(-current.y));
        current.tspan.setAttributeNS(null, 'font-family', current.fontFamily);
        current.tspan.setAttributeNS(null, 'font-size',
            `${pf(current.fontSize)}px`);
        if (current.fontStyle !== SVG_DEFAULTS.fontStyle) {
          current.tspan.setAttributeNS(null, 'font-style', current.fontStyle);
        }
        if (current.fontWeight !== SVG_DEFAULTS.fontWeight) {
          current.tspan.setAttributeNS(null, 'font-weight', current.fontWeight);
        }
        if (current.fillColor !== SVG_DEFAULTS.fillColor) {
          current.tspan.setAttributeNS(null, 'fill', current.fillColor);
        }

        current.txtElement.setAttributeNS(null, 'transform',
            `${pm(current.textMatrix)
            } scale(1, -1)`);
        current.txtElement.setAttributeNS(XML_NS, 'xml:space', 'preserve');
        current.txtElement.appendChild(current.tspan);
        current.txtgrp.appendChild(current.txtElement);

        this.tgrp.appendChild(current.txtElement);
      },

      setLeadingMoveText: function SVGGraphics_setLeadingMoveText(x, y) {
        this.setLeading(-y);
        this.moveText(x, y);
      },

      addFontStyle: function SVGGraphics_addFontStyle(fontObj) {
        if (!this.cssStyle) {
          this.cssStyle = document.createElementNS(NS, 'svg:style');
          this.cssStyle.setAttributeNS(null, 'type', 'text/css');
          this.defs.appendChild(this.cssStyle);
        }

        const url = PDFJS.createObjectURL(fontObj.data, fontObj.mimetype);
        this.cssStyle.textContent +=
        `@font-face { font-family: "${fontObj.loadedName}";` +
        ` src: url(${url}); }\n`;
      },

      setFont: function SVGGraphics_setFont(details) {
        const current = this.current;
        const fontObj = this.commonObjs.get(details[0]);
        let size = details[1];
        this.current.font = fontObj;

        if (this.embedFonts && fontObj.data &&
          !this.embeddedFonts[fontObj.loadedName]) {
          this.addFontStyle(fontObj);
          this.embeddedFonts[fontObj.loadedName] = fontObj;
        }

        current.fontMatrix = (fontObj.fontMatrix
          ? fontObj.fontMatrix : FONT_IDENTITY_MATRIX);

        const bold = fontObj.black ? (fontObj.bold ? 'bolder' : 'bold')
          : (fontObj.bold ? 'bold' : 'normal');
        const italic = fontObj.italic ? 'italic' : 'normal';

        if (size < 0) {
          size = -size;
          current.fontDirection = -1;
        } else {
          current.fontDirection = 1;
        }
        current.fontSize = size;
        current.fontFamily = fontObj.loadedName;
        current.fontWeight = bold;
        current.fontStyle = italic;

        current.tspan = document.createElementNS(NS, 'svg:tspan');
        current.tspan.setAttributeNS(null, 'y', pf(-current.y));
        current.xcoords = [];
      },

      endText: function SVGGraphics_endText() {
        if (this.current.pendingClip) {
          this.cgrp.appendChild(this.tgrp);
          this.pgrp.appendChild(this.cgrp);
        } else {
          this.pgrp.appendChild(this.tgrp);
        }
        this.tgrp = document.createElementNS(NS, 'svg:g');
        this.tgrp.setAttributeNS(null, 'transform', pm(this.transformMatrix));
      },

      // Path properties
      setLineWidth: function SVGGraphics_setLineWidth(width) {
        this.current.lineWidth = width;
      },
      setLineCap: function SVGGraphics_setLineCap(style) {
        this.current.lineCap = LINE_CAP_STYLES[style];
      },
      setLineJoin: function SVGGraphics_setLineJoin(style) {
        this.current.lineJoin = LINE_JOIN_STYLES[style];
      },
      setMiterLimit: function SVGGraphics_setMiterLimit(limit) {
        this.current.miterLimit = limit;
      },
      setStrokeRGBColor: function SVGGraphics_setStrokeRGBColor(r, g, b) {
        const color = Util.makeCssRgb(r, g, b);
        this.current.strokeColor = color;
      },
      setFillRGBColor: function SVGGraphics_setFillRGBColor(r, g, b) {
        const color = Util.makeCssRgb(r, g, b);
        this.current.fillColor = color;
        this.current.tspan = document.createElementNS(NS, 'svg:tspan');
        this.current.xcoords = [];
      },
      setDash: function SVGGraphics_setDash(dashArray, dashPhase) {
        this.current.dashArray = dashArray;
        this.current.dashPhase = dashPhase;
      },

      constructPath: function SVGGraphics_constructPath(ops, args) {
        const current = this.current;
        let x = current.x; let
          y = current.y;
        current.path = document.createElementNS(NS, 'svg:path');
        const d = [];
        const opLength = ops.length;

        for (let i = 0, j = 0; i < opLength; i++) {
          switch (ops[i] | 0) {
            case OPS.rectangle:
              x = args[j++];
              y = args[j++];
              var width = args[j++];
              var height = args[j++];
              var xw = x + width;
              var yh = y + height;
              d.push('M', pf(x), pf(y), 'L', pf(xw), pf(y), 'L', pf(xw), pf(yh),
                  'L', pf(x), pf(yh), 'Z');
              break;
            case OPS.moveTo:
              x = args[j++];
              y = args[j++];
              d.push('M', pf(x), pf(y));
              break;
            case OPS.lineTo:
              x = args[j++];
              y = args[j++];
              d.push('L', pf(x), pf(y));
              break;
            case OPS.curveTo:
              x = args[j + 4];
              y = args[j + 5];
              d.push('C', pf(args[j]), pf(args[j + 1]), pf(args[j + 2]),
                  pf(args[j + 3]), pf(x), pf(y));
              j += 6;
              break;
            case OPS.curveTo2:
              x = args[j + 2];
              y = args[j + 3];
              d.push('C', pf(x), pf(y), pf(args[j]), pf(args[j + 1]),
                  pf(args[j + 2]), pf(args[j + 3]));
              j += 4;
              break;
            case OPS.curveTo3:
              x = args[j + 2];
              y = args[j + 3];
              d.push('C', pf(args[j]), pf(args[j + 1]), pf(x), pf(y),
                  pf(x), pf(y));
              j += 4;
              break;
            case OPS.closePath:
              d.push('Z');
              break;
          }
        }
        current.path.setAttributeNS(null, 'd', d.join(' '));
        current.path.setAttributeNS(null, 'stroke-miterlimit',
            pf(current.miterLimit));
        current.path.setAttributeNS(null, 'stroke-linecap', current.lineCap);
        current.path.setAttributeNS(null, 'stroke-linejoin', current.lineJoin);
        current.path.setAttributeNS(null, 'stroke-width',
            `${pf(current.lineWidth)}px`);
        current.path.setAttributeNS(null, 'stroke-dasharray',
            current.dashArray.map(pf).join(' '));
        current.path.setAttributeNS(null, 'stroke-dashoffset',
            `${pf(current.dashPhase)}px`);
        current.path.setAttributeNS(null, 'fill', 'none');

        this.tgrp.appendChild(current.path);
        if (current.pendingClip) {
          this.cgrp.appendChild(this.tgrp);
          this.pgrp.appendChild(this.cgrp);
        } else {
          this.pgrp.appendChild(this.tgrp);
        }
        // Saving a reference in current.element so that it can be addressed
        // in 'fill' and 'stroke'
        current.element = current.path;
        current.setCurrentPoint(x, y);
      },

      endPath: function SVGGraphics_endPath() {
        const current = this.current;
        if (current.pendingClip) {
          this.cgrp.appendChild(this.tgrp);
          this.pgrp.appendChild(this.cgrp);
        } else {
          this.pgrp.appendChild(this.tgrp);
        }
        this.tgrp = document.createElementNS(NS, 'svg:g');
        this.tgrp.setAttributeNS(null, 'transform', pm(this.transformMatrix));
      },

      clip: function SVGGraphics_clip(type) {
        const current = this.current;
        // Add current path to clipping path
        current.clipId = `clippath${clipCount}`;
        clipCount++;
        this.clippath = document.createElementNS(NS, 'svg:clipPath');
        this.clippath.setAttributeNS(null, 'id', current.clipId);
        const clipElement = current.element.cloneNode();
        if (type === 'evenodd') {
          clipElement.setAttributeNS(null, 'clip-rule', 'evenodd');
        } else {
          clipElement.setAttributeNS(null, 'clip-rule', 'nonzero');
        }
        this.clippath.setAttributeNS(null, 'transform', pm(this.transformMatrix));
        this.clippath.appendChild(clipElement);
        this.defs.appendChild(this.clippath);

        // Create a new group with that attribute
        current.pendingClip = true;
        this.cgrp = document.createElementNS(NS, 'svg:g');
        this.cgrp.setAttributeNS(null, 'clip-path',
            `url(#${current.clipId})`);
        this.pgrp.appendChild(this.cgrp);
      },

      closePath: function SVGGraphics_closePath() {
        const current = this.current;
        let d = current.path.getAttributeNS(null, 'd');
        d += 'Z';
        current.path.setAttributeNS(null, 'd', d);
      },

      setLeading: function SVGGraphics_setLeading(leading) {
        this.current.leading = -leading;
      },

      setTextRise: function SVGGraphics_setTextRise(textRise) {
        this.current.textRise = textRise;
      },

      setHScale: function SVGGraphics_setHScale(scale) {
        this.current.textHScale = scale / 100;
      },

      setGState: function SVGGraphics_setGState(states) {
        for (let i = 0, ii = states.length; i < ii; i++) {
          const state = states[i];
          const key = state[0];
          const value = state[1];

          switch (key) {
            case 'LW':
              this.setLineWidth(value);
              break;
            case 'LC':
              this.setLineCap(value);
              break;
            case 'LJ':
              this.setLineJoin(value);
              break;
            case 'ML':
              this.setMiterLimit(value);
              break;
            case 'D':
              this.setDash(value[0], value[1]);
              break;
            case 'RI':
              break;
            case 'FL':
              break;
            case 'Font':
              this.setFont(value);
              break;
            case 'CA':
              break;
            case 'ca':
              break;
            case 'BM':
              break;
            case 'SMask':
              break;
          }
        }
      },

      fill: function SVGGraphics_fill() {
        const current = this.current;
        current.element.setAttributeNS(null, 'fill', current.fillColor);
      },

      stroke: function SVGGraphics_stroke() {
        const current = this.current;
        current.element.setAttributeNS(null, 'stroke', current.strokeColor);
        current.element.setAttributeNS(null, 'fill', 'none');
      },

      eoFill: function SVGGraphics_eoFill() {
        const current = this.current;
        current.element.setAttributeNS(null, 'fill', current.fillColor);
        current.element.setAttributeNS(null, 'fill-rule', 'evenodd');
      },

      fillStroke: function SVGGraphics_fillStroke() {
      // Order is important since stroke wants fill to be none.
      // First stroke, then if fill needed, it will be overwritten.
        this.stroke();
        this.fill();
      },

      eoFillStroke: function SVGGraphics_eoFillStroke() {
        this.current.element.setAttributeNS(null, 'fill-rule', 'evenodd');
        this.fillStroke();
      },

      closeStroke: function SVGGraphics_closeStroke() {
        this.closePath();
        this.stroke();
      },

      closeFillStroke: function SVGGraphics_closeFillStroke() {
        this.closePath();
        this.fillStroke();
      },

      paintSolidColorImageMask:
        function SVGGraphics_paintSolidColorImageMask() {
          const current = this.current;
          const rect = document.createElementNS(NS, 'svg:rect');
          rect.setAttributeNS(null, 'x', '0');
          rect.setAttributeNS(null, 'y', '0');
          rect.setAttributeNS(null, 'width', '1px');
          rect.setAttributeNS(null, 'height', '1px');
          rect.setAttributeNS(null, 'fill', current.fillColor);
          this.tgrp.appendChild(rect);
        },

      paintJpegXObject: function SVGGraphics_paintJpegXObject(objId, w, h) {
        const current = this.current;
        const imgObj = this.objs.get(objId);
        const imgEl = document.createElementNS(NS, 'svg:image');
        imgEl.setAttributeNS(XLINK_NS, 'xlink:href', imgObj.src);
        imgEl.setAttributeNS(null, 'width', `${imgObj.width}px`);
        imgEl.setAttributeNS(null, 'height', `${imgObj.height}px`);
        imgEl.setAttributeNS(null, 'x', '0');
        imgEl.setAttributeNS(null, 'y', pf(-h));
        imgEl.setAttributeNS(null, 'transform',
            `scale(${pf(1 / w)} ${pf(-1 / h)})`);

        this.tgrp.appendChild(imgEl);
        if (current.pendingClip) {
          this.cgrp.appendChild(this.tgrp);
          this.pgrp.appendChild(this.cgrp);
        } else {
          this.pgrp.appendChild(this.tgrp);
        }
      },

      paintImageXObject: function SVGGraphics_paintImageXObject(objId) {
        const imgData = this.objs.get(objId);
        if (!imgData) {
          warn('Dependent image isn\'t ready yet');
          return;
        }
        this.paintInlineImageXObject(imgData);
      },

      paintInlineImageXObject:
        function SVGGraphics_paintInlineImageXObject(imgData, mask) {
          const current = this.current;
          const width = imgData.width;
          const height = imgData.height;

          const imgSrc = convertImgDataToPng(imgData);
          const cliprect = document.createElementNS(NS, 'svg:rect');
          cliprect.setAttributeNS(null, 'x', '0');
          cliprect.setAttributeNS(null, 'y', '0');
          cliprect.setAttributeNS(null, 'width', pf(width));
          cliprect.setAttributeNS(null, 'height', pf(height));
          current.element = cliprect;
          this.clip('nonzero');
          const imgEl = document.createElementNS(NS, 'svg:image');
          imgEl.setAttributeNS(XLINK_NS, 'xlink:href', imgSrc);
          imgEl.setAttributeNS(null, 'x', '0');
          imgEl.setAttributeNS(null, 'y', pf(-height));
          imgEl.setAttributeNS(null, 'width', `${pf(width)}px`);
          imgEl.setAttributeNS(null, 'height', `${pf(height)}px`);
          imgEl.setAttributeNS(null, 'transform',
              `scale(${pf(1 / width)} ${
                pf(-1 / height)})`);
          if (mask) {
            mask.appendChild(imgEl);
          } else {
            this.tgrp.appendChild(imgEl);
          }
          if (current.pendingClip) {
            this.cgrp.appendChild(this.tgrp);
            this.pgrp.appendChild(this.cgrp);
          } else {
            this.pgrp.appendChild(this.tgrp);
          }
        },

      paintImageMaskXObject:
        function SVGGraphics_paintImageMaskXObject(imgData) {
          const current = this.current;
          const width = imgData.width;
          const height = imgData.height;
          const fillColor = current.fillColor;

          current.maskId = `mask${maskCount++}`;
          const mask = document.createElementNS(NS, 'svg:mask');
          mask.setAttributeNS(null, 'id', current.maskId);

          const rect = document.createElementNS(NS, 'svg:rect');
          rect.setAttributeNS(null, 'x', '0');
          rect.setAttributeNS(null, 'y', '0');
          rect.setAttributeNS(null, 'width', pf(width));
          rect.setAttributeNS(null, 'height', pf(height));
          rect.setAttributeNS(null, 'fill', fillColor);
          rect.setAttributeNS(null, 'mask', `url(#${current.maskId})`);
          this.defs.appendChild(mask);
          this.tgrp.appendChild(rect);

          this.paintInlineImageXObject(imgData, mask);
        },

      paintFormXObjectBegin:
        function SVGGraphics_paintFormXObjectBegin(matrix, bbox) {
          this.save();

          if (isArray(matrix) && matrix.length === 6) {
            this.transform(matrix[0], matrix[1], matrix[2],
                matrix[3], matrix[4], matrix[5]);
          }

          if (isArray(bbox) && bbox.length === 4) {
            const width = bbox[2] - bbox[0];
            const height = bbox[3] - bbox[1];

            const cliprect = document.createElementNS(NS, 'svg:rect');
            cliprect.setAttributeNS(null, 'x', bbox[0]);
            cliprect.setAttributeNS(null, 'y', bbox[1]);
            cliprect.setAttributeNS(null, 'width', pf(width));
            cliprect.setAttributeNS(null, 'height', pf(height));
            this.current.element = cliprect;
            this.clip('nonzero');
            this.endPath();
          }
        },

      paintFormXObjectEnd:
        function SVGGraphics_paintFormXObjectEnd() {
          this.restore();
        },
    };
    return SVGGraphics;
  })();

  PDFJS.SVGGraphics = SVGGraphics;
}).call((typeof window === 'undefined') ? this : window);

if (!PDFJS.workerSrc && typeof document !== 'undefined') {
  // workerSrc is not set -- using last script url to define default location
  PDFJS.workerSrc = (function () {
    'use strict';
    const pdfJsSrc = document.currentScript.src;
    return pdfJsSrc && pdfJsSrc.replace(/\.js$/i, '.worker.js');
  })();
}
