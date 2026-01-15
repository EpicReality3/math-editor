import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import 'mathlive';
import type { MathEditorRef } from '../types';

interface MathEditorProps {
  value: string;
  onChange: (value: string) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': any;
    }
  }
}

const MathEditor = forwardRef<MathEditorRef, MathEditorProps>(({ value, onChange }, ref) => {
  const mfRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    insert: (latex: string) => {
      if (mfRef.current) {
        mfRef.current.executeCommand(['insert', latex]);
        mfRef.current.focus();
      }
    },
    focus: () => {
      if (mfRef.current) {
        mfRef.current.focus();
      }
    },
    getValue: () => {
      return mfRef.current?.value || '';
    }
  }));

  useEffect(() => {
    if (mfRef.current) {
      mfRef.current.smartMode = true;
      mfRef.current.virtualKeyboardMode = 'manual';

      const handleInput = (evt: any) => {
        if (onChange) {
          onChange(evt.target.value);
        }
      };

      mfRef.current.addEventListener('input', handleInput);

      return () => {
        mfRef.current?.removeEventListener('input', handleInput);
      };
    }
  }, [onChange]);

  useEffect(() => {
    if (mfRef.current && mfRef.current.value !== value) {
      mfRef.current.value = value;
    }
  }, [value]);

  return (
    <div className="math-editor-wrapper">
      <math-field
        ref={mfRef}
        className="math-field"
      >
        {value}
      </math-field>
    </div>
  );
});

MathEditor.displayName = 'MathEditor';

export default MathEditor;
