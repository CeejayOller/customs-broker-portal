// src/components/ui/badge.tsx

import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline";
}

const Badge = ({ 
  children, 
  className, 
  variant = "default", 
  ...props 
}: BadgeProps) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors";
  
  const variantStyles = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-input bg-background"
  };

  return (
    <div 
      className={cn(
        baseStyles,
        variantStyles[variant],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export { Badge };