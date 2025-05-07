// Type definitions for Ethereum provider
interface RequestArguments {
  method: string;
  params?: unknown[];
}

interface EthereumEvent {
  connect: { chainId: string };
  disconnect: Error;
  accountsChanged: string[];
  chainChanged: string;
  message: { type: string; data: unknown };
}

type EventKeys = keyof EthereumEvent;
type EventHandler<K extends EventKeys> = (event: EthereumEvent[K]) => void;

interface Ethereum {
  isMetaMask?: boolean;
  request: (args: RequestArguments) => Promise<unknown>;
  on: <K extends EventKeys>(event: K, handler: EventHandler<K>) => void;
  removeListener: <K extends EventKeys>(
    event: K,
    handler: EventHandler<K>
  ) => void;
}

declare global {
  interface Window {
    ethereum?: Ethereum;
  }
}

export {};