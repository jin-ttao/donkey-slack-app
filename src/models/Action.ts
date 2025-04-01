import mongoose from 'mongoose';

export enum ActionStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

interface Action {
  userId: mongoose.Types.ObjectId;
  content: string;
  status: ActionStatus;
  startDate?: Date;
  endDate?: Date;
  estimatedTime?: number;
  actualTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

const actionSchema = new mongoose.Schema<Action>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ActionStatus),
      default: ActionStatus.TODO,
    },
    startDate: Date,
    endDate: Date,
    estimatedTime: Number,
    actualTime: Number,
  },
  {
    timestamps: true,
  }
);

export const Action = mongoose.model<Action>('Action', actionSchema);
