import html2canvas from 'html2canvas';

export interface ExportOptions {
  scale?: number;
  backgroundColor?: string;
}

/**
 * Export equation as PNG image
 */
export async function exportAsPNG(
  equation: string,
  options: ExportOptions = {}
): Promise<Blob | null> {
  const { scale = 2, backgroundColor = 'transparent' } = options;

  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.padding = '20px';
  container.style.backgroundColor = backgroundColor;
  document.body.appendChild(container);

  // Create math field
  const mathField = document.createElement('math-field');
  mathField.setAttribute('read-only', 'true');
  mathField.style.fontSize = '2rem';
  mathField.style.border = 'none';
  mathField.style.background = 'transparent';
  mathField.textContent = equation;
  container.appendChild(mathField);

  try {
    // Wait a bit for MathLive to render
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture the element
    const canvas = await html2canvas(container, {
      scale,
      backgroundColor: backgroundColor === 'transparent' ? null : backgroundColor,
      logging: false,
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
 * Export equation as SVG
 */
export async function exportAsSVG(equation: string): Promise<string | null> {
  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  // Create math field
  const mathField = document.createElement('math-field');
  mathField.setAttribute('read-only', 'true');
  mathField.style.fontSize = '2rem';
  mathField.textContent = equation;
  container.appendChild(mathField);

  try {
    // Wait for MathLive to render
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get the SVG content from MathLive
    const svgElement = container.querySelector('svg');
    if (!svgElement) {
      return null;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    return svgString;
  } catch (error) {
    console.error('Error exporting as SVG:', error);
    return null;
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}
