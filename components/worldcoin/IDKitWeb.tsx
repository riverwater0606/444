import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import { useSettings } from '@/providers/SettingsProvider';

export function loadIDKitScript(): Promise<void> {
  if (Platform.OS !== 'web') return Promise.resolve();
  const w = window as unknown as { _idkitLoading?: Promise<void> } & Window;
  if (w._idkitLoading) return w._idkitLoading;
  w._idkitLoading = new Promise<void>((resolve, reject) => {
    try {
      const sourcesBase = [
        'https://idkit.worldcoin.org/idkit.js',
        'https://id.worldcoin.org/idkit.js',
        'https://cdn.worldcoin.org/idkit.js',
      ];

      const already = document.querySelector('script[data-idkit-script="true"]') as HTMLScriptElement | null;
      if (already) {
        resolve();
        return;
      }

      let attempt = 0;
      const maxAttempts = 3;

      const cycle = (useCacheBust: boolean): void => {
        if (attempt >= maxAttempts) {
          console.error('[IDKit] Exhausted attempts to load script');
          reject(new Error('Failed to load IDKit script'));
          return;
        }
        const urls = useCacheBust
          ? sourcesBase.map((u) => `${u}?v=${Date.now()}-${attempt}`)
          : [...sourcesBase];
        attempt += 1;
        tryLoad(urls, useCacheBust);
      };

      const tryLoad = (urls: string[], usedBust: boolean): void => {
        if (urls.length === 0) {
          cycle(!usedBust);
          return;
        }
        const url = urls[0];
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.referrerPolicy = 'no-referrer';
        (script as any).dataset.idkitScript = 'true';

        const timeoutMs = 15000;
        const timer = setTimeout(() => {
          console.error('[IDKit] script load timeout for', url);
          script.remove();
          tryLoad(urls.slice(1), usedBust);
        }, timeoutMs);

        script.onload = () => {
          clearTimeout(timer);
          const sdk = (window as any).IDKit ?? (window as any).WorldID?.IDKit ?? (window as any).worldID?.IDKit;
          if (!sdk) {
            console.warn('[IDKit] script loaded but SDK global missing, continuing');
          }
          console.log('[IDKit] script loaded from', url);
          resolve();
        };
        script.onerror = () => {
          clearTimeout(timer);
          console.error('[IDKit] script onerror for', url);
          script.remove();
          tryLoad(urls.slice(1), usedBust);
        };
        (document.head || document.body).appendChild(script);
      };

      cycle(false);
    } catch (e) {
      reject(e as Error);
    }
  });

  w._idkitLoading.catch(() => {
    try {
      delete (window as any)._idkitLoading;
    } catch {}
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
  appId = (process.env.WORLD_ID_APP_ID ?? 'app_346b0844d114f6bac06f1d35eb9f3d1d'),
  action = (process.env.WORLD_ID_ACTION_ID ?? 'psig'),
  callbackUrl,
  children,
  testID,
}: {
  appId?: string;
  action?: string;
  callbackUrl: string;
  children?: React.ReactNode;
  testID?: string;
}) {
  const { currentTheme, settings } = useSettings();
  const [ready, setReady] = useState<boolean>(Platform.OS !== 'web');
  const [error, setError] = useState<string | null>(null);
  const openingRef = useRef<boolean>(false);
  const widgetRef = useRef<any | null>(null);
  const isWorldApp = useIsWorldApp();

  useEffect(() => {
    if (Platform.OS === 'web') {
      loadIDKitScript()
        .then(() => {
          try {
            if (!widgetRef.current) {
              const el: any = document.createElement('idkit-widget');
              el.setAttribute('style', 'display:none');
              el.app_id = appId;
              el.action = action;
              el.verification_level = 'orb';
              el.setAttribute('crossorigin', 'anonymous');
              el.enableTelemetry = true;
              el.handleVerify = (proof: unknown) => {
                console.log('Proof:', proof);
              };
              el.onSuccess = (res: unknown) => {
                console.log('Success');
                try {
                  const url = new URL(callbackUrl);
                  url.searchParams.set('result', encodeURIComponent(JSON.stringify(res)));
                  window.location.href = url.toString();
                } catch (e) {
                  console.error('Callback redirect error', e);
                }
              };
              el.onError = (err: any) => {
                console.error('[WorldID] error', err);
                setError(err?.message ?? 'Unknown error');
              };
              document.body.appendChild(el);
              widgetRef.current = el;
            }
            setReady(true);
          } catch (e) {
            console.warn('[IDKit] Widget init failed, will fallback to open()', e);
            setReady(true);
          }
        })
        .catch((e) => {
          console.error('IDKit load error', e);
          setError((e as Error).message ?? 'Failed to load World ID');
        });
    }
  }, [action, appId, callbackUrl]);

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
      if (widgetRef.current && typeof widgetRef.current.open === 'function') {
        console.log('[WorldID] Opening IDKitWidget (web component) with action', action);
        widgetRef.current.open();
        openingRef.current = false;
        return;
      }
      const sdk: any = (window as any).IDKit ?? (window as any).WorldID?.IDKit ?? (window as any).worldID?.IDKit;
      if (!sdk || typeof sdk.open !== 'function') {
        throw new Error('IDKit SDK not found');
      }
      console.log('[WorldID] Opening fallback SDK.open with action', action);
      sdk.open({
        app_id: appId,
        action,
        verification_level: 'orb',
        enableTelemetry: true,
        options: { theme: 'auto' },
        handleVerify: (proof: unknown) => {
          console.log('Proof:', proof);
        },
        onSuccess: (result: unknown) => {
          console.log('Success');
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
    <View testID="worldid-container">
      {!!error && (
        <Text style={{ color: '#EF4444', marginBottom: 8 }} testID="worldid-error">{error}</Text>
      )}
      <TouchableOpacity
        disabled={!ready}
        onPress={onPress}
        style={[styles.verifyBtn, { backgroundColor: ready ? currentTheme.primary : currentTheme.border }]}
        testID={testID ?? 'verify-with-worldid'}
        accessibilityRole="button"
        accessibilityLabel="Verify with World ID"
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
