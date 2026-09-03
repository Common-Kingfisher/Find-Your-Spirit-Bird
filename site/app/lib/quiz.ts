export const dimensionIds = [
  "social",
  "pace",
  "expression",
  "exploration",
  "order",
  "edge",
] as const;

export type DimensionId = (typeof dimensionIds)[number];
export type ScoreMap = Record<DimensionId, number>;

export type Tier = "N" | "R" | "UR";

export interface Dimension {
  id: DimensionId;
  name: string;
  low: string;
  high: string;
  description: string;
  birdExpression: string;
}

export interface Question {
  id: string;
  statement: string;
  agreeLabel: string;
  disagreeLabel: string;
  scene: string;
  focus: string;
  vector: ScoreMap;
}

export interface Bird {
  id: string;
  name: string;
  englishName: string;
  scientificName: string;
  appearance: string;
  habitat: string;
  habit: string;
  persona: string;
  why: string;
  strengths: string[];
  hiddenSide: string;
  misunderstood: string;
  compatibleBird: string;
  contrastBird: string;
  target: ScoreMap;
  priority: number;
  factSource: string;
  reviewStatus: string;
  tier: Tier;
  tierName: string;
  nickname: string;
  scopeNote: string;
  characterImage: string;
  characterReady: boolean;
  sciencePhoto: string;
  sciencePhotoReady: boolean;
  photo: string | null;
  photoAuthor: string | null;
  photoLicense: string | null;
  photoSource: string | null;
}

export interface QuizData {
  sourceWorkbook: string;
  dimensions: Dimension[];
  questions: Question[];
  birds: Bird[];
  photoCredits: Array<{
    id: string;
    bird: string;
    scientificName: string;
    author: string;
    license: string;
    status: string;
    creditLine: string;
  }>;
}

export interface RankedBird {
  bird: Bird;
  match: number;
  distance: number;
}

export const scaleOptions = [
  { value: 3, label: "强烈同意", short: "强烈同意" },
  { value: 2, label: "比较同意", short: "同意" },
  { value: 1, label: "稍微同意", short: "稍同意" },
  { value: 0, label: "中立", short: "中立" },
  { value: -1, label: "稍微不同意", short: "稍不同意" },
  { value: -2, label: "比较不同意", short: "不同意" },
  { value: -3, label: "强烈不同意", short: "强烈不同意" },
] as const;

export function scoreAnswers(
  questions: Question[],
  answers: Array<number | null>,
): ScoreMap {
  return dimensionIds.reduce((scores, dimensionId) => {
    const maxAbsolute = questions.reduce(
      (sum, question) => sum + 3 * Math.abs(question.vector[dimensionId]),
      0,
    );
    const contribution = questions.reduce((sum, question, index) => {
      const answer = answers[index] ?? 0;
      return sum + answer * question.vector[dimensionId];
    }, 0);
    const normalized =
      maxAbsolute === 0 ? 50 : 50 + (50 * contribution) / maxAbsolute;
    scores[dimensionId] = Math.round(
      Math.max(0, Math.min(100, normalized)),
    );
    return scores;
  }, {} as ScoreMap);
}

export function rankBirds(birds: Bird[], scores: ScoreMap): RankedBird[] {
  return birds
    .map((bird) => {
      const squareDistance = dimensionIds.reduce((sum, dimensionId) => {
        const difference = scores[dimensionId] - bird.target[dimensionId];
        return sum + difference * difference;
      }, 0);
      const distance = Math.sqrt(squareDistance / dimensionIds.length);
      return {
        bird,
        distance,
        match: Math.max(0, Math.round((100 - distance) * 10) / 10),
      };
    })
    .sort(
      (left, right) =>
        right.match - left.match ||
        left.bird.priority - right.bird.priority,
    );
}

export function adviceFor(scores: ScoreMap): string[] {
  const advice: string[] = [];

  if (scores.social < 40) {
    advice.push("给自己留一段低噪声的“隐蔽栖枝”，独处不是掉队，是正常补充能量。");
  } else if (scores.social > 68) {
    advice.push("把想做的事约成一次小规模“集群飞行”，你会在回应里迅速获得动力。");
  } else {
    advice.push("在独处与同伴之间留一条可切换的航线，不必固定成某一种社交模式。");
  }

  if (scores.order > 68) {
    advice.push("计划里故意留出约两成空白，给天气、灵感和临时来客一个改航机会。");
  } else if (scores.order < 38) {
    advice.push("出发前先定一个最小落点：一件必须完成的事，能让随风而行更踏实。");
  } else {
    advice.push("维持你现在的半结构节奏：先搭巢架，再允许细枝随现场变化。");
  }

  if (scores.edge > 68) {
    advice.push("俯冲之前多给一句软着陆说明，边界会更容易被听见，而不是只被感受到。");
  } else if (scores.edge < 38) {
    advice.push("练习一句短而明确的护巢表达：“这件事我不舒服，我希望改成……”");
  } else {
    advice.push("你已经懂得何时温和、何时亮出喙尖；关键场合继续相信这份判断。");
  }

  return advice.slice(0, 3);
}

export function tierCopy(tier: Tier) {
  if (tier === "R") {
    return {
      label: "稀有款 R",
      kicker: "发现稀有鸟格",
      reveal: "一群候鸟掠过以后，它停在了你的结果页。",
    };
  }
  if (tier === "UR") {
    return {
      label: "隐藏款 UR",
      kicker: "隐藏鸟格出现",
      reveal: "这次相遇很少见，但它仍由你的答案确定。",
    };
  }
  return {
    label: "普通款 N",
    kicker: "你的本命鸟已落在枝头",
    reveal: "经典烟花与花瓣，为一种真实又鲜活的飞行方式庆祝。",
  };
}
