// ============================================================
// BankPaymentSelector Component — Cool Car Workshop
// Dynamic Payment Mode selector (Cash, UPI, Card Swipe)
// with Dynamic Bank Account Binding
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {
  Banknote,
  QrCode,
  CreditCard,
  ChevronDown,
  Building,
  Check,
  Plus,
  X,
} from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useBankAccountStore, selectActiveAccounts } from '../../store/bankAccountStore';
import { PaymentMode } from '../../types/payment.types';
import { router } from 'expo-router';
import { formatCurrency } from '../../utils/currency';

interface BankPaymentSelectorProps {
  paymentMode: PaymentMode;
  onPaymentModeChange: (mode: PaymentMode) => void;
  selectedAccountId?: string;
  onAccountChange: (accountId: string, accountName: string) => void;
  label?: string;
}

export function BankPaymentSelector({
  paymentMode,
  onPaymentModeChange,
  selectedAccountId,
  onAccountChange,
  label = 'Payment Mode & Bank Account',
}: BankPaymentSelectorProps) {
  const { isDark } = useTheme();
  const accounts = useBankAccountStore(selectActiveAccounts);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter bank accounts (exclude pure cash account for UPI/Card)
  const bankOnlyAccounts = accounts.filter((a) => a.accountType !== 'CASH_IN_HAND');
  const cashAccount = accounts.find((a) => a.accountType === 'CASH_IN_HAND');

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  const handleSelectMode = (mode: PaymentMode) => {
    onPaymentModeChange(mode);
    if (mode === 'CASH') {
      if (cashAccount) {
        onAccountChange(cashAccount.id, cashAccount.accountName);
      }
    } else {
      // If UPI or Card Swipe, default to first bank account if none selected
      if (!selectedAccountId || selectedAccountId === cashAccount?.id) {
        if (bankOnlyAccounts.length > 0) {
          onAccountChange(bankOnlyAccounts[0].id, bankOnlyAccounts[0].accountName);
        }
      }
    }
  };

  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.08)';

  return (
    <View style={{ marginBottom: 16 }}>
      {label ? (
        <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829', marginBottom: 8 }}>
          {label}
        </Text>
      ) : null}

      {/* 3 Capsule Tabs for Payment Mode */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: isDark ? '#141926' : '#F1F5F9',
          borderRadius: 18,
          padding: 4,
          marginBottom: 10,
          gap: 4,
        }}
      >
        {/* Cash */}
        <TouchableOpacity
          onPress={() => handleSelectMode('CASH')}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingVertical: 10,
            borderRadius: 14,
            backgroundColor: paymentMode === 'CASH' ? (isDark ? '#FFFFFF' : '#0C1829') : 'transparent',
          }}
        >
          <Banknote
            size={16}
            color={paymentMode === 'CASH' ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B')}
          />
          <Text
            style={{
              fontSize: 13,
              fontWeight: '800',
              color: paymentMode === 'CASH' ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'),
            }}
          >
            Cash
          </Text>
        </TouchableOpacity>

        {/* UPI */}
        <TouchableOpacity
          onPress={() => handleSelectMode('UPI')}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingVertical: 10,
            borderRadius: 14,
            backgroundColor: paymentMode === 'UPI' ? (isDark ? '#FFFFFF' : '#0C1829') : 'transparent',
          }}
        >
          <QrCode
            size={16}
            color={paymentMode === 'UPI' ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B')}
          />
          <Text
            style={{
              fontSize: 13,
              fontWeight: '800',
              color: paymentMode === 'UPI' ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'),
            }}
          >
            UPI
          </Text>
        </TouchableOpacity>

        {/* Card Swipe */}
        <TouchableOpacity
          onPress={() => handleSelectMode('CARD_SWIPE')}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingVertical: 10,
            borderRadius: 14,
            backgroundColor: paymentMode === 'CARD_SWIPE' ? (isDark ? '#FFFFFF' : '#0C1829') : 'transparent',
          }}
        >
          <CreditCard
            size={16}
            color={paymentMode === 'CARD_SWIPE' ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B')}
          />
          <Text
            style={{
              fontSize: 13,
              fontWeight: '800',
              color: paymentMode === 'CARD_SWIPE' ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'),
            }}
          >
            Swipe
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Bank Account Display / Selector */}
      {paymentMode === 'CASH' ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            padding: 12,
            borderRadius: 16,
            backgroundColor: isDark ? '#1C2538' : '#F8FAFD',
            borderWidth: 1,
            borderColor: cardBorder,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#34D399',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Banknote size={16} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
              Cash in Hand / Cash Counter
            </Text>
            <Text style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>
              Balance: {formatCurrency(cashAccount?.currentBalance || 0)}
            </Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 12,
            borderRadius: 16,
            backgroundColor: isDark ? '#1C2538' : '#F8FAFD',
            borderWidth: 1,
            borderColor: cardBorder,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: paymentMode === 'UPI' ? '#6B9FE8' : '#8B5CF6',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {paymentMode === 'UPI' ? <QrCode size={16} color="#FFFFFF" /> : <CreditCard size={16} color="#FFFFFF" />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>
                {paymentMode === 'UPI' ? 'UPI Bank Account' : 'Card Swipe Machine A/c'}
              </Text>
              <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829', marginTop: 1 }}>
                {selectedAccount?.accountName || 'Select Bank Account'}
              </Text>
            </View>
          </View>
          <ChevronDown size={18} color="#64748B" />
        </TouchableOpacity>
      )}

      {/* Modal to choose from Unlimited Bank Accounts */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? '#111622' : '#FFFFFF',
              borderRadius: 28,
              padding: 22,
              maxHeight: 480,
              gap: 16,
              borderWidth: 1,
              borderColor: cardBorder,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 17, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                  Select Bank Account
                </Text>
                <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  For {paymentMode === 'UPI' ? 'UPI QR payment' : 'Card Swipe machine'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {bankOnlyAccounts.map((acc) => {
                const isSelected = acc.id === selectedAccountId;
                return (
                  <TouchableOpacity
                    key={acc.id}
                    onPress={() => {
                      onAccountChange(acc.id, acc.accountName);
                      setModalVisible(false);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 14,
                      borderRadius: 18,
                      backgroundColor: isSelected
                        ? (isDark ? '#FFFFFF' : '#0C1829')
                        : (isDark ? '#1C2538' : '#F8FAFD'),
                      borderWidth: 1,
                      borderColor: isSelected ? (isDark ? '#FFFFFF' : '#0C1829') : cardBorder,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: isSelected
                            ? (isDark ? '#0C1829' : '#FFFFFF')
                            : (isDark ? '#26334D' : '#E2E8F0'),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Building
                          size={18}
                          color={isSelected ? (isDark ? '#FFFFFF' : '#0C1829') : '#6B9FE8'}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '800',
                            color: isSelected
                              ? (isDark ? '#0C1829' : '#FFFFFF')
                              : (isDark ? '#FFFFFF' : '#0C1829'),
                          }}
                        >
                          {acc.accountName}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: isSelected
                              ? (isDark ? 'rgba(12,24,41,0.7)' : 'rgba(255,255,255,0.7)')
                              : '#64748B',
                            marginTop: 1,
                          }}
                        >
                          {acc.bankName} • Bal: {formatCurrency(acc.currentBalance)}
                        </Text>
                      </View>
                    </View>

                    {isSelected && (
                      <Check
                        size={18}
                        color={isDark ? '#0C1829' : '#FFFFFF'}
                        strokeWidth={3}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Quick Button to Add New Bank Account */}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                router.push('/bank-accounts/add' as any);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                paddingVertical: 12,
                borderRadius: 16,
                backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
              }}
            >
              <Plus size={16} color={isDark ? '#FFFFFF' : '#0C1829'} />
              <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                + Add Another Bank Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
