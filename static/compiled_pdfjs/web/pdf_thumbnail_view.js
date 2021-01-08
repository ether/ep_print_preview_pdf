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
/* globals mozL10n, RenderingStates, Promise, getOutputScale */

'use strict';

const THUMBNAIL_WIDTH = 98; // px
const THUMBNAIL_CANVAS_BORDER_WIDTH = 1; // px

/**
 * @typedef {Object} PDFThumbnailViewOptions
 * @property {HTMLDivElement} container - The viewer element.
 * @property {number} id - The thumbnail's unique ID (normally its number).
 * @property {PageViewport} defaultViewport - The page viewport.
 * @property {IPDFLinkService} linkService - The navigation/linking service.
 * @property {PDFRenderingQueue} renderingQueue - The rendering queue object.
 */

/**
 * @class
 * @implements {IRenderableView}
 */
const PDFThumbnailView = (function PDFThumbnailViewClosure() {
  function getTempCanvas(width, height) {
    let tempCanvas = PDFThumbnailView.tempImageCache;
    if (!tempCanvas) {
      tempCanvas = document.createElement('canvas');
      PDFThumbnailView.tempImageCache = tempCanvas;
    }
    tempCanvas.width = width;
    tempCanvas.height = height;

    // Since this is a temporary canvas, we need to fill the canvas with a white
    // background ourselves. |_getPageDrawContext| uses CSS rules for this.
    // #if MOZCENTRAL || FIREFOX || GENERIC
    tempCanvas.mozOpaque = true;
    // #endif
    const ctx = tempCanvas.getContext('2d', {alpha: false});
    ctx.save();
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
    return tempCanvas;
  }

  /**
   * @constructs PDFThumbnailView
   * @param {PDFThumbnailViewOptions} options
   */
  function PDFThumbnailView(options) {
    const container = options.container;
    const id = options.id;
    const defaultViewport = options.defaultViewport;
    const linkService = options.linkService;
    const renderingQueue = options.renderingQueue;

    this.id = id;
    this.renderingId = `thumbnail${id}`;

    this.pdfPage = null;
    this.rotation = 0;
    this.viewport = defaultViewport;
    this.pdfPageRotate = defaultViewport.rotation;

    this.linkService = linkService;
    this.renderingQueue = renderingQueue;

    this.hasImage = false;
    this.resume = null;
    this.renderingState = RenderingStates.INITIAL;

    this.pageWidth = this.viewport.width;
    this.pageHeight = this.viewport.height;
    this.pageRatio = this.pageWidth / this.pageHeight;

    this.canvasWidth = THUMBNAIL_WIDTH;
    this.canvasHeight = (this.canvasWidth / this.pageRatio) | 0;
    this.scale = this.canvasWidth / this.pageWidth;

    const anchor = document.createElement('a');
    anchor.href = linkService.getAnchorUrl(`#page=${id}`);
    anchor.title = mozL10n.get('thumb_page_title', {page: id}, 'Page {{page}}');
    anchor.onclick = function stopNavigation() {
      linkService.page = id;
      return false;
    };

    const div = document.createElement('div');
    div.id = `thumbnailContainer${id}`;
    div.className = 'thumbnail';
    this.div = div;

    if (id === 1) {
      // Highlight the thumbnail of the first page when no page number is
      // specified (or exists in cache) when the document is loaded.
      div.classList.add('selected');
    }

    const ring = document.createElement('div');
    ring.className = 'thumbnailSelectionRing';
    const borderAdjustment = 2 * THUMBNAIL_CANVAS_BORDER_WIDTH;
    ring.style.width = `${this.canvasWidth + borderAdjustment}px`;
    ring.style.height = `${this.canvasHeight + borderAdjustment}px`;
    this.ring = ring;

    div.appendChild(ring);
    anchor.appendChild(div);
    container.appendChild(anchor);
  }

  PDFThumbnailView.prototype = {
    setPdfPage: function PDFThumbnailView_setPdfPage(pdfPage) {
      this.pdfPage = pdfPage;
      this.pdfPageRotate = pdfPage.rotate;
      const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
      this.viewport = pdfPage.getViewport(1, totalRotation);
      this.reset();
    },

    reset: function PDFThumbnailView_reset() {
      if (this.renderTask) {
        this.renderTask.cancel();
      }
      this.hasImage = false;
      this.resume = null;
      this.renderingState = RenderingStates.INITIAL;

      this.pageWidth = this.viewport.width;
      this.pageHeight = this.viewport.height;
      this.pageRatio = this.pageWidth / this.pageHeight;

      this.canvasHeight = (this.canvasWidth / this.pageRatio) | 0;
      this.scale = (this.canvasWidth / this.pageWidth);

      this.div.removeAttribute('data-loaded');
      const ring = this.ring;
      const childNodes = ring.childNodes;
      for (let i = childNodes.length - 1; i >= 0; i--) {
        ring.removeChild(childNodes[i]);
      }
      const borderAdjustment = 2 * THUMBNAIL_CANVAS_BORDER_WIDTH;
      ring.style.width = `${this.canvasWidth + borderAdjustment}px`;
      ring.style.height = `${this.canvasHeight + borderAdjustment}px`;

      if (this.canvas) {
        // Zeroing the width and height causes Firefox to release graphics
        // resources immediately, which can greatly reduce memory consumption.
        this.canvas.width = 0;
        this.canvas.height = 0;
        delete this.canvas;
      }
      if (this.image) {
        this.image.removeAttribute('src');
        delete this.image;
      }
    },

    update: function PDFThumbnailView_update(rotation) {
      if (typeof rotation !== 'undefined') {
        this.rotation = rotation;
      }
      const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
      this.viewport = this.viewport.clone({
        scale: 1,
        rotation: totalRotation,
      });
      this.reset();
    },

    /**
     * @private
     */
    _getPageDrawContext:
        function PDFThumbnailView_getPageDrawContext(noCtxScale) {
          const canvas = document.createElement('canvas');
          this.canvas = canvas;

          // #if MOZCENTRAL || FIREFOX || GENERIC
          canvas.mozOpaque = true;
          // #endif
          const ctx = canvas.getContext('2d', {alpha: false});
          const outputScale = getOutputScale(ctx);

          canvas.width = (this.canvasWidth * outputScale.sx) | 0;
          canvas.height = (this.canvasHeight * outputScale.sy) | 0;
          canvas.style.width = `${this.canvasWidth}px`;
          canvas.style.height = `${this.canvasHeight}px`;

          if (!noCtxScale && outputScale.scaled) {
            ctx.scale(outputScale.sx, outputScale.sy);
          }

          const image = document.createElement('img');
          this.image = image;

          image.id = this.renderingId;
          image.className = 'thumbnailImage';
          image.setAttribute('aria-label', mozL10n.get('thumb_page_canvas',
              {page: this.id}, 'Thumbnail of Page {{page}}'));

          image.style.width = canvas.style.width;
          image.style.height = canvas.style.height;

          return ctx;
        },

    /**
     * @private
     */
    _convertCanvasToImage: function PDFThumbnailView_convertCanvasToImage() {
      if (!this.canvas) {
        return;
      }
      this.image.src = this.canvas.toDataURL();

      this.div.setAttribute('data-loaded', true);
      this.ring.appendChild(this.image);

      // Zeroing the width and height causes Firefox to release graphics
      // resources immediately, which can greatly reduce memory consumption.
      this.canvas.width = 0;
      this.canvas.height = 0;
      delete this.canvas;
    },

    draw: function PDFThumbnailView_draw() {
      if (this.renderingState !== RenderingStates.INITIAL) {
        console.error('Must be in new state before drawing');
      }
      if (this.hasImage) {
        return Promise.resolve(undefined);
      }
      this.hasImage = true;
      this.renderingState = RenderingStates.RUNNING;

      let resolveRenderPromise, rejectRenderPromise;
      const promise = new Promise((resolve, reject) => {
        resolveRenderPromise = resolve;
        rejectRenderPromise = reject;
      });

      const self = this;
      function thumbnailDrawCallback(error) {
        // The renderTask may have been replaced by a new one, so only remove
        // the reference to the renderTask if it matches the one that is
        // triggering this callback.
        if (renderTask === self.renderTask) {
          self.renderTask = null;
        }
        if (error === 'cancelled') {
          rejectRenderPromise(error);
          return;
        }
        self.renderingState = RenderingStates.FINISHED;
        self._convertCanvasToImage();

        if (!error) {
          resolveRenderPromise(undefined);
        } else {
          rejectRenderPromise(error);
        }
      }

      const ctx = this._getPageDrawContext();
      const drawViewport = this.viewport.clone({scale: this.scale});
      const renderContinueCallback = function renderContinueCallback(cont) {
        if (!self.renderingQueue.isHighestPriority(self)) {
          self.renderingState = RenderingStates.PAUSED;
          self.resume = function resumeCallback() {
            self.renderingState = RenderingStates.RUNNING;
            cont();
          };
          return;
        }
        cont();
      };

      const renderContext = {
        canvasContext: ctx,
        viewport: drawViewport,
      };
      var renderTask = this.renderTask = this.pdfPage.render(renderContext);
      renderTask.onContinue = renderContinueCallback;

      renderTask.promise.then(
          () => {
            thumbnailDrawCallback(null);
          },
          (error) => {
            thumbnailDrawCallback(error);
          }
      );
      return promise;
    },

    setImage: function PDFThumbnailView_setImage(pageView) {
      const img = pageView.canvas;
      if (this.hasImage || !img) {
        return;
      }
      if (!this.pdfPage) {
        this.setPdfPage(pageView.pdfPage);
      }
      this.hasImage = true;
      this.renderingState = RenderingStates.FINISHED;

      const ctx = this._getPageDrawContext(true);
      const canvas = ctx.canvas;

      if (img.width <= 2 * canvas.width) {
        ctx.drawImage(img, 0, 0, img.width, img.height,
            0, 0, canvas.width, canvas.height);
        this._convertCanvasToImage();
        return;
      }
      // drawImage does an awful job of rescaling the image, doing it gradually.
      const MAX_NUM_SCALING_STEPS = 3;
      let reducedWidth = canvas.width << MAX_NUM_SCALING_STEPS;
      let reducedHeight = canvas.height << MAX_NUM_SCALING_STEPS;
      const reducedImage = getTempCanvas(reducedWidth, reducedHeight);
      const reducedImageCtx = reducedImage.getContext('2d');

      while (reducedWidth > img.width || reducedHeight > img.height) {
        reducedWidth >>= 1;
        reducedHeight >>= 1;
      }
      reducedImageCtx.drawImage(img, 0, 0, img.width, img.height,
          0, 0, reducedWidth, reducedHeight);
      while (reducedWidth > 2 * canvas.width) {
        reducedImageCtx.drawImage(reducedImage,
            0, 0, reducedWidth, reducedHeight,
            0, 0, reducedWidth >> 1, reducedHeight >> 1);
        reducedWidth >>= 1;
        reducedHeight >>= 1;
      }
      ctx.drawImage(reducedImage, 0, 0, reducedWidth, reducedHeight,
          0, 0, canvas.width, canvas.height);
      this._convertCanvasToImage();
    },
  };

  return PDFThumbnailView;
})();

PDFThumbnailView.tempImageCache = null;
