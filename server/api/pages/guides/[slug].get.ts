interface Post {
  // metadata: {
  title: string;
  description: string;
  author: string;
  time: string;
  // };
  content: string;
};

export default cachedEventHandler(async (event) => {
  const { slug } = event.context.params || {};
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing slug." });
  };

  const post = await useKV().get<Post>(`guides:${slug}`);

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: "Not found." });
  };

  return post;
}, {
  maxAge: 3600, // 1 hour
  getKey: event => event.path,
});
