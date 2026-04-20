import sanitizeHtml from 'sanitize-html';

const testInputs = [
    "Price < 5000",
    "Price > 1000",
    "Hello <script>alert('XSS')</script> World",
    "<img src=x onerror=alert(1)>",
    "Normal text & special chars: @#$%^&*()_+",
    "Price < 5000 <script>alert(1)</script>"
];

console.log("Testing Sanitization:");
console.log("---------------------");

testInputs.forEach(input => {
    const cleaned = sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: {},
    });
    console.log(`Input:   "${input}"`);
    console.log(`Cleaned: "${cleaned}"`);
    console.log("---------------------");
});
