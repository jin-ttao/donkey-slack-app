import mongoose from 'mongoose';

export enum GoalStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  AT_RISK = 'AT_RISK',
  DELAYED = 'DELAYED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ARCHIVED = 'ARCHIVED'
}

const goalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(GoalStatus),
    default: GoalStatus.PLANNING
  },
  reminderSettings: {
    frequency: {
      type: String,
      enum: ['DAILY'],
      default: 'DAILY'
    },
    times: {
      type: [String],
      default: ['08:00', '13:00', '18:00', '23:00']
    }
  }
}, {
  timestamps: true
});

export const Goal = mongoose.model('Goal', goalSchema);
