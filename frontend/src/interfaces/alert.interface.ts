export interface AlertContextType {
    isAlert: boolean;
    typeAlert: string;
    messageAlert: string;
    onAlert: ((isAlert: boolean, typeAlert: string, messageAlert: string) => Promise<void>);
  }
  