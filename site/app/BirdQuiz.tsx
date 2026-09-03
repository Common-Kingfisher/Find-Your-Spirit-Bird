"use client";

/* Local images intentionally use plain img elements so the static bundle remains
   portable across Sites, EdgeOne Pages, and Cloudflare Pages. */
/* eslint-disable @next/next/no-img-element */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import rawData from "./data/quiz-data.json";
import {
  adviceFor,
  rankBirds,
  scaleOptions,
  scoreAnswers,
  tierCopy,
  type Bird,
  type QuizData,
  type RankedBird,
  type ScoreMap,
  type Tier,
} from "./lib/quiz";

const data = rawData as unknown as QuizData;
const storageKey = "bird-personality-answers-v2";

type View = "home" | "quiz" | "calculating" | "reveal" | "result";

interface QuizResult {
  scores: ScoreMap;
  ranking: RankedBird[];
}

const tierOrder: Tier[] = ["N", "R", "UR"];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function BirdLogo() {
  return (
    <span className="brand" aria-label="本命鸟研究所">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      <span>
        <b>本命鸟研究所</b>
        <small>BIRD · ID / 015</small>
      </span>
    </span>
  );
}

function CharacterVisual({
  bird,
  eager = false,
}: {
  bird: Bird;
  eager?: boolean;
}) {
  if (bird.characterReady) {
    return (
      <img
        className="character-image"
        src={bird.characterImage}
        alt={`${bird.name}原创几何鸟格角色图`}
        loading={eager ? "eager" : "lazy"}
      />
    );
  }

  return (
    <div className={`pending-character tier-${bird.tier.toLowerCase()}`}>
      <span className="pending-sun" />
      <span className="pending-hill pending-hill-a" />
      <span className="pending-hill pending-hill-b" />
      <span className="pending-bird-mark" aria-hidden="true">
        {bird.name.slice(-1)}
      </span>
      <span className="pending-label">角色绘制中 · {bird.id}</span>
    </div>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span className={`tier-badge tier-badge-${tier.toLowerCase()}`}>
      {tierCopy(tier).label}
    </span>
  );
}

function Home({
  onStart,
  onPreview,
  hasProgress,
}: {
  onStart: () => void;
  onPreview: (bird: Bird) => void;
  hasProgress: boolean;
}) {
  const sampleBirds = ["N01", "R03", "UR03"]
    .map((id) => data.birds.find((bird) => bird.id === id))
    .filter(Boolean) as Bird[];

  return (
    <div className="site-shell">
      <header className="site-header">
        <a href="#top" className="logo-link">
          <BirdLogo />
        </a>
        <nav aria-label="主页导航">
          <a href="#bird-atlas">15 种鸟格</a>
          <a href="#method">怎么判断</a>
          <button className="nav-cta" onClick={onStart}>
            {hasProgress ? "继续测试" : "开始测试"}
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="migration-line" aria-hidden="true">
            <span>01</span>
            <span>15</span>
          </div>
          <div className="hero-copy">
            <p className="eyebrow">CHINA WILD BIRD PERSONALITY ATLAS</p>
            <h1>
              测测你的
              <span>本命鸟</span>
            </h1>
            <p className="hero-lead">
              12 个判断，找到与你共享一套
              <br />
              飞行方式的中国野生鸟。
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={onStart}>
                <span>{hasProgress ? "继续上次航线" : "开始观察自己"}</span>
                <b aria-hidden="true">↗</b>
              </button>
              <a href="#bird-atlas" className="text-link">
                先认识 15 种鸟格
              </a>
            </div>
            <dl className="hero-facts">
              <div>
                <dt>12</dt>
                <dd>道陈述</dd>
              </div>
              <div>
                <dt>6</dt>
                <dd>条坐标</dd>
              </div>
              <div>
                <dt>15</dt>
                <dd>种本命鸟</dd>
              </div>
            </dl>
            <p className="micro-note">
              无抽取概率 · 不按稀有度分配结果 · 答案只在本地计算
            </p>
          </div>

          <div className="hero-stage" aria-label="三张正式鸟格角色样片">
            {sampleBirds.map((bird, index) => (
              <button
                key={bird.id}
                className={`hero-bird hero-bird-${index + 1}`}
                onClick={() => onPreview(bird)}
                aria-label={`预览${bird.name}结果页`}
              >
                <CharacterVisual bird={bird} eager />
                <span>
                  <b>{bird.nickname}</b>
                  <small>
                    {bird.name} · {bird.id}
                  </small>
                </span>
              </button>
            ))}
            <p className="stage-caption">
              <b>点击角色</b>
              <span>直接预览结算页</span>
            </p>
          </div>
        </section>

        <section className="positioning-strip" aria-label="测试原则">
          <p>这不是随机抽卡。</p>
          <ul>
            <li>同一组答案，始终得到同一只鸟</li>
            <li>稀有度只改变揭晓方式</li>
            <li>鸟类事实与人格隐喻分开呈现</li>
          </ul>
        </section>

        <section className="method-section" id="method">
          <div className="section-index">01 / 判断方式</div>
          <div className="method-intro">
            <p className="eyebrow">ONE FLIGHT, SIX COORDINATES</p>
            <h2>你不是一种标签，<br />而是一组飞行坐标。</h2>
            <p>
              每个回答会同时轻推几条坐标。完成后，系统比较你与 15
              种鸟格的六维距离，不使用随机数，也不追求结果平均。
            </p>
          </div>
          <div className="dimension-ledger">
            {data.dimensions.map((dimension, index) => (
              <div className="dimension-row" key={dimension.id}>
                <span className="dimension-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <b>{dimension.name}</b>
                  <small>{dimension.description}</small>
                </div>
                <p>
                  <span>{dimension.low}</span>
                  <i aria-hidden="true" />
                  <span>{dimension.high}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="atlas-section" id="bird-atlas">
          <div className="atlas-heading">
            <div>
              <div className="section-index">02 / 全部鸟格</div>
              <p className="eyebrow">THE FIELD GUIDE OF PERSONALITIES</p>
              <h2>15 种鸟，15 套应对世界的方法。</h2>
            </div>
            <p>
              普通、稀有、隐藏是图鉴分层，不是人格高低。结果页角色图将分批补齐；
              当前三张正式样片已可预览。
            </p>
          </div>

          {tierOrder.map((tier) => {
            const birds = data.birds.filter((bird) => bird.tier === tier);
            return (
              <div className={`atlas-group atlas-group-${tier.toLowerCase()}`} key={tier}>
                <div className="atlas-group-label">
                  <TierBadge tier={tier} />
                  <span>{birds.length} 种</span>
                </div>
                <div className="atlas-grid">
                  {birds.map((bird) => (
                    <article className="bird-card" key={bird.id}>
                      <button
                        className="bird-card-art"
                        onClick={() => onPreview(bird)}
                        aria-label={`查看${bird.name}鸟格结果`}
                      >
                        <CharacterVisual bird={bird} />
                      </button>
                      <div className="bird-card-body">
                        <p className="bird-code">
                          {bird.id} · {bird.englishName}
                        </p>
                        <h3>
                          {bird.name}
                          <span>{bird.nickname}</span>
                        </h3>
                        <p className="bird-persona">{bird.persona}</p>
                        <ul className="keyword-list">
                          {bird.strengths.map((strength) => (
                            <li key={strength}>{strength}</li>
                          ))}
                        </ul>
                        <p className="bird-habit">{bird.habit}</p>
                        <button
                          className="card-link"
                          onClick={() => onPreview(bird)}
                        >
                          看这只鸟的结果样式 <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <section className="closing-cta">
          <p className="eyebrow">READY TO TAKE OFF?</p>
          <h2>别挑一只喜欢的。<br />让答案替你找到它。</h2>
          <button className="primary-button primary-button-light" onClick={onStart}>
            <span>{hasProgress ? "继续测试" : "开始 12 题测试"}</span>
            <b aria-hidden="true">↗</b>
          </button>
        </section>
      </main>

      <footer className="site-footer">
        <BirdLogo />
        <p>
          中国野生鸟类人格娱乐测试。鸟类资料与人格映射分开呈现，不构成专业判断。
        </p>
        <span>V0.2 · 15 BIRDS · LOCAL FIRST</span>
      </footer>
    </div>
  );
}

function QuizScreen({
  index,
  answers,
  locked,
  onAnswer,
  onBack,
  onExit,
}: {
  index: number;
  answers: Array<number | null>;
  locked: boolean;
  onAnswer: (value: number) => void;
  onBack: () => void;
  onExit: () => void;
}) {
  const question = data.questions[index];
  const current = answers[index];
  const progress = ((index + 1) / data.questions.length) * 100;

  return (
    <main className="quiz-screen">
      <header className="quiz-header">
        <button className="logo-button" onClick={onExit}>
          <BirdLogo />
        </button>
        <div className="progress-copy">
          <span>
            {String(index + 1).padStart(2, "0")} / {data.questions.length}
          </span>
          <b>{question.scene}</b>
        </div>
        <button className="quiet-button" onClick={onExit}>
          暂停并返回
        </button>
      </header>

      <div
        className="quiz-progress"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={data.questions.length}
        aria-valuenow={index + 1}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <section className="question-panel">
        <p className="question-kicker">凭第一反应判断</p>
        <h1>{question.statement}</h1>

        <fieldset className="likert-fieldset" disabled={locked}>
          <legend className="sr-only">
            从强烈同意到强烈不同意选择一个答案
          </legend>
          <div className="likert-labels" aria-hidden="true">
            <span>同意</span>
            <span>不同意</span>
          </div>
          <div className="likert-options">
            {scaleOptions.map((option, optionIndex) => (
              <label
                key={option.value}
                className={`likert-option likert-${optionIndex + 1} ${
                  current === option.value ? "is-selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={current === option.value}
                  onChange={() => onAnswer(option.value)}
                />
                <span className="likert-circle" aria-hidden="true">
                  <i />
                </span>
                <span className="likert-text">{option.short}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="quiz-controls">
          <button className="back-button" onClick={onBack} disabled={index === 0}>
            ← 上一题
          </button>
          <p>没有标准答案，停顿太久反而会把直觉吓跑。</p>
        </div>
      </section>
    </main>
  );
}

function CalculatingScreen() {
  return (
    <main className="calculating-screen" aria-live="polite">
      <BirdLogo />
      <div className="flight-scan" aria-hidden="true">
        <span className="scan-bird scan-bird-a" />
        <span className="scan-bird scan-bird-b" />
        <span className="scan-bird scan-bird-c" />
        <i />
      </div>
      <p className="eyebrow">MATCHING 15 FLIGHT PATTERNS</p>
      <h1>正在对照你的飞行轨迹……</h1>
      <p>六条坐标已记录，正在寻找距离最近的鸟格。</p>
    </main>
  );
}

function RevealEffects({ tier }: { tier: Tier }) {
  if (tier === "N") {
    return (
      <div className="reveal-effects reveal-fireworks" aria-hidden="true">
        <span className="firework firework-a" />
        <span className="firework firework-b" />
        {Array.from({ length: 12 }, (_, index) => (
          <i key={index} style={{ "--i": index } as CSSProperties} />
        ))}
      </div>
    );
  }

  return (
    <div className="reveal-effects reveal-flock" aria-hidden="true">
      {Array.from({ length: tier === "UR" ? 16 : 10 }, (_, index) => (
        <i key={index} style={{ "--i": index } as CSSProperties} />
      ))}
    </div>
  );
}

function RevealScreen({ result }: { result: QuizResult }) {
  const winner = result.ranking[0];
  const copy = tierCopy(winner.bird.tier);

  return (
    <main className={`reveal-screen reveal-tier-${winner.bird.tier.toLowerCase()}`}>
      <RevealEffects tier={winner.bird.tier} />
      <div className="reveal-card">
        <p className="eyebrow">{copy.kicker}</p>
        <TierBadge tier={winner.bird.tier} />
        <div className="reveal-art">
          <CharacterVisual bird={winner.bird} eager />
        </div>
        <p>{copy.reveal}</p>
        <h1>{winner.bird.nickname}</h1>
        <span>{winner.bird.name}</span>
      </div>
    </main>
  );
}

function CoordinateChart({
  scores,
  bird,
}: {
  scores: ScoreMap;
  bird: Bird;
}) {
  return (
    <div className="coordinates">
      <div className="coordinate-legend">
        <span><i className="you-dot" />你</span>
        <span><i className="bird-dot" />{bird.name}</span>
      </div>
      {data.dimensions.map((dimension) => {
        const userValue = scores[dimension.id];
        const birdValue = bird.target[dimension.id];
        return (
          <div className="coordinate-row" key={dimension.id}>
            <div className="coordinate-title">
              <b>{dimension.name}</b>
              <span>{dimension.birdExpression}</span>
            </div>
            <div className="coordinate-scale">
              <small>{dimension.low}</small>
              <div className="coordinate-track">
                <span
                  className="coordinate-marker user-marker"
                  style={{ left: `${userValue}%` }}
                  aria-label={`你：${userValue}`}
                >
                  {userValue}
                </span>
                <span
                  className="coordinate-marker bird-marker"
                  style={{ left: `${birdValue}%` }}
                  aria-label={`${bird.name}：${birdValue}`}
                >
                  {birdValue}
                </span>
              </div>
              <small>{dimension.high}</small>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SciencePhoto({ bird }: { bird: Bird }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`science-photo ${failed ? "is-missing" : ""}`}>
      {!failed && (
        <img
          src={bird.sciencePhoto}
          alt={`${bird.name}真实科普照片`}
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <div className="photo-placeholder">
          <span>{bird.id}</span>
          <b>等待你的照片</b>
          <p>放入 site/public/birds/science/{bird.id}.jpg 后会自动出现</p>
        </div>
      )}
    </div>
  );
}

function ResultScreen({
  result,
  onReset,
  onHome,
}: {
  result: QuizResult;
  onReset: () => void;
  onHome: () => void;
}) {
  const [shareState, setShareState] = useState("分享这只鸟");
  const winner = result.ranking[0];
  const bird = winner.bird;
  const copy = tierCopy(bird.tier);
  const runnerUps = result.ranking.slice(1, 3);
  const advice = adviceFor(result.scores);

  async function shareResult() {
    const text = `我的本命鸟是${bird.nickname}·${bird.name}，匹配度${winner.match}%——${bird.why}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "测测你的本命鸟", text });
      } else {
        await navigator.clipboard.writeText(text);
        setShareState("结果文案已复制");
        window.setTimeout(() => setShareState("分享这只鸟"), 1800);
      }
    } catch {
      setShareState("可以稍后再分享");
    }
  }

  return (
    <div className={`result-page result-tier-${bird.tier.toLowerCase()}`}>
      <header className="result-header">
        <button className="logo-button" onClick={onHome}>
          <BirdLogo />
        </button>
        <p>PERSONAL BIRD FILE · {bird.id}</p>
        <button className="quiet-button" onClick={onReset}>
          重新测试
        </button>
      </header>

      <main>
        <section className="result-hero">
          <div className="result-art">
            <CharacterVisual bird={bird} eager />
            {!bird.characterReady && (
              <p>当前为统一生境占位；正式角色图完成后自动替换。</p>
            )}
          </div>
          <div className="result-intro">
            <div className="result-meta">
              <TierBadge tier={bird.tier} />
              <span>{bird.scientificName}</span>
            </div>
            <p className="eyebrow">{copy.kicker}</p>
            <h1>{bird.nickname}</h1>
            <h2>{bird.name} <span>{bird.englishName}</span></h2>
            <p className="result-why">{bird.why}</p>
            <ul className="keyword-list keyword-list-large">
              {bird.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
            <div className="match-number">
              <span>鸟格相似度</span>
              <b>{winner.match}</b>
              <i>%</i>
            </div>
          </div>
        </section>

        <section className="result-section coordinate-section">
          <div className="result-section-heading">
            <span>01</span>
            <div>
              <p className="eyebrow">YOUR FLIGHT COORDINATES</p>
              <h2>你们相遇在这六条坐标上。</h2>
            </div>
            <p>数值用于娱乐性匹配，不是心理测量或医学量表。</p>
          </div>
          <CoordinateChart scores={result.scores} bird={bird} />
        </section>

        <section className="result-section analysis-section">
          <div className="result-section-heading">
            <span>02</span>
            <div>
              <p className="eyebrow">BIRDIFIED PORTRAIT</p>
              <h2>你的鸟格速写</h2>
            </div>
          </div>
          <div className="analysis-grid">
            <article className="analysis-lead">
              <span>核心优势</span>
              <h3>{bird.persona}</h3>
              <p>{bird.why}</p>
            </article>
            <article>
              <span>藏在羽色里的侧面</span>
              <p>{bird.hiddenSide}</p>
            </article>
            <article>
              <span>别人容易看错的地方</span>
              <p>{bird.misunderstood}</p>
            </article>
          </div>
        </section>

        <section className="result-section relations-section">
          <div className="result-section-heading">
            <span>03</span>
            <div>
              <p className="eyebrow">YOUR SMALL FLOCK</p>
              <h2>与你同栖、伴飞或形成反差的鸟。</h2>
            </div>
          </div>
          <div className="ranking-strip">
            {runnerUps.map((item, index) => (
              <article key={item.bird.id}>
                <span>潜在鸟格 0{index + 2}</span>
                <b>{item.bird.name}</b>
                <small>{item.bird.nickname}</small>
                <i>{item.match}%</i>
              </article>
            ))}
            <article>
              <span>同栖搭子</span>
              <b>{bird.compatibleBird}</b>
              <small>相近的节奏，更容易互相接住</small>
            </article>
            <article>
              <span>逆风搭子</span>
              <b>{bird.contrastBird}</b>
              <small>差异明显，也可能拓宽彼此的航线</small>
            </article>
          </div>
        </section>

        <section className="result-section advice-section">
          <div className="result-section-heading">
            <span>04</span>
            <div>
              <p className="eyebrow">TODAY&apos;S FLIGHT NOTE</p>
              <h2>今天可以这样飞。</h2>
            </div>
          </div>
          <ol>
            {advice.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="result-section science-section">
          <div className="result-section-heading">
            <span>05</span>
            <div>
              <p className="eyebrow">THE REAL BIRD</p>
              <h2>人格隐喻之外，认识真实的它。</h2>
            </div>
            <p>这一部分只陈述鸟类事实。</p>
          </div>
          <div className="science-grid">
            <SciencePhoto bird={bird} />
            <div className="science-copy">
              <dl>
                <div>
                  <dt>外貌识别</dt>
                  <dd>{bird.appearance}</dd>
                </div>
                <div>
                  <dt>典型生境</dt>
                  <dd>{bird.habitat}</dd>
                </div>
                <div>
                  <dt>独特习性</dt>
                  <dd>{bird.habit}</dd>
                </div>
                <div>
                  <dt>范围与提醒</dt>
                  <dd>{bird.scopeNote}</dd>
                </div>
              </dl>
              <a href={bird.factSource} target="_blank" rel="noreferrer">
                查看事实资料来源 <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="result-actions">
          <div>
            <p className="eyebrow">KEEP OR FLY AGAIN</p>
            <h2>这不是定论，只是一面带羽毛的镜子。</h2>
          </div>
          <div>
            <button className="primary-button" onClick={shareResult}>
              <span>{shareState}</span>
              <b aria-hidden="true">↗</b>
            </button>
            <button className="secondary-button" onClick={onReset}>
              重新测试
            </button>
            <button className="text-link text-button" onClick={onHome}>
              返回完整鸟格图鉴
            </button>
          </div>
        </section>

        <p className="result-disclaimer">
          本测试仅供娱乐，不构成心理学、医疗、职业或其他专业判断。N / R / UR
          为玩法分层，不代表现实常见度或保护等级。
        </p>
      </main>
    </div>
  );
}

export default function BirdQuiz() {
  const [view, setView] = useState<View>("home");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>(
    Array(data.questions.length).fill(null),
  );
  const [locked, setLocked] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const revealTimer = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as Array<number | null>;
          if (parsed.length === data.questions.length) {
            setAnswers(parsed);
          }
        }
      } catch {
        // A private browsing context may disable storage; the test still works.
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {
      // Storage is optional.
    }
  }, [answers, hydrated]);

  useEffect(() => {
    if (view === "calculating") {
      revealTimer.current = window.setTimeout(() => {
        setView("reveal");
        scrollToTop();
      }, 1050);
    }
    if (view === "reveal" && result) {
      const duration = result.ranking[0].bird.tier === "N" ? 1850 : 2450;
      revealTimer.current = window.setTimeout(() => {
        setView("result");
        scrollToTop();
      }, duration);
    }
    return () => {
      if (revealTimer.current) window.clearTimeout(revealTimer.current);
    };
  }, [view, result]);

  const firstUnanswered = useMemo(() => {
    const index = answers.findIndex((answer) => answer === null);
    return index === -1 ? 0 : index;
  }, [answers]);

  const hasProgress = answers.some((answer) => answer !== null);

  function startQuiz() {
    setQuestionIndex(firstUnanswered);
    setView("quiz");
    scrollToTop();
  }

  function previewBird(bird: Bird) {
    const scores = { ...bird.target };
    setResult({ scores, ranking: rankBirds(data.birds, scores) });
    setView("reveal");
    scrollToTop();
  }

  function complete(newAnswers: Array<number | null>) {
    const scores = scoreAnswers(data.questions, newAnswers);
    setResult({ scores, ranking: rankBirds(data.birds, scores) });
    setView("calculating");
    scrollToTop();
  }

  function answer(value: number) {
    if (locked) return;
    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = value;
    setAnswers(nextAnswers);
    setLocked(true);
    window.setTimeout(() => {
      if (questionIndex === data.questions.length - 1) {
        complete(nextAnswers);
      } else {
        setQuestionIndex((current) => current + 1);
      }
      setLocked(false);
    }, 260);
  }

  function reset() {
    const empty = Array(data.questions.length).fill(null);
    setAnswers(empty);
    setQuestionIndex(0);
    setResult(null);
    setView("quiz");
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Storage is optional.
    }
    scrollToTop();
  }

  if (view === "quiz") {
    return (
      <QuizScreen
        index={questionIndex}
        answers={answers}
        locked={locked}
        onAnswer={answer}
        onBack={() => setQuestionIndex((current) => Math.max(0, current - 1))}
        onExit={() => {
          setView("home");
          scrollToTop();
        }}
      />
    );
  }

  if (view === "calculating") return <CalculatingScreen />;
  if (view === "reveal" && result) return <RevealScreen result={result} />;
  if (view === "result" && result) {
    return (
      <ResultScreen
        result={result}
        onReset={reset}
        onHome={() => {
          setView("home");
          scrollToTop();
        }}
      />
    );
  }

  return (
    <Home onStart={startQuiz} onPreview={previewBird} hasProgress={hasProgress} />
  );
}
