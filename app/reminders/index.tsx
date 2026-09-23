// ============================================================
// Reminders Screen — Service & Payment Due Reminders
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, User, Calendar } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { GlassCard } from '../../src/components/common/GlassCard';

interface ReminderItem {
  id: string;
  name: string;
  type: string;
  dueInfo: string;
}

const SAMPLE_REMINDERS: ReminderItem[] = [
  { id: '1', name: 'Ramesh Kumar (Honda City)', type: 'Next Periodic Service', dueInfo: 'Due 10 Aug 2025' },
  { id: '2', name: 'Ajay Singh (Creta)', type: 'Pending Outstanding Balance', dueInfo: '₹3,200 Due' },
  { id: '3', name: 'Neha Sharma (Swift)', type: 'Brake Fluid Inspection', dueInfo: 'Due 18 Aug 2025' },
];

export default function RemindersScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [reminders, setReminders] = useState(SAMPLE_REMINDERS);

  const handleAdd = () => {
    Alert.alert('New Reminder', 'Reminder form opened.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Symmetrical Top Header */}
      <View
        style={{
          paddingTop: insets.top + 14,
          paddingHorizontal: 22,
          paddingBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isDark ? '#1C212B' : '#EFECE6',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color={theme.text} />
        </TouchableOpacity>
        <View>
          <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
            Reminders
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
            Service due & balance follow-ups
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 110 }}
      >
        <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, paddingLeft: 4 }}>
          Scheduled Reminders ({reminders.length})
        </Text>

        <View style={{ gap: 12 }}>
          {reminders.map((item) => {
            const isPayment = item.type.includes('Balance') || item.type.includes('Payment');
            return (
              <GlassCard
                key={item.id}
                variant="sand"
                padding={18}
                style={{
                  borderRadius: 28,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
                  <View
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 23,
                      backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    }}
                  >
                    <User size={20} color={theme.text} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                      {item.name}
                    </Text>
                    <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>
                      {item.type}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor: isPayment
                      ? (isDark ? '#7F1D1D' : '#FEE2E2')
                      : (isDark ? '#064E3B' : '#DCFCE7'),
                  }}
                >
                  <Text
                    style={{
                      color: isPayment
                        ? (isDark ? '#FCA5A5' : '#DC2626')
                        : (isDark ? '#6EE7B7' : '#15803D'),
                      fontSize: 12,
                      fontWeight: '800',
                    }}
                  >
                    {item.dueInfo}
                  </Text>
                </View>
              </GlassCard>
            );
          })}
        </View>
      </ScrollView>

      {/* Solid Black Pill Floating CTA Button */}
      <View style={{ position: 'absolute', bottom: 24, left: 22, right: 22 }}>
        <TouchableOpacity
          onPress={handleAdd}
          activeOpacity={0.88}
          style={{
            backgroundColor: isDark ? '#FFFFFF' : '#121214',
            paddingVertical: 18,
            borderRadius: 34,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <Plus size={20} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
          <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
            Add New Reminder
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
