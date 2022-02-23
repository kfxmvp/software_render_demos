
export async function loadImage(path: string): Promise<ImageData> {
    return new Promise<ImageData>((resolve, reject) => {
        try {
            let image = new Image();
            image.crossOrigin = '*';
            image.onload = () => {
                const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
                const ctx = canvas.getContext('2d');
                const { width, height } = canvas;
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0, image.width, image.height);
                const imageData = ctx.getImageData(0, 0, image.width, image.height);
                image = undefined;
                canvas.width = width;
                canvas.height = height;
                resolve(imageData)
            }

            image.src = path;
        }
        catch (e) { reject(e) }
    })
}