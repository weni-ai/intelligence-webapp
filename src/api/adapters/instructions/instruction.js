export const InstructionAdapter = {
  toApi(data) {
    const { text } = data;
    return {
      instruction: text.trim(),
    };
  },
  fromApi(data) {
    const { instruction, id } = data;
    return {
      text: instruction,
      id,
    };
  },
};
