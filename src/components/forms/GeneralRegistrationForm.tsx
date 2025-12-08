import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { attendeeSchema, type AttendeeFormData } from '@/schemas/formSchemas';
import { formsAPI } from '@/api/forms';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import ModalBase from './ModalBase';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface GeneralRegistrationFormProps {
  onClose: () => void;
}

const GeneralRegistrationForm: React.FC<GeneralRegistrationFormProps> = ({ onClose }) => {
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const [submitted, setSubmitted] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, isValidating },
    watch
  } = useForm<AttendeeFormData>({
    resolver: zodResolver(attendeeSchema),
    mode: 'onChange' // Enable real-time validation
  });

  // Watch all fields for real-time validation
  const watchedFields = watch();

  // Form-level validation summary
  const validationSummary = useMemo(() => {
    const errorCount = Object.keys(errors).length;
    const fieldCount = Object.keys(touchedFields).length;
    const totalFields = Object.keys(attendeeSchema.shape).length;
    
    return {
      errorCount,
      fieldCount,
      totalFields,
      completionPercentage: Math.round((fieldCount / totalFields) * 100),
      hasErrors: errorCount > 0
    };
  }, [errors, touchedFields]);

  const onSubmit = async (data: AttendeeFormData) => {
    try {
      const result = await formsAPI.submitAttendee(data);
      if (result.success) {
        setSubmitted(true);
        setTimeout(onClose, 2000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (submitted) {
    return (
      <ModalBase title={t.forms.general_title} onClose={onClose} theme={theme}>
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
            <CheckCircle2 size={40} />
          </div>
          <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{t.forms.success}</h3>
          <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>See you in Baghdad!</p>
        </div>
      </ModalBase>
    );
  }

  return (
    <ModalBase title={t.forms.general_title} onClose={onClose} theme={theme}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Form-level validation summary */}
        {validationSummary.fieldCount > 0 && (
          <div className={`p-4 rounded-lg border ${
            validationSummary.hasErrors
              ? theme === 'light'
                ? 'bg-red-50 border-red-200'
                : 'bg-red-500/10 border-red-500/30'
              : theme === 'light'
              ? 'bg-blue-50 border-blue-200'
              : 'bg-blue-500/10 border-blue-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {validationSummary.hasErrors ? (
                <AlertCircle size={16} className={theme === 'light' ? 'text-red-600' : 'text-red-400'} />
              ) : (
                <CheckCircle2 size={16} className={theme === 'light' ? 'text-blue-600' : 'text-blue-400'} />
              )}
              <span className={`text-sm font-medium ${
                validationSummary.hasErrors
                  ? theme === 'light' ? 'text-red-800' : 'text-red-300'
                  : theme === 'light' ? 'text-blue-800' : 'text-blue-300'
              }`}>
                {validationSummary.hasErrors
                  ? `${validationSummary.errorCount} ${lang === 'ar' ? 'أخطاء' : 'error(s)'} found`
                  : lang === 'ar' ? 'جميع الحقول صحيحة' : 'All fields valid'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex-1 h-2 rounded-full ${
                theme === 'light' ? 'bg-gray-200' : 'bg-white/10'
              }`}>
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    validationSummary.hasErrors
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${validationSummary.completionPercentage}%` }}
                />
              </div>
              <span className={`text-xs ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {validationSummary.completionPercentage}%
              </span>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label={t.forms.name}
            type="text"
            {...register('name')}
            error={errors.name?.message}
            required
            className={isValidating && watchedFields.name ? 'animate-pulse' : ''}
          />
          <Input
            label={t.forms.age}
            type="number"
            {...register('age', { valueAsNumber: true })}
            error={errors.age?.message}
            required
            className={isValidating && watchedFields.age ? 'animate-pulse' : ''}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={`block text-sm font-medium mb-1.5 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {t.forms.occupation}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              {...register('occupation')}
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                errors.occupation
                  ? theme === 'light'
                    ? 'border-red-500 bg-red-50 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-red-500 bg-red-500/10 focus:border-red-400 focus:ring-red-400/20'
                  : theme === 'light'
                  ? 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'
                  : 'border-white/10 bg-white/5 focus:border-blue-500 focus:ring-blue-500/20'
              } focus:outline-none focus:ring-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}
            >
              <option value="">Select...</option>
              <option>Student</option>
              <option>Employee</option>
              <option>Self-Employed</option>
              <option>Researcher</option>
              <option>Other</option>
            </select>
            {errors.occupation && (
              <p className="mt-1.5 text-sm text-red-500">{errors.occupation.message}</p>
            )}
          </div>
          <Input
            label={t.forms.institution}
            type="text"
            {...register('institution')}
            error={errors.institution?.message}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label={t.forms.email}
            type="email"
            {...register('email')}
            error={errors.email?.message}
            required
            className={isValidating && watchedFields.email ? 'animate-pulse' : ''}
          />
          <Input
            label={t.forms.phone}
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            required
            className={isValidating && watchedFields.phone ? 'animate-pulse' : ''}
          />
        </div>

        <div className="space-y-2">
          <label className={`block text-sm font-medium mb-1.5 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            {t.forms.motivation}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            {...register('motivation')}
            rows={4}
            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
              errors.motivation
                ? theme === 'light'
                  ? 'border-red-500 bg-red-50 focus:border-red-400 focus:ring-red-400/20'
                  : 'border-red-500 bg-red-500/10 focus:border-red-400 focus:ring-red-400/20'
                : theme === 'light'
                ? 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'
                : 'border-white/10 bg-white/5 focus:border-blue-500 focus:ring-blue-500/20'
            } focus:outline-none focus:ring-2 ${
              theme === 'light' ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-gray-500'
            } ${isValidating && watchedFields.motivation ? 'animate-pulse' : ''}`}
          />
          {errors.motivation && (
            <p className="mt-1.5 text-sm text-red-500">{errors.motivation.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 rounded-lg font-bold text-white transition-all ${
            isSubmitting
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'
          }`}
        >
          {isSubmitting ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : t.forms.submit}
        </button>
      </form>
    </ModalBase>
  );
};

export default GeneralRegistrationForm;

