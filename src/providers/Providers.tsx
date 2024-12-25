import React, { useEffect, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { initializeStore } from '@/src/store';
import { ActivityIndicator, View } from 'react-native';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storeReady, setStoreReady] = useState<{
    store: any;
    persistor: any;
  } | null>(null);

  useEffect(() => {
    initializeStore()
      .then(result => setStoreReady(result))
      .catch(error => console.error('Failed to initialize store:', error));
  }, []);

  if (!storeReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ReduxProvider store={storeReady.store}>
      <PersistGate loading={null} persistor={storeReady.persistor}>
        <GluestackUIProvider>
          {children}
        </GluestackUIProvider>
      </PersistGate>
    </ReduxProvider>
  );
}; 