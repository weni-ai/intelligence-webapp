import nexusaiAPI from '@/api/nexusaiAPI';
import { defineStore } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import globalStore from '.';
import { cloneDeep, differenceBy, get } from 'lodash';

export const useProfileStore = defineStore('profile', () => {
  const connectProjectUuid = computed(
    () => globalStore.state.Auth.connectProjectUuid,
  );

  const status = ref(null);
  const isSaving = ref(false);

  const name = reactive({
    current: '',
    old: '',
  });

  const role = reactive({
    current: '',
    old: '',
  });

  const personality = reactive({
    current: '',
    old: '',
  });

  const goal = reactive({
    current: '',
    old: '',
  });

  const instructions = reactive({
    current: '',
    old: '',
  });

  const humanSupport = reactive({
    current: false,
    old: false,
  });

  const humanSupportPrompt = reactive({
    current: '',
    old: '',
  });

  const errorRequiredFields = reactive({
    name: false,
    role: false,
    goal: false,
    humanSupportPrompt: false,
  });

  const hasChanged = computed(() => {
    return (
      [name, role, personality, goal, humanSupport, humanSupportPrompt].some(
        ({ current, old }) => current !== old,
      ) ||
      !!differenceBy(instructions.current, instructions.old, 'instruction')
        .length
    );
  });

  const isSaveButtonDisabled = computed(() => {
    const hasErrorRequiredFields =
      Object.values(errorRequiredFields).includes(true);

    return !hasChanged.value || hasErrorRequiredFields;
  });

  function setInitialValues(data) {
    name.old = name.current = data.agent?.['name'] || '';
    role.old = role.current = data.agent?.['role'] || '';
    personality.old = personality.current = data.agent?.['personality'] || '';
    goal.old = goal.current = data.agent?.['goal'] || '';
    instructions.current = data.instructions || [];
    humanSupport.old = humanSupport.current =
      data.team?.['human_support'] || false;
    humanSupportPrompt.old = humanSupportPrompt.current =
      data.team?.['human_support_prompt'] || '';

    if (instructions.current.length === 0) {
      instructions.current.push({
        instruction: '',
      });
    }

    instructions.old = cloneDeep(instructions.current);
  }

  async function load() {
    if (status.value !== null) {
      return;
    }

    try {
      status.value = 'loading';

      const { data } = await nexusaiAPI.router.profile.read({
        projectUuid: connectProjectUuid.value,
      });

      setInitialValues(data);

      status.value = 'complete';
    } catch {
      status.value = 'error';
    }
  }

  function validate() {
    const fields = [
      {
        id: 'name',
        field: name,
      },
      {
        id: 'role',
        field: role,
      },
      {
        id: 'goal',
        field: goal,
      },
      humanSupport.current
        ? {
            id: 'humanSupportPrompt',
            field: humanSupportPrompt,
          }
        : null,
    ].filter(Boolean);

    const unfilledFields = fields.filter(({ field }) => !field.current.trim());

    unfilledFields.forEach(({ id, field }) => {
      errorRequiredFields[id] = true;

      watch(
        () => field.current,
        () => {
          errorRequiredFields[id] = false;
        },
        { once: true },
      );
    });

    if (unfilledFields.length) {
      throw {
        tab: 'profile',
      };
    }
  }

  async function save() {
    try {
      validate();

      isSaving.value = true;

      const payload = {
        agent: {
          name: name.current,
          role: role.current,
          personality: personality.current,
          goal: goal.current,
        },
        team: {
          human_support: humanSupport.current,
          human_support_prompt: humanSupportPrompt.current,
        },
        instructions: instructions.current.filter(
          ({ instruction }) => instruction,
        ),
      };

      const { data } = await nexusaiAPI.router.profile.edit({
        projectUuid: connectProjectUuid.value,
        data: payload,
      });

      setInitialValues(data);

      if (data?.team?.human_support !== humanSupport.old) {
        window.parent.postMessage(
          {
            event: 'change-human-service-status',
            value: JSON.stringify(humanSupport.current),
          },
          '*',
        );
      }
    } catch (error) {
      const tabWithError =
        get(error, 'tab') ||
        {
          'brain-customization-edit': 'profile',
        }[get(error, 'config.routerName')];

      if (tabWithError) {
        globalStore.state.Brain.tabsWithError = [tabWithError];
      }
    } finally {
      isSaving.value = false;
    }
  }

  async function removeInstruction(instructionIndex) {
    const { id: removeId } = instructions.current[instructionIndex];

    if (removeId) {
      await nexusaiAPI.router.profile.delete({
        projectUuid: connectProjectUuid.value,
        id: removeId,
      });
    }

    instructions.current.splice(instructionIndex, 1);
    instructions.old.splice(instructionIndex, 1);
  }

  function addEmptyInstruction() {
    instructions.current.push({
      instruction: '',
    });

    instructions.old.push({
      instruction: '',
    });
  }

  return {
    status,
    isSaving,
    name,
    role,
    personality,
    goal,
    instructions,
    humanSupport,
    humanSupportPrompt,
    errorRequiredFields,
    hasChanged,
    isSaveButtonDisabled,

    load,
    validate,
    save,

    removeInstruction,
    addEmptyInstruction,
  };
});
