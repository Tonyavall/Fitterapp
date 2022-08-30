import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useRef } from "react";

const CropBox: React.FC = ({ image, setCroppedImageBlob, setCroppedImageDataUrl }: any) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  
  const onCrop = (e: any) => {
    e.preventDefault()
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    // grabbing the blob to upload to s3
    const croppedImageDataUrl = cropper.getCroppedCanvas().toDataURL()
    setCroppedImageDataUrl(croppedImageDataUrl)
    cropper.getCroppedCanvas().toBlob((blob: any, type='image/png') => {
      setCroppedImageBlob(blob)
    })
  };

  return (
    <Cropper
      src={image[0]?.dataURL}
      data-image={image}
      style={{ height: '705px', width: 'full', zIndex:'100'}}
      aspectRatio={5 / 4}
      guides={false}
      crop={onCrop}
      dragMode="move"
      ref={cropperRef}
      background={false}
      cropBoxMovable={false}
      cropBoxResizable={false}
      responsive={true}
      autoCropArea={1}
      viewMode={3}
    />
  );
};

export default CropBox