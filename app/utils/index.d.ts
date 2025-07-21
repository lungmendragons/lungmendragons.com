declare module "#app" {
  interface PageMeta {
    getEmbedData?: () => Promise<{
      title: string;
      description: string;
      url: string;
      image?: string;
      imageAlt?: string;
    }>;
  }
}
export {};
