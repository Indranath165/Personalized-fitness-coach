'use client';

import { useState, useRef, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { createClient } from '@/lib/supabase/client';
import { X, Phone, Shield } from 'lucide-react';

interface FirebasePhoneAuthProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

export default function FirebasePhoneAuth({ isOpen, onClose, mode }: FirebasePhoneAuthProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen && !recaptchaVerifier.current) {
      setupRecaptcha();
    }
    
    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      }
    };
  }, [isOpen]);

  const setupRecaptcha = () => {
    try {
      if (recaptchaRef.current) {
        recaptchaVerifier.current = new RecaptchaVerifier(auth, recaptchaRef.current, {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            setError('reCAPTCHA expired. Please try again.');
          }
        });
      }
    } catch (error) {
      console.error('Error setting up reCAPTCHA:', error);
      setError('Failed to initialize phone verification');
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // If it starts with 91 (India), add +
    if (digits.startsWith('91') && digits.length === 12) {
      return `+${digits}`;
    }
    
    // If it starts with 9 (Indian mobile), add +91
    if (digits.startsWith('9') && digits.length === 10) {
      return `+91${digits}`;
    }
    
    // If no country code, assume India
    if (digits.length === 10) {
      return `+91${digits}`;
    }
    
    // If already has +, return as is
    if (phone.startsWith('+')) {
      return phone;
    }
    
    return `+${digits}`;
  };

  const sendOTP = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Demo mode check - if Firebase is not configured properly
      const isDemo = process.env.NODE_ENV === 'development' && 
                     (window.location.hostname === 'localhost' || 
                      !auth.app.options.apiKey || 
                      auth.app.options.apiKey.includes('your-'));

      if (isDemo) {
        // Demo mode - simulate sending OTP
        setTimeout(() => {
          setStep('otp');
          setError('');
          setLoading(false);
          alert('DEMO MODE: Use OTP "123456" to continue');
        }, 2000);
        return;
      }
      
      if (!recaptchaVerifier.current) {
        setupRecaptcha();
      }

      if (!recaptchaVerifier.current) {
        throw new Error('Failed to initialize reCAPTCHA');
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifier.current
      );

      setConfirmationResult(confirmation);
      setStep('otp');
      setError('');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      if (error.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else if (error.code === 'auth/api-key-not-valid') {
        setError('Firebase not configured. Please check FIREBASE_SETUP_GUIDE.md');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Demo mode check
      const isDemo = process.env.NODE_ENV === 'development' && 
                     (window.location.hostname === 'localhost' || 
                      !auth.app.options.apiKey || 
                      auth.app.options.apiKey.includes('your-'));

      if (isDemo) {
        // Demo mode - accept "123456" as valid OTP
        if (otp === '123456') {
          setTimeout(() => {
            alert('DEMO MODE: Phone verification successful!\n\nIn production, this will create a real user account.');
            onClose();
            // You could redirect to dashboard here
            // window.location.href = '/dashboard';
            setLoading(false);
          }, 1000);
          return;
        } else {
          setError('Demo mode: Use OTP "123456"');
          setLoading(false);
          return;
        }
      }

      if (!confirmationResult) {
        setError('Please request OTP first');
        return;
      }

      // Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      const firebaseUser = result.user;

      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // Sign in to Supabase with Firebase token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'firebase',
        token: idToken,
      });

      if (error) {
        throw error;
      }

      // Success - close modal and redirect
      onClose();
      window.location.href = '/dashboard';
      
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      if (error.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please check and try again.');
      } else if (error.code === 'auth/code-expired') {
        setError('OTP expired. Please request a new one.');
      } else {
        setError('Failed to verify OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber('');
    setOtp('');
    setStep('phone');
    setError('');
    setConfirmationResult(null);
    if (recaptchaVerifier.current) {
      recaptchaVerifier.current.clear();
      recaptchaVerifier.current = null;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl max-w-md w-full p-6 relative shadow-2xl border border-white/20 dark:border-gray-700/20 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            {step === 'phone' ? (
              <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            ) : (
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {step === 'phone' ? 'Phone Verification' : 'Enter OTP'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {step === 'phone' 
              ? 'Enter your phone number to receive a verification code'
              : `Enter the 6-digit code sent to ${phoneNumber}`
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl backdrop-blur-sm">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Phone Number Step */}
        {step === 'phone' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 1234567890"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Enter with country code (e.g., +91 for India)
              </p>
            </div>

            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Sending...
                </div>
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center text-lg tracking-widest font-mono transition-all duration-200"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={verifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify & Continue'
                )}
              </button>

              <button
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setError('');
                }}
                className="w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-2 transition-colors duration-200"
                disabled={loading}
              >
                Change Phone Number
              </button>
            </div>
          </div>
        )}

        {/* reCAPTCHA container */}
        <div ref={recaptchaRef} id="recaptcha-container"></div>
      </div>
    </div>
  );
}
