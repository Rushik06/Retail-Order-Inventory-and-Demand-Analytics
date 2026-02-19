export default function Home() {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-slate-800">
        Dashboard Overview
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">
            Total Users
          </h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">
            1
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">
            Active Sessions
          </h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">
            1
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">
            Security Status
          </h3>
          <p className="text-lg font-semibold text-green-600 mt-2">
            Secure
          </p>
        </div>

      </div>
    </div>
  );
}