import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import 'mathlive';

const MathEditor = forwardRef(({ value, onChange }, ref) => {
  const mfRef = useRef(null);

  useImperativeHandle(ref, () => ({
    insert: (latex) => {
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

      const handleInput = (evt) => {
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
