export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  description?: string;
  options: PollOption[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  totalVotes: number;
  isActive: boolean;
}

export interface Vote {
  id: string;
  pollId: string;
  optionId: string;
  userId?: string;
  createdAt: Date;
}
