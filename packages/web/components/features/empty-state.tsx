import { Palette } from "lucide-react";
import type { JSX } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: JSX.Element;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Palette className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
