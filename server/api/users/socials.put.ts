export default eventHandler({
  onRequest: [requirePermission(AuthPermission.User)],
  handler: async (event) => {
    const socials = await readBody(event);

    await serverAuth().api.updateUser({
      headers: event.headers,
      body: {
        youtube: socials.youtube,
        bilibili: socials.bilibili,
        discord: socials.discord,
        bluesky: socials.bluesky,
        twitter: socials.twitter,
        reddit: socials.reddit,
        flair: socials.flair,
      },
    });
  }
});
