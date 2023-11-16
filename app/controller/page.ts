import { Controller } from 'egg'
import { renderToString } from 'react-dom/server'
import renderApp from '../client/render'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import checkPermission from '../decorator/checkPermission'
import { WorkProps } from '../types/work'

export default class PageController extends Controller {

  // @checkPermission('Work', { queryKey: 'uuid', ctxArgsOption: { key1: 'params', key2: 'uuid' }, errorTypes: { onUserError: 'workControlWithoutUserInfo' } })
  async preview() {
    const { ctx } = this

    const record: WorkProps = await ctx.service.work.findWork({ uuid: 'ulF-hl' })

    // const record = ctx.record as WorkProps

    const content = renderToString(renderApp(record))
    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body, div, span, applet, object, iframe,
          h1, h2, h3, h4, h5, h6, p, blockquote, pre,
          a, abbr, acronym, address, big, cite, code,
          del, dfn, em, img, ins, kbd, q, s, samp,
          small, strike, strong, sub, sup, tt, var,
          b, u, i, center,
          dl, dt, dd, ol, ul, li,
          fieldset, form, label, legend,
          table, caption, tbody, tfoot, thead, tr, th, td,
          article, aside, canvas, details, embed,
          figure, figcaption, footer, header, hgroup,
          main, menu, nav, output, ruby, section, summary,
          time, mark, audio, video {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font: inherit;
            vertical-align: baseline;
          }
          /* HTML5 display-role reset for older browsers */
          article, aside, details, figcaption, figure,
          footer, header, hgroup, main, menu, nav, section {
            display: block;
          }
          /* HTML5 hidden-attribute fix for newer browsers */
          *[hidden] {
              display: none;
          }
          body {
            line-height: 1;
          }
          menu, ol, ul {
            list-style: none;
          }
          blockquote, q {
            quotes: none;
          }
          blockquote:before, blockquote:after,
          q:before, q:after {
            content: '';
            content: none;
          }
          table {
            border-collapse: collapse;
            border-spacing: 0;
          }
        </style>
        <title>${record.title}</title>
      </head>
      <body>
        <div id="app">${content}</div>
        <script defer src="/static/index.js"></script>
        <script id="init-state">
          window.INITIAL_STATE = {
            workData: ${JSON.stringify(record)}
          }
        </script>
      </body>
    </html>
    `

    ctx.status = 200
    ctx.body = html
  }
}
