import type React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface UserCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const UserCard: React.FC<UserCardProps> = ({
  children,
  onClick,
  className,
}) => (
  <Card
    onClick={onClick}
    className={cn(
      'cursor-pointer p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]',
      className
    )}
  >
    {children}
  </Card>
);
