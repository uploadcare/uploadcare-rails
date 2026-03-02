// Uploadcare File Uploader initialization
// See https://uploadcare.com/docs/file-uploader/ for more info

import * as UC from "@uploadcare/file-uploader";

UC.defineComponents(UC);

// Here you can customize uploadcare behavior if needed
// function initUploadcare() {
//   document.querySelectorAll("uc-upload-ctx-provider").forEach((ctxProvider) => {
//     ctxProvider.addEventListener("change", (e) => {
//       // Do something
//     });
//   });
// }

// // Initialize on page load
// document.addEventListener("DOMContentLoaded", initUploadcare);

// // Re-initialize on Turbo navigation (Rails 7+)
// document.addEventListener("turbo:load", initUploadcare);
// document.addEventListener("turbo:render", initUploadcare);

// // Re-initialize on Turbolinks navigation (Rails 6)
// document.addEventListener("turbolinks:load", initUploadcare);
