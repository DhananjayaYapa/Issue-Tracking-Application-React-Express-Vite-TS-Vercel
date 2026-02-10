/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Box,
  Typography,
  Chip,
} from '@mui/material'
import { AttachFile as AttachFileIcon } from '@mui/icons-material'
import type { SelectChangeEvent } from '@mui/material'
import type { RootState } from '../../../redux/store'
import { ISSUE_STATUS, ISSUE_PRIORITY } from '../../../utilities/constants'

interface IssueFormDialogProps {
  open: boolean
  onClose: () => void
  isEditing: boolean
  formData: any
  onChange: (property: string, value: any) => void
  onSave: () => void
  loading: boolean
  hideStatus?: boolean
  attachment?: File | null
  onAttachmentChange?: (file: File | null) => void
  existingAttachment?: string | null
}

// IssueFormDialog - Create/Edit issue form dialog (Presentational)
const IssueFormDialog: React.FC<IssueFormDialogProps> = ({
  open,
  onClose,
  isEditing,
  formData,
  onChange,
  onSave,
  loading,
  hideStatus = false,
  attachment = null,
  onAttachmentChange,
  existingAttachment = null,
}) => {
  const { metadata } = useSelector((state: RootState) => state.issues)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? 'Edit Issue' : 'Create New Issue'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title *"
                value={formData.title.value}
                onChange={(e) => onChange('title', e.target.value)}
                error={!!formData.title.error}
                helperText={formData.title.error || `${formData.title.value.length}/50`}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                multiline
                rows={4}
                value={formData.description.value}
                onChange={(e) => onChange('description', e.target.value)}
                error={!!formData.description.error}
                helperText={
                  formData.description.error || `${formData.description.value.length}/225`
                }
              />
            </Grid>
            {isEditing && !hideStatus && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!formData.status.error}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status.value}
                    label="Status"
                    onChange={(e: SelectChangeEvent) => onChange('status', e.target.value)}
                  >
                    {(metadata?.statuses || Object.values(ISSUE_STATUS)).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={!!formData.priority.error}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority.value}
                  label="Priority"
                  onChange={(e: SelectChangeEvent) => onChange('priority', e.target.value)}
                >
                  {(metadata?.priorities || Object.values(ISSUE_PRIORITY)).map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Attachment Section */}
            <Grid item xs={12}>
              <Box
                sx={{
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Attachment
                </Typography>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    onAttachmentChange?.(file)
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AttachFileIcon />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {attachment || existingAttachment ? 'Change File' : 'Attach File'}
                </Button>
                {attachment && (
                  <Chip
                    label={attachment.name}
                    size="small"
                    onDelete={() => {
                      onAttachmentChange?.(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    sx={{ ml: 1 }}
                  />
                )}
                {!attachment && existingAttachment && (
                  <Chip
                    label={existingAttachment.split('/').pop()}
                    size="small"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                )}
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                  Max 5MB. Allowed: Images, PDF, DOC, DOCX, XLS, XLSX, TXT, CSV
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default IssueFormDialog
