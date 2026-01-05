export async function onRequest(context) {
  const { env } = context;
  const { searchParams } = new URL(context.request.url);
  const code = searchParams.get('code');

  try {
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
      return new Response(`GitHub Error: ${result.error_description || result.error}`, { status: 500 });
    }

    return new Response(
      `<!DOCTYPE html>
      <html>
        <body>
          <script>
            (function() {
              const res = ${JSON.stringify({
                token: result.access_token,
                provider: 'github',
              })};
              
              // This is the message Decap CMS is listening for
              const message = "authorization:github:success:" + JSON.stringify(res);
              
              // Send it to the opener (the main window)
              window.opener.postMessage(message, window.location.origin);
              
              // Fallback: Try sending it without the origin check if the first one fails
              window.opener.postMessage(message, "*");
              
              console.log("Message sent to opener");
              setTimeout(() => { window.close(); }, 1000);
            })();
          </script>
          <p>Login successful! Sending data to main window...</p>
        </body>
      </html>`,
      { headers: { 'content-type': 'text/html' } }
    );
  } catch (err) {
    return new Response(`Server Error: ${err.message}`, { status: 500 });
  }
}
