import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const REPORT_TYPES = [
  { key: 'WRONG_ANSWER', label: 'Wrong answer marked', icon: '❌' },
  { key: 'UNCLEAR_QUESTION', label: 'Question is unclear', icon: '❓' },
  { key: 'WRONG_TRANSLATION', label: 'Translation is wrong', icon: '🌐' },
  { key: 'IMAGE_BROKEN', label: 'Image not loading', icon: '🖼️' },
  { key: 'OTHER', label: 'Other issue', icon: '📝' },
] as const;

interface ReportIssueSheetProps {
  visible: boolean;
  onClose: () => void;
  questionId: string;
  chapterId?: string;
  onReported?: () => void;
}

export function ReportIssueSheet({
  visible,
  onClose,
  questionId,
  chapterId,
  onReported,
}: ReportIssueSheetProps) {
  const { colors } = useTheme();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  React.useEffect(() => {
    if (visible) {
      setSelectedType(null);
      setDescription('');
      setSubmitted(false);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 150,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!selectedType) return;
    setSubmitting(true);

    try {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();

        await supabase.from('med_quality_issues').insert({
          question_id: questionId,
          chapter_id: chapterId || null,
          issue_type: 'USER_REPORTED',
          severity: 'medium',
          source: 'user',
          status: 'open',
          details: {
            reportType: selectedType,
            description: description.trim() || undefined,
            reportedBy: user?.id || 'anonymous',
          },
        });
      }

      setSubmitted(true);
      onReported?.();
      setTimeout(onClose, 1200);
    } catch (e) {
      console.error('Failed to report issue:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Pressable>
            {/* Handle */}
            <View style={styles.handle}>
              <View style={[styles.handleBar, { backgroundColor: colors.surfaceBorder }]} />
            </View>

            {submitted ? (
              <View style={styles.successState}>
                <Text style={{ fontSize: 40 }}>✅</Text>
                <Text style={[Typography.h3, { color: colors.text, marginTop: 12 }]}>
                  Thanks for reporting!
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 4 }]}>
                  We'll review this question.
                </Text>
              </View>
            ) : (
              <>
                <Text style={[Typography.h3, { color: colors.text, paddingHorizontal: 20 }]}>
                  Report an issue
                </Text>
                <Text
                  style={[
                    Typography.bodySm,
                    { color: colors.textSecondary, paddingHorizontal: 20, marginTop: 4, marginBottom: 16 },
                  ]}
                >
                  What's wrong with this question?
                </Text>

                {/* Issue type chips */}
                <View style={styles.typeGrid}>
                  {REPORT_TYPES.map((rt) => (
                    <Pressable
                      key={rt.key}
                      onPress={() => setSelectedType(rt.key)}
                      style={[
                        styles.typeChip,
                        {
                          borderColor: selectedType === rt.key ? colors.primary : colors.surfaceBorder,
                          backgroundColor:
                            selectedType === rt.key ? colors.primary + '15' : colors.background,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 16 }}>{rt.icon}</Text>
                      <Text
                        style={[
                          Typography.bodySm,
                          {
                            color: selectedType === rt.key ? colors.primary : colors.text,
                            fontWeight: selectedType === rt.key ? '600' : '400',
                          },
                        ]}
                      >
                        {rt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Optional description */}
                <TextInput
                  style={[
                    styles.descInput,
                    {
                      borderColor: colors.surfaceBorder,
                      backgroundColor: colors.background,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Add details (optional)"
                  placeholderTextColor={colors.textSecondary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  maxLength={300}
                />

                {/* Submit */}
                <Pressable
                  onPress={handleSubmit}
                  disabled={!selectedType || submitting}
                  style={[
                    styles.submitBtn,
                    {
                      backgroundColor: selectedType ? colors.primary : colors.surfaceBorder,
                      opacity: submitting ? 0.6 : 1,
                    },
                  ]}
                >
                  <Text style={[Typography.button, { color: '#FFF' }]}>
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  handle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  successState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  descInput: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});
