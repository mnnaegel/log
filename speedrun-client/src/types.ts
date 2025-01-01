export type Split = {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  pessimisticEstimate: number;
  state: SplitState;
};

export enum SplitState {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}