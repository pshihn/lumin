export declare interface Highlighter {
  progress: number;
  start(duration: number): Promise<boolean>;
  stop();
  clear();
}
export default function lumin(node: HTMLElement): Highlighter;
