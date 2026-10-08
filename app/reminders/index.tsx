// ============================================================
// Screen 20: Reminders — Service & Payment Due Follow-ups
// Directly matching Screen 20 in Reference Design Mockup
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, User } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';

interface ReminderItem {
  id: string;
  name: string;
  type: string;
  dueText: string;
  avatarColor: string;
  avatarBg: string;
  isPendingPayment?: boolean;
}

const SAMPLE_REMINDERS: ReminderItem[] = [
  {
    id: '1',
    name: 'Ramesh Kumar',
    type: 'Next Service',
    dueText: '10 Aug 2025',
    avatarColor: '#0D9488',
    avatarBg: '#CCFBF1',
  },
  {
    id: '2',
    name: 'Ajay Singh',
    type: 'Pending Payment',
    dueText: '₹3,200',
    avatarColor: '#DC2626',
    avatarBg: '#FEE2E2',
    isPendingPayment: true,
  },
  {
    id: '3',
    name: 'Neha Sharma',
    type: 'Next Service',
    dueText: '18 Aug 2025',
    avatarColor: '#D97706',
    avatarBg: '#FEF3C7',
  },
];

export default function RemindersScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [reminders, setReminders] = useState<ReminderItem[]>(SAMPLE_REMINDERS);

  const handleAdd = () => {
    Alert.prompt
      ? Alert.prompt('New Reminder', 'Enter customer name', (text) => {
          if (text?.trim()) {
            setReminders([
              ...reminders,
              {
                id: Date.now().toString(),
                name: text.trim(),
                type: 'Next Service',
                dueText: '30 Aug 2025',
                avatarColor: '#2563EB',
                avatarBg: '#EFF6FF',
              },
            ]);
          }
        })
      : Alert.alert('New Reminder', 'Reminder scheduled.');
  };

  const bg = isDark ? '#0C1829' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = '#64748B';
  const cardBg = isDark ? '#111E33' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Top Header matching Screen 20 */}
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
          Reminders
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 90,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary, marginBottom: 16 }}>
          Upcoming Reminders
        </Text>

        <View style={{ gap: 12 }}>
          {reminders.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 14,
                paddingHorizontal: 16,
                backgroundColor: cardBg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    backgroundColor: item.avatarBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <User size={20} color={item.avatarColor} strokeWidth={2.4} />
                </View>

                <View>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: textPrimary }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: textMuted, fontWeight: '500', marginTop: 2 }}>
                    {item.type}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: item.isPendingPayment ? '#DC2626' : textMuted,
                }}
              >
                {item.dueText}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button matching Screen 20 */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 22,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 20,
          paddingTop: 12,
          backgroundColor: bg,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        <TouchableOpacity
          onPress={handleAdd}
          activeOpacity={0.88}
          style={{
            height: 52,
            backgroundColor: '#0C1829',
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#0C1829',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
            + Add Reminder
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
