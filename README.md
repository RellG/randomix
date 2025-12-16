# Randomix

**Secure Password Generator Chrome Extension**

A sleek, modern Chrome extension that generates strong, random passwords with real-time entropy analysis and password strength visualization.

## Features

**Password Generation**
- Generate secure random passwords (8-64 characters)
- Customize character sets: Uppercase, Lowercase, Numbers, Symbols
- Real-time entropy calculation and strength assessment
- One-click copy to clipboard
- Clear password button

**PIN Preset**
- Quick 4-digit PIN generation mode
- Numbers-only character set
- Minimum 4-character length for PINs

**Password Requirements (Optional)**
- Must have numbers - ensures password contains digits
- Must have symbols - ensures password contains special characters
- No similar chars - excludes confusing characters (0/O, 1/l, |, `)

**Strength Meter**
- Visual password strength indicator with color-coded feedback
- Red to Orange to Green gradient based on entropy
- Entropy bits calculation (measured in bits of randomness)
- Strength levels: Weak, Fair, Good, Strong

**Modern UI**
- Dark-first theme inspired by xAI (Grok) and X (Twitter)
- Clean, minimalist design with X Blue accent color (#1d9bf0)
- Light mode toggle for user preference
- Auto-detects system color preference
- Smooth animations and responsive interactions
- Full accessibility support (ARIA labels, screen reader compatible)

**Smart Controls**
- Password length slider for quick adjustments
- Custom length input field (8-64) with real-time validation
- Strength meter updates instantly as length changes
- All settings persisted in browser storage (including requirements)

## Installation

### From ZIP File
1. Download the latest `Randomix_LATEST.zip` from [releases](https://github.com/RellG/randomix/releases)
2. Extract the ZIP file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (top right)
5. Click "Load unpacked" and select the extracted folder
6. The Randomix icon will appear in your toolbar

### From Source
1. Clone this repository:
   ```bash
   git clone https://github.com/RellG/randomix.git
   cd randomix
   ```
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `Randomix` folder
5. Start using Randomix!

## Usage

### Generate Password
1. Click the Randomix icon in your Chrome toolbar
2. Click the **Generate** button to create a new password
3. Use the slider or number input to adjust length (8-64 characters)
4. Toggle character types: A-Z, a-z, 0-9, !@#$
5. Watch the strength meter update in real-time

### Use PIN Preset
1. Click the **# PIN** button for quick PIN generation
2. Automatically sets 4-digit, numbers-only mode
3. Perfect for quick codes and PINs

### Set Requirements
1. Check "Must have numbers" to ensure digits are included
2. Check "Must have symbols" for special characters
3. Check "No similar chars" to avoid confusing characters

### Copy Password
- Click the clipboard button next to the password
- Or click directly on the password field
- Toast notification confirms the copy

### Customize Settings
- **Length**: Use slider or type in the number field
- **Character Sets**: Toggle any combination on/off
- **Theme**: Click the sun/moon icon to switch between dark/light modes
- Settings are automatically saved and restored

## Project Structure

```
randomix/
├── manifest.json          # Chrome extension manifest (MV3)
├── popup.html             # Extension popup interface
├── popup.js               # UI event handlers and state management
├── generator.js           # Password generation logic
├── styles.css             # Extension styling (dark/light themes)
├── assets/
│   ├── icon.svg           # Master icon (SVG)
│   ├── icon-16.png        # 16x16 toolbar icon
│   ├── icon-48.png        # 48x48 extension menu icon
│   └── icon-128.png       # 128x128 Chrome Web Store icon
└── README.md              # This file
```

## Technical Details

### Password Generation
- Uses `crypto.getRandomValues()` for cryptographically secure randomness
- Entropy calculated as: `bits = length x log2(charset_size)`
- Supports character sets: Uppercase, Lowercase, Numbers, Symbols
- Requirements system regenerates until conditions are met (max 10 attempts)

### Strength Levels
- **Weak**: < 32 bits
- **Fair**: 32-59 bits
- **Good**: 60-79 bits
- **Strong**: >= 80 bits

### Browser Storage
- Settings stored in `chrome.storage.local`
- Includes: password length, character options, theme preference, requirements
- Persists across browser sessions

### Chrome Requirements
- Minimum Chrome version: 88 (Manifest V3)
- Permissions: `storage` only

## Version History

### v2.4.0 (Production Release)
- Full accessibility compliance with ARIA labels
- Content Security Policy (CSP) for enhanced security
- Replaced emojis with Unicode symbols for cross-platform consistency
- Fixed PIN preset minimum length reset bug
- Requirements state now persisted across sessions
- Fixed copy button race condition
- Added debouncing for slider performance
- Removed extraneous files for smaller package size
- Code refactored with extracted constants

### v2.3.2
- Removed non-functional drag-to-resize
- Fixed CSS dimensions for proper auto-sizing
- Added error handling to all chrome.storage operations

### v2.3.1
- Refined presets (PIN only)
- Changed PIN minimum from 8 to 4 digits

### v2.3.0
- Added password presets (PIN mode)
- Added strength requirements (Must have numbers/symbols, No similar chars)
- Auto-detect system theme preference

### v2.2.0
- Added clear button to password field
- Added subtitle to extension header
- Changed strength meter to bold red/orange/green gradient

### v2.1.2
- Real-time strength meter updates when changing custom password length
- Custom length input field with validation

### v2.1.0
- Modern password lock icon for extension branding
- Custom password length input field (8-64)

### v2.0.0
- Complete redesign with xAI/X inspired dark theme
- X Blue accent color and minimalist UI
- Theme toggle (dark/light mode)

## Design Inspiration

Randomix follows modern design principles from:
- **X (Twitter)** - Minimalist interface, clean typography
- **xAI (Grok)** - Dark-first theme, blue accent color
- **System UI** - Native-feeling interactions and smooth animations

## Privacy & Security

**Privacy First**
- No data sent to external servers
- All processing happens locally in your browser
- No tracking or analytics
- Settings stored only in your browser
- No external dependencies or third-party code

**Cryptographically Secure**
- Uses browser's native `crypto.getRandomValues()`
- Not using Math.random() - truly random password generation
- Entropy-based strength calculation
- Content Security Policy enforced

**Accessibility**
- Full ARIA label support
- Screen reader compatible
- Keyboard navigation support
- High contrast color scheme

## Contributing

Found a bug? Have a feature idea? Feel free to open an issue or submit a pull request!

## License

MIT License - Feel free to use, modify, and distribute.

## Support

For issues, feature requests, or questions, please open an issue on GitHub: [github.com/RellG/randomix/issues](https://github.com/RellG/randomix/issues)

---

**Made with care by RellG**

*Randomix - Because strong passwords shouldn't be complicated.*
