// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Page, Text } from 'dx-lego-bricks/dist/cjs'
import { DxBrickSchema, DxBrickStyleProps, WorkProps } from '../../types/work'
import { useEffect } from 'react'

export function transferBrickComponent(componentName: string): any {
  if (componentName === 'Page') {
    return Page
  } else if (componentName === 'Text') {
    return Text
  }

  return null
}

export function filterStyle(style: Partial<DxBrickStyleProps>) {
  const filteredStyle: Partial<DxBrickStyleProps> = {}
  Object.entries(style).forEach(entry => {
    const [ key, value ] = entry

    if (value) {
      filteredStyle[key] = value
    }
  })

  return filteredStyle
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PreviewHint() {
  return (
    <div
      style={{ width: '100%', backgroundColor: 'red', color: 'white', padding: '8px 16px', display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}
      onClick={ () => console.log('别点了，删不掉的') }
    >
      仅供预览，请发布作品后，再正式使用
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function App(props: { workData: WorkProps, type: 'preview' | 'publish' }) {

  const { workData, type = 'preview' } = props
  useEffect(() => {
    setTimeout(() => {
      const scriptDom = document.getElementById('init-state') as HTMLScriptElement | null
      scriptDom && scriptDom.parentNode?.removeChild(scriptDom)
    }, 0)
  }, [])

  const { schemas } = workData
  const pageSchema = schemas?.pages[0]
  if (!pageSchema || !pageSchema.component) {
    return null
  }

  const PageComponent = transferBrickComponent(pageSchema.component)

  return (
    <>
      {
        pageSchema && PageComponent
        &&
        <div style={{ width: '100vw', height: '100vh' }}>
          {
            type === 'preview'
            &&
            <PreviewHint/>
          }
          <PageComponent
            style={ filterStyle(pageSchema.props?.style || {}) }
            custom={{ children: (
              <>
                {
                  pageSchema.props?.custom.children.map((brick: DxBrickSchema) => {
                    const Component = transferBrickComponent(brick.component || '')

                    if (!Component) {
                      return null
                    }

                    return (
                      <Component
                        key={ brick.id }
                        style={ brick.props?.style || {} }
                        custom={ brick.props?.custom }
                      />
                    )
                  })
                }
              </>
            ) }}
          />
        </div>
      }
    </>
  )
}

export default function renderApp(workData: WorkProps, type: 'preview' | 'publish' = 'preview') {
  return (
    <App workData={ workData } type={ type } />
  )
}
