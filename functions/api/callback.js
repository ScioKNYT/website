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
                site_id: 'website-29s.pages.dev'
              })};
              
              // Standard message
              const message = "authorization:github:success:" + JSON.stringify(res);
              
              if (window.opener) {
                // Method 1: Standard Decap Handshake
                window.opener.postMessage(message, "*");
                
                // Method 2: Manual storage injection (The "Force" method)
                try {
                  window.opener.localStorage.setItem('decap-cms-user', JSON.stringify(res));
                } catch (e) {
                  console.error("Local storage failed", e);
                }

                console.log("Handshake sent.");
                setTimeout(() => { window.close(); }, 1000);
              } else {
                document.body.innerHTML = "Main window not found. Please refresh the admin page and try again.";
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
