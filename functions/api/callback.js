export async function onRequest(context) {
  const { env } = context;
  const { searchParams } = new URL(context.request.url);
  const code = searchParams.get('code');

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'cloudflare-pages-static-cms-oauth',
      accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const result = await response.json();

  if (result.error) {
    return new Response(JSON.stringify(result), { status: 401 });
  }

  return new Response(
    `<html>
      <body>
        <script>
          const res = ${JSON.stringify({
            token: result.access_token,
            provider: 'github',
          })};
          window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify(res),
            window.location.origin
          );
        </script>
      </body>
    </html>`,
    { headers: { 'content-type': 'text/html' } }
  );
}
