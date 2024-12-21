export interface CommandList {
  category: string;
  command: {
    name: string;
    description: string;
    aliases: string[];
    usage: string | null;
    isOwnerCommand: boolean;
  };
}
