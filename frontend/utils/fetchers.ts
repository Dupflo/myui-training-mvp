import { Metadata } from "next"
import { unstable_cache } from "next/cache"
import { SearchParams } from "next/dist/server/request/search-params"
import { notFound } from "next/navigation"

export function getStrapiURL(path = '') {
  return `${process.env.API_URL}${path || ''}`
}

export async function fetchApi(url: string | URL | Request, options?: RequestInit): Promise<Response | any> {
  const res = await fetch(url, options)

  const isContentTypeJson = res.headers.get('content-type')?.includes('application/json')
  const responseData = isContentTypeJson ? await res.json() : res
  if (!res.ok) {
    return Promise.reject(responseData)
  }
  return Promise.resolve({ data: responseData, status: res.status })
}

export async function fetchCMS({
  path,
  body,
  draft = false,
  method = 'GET',
  tags,
  cache,
}: {
  path: string
  body?: any
  draft?: boolean
  method?: string
  tags?: NextFetchRequestConfig['tags']
  cache?: RequestCache
}) {
  const url = new URL(getStrapiURL(`/${path}`))

  const params = new URLSearchParams(url.search)
  if (draft) {
    params.set('status', 'draft')
  }

  const requestUrl = `${url.origin}${url.pathname}?${decodeURIComponent(params.toString())}`

  const configHeaders: HeadersInit = {
    Authorization: `Bearer ${process.env.API_TOKEN}`,
    'Content-Type': 'application/json',
  }

  const options = {
    method,
    headers: configHeaders,
    body: body ? JSON.stringify(body) : undefined
  }

  if (process.env.NODE_ENV !== 'production') {
    const { data } = await fetchApi(requestUrl, options)
    return Array.isArray(data.data) ? data.data : data.data?.attributes || data
  }

  return unstable_cache(async (initOptions) => {
    const { data } = await fetchApi(requestUrl, initOptions)
    return Array.isArray(data.data) ? data.data : data.data?.attributes || data
  },
    tags,
    { tags }
  )(options)
}

export async function getPageData(params: Promise<{ slug: string[] }> | string, searchParams: SearchParams, draft: boolean) {
  let data
  let pathname
  let type

  if (params === 'homepage') {
    pathname = 'home'
  }
  else {
    const { slug } = await (params as Promise<{ slug: string[] }>)
    pathname = slug.join('/')
  }

  try {
    data = await fetchCMS({ path: `pages/${pathname}`, draft, tags: [pathname, 'pages'] })
    type = 'page'
  } catch (error) {
    try {
      data = await fetchCMS({ path: `posts/${pathname}`, draft, tags: [pathname, 'posts'] })
      type = 'post'
    }
    catch (error) {
      notFound()
    }
  }

  return { pathname, data, type, meta: await getMetadata(data) } as { pathname: string, data: any, type: 'post' | 'page', meta: Metadata }
}

async function getMetadata(data: any) {
  const configuration = await fetchCMS({ path: 'configuration', tags: ['configuration'] })

  return {
    title: data.seo?.metaTitle || data.title,
    description: data.seo?.metaDescription,
    openGraph: {
      title: data.seo?.openGraph?.ogTitle || data.seo?.metaTitle || data.title,
      description: data.seo?.openGraph?.['og:description'] || data.seo?.metaDescription,
      images: data.seo?.openGraph?.ogImage ? [data.seo?.openGraph?.ogImage?.url] : [data.seo?.metaImage?.url],
    },
    alternates: {
      canonical: data.seo?.canonicalURL || `${process.env.APP_URL}/${data.slug}`,
    },
    icons: {
      icon: [
        { url: configuration.favicon.url, type: 'image/svg' },
      ]
    },
    robots: data.seo?.metaRobots || 'index, follow',
    keywords: data.seo?.keywords,
    viewport: data.seo?.metaViewport
  } as Metadata
}
