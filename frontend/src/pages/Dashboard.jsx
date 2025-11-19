import { useMemo, useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi, taskApi, templateApi, activityApi } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import ProfileCard from '../components/profile/ProfileCard';
import Sidebar from '../components/layout/Sidebar';
import { useDebounce } from '../hooks/useDebounce';

// ...removed theme definitions...

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingTask, setEditingTask] = useState(null);
  // Theme and dark mode removed
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const theme = themes[themeKey];
  const debouncedSearch = useDebounce(searchTerm, 400);
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // ...removed dark mode and theme effect...

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowAdvancedFilters(!showAdvancedFilters);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setEditingTask(null);
        document.querySelector('input[name="title"]')?.focus();
      }
      if (e.key === 'Escape' && editingTask) {
        setEditingTask(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showAdvancedFilters, editingTask]);

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.me,
    onSuccess: (data) => setUser(data.user),
  });

  const statsQuery = useQuery({
    queryKey: ['statistics'],
    queryFn: taskApi.statistics,
  });

  const tasksQuery = useQuery({
    queryKey: ['tasks', debouncedSearch, statusFilter, priorityFilter, categoryFilter, dateFilter, sortBy, sortOrder],
    queryFn: () =>
      taskApi.list({
        q: debouncedSearch || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        category: categoryFilter || undefined,
        dateFilter: dateFilter || undefined,
        sortBy,
        sortOrder,
      }),
  });

  const templatesQuery = useQuery({
    queryKey: ['templates'],
    queryFn: templateApi.list,
  });

  const activityQuery = useQuery({
    queryKey: ['activity'],
    queryFn: () => activityApi.list({ limit: 10 }),
  });

  const createTaskMutation = useMutation({
    mutationFn: (payload) => taskApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, payload }) => taskApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id) => taskApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: (payload) => taskApi.bulkUpdate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      setSelectedTasks([]);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (payload) => taskApi.bulkDelete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      setSelectedTasks([]);
    },
  });

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      dueDate: values.dueDate || undefined,
    };

    try {
      if (editingTask) {
        await updateTaskMutation.mutateAsync({ id: editingTask._id, payload });
        setEditingTask(null);
      } else {
        await createTaskMutation.mutateAsync(payload);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTaskMutation.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return;
    if (!window.confirm(`Delete ${selectedTasks.length} selected task(s)?`)) return;
    try {
      await bulkDeleteMutation.mutateAsync({ taskIds: selectedTasks });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedTasks.length === 0) return;
    try {
      await bulkUpdateMutation.mutateAsync({ taskIds: selectedTasks, updates: { status } });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectTask = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    const allTaskIds = tasksQuery.data?.tasks?.map((t) => t._id) || [];
    setSelectedTasks(selectedTasks.length === allTaskIds.length ? [] : allTaskIds);
  };

  const handleTemplateSelect = async (templateId) => {
    try {
      const { task } = await templateApi.createTask(templateId);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTask(task);
    } catch (error) {
      console.error(error);
    }
  };

  const mutationError =
    createTaskMutation.error ||
    updateTaskMutation.error ||
    deleteTaskMutation.error ||
    bulkUpdateMutation.error ||
    bulkDeleteMutation.error;

  const mutationMessage = useMemo(() => {
    if (!mutationError) return '';
    return (
      mutationError.response?.data?.message ||
      mutationError.message ||
      'Something went wrong.'
    );
  }, [mutationError]);

  const overdueCount = useMemo(() => {
    const now = new Date();
    return tasksQuery.data?.tasks?.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done'
    ).length || 0;
  }, [tasksQuery.data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-cyan-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'pl-64' : 'pl-0'
        }`}
      >
        <section className="px-4 pt-4 lg:pt-6 pb-6 lg:pb-8">
          <div className="mx-auto w-full max-w-7xl">
            <header
              className="mb-6 lg:mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-indigo-300 bg-indigo-100/90 dark:bg-slate-800 px-6 lg:px-8 py-4 lg:py-6 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-blue-700 dark:text-indigo-200 hover:text-indigo-400 transition-colors"
                  aria-label="Toggle menu"
                >
                  {sidebarOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                  )}
                </button>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">
                    Task Manager
                  </p>
                  <h1 className="mt-1 text-3xl lg:text-4xl font-bold tracking-tight text-indigo-900 dark:text-white">
                    Dashboard
                  </h1>
                  <p className="mt-1 lg:mt-2 text-xs lg:text-sm text-indigo-400 dark:text-indigo-300">
                    Manage your tasks efficiently
                  </p>
                </div>
              </div>
              {/* Theme switcher removed */}
            </header>

        {/* Statistics Cards */}
        {statsQuery.data && (
          <div className="mb-6 lg:mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/90 dark:bg-slate-800 p-4 shadow-md hover:shadow-xl transition-shadow duration-200">
              <p className="text-xs font-semibold text-indigo-400 dark:text-indigo-200">Total Tasks</p>
              <p className="mt-2 text-3xl font-bold text-blue-700 dark:text-white">
                {statsQuery.data.stats.total}
              </p>
            </div>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/90 dark:bg-slate-800 p-4 shadow-md hover:shadow-xl transition-shadow duration-200">
              <p className="text-xs font-semibold text-indigo-400 dark:text-indigo-200">Completion Rate</p>
              <p className="mt-2 text-3xl font-bold text-blue-700 dark:text-white">
                {statsQuery.data.stats.completionRate}%
              </p>
            </div>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/90 dark:bg-slate-800 p-4 shadow-md hover:shadow-xl transition-shadow duration-200">
              <p className="text-xs font-semibold text-indigo-400 dark:text-indigo-200">Overdue</p>
              <p className="mt-2 text-3xl font-bold text-rose-600 dark:text-rose-400">{overdueCount}</p>
            </div>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/90 dark:bg-slate-800 p-4 shadow-md hover:shadow-xl transition-shadow duration-200">
              <p className="text-xs font-semibold text-indigo-400 dark:text-indigo-200">This Week</p>
              <p className="mt-2 text-3xl font-bold text-blue-700 dark:text-white">
                {statsQuery.data.stats.thisWeek}
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            <ProfileCard
              user={profileQuery.data?.user || user}
              stats={profileQuery.data?.stats}
              loading={profileQuery.isLoading}
            />

            {/* Templates */}
            {templatesQuery.data?.templates?.length > 0 && (
              <div className="rounded-3xl border border-indigo-300 bg-indigo-100/90 dark:bg-slate-800 p-6 shadow-lg hover:shadow-2xl transition-shadow duration-200">
                <h3 className="text-lg font-bold text-indigo-700 dark:text-white mb-4">Templates</h3>
                <div className="space-y-2">
                  {templatesQuery.data.templates.slice(0, 5).map((template) => (
                    <button
                      key={template._id}
                      onClick={() => handleTemplateSelect(template._id)}
                      className="w-full text-left rounded-xl border border-indigo-200 bg-indigo-50 dark:bg-slate-700 px-4 py-2 text-sm hover:bg-indigo-200 dark:hover:bg-slate-600 hover:text-indigo-900 dark:text-white transition"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {activityQuery.data?.logs?.length > 0 && (
              <div className="rounded-3xl border border-indigo-300 bg-indigo-100/90 dark:bg-slate-800 p-6 shadow-lg hover:shadow-2xl transition-shadow duration-200">
                <h3 className="text-lg font-bold text-indigo-700 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {activityQuery.data.logs.map((log) => (
                    <div key={log._id} className="text-xs text-indigo-600 dark:text-indigo-100 border-b border-indigo-50 dark:border-slate-700 pb-2">
                      <p className="font-semibold">{log.description}</p>
                      <p className="text-indigo-400 dark:text-indigo-300">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 lg:space-y-6 lg:col-span-2">
            <TaskForm
              onSubmit={handleSubmit}
              isSubmitting={createTaskMutation.isPending || updateTaskMutation.isPending}
              editingTask={editingTask}
              onCancel={() => setEditingTask(null)}
            />

            {/* Advanced Filters & Sorting */}
            <div
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Search & Filter Tasks</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Find and organize your tasks quickly (Ctrl+K)
                  </p>
                </div>
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="text-sm font-semibold text-blue-600"
                >
                  {showAdvancedFilters ? 'Hide' : 'Show'} Filters
                </button>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Search
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
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
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                    </div>
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by title, description, or notes"
                      className="w-full rounded-xl border border-slate-200 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {showAdvancedFilters && (
                  <>
                    <div className="w-full sm:w-48">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-white"
                      >
                        <option value="">All Status</option>
                        <option value="todo">To do</option>
                        <option value="in-progress">In progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>

                    <div className="w-full sm:w-48">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Priority
                      </label>
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                      >
                        <option value="">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div className="w-full sm:w-48">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Category
                      </label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                      >
                        <option value="">All Categories</option>
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="shopping">Shopping</option>
                        <option value="health">Health</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="w-full sm:w-48">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Date Filter
                      </label>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                      >
                        <option value="">All Dates</option>
                        <option value="today">Today</option>
                        <option value="this-week">This Week</option>
                        <option value="overdue">Overdue</option>
                        <option value="upcoming">Upcoming</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="w-full sm:w-48">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                    >
                      <option value="createdAt">Created</option>
                      <option value="dueDate">Due Date</option>
                      <option value="title">Title</option>
                      <option value="priority">Priority</option>
                      <option value="status">Status</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50 transition"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>

              {mutationMessage && (
                <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3">
                  <p className="text-sm font-medium text-rose-700">{mutationMessage}</p>
                </div>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedTasks.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">
                    {selectedTasks.length} task(s) selected
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkStatusUpdate('todo')}
                      className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition"
                    >
                      Mark Todo
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate('in-progress')}
                      className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition"
                    >
                      Mark In Progress
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate('done')}
                      className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition"
                    >
                      Mark Done
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedTasks([])}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            <TaskList
              tasks={tasksQuery.data?.tasks}
              loading={tasksQuery.isLoading || tasksQuery.isFetching}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              selectedTasks={selectedTasks}
              onSelectTask={handleSelectTask}
              onSelectAll={handleSelectAll}
              showCheckboxes={true}
            />
          </div>
        </div>
        </div>
      </section>
      </div>
    </div>
  );
}
