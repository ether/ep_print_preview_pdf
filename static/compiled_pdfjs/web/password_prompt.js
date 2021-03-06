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
/* globals PDFJS, mozL10n, OverlayManager */

'use strict';

const PasswordPrompt = {
  overlayName: null,
  updatePassword: null,
  reason: null,
  passwordField: null,
  passwordText: null,
  passwordSubmit: null,
  passwordCancel: null,

  initialize: function secondaryToolbarInitialize(options) {
    this.overlayName = options.overlayName;
    this.passwordField = options.passwordField;
    this.passwordText = options.passwordText;
    this.passwordSubmit = options.passwordSubmit;
    this.passwordCancel = options.passwordCancel;

    // Attach the event listeners.
    this.passwordSubmit.addEventListener('click',
        this.verifyPassword.bind(this));

    this.passwordCancel.addEventListener('click', this.close.bind(this));

    this.passwordField.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) { // Enter key
        this.verifyPassword();
      }
    });

    OverlayManager.register(this.overlayName, this.close.bind(this), true);
  },

  open: function passwordPromptOpen() {
    OverlayManager.open(this.overlayName).then(() => {
      this.passwordField.focus();

      let promptString = mozL10n.get('password_label', null,
          'Enter the password to open this PDF file.');

      if (this.reason === PDFJS.PasswordResponses.INCORRECT_PASSWORD) {
        promptString = mozL10n.get('password_invalid', null,
            'Invalid password. Please try again.');
      }

      this.passwordText.textContent = promptString;
    });
  },

  close: function passwordPromptClose() {
    OverlayManager.close(this.overlayName).then(() => {
      this.passwordField.value = '';
    });
  },

  verifyPassword: function passwordPromptVerifyPassword() {
    const password = this.passwordField.value;
    if (password && password.length > 0) {
      this.close();
      return this.updatePassword(password);
    }
  },
};
