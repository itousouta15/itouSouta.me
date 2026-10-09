"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  IMPRESSION_MAX_LENGTH,
  IMPRESSION_COOLDOWN_SECONDS,
  normalizeImpression,
  type VisitorImpression,
} from "../../lib/impressions";
import {
  layoutImpressionCloud,
  type CloudWord,
} from "../../lib/impressionCloud";

const MAX_VISIBLE = 60;
const COLORS = ["var(--blue)", "var(--purple)", "var(--tx)", "var(--dim)"];

export default function VisitorImpressionsCard() {
  const cardRef = useRef<HTMLElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const cloudSeed = useRef(0);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const loadController = useRef<AbortController | null>(null);
  const submitController = useRef<AbortController | null>(null);
  const [impressions, setImpressions] = useState<VisitorImpression[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [coolingDown, setCoolingDown] = useState(false);
  const [layout, setLayout] = useState<CloudWord[]>([]);
  const [lastSubmitted, setLastSubmitted] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  const load = useCallback(async () => {
    loadController.current?.abort();
    const controller = new AbortController();
    loadController.current = controller;
    setStatus("loading");
    setMessage(null);
    try {
      const response = await fetch("/api/impressions", {
        cache: "no-store",
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !Array.isArray(data?.impressions))
        throw new Error("暫時無法讀取印記，請稍後再試");
      if (controller.signal.aborted) return;
      setImpressions(data.impressions);
      setStatus("ready");
    } catch {
      if (controller.signal.aborted) return;
      setStatus("error");
      setMessage({ kind: "error", text: "暫時無法讀取印記，請稍後再試" });
    }
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              if (!entries.some((entry) => entry.isIntersecting)) return;
              observer?.disconnect();
              void load();
            },
            { rootMargin: "240px" }
          )
        : null;
    if (observer) observer.observe(el);
    else void load();
    return () => {
      observer?.disconnect();
      loadController.current?.abort();
      submitController.current?.abort();
      clearTimeout(cooldownTimer.current);
    };
  }, [load]);

  const { cloud, total } = useMemo(() => {
    const sorted = [...impressions].sort(
      (a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-TW")
    );
    const visible = sorted.slice(0, MAX_VISIBLE);
    // 新印象也要看得到，不會因為次數少被熱門詞擠出畫面。
    const latest = sorted.find((item) => item.tag === lastSubmitted);
    if (latest && !visible.includes(latest))
      visible[visible.length - 1] = latest;
    return {
      cloud: visible,
      total: impressions.reduce((sum, item) => sum + item.count, 0),
    };
  }, [impressions, lastSubmitted]);

  useEffect(() => {
    const el = cloudRef.current;
    if (!el) return;
    if (!cloudSeed.current)
      cloudSeed.current = Math.floor(Math.random() * 4294967295) + 1;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    let stopped = false;
    let frame = 0;
    const draw = () => {
      if (stopped || !el.clientWidth || !el.clientHeight) return;
      const font = getComputedStyle(el).fontFamily;
      setLayout(
        layoutImpressionCloud(
          cloud,
          el.clientWidth,
          el.clientHeight,
          cloudSeed.current,
          (text, size) => {
            context.font = `700 ${size}px ${font}`;
            return context.measureText(text).width;
          },
          lastSubmitted
        )
      );
    };
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        draw();
      });
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    draw();
    document.fonts.addEventListener("loadingdone", schedule);
    void document.fonts.ready.then(() => {
      if (!stopped) schedule();
    });
    return () => {
      stopped = true;
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", schedule);
      cancelAnimationFrame(frame);
    };
  }, [cloud, lastSubmitted]);

  const startCooldown = (seconds: number) => {
    clearTimeout(cooldownTimer.current);
    setCoolingDown(true);
    cooldownTimer.current = setTimeout(
      () => setCoolingDown(false),
      seconds * 1000
    );
  };

  const leaveImpression = async (value: string) => {
    if (submitController.current || coolingDown || status !== "ready") return;
    const tag = normalizeImpression(value);
    if (!tag) {
      setMessage({
        kind: "error",
        text: `印象需 1～${IMPRESSION_MAX_LENGTH} 字`,
      });
      return;
    }
    const controller = new AbortController();
    submitController.current = controller;
    setSending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/impressions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (controller.signal.aborted) return;
        if (response.status === 429 && Number.isFinite(data?.retryAfter))
          startCooldown(Math.min(60, Math.max(1, data.retryAfter)));
        throw new Error(
          typeof data?.error === "string" ? data.error : "留印失敗，請稍後再試"
        );
      }
      if (
        data?.tag !== tag ||
        !Number.isSafeInteger(data.count) ||
        data.count < 1
      )
        throw new Error("留印失敗，請稍後再試");
      if (controller.signal.aborted) return;
      setImpressions((current) => [
        ...current.filter((item) => item.tag !== tag),
        { tag, count: data.count },
      ]);
      setLastSubmitted(tag);
      setInput("");
      startCooldown(IMPRESSION_COOLDOWN_SECONDS);
      setMessage({ kind: "success", text: `已留下「${tag}」，謝謝你來過！` });
    } catch (error) {
      if (controller.signal.aborted) return;
      setMessage({
        kind: "error",
        text:
          error instanceof Error && error.name !== "TypeError"
            ? error.message
            : "留印失敗，請稍後再試",
      });
    } finally {
      submitController.current = null;
      if (!controller.signal.aborted) setSending(false);
    }
  };

  return (
    <section
      ref={cardRef}
      className="card impressions-card"
      aria-labelledby="impressions-title"
    >
      <div className="card-kicker">IMPRESSIONS</div>
      <div className="impressions-heading">
        <h2 id="impressions-title">訪客留印牆</h2>
        {status === "ready" && (
          <span className="impressions-total">
            {impressions.length} 種印象 · {total} 筆回應
          </span>
        )}
      </div>
      <p className="impressions-description">
        你印象中的我是怎樣的呢？來寫些什麼吧！
      </p>

      <div
        ref={cloudRef}
        className="impressions-cloud"
        aria-label="大家留下的印象"
        aria-busy={status === "loading"}
      >
        {status === "loading" ? (
          <p className="impressions-empty" role="status">
            印記載入中…
          </p>
        ) : status === "error" ? (
          <button
            className="impressions-retry"
            type="button"
            onClick={() => void load()}
          >
            重新載入
          </button>
        ) : cloud.length === 0 ? (
          <p className="impressions-empty">還沒有印記，來留下第一個吧。</p>
        ) : (
          layout.map(({ tag, count, x, y, size, angle, color }) => {
            return (
              <span
                key={tag}
                className="impressions-word"
                tabIndex={0}
                style={
                  {
                    left: `${x}px`,
                    top: `${y}px`,
                    "--impression-size": `${size}px`,
                    "--impression-tilt": `${angle}deg`,
                    color: COLORS[color],
                  } as CSSProperties
                }
              >
                <span>{tag}</span>
                <span className="impressions-count" aria-hidden="true">
                   {count} 次
                </span>
                <span className="sr-only"> {count} 次</span>
              </span>
            );
          })
        )}
      </div>
      {impressions.length > MAX_VISIBLE && (
        <p className="impressions-overflow-note">
          隨機展示常見印象，剛留下的詞也會保留在牆上。
        </p>
      )}

      <form
        className="impressions-form"
        onSubmit={(event) => {
          event.preventDefault();
          void leaveImpression(input);
        }}
      >
        <label htmlFor="impression-input" className="sr-only">
          留下你的印象
        </label>
        <input
          id="impression-input"
          type="text"
          placeholder="寫下對我的印象…"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={IMPRESSION_MAX_LENGTH}
          required
          disabled={sending || status !== "ready"}
        />
        <button
          type="submit"
          disabled={
            sending || coolingDown || status !== "ready" || !input.trim()
          }
        >
          {sending ? "留印中…" : coolingDown ? "稍候再留印" : "留印"}
        </button>
      </form>
      {message && (
        <p
          className={`impressions-message impressions-message--${message.kind}`}
          role={message.kind === "error" ? "alert" : "status"}
        >
          {message.text}
        </p>
      )}
    </section>
  );
}
