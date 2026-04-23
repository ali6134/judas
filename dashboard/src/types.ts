export type Verdict =
  | "correct"
  | "outdated"
  | "false"
  | "hallucinated"
  | "unverifiable";

export type ModelId = "chatgpt" | "perplexity" | "google-ai-overview";

export interface Source {
  url: string;
  title: string | null;
  domain?: string;
  citation_count?: number;
  citation_position?: number;
}

export interface Claim {
  claim_text: string;
  fact_category: string;
  claimed_value: string;
  ground_truth_value: unknown;
  verdict: Verdict;
  severity: number;
  reasoning: string;
}

export interface Phase3Response {
  chat_id: string;
  prompt: string;
  prompt_id: string;
  prompt_topic: string;
  model: ModelId;
  model_id: string;
  timestamp: string;
  response_text: string;
  claim_count: number;
  claims: Claim[];
}

export interface PerModelAccuracy {
  total_severity_weighted: number;
  total_claims: number;
  correct: number;
  wrong: number;
  accuracy_pct: number | null;
}

export interface Phase3Data {
  brand: string;
  phase: string;
  analyzed_at: string;
  source_file: string;
  ground_truth_file: string;
  comparison_prompt: string;
  total_responses: number;
  total_claims: number;
  verdict_counts: Record<Verdict, number>;
  per_category_verdicts: Record<string, Record<Verdict, number>>;
  per_model_accuracy: Record<ModelId, PerModelAccuracy>;
  responses: Phase3Response[];
}

export interface Phase1Response {
  chat_id: string;
  cited_sources: Source[];
}

export interface Phase1Data {
  brand: string;
  pulled_at: string;
  responses: Phase1Response[];
}

export interface Dataset extends Phase3Data {
  responses: (Phase3Response & { cited_sources: Source[] })[];
}

export interface MatrixCellData {
  verdicts: Partial<Record<Verdict, number>>;
  claims: (Claim & {
    _response: Phase3Response & { cited_sources: Source[] };
  })[];
}

export type MatrixData = Record<string, Partial<Record<ModelId, MatrixCellData>>>;
