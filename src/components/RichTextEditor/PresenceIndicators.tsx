import React, { memo, useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { User } from './types';

const SIMULATED_USERS: User[] = [
  { id: '1', name: 'Current User', color: 'hsl(37, 92%, 50%)', isCurrentUser: true },
  { id: '2', name: 'John Doe', color: 'hsl(200, 70%, 50%)' },
  { id: '3', name: 'Jane Smith', color: 'hsl(280, 70%, 50%)' },
];

export const PresenceIndicators: React.FC = memo(() => {
  const [users, setUsers] = useState<User[]>([SIMULATED_USERS[0]]);

  useEffect(() => {
    // Simulate users joining over time
    const timer1 = setTimeout(() => {
      setUsers(prev => [...prev, SIMULATED_USERS[1]]);
    }, 2000);

    const timer2 = setTimeout(() => {
      setUsers(prev => [...prev, SIMULATED_USERS[2]]);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div 
      className="flex items-center gap-2 p-3 border-t border-border bg-muted/30 rounded-b-lg"
      aria-label="Active users"
      role="group"
    >
      <span className="text-sm text-muted-foreground mr-2">Active users:</span>
      <div className="flex -space-x-2">
        {users.map((user, index) => (
          <Tooltip key={user.id}>
            <TooltipTrigger asChild>
              <div
                className="relative transition-transform duration-200 hover:scale-110 hover:z-10"
                style={{ zIndex: users.length - index }}
              >
                <Avatar 
                  className="h-8 w-8 border-2 border-background ring-2 ring-transparent hover:ring-primary/50 transition-all duration-200"
                >
                  <AvatarFallback 
                    style={{ backgroundColor: user.color }}
                    className="text-xs font-medium text-primary-foreground"
                  >
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                {user.isCurrentUser && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.name}{user.isCurrentUser ? ' (You)' : ''}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <span className="text-xs text-muted-foreground ml-auto">
        {users.length} {users.length === 1 ? 'user' : 'users'} online
      </span>
    </div>
  );
});

PresenceIndicators.displayName = 'PresenceIndicators';
