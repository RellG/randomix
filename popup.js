/**
 * Popup Script
 * Handles UI interactions and event listeners
 * Randomix - Secure Password Generator
 */

// Constants
const STORAGE_KEY = 'randomix_settings';
const MIN_LENGTH = 8;
const MAX_LENGTH = 64;
const PIN_MIN_LENGTH = 4;
const MAX_REQUIREMENT_ATTEMPTS = 10;
const COPY_FEEDBACK_DURATION = 1500;
const TOAST_DURATION = 2000;
const SLIDER_DEBOUNCE_DELAY = 150;

// Theme icons (Unicode entities)
const ICON_SUN = '\u263C';      // ☼
const ICON_MOON = '\u263D';     // ☽
const ICON_CHECK = '\u2713';    // ✓
const ICON_CLIPBOARD = '\u{1F4CB}'; // 📋

// DOM Elements
const passwordInput = document.getElementById('passwordInput');
const clearBtn = document.getElementById('clearBtn');
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

// Presets
const presetPin = document.getElementById('presetPin');

// Requirements
const reqNumbers = document.getElementById('reqNumbers');
const reqSymbols = document.getElementById('reqSymbols');
const reqNoSimilar = document.getElementById('reqNoSimilar');

// State variables
let isPinMode = false;
let copyFeedbackTimeout = null;
let sliderDebounceTimeout = null;

/**
 * Reset to standard password mode (exit PIN mode)
 */
function resetToStandardMode() {
    if (isPinMode) {
        lengthSlider.min = MIN_LENGTH;
        lengthInput.min = MIN_LENGTH;
        // If current value is below standard minimum, reset it
        if (parseInt(lengthSlider.value) < MIN_LENGTH) {
            lengthSlider.value = MIN_LENGTH;
            lengthInput.value = MIN_LENGTH;
        }
        isPinMode = false;
    }
}

/**
 * Apply preset settings
 */
function applyPreset(preset) {
    switch(preset) {
        case 'pin':
            isPinMode = true;
            lengthSlider.value = PIN_MIN_LENGTH;
            lengthSlider.min = PIN_MIN_LENGTH;
            lengthInput.value = PIN_MIN_LENGTH;
            lengthInput.min = PIN_MIN_LENGTH;
            uppercaseToggle.checked = false;
            lowercaseToggle.checked = false;
            numbersToggle.checked = true;
            symbolsToggle.checked = false;
            break;
    }
    generateNewPassword();
    saveSettings();
}

/**
 * Check if password meets requirements
 */
function meetsRequirements(password) {
    if (reqNumbers.checked && !/[0-9]/.test(password)) return false;
    if (reqSymbols.checked && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) return false;
    if (reqNoSimilar.checked && /[0O1il|`]/.test(password)) return false;
    return true;
}

/**
 * Initialize the extension
 */
function init() {
    try {
        // Check system preference for dark/light mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.body.classList.add('light-mode');
        }
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
 * Validate and sanitize settings loaded from storage
 */
function validateSettings(settings) {
    if (!settings || typeof settings !== 'object') {
        return null;
    }

    // Validate length
    let length = parseInt(settings.length);
    if (isNaN(length) || length < PIN_MIN_LENGTH || length > MAX_LENGTH) {
        length = 16; // Default
    }

    return {
        length: length,
        uppercase: settings.uppercase !== false,
        lowercase: settings.lowercase !== false,
        numbers: settings.numbers !== false,
        symbols: settings.symbols !== false,
        lightMode: Boolean(settings.lightMode),
        reqNumbers: Boolean(settings.reqNumbers),
        reqSymbols: Boolean(settings.reqSymbols),
        reqNoSimilar: Boolean(settings.reqNoSimilar),
        isPinMode: Boolean(settings.isPinMode)
    };
}

/**
 * Load settings from chrome.storage.local
 */
function loadSettings() {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (chrome.runtime.lastError) {
            console.error('Storage read error:', chrome.runtime.lastError);
            updateLengthDisplay();
            generateNewPassword();
            return;
        }

        if (result[STORAGE_KEY]) {
            const settings = validateSettings(result[STORAGE_KEY]);

            if (settings) {
                // Apply PIN mode state first
                isPinMode = settings.isPinMode;
                if (isPinMode) {
                    lengthSlider.min = PIN_MIN_LENGTH;
                    lengthInput.min = PIN_MIN_LENGTH;
                }

                lengthSlider.value = settings.length;
                uppercaseToggle.checked = settings.uppercase;
                lowercaseToggle.checked = settings.lowercase;
                numbersToggle.checked = settings.numbers;
                symbolsToggle.checked = settings.symbols;

                // Load requirements state
                reqNumbers.checked = settings.reqNumbers;
                reqSymbols.checked = settings.reqSymbols;
                reqNoSimilar.checked = settings.reqNoSimilar;

                // Check light mode preference (dark is now default)
                if (settings.lightMode) {
                    document.body.classList.add('light-mode');
                    updateThemeIcon();
                }
            }
        }

        // Generate password after settings are loaded
        updateLengthDisplay();
        generateNewPassword();
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
        lightMode: document.body.classList.contains('light-mode'),
        // Requirements state
        reqNumbers: reqNumbers.checked,
        reqSymbols: reqSymbols.checked,
        reqNoSimilar: reqNoSimilar.checked,
        // PIN mode state
        isPinMode: isPinMode
    };
    chrome.storage.local.set({ [STORAGE_KEY]: settings }, () => {
        if (chrome.runtime.lastError) {
            console.error('Storage write error:', chrome.runtime.lastError);
        }
    });
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

    let password = passwordGenerator.generate(length, options);

    // Regenerate if password doesn't meet requirements (max attempts)
    let attempts = 0;
    while (!meetsRequirements(password) && attempts < MAX_REQUIREMENT_ATTEMPTS) {
        password = passwordGenerator.generate(length, options);
        attempts++;
    }

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
 * Clear password field
 */
function clearPassword() {
    passwordInput.value = '';
    // Reset strength meter
    strengthMeter.style.width = '0%';
    strengthText.textContent = '-';
    strengthText.className = 'strength-text';
    entropyValue.textContent = '0';
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

        // Hide toast after duration
        setTimeout(() => {
            copyToast.classList.remove('show');
        }, TOAST_DURATION);

        // Visual feedback on button - clear previous timeout to prevent race condition
        clearTimeout(copyFeedbackTimeout);

        const originalIcon = copyBtn.querySelector('.copy-icon');
        const originalIconText = originalIcon ? originalIcon.textContent : ICON_CLIPBOARD;

        copyBtn.innerHTML = '<span class="copy-icon" aria-hidden="true">' + ICON_CHECK + '</span>';
        copyBtn.style.backgroundColor = 'var(--success-color)';

        copyFeedbackTimeout = setTimeout(() => {
            copyBtn.innerHTML = '<span class="copy-icon" aria-hidden="true">' + originalIconText + '</span>';
            copyBtn.style.backgroundColor = '';
        }, COPY_FEEDBACK_DURATION);
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
        icon.textContent = isLightMode ? ICON_MOON : ICON_SUN;
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Regenerate button
    regenerateBtn.addEventListener('click', generateNewPassword);

    // Clear button
    clearBtn.addEventListener('click', clearPassword);

    // Copy button
    copyBtn.addEventListener('click', copyToClipboard);

    // Length slider with debouncing for performance
    lengthSlider.addEventListener('input', () => {
        updateLengthDisplay();
        updateStrengthMeter();

        // Debounce password generation for smooth slider experience
        clearTimeout(sliderDebounceTimeout);
        sliderDebounceTimeout = setTimeout(() => {
            generateNewPassword();
        }, SLIDER_DEBOUNCE_DELAY);
    });

    // Length input field
    lengthInput.addEventListener('change', () => {
        let value = parseInt(lengthInput.value);
        const minValue = isPinMode ? PIN_MIN_LENGTH : MIN_LENGTH;

        // Validate range
        if (isNaN(value) || value < minValue) value = minValue;
        if (value > MAX_LENGTH) value = MAX_LENGTH;
        lengthInput.value = value;
        lengthSlider.value = value;
        generateNewPassword();
    });

    // Allow real-time sync on input and update strength meter
    lengthInput.addEventListener('input', () => {
        let value = parseInt(lengthInput.value);
        const minValue = isPinMode ? PIN_MIN_LENGTH : MIN_LENGTH;

        if (!isNaN(value) && value >= minValue && value <= MAX_LENGTH) {
            lengthSlider.value = value;
            // Update strength meter in real-time without generating new password
            updateStrengthMeter();
        }
    });

    // Character option toggles - exit PIN mode when manually changing options
    [uppercaseToggle, lowercaseToggle, numbersToggle, symbolsToggle].forEach(toggle => {
        toggle.addEventListener('change', () => {
            // Ensure at least one option is selected
            const options = getOptions();
            if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
                toggle.checked = true;
                return;
            }

            // Exit PIN mode if user manually changes character options
            if (isPinMode && (uppercaseToggle.checked || lowercaseToggle.checked || symbolsToggle.checked)) {
                resetToStandardMode();
            }

            generateNewPassword();
        });
    });

    // Theme toggle
    themeToggle.addEventListener('click', toggleDarkMode);

    // Preset button
    presetPin.addEventListener('click', () => applyPreset('pin'));

    // Requirements checkboxes
    [reqNumbers, reqSymbols, reqNoSimilar].forEach(req => {
        req.addEventListener('change', () => {
            generateNewPassword();
            saveSettings();
        });
    });

    // Allow copying by clicking the password input
    passwordInput.addEventListener('click', copyToClipboard);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
