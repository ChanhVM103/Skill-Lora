import React, { useRef, useState } from 'react';

interface FileDropzoneProps {
  label: string;
  sublabel?: string;
  accept?: string;
  required?: boolean;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  icon?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  label,
  sublabel = 'Hỗ trợ định dạng PDF, DOCX (tối đa 10MB)',
  accept = '.pdf,.docx',
  required = false,
  file,
  onFileSelect,
  icon = '📄',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          {label} {required ? <span style={{ color: 'var(--accent-rose)' }}>*</span> : <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Tùy chọn)</span>}
        </label>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
          }
        }}
      />

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragOver ? 'var(--accent-indigo)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-lg)',
            background: isDragOver ? 'rgba(99, 102, 241, 0.1)' : 'rgba(15, 23, 42, 0.4)',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Kéo thả file vào đây hoặc <span style={{ color: 'var(--accent-indigo)' }}>Chọn từ máy tính</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sublabel}</div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '1.75rem' }}>{icon}</span>
            <div>
              <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>{file.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatFileSize(file.size)}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null);
            }}
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: 'none',
              color: 'var(--accent-rose)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Gỡ bỏ
          </button>
        </div>
      )}
    </div>
  );
};
