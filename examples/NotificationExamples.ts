/**
 * Notification Examples
 * 
 * This file demonstrates various ways to use the LocalNotificationService
 * throughout your React Native Expo application.
 */

import { localNotificationService } from '../services/LocalNotificationService';

// Example 1: Simple Welcome Notification
export const sendWelcomeNotification = async () => {
  await localNotificationService.sendImmediateNotification({
    title: 'Welcome!',
    body: 'Thanks for using our app!',
    sound: true,
    vibrate: true,
    priority: 'high'
  });
};

// Example 1.1: Demo Remote Image Notification
export const sendDemoRemoteImageNotification = async () => {
  await localNotificationService.sendImmediateNotification({
    title: 'Demo Remote Image',
    body: 'This notification uses a remote image URL!',
    imageUrl: 'https://picsum.photos/400/300?random=1', // Random demo image
    sound: true,
    vibrate: true,
    priority: 'high'
  });
};

// Example 2: Reminder with Image
export const sendReminderWithImage = async (imageUrl: string) => {
  await localNotificationService.sendImmediateNotification({
    title: 'Daily Reminder',
    body: 'Don\'t forget to complete your daily tasks!',
    imageUrl,
    sound: true,
    vibrate: true,
    priority: 'default'
  });
};

// Example 2.1: Remote Image URLs - Different Sources
export const sendRemoteImageExamples = async () => {
  // Random image from Picsum
  await localNotificationService.sendImmediateNotification({
    title: 'Random Image',
    body: 'This uses a random image from Picsum Photos',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    sound: true,
    vibrate: true
  });

  // Specific image from Picsum
  await localNotificationService.sendImmediateNotification({
    title: 'Specific Image',
    body: 'This uses a specific image ID from Picsum',
    imageUrl: 'https://picsum.photos/id/237/400/300',
    sound: true,
    vibrate: true
  });

  // Placeholder image service
  await localNotificationService.sendImmediateNotification({
    title: 'Placeholder Image',
    body: 'This uses a placeholder image service',
    imageUrl: 'https://via.placeholder.com/400x300/007AFF/FFFFFF?text=Demo+Image',
    sound: true,
    vibrate: true
  });
};

// Example 3: Scheduled Workout Reminder
export const scheduleWorkoutReminder = async (hoursFromNow: number) => {
  const seconds = hoursFromNow * 3600;
  
  await localNotificationService.scheduleNotification({
    title: 'Workout Time! 💪',
    body: 'Ready for your scheduled workout?',
    trigger: { seconds },
    sound: true,
    vibrate: true,
    priority: 'high',
    data: { type: 'workout_reminder', scheduledFor: new Date(Date.now() + seconds * 1000) }
  });
};

// Example 4: Order Status Update
export const notifyOrderUpdate = async (orderId: string, status: string) => {
  await localNotificationService.sendImmediateNotification({
    title: 'Order Update',
    body: `Your order #${orderId} is now ${status}`,
    sound: true,
    vibrate: true,
    priority: 'default',
    data: { orderId, status, timestamp: Date.now() }
  });
};

// Example 4.1: E-commerce with Product Images
export const notifyProductUpdate = async (productName: string, productImageUrl: string) => {
  await localNotificationService.sendImmediateNotification({
    title: 'Product Update',
    body: `${productName} is now available!`,
    imageUrl: productImageUrl, // Remote product image
    sound: true,
    vibrate: true,
    priority: 'high',
    data: { productName, type: 'product_update' }
  });
};

// Example 4.2: News/Article with Featured Image
export const notifyNewsUpdate = async (headline: string, featuredImageUrl: string) => {
  await localNotificationService.sendImmediateNotification({
    title: 'Breaking News',
    body: headline,
    imageUrl: featuredImageUrl, // Remote news image
    sound: true,
    vibrate: true,
    priority: 'high',
    data: { headline, type: 'news_update' }
  });
};

// Example 5: Medication Reminder
export const scheduleMedicationReminder = async (medicationName: string, timeInMinutes: number) => {
  await localNotificationService.scheduleNotification({
    title: 'Medication Reminder',
    body: `Time to take your ${medicationName}`,
    trigger: { seconds: timeInMinutes * 60 },
    sound: true,
    vibrate: true,
    priority: 'high',
    data: { type: 'medication', medication: medicationName }
  });
};

// Example 6: Meeting Reminder
export const scheduleMeetingReminder = async (meetingTitle: string, meetingTime: Date) => {
  const now = new Date();
  const timeDiff = meetingTime.getTime() - now.getTime();
  
  if (timeDiff > 0) {
    await localNotificationService.scheduleNotification({
      title: 'Meeting Reminder',
      body: `You have a meeting: ${meetingTitle}`,
      trigger: { date: meetingTime },
      sound: true,
      vibrate: true,
      priority: 'high',
      data: { type: 'meeting', title: meetingTitle, time: meetingTime.toISOString() }
    });
  }
};

// Example 7: Social Media Notification
export const notifyNewMessage = async (senderName: string, messagePreview: string, senderAvatar?: string) => {
  await localNotificationService.sendImmediateNotification({
    title: `New message from ${senderName}`,
    body: messagePreview,
    imageUrl: senderAvatar,
    sound: true,
    vibrate: true,
    priority: 'default',
    data: { type: 'message', sender: senderName, preview: messagePreview }
  });
};

// Example 8: Weather Alert
export const sendWeatherAlert = async (alertType: string, description: string) => {
  await localNotificationService.sendImmediateNotification({
    title: `Weather Alert: ${alertType}`,
    body: description,
    sound: true,
    vibrate: true,
    priority: 'high',
    data: { type: 'weather_alert', alertType, description }
  });
};

// Example 9: App Update Notification
export const notifyAppUpdate = async (version: string) => {
  await localNotificationService.sendImmediateNotification({
    title: 'App Update Available',
    body: `Version ${version} is now available with new features!`,
    sound: false, // Silent notification for updates
    vibrate: false,
    priority: 'default',
    data: { type: 'app_update', version }
  });
};

// Example 10: Custom Notification with Rich Data
export const sendCustomNotification = async (
  title: string,
  body: string,
  customData: any,
  imageUrl?: string
) => {
  await localNotificationService.sendImmediateNotification({
    title,
    body,
    imageUrl,
    sound: true,
    vibrate: true,
    priority: 'default',
    data: {
      ...customData,
      timestamp: Date.now(),
      appVersion: '1.0.0'
    }
  });
};

// Example 11: Batch Notifications
export const sendBatchNotifications = async (notifications: Array<{
  title: string;
  body: string;
  delay: number; // in seconds
}>) => {
  for (let i = 0; i < notifications.length; i++) {
    const notification = notifications[i];
    const delay = notification.delay + (i * 2); // Stagger notifications by 2 seconds
    
    await localNotificationService.scheduleNotification({
      title: notification.title,
      body: notification.body,
      trigger: { seconds: delay },
      sound: true,
      vibrate: true,
      priority: 'default'
    });
  }
};

// Example 12: Conditional Notification
export const sendConditionalNotification = async (condition: boolean, message: string) => {
  if (condition) {
    await localNotificationService.sendImmediateNotification({
      title: 'Condition Met',
      body: message,
      sound: true,
      vibrate: true,
      priority: 'default'
    });
  }
};

// Example 13: Recurring Notification (simulate with multiple scheduled notifications)
export const scheduleRecurringNotification = async (
  title: string,
  body: string,
  intervalHours: number,
  totalOccurrences: number
) => {
  for (let i = 1; i <= totalOccurrences; i++) {
    const delaySeconds = i * intervalHours * 3600;
    
    await localNotificationService.scheduleNotification({
      title,
      body,
      trigger: { seconds: delaySeconds },
      sound: true,
      vibrate: true,
      priority: 'default',
      data: { type: 'recurring', occurrence: i, total: totalOccurrences }
    });
  }
};

// Example 14: Notification with Action Buttons (using data for custom handling)
export const sendActionableNotification = async (actionType: string) => {
  await localNotificationService.sendImmediateNotification({
    title: 'Action Required',
    body: 'Tap to view details and take action',
    sound: true,
    vibrate: true,
    priority: 'high',
    data: { 
      type: 'actionable',
      actionType,
      requiresAction: true,
      timestamp: Date.now()
    }
  });
};

// Example 15: Silent Notification (for background processing)
export const sendSilentNotification = async (data: any) => {
  await localNotificationService.sendImmediateNotification({
    title: 'Background Update',
    body: 'App data has been updated',
    sound: false,
    vibrate: false,
    priority: 'min',
    data: { ...data, silent: true }
  });
};
