import dayjs from 'dayjs';
import { Spinner } from '../ui/Spinner';

const baseStatusStyles = {
  todo: 'bg-brand-50 text-brand-700',
  'in-progress': 'bg-accent/40 text-brand-700',
  done: 'bg-emerald-100 text-emerald-700',
};

const priorityStyles = {
  low: 'text-emerald-500',
  medium: 'text-amber-500',
  high: 'text-rose-500',
};

const categoryStyles = {
  work: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  personal: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  shopping: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  health: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  other: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

export default function TaskList({
  tasks = [],
  loading,
  onEdit,
  onDelete,
  theme,
  selectedTasks = [],
  onSelectTask,
  onSelectAll,
  showCheckboxes = false,
}) {
  const borderColor = theme?.headerBorder || 'border-white/80';
  const statusStyles = {
    todo: theme?.accentGradient
      ? `bg-gradient-to-r ${theme.accentGradient} text-white`
      : baseStatusStyles.todo,
    'in-progress': baseStatusStyles['in-progress'],
    done: baseStatusStyles.done,
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'done') return false;
    return new Date(dueDate) < new Date();
  };

  const isDueSoon = (dueDate, status) => {
    if (!dueDate || status === 'done') return false;
    const due = new Date(dueDate);
    const now = new Date();
    const daysDiff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return daysDiff >= 0 && daysDiff <= 3;
  };

  if (loading) {
    return (
      <div className={`rounded-2xl border ${borderColor} bg-white dark:bg-slate-800 p-6 shadow-card-lg`}>
        <Spinner label="Loading tasks..." />
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 p-6 text-center text-sm text-slate-500 dark:text-slate-400 shadow-card-lg">
        No tasks yet. Start by creating your first one!
      </div>
    );
  }

  const allSelected = tasks.length > 0 && selectedTasks.length === tasks.length;

  return (
    <div className="space-y-4">
      {showCheckboxes && (
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onSelectAll}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Select All ({selectedTasks.length} selected)
          </span>
        </div>
      )}

      {tasks.map((task) => {
        const overdue = isOverdue(task.dueDate, task.status);
        const dueSoon = isDueSoon(task.dueDate, task.status);
        const isSelected = selectedTasks.includes(task._id);

        return (
          <article
            key={task._id}
            className={`group rounded-3xl border ${borderColor} ${
              isSelected ? 'ring-2 ring-brand-500' : ''
            } bg-white/80 dark:bg-slate-800/80 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1`}
          >
            <div className="flex items-start gap-4">
              {showCheckboxes && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelectTask(task._id)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-850 dark:text-white">{task.title}</h3>
                      {overdue && (
                        <span className="inline-flex items-center rounded-full bg-rose-100 dark:bg-rose-900/30 px-2 py-1 text-xs font-semibold text-rose-700 dark:text-rose-400">
                          ⚠️ Overdue
                        </span>
                      )}
                      {dueSoon && !overdue && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                          ⏰ Due Soon
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {task.description}
                      </p>
                    )}
                    {task.notes && (
                      <div className="mt-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-3">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Notes:</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{task.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {task.category && (
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                          categoryStyles[task.category] || categoryStyles.other
                        }`}
                      >
                        {task.category}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                        statusStyles[task.status] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {task.status?.replace('-', ' ')}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-700 ${
                        priorityStyles[task.priority] || 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {task.priority?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-brand-100 dark:border-slate-700 pt-4">
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Updated {dayjs(task.updatedAt).format('DD MMM, YYYY')}
                    </span>
                    {task.dueDate && (
                      <span
                        className={`flex items-center gap-1.5 ${
                          overdue ? 'text-rose-600 dark:text-rose-400 font-semibold' : ''
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="h-3.5 w-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                          />
                        </svg>
                        Due {dayjs(task.dueDate).format('DD MMM')}
                        {overdue && ' (Overdue)'}
                        {dueSoon && !overdue && ' (Soon)'}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(task)}
                      className="rounded-xl border border-brand-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-xs font-semibold text-brand-700 dark:text-white transition-all hover:-translate-y-0.5 hover:bg-brand-50 dark:hover:bg-slate-600 hover:shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(task._id)}
                      className="rounded-xl border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-700 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-all hover:-translate-y-0.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
