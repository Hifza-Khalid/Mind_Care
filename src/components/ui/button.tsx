import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 overflow-hidden",
  {
    variants: {
      variant: {
        default: 
          "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-premium hover:shadow-floating hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100",
        destructive: 
          "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-premium hover:shadow-floating hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]",
        outline: 
          "border-2 border-primary/20 bg-white/5 backdrop-blur-sm text-foreground shadow-glass-card hover:border-primary/40 hover:bg-white/10 hover:shadow-floating hover:scale-[1.02] active:scale-[0.98]",
        secondary: 
          "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-premium hover:shadow-floating hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]",
        ghost: 
          "bg-transparent text-foreground hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-glass-card hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
        link: 
          "text-primary underline-offset-4 hover:underline bg-transparent shadow-none hover:scale-[1.02] active:scale-[0.98]",
        hero: 
          "bg-gradient-to-r from-primary via-primary-light to-primary text-white shadow-premium hover:shadow-floating hover:scale-[1.05] hover:-translate-y-1 active:scale-[1.02] active:translate-y-0 font-semibold text-base before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100",
        trust: 
          "bg-gradient-to-r from-trust to-trust/90 text-trust-foreground shadow-premium hover:shadow-floating hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]",
        gentle: 
          "bg-white/10 backdrop-blur-xl border border-white/20 text-foreground shadow-glass-card hover:bg-white/15 hover:border-white/30 hover:shadow-floating hover:scale-[1.02] active:scale-[0.98]",
        safety: 
          "bg-gradient-to-r from-safety to-safety/90 text-safety-foreground shadow-premium hover:shadow-floating hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]",
        calm: 
          "bg-gradient-to-r from-muted to-muted/90 text-muted-foreground shadow-glass-card hover:shadow-floating hover:scale-[1.02] active:scale-[0.98]",
        support: 
          "bg-gradient-to-r from-gradient-wellness via-green-400 to-emerald-500 text-white shadow-premium hover:shadow-floating hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] font-semibold",
        premium: 
          "bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white shadow-premium hover:shadow-floating hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] font-semibold before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100",
      },
      size: {
        default: "h-11 px-6 py-3 text-sm",
        sm: "h-9 px-4 py-2 text-xs rounded-lg",
        lg: "h-14 px-10 py-4 text-lg rounded-2xl",
        xl: "h-16 px-12 py-5 text-xl font-bold rounded-2xl",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
