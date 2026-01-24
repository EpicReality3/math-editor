import html2canvas from 'html2canvas';

export interface ExportOptions {
  scale?: number;
  backgroundColor?: string;
}

/**
 * Export equation as PNG image by capturing the math-field element
 * and hiding the textarea in the cloned document
 */
export async function exportAsPNG(
  equation: string,
  options: ExportOptions = {}
): Promise<Blob | null> {
  const { scale = 2, backgroundColor = 'transparent' } = options;

  // Create a temporary container with the math-field
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.padding = '20px';
  container.style.backgroundColor = backgroundColor;
  document.body.appendChild(container);

  // Create math field - MathLive handles all the rendering
  const mathField = document.createElement('math-field') as any;
  mathField.setAttribute('read-only', 'true');
  mathField.style.fontSize = '2rem';
  mathField.style.border = 'none';
  mathField.style.background = 'transparent';
  mathField.style.setProperty('--caret-color', 'transparent');
  mathField.value = equation;
  container.appendChild(mathField);

  try {
    // Wait for MathLive to render completely
    await new Promise(resolve => setTimeout(resolve, 300));
    await document.fonts.ready;

    // Capture the element with special handling for the cloned document
    const canvas = await html2canvas(container, {
      scale,
      backgroundColor: backgroundColor === 'transparent' ? null : backgroundColor,
      logging: false,
      onclone: (clonedDoc, clonedElement) => {
        // Add CSS to hide all textareas in the cloned document
        const style = clonedDoc.createElement('style');
        style.textContent = `
          textarea,
          .ML__keyboard-sink,
          [part="keyboard-sink"],
          input[type="text"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            position: absolute !important;
            left: -9999px !important;
          }
        `;
        clonedDoc.head.appendChild(style);

        // Directly remove textareas from cloned element
        clonedElement.querySelectorAll('textarea, input').forEach(el => {
          el.remove();
        });
      },
    });

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error exporting as PNG:', error);
    return null;
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy image to clipboard
 */
export async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  try {
    if (navigator.clipboard && 'write' in navigator.clipboard) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

/**
 * Export equation as SVG by rendering to canvas and embedding as image
 */
export async function exportAsSVG(equation: string): Promise<string | null> {
  // Create a temporary container with the math-field
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.padding = '20px';
  container.style.backgroundColor = 'transparent';
  document.body.appendChild(container);

  // Create math field
  const mathField = document.createElement('math-field') as any;
  mathField.setAttribute('read-only', 'true');
  mathField.style.fontSize = '2rem';
  mathField.style.border = 'none';
  mathField.style.background = 'transparent';
  mathField.style.setProperty('--caret-color', 'transparent');
  mathField.value = equation;
  container.appendChild(mathField);

  try {
    // Wait for MathLive to render completely
    await new Promise(resolve => setTimeout(resolve, 300));
    await document.fonts.ready;

    // Capture the element
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: null,
      logging: false,
      onclone: (clonedDoc, clonedElement) => {
        const style = clonedDoc.createElement('style');
        style.textContent = `
          textarea,
          .ML__keyboard-sink,
          [part="keyboard-sink"],
          input[type="text"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            position: absolute !important;
            left: -9999px !important;
          }
        `;
        clonedDoc.head.appendChild(style);
        clonedElement.querySelectorAll('textarea, input').forEach(el => {
          el.remove();
        });
      },
    });

    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/png');
    const width = canvas.width / 2; // Divide by scale
    const height = canvas.height / 2;

    // Create SVG with embedded image
    const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image width="${width}" height="${height}" xlink:href="${dataUrl}"/>
</svg>`;

    return svgString;
  } catch (error) {
    console.error('Error exporting as SVG:', error);
    return null;
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Download SVG string as a file
 */
export function downloadSVG(svgString: string, filename: string) {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  downloadBlob(blob, filename);
}
