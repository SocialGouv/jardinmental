import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const STORAGE_KEYS = {
  PAGINATION: "DEV_CORRELATION_ENABLE_PAGINATION",
  CHUNK_SIZE: "DEV_CORRELATION_CHUNK_SIZE",
  MAX_DAYS: "DEV_CORRELATION_MAX_DAYS",
  HIDE_DATA_POINTS: "DEV_CORRELATION_HIDE_DATA_POINTS",
  USE_CUSTOM_RENDERERS: "DEV_CORRELATION_USE_CUSTOM_RENDERERS",
  USE_VIEWPORT_OPTIMIZATION: "DEV_CORRELATION_USE_VIEWPORT_OPTIMIZATION",
};

// Default values
export const DEFAULT_CONFIG = {
  enablePagination: false,
  chunkSize: 40,
  maxDays: 366,
  hideDataPoints: false,
  useCustomRenderers: true,
  useViewportOptimization: false,
};

// Value ranges
export const VALUE_RANGES = {
  chunkSize: { min: 0, max: 1000 },
  maxDays: { min: 0, max: 1000 },
};

interface CorrelationConfig {
  enablePagination: boolean;
  chunkSize: number;
  maxDays: number;
  hideDataPoints: boolean;
  useCustomRenderers: boolean;
  useViewportOptimization: boolean;
}

export const useDevCorrelationConfig = () => {
  const [config, setConfig] = useState<CorrelationConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  // Load config from storage
  const loadConfig = async () => {
    try {
      const [paginationValue, chunkSizeValue, maxDaysValue, hideDataPointsValue, useCustomRenderersValue, useViewportOptimizationValue] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PAGINATION),
          AsyncStorage.getItem(STORAGE_KEYS.CHUNK_SIZE),
          AsyncStorage.getItem(STORAGE_KEYS.MAX_DAYS),
          AsyncStorage.getItem(STORAGE_KEYS.HIDE_DATA_POINTS),
          AsyncStorage.getItem(STORAGE_KEYS.USE_CUSTOM_RENDERERS),
          AsyncStorage.getItem(STORAGE_KEYS.USE_VIEWPORT_OPTIMIZATION),
        ]);

      setConfig({
        enablePagination: paginationValue ? JSON.parse(paginationValue) : DEFAULT_CONFIG.enablePagination,
        chunkSize: chunkSizeValue ? parseInt(chunkSizeValue, 10) : DEFAULT_CONFIG.chunkSize,
        maxDays: maxDaysValue ? parseInt(maxDaysValue, 10) : DEFAULT_CONFIG.maxDays,
        hideDataPoints: hideDataPointsValue ? JSON.parse(hideDataPointsValue) : DEFAULT_CONFIG.hideDataPoints,
        useCustomRenderers: useCustomRenderersValue ? JSON.parse(useCustomRenderersValue) : DEFAULT_CONFIG.useCustomRenderers,
        useViewportOptimization: useViewportOptimizationValue ? JSON.parse(useViewportOptimizationValue) : DEFAULT_CONFIG.useViewportOptimization,
      });
    } catch (error) {
      console.error("Error loading correlation config:", error);
      setConfig(DEFAULT_CONFIG);
    } finally {
      setIsLoading(false);
    }
  };

  // Save config to storage
  const saveConfig = async (newConfig: Partial<CorrelationConfig>) => {
    try {
      const updatedConfig = { ...config, ...newConfig };

      const savePromises: Promise<void>[] = [];
      if (newConfig.enablePagination !== undefined) {
        savePromises.push(AsyncStorage.setItem(STORAGE_KEYS.PAGINATION, JSON.stringify(newConfig.enablePagination)));
      }
      if (newConfig.chunkSize !== undefined) {
        savePromises.push(AsyncStorage.setItem(STORAGE_KEYS.CHUNK_SIZE, newConfig.chunkSize.toString()));
      }
      if (newConfig.maxDays !== undefined) {
        savePromises.push(AsyncStorage.setItem(STORAGE_KEYS.MAX_DAYS, newConfig.maxDays.toString()));
      }
      if (newConfig.hideDataPoints !== undefined) {
        savePromises.push(AsyncStorage.setItem(STORAGE_KEYS.HIDE_DATA_POINTS, JSON.stringify(newConfig.hideDataPoints)));
      }
      if (newConfig.useCustomRenderers !== undefined) {
        savePromises.push(AsyncStorage.setItem(STORAGE_KEYS.USE_CUSTOM_RENDERERS, JSON.stringify(newConfig.useCustomRenderers)));
      }
      if (newConfig.useViewportOptimization !== undefined) {
        savePromises.push(AsyncStorage.setItem(STORAGE_KEYS.USE_VIEWPORT_OPTIMIZATION, JSON.stringify(newConfig.useViewportOptimization)));
      }

      await Promise.all(savePromises);
      setConfig(updatedConfig);
    } catch (error) {
      console.error("Error saving correlation config:", error);
    }
  };

  // Reset config to defaults
  const resetConfig = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.PAGINATION),
        AsyncStorage.removeItem(STORAGE_KEYS.CHUNK_SIZE),
        AsyncStorage.removeItem(STORAGE_KEYS.MAX_DAYS),
        AsyncStorage.removeItem(STORAGE_KEYS.HIDE_DATA_POINTS),
        AsyncStorage.removeItem(STORAGE_KEYS.USE_CUSTOM_RENDERERS),
        AsyncStorage.removeItem(STORAGE_KEYS.USE_VIEWPORT_OPTIMIZATION),
      ]);
      setConfig(DEFAULT_CONFIG);
    } catch (error) {
      console.error("Error resetting correlation config:", error);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return {
    config,
    isLoading,
    saveConfig,
    resetConfig,
  };
};

// Helper function to get config synchronously (for components that can't use hooks)
export const getCorrelationConfig = async (): Promise<CorrelationConfig> => {
  try {
    const [paginationValue, chunkSizeValue, maxDaysValue, hideDataPointsValue, useCustomRenderersValue, useViewportOptimizationValue] =
      await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PAGINATION),
        AsyncStorage.getItem(STORAGE_KEYS.CHUNK_SIZE),
        AsyncStorage.getItem(STORAGE_KEYS.MAX_DAYS),
        AsyncStorage.getItem(STORAGE_KEYS.HIDE_DATA_POINTS),
        AsyncStorage.getItem(STORAGE_KEYS.USE_CUSTOM_RENDERERS),
        AsyncStorage.getItem(STORAGE_KEYS.USE_VIEWPORT_OPTIMIZATION),
      ]);

    return {
      enablePagination: paginationValue ? JSON.parse(paginationValue) : DEFAULT_CONFIG.enablePagination,
      chunkSize: chunkSizeValue ? parseInt(chunkSizeValue, 10) : DEFAULT_CONFIG.chunkSize,
      maxDays: maxDaysValue ? parseInt(maxDaysValue, 10) : DEFAULT_CONFIG.maxDays,
      hideDataPoints: hideDataPointsValue ? JSON.parse(hideDataPointsValue) : DEFAULT_CONFIG.hideDataPoints,
      useCustomRenderers: useCustomRenderersValue ? JSON.parse(useCustomRenderersValue) : DEFAULT_CONFIG.useCustomRenderers,
      useViewportOptimization: useViewportOptimizationValue ? JSON.parse(useViewportOptimizationValue) : DEFAULT_CONFIG.useViewportOptimization,
    };
  } catch (error) {
    console.error("Error getting correlation config:", error);
    return DEFAULT_CONFIG;
  }
};
