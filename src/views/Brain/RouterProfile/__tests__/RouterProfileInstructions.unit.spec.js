import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { useProfileStore } from '@/store/Profile';
import { useAlertStore } from '@/store/Alert';

import nexusaiAPI from '@/api/nexusaiAPI';

import RouterProfileInstructions from '../RouterProfileInstructions.vue';
import i18n from '@/utils/plugins/i18n';

vi.mock('@/api/nexusaiAPI', () => ({
  default: {
    router: {
      profile: {
        delete: vi.fn(),
      },
    },
  },
}));

vi.mock('@/store', () => ({
  default: {
    state: {
      Auth: { connectProjectUuid: '1234' },
    },
  },
}));

describe('RouterProfileInstructions.vue', () => {
  let wrapper;
  let profileStore;
  let alertStore;

  const createWrapper = (initialState = {}) => {
    const pinia = createTestingPinia({
      initialState: {
        profile: {
          status: 'complete',
          instructions: {
            current: [
              { id: '1', instruction: 'First instruction' },
              { id: '2', instruction: 'Second instruction' },
            ],
            old: [
              { id: '1', instruction: 'First instruction' },
              { id: '2', instruction: 'Second instruction' },
            ],
          },
          errorRequiredFields: {
            name: false,
            role: false,
            goal: false,
          },
          ...initialState,
        },
      },
      stubActions: false,
    });

    profileStore = useProfileStore(pinia);
    alertStore = useAlertStore(pinia);

    profileStore.addEmptyInstruction = vi.fn();
    profileStore.removeInstruction = vi.fn();

    return mount(RouterProfileInstructions, {
      global: {
        plugins: [pinia],
        stubs: {
          UnnnicInput: true,
        },
      },
    });
  };

  const instructionTitle = () =>
    wrapper.find('[data-testid="instructions-title"]');
  const instructionSubtitle = () =>
    wrapper.find('[data-testid="instructions-subtitle"]');
  const instructionInputs = () =>
    wrapper.findAll('[data-testid^="instruction-"]');
  const deleteButtons = () =>
    wrapper.findAll('[data-testid^="btn-delete-inst-"]');
  const addButton = () =>
    wrapper.findComponent('[data-testid="btn-add-instruction"]');
  const removeModal = () =>
    wrapper.findComponent('[data-testid="remove-modal"]');
  const removeButton = () =>
    wrapper.findComponent('[data-testid="btn-remove-inst"]');
  const loadingElements = () =>
    wrapper.findAllComponents('[data-testid="loading-instructions"]');

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = createWrapper();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('Component Rendering', () => {
    it('renders correctly with instructions', () => {
      expect(wrapper.exists()).toBe(true);
      expect(instructionTitle().exists()).toBe(true);
      expect(instructionSubtitle().exists()).toBe(true);
    });

    it('renders title and subtitle with correct text', () => {
      expect(instructionTitle().text()).toBe(
        i18n.global.t('profile.instructions.title'),
      );
      expect(instructionSubtitle().text()).toBe(
        i18n.global.t('profile.instructions.sub_title'),
      );
    });

    it('renders instruction inputs for each instruction', () => {
      expect(instructionInputs().length).toBe(2);
      expect(instructionInputs()[0].attributes('modelvalue')).toBe(
        'First instruction',
      );
      expect(instructionInputs()[1].attributes('modelvalue')).toBe(
        'Second instruction',
      );
    });

    it('renders delete buttons for each instruction', () => {
      expect(deleteButtons().length).toBe(2);
    });

    it('renders add instruction button', () => {
      expect(addButton().exists()).toBe(true);
      expect(addButton().text()).toBe('Add instruction');
    });

    it('does not render remove modal initially', () => {
      expect(removeModal().exists()).toBe(false);
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      wrapper = createWrapper({ status: 'loading' });
    });

    it('shows loading elements when status is loading', () => {
      console.log('wrapper', wrapper.html());
      expect(loadingElements().length).toBe(1);
    });

    it('hides instruction list when loading', () => {
      expect(instructionInputs().length).toBe(0);
    });

    it('hides add button when loading', () => {
      expect(addButton().exists()).toBe(false);
    });
  });

  describe('Add Button State', () => {
    it('enables add button when last instruction is not empty', () => {
      expect(addButton().props('disabled')).toBe(false);
    });

    it('disables add button when last instruction is empty', async () => {
      profileStore.instructions.current = [
        { id: '1', instruction: 'First instruction' },
        { id: '2', instruction: '' },
      ];
      await nextTick();

      expect(addButton().props('disabled')).toBe(true);
    });

    it('enables add button when there are no instructions', async () => {
      profileStore.instructions.current = [];
      await nextTick();

      expect(addButton().props('disabled')).toBe(false);
    });
  });

  describe('User Interactions', () => {
    describe('Adding Instructions', () => {
      it('calls addEmptyInstruction when add button is clicked', async () => {
        await addButton().trigger('click');

        expect(profileStore.addEmptyInstruction).toHaveBeenCalledTimes(1);
      });

      it('does not call addEmptyInstruction when add button is disabled', async () => {
        profileStore.instructions.current = [{ id: '1', instruction: '' }];
        await nextTick();

        await addButton().trigger('click');

        expect(profileStore.addEmptyInstruction).not.toHaveBeenCalled();
      });
    });

    describe('Removing Instructions', () => {
      it('shows remove modal when delete button is clicked', async () => {
        await deleteButtons()[0].trigger('click');

        expect(removeModal().exists()).toBe(true);
        expect(wrapper.vm.showRemoveModal).toBe(true);
        expect(wrapper.vm.currentInstruction).toBe(0);
      });

      it('shows remove modal with correct content', async () => {
        await deleteButtons()[1].trigger('click');

        const modal = removeModal();
        expect(modal.props('text')).toBe(
          i18n.global.t('profile.instructions.modals.title'),
        );
        expect(modal.props('description')).toBe(
          i18n.global.t('profile.instructions.modals.description'),
        );
        expect(modal.props('scheme')).toBe('aux-red-500');
        expect(modal.props('modalIcon')).toBe('error');
      });

      it('sets correct instruction index when different delete buttons are clicked', async () => {
        await deleteButtons()[1].trigger('click');

        expect(wrapper.vm.currentInstruction).toBe(1);
      });

      it('hides remove modal when back button is clicked', async () => {
        await deleteButtons()[0].trigger('click');
        expect(removeModal().exists()).toBe(true);

        const backButton = removeModal().find('button');
        await backButton.trigger('click');

        expect(wrapper.vm.showRemoveModal).toBe(false);
      });
    });

    describe('Remove Instruction Process', () => {
      beforeEach(async () => {
        await deleteButtons()[0].trigger('click');
      });

      it('calls removeInstruction with correct index when remove button is clicked', async () => {
        profileStore.removeInstruction.mockResolvedValue();

        await removeButton().trigger('click');

        expect(profileStore.removeInstruction).toHaveBeenCalledWith(0);
      });

      it('shows success alert when removal is successful', async () => {
        profileStore.removeInstruction.mockResolvedValue();
        alertStore.add = vi.fn();

        await removeButton().trigger('click');
        await nextTick();

        expect(alertStore.add).toHaveBeenCalledWith({
          type: 'success',
          text: i18n.global.t('profile.instructions.modals.success_message'),
        });
      });

      it('shows error alert when removal fails', async () => {
        profileStore.removeInstruction.mockRejectedValue(
          new Error('API Error'),
        );
        alertStore.add = vi.fn();

        await removeButton().trigger('click');
        await nextTick();

        expect(alertStore.add).toHaveBeenCalledWith({
          type: 'error',
          text: i18n.global.t('profile.instructions.modals.error_message'),
        });
      });

      it('hides remove modal after successful removal', async () => {
        profileStore.removeInstruction.mockResolvedValue();

        await removeButton().trigger('click');
        await nextTick();

        expect(wrapper.vm.showRemoveModal).toBe(false);
        expect(wrapper.vm.currentInstruction).toBeNull();
      });

      it('adds empty instruction when no instructions remain after removal', async () => {
        profileStore.removeInstruction.mockResolvedValue();
        profileStore.instructions.current = [];

        await removeButton().trigger('click');
        await nextTick();

        expect(profileStore.addEmptyInstruction).toHaveBeenCalled();
      });

      it('does not add empty instruction when instructions remain after removal', async () => {
        profileStore.removeInstruction.mockResolvedValue();
        profileStore.instructions.current = [
          { id: '2', instruction: 'Second instruction' },
        ];

        await removeButton().trigger('click');
        await nextTick();

        expect(profileStore.addEmptyInstruction).not.toHaveBeenCalled();
      });

      it('shows loading state on remove button during removal', async () => {
        let resolvePromise;
        const promise = new Promise((resolve) => {
          resolvePromise = resolve;
        });
        profileStore.removeInstruction.mockReturnValue(promise);

        console.log('removeButton', removeButton().html());

        const removeButtonClick = removeButton().trigger('click');

        await nextTick();
        expect(removeButton().props('loading')).toBe(true);

        resolvePromise();
        await removeButtonClick;
        await nextTick();

        expect(removeButton().exists()).toBe(false);
      });
    });
  });

  describe('Computed Properties', () => {
    it('loading computed property returns correct value based on profile status', () => {
      expect(wrapper.vm.loading).toBe(false);

      wrapper.vm.profileStore.status = 'loading';
      expect(wrapper.vm.loading).toBe(true);
    });

    it('profile computed property returns profileStore', () => {
      expect(wrapper.vm.profile).toBe(profileStore);
    });

    it('errorRequiredFields computed property returns correct value', () => {
      expect(wrapper.vm.errorRequiredFields).toEqual({
        name: false,
        role: false,
        goal: false,
      });
    });
  });

  describe('Methods', () => {
    describe('handleShowRemoveModal', () => {
      it('sets showRemoveModal to true and currentInstruction to provided index', () => {
        wrapper.vm.handleShowRemoveModal(2);

        expect(wrapper.vm.showRemoveModal).toBe(true);
        expect(wrapper.vm.currentInstruction).toBe(2);
      });
    });

    describe('addEmptyInstruction', () => {
      it('calls profileStore.addEmptyInstruction', () => {
        wrapper.vm.addEmptyInstruction();

        expect(profileStore.addEmptyInstruction).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty instructions array gracefully', async () => {
      profileStore.instructions.current = [];
      await nextTick();

      expect(instructionInputs().length).toBe(0);
      expect(deleteButtons().length).toBe(0);
      expect(addButton().props('disabled')).toBe(false);
    });

    it('handles single instruction correctly', async () => {
      profileStore.instructions.current = [
        { id: '1', instruction: 'Single instruction' },
      ];
      await nextTick();

      expect(instructionInputs().length).toBe(1);
      expect(deleteButtons().length).toBe(1);
    });

    it('handles removal when currentInstruction is null', async () => {
      wrapper.vm.currentInstruction = null;
      profileStore.removeInstruction.mockResolvedValue();

      await wrapper.vm.removeInstruction();

      expect(profileStore.removeInstruction).toHaveBeenCalledWith(null);
    });
  });
});
