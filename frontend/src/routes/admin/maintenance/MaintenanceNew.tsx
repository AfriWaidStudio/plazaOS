import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Input } from '../../../components'
import { BackLink } from '../components/BackLink'
import { PageHeader } from '../components/PageHeader'
import { Select } from '../components/Select'
import { Textarea } from '../components/Textarea'
import { getTenants } from '../tenants/data'
import { addMaintenanceRequest } from './data'
import type { Tenant, MaintenancePriority } from '../data/types'

export function MaintenanceNew() {
  const navigate = useNavigate()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [tenantId, setTenantId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<MaintenancePriority>('low')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    getTenants({ pageSize: 1000 }).then((result) => {
      if (cancelled) return
      setTenants(result.data)
      if (result.data[0]) setTenantId(result.data[0].id)
    }).catch(console.error)
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!tenantId || !title || !description) return
    setIsSubmitting(true)
    try {
      await addMaintenanceRequest({
        tenantId,
        title,
        description,
        priority,
      })
      navigate('/admin/maintenance')
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <BackLink to="/admin/maintenance" label="Back to maintenance requests" />
      <PageHeader title="New maintenance request" description="Create a maintenance request on behalf of a tenant." />
      <Card className="max-w-lg mt-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            label="Tenant"
            value={tenantId}
            onChange={(event) => setTenantId(event.target.value)}
            options={tenants.map((tenant) => ({ value: tenant.id, label: `${tenant.name} (${tenant.unitNumber})` }))}
            required
          />
          <Input 
            label="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g., Leaky faucet"
            required 
          />
          <Textarea 
            label="Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Provide details about the issue..."
            required 
          />
          <Select
            label="Priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as MaintenancePriority)}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' }
            ]}
            required
          />
          <Button type="submit" disabled={isSubmitting || !tenantId} className="w-full">
            {isSubmitting ? 'Submitting…' : 'Submit request'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
