import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useSettings } from '@/providers/SettingsProvider';

export default function CallbackScreen() {
  const params = useLocalSearchParams<{ result?: string }>();
  const { currentTheme, settings } = useSettings();
  const [parsed, setParsed] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (typeof params.result === 'string') {
        const decoded = decodeURIComponent(params.result);
        const obj = JSON.parse(decoded);
        setParsed(obj);
        console.log('[Callback] Parsed result', obj);
      } else {
        setError('No result provided');
      }
    } catch (e) {
      console.error('[Callback] parse error', e);
      setError((e as Error).message);
    }
  }, [params.result]);

  const lang = settings.language;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Stack.Screen options={{ headerShown: true, title: lang === 'zh' ? '驗證結果' : 'Verification' }} />
      <ScrollView contentContainerStyle={styles.content}>
        {error ? (
          <Text style={[styles.error, { color: '#EF4444' }]} testID="callback-error">{error}</Text>
        ) : (
          <View style={[styles.card, { backgroundColor: currentTheme.card }]} testID="callback-result">
            <Text style={[styles.title, { color: currentTheme.text }]}>
              {lang === 'zh' ? '驗證成功' : 'Verification Success'}
            </Text>
            <Text style={{ color: currentTheme.textSecondary, marginTop: 8 }}>
              {lang === 'zh' ? '我們已收到你的 World ID 驗證回調。' : 'We received your World ID verification callback.'}
            </Text>
            <View style={[styles.payload, { borderColor: currentTheme.border }]}>
              <Text style={{ color: currentTheme.textSecondary, fontSize: 12 }}>
                {JSON.stringify(parsed, null, 2)}
              </Text>
            </View>
            <TouchableOpacity style={[styles.btn, { backgroundColor: currentTheme.primary }]} onPress={() => router.replace('/(tabs)/profile')} testID="callback-done">
              <Text style={styles.btnText}>{lang === 'zh' ? '返回個人頁' : 'Back to Profile'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  card: { padding: 16, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  payload: { marginTop: 12, borderWidth: 1, borderRadius: 8, padding: 12 },
  btn: { marginTop: 16, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  error: { fontSize: 16 },
});
