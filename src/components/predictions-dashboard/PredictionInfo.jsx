export default function PredictionInfo({
  title,
  children,
  titleBottom = true,
}) {
  return (
    <div className="flex flex-col items-center">
      {!titleBottom && <span className="font-medium text-font-tertiary">{title}</span>}
      {children}
      {titleBottom && <span className="font-medium text-font-tertiary">{title}</span>}
    </div>
  );
}
