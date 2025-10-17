# Push Notifications React Native

A React Native project for implementing push notifications functionality.

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v16 or higher)
- React Native CLI
- Android Studio
- Android SDK
- Java Development Kit (JDK)

## Android Setup

### Android SDK Configuration

If you encounter the error:
```
SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable or by setting the sdk.dir path in your project's local properties file
```

Follow these steps to resolve it:

#### Option 1: Using local.properties file (Recommended)

1. Create a `local.properties` file in the `android/` directory of your project
2. Add the following line with your Android SDK path:
   ```
   sdk.dir=/Users/yourusername/Library/Android/sdk
   ```

   **Note**: Replace `/Users/yourusername/Library/Android/sdk` with your actual Android SDK path.

#### Option 2: Using ANDROID_HOME environment variable

1. Add the following to your shell profile (`.bashrc`, `.zshrc`, etc.):
   ```bash
   export ANDROID_HOME=/Users/yourusername/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

2. Reload your shell profile:
   ```bash
   source ~/.zshrc  # or ~/.bashrc
   ```

### Finding Your Android SDK Path

The Android SDK is typically located at:
- **macOS**: `~/Library/Android/sdk`
- **Windows**: `%LOCALAPPDATA%\Android\Sdk`
- **Linux**: `~/Android/Sdk`

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Push-Notifications-React-Native
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. For iOS (macOS only):
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the Project

### Android

1. Start the Metro bundler:
   ```bash
   npm start
   ```

2. In a new terminal, run the Android app:
   ```bash
   npm run android
   ```

   Or using React Native CLI:
   ```bash
   npx react-native run-android
   ```

3. Alternative: Build directly with Gradle:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

### iOS (macOS only)

1. Start the Metro bundler:
   ```bash
   npm start
   ```

2. In a new terminal, run the iOS app:
   ```bash
   npm run ios
   ```

   Or using React Native CLI:
   ```bash
   npx react-native run-ios
   ```

## Troubleshooting

### Common Android Build Issues

1. **SDK location not found**: Follow the Android SDK configuration steps above
2. **Build tools version mismatch**: Update your Android SDK build tools
3. **Gradle sync issues**: Clean and rebuild the project:
   ```bash
   cd android
   ./gradlew clean
   ./gradlew assembleDebug
   ```

### Metro Bundler Issues

If you encounter Metro bundler issues:

1. Clear Metro cache:
   ```bash
   npx react-native start --reset-cache
   ```

2. Clear npm cache:
   ```bash
   npm start -- --reset-cache
   ```

## Project Structure

```
Push-Notifications-React-Native/
├── android/                 # Android-specific code
│   ├── app/
│   ├── build.gradle
│   └── local.properties     # SDK configuration (not in version control)
├── ios/                     # iOS-specific code
├── src/                     # Source code
├── App.tsx                  # Main application component
├── package.json
└── README.md
```

## Development

### Adding Dependencies

- **React Native packages**: `npm install <package-name>`
- **iOS dependencies**: After installing, run `cd ios && pod install`
- **Android dependencies**: Usually auto-linked, but may require manual configuration

### Code Style

This project uses TypeScript. Make sure to:
- Use proper TypeScript types
- Follow React Native best practices
- Test on both Android and iOS platforms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both platforms
5. Submit a pull request

## License

[Add your license information here]

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information about your problem
