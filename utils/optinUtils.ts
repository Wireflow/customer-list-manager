export const getOptinLink = (branchId: string) => {
  const link = `${origin}/consent/${branchId}`;
  return link;
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
