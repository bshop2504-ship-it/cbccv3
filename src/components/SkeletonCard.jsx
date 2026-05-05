export default function SkeletonCard() {
  return (
    <div className="animate-pulse space-y-3 p-4">
      <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
      <div className="h-40 bg-gray-200 rounded"></div>
      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
    </div>
  );
}
