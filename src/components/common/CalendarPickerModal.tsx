// ============================================================
// CalendarPickerModal Component — Cool Car Workshop
// Sleek Interactive Calendar Modal for picking dates & ranges
// ============================================================

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
  Check,
} from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';

export interface CalendarPickerModalProps {
  visible: boolean;
  selectedDate?: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  onClose: () => void;
  title?: string;
  minDate?: string;
  maxDate?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function CalendarPickerModal({
  visible,
  selectedDate,
  onSelectDate,
  onClose,
  title = 'Select Date',
}: CalendarPickerModalProps) {
  const { isDark } = useTheme();

  const initial = selectedDate ? new Date(selectedDate) : new Date();
  const [currentYear, setCurrentYear] = useState(
    isNaN(initial.getFullYear()) ? new Date().getFullYear() : initial.getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    isNaN(initial.getMonth()) ? new Date().getMonth() : initial.getMonth()
  );
  const [activeDate, setActiveDate] = useState(
    selectedDate || new Date().toISOString().split('T')[0]
  );

  if (!visible) return null;

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const daysGrid: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(d);
  }

  const handleSelectDay = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const formatted = `${currentYear}-${mm}-${dd}`;
    setActiveDate(formatted);
  };

  const handleConfirm = () => {
    onSelectDate(activeDate);
    onClose();
  };

  const handleSelectToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setActiveDate(today);
    onSelectDate(today);
    onClose();
  };

  const cardBg = isDark ? '#111827' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(12, 24, 41, 0.08)';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = isDark ? '#94A3B8' : '#64748B';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: cardBg, borderColor: cardBorder },
              ]}
            >
              {/* Header */}
              <View style={styles.headerRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <CalendarIcon size={18} color="#6B9FE8" />
                  <Text style={[styles.headerTitle, { color: textPrimary }]}>
                    {title}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={18} color={textMuted} />
                </TouchableOpacity>
              </View>

              {/* Month & Year Navigation */}
              <View style={styles.monthNavRow}>
                <TouchableOpacity
                  onPress={handlePrevMonth}
                  style={[
                    styles.navBtn,
                    { backgroundColor: isDark ? '#1C2538' : '#F1F5F9' },
                  ]}
                >
                  <ChevronLeft size={18} color={textPrimary} />
                </TouchableOpacity>

                <Text style={[styles.monthYearText, { color: textPrimary }]}>
                  {MONTHS[currentMonth]} {currentYear}
                </Text>

                <TouchableOpacity
                  onPress={handleNextMonth}
                  style={[
                    styles.navBtn,
                    { backgroundColor: isDark ? '#1C2538' : '#F1F5F9' },
                  ]}
                >
                  <ChevronRight size={18} color={textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Day of Week Headers */}
              <View style={styles.daysHeaderRow}>
                {DAYS_SHORT.map((day, idx) => (
                  <Text
                    key={idx}
                    style={[
                      styles.dayHeaderCell,
                      { color: idx === 0 ? '#EF4444' : textMuted },
                    ]}
                  >
                    {day}
                  </Text>
                ))}
              </View>

              {/* Days Grid */}
              <View style={styles.gridContainer}>
                {daysGrid.map((day, idx) => {
                  if (day === null) {
                    return <View key={idx} style={styles.dayCell} />;
                  }

                  const mm = String(currentMonth + 1).padStart(2, '0');
                  const dd = String(day).padStart(2, '0');
                  const dateStr = `${currentYear}-${mm}-${dd}`;
                  const isSelected = activeDate === dateStr;
                  const isToday =
                    dateStr === new Date().toISOString().split('T')[0];

                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleSelectDay(day)}
                      activeOpacity={0.75}
                      style={[
                        styles.dayCell,
                        isSelected && {
                          backgroundColor: '#6B9FE8',
                          borderRadius: 18,
                        },
                        isToday && !isSelected && {
                          borderWidth: 1.5,
                          borderColor: '#6B9FE8',
                          borderRadius: 18,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayCellText,
                          {
                            color: isSelected
                              ? '#FFFFFF'
                              : isToday
                              ? '#6B9FE8'
                              : textPrimary,
                            fontWeight: isSelected || isToday ? '900' : '600',
                          },
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Selected Date Summary */}
              <View style={styles.selectionPreviewRow}>
                <Text style={{ fontSize: 12, color: textMuted, fontWeight: '700' }}>
                  Selected:
                </Text>
                <Text style={{ fontSize: 13, fontWeight: '900', color: '#6B9FE8' }}>
                  {activeDate}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.footerRow}>
                <TouchableOpacity
                  onPress={handleSelectToday}
                  style={[
                    styles.secondaryBtn,
                    { backgroundColor: isDark ? '#1C2538' : '#F1F5F9' },
                  ]}
                >
                  <Text style={[styles.secondaryBtnText, { color: textPrimary }]}>
                    Today
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleConfirm}
                  style={styles.primaryBtn}
                >
                  <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.primaryBtnText}>Confirm Date</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthYearText: {
    fontSize: 15,
    fontWeight: '800',
  },
  daysHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  dayHeaderCell: {
    width: 38,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '800',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dayCellText: {
    fontSize: 13,
  },
  selectionPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.15)',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  primaryBtn: {
    flex: 1.6,
    backgroundColor: '#0C1829',
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

