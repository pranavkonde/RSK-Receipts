const TX_HASH_REGEX = /^0x[a-fA-F0-9]{64}$/;

export function assertValidTxHash(input: string): `0x${string}` {
  const trimmed = input.trim();
  const normalized = trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`;
  if (!TX_HASH_REGEX.test(normalized)) {
    throw new Error(
      "Invalid transaction hash: expected 64 hexadecimal characters (optional 0x prefix)."
    );
  }
  return normalized as `0x${string}`;
}
