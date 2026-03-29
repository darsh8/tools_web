export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const assetPath = url.pathname === '/' ? '/index.html' : url.pathname;
    
    const asset = await env.ASSETS.fetch(new Request(`https://assets${assetPath}`));    
    if (asset.status === 200) {
      return asset;
    }
    return new Response('Page not found', { status: 404 });
  },
};
