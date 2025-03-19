export default function PredictionInfo({
  title,
  children,
  className,
  titleBottom = true,
  ...props
}) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`} {...props}>
      {!titleBottom && <span className="font-medium text-font-tertiary">{title}</span>}
      {children}
      {titleBottom && <span className="font-medium text-font-tertiary">{title}</span>}
    </div>
  );
}
