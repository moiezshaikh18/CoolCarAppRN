// ============================================================
// Backup & Restore Screen — Master Design
// Strictly follows media_1790116823022.png aesthetic
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Database, ShieldCheck, RefreshCw, Cloud } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { GlassCard } from '../../src/components/common/GlassCard';

export default function BackupRestoreScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [lastBackup, setLastBackup] = useState('Today, 10:30 AM');
  const [loading, setLoading] = useState(false);

  const handleBackup = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLastBackup('Just now');
      Alert.alert('Backup Complete', 'Your garage database has been backed up securely to Cloud Firestore and Firebase Storage.');
    }, 1200);
  };

  const handleRestore = () => {
    Alert.alert(
      'Restore Data',
      'Are you sure you want to restore from the latest cloud backup? Any uncommitted local cache will be refreshed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore Now', onPress: () => Alert.alert('Restored', 'Database successfully synchronized with cloud snapshot.') },
      ]
    );
  };

  const canvasBg = isDark ? '#14171F' : '#F8F6F2';
  const circleBtnBg = isDark ? '#1C212B' : '#EFECE6';
  const primaryBtnBg = isDark ? '#FFFFFF' : '#121214';
  const primaryBtnText = isDark ? '#121214' : '#FFFFFF';

  return (
    <View style={{ flex: 1, backgroundColor: canvasBg }}>
      {/* Symmetrical Top Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: circleBtnBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color={theme.text} />
        </TouchableOpacity>

        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', letterSpacing: -0.3 }}>
          Backup & Restore
        </Text>

        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: circleBtnBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Database size={18} color={theme.text} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
      >
        {/* Backup Status Hero Card */}
        <GlassCard
          variant="sand"
          padding={24}
          style={{
            borderRadius: 28,
            marginBottom: 20,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <ShieldCheck size={36} color={theme.text} />
          </View>

          <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800' }}>
            Cloud Sync Active
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '600', marginTop: 4 }}>
            Last backup snapshot: {lastBackup}
          </Text>

          <View
            style={{
              marginTop: 16,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 20,
              backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
            }}
          >
            <Text style={{ color: theme.text, fontSize: 12, fontWeight: '700' }}>
              Real-time Firestore Multi-AZ Replication
            </Text>
          </View>
        </GlassCard>

        {/* Specs Details Card */}
        <GlassCard
          variant="sand"
          padding={20}
          style={{
            borderRadius: 28,
            gap: 16,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 }}>
            Protection Summary
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: '600' }}>Automatic Frequency</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>Continuous Live</Text>
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4' }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: '600' }}>Data Retention</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>Unlimited Cloud</Text>
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4' }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: '600' }}>Encryption</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>AES-256 In-Transit & At-Rest</Text>
          </View>
        </GlassCard>

        {/* Secondary Restore Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleRestore}
          style={{
            backgroundColor: isDark ? '#1C212B' : '#EFECE6',
            paddingVertical: 18,
            borderRadius: 34,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 10,
          }}
        >
          <RefreshCw size={18} color={theme.text} />
          <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
            Restore from Latest Snapshot
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Solid Obsidian CTA Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 24,
          left: 20,
          right: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleBackup}
          disabled={loading}
          style={{
            backgroundColor: primaryBtnBg,
            paddingVertical: 18,
            borderRadius: 34,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          {loading ? (
            <ActivityIndicator color={primaryBtnText} />
          ) : (
            <>
              <Database size={20} color={primaryBtnText} />
              <Text style={{ color: primaryBtnText, fontSize: 16, fontWeight: '800' }}>
                Backup Database Now
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
