import mongoose from 'mongoose';

export enum MessageType {
  USER_INITIATIVE = 'USER_INITIATIVE',
  USER_RESPONSE = 'USER_RESPONSE',
  AI_COACH = 'AI_COACH',
  SYSTEM = 'SYSTEM'
}

export enum UserIntent {
  GOAL = 'GOAL',
  ACTION = 'ACTION',
  PROGRESS = 'PROGRESS',
  DELAY = 'DELAY',
  GENERAL = 'GENERAL'
}

export enum CoachMessageType {
  PLANNING = 'PLANNING',
  CHECK = 'CHECK',
  MOTIVATION = 'MOTIVATION',
  REMINDER = 'REMINDER',
  GENERAL = 'GENERAL'
}

export interface Message {
  userId: string;
  type: MessageType;
  content: string;
  intent?: UserIntent;
  coachType?: CoachMessageType;
  metadata?: {
    goalId?: mongoose.Types.ObjectId;
    actionId?: mongoose.Types.ObjectId;
    progress?: {
      status: 'not_started' | 'in_progress' | 'completed';
      plannedDate?: Date;
      actualDate?: Date;
      delayReason?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(MessageType),
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  intent: {
    type: String,
    enum: Object.values(UserIntent),
  },
  coachType: {
    type: String,
    enum: Object.values(CoachMessageType),
  },
  metadata: {
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
    },
    actionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Action',
    },
    progress: {
      status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
      },
      plannedDate: Date,
      actualDate: Date,
      delayReason: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({ userId: 1, createdAt: -1 });
messageSchema.index({ userId: 1, type: 1 });
messageSchema.index({ 'metadata.goalId': 1 });
messageSchema.index({ 'metadata.progress.status': 1 });

export const Message = mongoose.model<Message>('Message', messageSchema);
