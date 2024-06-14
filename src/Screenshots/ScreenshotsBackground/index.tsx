import React, { memo, ReactElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import useBounds from '../hooks/useBounds'
import useStore from '../hooks/useStore'
import ScreenshotsMagnifier from '../ScreenshotsMagnifier'
import { Point, Position } from '../types'
import getBoundsByPoints from './getBoundsByPoints'
import './index.less'

export default memo(function ScreenshotsBackground (): ReactElement | null {
  const { url, image, width, height } = useStore()
  const [bounds, boundsDispatcher] = useBounds()

  const elRef = useRef<HTMLDivElement>(null)
  const pointRef = useRef<Point | null>(null)
  // Used to determine whether the mouse has moved
  // If the position has not been moved, it will not be updated during mouseup.
  const isMoveRef = useRef<boolean>(false)
  const [position, setPosition] = useState<Position | null>(null)

  const updateBounds = useCallback(
    (p1: Point, p2: Point) => {
      if (!elRef.current) {
        return
      }
      const { x, y } = elRef.current.getBoundingClientRect()

      boundsDispatcher.set(
        getBoundsByPoints(
          {
            x: p1.x - x,
            y: p1.y - y
          },
          {
            x: p2.x - x,
            y: p2.y - y
          },
          width,
          height
        )
      )
    },
    [width, height, boundsDispatcher]
  )

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // e.button left mouse button
      if (pointRef.current || bounds || e.button !== 0) {
        return
      }
      pointRef.current = {
        x: e.clientX,
        y: e.clientY
      }
      isMoveRef.current = false
    },
    [bounds]
  )

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (elRef.current) {
        const rect = elRef.current.getBoundingClientRect()
        if (e.clientX < rect.left || e.clientY < rect.top || e.clientX > rect.right || e.clientY > rect.bottom) {
          setPosition(null)
        } else {
          setPosition({
            x: e.clientX - rect.x,
            y: e.clientY - rect.y
          })
        }
      }

      if (!pointRef.current) {
        return
      }
      updateBounds(pointRef.current, {
        x: e.clientX,
        y: e.clientY
      })
      isMoveRef.current = true
    }

    const onMouseUp = (e: MouseEvent) => {
      if (!pointRef.current) {
        return
      }

      if (isMoveRef.current) {
        updateBounds(pointRef.current, {
          x: e.clientX,
          y: e.clientY
        })
      }
      pointRef.current = null
      isMoveRef.current = false
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [updateBounds])

  useLayoutEffect(() => {
    if (!image || bounds) {
      // Reset location
      setPosition(null)
    }
  }, [image, bounds])

  // The image is not displayed until it is loaded.
  if (!url || !image) {
    return null
  }

  return (
    <div ref={elRef} className='screenshots-background' onMouseDown={onMouseDown}>
      <img className='screenshots-background-image' src={url} />
      <div className='screenshots-background-mask' />
      {position && !bounds && <ScreenshotsMagnifier x={position?.x} y={position?.y} />}
    </div>
  )
})
