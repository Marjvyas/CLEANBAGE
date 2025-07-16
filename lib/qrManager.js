// QR Code Management System for CLEANBAGE
// Handles unique user QR codes, deactivation, and reactivation logic

export class QRManager {
  static QR_DEACTIVATION_HOURS = 20; // 20 hours deactivation period
  static QR_STORAGE_KEY = 'cleanbage_user_qr_states';

  // Generate unique QR data for a user (this never changes)
  static generateUniqueUserQR(user) {
    const qrId = `QR_${user.id}_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    
    return {
      type: "user_waste_collection",
      qrId: qrId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      society: user.society,
      phone: user.phone || '',
      // This QR data never changes - it's the user's permanent identifier
      createdAt: user.createdAt || new Date().toISOString(),
      version: "1.0"
    };
  }

  // Check if a QR code is currently active (can be scanned)
  static isQRActive(userId) {
    try {
      const qrStates = this.getQRStates();
      const userQRState = qrStates[userId];
      
      if (!userQRState) {
        // QR never been scanned, so it's active
        return { active: true, reason: "never_scanned" };
      }
      
      const now = Date.now();
      const lastScannedTime = userQRState.lastScannedAt;
      const reactivationTime = lastScannedTime + (this.QR_DEACTIVATION_HOURS * 60 * 60 * 1000);
      
      if (now >= reactivationTime) {
        // QR should be reactivated
        this.reactivateQR(userId);
        return { active: true, reason: "reactivated" };
      } else {
        // QR is still deactivated
        const remainingTime = reactivationTime - now;
        const hoursRemaining = Math.ceil(remainingTime / (60 * 60 * 1000));
        return { 
          active: false, 
          reason: "deactivated", 
          hoursRemaining,
          reactivatesAt: new Date(reactivationTime).toISOString()
        };
      }
    } catch (error) {
      console.error("Error checking QR status:", error);
      return { active: true, reason: "error_default_active" };
    }
  }

  // Deactivate QR after successful scan
  static deactivateQR(userId, scannedBy, pointsAwarded) {
    try {
      const qrStates = this.getQRStates();
      const now = Date.now();
      
      qrStates[userId] = {
        lastScannedAt: now,
        lastScannedBy: scannedBy,
        pointsAwarded: pointsAwarded,
        scanCount: (qrStates[userId]?.scanCount || 0) + 1,
        reactivatesAt: now + (this.QR_DEACTIVATION_HOURS * 60 * 60 * 1000),
        status: 'deactivated'
      };
      
      this.saveQRStates(qrStates);
      
      console.log(`QR deactivated for user ${userId} until ${new Date(qrStates[userId].reactivatesAt).toLocaleString()}`);
      return true;
    } catch (error) {
      console.error("Error deactivating QR:", error);
      return false;
    }
  }

  // Reactivate QR (called automatically when time expires)
  static reactivateQR(userId) {
    try {
      const qrStates = this.getQRStates();
      
      if (qrStates[userId]) {
        qrStates[userId].status = 'active';
        qrStates[userId].reactivatedAt = Date.now();
        this.saveQRStates(qrStates);
        
        console.log(`QR reactivated for user ${userId}`);
      }
      
      return true;
    } catch (error) {
      console.error("Error reactivating QR:", error);
      return false;
    }
  }

  // Get QR status for display
  static getQRStatus(userId) {
    const status = this.isQRActive(userId);
    const qrStates = this.getQRStates();
    const userState = qrStates[userId];
    
    return {
      ...status,
      scanHistory: {
        totalScans: userState?.scanCount || 0,
        lastScannedAt: userState?.lastScannedAt ? new Date(userState.lastScannedAt).toISOString() : null,
        lastScannedBy: userState?.lastScannedBy || null,
        lastPointsAwarded: userState?.pointsAwarded || 0
      }
    };
  }

  // Get time remaining until reactivation
  static getTimeUntilReactivation(userId) {
    const qrStates = this.getQRStates();
    const userState = qrStates[userId];
    
    if (!userState || !userState.lastScannedAt) {
      return null; // Never been scanned
    }
    
    const now = Date.now();
    const reactivationTime = userState.lastScannedAt + (this.QR_DEACTIVATION_HOURS * 60 * 60 * 1000);
    const remaining = reactivationTime - now;
    
    if (remaining <= 0) {
      return null; // Already reactivated
    }
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    return {
      totalMilliseconds: remaining,
      hours,
      minutes,
      hoursRemaining: Math.ceil(remaining / (60 * 60 * 1000)),
      formattedTime: `${hours}h ${minutes}m`,
      reactivatesAt: new Date(reactivationTime).toISOString()
    };
  }

  // Helper methods for localStorage management
  static getQRStates() {
    try {
      const states = localStorage.getItem(this.QR_STORAGE_KEY);
      return states ? JSON.parse(states) : {};
    } catch (error) {
      console.error("Error reading QR states:", error);
      return {};
    }
  }

  static saveQRStates(states) {
    try {
      localStorage.setItem(this.QR_STORAGE_KEY, JSON.stringify(states));
    } catch (error) {
      console.error("Error saving QR states:", error);
    }
  }

  // Clean up old QR states (optional maintenance)
  static cleanupOldStates() {
    try {
      const qrStates = this.getQRStates();
      const now = Date.now();
      const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
      
      Object.keys(qrStates).forEach(userId => {
        const state = qrStates[userId];
        if (state.lastScannedAt && state.lastScannedAt < oneWeekAgo) {
          delete qrStates[userId];
        }
      });
      
      this.saveQRStates(qrStates);
    } catch (error) {
      console.error("Error cleaning up QR states:", error);
    }
  }

  // Get all QR states for admin/debug purposes
  static getAllQRStates() {
    return this.getQRStates();
  }

  // Force reactivate QR (admin function)
  static forceReactivateQR(userId) {
    try {
      const qrStates = this.getQRStates();
      
      if (qrStates[userId]) {
        delete qrStates[userId];
        this.saveQRStates(qrStates);
        console.log(`QR force reactivated for user ${userId}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error force reactivating QR:", error);
      return false;
    }
  }
}
