import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Clock, X, Check } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';

interface TimePickerModalProps {
  visible: boolean;
  currentTime?: string;
  onSelectTime: (timeString: string) => void;
  onClose: () => void;
}

const QUICK_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '11:30 AM',
  '12:30 PM',
  '01:30 PM',
  '03:00 PM',
  '04:30 PM',
  '06:00 PM',
  '07:30 PM',
  '08:30 PM',
];

const parseInitialTime = (timeStr?: string) => {
  const defaultTime =
    timeStr ||
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const match = defaultTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  return {
    selectedTime: defaultTime,
    hour: match ? match[1].padStart(2, '0') : '11',
    minute: match ? match[2] : '30',
    period: (match && match[3] ? match[3].toUpperCase() : 'AM') as 'AM' | 'PM',
  };
};

const TimePickerModalContent: React.FC<{
  currentTime?: string;
  onSelectTime: (timeString: string) => void;
  onClose: () => void;
}> = ({ currentTime, onSelectTime, onClose }) => {
  const { isDark } = useTheme();
  const init = parseInitialTime(currentTime);

  const [selectedTime, setSelectedTime] = useState(init.selectedTime);
  const [hour, setHour] = useState(init.hour);
  const [minute, setMinute] = useState(init.minute);
  const [period, setPeriod] = useState<'AM' | 'PM'>(init.period);

  const handleSetCurrent = () => {
    const cur = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    setSelectedTime(cur);
    onSelectTime(cur);
    onClose();
  };

  const handleApplyCustom = () => {
    const h = parseInt(hour, 10);
    const m = parseInt(minute, 10);
    const validH = isNaN(h) ? 11 : Math.max(1, Math.min(12, h));
    const validM = isNaN(m) ? 0 : Math.max(0, Math.min(59, m));
    const formatted = `${String(validH).padStart(2, '0')}:${String(validM).padStart(2, '0')} ${period}`;
    setSelectedTime(formatted);
    onSelectTime(formatted);
    onClose();
  };

  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const inputBg = isDark ? '#1C2538' : '#F1F5F9';

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        width: '100%',
        maxWidth: 380,
        backgroundColor: isDark ? '#141926' : '#FFFFFF',
        borderRadius: 24,
        padding: 22,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Clock size={20} color={isDark ? '#60A5FA' : '#153580'} />
          <Text style={{ fontSize: 18, fontWeight: '800', color: textPrimary }}>
            Select Intake Time
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} hitSlop={10}>
          <X size={20} color={textMuted} />
        </TouchableOpacity>
      </View>

      {/* Quick Now Button */}
      <TouchableOpacity
        onPress={handleSetCurrent}
        style={{
          backgroundColor: isDark ? '#1C2538' : '#EFF6FF',
          paddingVertical: 12,
          borderRadius: 14,
          alignItems: 'center',
          marginBottom: 16,
          borderWidth: 1,
          borderColor: isDark ? '#2D3A54' : '#BFDBFE',
        }}
      >
        <Text style={{ color: isDark ? '#60A5FA' : '#153580', fontSize: 13, fontWeight: '800' }}>
          ⚡ Set to Current Time ({new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
        </Text>
      </TouchableOpacity>

      {/* Time Picker Controls (Hour : Minute AM/PM) */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: inputBg,
          borderRadius: 16,
          padding: 12,
          marginBottom: 18,
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: textMuted, marginBottom: 4 }}>
            HOUR
          </Text>
          <TextInput
            value={hour}
            onChangeText={(val) => setHour(val.replace(/\D/g, '').slice(0, 2))}
            keyboardType="numeric"
            maxLength={2}
            style={{
              fontSize: 22,
              fontWeight: '900',
              color: textPrimary,
              backgroundColor: isDark ? '#141926' : '#FFFFFF',
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 6,
              textAlign: 'center',
              minWidth: 50,
            }}
          />
        </View>

        <Text style={{ fontSize: 24, fontWeight: '900', color: textPrimary, marginTop: 14 }}>:</Text>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: textMuted, marginBottom: 4 }}>
            MIN
          </Text>
          <TextInput
            value={minute}
            onChangeText={(val) => setMinute(val.replace(/\D/g, '').slice(0, 2))}
            keyboardType="numeric"
            maxLength={2}
            style={{
              fontSize: 22,
              fontWeight: '900',
              color: textPrimary,
              backgroundColor: isDark ? '#141926' : '#FFFFFF',
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 6,
              textAlign: 'center',
              minWidth: 50,
            }}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 4, marginLeft: 8, marginTop: 14 }}>
          <TouchableOpacity
            onPress={() => setPeriod('AM')}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: period === 'AM' ? (isDark ? '#60A5FA' : '#153580') : (isDark ? '#141926' : '#E2E8F0'),
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '800', color: period === 'AM' ? '#FFFFFF' : textPrimary }}>
              AM
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPeriod('PM')}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: period === 'PM' ? (isDark ? '#60A5FA' : '#153580') : (isDark ? '#141926' : '#E2E8F0'),
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '800', color: period === 'PM' ? '#FFFFFF' : textPrimary }}>
              PM
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Slots */}
      <Text style={{ fontSize: 11, fontWeight: '700', color: textMuted, textTransform: 'uppercase', marginBottom: 10 }}>
        Quick Common Hours:
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {QUICK_SLOTS.map((slot) => {
          const isSelected = selectedTime === slot;
          return (
            <TouchableOpacity
              key={slot}
              onPress={() => {
                setSelectedTime(slot);
                onSelectTime(slot);
                onClose();
              }}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 10,
                backgroundColor: isSelected ? (isDark ? '#FFFFFF' : '#153580') : (isDark ? '#1C2538' : '#F1F5F9'),
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: isSelected ? (isDark ? '#0C1829' : '#FFFFFF') : textPrimary,
                }}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 14,
            alignItems: 'center',
            backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
          }}
        >
          <Text style={{ color: textPrimary, fontSize: 14, fontWeight: '700' }}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleApplyCustom}
          style={{
            flex: 1.5,
            backgroundColor: '#153580',
            borderRadius: 14,
            paddingVertical: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Check size={16} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>Set Time</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  currentTime,
  onSelectTime,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}
      >
        <TimePickerModalContent
          key={`${visible}-${currentTime || ''}`}
          currentTime={currentTime}
          onSelectTime={onSelectTime}
          onClose={onClose}
        />
      </TouchableOpacity>
    </Modal>
  );
};
