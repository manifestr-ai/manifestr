import CldImage from './CldImage'

/** Cloudinary images without URL transforms — toolkit + tool detail pages only. */
export default function ToolkitCldImage(props) {
  return <CldImage {...props} preserveCloudinaryUrl />
}
