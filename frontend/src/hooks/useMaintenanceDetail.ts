import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { maintenanceService } from '../lib/services/maintenanceService'

export function useMaintenanceDetail(id: string | undefined) {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['maintenance', id],
    queryFn: () => maintenanceService.get(id!),
    enabled: !!id,
  })
  
  const addComment = useMutation({
    mutationFn: (content: string) => maintenanceService.addComment(id!, content),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['maintenance', id] })
    },
  })
  
  return { ...query, addComment }
}
