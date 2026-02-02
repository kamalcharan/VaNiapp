import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Squad, PlanType, SquadMember } from '../../types';

interface SquadState {
  planType: PlanType;
  squad: Squad | null;
}

const initialState: SquadState = {
  planType: 'solo',
  squad: null,
};

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const squadSlice = createSlice({
  name: 'squad',
  initialState,
  reducers: {
    setPlanType: (state, action: PayloadAction<PlanType>) => {
      state.planType = action.payload;
    },
    createSquad: (
      state,
      action: PayloadAction<{ name: string; emoji: string; leaderName: string }>
    ) => {
      const { name, emoji, leaderName } = action.payload;
      state.planType = 'squad';
      state.squad = {
        id: `sq-${Date.now()}`,
        name,
        emoji,
        inviteCode: generateInviteCode(),
        createdBy: 'self',
        members: [
          {
            userId: 'self',
            name: leaderName,
            role: 'leader',
            joinedAt: new Date().toISOString(),
          },
        ],
        maxMembers: 4,
        createdAt: new Date().toISOString(),
      };
    },
    addMember: (state, action: PayloadAction<SquadMember>) => {
      if (state.squad && state.squad.members.length < state.squad.maxMembers) {
        state.squad.members.push(action.payload);
      }
    },
    leaveSquad: (state) => {
      state.planType = 'solo';
      state.squad = null;
    },
    rehydrate: (_state, action: PayloadAction<SquadState>) => action.payload,
  },
});

export const { setPlanType, createSquad, addMember, leaveSquad } = squadSlice.actions;
export default squadSlice.reducer;
