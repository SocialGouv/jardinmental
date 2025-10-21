// Simplified NPS Manager - only handles manual show/hide state

class NPSManager {
  constructor() {
    this.shouldShowNPS = false;
    this.listeners = new Set();
  }

  // Singleton pattern
  static getInstance() {
    if (!NPSManager.instance) {
      NPSManager.instance = new NPSManager();
    }
    return NPSManager.instance;
  }

  // Add a listener for NPS state changes
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners of state changes
  notifyListeners(shouldShow) {
    this.listeners.forEach((callback) => {
      try {
        callback(shouldShow);
      } catch (error) {
        console.error("NPSManager listener error:", error);
      }
    });
  }

  // Check if NPS should be shown (for components to call)
  getShouldShowNPS() {
    return this.shouldShowNPS;
  }

  // Show NPS modal (manual trigger)
  showNPS() {
    this.shouldShowNPS = true;
    this.notifyListeners(true);
  }

  // Hide NPS modal
  hideNPS() {
    this.shouldShowNPS = false;
    this.notifyListeners(false);
  }
}

export default NPSManager.getInstance();
