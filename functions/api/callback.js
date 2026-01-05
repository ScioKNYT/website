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
              
              const message = "authorization:github:success:" + JSON.stringify(res);
              
              // 1. Check if we have an opener
              if (window.opener) {
                // 2. Send the message
                window.opener.postMessage(message, "*");
                console.log("Message sent to opener");
                
                // 3. Give it a tiny bit of time then close
                setTimeout(() => { window.close(); }, 1000);
              } else {
                // 4. If opener is null, we are in trouble. Display the token for manual copy if needed.
                document.body.innerHTML = "Error: Cannot find main window. Please try closing this and clicking login again.";
              }
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
