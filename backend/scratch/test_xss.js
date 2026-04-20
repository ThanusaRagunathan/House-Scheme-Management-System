import xss from 'xss';
import sanitizeHtml from 'sanitize-html';

const input = "Price < 5000 <script>alert(1)</script>";

console.log("Input:", input);
console.log("xss output:", xss(input));
try {
    console.log("sanitize-html output:", sanitizeHtml(input));
} catch (e) {
    console.log("sanitize-html not installed");
}
