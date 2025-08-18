type InfoPageProps = {
  title: string;
  subtitle: string;
}

export const InfoPage = ({ title, subtitle }: InfoPageProps) => {
  return (
    <div className="bg-white shadow-sm border-b border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-2xl">
      <div className="max-w-7xl px-7 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <p className="text-gray-600 mt-2 dark:text-gray-300 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
