import {getAssetFromKV} from "@cloudflare/kv-asset-handler"
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
import configApp from "../config/app.json";

const assetManifest = JSON.parse(manifestJSON);
const DEBUG = true

async function handleEvent(request, env, ctx) {
  const pathname = new URL(request.url).pathname
  let use301FixUrl = false;
  let [baseUrl, searchParams] = String(request.url).split('?')
  // if (new RegExp(/([^:])(\/\/+)/g).test(baseUrl)) {
  //   baseUrl = baseUrl.replace(/([^:])(\/\/+)/g, '$1/').toLowerCase();
  //   use301FixUrl = true;
  // }
  // if (new RegExp(/[A-Z]/g).test(baseUrl)) {
  //   baseUrl = baseUrl.toLowerCase();
  //   use301FixUrl = true;
  // }

  if (configApp.i18nStrategy === 'prefix_except_default' && (pathname.startsWith(`/${configApp.defaultLang}/`) || pathname === `/${configApp.defaultLang}`)) {
    // redirect default lang to root path example: /en/ -> /
    baseUrl = baseUrl.replace(`/${configApp.defaultLang}`, '');
    use301FixUrl = true;
  }
  if (!baseUrl.endsWith('/')) {
    // const pathname = new URL(request.url).pathname
    if (pathname.indexOf(".") === -1 && (pathname !== '' || pathname !== '/')) {
      baseUrl += "/";
      use301FixUrl = true;
    }
  }
  if (use301FixUrl) {
    return Response.redirect(baseUrl + (searchParams ? `?${searchParams}` : ``), 301);
  }

  let options = {
    ASSET_NAMESPACE: env.__STATIC_CONTENT,
    ASSET_MANIFEST: assetManifest,
  }

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      }
    } else {
      options.cacheControl = {
        browserTTL: 365 * 60 * 60 * 24,
        edgeTTL: 365 * 60 * 60 * 24,
        bypassCache: false,
      }
    }
    const page = await getAssetFromKV({request, waitUntil: ctx.waitUntil.bind(ctx),}, options);
    const response = new Response(page.body, {status: 200, ...page});
    page.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
    if (response.headers.has('content-type')) {
      response.headers.set("X-Content-Type-Options", "nosniff");
    }
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("X-Frame-Options", "DENY");
    return response;
  } catch (e) {
    if (e.status === 404) {
      try {
        // const pathname = new URL(request.url).pathname
        if (pathname.indexOf(".") !== -1) {
          return new Response(`"${pathname}" not found`, {status: 404})
        }
        let notFoundResponse = await getAssetFromKV({request, waitUntil: ctx.waitUntil.bind(ctx),}, {
          ...options,
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/200.html`, req),
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
        })
        const response = new Response(notFoundResponse.body, {status: 200, ...notFoundResponse})
        notFoundResponse.headers.forEach((value, key) => {
          response.headers.set(key, value);
        });
        if (response.headers.has('content-type')) {
          response.headers.set("X-Content-Type-Options", "nosniff");
        }
        response.headers.set("X-XSS-Protection", "1; mode=block");
        response.headers.set("X-Frame-Options", "DENY");
        return response;
      } catch (e) {
        if (DEBUG) {
          return new Response(e.message || e.toString(), {status: 500})
        }
        return new Response('Internal Error', {status: 500})
      }
    }
    if (DEBUG) {
      return new Response(e.message || e.toString(), {status: 500})
    }
    return new Response('Internal Error', {status: 500})
  }
}

export default {
  async fetch(request, env, ctx) {
    return handleEvent(request, env, ctx).catch(e => {
      if (DEBUG) {
        return new Response(e.message || e.toString(), {status: 500})
      }
      return new Response('Internal Error', {status: 500})
    });
  }
}