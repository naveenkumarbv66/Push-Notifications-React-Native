# Local Push Notifications - React Native Expo

A comprehensive implementation of local push notifications for React Native Expo applications. This project provides a generic notification service that can be used throughout your app to display local push notifications with support for images, scheduling, and various notification types.

## 🚀 Features

- **Generic Notification Service**: Easy-to-use service that can be accessed from anywhere in your app
- **Image Support**: Send notifications with images (local and remote)
- **Scheduling**: Schedule notifications for future delivery
- **Immediate Notifications**: Send notifications instantly
- **Permission Management**: Automatic permission handling
- **Notification Listeners**: Handle notification interactions
- **Cross-Platform**: Works on both iOS and Android
- **TypeScript Support**: Fully typed for better development experience
- **Production Ready**: All TypeScript errors resolved and tested

## ✅ Recent Updates

- **Fixed TypeScript Errors**: Resolved `NotificationBehavior` and `NotificationContentAttachmentIos` type issues
- **Enhanced Error Handling**: Added comprehensive error handling and logging
- **Improved Documentation**: Added troubleshooting section with common issues and solutions
- **Tested Implementation**: Verified functionality on both iOS and Android platforms

## 📦 Installation

The project already includes all necessary dependencies. If you're setting up a new project, install these packages:

```bash
npm install expo-notifications expo-image-picker expo-file-system @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context
```

## 🖼️ Image Handling

### Overview

The notification system supports both local and remote images. The service automatically handles different image sources:

- **Remote URLs**: Direct HTTP/HTTPS links to images
- **Local Files**: Images from device gallery (automatically converted to base64)
- **Data URIs**: Base64 encoded images

### How It Works

1. **Image Picker Integration**: Users can select images from their device gallery
2. **Automatic Processing**: The service detects the image source type
3. **Conversion**: Local files are converted to base64 data URIs
4. **Attachment**: Images are properly attached to notifications

### Technical Implementation

```typescript
// Import the legacy FileSystem API to avoid deprecation warnings
import * as FileSystem from 'expo-file-system/legacy';

// The service automatically processes different image types
private async processImageForNotification(imageUrl: string): Promise<string | null> {
  // Remote URLs - used as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Local files - converted to base64 using legacy API
  if (imageUrl.startsWith('file://') || imageUrl.startsWith('content://')) {
    const base64 = await FileSystem.readAsStringAsync(imageUrl, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64}`;
  }

  // Data URIs - used as-is
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
}
```

### Supported Image Formats

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **GIF** (.gif)
- **WebP** (.webp)

### Image Size Recommendations

- **Maximum Size**: 1MB for optimal performance
- **Resolution**: 400x300px or similar for notification display
- **Compression**: Use appropriate quality settings when picking images

### Demo Remote Image URLs

The app includes demo remote image URLs for testing:

- **Picsum Photos**: `https://picsum.photos/400/300?random=1` (Random images)
- **Picsum Specific**: `https://picsum.photos/id/237/400/300` (Specific image ID)
- **Placeholder**: `https://via.placeholder.com/400x300/007AFF/FFFFFF?text=Demo+Image`

These URLs are used in the demo button and examples to showcase remote image functionality.

## 🏗️ Project Structure

```
├── services/
│   └── LocalNotificationService.ts    # Generic notification service
├── screens/
│   └── LocalScreen.tsx                # Demo UI for testing notifications
├── App.tsx                            # Main app with navigation
└── README.md                          # This file
```

## 🔧 Setup

### 1. Configure App.json

Make sure your `app.json` includes notification permissions:

```json
{
  "expo": {
    "name": "Push Notifications Demo",
    "slug": "push-notifications-demo",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    },
    "android": {
      "permissions": [
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.VIBRATE"
      ]
    }
  }
}
```

### 2. Initialize the Service

The `LocalNotificationService` is a singleton that automatically handles permissions and configuration. Simply import and use it:

```typescript
import { localNotificationService } from './services/LocalNotificationService';
```

## 📱 Usage

### Basic Notification

```typescript
import { localNotificationService } from './services/LocalNotificationService';

// Send an immediate notification
const notificationId = await localNotificationService.sendImmediateNotification({
  title: 'Hello!',
  body: 'This is a local notification',
  sound: true,
  vibrate: true,
  priority: 'high'
});
```

### Notification with Image

```typescript
// Remote image URL (demo image from Picsum Photos)
const notificationId = await localNotificationService.sendImmediateNotification({
  title: 'Demo Remote Image',
  body: 'This notification uses a remote image URL!',
  imageUrl: 'https://picsum.photos/400/300?random=1', // Demo remote image
  sound: true,
  vibrate: true
});

// Local image (automatically converted to base64)
const notificationId = await localNotificationService.sendImmediateNotification({
  title: 'Local Image',
  body: 'This is a local image!',
  imageUrl: 'file:///path/to/local/image.jpg', // From image picker
  sound: true,
  vibrate: true
});

// Different remote image sources
const notificationId = await localNotificationService.sendImmediateNotification({
  title: 'Product Update',
  body: 'New product available!',
  imageUrl: 'https://via.placeholder.com/400x300/007AFF/FFFFFF?text=Product',
  sound: true,
  vibrate: true
});
```

### Scheduled Notification

```typescript
// Schedule a notification for 30 seconds from now
const notificationId = await localNotificationService.scheduleNotification({
  title: 'Scheduled Notification',
  body: 'This notification was scheduled!',
  trigger: {
    seconds: 30
  },
  sound: true,
  vibrate: true
});

// Schedule for a specific date
const notificationId = await localNotificationService.scheduleNotification({
  title: 'Future Notification',
  body: 'This will appear tomorrow!',
  trigger: {
    date: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
  }
});
```

### Notification Listeners

```typescript
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // Listen for notifications when app is in foreground
    const notificationListener = localNotificationService.addNotificationListener(
      (notification) => {
        console.log('Notification received:', notification);
        // Handle the notification
      }
    );

    // Listen for notification taps
    const responseListener = localNotificationService.addNotificationResponseListener(
      (response) => {
        console.log('Notification tapped:', response);
        // Handle notification tap
      }
    );

    return () => {
      localNotificationService.removeNotificationListener(notificationListener);
      localNotificationService.removeNotificationListener(responseListener);
    };
  }, []);

  return <YourComponent />;
}
```

### Managing Notifications

```typescript
// Cancel a specific notification
await localNotificationService.cancelNotification(notificationId);

// Cancel all scheduled notifications
await localNotificationService.cancelAllNotifications();

// Get all scheduled notifications
const scheduled = await localNotificationService.getScheduledNotifications();

// Check permissions
const permissions = await localNotificationService.getPermissionsStatus();
```

## 🎯 Use Cases

### 1. Reminder App
```typescript
// Set a reminder for 1 hour
await localNotificationService.scheduleNotification({
  title: 'Reminder',
  body: 'Time to take your medication!',
  trigger: { seconds: 3600 },
  sound: true,
  vibrate: true
});
```

### 2. Task Management
```typescript
// Notify when a task is due
await localNotificationService.scheduleNotification({
  title: 'Task Due',
  body: 'Your project deadline is approaching!',
  trigger: { date: new Date('2024-12-31T23:59:59') },
  priority: 'high'
});
```

### 3. Social Media App
```typescript
// Notify about new messages with sender's photo
await localNotificationService.sendImmediateNotification({
  title: 'New Message',
  body: 'John sent you a message',
  imageUrl: 'https://example.com/john-avatar.jpg',
  data: { userId: '123', messageId: '456' }
});
```

### 4. Fitness App
```typescript
// Workout reminder with motivational image
await localNotificationService.scheduleNotification({
  title: 'Workout Time!',
  body: 'Ready for your daily workout?',
  imageUrl: 'https://example.com/workout-motivation.jpg',
  trigger: { seconds: 1800 }, // 30 minutes
  priority: 'high'
});
```

### 5. E-commerce App
```typescript
// Order status update
await localNotificationService.sendImmediateNotification({
  title: 'Order Update',
  body: 'Your order #12345 has been shipped!',
  imageUrl: 'https://example.com/shipping-icon.jpg',
  data: { orderId: '12345', status: 'shipped' }
});
```

## 🔧 API Reference

### LocalNotificationService

#### Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `sendImmediateNotification` | Send notification immediately | `NotificationData` | `Promise<string \| null>` |
| `scheduleNotification` | Schedule notification for later | `ScheduledNotificationData` | `Promise<string \| null>` |
| `cancelNotification` | Cancel specific notification | `notificationId: string` | `Promise<void>` |
| `cancelAllNotifications` | Cancel all scheduled notifications | - | `Promise<void>` |
| `getScheduledNotifications` | Get all scheduled notifications | - | `Promise<NotificationRequest[]>` |
| `addNotificationListener` | Add notification listener | `listener: function` | `Subscription` |
| `addNotificationResponseListener` | Add response listener | `listener: function` | `Subscription` |
| `removeNotificationListener` | Remove listener | `subscription: Subscription` | `void` |
| `getPermissionsStatus` | Get permission status | - | `Promise<PermissionsStatus>` |
| `createNotificationChannel` | Create Android channel | `channelId, name, description` | `Promise<void>` |

#### Types

```typescript
interface NotificationData {
  title: string;
  body: string;
  data?: any;
  imageUrl?: string;
  sound?: boolean;
  priority?: 'min' | 'low' | 'default' | 'high' | 'max';
  vibrate?: boolean;
}

interface ScheduledNotificationData extends NotificationData {
  trigger?: {
    seconds?: number;
    date?: Date;
    channelId?: string;
  };
}
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on device/simulator:**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

4. **Test notifications:**
   - Navigate to "Local Notifications" screen
   - Try different notification types
   - Test with and without images
   - Use the "Demo Remote Image Notification" button to test remote images
   - Schedule notifications for different times

## 🚀 Running the App

The app is ready to run! Simply follow the Quick Start steps above.

## 📱 Testing on Device

### iOS
- Notifications work on both simulator and device
- For testing on device, you'll need to build and install the app

### Android
- Notifications work on both emulator and device
- Make sure to grant notification permissions when prompted

## 🔒 Permissions

The service automatically handles permission requests, but you can check status:

```typescript
const permissions = await localNotificationService.getPermissionsStatus();
console.log('Permission status:', permissions.status);
```

## 🐛 Troubleshooting

### Common Issues

1. **Notifications not showing:**
   - Check if permissions are granted
   - Verify the notification service is properly initialized
   - Check device notification settings

2. **Images not displaying in notifications:**

   **Root Cause:** Local file URIs from the image picker are not accessible to the notification system. For notifications to display images, the image needs to be either:
   - A remote URL (HTTP/HTTPS)
   - A base64 encoded image
   - A bundled asset

   **Solution Implemented:** The LocalNotificationService automatically handles local images by:
   - Detecting local file URIs (`file://` or `content://`)
   - Converting them to base64 data URIs using `expo-file-system`
   - Creating proper data URIs (`data:image/jpeg;base64,...`)
   - Attaching them to notifications

   **Technical Details:**
   ```typescript
   // The service automatically processes images
   private async processImageForNotification(imageUrl: string): Promise<string | null> {
     // Handles remote URLs, local files, and data URIs
     // Converts local files to base64 data URIs
     // Supports JPEG, PNG, GIF, WebP formats
   }
   ```

   **Troubleshooting Steps:**
   - **Local Images**: The service automatically converts local file URIs to base64 data URIs
   - **Remote Images**: Ensure image URL is accessible and publicly available
   - **Supported Formats**: JPEG, PNG, GIF, WebP
   - **Image Size**: Keep under 1MB for better performance
   - **Debug**: Check console logs for image processing errors
   - **Platform Differences**: Images may display differently on iOS vs Android
   - **Dependencies**: Ensure `expo-file-system` is installed for local image processing

3. **Scheduled notifications not working:**
   - Check if the trigger time is in the future
   - Verify the app has background permissions
   - Test with shorter delays first

4. **TypeScript Errors:**

   **Error: `Type 'Promise<{ shouldShowAlert: true; shouldPlaySound: true; shouldSetBadge: true; }>' is not assignable to type 'Promise<NotificationBehavior>'`**
   
   **Solution:** Add missing properties to the notification handler:
   ```typescript
   Notifications.setNotificationHandler({
     handleNotification: async () => ({
       shouldShowAlert: true,
       shouldPlaySound: true,
       shouldSetBadge: true,
       shouldShowBanner: true,  // Add this
       shouldShowList: true,    // Add this
     }),
   });
   ```

   **Error: `Property 'type' is missing in type '{ url: string; identifier: string; }' but required in type 'NotificationContentAttachmentIos'`**
   
   **Solution:** Add the `type` property to attachments:
   ```typescript
   notificationContent.attachments = [
     {
       url: notificationData.imageUrl,
       identifier: 'image',
       type: 'image',  // Add this
     },
   ];
   ```

   **Error: `Type '{ seconds?: number | undefined; date?: Date | undefined; channelId?: string | undefined; }' is not assignable to type 'NotificationTriggerInput'`**
   
   **Solution:** Use proper trigger types with explicit type property:
   ```typescript
   // For time-based triggers
   const trigger: Notifications.NotificationTriggerInput = {
     type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
     seconds: 30,
   };
   
   // For date-based triggers
   const trigger: Notifications.NotificationTriggerInput = {
     type: Notifications.SchedulableTriggerInputTypes.DATE,
     date: new Date('2024-12-31T23:59:59'),
   };
   ```

   **Error: `Type 'boolean' is not assignable to type 'number[]'` (vibrate property)**
   
   **Solution:** Use vibration pattern array instead of boolean:
   ```typescript
   const notificationContent: Notifications.NotificationContentInput = {
     title: 'Test',
     body: 'Message',
     vibrate: true ? [0, 250, 250, 250] : undefined,  // Use array pattern
   };
   ```

   **Error: Images not displaying in notifications (Local File URIs)**
   
   **Root Cause:** Local file URIs from image picker (`file://` or `content://`) are not accessible to the notification system.
   
   **Solution:** The service automatically handles this by:
   1. Installing `expo-file-system` package
   2. Detecting local file URIs
   3. Converting them to base64 data URIs
   4. Creating proper attachment objects

   **Error: `readAsStringAsync` method is deprecated**
   
   **Root Cause:** The `readAsStringAsync` method from `expo-file-system` has been deprecated in favor of the new FileSystem API.
   
   **Solution:** Use the legacy API import to avoid deprecation warnings:
   ```typescript
   // Use legacy import instead of default import
   import * as FileSystem from 'expo-file-system/legacy';
   
   // Then use the method as before
   const base64 = await FileSystem.readAsStringAsync(imageUrl, {
     encoding: FileSystem.EncodingType.Base64,
   });
   ```
   
   **Code Implementation:**
   ```typescript
   // Automatic image processing in LocalNotificationService
   import * as FileSystem from 'expo-file-system/legacy';
   
   private async processImageForNotification(imageUrl: string): Promise<string | null> {
     // Handle remote URLs
     if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
       return imageUrl;
     }
     
     // Convert local files to base64 using legacy API
     if (imageUrl.startsWith('file://') || imageUrl.startsWith('content://')) {
       const base64 = await FileSystem.readAsStringAsync(imageUrl, {
         encoding: FileSystem.EncodingType.Base64,
       });
       return `data:image/jpeg;base64,${base64}`;
     }
     
     return imageUrl; // Data URIs
   }
   ```

5. **Metro Bundler Issues:**
   - Clear Metro cache: `npx expo start --clear`
   - Restart the development server
   - Check for conflicting dependencies

6. **Permission Issues:**
   - On iOS: Check Info.plist for notification permissions
   - On Android: Verify permissions in AndroidManifest.xml
   - Test on physical device for accurate permission behavior

### Debug Tips

```typescript
// Enable detailed logging
console.log('Scheduled notifications:', await localNotificationService.getScheduledNotifications());

// Check permissions
const permissions = await localNotificationService.getPermissionsStatus();
console.log('Permissions:', permissions);

// Debug image processing
console.log('Sending notification with image:', imageUri);
// Check console for image processing logs and errors

// Test different image sources
const remoteImage = 'https://example.com/image.jpg';
const localImage = 'file:///path/to/local/image.jpg';
const dataUri = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...';
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Coding! 🎉**