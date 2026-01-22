import React, { useState, useEffect } from 'react';

export default function InkliWaitlist() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Auto-fade messages after 3 seconds
  useEffect(() => {
    if (status === 'error' || status === 'success') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      // Supabase configuration from environment variables
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase credentials are not configured');
      }

      const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json();
        // Check if email already exists
        if (error.code === '23505') {
          setStatus('error');
          setMessage('this email is already on the waitlist!');
        } else {
          throw new Error('failed to join waitlist :(');
        }
        return;
      }

      setStatus('success');
      setMessage('you\'re on the list -- we\'ll keep you in the loop!');
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setMessage('something went wrong. please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && email && status !== 'loading') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12" 
         style={{ backgroundColor: '#F5EDE1' }}>
      <div className="w-full max-w-md sm:max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-3xl flex items-center justify-center"
               style={{ backgroundColor: '#4EACE3' }}>
            <span className="text-white text-2xl sm:text-3xl md:text-4xl font-bold italic"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
              inkli
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center mb-2">
          <h1 className="text-2xl sm:text-3xl md:text-3xl italic mb-2"
              style={{ 
                color: '#5A4338',
                fontFamily: "'Playfair Display', serif"
              }}>
            you read it,
            <br />
            you rank it!
          </h1>
          <p className="text-xs sm:text-sm mt-3 sm:mt-4 mb-6 sm:mb-8"
             style={{ color: '#5A4338' }}>
            your new favorite social reading app &lt;3
          </p>
        </div>

        {/* Input Form */}
        <div className="space-y-3">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error' || status === 'success') setStatus('idle');
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 sm:px-6 py-3 sm:py-3.5 rounded-full border-2 text-center focus:outline-none transition-colors duration-500 text-sm sm:text-base"
            style={{ 
              borderColor: status === 'error' ? '#ef4444' : status === 'success' ? '#22c55e' : (isFocused ? '#4EACE3' : '#5A4338'),
              color: '#5A4338',
              backgroundColor: '#FFFFFF'
            }}
            disabled={status === 'loading'}
          />
          
          <button
            onClick={handleSubmit}
            disabled={status === 'loading' || !email}
            className="w-full py-3 sm:py-3.5 rounded-full text-white font-medium transition-opacity disabled:opacity-50 text-sm sm:text-base"
            style={{ backgroundColor: '#4EACE3' }}>
            {status === 'loading' ? 'joining...' : 'join the waitlist ;D'}
          </button>
        </div>

        {/* Error/Success message */}
        {(status === 'error' || status === 'success') && (
          <p className="text-center text-xs sm:text-sm mt-2 transition-opacity duration-500 px-4" style={{ color: status === 'success' ? '#22c55e' : '#ef4444' }}>
            {message}
          </p>
        )}
        
      </div>
    </div>
  );
}
