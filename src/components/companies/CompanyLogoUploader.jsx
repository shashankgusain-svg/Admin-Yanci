import React from "react";
import { toast } from "react-toastify";
import Button from "@/components/button/Button";
import { LOGO_ACCEPT, validateLogoFile } from "./logoUtils";

/** Picks a logo for the edit form; the parent uploads it when the form is saved. */
export default function CompanyLogoUploader({ company, pendingFile, onChange, disabled = false }) {
  const inputRef = React.useRef(null);
  const [imgFailed, setImgFailed] = React.useState(false);

  const previewUrl = React.useMemo(
    () => (pendingFile ? URL.createObjectURL(pendingFile) : null),
    [pendingFile]
  );
  React.useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const currentSrc = previewUrl || company.logoUrl || company.logo;
  const hasImage = Boolean(currentSrc) && (Boolean(previewUrl) || !imgFailed);

  const handleFile = (file) => {
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;
    const error = validateLogoFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    onChange(file);
  };

  return (
    <div className="flex items-center gap-4 border border-black-5 rounded-lg p-4">
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentSrc}
          alt={`${company.symbol} logo`}
          className="w-16 h-16 rounded-full object-cover border border-black-5 bg-white shrink-0"
          onError={() => !previewUrl && setImgFailed(true)}
        />
      ) : (
        <span className="w-16 h-16 rounded-full bg-primary-1 text-primary-7 text-sm font-bold flex items-center justify-center shrink-0">
          {String(company.symbol || "?").slice(0, 3)}
        </span>
      )}
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-xs font-semibold uppercase text-black-7">Company logo</p>
        {pendingFile ? (
          <p className="text-xs text-warning truncate" title={pendingFile.name}>
            New logo selected ({pendingFile.name}). It will upload when you click Save.
          </p>
        ) : (
          <p className="text-xs text-black-7">
            PNG, JPG, WebP, or SVG up to 10 MB. Square images look best.
          </p>
        )}
        <div className="flex gap-2 mt-1">
          <Button
            design="secondary"
            className="h-8 text-sm"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            {pendingFile ? "Choose another" : hasImage ? "Replace logo" : "Upload logo"}
          </Button>
          {pendingFile && (
            <Button
              design="text"
              className="h-8 text-sm"
              disabled={disabled}
              onClick={() => onChange(null)}
            >
              Undo
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={LOGO_ACCEPT}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
