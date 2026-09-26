import React from "react";

/**
 * Shared Excel dropzone for migration uploads.
 * Field is always submitted as multipart `file` by the API service.
 */
export default function MigrationFileDropzone({
  file,
  onFileChange,
  accept = ".xlsx,.xls",
  hint = ".xlsx and .xls accepted",
  disabled = false,
}) {
  const inputRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const pick = (next) => {
    if (!next || disabled) return;
    onFileChange?.(next);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        pick(e.dataTransfer.files?.[0]);
      }}
      onClick={() => {
        if (!disabled) inputRef.current?.click();
      }}
      className={`w-full min-h-[7.5rem] flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition px-4 text-center
        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        ${isDragging ? "border-primary-6 bg-primary-1" : "border-primary-3 hover:bg-primary-1"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {file ? (
        <p className="text-sm font-medium text-primary-7 break-all">{file.name}</p>
      ) : (
        <>
          <p className="text-sm text-black-7">
            Drag &amp; drop an Excel file here, or click to browse
          </p>
          <p className="text-xs text-black-6 mt-1">{hint}</p>
        </>
      )}
    </div>
  );
}
