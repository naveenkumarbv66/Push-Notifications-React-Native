import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  imageUrl?: string;
  sound?: boolean;
  priority?: 'min' | 'low' | 'default' | 'high' | 'max';
  vibrate?: boolean;
}

export interface ScheduledNotificationData extends NotificationData {
  trigger?: {
    seconds?: number;
    date?: Date;
    channelId?: string;
  };
}

class LocalNotificationService {
  private static instance: LocalNotificationService;

  private constructor() {
    this.requestPermissions();
  }

  public static getInstance(): LocalNotificationService {
    if (!LocalNotificationService.instance) {
      LocalNotificationService.instance = new LocalNotificationService();
    }
    return LocalNotificationService.instance;
  }

  /**
   * Request notification permissions from the user
   */
  private async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Send an immediate local notification
   */
  async sendImmediateNotification(notificationData: NotificationData): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Notification permissions not granted');
      }

      const notificationContent: Notifications.NotificationContentInput = {
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data || {},
        sound: notificationData.sound !== false,
        priority: notificationData.priority || 'default',
        vibrate: notificationData.vibrate !== false ? [0, 250, 250, 250] : undefined,
      };

      // Add image if provided
      if (notificationData.imageUrl) {
        const imageUrl = await this.processImageForNotification(notificationData.imageUrl);
        if (imageUrl) {
          notificationContent.attachments = [
            {
              url: imageUrl,
              identifier: 'image',
              type: 'image',
            },
          ];
        }
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: null, // Immediate notification
      });

      console.log('Immediate notification sent with ID:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error sending immediate notification:', error);
      return null;
    }
  }

  /**
   * Schedule a notification for later
   */
  async scheduleNotification(notificationData: ScheduledNotificationData): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Notification permissions not granted');
      }

      const notificationContent: Notifications.NotificationContentInput = {
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data || {},
        sound: notificationData.sound !== false,
        priority: notificationData.priority || 'default',
        vibrate: notificationData.vibrate !== false ? [0, 250, 250, 250] : undefined,
      };

      // Add image if provided
      if (notificationData.imageUrl) {
        const imageUrl = await this.processImageForNotification(notificationData.imageUrl);
        if (imageUrl) {
          notificationContent.attachments = [
            {
              url: imageUrl,
              identifier: 'image',
              type: 'image',
            },
          ];
        }
      }

      // Create proper trigger object
      let trigger: Notifications.NotificationTriggerInput;
      
      if (notificationData.trigger) {
        if (notificationData.trigger.date) {
          trigger = {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: notificationData.trigger.date,
          };
        } else if (notificationData.trigger.seconds) {
          trigger = {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: notificationData.trigger.seconds,
          };
        } else {
          trigger = {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 1,
          };
        }
      } else {
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 1,
        };
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger,
      });

      console.log('Scheduled notification sent with ID:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  /**
   * Cancel a specific notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notification cancelled:', notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Set up notification listeners
   */
  addNotificationListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  /**
   * Set up notification response listener (when user taps notification)
   */
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  /**
   * Remove notification listener
   */
  removeNotificationListener(subscription: Notifications.Subscription): void {
    subscription.remove();
  }

  /**
   * Get notification permissions status
   */
  async getPermissionsStatus(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.getPermissionsAsync();
  }

  /**
   * Create a notification channel (Android only)
   */
  async createNotificationChannel(channelId: string, channelName: string, description?: string): Promise<void> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(channelId, {
        name: channelName,
        description: description || '',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  /**
   * Process image for notification - convert local URIs to base64 data URIs
   */
  private async processImageForNotification(imageUrl: string): Promise<string | null> {
    try {
      // If it's already a remote URL, return as is
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
      }

      // If it's a local file URI, convert to base64
      if (imageUrl.startsWith('file://') || imageUrl.startsWith('content://')) {
        // Use the legacy FileSystem API to avoid deprecation warnings
        const base64 = await FileSystem.readAsStringAsync(imageUrl, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        // Determine the image type from the URI
        let mimeType = 'image/jpeg';
        if (imageUrl.toLowerCase().includes('.png')) {
          mimeType = 'image/png';
        } else if (imageUrl.toLowerCase().includes('.gif')) {
          mimeType = 'image/gif';
        } else if (imageUrl.toLowerCase().includes('.webp')) {
          mimeType = 'image/webp';
        }

        return `data:${mimeType};base64,${base64}`;
      }

      // If it's a data URI, return as is
      if (imageUrl.startsWith('data:')) {
        return imageUrl;
      }

      console.warn('Unsupported image URL format:', imageUrl);
      return null;
    } catch (error) {
      console.error('Error processing image for notification:', error);
      return null;
    }
  }
}

// Export singleton instance
export const localNotificationService = LocalNotificationService.getInstance();
export default localNotificationService;
