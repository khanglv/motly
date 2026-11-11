type Props = {
  message: string;
  retryLabel: string;
  onRetry: () => void;
};

export function ErrorState({ message, retryLabel, onRetry }: Props) {
  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-card bg-cream-dark/60 p-8 text-center">
      <p className="text-ink-soft">{message}</p>
      <button type="button" onClick={onRetry} className="btn-outline">
        {retryLabel}
      </button>
    </div>
  );
}
