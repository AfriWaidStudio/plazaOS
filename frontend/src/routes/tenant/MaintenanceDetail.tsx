import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Card, StatusBadge, Text, Textarea } from '../../components'
import { BackLink } from '../components/BackLink'
import { DetailField } from '../components/DetailField'
import { PageHeader } from '../components/PageHeader'
import { useMaintenanceDetail } from '../../hooks/useMaintenanceDetail'
import type { MaintenanceStatus } from '../../lib/services/maintenanceService'

const statusLabel: Record<MaintenanceStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
}

const statusVariant: Record<MaintenanceStatus, 'danger' | 'warning' | 'success'> = {
  open: 'danger',
  in_progress: 'warning',
  resolved: 'success',
}

export function MaintenanceDetail() {
  const { requestId } = useParams<{ requestId: string }>()
  const { data: request, isLoading, isError, addComment } = useMaintenanceDetail(requestId)
  const [commentText, setCommentText] = useState('')

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6">
        <BackLink to="/tenant/maintenance" label="Back to requests" />
        <Text variant="body">Loading…</Text>
      </div>
    )
  }

  if (isError || !request) {
    return (
      <div className="px-4 sm:px-6">
        <BackLink to="/tenant/maintenance" label="Back to requests" />
        <Text variant="body" className="text-danger">Request not found.</Text>
      </div>
    )
  }

  async function handleAddComment() {
    if (!commentText.trim()) return
    await addComment.mutateAsync(commentText)
    setCommentText('')
  }

  return (
    <div className="px-4 sm:px-6">
      <BackLink to="/tenant/maintenance" label="Back to requests" />
      <PageHeader
        title={request.title}
        action={<StatusBadge variant={statusVariant[request.status]} label={statusLabel[request.status]} />}
      />

      <Card className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <DetailField label="Submitted">{request.createdAt}</DetailField>
        <DetailField label="Priority">{request.priority || 'Medium'}</DetailField>
        <div className="sm:col-span-2">
          <DetailField label="Description">{request.description || 'No description provided'}</DetailField>
        </div>
        <div className="sm:col-span-2">
          <DetailField label="Photos">
            {request.images && request.images.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-3">
                {request.images.map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt={`Submitted photo for ${request.title}`}
                    className="max-h-80 rounded-card border border-slate-200 object-cover"
                  />
                ))}
              </div>
            ) : (
              'No photos submitted'
            )}
          </DetailField>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <Text variant="h3">Messages</Text>
          <div className="flex flex-col gap-4">
            {(!request.comments || request.comments.length === 0) ? (
              <Text variant="bodySmall" className="text-slate-500">No messages yet.</Text>
            ) : (
              request.comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`flex flex-col gap-1 rounded-card p-4 ${
                    comment.role === 'tenant' ? 'bg-primary/5 ml-8 border border-primary/10' : 'bg-slate-50 mr-8 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Text variant="bodySmall" className="font-medium">
                      {comment.authorName} {comment.role === 'admin' && <span className="text-primary ml-1">(Management)</span>}
                    </Text>
                    <Text variant="bodySmall" className="text-slate-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Text>
                  </div>
                  <Text variant="body" className="whitespace-pre-wrap">{comment.content}</Text>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4">
            <Textarea
              placeholder="Type a message..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={addComment.isPending}
            />
            <div className="flex justify-end">
              <Button onClick={handleAddComment} disabled={!commentText.trim() || addComment.isPending}>
                {addComment.isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
