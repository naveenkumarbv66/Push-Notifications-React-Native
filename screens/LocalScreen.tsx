import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { localNotificationService, NotificationData, ScheduledNotificationData } from '../services/LocalNotificationService';

const LocalScreen: React.FC = () => {
  const [title, setTitle] = useState('Hello!');
  const [body, setBody] = useState('This is a local notification');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [delay, setDelay] = useState('5');
  const [scheduledNotifications, setScheduledNotifications] = useState<any[]>([]);
  
  // Demo remote image URL for showcasing remote URL examples
  const demoRemoteImageUrl = 'https://picsum.photos/400/300?random=1';

  useEffect(() => {
    // Load scheduled notifications on component mount
    loadScheduledNotifications();
    
    // Set up notification listeners
    const notificationListener = localNotificationService.addNotificationListener(
      (notification) => {
        console.log('Notification received:', notification);
        Alert.alert('Notification Received', notification.request.content.body || '');
      }
    );

    const responseListener = localNotificationService.addNotificationResponseListener(
      (response) => {
        console.log('Notification response:', response);
        Alert.alert('Notification Tapped', response.notification.request.content.body || '');
      }
    );

    return () => {
      localNotificationService.removeNotificationListener(notificationListener);
      localNotificationService.removeNotificationListener(responseListener);
    };
  }, []);

  const loadScheduledNotifications = async () => {
    const notifications = await localNotificationService.getScheduledNotifications();
    setScheduledNotifications(notifications);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const sendImmediateNotification = async () => {
    const notificationData: NotificationData = {
      title,
      body,
      imageUrl: imageUri || undefined,
      sound: true,
      vibrate: true,
      priority: 'high',
    };

    console.log('Sending notification with image:', imageUri);
    const notificationId = await localNotificationService.sendImmediateNotification(notificationData);
    
    if (notificationId) {
      Alert.alert('Success', 'Immediate notification sent!');
    } else {
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const sendDemoRemoteImageNotification = async () => {
    const notificationData: NotificationData = {
      title: 'Demo Remote Image',
      body: 'This notification uses a remote image URL!',
      imageUrl: demoRemoteImageUrl,
      sound: true,
      vibrate: true,
      priority: 'high',
    };

    console.log('Sending demo notification with remote image:', demoRemoteImageUrl);
    const notificationId = await localNotificationService.sendImmediateNotification(notificationData);
    
    if (notificationId) {
      Alert.alert('Success', 'Demo remote image notification sent!');
    } else {
      Alert.alert('Error', 'Failed to send demo notification');
    }
  };

  const scheduleNotification = async () => {
    const delaySeconds = parseInt(delay) || 5;
    
    const notificationData: ScheduledNotificationData = {
      title,
      body,
      imageUrl: imageUri || undefined,
      sound: true,
      vibrate: true,
      priority: 'high',
      trigger: {
        seconds: delaySeconds,
      },
    };

    console.log('Scheduling notification with image:', imageUri);
    const notificationId = await localNotificationService.scheduleNotification(notificationData);
    
    if (notificationId) {
      Alert.alert('Success', `Notification scheduled for ${delaySeconds} seconds!`);
      loadScheduledNotifications(); // Refresh the list
    } else {
      Alert.alert('Error', 'Failed to schedule notification');
    }
  };

  const cancelAllNotifications = async () => {
    await localNotificationService.cancelAllNotifications();
    Alert.alert('Success', 'All notifications cancelled!');
    loadScheduledNotifications(); // Refresh the list
  };

  const checkPermissions = async () => {
    const permissions = await localNotificationService.getPermissionsStatus();
    Alert.alert(
      'Notification Permissions',
      `Status: ${permissions.status}\nCan ask again: ${permissions.canAskAgain}`
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Local Push Notifications</Text>
      
      {/* Notification Content */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Content</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Notification Title"
          value={title}
          onChangeText={setTitle}
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Notification Body"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Image Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Image (Optional)</Text>
        
        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
              <Text style={styles.removeButtonText}>Remove Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
            <Text style={styles.pickImageButtonText}>Pick Image</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Delay Setting */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schedule Delay (seconds)</Text>
        <TextInput
          style={styles.input}
          placeholder="Delay in seconds"
          value={delay}
          onChangeText={setDelay}
          keyboardType="numeric"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity style={styles.button} onPress={sendImmediateNotification}>
          <Text style={styles.buttonText}>Send Immediate Notification</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.demoButton]} onPress={sendDemoRemoteImageNotification}>
          <Text style={styles.buttonText}>Demo Remote Image Notification</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={scheduleNotification}>
          <Text style={styles.buttonText}>Schedule Notification</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={checkPermissions}>
          <Text style={styles.buttonText}>Check Permissions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={cancelAllNotifications}>
          <Text style={styles.buttonText}>Cancel All Notifications</Text>
        </TouchableOpacity>
      </View>

      {/* Scheduled Notifications List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Scheduled Notifications ({scheduledNotifications.length})
        </Text>
        
        {scheduledNotifications.length === 0 ? (
          <Text style={styles.noNotificationsText}>No scheduled notifications</Text>
        ) : (
          scheduledNotifications.map((notification, index) => (
            <View key={index} style={styles.notificationItem}>
              <Text style={styles.notificationTitle}>
                {notification.content.title}
              </Text>
              <Text style={styles.notificationBody}>
                {notification.content.body}
              </Text>
              <Text style={styles.notificationDate}>
                ID: {notification.identifier}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  pickImageButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickImageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  demoButton: {
    backgroundColor: '#34C759',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
  },
  noNotificationsText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
});

export default LocalScreen;
