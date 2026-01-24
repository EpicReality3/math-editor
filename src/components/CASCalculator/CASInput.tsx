import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface CASInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export interface CASInputRef {
  focus: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<any>;
      };
    }
  }
}

export const CASInput = forwardRef<CASInputRef, CASInputProps>(
  ({ value, onChange, onSubmit, placeholder }, ref) => {
    const mfRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      focus: () => mfRef.current?.focus(),
      getValue: () => mfRef.current?.value || '',
      setValue: (val: string) => {
        if (mfRef.current) {
          mfRef.current.value = val;
        }
      },
    }));

    // Setup MathLive configuration and event listeners
    useEffect(() => {
      const mf = mfRef.current;
      if (!mf) return;

      // Configure MathLive
      mf.smartMode = true;
      mf.virtualKeyboardMode = 'manual';
      mf.keypressSound = null;
      mf.plonkSound = null;

      // Handle input changes
      const handleInput = () => {
        const newValue = mf.value;
        onChange(newValue);
      };

      // Handle Enter key
      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
          e.preventDefault();
          onSubmit();
        }
      };

      mf.addEventListener('input', handleInput);
      mf.addEventListener('keydown', handleKeydown);

      return () => {
        mf.removeEventListener('input', handleInput);
        mf.removeEventListener('keydown', handleKeydown);
      };
    }, [onChange, onSubmit]);

    // Update value when prop changes (for external updates like history reuse)
    useEffect(() => {
      const mf = mfRef.current;
      if (mf && mf.value !== value) {
        mf.value = value;
      }
    }, [value]);

    return (
      <div className="cas-input-container">
        <math-field
          ref={mfRef}
          className="cas-math-field"
          style={{
            width: '100%',
            fontSize: '1.25rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
        {!value && placeholder && (
          <span className="cas-input-placeholder">{placeholder}</span>
        )}
      </div>
    );
  }
);

CASInput.displayName = 'CASInput';
