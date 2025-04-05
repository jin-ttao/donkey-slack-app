import mongoose from 'mongoose';

export enum GoalStatus {
  PLANNING = 'PLANNING', 
  ON_TRACK = 'ON_TRACK',
  AT_RISK = 'AT_RISK',
  BEHIND_SCHEDULE = 'BEHIND_SCHEDULE', 
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ARCHIVED = 'ARCHIVED'
}

export interface Goal {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: GoalStatus;
  startDate: Date;
  endDate?: Date;
  progress: number;
  actions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new mongoose.Schema<Goal>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: Object.values(GoalStatus),
    default: GoalStatus.PLANNING,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  actions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Action',
  }],
}, {
  timestamps: true,
});

goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ userId: 1, createdAt: -1 });

export const Goal = mongoose.model<Goal>('Goal', goalSchema);
