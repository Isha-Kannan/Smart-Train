
// Audio for notification alert
const alertSound = new Audio('/notification-sound.mp3');

// Function to play alert sound
export const playAlertSound = () => {
  alertSound.play().catch(error => {
    console.error('Error playing notification sound:', error);
  });
};

// Function to vibrate device (if supported)
export const vibrateDevice = () => {
  if ('vibrate' in navigator) {
    // Vibrate pattern: 500ms on, 200ms off, 500ms on
    navigator.vibrate([500, 200, 500]);
  } else {
    console.warn('Vibration not supported in this device');
  }
};

// Function to show browser notification
export const showNotification = async (title: string, body: string) => {
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    console.error('This browser does not support desktop notifications');
    return;
  }

  // Check if permission is already granted
  if (Notification.permission === 'granted') {
    createNotification(title, body);
  } 
  // Otherwise, request permission
  else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      createNotification(title, body);
    }
  }
};

// Helper function to create the notification
const createNotification = (title: string, body: string) => {
  const notification = new Notification(title, {
    body,
    icon: '/train-icon.png',
    requireInteraction: true // Keep notification open until user interacts with it
  });
  
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
  
  // Auto close after 30 seconds
  setTimeout(() => {
    notification.close();
  }, 30000);
  
  // Play sound and vibrate
  playAlertSound();
  vibrateDevice();
};

// Function to setup destination alerts (simulation)
export const setupDestinationAlert = (
  trainNumber: string,
  stationName: string,
  minutesBefore: number,
  callback: () => void
): NodeJS.Timeout => {
  console.log(`Setting up alert for train ${trainNumber} approaching ${stationName} ${minutesBefore} minutes before arrival`);
  
  // For demo purposes, we'll trigger the alert in a shorter timeframe
  // In a real app, you would calculate the actual time based on train location and ETA
  const alertTimeMs = minutesBefore * 1000; // Convert minutes to milliseconds (but use seconds instead for demo)
  
  // Return timer ID so it can be cancelled if needed
  return setTimeout(() => {
    // Show browser notification
    showNotification(
      `Train ${trainNumber} Approaching!`,
      `Your train will arrive at ${stationName} in approximately ${minutesBefore} minutes. Please get ready.`
    );
    
    // Execute callback
    callback();
  }, alertTimeMs);
};

// Space for Twilio SMS integration
/* 
 * Twilio Integration Module
 * =======================
 * This section integrates with Twilio SMS services via our Express backend
 * for sending text alerts to users about train arrivals, delays, etc.
 */
 
export const sendSmsAlert = async (phoneNumber: string, message: string) => {
  try {
    // Connect to backend API which routes through Twilio securely
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        message
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to send SMS notification:', error);
    return { success: false, error: 'Failed to send SMS' };
  }
};

// Function to check if phone number is valid for SMS
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Basic validation - enhanced with proper region-based validation
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(phoneNumber);
};
