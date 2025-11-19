import { Spinner } from '../ui/Spinner';

export default function ProfileCard({ user, stats, loading, theme }) {
  const accentText = theme?.accentText || 'text-brand-600';
  const accentGradient = theme?.accentGradient || 'from-brand-500 to-brand-600';
  const borderColor = theme?.headerBorder || 'border-brand-50';
  const badgeBorder = theme?.badgeBorder || 'border-brand-100';

  if (loading) {
    return (
      <div className={`rounded-2xl border ${borderColor} bg-white p-6 shadow-card-lg`}>
        <Spinner label="Loading profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`rounded-2xl border ${borderColor} bg-white p-6 shadow-card-lg`}>
        <p className="text-sm text-slate-500">No profile data available.</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl border ${borderColor} bg-gradient-to-br from-white via-brand-50/30 to-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-sm`}
    >
      <div className="mb-6">
        <h2 className={`text-sm font-semibold uppercase tracking-[0.2em] ${accentText}`}>
          Welcome back
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-850">{user.name}</p>
        <p className="mt-1 text-sm text-slate-500">{user.email}</p>
      </div>

      <div className="border-t border-brand-100 pt-6">
        <p className={`mb-4 text-xs font-bold uppercase tracking-[0.2em] ${accentText}`}>
          Task Summary
        </p>
        <dl className="grid grid-cols-3 gap-3">
          {[
            { key: 'todo', label: 'Todo' },
            { key: 'in-progress', label: 'In Progress' },
            { key: 'done', label: 'Done' },
          ].map(({ key, label }) => (
            <div
              key={key}
              className={`rounded-2xl border ${badgeBorder} bg-white/90 p-4 text-center shadow-sm transition-all hover:shadow-md`}
            >
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {label}
              </dt>
              <dd className="mt-2 text-3xl font-bold text-slate-850">{stats?.[key] ?? 0}</dd>
              <div className="mt-2 flex justify-center">
                <span className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${accentGradient}`} />
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

