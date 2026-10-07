"use client"

import { Trash2 } from "lucide-react"
import { useState } from "react"
import { InputField, SelectField, TextareaField } from "@/components/shared/form-field"
import { PLATFORM_OPTIONS } from "@/components/shared/platform-badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { PlannerItem, PlannerStatus, PlannerType, PlatformId } from "@/types/domain"
import { STATUS_META, STATUSES, TYPE_META, TYPES } from "./planner-meta"

export type DialogState = { mode: "create"; date: string } | { mode: "edit"; item: PlannerItem } | null

export function PlannerItemDialog({
  state,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: {
  state: DialogState
  onClose: () => void
  onCreate: (item: Omit<PlannerItem, "id">) => void
  onUpdate: (id: string, patch: Partial<PlannerItem>) => void
  onDelete: (id: string) => void
}) {
  return (
    <Dialog open={state !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        {state && <ItemForm key={state.mode === "edit" ? state.item.id : state.date} state={state} onClose={onClose} onCreate={onCreate} onUpdate={onUpdate} onDelete={onDelete} />}
      </DialogContent>
    </Dialog>
  )
}

function ItemForm({ state, onClose, onCreate, onUpdate, onDelete }: { state: NonNullable<DialogState>; onClose: () => void; onCreate: (item: Omit<PlannerItem, "id">) => void; onUpdate: (id: string, patch: Partial<PlannerItem>) => void; onDelete: (id: string) => void }) {
  const initial = state.mode === "edit" ? state.item : null
  const [title, setTitle] = useState(initial?.title ?? "")
  const [platform, setPlatform] = useState<PlatformId>(initial?.platform ?? "tiktok")
  const [type, setType] = useState<PlannerType>(initial?.type ?? "video")
  const [status, setStatus] = useState<PlannerStatus>(initial?.status ?? "idea")
  const [date, setDate] = useState(initial?.date ?? (state.mode === "create" ? state.date : ""))
  const [notes, setNotes] = useState(initial?.notes ?? "")
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return setError("Give this content a title.")
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return setError("Pick a valid date.")
    const data = { title: title.trim(), platform, type, status, date, notes: notes.trim() || undefined }
    if (initial) onUpdate(initial.id, data)
    else onCreate(data)
    onClose()
  }

  return (
    <form onSubmit={submit} noValidate>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit content" : "Plan new content"}</DialogTitle>
        <DialogDescription>{initial ? "Update details, move the date, or change status." : "Add a video, post, story, or live session to your calendar."}</DialogDescription>
      </DialogHeader>
      <div className="my-4 space-y-3">
        <InputField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus maxLength={140} error={error && !title.trim() ? error : undefined} />
        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Type" value={type} onChange={(v) => setType(v as PlannerType)} options={TYPES.map((t) => ({ value: t, label: TYPE_META[t].label }))} />
          <SelectField label="Platform" value={platform} onChange={(v) => setPlatform(v as PlatformId)} options={PLATFORM_OPTIONS} />
          <SelectField label="Status" value={status} onChange={(v) => setStatus(v as PlannerStatus)} options={STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label }))} />
          <InputField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <TextareaField label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={500} placeholder="Hook, shot list, links…" />
        {error && title.trim() && <p className="text-xs font-medium text-destructive">{error}</p>}
      </div>
      <DialogFooter className="sm:justify-between">
        {initial ? (
          confirmDelete ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onDelete(initial.id)
                onClose()
              }}
            >
              <Trash2 /> Confirm delete
            </Button>
          ) : (
            <Button type="button" variant="ghost" className="text-destructive" onClick={() => setConfirmDelete(true)}>
              <Trash2 /> Delete
            </Button>
          )
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initial ? "Save" : "Add to calendar"}</Button>
        </div>
      </DialogFooter>
    </form>
  )
}
