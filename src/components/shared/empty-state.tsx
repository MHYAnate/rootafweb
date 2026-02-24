import { LucideIcon } from 'lucide-react';

interface Props {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-up">
      {Icon && (
        <div className="h-20 w-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
          <Icon className="h-10 w-10 text-muted-foreground/40" />
        </div>
      )}
      <h3 className="text-xl font-semibold">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-2 max-w-md">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}