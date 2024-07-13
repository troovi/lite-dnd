import classNames from 'classnames'
import { useState } from 'react'
import { examples } from './examples'

export const App = () => {
  const [index, setIndex] = useState(0)

  return (
    <div className="flex h-screen flex-col">
      <div className="header px-22 py-22 flex w-full items-center justify-between">
        <div className="flex items-center">
          <div className="hide-on-mobile mr-40 text-xl font-bold">lite-dnd</div>
          <div className="tags flex flex-wrap gap-12">
            {examples.map((page, i) => (
              <div
                key={`tag-${i}`}
                onClick={() => setIndex(i)}
                className={classNames('header-tag', { 'active-tag': i === index })}
              >
                {page.name}
              </div>
            ))}
          </div>
        </div>
        <div className="hide-on-mobile flex items-center gap-14 text-lg">
          <div>
            <a target="_blank" href="https://www.npmjs.com/package/lite-dnd">
              npm
            </a>
          </div>
          <div>
            <a target="_blank" href="https://github.com/troovi/lite-dnd">
              github
            </a>
          </div>
        </div>
      </div>
      <div className="h-full" style={{ background: 'rgb(241, 241, 241)' }}>
        {examples[index].source}
      </div>
    </div>
  )
}
