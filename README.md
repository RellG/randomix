# Randomix

🔐 **Secure Password Generator Chrome Extension**

A sleek, modern Chrome extension that generates strong, random passwords with real-time entropy analysis and password strength visualization.

## Features

✨ **Password Generation**
- Generate secure random passwords (8-64 characters)
- Customize character sets: Uppercase, Lowercase, Numbers, Symbols
- Real-time entropy calculation and strength assessment
- One-click copy to clipboard

📊 **Strength Meter**
- Visual password strength indicator with color-coded feedback
- Red → Orange → Green gradient based on entropy
- Entropy bits calculation (measured in bits of randomness)
- Strength levels: Weak, Fair, Good, Strong

🎨 **Modern UI**
- Dark-first theme inspired by xAI (Grok) and X (Twitter)
- Clean, minimalist design with X Blue accent color (#1d9bf0)
- Light mode toggle for user preference
- Smooth animations and responsive interactions

⚙️ **Smart Controls**
- Password length slider for quick adjustments
- Custom length input field (8-64) with real-time validation
- Strength meter updates instantly as length changes
- All settings persisted in browser storage

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

### Copy Password
- Click the 📋 button next to the password
- Or click directly on the password field
- Toast notification confirms the copy

### Customize Settings
- **Length**: Use slider or type in the number field
- **Character Sets**: Toggle any combination on/off
- **Theme**: Click the sun/moon icon to switch between dark/light modes
- Settings are automatically saved

## Project Structure

```
randomix/
├── manifest.json          # Chrome extension manifest
├── popup.html             # Extension popup interface
├── popup.js               # UI event handlers
├── generator.js           # Password generation logic
├── styles.css             # Extension styling
├── assets/
│   ├── icon.svg           # Extension icon (SVG)
│   ├── icon-16.svg        # 16x16 icon
│   ├── icon-48.svg        # 48x48 icon
│   └── icon-128.svg       # 128x128 icon
└── README.md              # This file
```

## Technical Details

### Password Generation
- Uses `crypto.getRandomValues()` for cryptographically secure randomness
- Entropy calculated as: `bits = length × log₂(charset_size)`
- Supports character sets: Uppercase, Lowercase, Numbers, Symbols

### Strength Levels
- **Weak**: < 32 bits
- **Fair**: 32-59 bits
- **Good**: 60-79 bits
- **Strong**: ≥ 80 bits

### Browser Storage
- Settings stored in `chrome.storage.local`
- Includes: password length, character options, theme preference
- Persists across browser sessions

## Version History

### v2.1.2
- Real-time strength meter updates when changing custom password length
- Custom length input field with validation
- Improved UI/UX with helpful hints

### v2.1.1
- Added extension subtitle ("Secure password generator")
- Updated strength meter with bold red→orange→green gradient
- Enhanced custom length input with placeholder text

### v2.1.0
- Modern password lock icon for extension branding
- Custom password length input field (8-64)
- Real-time input validation

### v2.0.1
- Fixed popup window dimensions with inline styles and CSS !important
- Ensured consistent display across all Chrome versions

### v2.0.0
- Complete redesign with xAI/X inspired dark theme
- X Blue accent color and minimalist UI
- Theme toggle (dark/light mode)
- Compact 2x2 character option grid

## Design Inspiration

Randomix follows modern design principles from:
- **X (Twitter)** - Minimalist interface, clean typography
- **xAI (Grok)** - Dark-first theme, blue accent color
- **System UI** - Native-feeling interactions and smooth animations

## Privacy & Security

✅ **Privacy First**
- No data sent to external servers
- All processing happens locally in your browser
- No tracking or analytics
- Settings stored only in your browser

✅ **Cryptographically Secure**
- Uses browser's native `crypto.getRandomValues()`
- Not using Math.random() - truly random password generation
- Entropy-based strength calculation

## Contributing

Found a bug? Have a feature idea? Feel free to open an issue or submit a pull request!

## License

MIT License - Feel free to use, modify, and distribute.

## Support

For issues, feature requests, or questions, please open an issue on GitHub: [github.com/RellG/randomix/issues](https://github.com/RellG/randomix/issues)

---

**Made with ❤️ by RellG**

*Randomix - Because strong passwords shouldn't be complicated.*
