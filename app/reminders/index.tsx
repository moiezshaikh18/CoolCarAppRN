// ============================================================
// Reminders Screen — Service & Payment Due Reminders
// Signature Sky Blue Header & Mega-Curved Lower Sheet
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
import { ArrowLeft, Plus, User, Bell } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';

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
    Alert.alert('New Reminder', 'Create custom follow-up reminder.');
  };

  const skyBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';

  return (
    <View style={{ flex: 1, backgroundColor: skyBg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'light-content'} backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.22)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
            Reminders
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
            Service due & balance follow-ups
          </Text>
        </View>
      </View>

      {/* Signature Mega-Curved Lower Content Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          paddingTop: 16,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110, paddingTop: 4 }}
        >
          <Text
            style={{
              color: theme.textMuted,
              fontSize: 12,
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 12,
              paddingLeft: 4,
            }}
          >
            Scheduled Reminders ({reminders.length})
          </Text>

          <View style={{ gap: 12 }}>
            {reminders.map((item) => {
              const isPayment = item.type.includes('Balance') || item.type.includes('Payment');
              return (
                <View
                  key={item.id}
                  style={{
                    backgroundColor: isDark ? '#101927' : '#FFFFFF',
                    borderRadius: 24,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    shadowColor: '#000',
                    shadowOpacity: isDark ? 0.3 : 0.04,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 2,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: isDark ? '#141926' : '#EFF6FF',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Bell size={22} color={isDark ? '#FFFFFF' : '#3B82F6'} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                        {item.name}
                      </Text>
                      <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2, fontWeight: '500' }}>
                        {item.type}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 10,
                      backgroundColor: isPayment
                        ? (isDark ? '#450A0A' : '#FEE2E2')
                        : (isDark ? '#064E3B' : '#DCFCE7'),
                    }}
                  >
                    <Text
                      style={{
                        color: isPayment
                          ? (isDark ? '#F87171' : '#DC2626')
                          : (isDark ? '#34D399' : '#15803D'),
                        fontSize: 12,
                        fontWeight: '800',
                      }}
                    >
                      {item.dueInfo}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Floating Midnight Navy CTA */}
        <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
          <TouchableOpacity
            onPress={handleAdd}
            activeOpacity={0.88}
            style={{
              backgroundColor: '#0C1829',
              paddingVertical: 16,
              borderRadius: 32,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 5 },
              elevation: 6,
            }}
          >
            <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              Add New Reminder
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
