import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { profileService, type UpdateProfileInput } from '../lib/services/profileService'

export function useProfile() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.get(),
  })
  const update = useMutation({
    mutationFn: (input: UpdateProfileInput) => profileService.update(input as any),
    onSuccess: (profile) => {
      queryClient.setQueryData(['profile'], profile)
    },
  })
  return { ...query, update }
}
