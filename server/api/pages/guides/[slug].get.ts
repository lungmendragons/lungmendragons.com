interface Post {
  // metadata: {
  title: string;
  description: string;
  author: string;
  time: string;
  // };
  content: string;
};

export default eventHandler(async (event) => {
  const { slug } = event.context.params || {};
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing slug." });
  };

  const post = await hubKV().get<Post>(`guides:${slug}`);

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: "Not found." });
  };

  return post;
});
