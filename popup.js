/**
 * Popup Script
 * Handles UI interactions and event listeners
 */

// DOM Elements
const passwordInput = document.getElementById('passwordInput');
const copyBtn = document.getElementById('copyBtn');
const copyToast = document.getElementById('copyToast');
const regenerateBtn = document.getElementById('regenerateBtn');
const themeToggle = document.getElementById('themeToggle');

const lengthSlider = document.getElementById('lengthSlider');
const lengthInput = document.getElementById('lengthInput');

const uppercaseToggle = document.getElementById('uppercaseToggle');
const lowercaseToggle = document.getElementById('lowercaseToggle');
const numbersToggle = document.getElementById('numbersToggle');
const symbolsToggle = document.getElementById('symbolsToggle');

const strengthMeter = document.getElementById('strengthMeter');
const strengthText = document.getElementById('strengthText');
const entropyValue = document.getElementById('entropyValue');

// Settings storage key
const STORAGE_KEY = 'randomix_settings';

/**
 * Initialize the extension
 */
function init() {
    try {
        loadSettings();
        setupEventListeners();
    } catch (error) {
        console.error('Initialization error:', error);
        // Fallback: ensure basic functionality works
        generateNewPassword();
        updateLengthDisplay();
        setupEventListeners();
    }
}

/**
 * Load settings from chrome.storage.local
 */
function loadSettings() {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (result[STORAGE_KEY]) {
            const settings = result[STORAGE_KEY];
            lengthSlider.value = settings.length || 16;
            uppercaseToggle.checked = settings.uppercase !== false;
            lowercaseToggle.checked = settings.lowercase !== false;
            numbersToggle.checked = settings.numbers !== false;
            symbolsToggle.checked = settings.symbols !== false;

            // Check light mode preference (dark is now default)
            if (settings.lightMode) {
                document.body.classList.add('light-mode');
                updateThemeIcon();
            }
        } else {
            // No settings saved yet, use defaults
            updateLengthDisplay();
        }

        // Generate password after settings are loaded
        generateNewPassword();
        updateLengthDisplay();
    });
}

/**
 * Save settings to chrome.storage.local
 */
function saveSettings() {
    const settings = {
        length: parseInt(lengthSlider.value),
        uppercase: uppercaseToggle.checked,
        lowercase: lowercaseToggle.checked,
        numbers: numbersToggle.checked,
        symbols: symbolsToggle.checked,
        lightMode: document.body.classList.contains('light-mode')
    };
    chrome.storage.local.set({ [STORAGE_KEY]: settings });
}

/**
 * Get current character options
 */
function getOptions() {
    return {
        uppercase: uppercaseToggle.checked,
        lowercase: lowercaseToggle.checked,
        numbers: numbersToggle.checked,
        symbols: symbolsToggle.checked
    };
}

/**
 * Generate new password and update UI
 */
function generateNewPassword() {
    const length = parseInt(lengthSlider.value);
    const options = getOptions();

    // Ensure at least one option is selected
    if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
        lowercaseToggle.checked = true;
        regenerateBtn.disabled = false;
    }

    const password = passwordGenerator.generate(length, options);
    passwordInput.value = password;

    updateStrengthMeter();
    saveSettings();
}

/**
 * Update strength meter based on entropy
 */
function updateStrengthMeter() {
    const length = parseInt(lengthSlider.value);
    const options = getOptions();

    const entropy = passwordGenerator.calculateEntropy(length, options);
    const strength = passwordGenerator.calculateStrength(entropy);

    // Update strength meter
    strengthMeter.style.width = strength.percentage + '%';

    // Update strength text with color
    strengthText.textContent = strength.text;
    strengthText.className = 'strength-text ' + strength.level;

    // Update entropy value
    entropyValue.textContent = entropy;
}

/**
 * Update length display
 */
function updateLengthDisplay() {
    lengthInput.value = lengthSlider.value;
}

/**
 * Copy password to clipboard
 */
function copyToClipboard() {
    const password = passwordInput.value;

    if (!password) {
        return;
    }

    navigator.clipboard.writeText(password).then(() => {
        // Show toast notification
        copyToast.classList.add('show');

        // Hide toast after 2 seconds
        setTimeout(() => {
            copyToast.classList.remove('show');
        }, 2000);

        // Visual feedback on button
        const originalIcon = copyBtn.querySelector('.copy-icon');
        const originalIconText = originalIcon ? originalIcon.textContent : '📋';

        copyBtn.innerHTML = '<span class="copy-icon">✓</span>';
        copyBtn.style.backgroundColor = 'var(--success-color)';

        setTimeout(() => {
            copyBtn.innerHTML = '<span class="copy-icon">' + originalIconText + '</span>';
            copyBtn.style.backgroundColor = '';
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

/**
 * Toggle light/dark mode
 */
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    updateThemeIcon();
    saveSettings();
}

/**
 * Update theme toggle icon
 */
function updateThemeIcon() {
    const isLightMode = document.body.classList.contains('light-mode');
    const icon = themeToggle.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = isLightMode ? '🌙' : '☀️';
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Regenerate button
    regenerateBtn.addEventListener('click', generateNewPassword);

    // Copy button
    copyBtn.addEventListener('click', copyToClipboard);

    // Length slider
    lengthSlider.addEventListener('input', () => {
        updateLengthDisplay();
        generateNewPassword();
    });

    // Length input field
    lengthInput.addEventListener('change', () => {
        let value = parseInt(lengthInput.value);
        // Validate range
        if (isNaN(value) || value < 8) value = 8;
        if (value > 64) value = 64;
        lengthInput.value = value;
        lengthSlider.value = value;
        generateNewPassword();
    });

    // Allow real-time sync on input and update strength meter
    lengthInput.addEventListener('input', () => {
        let value = parseInt(lengthInput.value);
        if (!isNaN(value) && value >= 8 && value <= 64) {
            lengthSlider.value = value;
            // Update strength meter in real-time without generating new password
            updateStrengthMeter();
        }
    });

    // Character option toggles
    [uppercaseToggle, lowercaseToggle, numbersToggle, symbolsToggle].forEach(toggle => {
        toggle.addEventListener('change', () => {
            // Ensure at least one option is selected
            const options = getOptions();
            if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
                toggle.checked = true;
                return;
            }
            generateNewPassword();
        });
    });

    // Theme toggle
    themeToggle.addEventListener('click', toggleDarkMode);

    // Allow copying by clicking the password input
    passwordInput.addEventListener('click', copyToClipboard);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
