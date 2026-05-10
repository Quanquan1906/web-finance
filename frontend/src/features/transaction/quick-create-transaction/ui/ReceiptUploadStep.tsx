import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { Button } from "@/shared/ui/button";

interface ReceiptUploadStepProps {
  isParsing: boolean;
  ocrError: string | null;
  onParse: (file: File) => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function ReceiptUploadStep({
  isParsing,
  ocrError,
  onParse,
}: ReceiptUploadStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  function clearPreview() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setValidationError(null);

    clearPreview();

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setValidationError("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.");
      setSelectedFile(null);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setValidationError("Ảnh quá lớn. Vui lòng upload ảnh nhỏ hơn 5MB.");
      setSelectedFile(null);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleParse() {
    if (selectedFile) {
      onParse(selectedFile);
    }
  }

  function handleRemoveFile() {
    clearPreview();
    setSelectedFile(null);
    setValidationError(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displayError = validationError ?? ocrError;

  return (
    <div className="space-y-4">
      <div
        className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 px-6 py-6 transition-colors hover:bg-muted/40"
        onClick={() => {
          if (!isParsing) {
            inputRef.current?.click();
          }
        }}
      >
        {previewUrl ? (
          <div className="flex w-full flex-col items-center gap-3">
            <img
              src={previewUrl}
              alt={selectedFile?.name ?? "Ảnh hóa đơn"}
              className="max-h-[220px] w-full rounded-lg object-contain"
            />

            <p className="max-w-full truncate text-sm font-medium text-foreground">
              {selectedFile?.name}
            </p>
          </div>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-muted-foreground/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 10l-4-4m0 0L8 10m4-4v12"
              />
            </svg>

            <p className="text-center text-sm text-muted-foreground">
              Nhấp để chọn ảnh hóa đơn / biên lai
              <br />
              <span className="text-xs">JPG, PNG, WEBP — tối đa 5MB</span>
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isParsing}
        />
      </div>

      {displayError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {displayError}
        </div>
      )}

      <div className="flex justify-end gap-2">
        {selectedFile && (
          <Button
            type="button"
            variant="outline"
            disabled={isParsing}
            className="h-10 rounded-xl px-5"
            onClick={handleRemoveFile}
          >
            Xóa ảnh
          </Button>
        )}

        <Button
          type="button"
          disabled={!selectedFile || isParsing}
          className="h-10 rounded-xl px-5"
          onClick={handleParse}
        >
          {isParsing ? "Đang đọc hóa đơn..." : "Đọc hóa đơn"}
        </Button>
      </div>
    </div>
  );
}