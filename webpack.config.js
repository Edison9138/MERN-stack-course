// fix error when building the web app on Render
export const resolve = {
    fallback: { "url": require.resolve("url/") }
};