import ReactMarkdown from "react-markdown";

export function MarkdownReply({ text }: { text: string }) {
  return (
    <div className="text-sm leading-relaxed text-ink-800 [&_a]:text-current-700 [&_a]:underline [&_li]:mt-1 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-2 [&_strong]:font-semibold [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}
