declare module "#app" {
  interface PageMeta {
    getEmbedData?: () => Promise<{
      title: string;
      description: string;
      url: string;
      image?: {
        url?: string;
        alt?: string;
        width?: number;
        height?: number;
      }
    }>;
  }
}
export {};
