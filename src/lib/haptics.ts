/**
 * Cross-platform Haptic Feedback Helper for Mobile Devices.
 * Leverages navigator.vibrate where supported.
 */

export type HapticPattern = 'LIGHT' | 'MEDIUM' | 'HEAVY' | 'WIN' | 'PULL' | 'IMPACT';

export function triggerHaptic(pattern: HapticPattern = 'LIGHT') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (pattern) {
      case 'LIGHT':
        navigator.vibrate(15);
        break;
      case 'MEDIUM':
        navigator.vibrate(35);
        break;
      case 'HEAVY':
        navigator.vibrate(70);
        break;
      case 'PULL':
        navigator.vibrate([20, 30, 20]);
        break;
      case 'IMPACT':
        navigator.vibrate([50, 20, 50]);
        break;
      case 'WIN':
        navigator.vibrate([40, 60, 40, 60, 100]);
        break;
    }
  } catch (err) {
    // Ignore haptic errors on unsupported hardware
  }
}
