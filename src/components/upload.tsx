export function Upload({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      id="upload_widget"
      disabled={disabled}
      className={`cloudinary-button rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ${disabled ? '' : 'cursor-pointer'}`}
      onClick={disabled ? undefined : onClick}
    >
      Upload files
    </button>
  );
}
