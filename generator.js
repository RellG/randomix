/**
 * Password Generator Module
 * Handles password generation and entropy calculation
 */

class PasswordGenerator {
    constructor() {
        this.charsets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
    }

    /**
     * Generate a random password
     * @param {number} length - Password length
     * @param {Object} options - Character options (uppercase, lowercase, numbers, symbols)
     * @returns {string} Generated password
     */
    generate(length, options) {
        let charset = '';

        if (options.uppercase) charset += this.charsets.uppercase;
        if (options.lowercase) charset += this.charsets.lowercase;
        if (options.numbers) charset += this.charsets.numbers;
        if (options.symbols) charset += this.charsets.symbols;

        // Ensure at least one character set is selected
        if (charset.length === 0) {
            charset = this.charsets.lowercase;
        }

        let password = '';
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }

        return password;
    }

    /**
     * Calculate entropy of a password
     * Entropy = log2(charset_size ^ password_length)
     * @param {number} length - Password length
     * @param {Object} options - Character options
     * @returns {number} Entropy in bits
     */
    calculateEntropy(length, options) {
        let charsetSize = 0;

        if (options.uppercase) charsetSize += this.charsets.uppercase.length;
        if (options.lowercase) charsetSize += this.charsets.lowercase.length;
        if (options.numbers) charsetSize += this.charsets.numbers.length;
        if (options.symbols) charsetSize += this.charsets.symbols.length;

        if (charsetSize === 0) {
            charsetSize = this.charsets.lowercase.length;
        }

        // Entropy = log2(charsetSize^length)
        const entropy = length * Math.log2(charsetSize);
        return Math.round(entropy * 100) / 100; // Round to 2 decimal places
    }

    /**
     * Calculate password strength based on entropy
     * @param {number} entropy - Entropy in bits
     * @returns {Object} Strength level and percentage
     */
    calculateStrength(entropy) {
        // Entropy thresholds
        // < 32: Weak (0-25%)
        // 32-59: Fair (26-50%)
        // 60-79: Good (51-75%)
        // >= 80: Strong (76-100%)

        let level, percentage, text;

        if (entropy < 32) {
            level = 'weak';
            percentage = Math.min(25, (entropy / 32) * 25);
            text = 'Weak';
        } else if (entropy < 60) {
            level = 'fair';
            percentage = 25 + ((entropy - 32) / (60 - 32)) * 25;
            text = 'Fair';
        } else if (entropy < 80) {
            level = 'good';
            percentage = 50 + ((entropy - 60) / (80 - 60)) * 25;
            text = 'Good';
        } else {
            level = 'strong';
            percentage = Math.min(100, 75 + ((entropy - 80) / 20) * 25);
            text = 'Strong';
        }

        return {
            level,
            percentage: Math.round(percentage),
            text
        };
    }
}

// Export for use in other scripts
const passwordGenerator = new PasswordGenerator();
