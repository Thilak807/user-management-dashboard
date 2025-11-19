import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const defaultValues = {
  title: '',
  description: '',
  notes: '',
  category: 'other',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
};

export default function TaskForm({ onSubmit, isSubmitting, editingTask, onCancel, theme }) {
  const accentGradient = theme?.accentGradient || 'from-brand-600 to-brand-700';
  const borderColor = theme?.headerBorder || 'border-white/80';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description || '',
        notes: editingTask.notes || '',
        category: editingTask.category || 'other',
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : '',
      });
    } else {
      reset(defaultValues);
    }
  }, [editingTask, reset]);

  const onFormSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
    if (!editingTask) {
      reset(defaultValues);
    }
  });

  return (
    <form
      onSubmit={onFormSubmit}
      className={`space-y-6 rounded-3xl border ${borderColor} bg-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-sm`}
    >
      <div>
        <h2 className="text-xl font-bold text-slate-850">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {editingTask ? 'Update your task details below' : 'Fill in the details to add a new task'}
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="w-full rounded-xl border border-brand-100 bg-white/80 px-4 py-3 text-sm transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          placeholder="Write a short title"
        />
        {errors.title && (
          <p className="mt-2 text-xs font-medium text-rose-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full rounded-xl border border-brand-100 bg-white/80 px-4 py-3 text-sm transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
          placeholder="Add more context..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full rounded-xl border border-brand-100 bg-white/80 px-4 py-3 text-sm transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
          placeholder="Add private notes or comments..."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
          <select
            {...register('category')}
            className="w-full rounded-xl border border-brand-100 bg-white/80 px-4 py-3 text-sm transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
          <select
            {...register('status')}
            className="w-full rounded-xl border border-brand-100 bg-white/80 px-4 py-3 text-sm transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Priority</label>
          <select
            {...register('priority')}
            className="w-full rounded-xl border border-brand-100 bg-white/80 px-4 py-3 text-sm transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Due date</label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </div>
          <input
            type="date"
            {...register('dueDate')}
            className="w-full rounded-xl border border-brand-100 bg-white/80 px-4 py-3 pr-10 text-sm transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`rounded-xl bg-gradient-to-r ${accentGradient} px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:shadow-none`}
        >
          {isSubmitting
            ? editingTask
              ? 'Updating...'
              : 'Creating...'
            : editingTask
              ? 'Update Task'
              : 'Create Task'}
        </button>
        {editingTask && (
          <button
            type="button"
            onClick={onCancel}
            className={`rounded-xl border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-brand-50 hover:shadow-sm`}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

