'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from './ui/input'
import { toast } from 'sonner'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from './ui/label'
import { CalendarIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function CreateNewTask({ task_id, task_emoji }: { task_id: string, task_emoji: string }) {
  const { createNewTask } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [time, setTime] = useState('')

  const [calendarOpen, setCalendarOpen] = useState(false)

  const handleCreation = async () => {
    if (!title) return toast.error('Please enter a title for the task')
    if (!date)  return toast.error('Please select a completion date for the task')
    if (!time)  return toast.error('Please select a completion time for the task')

    const [hours, minutes] = time.split(':').map(Number);
    const completeByDate = new Date(date);
    completeByDate.setHours(hours, minutes, 0, 0);

    const taskData = {
        title: title,
        completeByTimestamp: completeByDate.getTime(),
        emoji: task_emoji
    }

    try {
      createNewTask(taskData, task_id) 
      setDialogOpen(false)
    } catch (error) {
      toast.error(error as string)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant='default' className='w-full'>Create New Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Enter the details below to create a new task.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col relative gap-3'>
            <Input id='title' type='text' placeholder='Task Title' required onChange={(e) => setTitle(e.target.value)} value={title} />
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                    <div className='flex flex-col gap-1'>
                        <Label htmlFor='date'>Completion Date</Label>
                        <Button variant="outline" className="font-normal w-full">
                        {date ? date.toLocaleDateString() : 'Select a date'}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                        setDate(date)
                        setCalendarOpen(false)
                    }}
                    />
                </PopoverContent>
            </Popover>
            <div className='flex flex-col gap-1'>
              <Label htmlFor='time'>Completion Time</Label>
              <Input id='time' type='time' required onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <Button type='button' className='w-full' onClick={handleCreation}>Create Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}