import { useOnline } from '@/hooks/use-online'
import { cn } from '@/lib/utils/cn'

export const ConnectionIndicator = () => {
  const isOnline = useOnline()

  return (
    <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium">
      <div
        className={cn(
          'h-2 w-2 rounded-full',
          isOnline ? 'bg-green-500' : 'bg-red-500'
        )}
      />
      <span className={cn(isOnline ? 'text-green-700' : 'text-red-700')}>
        {isOnline ? 'En línea' : 'Sin conexión'}
      </span>
    </div>
  )
}
