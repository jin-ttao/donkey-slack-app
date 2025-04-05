import mongoose from 'mongoose';

export enum ActionStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DELAYED = 'DELAYED'
}

interface Action {
  userId: mongoose.Types.ObjectId;
  goalId: mongoose.Types.ObjectId;
  content: string;
  status: ActionStatus;
  plannedDate: {
    start: Date;
    end: Date;
    duration: number;
  };
  actualDate?: {
    start?: Date;
    end?: Date;
    duration?: number;
  };
  delayCount: number;
  messageHistory: {
    messageId: mongoose.Types.ObjectId;
    timestamp: Date;
  }[];
  metadata?: {
    calendarEventId?: string;
    priority: 'high' | 'medium' | 'low';
    tags?: string[];
  };
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
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
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
    plannedDate: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      duration: { type: Number, required: true }
    },
    actualDate: {
      start: Date,
      end: Date,
      duration: Number
    },
    delayCount: {
      type: Number,
      default: 0,
    },
    messageHistory: [{
      messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true
      },
      timestamp: {
        type: Date,
        required: true
      }
    }],
    metadata: {
      calendarEventId: String,
      priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
      },
      tags: [String],
    },
  },
  {
    timestamps: true,
  }
);

actionSchema.index({ userId: 1, status: 1 });
actionSchema.index({ goalId: 1 });
actionSchema.index({ 'plannedDate.end': 1 });
actionSchema.index({ 'metadata.calendarEventId': 1 });
actionSchema.index({ 'messageHistory.messageId': 1 });

export const Action = mongoose.model<Action>('Action', actionSchema);
