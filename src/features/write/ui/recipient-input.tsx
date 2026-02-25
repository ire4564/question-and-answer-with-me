"use client";

import { Input } from "@/shared/ui/input";

interface RecipientInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function RecipientInput({ value, onChange }: RecipientInputProps) {
  return (
    <div className="space-y-4">
      <div className="h-[120px] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_31px,hsl(var(--primary)/0.2)_32px)]" />
      <div className="space-y-2">
        <label htmlFor="to-email" className="text-xs font-medium uppercase tracking-[0.1em] text-primary/60">
          받는 사람
        </label>
        <Input
          id="to-email"
          type="email"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="partner@example.com"
          className="border-0 border-b border-primary/30 bg-transparent px-0 text-[16px] text-foreground/80 shadow-none ring-0 placeholder:text-primary/30 focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
