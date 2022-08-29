import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useRef } from "react";

const CropBox: React.FC = ({ image, setCroppedImage }: any) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const onCrop = (e: any) => {
    e.preventDefault()
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    const croppedImage = cropper.getCroppedCanvas().toDataURL();
    // console.log(croppedImage)
    // setCroppedImage()
  };

  return (
    <Cropper
      src={image[0]?.dataURL}
      style={{ height: '705px', width: 'full' }}
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