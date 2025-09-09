import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';

import globalStore from '.';
import { useAlertStore } from './Alert';

import nexusaiAPI from '@/api/nexusaiAPI';

import i18n from '@/utils/plugins/i18n';

function callAlert(type, alertText) {
  const alertStore = useAlertStore();
  alertStore.add({
    text: i18n.global.t(`agent_builder.instructions.${alertText}`),
    type,
  });
}

export const useInstructionsStore = defineStore('Instructions', () => {
  const connectProjectUuid = computed(
    () => globalStore.state.Auth.connectProjectUuid,
  );

  const instructions = reactive({
    data: [],
    status: null,
  });

  const newInstruction = reactive({
    text: '',
    status: null,
  });

  async function addInstruction() {
    newInstruction.status = 'loading';

    try {
      const instructionResponse =
        await nexusaiAPI.agent_builder.instructions.addInstruction({
          projectUuid: connectProjectUuid.value,
          instruction: newInstruction,
        });

      instructions.data.unshift({
        ...newInstruction,
        id: instructionResponse.id,
      });
      newInstruction.status = null;
      newInstruction.text = '';

      callAlert('success', 'new_instruction.success_alert');
    } catch (error) {
      newInstruction.status = 'error';
      callAlert('error', 'new_instruction.error_alert');
    }
  }

  async function loadInstructions() {
    instructions.status = 'loading';
    try {
      const response = await nexusaiAPI.agent_builder.instructions.list({
        projectUuid: connectProjectUuid.value,
      });

      instructions.data = [...instructions.data, ...response];
      instructions.status = 'complete';
    } catch (error) {
      instructions.status = 'error';
    }
  }

  return {
    instructions,
    newInstruction,

    addInstruction,
    loadInstructions,
  };
});
