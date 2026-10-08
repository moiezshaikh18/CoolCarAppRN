// ============================================================
// Screen 23: Backup & Restore — Cloud Snapshot & Data Safety
// Directly matching Screen 23 in Reference Design Mockup
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Cloud, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';

export default function BackupRestoreScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [lastBackup, setLastBackup] = useState('15 May 2025, 10:30 AM');
  const [loading, setLoading] = useState(false);

  const handleBackup = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      setLastBackup(`${dateStr}, ${timeStr}`);
      Alert.alert('Backup Complete', 'Your garage database has been backed up securely to Cloud Storage.');
    }, 1200);
  };

  const handleRestore = () => {
    Alert.alert(
      'Restore Data',
      'Are you sure you want to restore from the latest cloud backup? Any unsaved local cache will be refreshed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore Now', onPress: () => Alert.alert('Restored', 'Database successfully synchronized with cloud snapshot.') },
      ]
    );
  };

  const bg = isDark ? '#0C1829' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = '#64748B';
  const cardBg = isDark ? '#111E33' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Top Header matching Screen 23 */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{ width: 40, height: 40, justifyContent: 'center' }}
        >
          <ArrowLeft size={22} color={textPrimary} strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: '800', color: textPrimary }}>
          Backup & Restore
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: insets.bottom + 90,
          gap: 20,
        }}
      >
        {/* Last Backup Card matching Screen 23 */}
        <View
          style={{
            backgroundColor: isDark ? '#111E33' : '#F8FAFC',
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: borderColor,
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#EDE9FE',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Cloud size={30} color="#8B5CF6" strokeWidth={2.2} />
          </View>

          <Text style={{ fontSize: 13, fontWeight: '600', color: textMuted, marginBottom: 6 }}>
            Last Backup
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: textPrimary }}>
            {lastBackup}
          </Text>
        </View>

        {/* Action Buttons matching Screen 23 */}
        <View style={{ gap: 12 }}>
          {/* Backup Now Button */}
          <TouchableOpacity
            onPress={handleBackup}
            disabled={loading}
            activeOpacity={0.88}
            style={{
              backgroundColor: '#0C1829',
              paddingVertical: 16,
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <RefreshCw size={18} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>
                  Backup Now
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Restore Data Button */}
          <TouchableOpacity
            onPress={handleRestore}
            activeOpacity={0.88}
            style={{
              backgroundColor: cardBg,
              paddingVertical: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: borderColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: textPrimary, fontSize: 15, fontWeight: '700' }}>
              Restore Data
            </Text>
          </TouchableOpacity>
        </View>

        {/* Security badge matching Screen 23 */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 20,
          }}
        >
          <CheckCircle2 size={16} color="#10B981" strokeWidth={2.4} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: textMuted }}>
            Your data is safe and secure.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
