import { useEffect, useState } from 'react'

export default function useGetLoadedImage (url?: string): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    // Leave the picture blank first
    setImage(null)
    if (url == null) {
      return
    }

    const $image = document.createElement('img')

    const onLoad = () => setImage($image)
    const onError = () => setImage(null)

    $image.addEventListener('load', onLoad)
    $image.addEventListener('error', onError)
    $image.src = url

    return () => {
      $image.removeEventListener('load', onLoad)
      $image.removeEventListener('error', onError)
    }
  }, [url])

  return image
}
