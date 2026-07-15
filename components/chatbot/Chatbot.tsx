"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import {
  CHATBOT_GREETING,
  CHATBOT_QUICK_REPLIES,
  findChatbotAnswer,
} from "@/lib/chatbotResponses";

type Message = {
  id: number;
  from: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "bot", text: CHATBOT_GREETING },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userId = nextId.current++;
    const botId = nextId.current++;

    setMessages((prev) => [
      ...prev,
      { id: userId, from: "user", text: trimmed },
      { id: botId, from: "bot", text: findChatbotAnswer(trimmed) },
    ]);
    setInput("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {open && (
        <div className="chat-pop fixed bottom-24 right-4 z-50 flex h-[420px] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:right-6">
          <div className="flex items-center justify-between bg-aned-teal px-4 py-3 text-white">
            <div>
              <p className="section-title font-bold">Miss Aned</p>
              <p className="text-xs text-teal-100">Orientación cercana para mamás y papás</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-white/20"
              aria-label="Cerrar chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-aned-cream/50 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    message.from === "user"
                      ? "rounded-br-md bg-aned-orange text-white"
                      : "rounded-bl-md bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-100 bg-white p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {CHATBOT_QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => sendMessage(reply)}
                  className="rounded-full bg-aned-cream px-3 py-1 text-xs font-semibold text-aned-teal transition hover:bg-aned-teal hover:text-white"
                >
                  {reply}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu duda sobre clases, costos o inscripción…"
                className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-aned-teal focus:ring-2 focus:ring-aned-teal/20"
              />
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-aned-teal text-white transition hover:bg-aned-teal-dark"
                aria-label="Enviar mensaje"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-aned-orange text-white shadow-xl transition hover:scale-105 hover:bg-aned-orange-dark sm:right-6"
        aria-label="Abrir chat de ayuda"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
