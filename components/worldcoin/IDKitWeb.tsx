import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import { useSettings } from '@/providers/SettingsProvider';

function loadIDKitScript(): Promise<void> {
  if (Platform.OS !== 'web') return Promise.resolve();
  const w = window as unknown as { _idkitLoading?: Promise<void> } & Window;
  if (w._idkitLoading) return w._idkitLoading;
  w._idkitLoading = new Promise<void>((resolve, reject) => {
    try {
      const existing = document.querySelector('script[src="https://cdn.worldcoin.org/idkit.js"]');
      if (existing) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.worldcoin.org/idkit.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load IDKit script'));
      document.body.appendChild(script);
    } catch (e) {
      reject(e as Error);
    }
  });
  return w._idkitLoading;
}

export function useIsWorldApp() {
  const [isWorldApp, setIsWorldApp] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'web') {
      setIsWorldApp(false);
      return;
    }
    const ua = navigator.userAgent || '';
    const flag = ua.includes('WorldApp') || (window as any).MiniKit || (window as any).miniwallet;
    setIsWorldApp(!!flag);
  }, []);
  return isWorldApp;
}

export function OpenInWorldAppBanner({ testID }: { testID?: string }) {
  const { currentTheme, settings } = useSettings();
  const lang = settings.language;
  return (
    <View style={[styles.banner, { backgroundColor: currentTheme.surface, borderColor: currentTheme.border }]} testID={testID ?? 'open-in-worldapp-banner'}>
      <Text style={[styles.bannerTitle, { color: currentTheme.text }]}>
        {lang === 'zh' ? '在 World App 中開啟以驗證' : 'Open in World App to verify'}
      </Text>
      <Text style={[styles.bannerText, { color: currentTheme.textSecondary }]}>
        {lang === 'zh' ? '此功能需在 World App 環境中使用。' : 'This feature works best inside the World App.'}
      </Text>
      <TouchableOpacity
        onPress={() => Linking.openURL('https://worldcoin.org/download')}
        style={[styles.bannerBtn, { backgroundColor: currentTheme.primary }]} testID="open-worldapp-cta"
      >
        <Text style={styles.bannerBtnText}>World App</Text>
      </TouchableOpacity>
    </View>
  );
}

export function WorldIDVerifyButton({
  appId,
  action,
  callbackUrl,
  children,
  testID,
}: {
  appId: string;
  action: string;
  callbackUrl: string;
  children?: React.ReactNode;
  testID?: string;
}) {
  const { currentTheme, settings } = useSettings();
  const [ready, setReady] = useState(Platform.OS !== 'web');
  const [error, setError] = useState<string | null>(null);
  const openingRef = useRef(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      loadIDKitScript()
        .then(() => setReady(true))
        .catch((e) => {
          console.error('IDKit load error', e);
          setError((e as Error).message);
        });
    }
  }, []);

  const onPress = useCallback(async () => {
    if (Platform.OS !== 'web') {
      console.log('[WorldID] Not available on native');
      setError('Not available on native');
      return;
    }
    if (openingRef.current) return;
    openingRef.current = true;
    try {
      await loadIDKitScript();
      const sdk = (window as any).IDKit;
      if (!sdk || typeof sdk.open !== 'function') {
        throw new Error('IDKit SDK not found');
      }
      console.log('[WorldID] Opening widget with action', action);
      sdk.open({
        app_id: appId,
        action,
        options: { theme: 'auto' },
        onSuccess: (result: unknown) => {
          console.log('[WorldID] success', result);
          try {
            const url = new URL(callbackUrl);
            url.searchParams.set('result', encodeURIComponent(JSON.stringify(result)));
            window.location.href = url.toString();
          } catch (e) {
            console.error('Callback redirect error', e);
          }
        },
        onError: (err: any) => {
          console.error('[WorldID] error', err);
          setError(err?.message ?? 'Unknown error');
        },
        onClose: () => {
          console.log('[WorldID] closed');
          openingRef.current = false;
        },
      });
    } catch (e) {
      console.error('[WorldID] open error', e);
      setError((e as Error).message);
      openingRef.current = false;
    }
  }, [action, appId, callbackUrl]);

  return (
    <View>
      {!!error && (
        <Text style={{ color: '#EF4444', marginBottom: 8 }} testID="worldid-error">{error}</Text>
      )}
      <TouchableOpacity
        disabled={!ready}
        onPress={onPress}
        style={[styles.verifyBtn, { backgroundColor: ready ? currentTheme.primary : currentTheme.border }]}
        testID={testID ?? 'worldid-verify-button'}
      >
        <Text style={styles.verifyText}>
          {settings.language === 'zh' ? '使用 World ID 驗證' : 'Verify with World ID'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  verifyBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  verifyText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  banner: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 8,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    marginBottom: 10,
  },
  bannerBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  bannerBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
