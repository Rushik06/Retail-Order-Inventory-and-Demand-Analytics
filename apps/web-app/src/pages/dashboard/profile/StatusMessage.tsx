interface Props {
  message: string;
}

export default function StatusMessage({ message }: Props) {
  if (!message) return null;

  const isError = message.toLowerCase().includes("fail");

  return (
    <div
      className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium ${
        isError
          ? "bg-red-50 text-red-600 border border-red-200"
          : "bg-green-50 text-green-600 border border-green-200"
      }`}
    >
      {message}
    </div>
  );
}