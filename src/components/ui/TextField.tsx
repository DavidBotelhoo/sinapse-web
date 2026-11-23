"use client";

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { ChevronDown, CircleAlert, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

type BaseFieldProps = {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  action?: ReactNode;
  leftIcon?: ReactNode;
  className?: string;
};

export type TextFieldProps = BaseFieldProps &
  InputHTMLAttributes<HTMLInputElement> & {
    /** Ícone decorativo à direita (o cadeado do email só leitura). */
    rightIcon?: ReactNode;
  };

const controlBase =
  "relative flex items-center gap-2 h-control pl-4 pr-[6px] rounded-md " +
  "border border-line-strong " +
  "transition-[border-color,box-shadow] duration-(--dur-fast) ease-out " +
  "hover:border-ink-muted " +
  "focus-within:border-primary focus-within:shadow-[0_0_0_3px_var(--color-primary-soft)]";

const controlError =
  "border-danger hover:border-danger focus-within:border-danger focus-within:shadow-[0_0_0_3px_var(--color-danger-soft)]";

const inputBase =
  "flex-1 w-full min-w-0 h-full p-0 border-0 bg-transparent font-sans text-[15px] leading-[22px] text-ink " +
  "outline-none appearance-none placeholder:text-ink-faint";

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, action, leftIcon, rightIcon, className, id, type = "text", ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const invalid = Boolean(error);
  // Só leitura (pf-readonly): fundo surface-2 e texto apagado, sem o realce de foco.
  const readOnly = Boolean(rest.readOnly);
  return (
    <div
      className={cn("grid gap-[6px] min-w-0", className)}
      data-invalid={invalid || undefined}
    >
      <Label inputId={inputId} action={action}>
        {label}
      </Label>
      <div
        className={cn(
          controlBase,
          readOnly ? "bg-surface-2 hover:border-line-strong" : "bg-surface",
          invalid && controlError,
        )}
      >
        {leftIcon ? (
          <span aria-hidden className="text-ink-faint [&_svg]:size-[18px]">
            {leftIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={invalid || undefined}
          className={cn(inputBase, readOnly && "text-ink-muted")}
          {...rest}
        />
        {rightIcon ? (
          <span aria-hidden className="mr-[6px] text-ink-faint [&_svg]:size-[18px]">
            {rightIcon}
          </span>
        ) : null}
      </div>
      {invalid ? (
        <p className="flex items-center gap-[6px] m-0 text-[13px] leading-[18px] font-medium text-danger">
          <CircleAlert aria-hidden strokeWidth={1.75} className="size-4" />
          {error}
        </p>
      ) : hint ? (
        <p className="m-0 text-[12px] leading-4 font-medium text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
});

export type PasswordFieldProps = Omit<TextFieldProps, "type" | "rightIcon">;

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { label, hint, error, action, className, id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const invalid = Boolean(error);
  const [visible, setVisible] = useState(false);
  return (
    <div className={cn("grid gap-[6px] min-w-0", className)} data-invalid={invalid || undefined}>
      <Label inputId={inputId} action={action}>
        {label}
      </Label>
      <div className={cn(controlBase, "bg-surface", invalid && controlError)}>
        <input
          ref={ref}
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={invalid || undefined}
          className={inputBase}
          {...rest}
        />
        <button
          type="button"
          aria-label={visible ? "Esconder senha" : "Mostrar senha"}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
          className="grid place-items-center size-[34px] rounded-sm bg-transparent text-ink-muted hover:bg-surface-2 hover:text-ink [&_svg]:size-[18px]"
        >
          {visible ? <EyeOff strokeWidth={1.75} /> : <Eye strokeWidth={1.75} />}
        </button>
      </div>
      {invalid ? (
        <p className="flex items-center gap-[6px] m-0 text-[13px] leading-[18px] font-medium text-danger">
          <CircleAlert aria-hidden strokeWidth={1.75} className="size-4" />
          {error}
        </p>
      ) : hint ? (
        <p className="m-0 text-[12px] leading-4 font-medium text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
});

export type SelectFieldProps = BaseFieldProps & SelectHTMLAttributes<HTMLSelectElement>;

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, hint, error, action, leftIcon, className, id, children, ...rest },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const invalid = Boolean(error);
  return (
    <div className={cn("grid gap-[6px] min-w-0", className)} data-invalid={invalid || undefined}>
      <Label inputId={selectId} action={action}>
        {label}
      </Label>
      <div className={cn(controlBase, "bg-surface pr-7", invalid && controlError)}>
        {leftIcon ? (
          <span aria-hidden className="text-ink-faint [&_svg]:size-[18px]">
            {leftIcon}
          </span>
        ) : null}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={invalid || undefined}
          className={cn(inputBase, "cursor-pointer pr-7")}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden
          strokeWidth={1.75}
          className="absolute right-3 size-[18px] text-ink-muted pointer-events-none"
        />
      </div>
      {invalid ? (
        <p className="flex items-center gap-[6px] m-0 text-[13px] leading-[18px] font-medium text-danger">
          <CircleAlert aria-hidden strokeWidth={1.75} className="size-4" />
          {error}
        </p>
      ) : hint ? (
        <p className="m-0 text-[12px] leading-4 font-medium text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
});

function Label({
  inputId,
  action,
  children,
}: {
  inputId: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  if (action) {
    return (
      <div className="flex justify-between items-baseline gap-2">
        <label htmlFor={inputId} className="font-sans font-semibold text-[13px] leading-[18px] text-ink">
          {children}
        </label>
        <span className="text-[13px]">{action}</span>
      </div>
    );
  }
  return (
    <label htmlFor={inputId} className="font-sans font-semibold text-[13px] leading-[18px] text-ink">
      {children}
    </label>
  );
}

export function FieldRow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-3",
        "grid-cols-1 sm:grid-cols-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type FormProps = React.FormHTMLAttributes<HTMLFormElement>;

export function Form({ children, className, ...rest }: FormProps) {
  return (
    <form className={cn("grid gap-4", className)} noValidate {...rest}>
      {children}
    </form>
  );
}
