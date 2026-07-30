import { type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

type FieldShellProps = {
  label: string;
  hint?: ReactNode;
  htmlFor: string;
  children: ReactNode;
};

function FieldShell({ label, hint, htmlFor, children }: FieldShellProps) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={htmlFor}>
      <span className="text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint ? <span className="text-sm text-ink-muted">{hint}</span> : null}
    </label>
  );
}

const controlClass =
  "w-full rounded-[var(--radius-sm)] border border-line bg-foam px-3 py-2.5 text-ink placeholder:text-ink-muted/70 shadow-[var(--shadow-soft)]";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: ReactNode;
};

export function TextField({ label, hint, id, className = "", ...props }: TextFieldProps) {
  const fieldId = id ?? props.name ?? label;
  return (
    <FieldShell label={label} hint={hint} htmlFor={fieldId}>
      <input id={fieldId} className={`${controlClass} ${className}`} {...props} />
    </FieldShell>
  );
}

export type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: ReactNode;
};

export function TextAreaField({
  label,
  hint,
  id,
  className = "",
  rows = 4,
  ...props
}: TextAreaFieldProps) {
  const fieldId = id ?? props.name ?? label;
  return (
    <FieldShell label={label} hint={hint} htmlFor={fieldId}>
      <textarea
        id={fieldId}
        rows={rows}
        className={`${controlClass} resize-y ${className}`}
        {...props}
      />
    </FieldShell>
  );
}
