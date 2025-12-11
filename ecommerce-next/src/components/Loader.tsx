// /src/components/Loader.tsx
import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string; // Allow external class passing
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', text, className = '' }) => {
  let diameter: string;
  let borderThickness: string = '3px';

  switch (size) {
    case 'sm':
      diameter = '20px';
      borderThickness = '2px';
      break;
    case 'lg':
      diameter = '48px';
      borderThickness = '4px';
      break;
    case 'md':
    default:
      diameter = '32px';
      break;
  }

  // Use inline style for dynamic size/thickness, but rely on the global CSS class for the 'spin' animation.
  const spinnerStyle: React.CSSProperties = {
    width: diameter,
    height: diameter,
    // Use background colors defined in globals.css
    border: `${borderThickness} solid var(--bg-elevated)`,
    borderTop: `${borderThickness} solid var(--primary)`,
    borderRadius: '50%',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div
        style={spinnerStyle}
        className="loader-spinner" // This class applies the keyframe animation
        role="status"
        aria-live="polite"
        aria-label="Loading"
      />
      {text && (
        <p className="mt-4 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;