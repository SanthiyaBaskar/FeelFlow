// Get DOM elements
const urlInput = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const result = document.getElementById('result');
const shortLink = document.getElementById('shortLink');
const originalUrl = document.getElementById('originalUrl');
const copyBtn = document.getElementById('copyBtn');

// API endpoint for URL shortening
const API_URL = 'https://api.shrtco.de/v2/shorten?url=';

/**
 * Validates if the provided URL is valid
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidURL(url) {
    try {
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        // Create URL object to validate
        const urlObj = new URL(url);
        
        // Check if it has a valid domain
        return urlObj.hostname.includes('.');
    } catch (error) {
        return false;
    }
}

/**
 * Shows error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    result.classList.add('hidden');
}

/**
 * Hides error message
 */
function hideError() {
    errorMessage.classList.add('hidden');
}

/**
 * Shows loading state
 */
function showLoading() {
    loading.classList.remove('hidden');
    shortenBtn.disabled = true;
    shortenBtn.textContent = 'Shortening...';
}

/**
 * Hides loading state
 */
function hideLoading() {
    loading.classList.add('hidden');
    shortenBtn.disabled = false;
    shortenBtn.textContent = 'Shorten';
}

/**
 * Displays the shortened URL result
 * @param {string} originalURL - The original long URL
 * @param {string} shortURL - The shortened URL
 */
function showResult(originalURL, shortURL) {
    // Set the shortened link
    shortLink.href = shortURL;
    shortLink.textContent = shortURL;
    
    // Set the original URL
    originalUrl.textContent = originalURL;
    
    // Show result section
    result.classList.remove('hidden');
    
    // Reset copy button
    copyBtn.textContent = 'Copy';
    copyBtn.classList.remove('copied');
}

/**
 * Shortens the URL using the API
 * @param {string} url - The URL to shorten
 */
async function shortenURL(url) {
    try {
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        // Make API request
        const response = await fetch(API_URL + encodeURIComponent(url));
        const data = await response.json();
        
        // Check if API returned success
        if (data.ok && data.result && data.result.short_link) {
            showResult(url, data.result.short_link);
            hideError();
        } else {
            // Handle API errors
            const errorMsg = data.error || 'Failed to shorten URL. Please try again.';
            showError(errorMsg);
        }
    } catch (error) {
        console.error('Error shortening URL:', error);
        showError('Network error. Please check your connection and try again.');
    } finally {
        hideLoading();
    }
}

/**
 * Handles the shorten button click
 */
function handleShortenClick() {
    const url = urlInput.value.trim();
    
    // Validate input
    if (!url) {
        showError('Please enter a URL to shorten.');
        return;
    }
    
    if (!isValidURL(url)) {
        showError('Please enter a valid URL (e.g., https://example.com or example.com).');
        return;
    }
    
    // Start shortening process
    hideError();
    showLoading();
    shortenURL(url);
}

/**
 * Copies the shortened URL to clipboard
 */
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(shortLink.href);
        
        // Update button to show success
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
        
        // Fallback for older browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = shortLink.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (fallbackError) {
            showError('Failed to copy to clipboard. Please copy manually.');
        }
    }
}

// Event listeners
shortenBtn.addEventListener('click', handleShortenClick);
copyBtn.addEventListener('click', copyToClipboard);

// Allow Enter key to trigger shortening
urlInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleShortenClick();
    }
});

// Clear error when user starts typing
urlInput.addEventListener('input', () => {
    if (!errorMessage.classList.contains('hidden')) {
        hideError();
    }
});

// Auto-focus on the input field when page loads
window.addEventListener('load', () => {
    urlInput.focus();
});