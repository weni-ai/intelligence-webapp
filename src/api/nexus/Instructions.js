import nexusRequest from '../nexusaiRequest';
import { InstructionAdapter } from '../adapters/instructions/instruction';
import { useProfileStore } from '@/store/Profile';

const request = nexusRequest;

export const Instructions = {
  async addInstruction({ projectUuid, instruction }) {
    const profileStore = useProfileStore();
    const body = {
      instructions: [
        ...profileStore.instructions.current,
        InstructionAdapter.toApi(instruction),
      ],
    };
    const response = await request.$http.put(
      `api/${projectUuid}/customization/`,
      body,
      {
        hideGenericErrorAlert: true,
      },
    );

    const biggestId = response.data.instructions.reduce((acc, instruction) => {
      if (instruction.id > acc) acc = instruction.id;
      return acc;
    }, 0);

    return InstructionAdapter.fromApi(
      response.data.instructions.find(
        (instruction) => instruction.id === biggestId,
      ),
    );
  },
};
