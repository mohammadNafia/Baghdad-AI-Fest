import React, { useMemo, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { attendeeSchema, type AttendeeFormData } from '@/schemas/formSchemas';
import { formsAPI } from '@/api/forms';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import ModalBase from './ModalBase';
import { CheckCircle2, AlertCircle, Download, Calendar, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { SummitLogo } from '@/components/SummitLogo';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface GeneralRegistrationFormProps {
  onClose: () => void;
}

const GeneralRegistrationForm: React.FC<GeneralRegistrationFormProps> = ({ onClose }) => {
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<AttendeeFormData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, isValidating },
    watch
  } = useForm<AttendeeFormData & { newsletter?: boolean }>({
    resolver: zodResolver(attendeeSchema),
    mode: 'onChange'
  });

  const watchedFields = watch();

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

  const generateQRCode = async (email: string) => {
    try {
      const url = await QRCode.toDataURL(email, {
        width: 150,
        margin: 2,
        color: {
          dark: '#1e40af',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error('QR Code generation error:', err);
    }
  };

  const onSubmit = async (data: AttendeeFormData & { newsletter?: boolean }) => {
    try {
      const result = await formsAPI.submitAttendee(data);
      if (result.success) {
        setSubmittedData(data);
        await generateQRCode(data.email);
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const downloadTicketPDF = async () => {
    if (!ticketRef.current) return;
    
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100, 150]
      });
      
      const imgWidth = 100;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Baghdad_AI_Ticket.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };


  // Success View with Ticket
  if (submitted && submittedData) {
    return (
      <ModalBase title={lang === 'ar' ? 'تم التسجيل بنجاح!' : 'Registration Successful!'} onClose={onClose} theme={theme}>
        <div className="flex flex-col items-center py-8 space-y-8">
          {/* Ticket Content - This is what gets captured for PDF */}
          <div 
            id="ticket-content" 
            ref={ticketRef}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm border-2 border-blue-100"
          >
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-white/20 rounded-full p-3">
                  <SummitLogo className="w-10 h-10" />
                </div>
              </div>
              <h3 className="text-white font-bold text-xl tracking-tight">Baghdad AI Summit</h3>
              <p className="text-blue-100 text-sm mt-1">2026</p>
            </div>
            
            {/* Ticket Body */}
            <div className="p-6 space-y-5">
              {/* Attendee Name - Enhanced Typography */}
              <div className="text-center border-b border-dashed border-gray-200 pb-5">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
                  {lang === 'ar' ? 'اسم المشارك' : 'Attendee Name'}
                </p>
                <p className="text-gray-900 font-bold text-2xl tracking-tight">{submittedData.name}</p>
              </div>
              
              {/* Event Details */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1.5">
                    <Calendar size={14} />
                    <span className="text-xs uppercase tracking-wider font-medium">
                      {lang === 'ar' ? 'التاريخ' : 'Date'}
                    </span>
                  </div>
                  <p className="text-gray-900 font-semibold text-sm">Jan 27, 2026</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1.5">
                    <MapPin size={14} />
                    <span className="text-xs uppercase tracking-wider font-medium">
                      {lang === 'ar' ? 'المكان' : 'Venue'}
                    </span>
                  </div>
                  <p className="text-gray-900 font-semibold text-sm">The Station</p>
                </div>
              </div>
              
              {/* QR Code - Perfectly Centered */}
              <div className="flex flex-col items-center justify-center pt-5 border-t border-dashed border-gray-200">
                {qrCodeUrl && (
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                    <img src={qrCodeUrl} alt="QR Code" className="w-28 h-28 mx-auto" />
                  </div>
                )}
                <p className="text-gray-400 text-xs mt-3 font-mono">{submittedData.email}</p>
              </div>
            </div>
            
            {/* Ticket Footer */}
            <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
              <p className="text-gray-400 text-xs">
                {lang === 'ar' ? 'احتفظ بهذه التذكرة للدخول' : 'Present this ticket at entry'}
              </p>
            </div>
          </div>
          
          {/* Download Button - Centered with hover animation */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={downloadTicketPDF}
              disabled={isGeneratingPDF}
              className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all transform hover:-translate-y-0.5 ${
                isGeneratingPDF
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <Download size={18} />
              {isGeneratingPDF 
                ? (lang === 'ar' ? 'جاري التحميل...' : 'Generating...') 
                : (lang === 'ar' ? 'تحميل التذكرة (PDF)' : 'Download Ticket (PDF)')}
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`text-sm transition-colors ${
                theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
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

        {/* Row 1: Name & Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t.forms.name}
            type="text"
            {...register('name')}
            error={errors.name?.message}
            required
            className={`focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${isValidating && watchedFields.name ? 'animate-pulse' : ''}`}
          />
          <Input
            label={t.forms.age}
            type="number"
            {...register('age', { valueAsNumber: true })}
            error={errors.age?.message}
            required
            className={`focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${isValidating && watchedFields.age ? 'animate-pulse' : ''}`}
          />
        </div>

        {/* Row 2: Occupation & Institution - Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {t.forms.occupation}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              {...register('occupation')}
              className={`w-full px-3 py-2.5 rounded-lg border transition-all ${
                errors.occupation
                  ? theme === 'light'
                    ? 'border-red-500 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                    : 'border-red-500 bg-red-500/10 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                  : theme === 'light'
                  ? 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  : 'border-white/10 bg-white/5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              } focus:outline-none ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}
            >
              <option value="">{lang === 'ar' ? 'اختر...' : 'Select...'}</option>
              <option value="Student">{lang === 'ar' ? 'طالب' : 'Student'}</option>
              <option value="Employee">{lang === 'ar' ? 'موظف' : 'Employee'}</option>
              <option value="Self-Employed">{lang === 'ar' ? 'عمل حر' : 'Self-Employed'}</option>
              <option value="Researcher">{lang === 'ar' ? 'باحث' : 'Researcher'}</option>
              <option value="Other">{lang === 'ar' ? 'أخرى' : 'Other'}</option>
            </select>
            {errors.occupation && (
              <p className="mt-1 text-sm text-red-500">{errors.occupation.message}</p>
            )}
          </div>
          <Input
            label={t.forms.institution}
            type="text"
            {...register('institution')}
            error={errors.institution?.message}
            className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Row 3: Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t.forms.email}
            type="email"
            {...register('email')}
            error={errors.email?.message}
            required
            className={`focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${isValidating && watchedFields.email ? 'animate-pulse' : ''}`}
          />
          <Input
            label={t.forms.phone}
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            required
            className={`focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${isValidating && watchedFields.phone ? 'animate-pulse' : ''}`}
          />
        </div>

        {/* Row 4: Motivation */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            {t.forms.motivation}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            {...register('motivation')}
            rows={4}
            className={`w-full px-3 py-2.5 rounded-lg border transition-all ${
              errors.motivation
                ? theme === 'light'
                  ? 'border-red-500 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                  : 'border-red-500 bg-red-500/10 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                : theme === 'light'
                ? 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                : 'border-white/10 bg-white/5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            } focus:outline-none ${
              theme === 'light' ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-gray-500'
            } ${isValidating && watchedFields.motivation ? 'animate-pulse' : ''}`}
            placeholder={lang === 'ar' ? 'أخبرنا عن سبب اهتمامك بالحضور...' : 'Tell us why you are interested in attending...'}
          />
          {errors.motivation && (
            <p className="mt-1 text-sm text-red-500">{errors.motivation.message}</p>
          )}
        </div>

        {/* Newsletter Checkbox - More Subtle */}
        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="newsletter"
            {...register('newsletter')}
            className={`mt-0.5 w-4 h-4 rounded border transition-colors cursor-pointer focus:ring-2 focus:ring-blue-500/20 ${
              theme === 'light'
                ? 'border-gray-300 text-blue-600 focus:ring-blue-500'
                : 'border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500'
            }`}
          />
          <label 
            htmlFor="newsletter" 
            className={`text-xs cursor-pointer leading-relaxed ${
              theme === 'light' ? 'text-gray-500' : 'text-white/60'
            }`}
          >
            {lang === 'ar' 
              ? 'أبقني على اطلاع بأحدث فعاليات الذكاء الاصطناعي (النشرة الإخبارية)' 
              : 'Keep me updated on future AI events (Newsletter)'}
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 rounded-lg font-bold text-white transition-all transform hover:-translate-y-0.5 ${
            isSubmitting
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : t.forms.submit}
        </button>
      </form>
    </ModalBase>
  );
};

export default GeneralRegistrationForm;