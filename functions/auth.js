export async function onRequestGet(context) {
  const { GITHUB_CLIENT_ID } = context.env;
  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo,user`,
    },
  });
}
