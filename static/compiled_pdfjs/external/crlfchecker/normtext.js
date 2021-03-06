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
/* jshint node:true */

'use strict';

const fs = require('fs');

function normalizeText(s) {
  return s.replace(/\r\n?/g, '\n').replace(/\uFEFF/g, '');
}

const args = process.argv.slice(2);

args.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  content = normalizeText(content);
  fs.writeFileSync(file, content, 'utf8');
});
