import { Platform } from 'react-native';

export const Colors = {
  brand: {
    deepBlue: '#1B3A8C',
    blue: '#2563EB',
    bluePressed: '#1D4ED8',
    white: '#FFFFFF',
    splashGradient: ['#2B4DC9', '#1B3A8C', '#0F1F5C'] as [string, string, string],
  },
  neutral: {
    dark: '#111827',
    body: '#374151',
    placeholder: '#9CA3AF',
    border: '#D1D5DB',
    borderError: '#EF4444',
    errorText: '#EF4444',
    hint: '#6B7280',
    background: '#FFFFFF',
    divider: '#E5E7EB',
    surface: '#F4F5F9',
    positive: '#16A34A',
  },
  quickAction: {
    topUp: { bg: '#EEF2FF', icon: '#4F46E5' },
    send: { bg: '#F3E8FF', icon: '#9333EA' },
    withdraw: { bg: '#DCFCE7', icon: '#16A34A' },
    request: { bg: '#FFEDD5', icon: '#EA580C' },
  },
  transaction: {
    music: { bg: '#DCFCE7', icon: '#16A34A' },
    sent: { bg: '#DBEAFE', icon: '#2563EB' },
    topUp: { bg: '#DCFCE7', icon: '#16A34A' },
  },
} as const;

export const Radius = {
  input: 10,
  button: 12,
  logo: 20,
  logoSmall: 14,
} as const;

export const Spacing = {
  screenH: 24,
  inputGap: 16,
  sectionGap: 32,
} as const;

export const Typography = {
  splashTagline: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    color: Colors.brand.white,
  },
  splashSubtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.80)',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: Colors.neutral.dark,
  },
  subheading: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: Colors.neutral.body,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.neutral.dark,
  },
  inputText: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: Colors.neutral.dark,
    fontFamily: Platform.OS === 'ios' ? 'System' : undefined,
  },
  hint: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.neutral.hint,
  },
  error: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.neutral.errorText,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  link: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.brand.blue,
  },
  finePrint: {
    fontSize: 11,
    fontWeight: '400' as const,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center' as const,
  },
  orDivider: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: '#6B7280',
  },
} as const;
